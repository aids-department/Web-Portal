// Copies rows from `students` into `users` (same id, so the login's id-based
// link keeps working). Idempotent: students already present in `users` (by id
// or email) are skipped. Dry run by default; pass --apply to write.
//
//   node scripts/sync_students_to_users.js           # preview
//   node scripts/sync_students_to_users.js --apply   # write
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env'), quiet: true });
const supabase = require('../config/supabaseClient');
const { computeRoleAndYear } = require('../lib/studentBatches');

const APPLY = process.argv.includes('--apply');
const CHUNK = 100;

async function main() {
  const { data: students, error: sErr } = await supabase
    .from('students').select('*').order('created_at', { ascending: true });
  if (sErr) throw sErr;
  const { data: users, error: uErr } = await supabase
    .from('users').select('id, username, email');
  if (uErr) throw uErr;

  const allBatches = students.map((s) => s.pass_out_year);
  const takenIds = new Set(users.map((u) => u.id));
  const takenEmails = new Set(users.map((u) => u.email.toLowerCase()));
  const takenUsernames = new Set(users.map((u) => u.username.toLowerCase()));

  const toInsert = [];
  const alreadyLinked = [];
  const duplicateEmail = [];

  for (const s of students) {
    const email = s.email.trim().toLowerCase();
    if (takenIds.has(s.id) || takenEmails.has(email)) {
      // A second student row sharing an email with one we're inserting this run.
      (toInsert.some((r) => r.email === email) ? duplicateEmail : alreadyLinked).push(s);
      continue;
    }

    let username = email.split('@')[0] || 'student';
    if (takenUsernames.has(username)) username = `${username}_${s.id.slice(0, 4)}`;
    takenUsernames.add(username);
    takenEmails.add(email);

    const { role, year } = computeRoleAndYear(s.pass_out_year, allBatches);
    toInsert.push({
      id: s.id,
      full_name: s.name,
      username,
      email,
      password_hash: s.password,
      year,
      role,
    });
  }

  const tally = {};
  toInsert.forEach((r) => { const k = `${r.role}/year ${r.year}`; tally[k] = (tally[k] || 0) + 1; });

  console.log(`students: ${students.length}, existing users: ${users.length}`);
  console.log(`already linked (skipped):            ${alreadyLinked.length}`);
  console.log(`duplicate-email rows (skipped):      ${duplicateEmail.length}`);
  duplicateEmail.forEach((s) => console.log(`   - ${s.email} (student id ${s.id}, batch ${s.pass_out_year})`));
  console.log(`to insert into users:                ${toInsert.length}`, tally);

  if (!APPLY) {
    console.log('\nDry run only. Re-run with --apply to write.');
    return;
  }

  for (let i = 0; i < toInsert.length; i += CHUNK) {
    const chunk = toInsert.slice(i, i + CHUNK);
    const { error } = await supabase.from('users').insert(chunk);
    if (error) throw new Error(`users insert failed at row ${i + 1}: ${error.message}`);

    const profiles = chunk.map((u) => ({ user_id: u.id, name: u.full_name, year: u.year }));
    const { error: pErr } = await supabase.from('profiles').upsert(profiles, { onConflict: 'user_id' });
    if (pErr) throw new Error(`profiles upsert failed at row ${i + 1}: ${pErr.message}`);

    console.log(`  inserted ${Math.min(i + CHUNK, toInsert.length)} / ${toInsert.length}`);
  }
  console.log('Done.');
}

main().catch((e) => { console.error(e); process.exit(1); });
