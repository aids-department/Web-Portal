// ============================================================
// Imports the alumni Google Form export (xlsx) + the downloaded photo
// uploads into the Supabase `alumni` table.
//
//   node scripts/import_alumni_from_form.js --dry-run     # preview only
//   node scripts/import_alumni_from_form.js               # write to Supabase
//
// Options:
//   --file <path>     form export   (default: "Untitled form (Responses).xlsx")
//   --photos <dir>    photo folder  (default: photos/)
//   --year <yyyy>     pass_out_year for people not yet in the table (default: 2026)
//
// Existing alumni are matched by email, then by name, and updated in place;
// everyone else is inserted. Placeholder answers ("-", "NA", "Nil", "None",
// "Not a founder", ...) are stored as null, which the UI shows as NA.
// Safe to re-run: photos are uploaded to a fixed path with upsert.
// Requires supabase/migrations/20260928000000_alumni_career_details.sql.
// ============================================================
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const ExcelJS = require('exceljs');
const { createClient } = require('@supabase/supabase-js');

const PHOTO_BUCKET = 'profile-images';
const PHOTO_FOLDER = 'alumni';

// Form question -> field. Matched against the normalized header text, so
// stray spaces / numbering in the Google Form headers don't matter.
const COLUMNS = {
  timestamp: 'timestamp',
  name: 'full name',
  email: 'email address',
  phone: 'phone number',
  currentStatus: 'what are you currently doing',
  role: 'current job title / role',
  company: 'company / organization',
  workLocation: 'work location',
  industry: 'current industry / domain',
  higherStudiesDegree: 'degree / programme',
  higherStudiesUniversity: 'university / institution',
  higherStudiesLocation: 'location',
  higherStudiesSpecialization: 'specialization / area of study',
  startupName: 'startup / company name',
  startupRole: 'your role',
  startupDescription: 'company / startup description',
  startupLocation: 'company location',
};

const PLACEHOLDER = /^(-+|n\/?a|nil+|ni|none|no|nope|nothing|nada|null|not applicable|not a founder)$/i;

// Several people entered their current B.Tech under "higher studies" — that
// isn't higher studies, so those answers are dropped.
const NOT_HIGHER_STUDIES = /^(b\.?\s*tech|b\.?\s*e\b|bachelor)/i;

// Explicit photo assignments for when name matching can't decide:
// { 'someone@gmail.com': 'file name in photos/' }
const PHOTO_OVERRIDES = {};

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 ? process.argv[i + 1] : fallback;
}

function cellText(v) {
  if (v === null || v === undefined) return '';
  if (typeof v === 'object') return String(v.text ?? v.result ?? v.hyperlink ?? '');
  return String(v);
}

function clean(v) {
  const s = cellText(v).replace(/\s+/g, ' ').trim();
  return s && !PLACEHOLDER.test(s) ? s : null;
}

const squash = (s) => (s || '').toLowerCase().replace(/[^a-z]/g, '');
const normHeader = (s) => cellText(s).toLowerCase().replace(/^\s*\d+\.\s*/, '').replace(/[?]/g, '').replace(/\s+/g, ' ').trim();

async function readResponses(file) {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(file);
  const ws = wb.worksheets[0];

  const headers = ws.getRow(1).values.map(normHeader);
  const colIndex = {};
  for (const [field, header] of Object.entries(COLUMNS)) {
    const idx = headers.indexOf(header);
    if (idx === -1) throw new Error(`Column "${header}" not found in ${path.basename(file)}`);
    colIndex[field] = idx;
  }

  const rows = [];
  ws.eachRow((row, n) => {
    if (n === 1) return;
    const r = {};
    for (const [field, idx] of Object.entries(colIndex)) r[field] = clean(row.values[idx]);
    if (!r.name || !r.email) return;
    r.email = r.email.toLowerCase();
    r.phone = r.phone && r.phone.replace(/^\+91/, '');

    if (r.higherStudiesDegree && NOT_HIGHER_STUDIES.test(r.higherStudiesDegree)) {
      r.higherStudiesDegree = r.higherStudiesUniversity = r.higherStudiesLocation = r.higherStudiesSpecialization = null;
    }
    if (!r.higherStudiesDegree && !r.higherStudiesUniversity) {
      r.higherStudiesLocation = r.higherStudiesSpecialization = null;
    }
    if (!r.startupName) r.startupRole = r.startupDescription = r.startupLocation = null;
    rows.push(r);
  });

  // Duplicate submissions: keep the latest one per email.
  const byEmail = new Map();
  for (const r of rows.sort((a, b) => String(a.timestamp).localeCompare(String(b.timestamp)))) byEmail.set(r.email, r);
  return [...byEmail.values()];
}

// Google Forms saves uploads as "<original name> - <uploader name>.<ext>".
function photoOwnerName(file) {
  const base = path.parse(file).name;
  const owner = base.includes(' - ') ? base.slice(base.lastIndexOf(' - ') + 3) : base;
  return owner.replace(/psgitech/gi, '').replace(/\(\d+\)/g, '').trim();
}

function matchPhotos(people, photoDir) {
  const files = fs.existsSync(photoDir) ? fs.readdirSync(photoDir).filter((f) => /\.(jpe?g|png|webp|pdf)$/i.test(f)) : [];
  const result = new Map();
  const unmatched = [];

  for (const [email, file] of Object.entries(PHOTO_OVERRIDES)) result.set(email, file);

  for (const file of files) {
    const owner = photoOwnerName(file);
    const exact = people.filter((p) => squash(p.name) === squash(owner));
    const tokens = owner.toLowerCase().split(/[^a-z]+/).filter((t) => t.length >= 3);
    const fuzzy = tokens.length ? people.filter((p) => tokens.every((t) => squash(p.name).includes(t))) : [];
    const candidates = exact.length ? exact : fuzzy;

    if (candidates.length !== 1) {
      unmatched.push(`${file}  (${candidates.length ? 'ambiguous: ' + candidates.map((p) => p.name).join(', ') : 'no match'})`);
      continue;
    }
    if (!result.has(candidates[0].email)) result.set(candidates[0].email, file);
  }
  return { photos: result, unmatched };
}

// Photo PDFs from the form are just a wrapped JPEG — pull out the largest one.
// Some uploads are truncated mid-image; those get an end marker appended,
// which browsers render fine (at worst a few missing rows at the bottom).
function jpegFromPdf(buf) {
  const EOI = Buffer.from([0xff, 0xd9]);
  let best = null;
  let pos = 0;
  while ((pos = buf.indexOf('stream', pos, 'latin1')) !== -1) {
    const soi = buf.indexOf(Buffer.from([0xff, 0xd8, 0xff]), pos);
    let end = buf.indexOf('endstream', pos + 6, 'latin1');
    pos += 6;
    if (soi === -1 || soi - pos > 4) continue;
    if (end === -1) end = buf.length;
    if (soi > end) continue;
    const eoi = buf.lastIndexOf(EOI, end);
    const jpeg = eoi > soi ? buf.subarray(soi, eoi + 2) : Buffer.concat([buf.subarray(soi, end), EOI]);
    if (!best || jpeg.length > best.length) best = jpeg;
  }
  return best;
}

function loadPhoto(file) {
  const buf = fs.readFileSync(file);
  const ext = path.extname(file).toLowerCase();
  if (ext === '.pdf') {
    const jpeg = jpegFromPdf(buf);
    if (!jpeg) throw new Error(`no embedded JPEG found in ${path.basename(file)}`);
    return { buffer: jpeg, ext: '.jpg', contentType: 'image/jpeg' };
  }
  const contentType = { '.png': 'image/png', '.webp': 'image/webp' }[ext] || 'image/jpeg';
  return { buffer: buf, ext: ext === '.jpeg' ? '.jpg' : ext, contentType };
}

async function uploadPhoto(supabase, email, file) {
  const { buffer, ext, contentType } = loadPhoto(file);
  const objectPath = `${PHOTO_FOLDER}/${email.replace(/[^a-z0-9]+/g, '-')}${ext}`;
  const { error } = await supabase.storage.from(PHOTO_BUCKET).upload(objectPath, buffer, { contentType, upsert: true });
  if (error) throw error;
  const { data } = supabase.storage.from(PHOTO_BUCKET).getPublicUrl(objectPath);
  // Cache-bust so a re-upload shows up immediately.
  return `${data.publicUrl}?v=${Date.now()}`;
}

function toColumns(r) {
  return {
    name: r.name,
    phone: r.phone,
    company: r.company,
    role: r.role,
    current_status: r.currentStatus,
    work_location: r.workLocation,
    industry: r.industry,
    higher_studies_degree: r.higherStudiesDegree,
    higher_studies_university: r.higherStudiesUniversity,
    higher_studies_location: r.higherStudiesLocation,
    higher_studies_specialization: r.higherStudiesSpecialization,
    startup_name: r.startupName,
    startup_role: r.startupRole,
    startup_description: r.startupDescription,
    startup_location: r.startupLocation,
  };
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const backendDir = path.resolve(__dirname, '..');
  const file = path.resolve(backendDir, arg('file', 'Untitled form (Responses).xlsx'));
  const photoDir = path.resolve(backendDir, arg('photos', 'photos'));
  const passOutYear = parseInt(arg('year', '2026'), 10);

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { error: colErr } = await supabase.from('alumni').select('current_status, startup_name').limit(1);
  if (colErr) {
    console.error(`❌ alumni table is missing the new columns (${colErr.message}).`);
    console.error('Run supabase/migrations/20260928000000_alumni_career_details.sql in the Supabase SQL Editor first.');
    if (!dryRun) process.exit(1);
  }

  const people = await readResponses(file);
  const { photos, unmatched } = matchPhotos(people, photoDir);

  const { data: existing, error } = await supabase.from('alumni').select('id, name, email');
  if (error) throw error;
  const byEmail = new Map(existing.map((a) => [a.email.trim().toLowerCase(), a]));
  const byName = new Map(existing.map((a) => [squash(a.name), a]));

  console.log(`${people.length} unique responses, ${photos.size} with photos${dryRun ? '  (DRY RUN — nothing is written)' : ''}\n`);

  let updated = 0, inserted = 0, failed = 0;
  for (const r of people) {
    const match = byEmail.get(r.email) || byName.get(squash(r.name));
    const photo = photos.get(r.email);
    const label = `${match ? 'UPDATE' : 'INSERT'}  ${r.name.padEnd(24)} ${(r.company || '—').padEnd(28)} photo: ${photo || 'none'}`;

    if (dryRun) {
      console.log(label);
      match ? updated++ : inserted++;
      continue;
    }

    try {
      const columns = toColumns(r);
      if (photo) columns.image_url = await uploadPhoto(supabase, r.email, path.join(photoDir, photo));

      const query = match
        ? supabase.from('alumni').update(columns).eq('id', match.id)
        : supabase.from('alumni').insert({ ...columns, email: r.email, pass_out_year: passOutYear, is_verified: true });
      const { error: writeErr } = await query;
      if (writeErr) throw writeErr;

      console.log(`✓ ${label}`);
      match ? updated++ : inserted++;
    } catch (err) {
      console.error(`✗ ${label}\n    ${err.message}`);
      failed++;
    }
  }

  console.log(`\n${dryRun ? 'Would update' : 'Updated'} ${updated}, ${dryRun ? 'would insert' : 'inserted'} ${inserted}${failed ? `, failed ${failed}` : ''}.`);
  if (unmatched.length) console.log(`\nPhotos not assigned (add to PHOTO_OVERRIDES if needed):\n  ${unmatched.join('\n  ')}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
