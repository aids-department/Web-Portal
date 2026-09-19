// ============================================================
// One-off migration: MongoDB + Cloudinary  ->  Supabase Postgres + Storage
//
// Run from backend/migration:
//   npm install
//   npm run migrate:dry-run   # validates Mongo collection names + counts, writes nothing
//   npm run migrate           # the real thing
//
// Requires Node 18+ (uses global fetch) and this repo's ../.env to still
// contain MONGODB_URI + CLOUDINARY_* alongside the new SUPABASE_* vars.
//
// Safe to re-run: every row gets a deterministic id derived from its
// Mongo ObjectId (see objectIdToUuid), and every write is an upsert on
// that id, so a failed run can just be re-run from the top.
// ============================================================

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const bcrypt = require('bcrypt');
const { createClient } = require('@supabase/supabase-js');

const DRY_RUN = process.argv.includes('--dry-run');

const MONGODB_URI = process.env.MONGODB_URI;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI missing from ../.env — needed to read the source data.');
  process.exit(1);
}
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY missing from ../.env.');
  process.exit(1);
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ============================================================
// ID mapping: Mongo ObjectId (24 hex chars) -> deterministic UUID.
// Padding to 32 hex digits and re-splitting into UUID groups means every
// reference to the same source document always maps to the same target
// id, so foreign keys stay correct without a separate lookup table.
// ============================================================
function objectIdToUuid(id) {
  if (!id) return null;
  const hex = id.toString().padStart(32, '0');
  if (!/^[0-9a-f]{32}$/i.test(hex)) return null;
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
}

const OBJECT_ID_RE = /^[0-9a-fA-F]{24}$/;
function remapIfObjectId(value) {
  if (typeof value === 'string' && OBJECT_ID_RE.test(value)) return objectIdToUuid(value);
  return value ?? null;
}

// achievements.reviewedBy / any legacy value that might already be a bcrypt
// hash (pre-bug Admin/User rows) vs. a plaintext password (post-bug rows,
// see server.js comment history) — hash only the plaintext ones so nobody
// gets locked out and nobody's real hash gets re-hashed into garbage.
const BCRYPT_RE = /^\$2[aby]\$\d{2}\$.{53}$/;
async function toPasswordHash(raw) {
  if (!raw) return null;
  if (BCRYPT_RE.test(raw)) return raw;
  return bcrypt.hash(raw, 10);
}

function guessExt(url) {
  const match = /\.(jpg|jpeg|png|gif|webp|pdf)(\?|$)/i.exec(url || '');
  return match ? `.${match[1].toLowerCase()}` : null;
}

// ============================================================
// Collection discovery — Mongoose's implicit pluralization is easy to get
// wrong from outside a running app, so we ask the live database what
// collections actually exist instead of guessing.
// ============================================================
async function resolveCollection(db, candidates) {
  const names = (await db.listCollections().toArray()).map((c) => c.name);
  for (const candidate of candidates) {
    const match = names.find((n) => n.toLowerCase() === candidate.toLowerCase());
    if (match) return db.collection(match);
  }
  console.warn(`  ⚠ none of [${candidates.join(', ')}] found. Available collections: ${names.join(', ')}`);
  return null;
}

// ============================================================
// Asset migration: download from Cloudinary, re-upload to Supabase
// Storage at a deterministic path (so re-running overwrites in place
// instead of piling up duplicates).
// ============================================================
async function migrateAsset(url, bucket, objectPath) {
  if (!url || DRY_RUN) return { url: null, path: null };

  try {
    const resp = await fetch(url);
    if (!resp.ok) {
      console.warn(`    ⚠ download failed (${resp.status}): ${url}`);
      return { url: null, path: null };
    }
    const buffer = Buffer.from(await resp.arrayBuffer());
    const contentType = resp.headers.get('content-type') || undefined;

    const { error } = await supabase.storage.from(bucket).upload(objectPath, buffer, {
      upsert: true,
      contentType,
    });
    if (error) {
      console.warn(`    ⚠ upload failed for ${objectPath}: ${error.message}`);
      return { url: null, path: null };
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(objectPath);
    return { url: data.publicUrl, path: objectPath };
  } catch (err) {
    console.warn(`    ⚠ asset migration error for ${url}: ${err.message}`);
    return { url: null, path: null };
  }
}

// ============================================================
// Batched upserts
// ============================================================
async function upsertAll(table, rows, conflictCols = 'id', chunkSize = 500) {
  if (DRY_RUN) {
    console.log(`  [dry-run] would upsert ${rows.length} row(s) into ${table}`);
    return;
  }
  if (rows.length === 0) {
    console.log(`  ✓ ${table}: 0 rows`);
    return;
  }
  for (let i = 0; i < rows.length; i += chunkSize) {
    const chunk = rows.slice(i, i + chunkSize);
    const { error } = await supabase.from(table).upsert(chunk, { onConflict: conflictCols });
    if (error) throw new Error(`upsert into ${table} failed: ${error.message}`);
  }
  console.log(`  ✓ ${table}: ${rows.length} row(s)`);
}

// event_type-specific fields that fold into the `details` jsonb column —
// mirrors lib/serializers.js's EVENT_CORE_FIELDS in the main backend.
const EVENT_META_FIELDS = new Set([
  '_id', '__v', 'eventName', 'eventType', 'startDate', 'endDate', 'venue', 'eventMode',
  'organizer', 'poster', 'posterPublicId', 'thumbnailUrl', 'description', 'registrationLink',
  'contact', 'eligibility', 'maxParticipants', 'fees', 'deadlines', 'startTime', 'endTime',
  'createdAt', 'updatedAt',
]);

async function main() {
  console.log(DRY_RUN ? '🔎 DRY RUN — no writes will be made\n' : '🚀 Running migration\n');

  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;
  console.log('✓ Connected to MongoDB\n');

  // ---------------------------------------------------------
  // 1. USERS
  // ---------------------------------------------------------
  console.log('→ users');
  const usersCol = await resolveCollection(db, ['users']);
  const usersDocs = usersCol ? await usersCol.find({}).toArray() : [];
  const userRows = [];
  for (const u of usersDocs) {
    if (!u.username || !u.email) {
      console.warn(`  ⚠ skipping user ${u._id}: missing username/email`);
      continue;
    }
    userRows.push({
      id: objectIdToUuid(u._id),
      full_name: u.fullName || '',
      username: String(u.username).toLowerCase(),
      email: String(u.email).toLowerCase(),
      password_hash: await toPasswordHash(u.password),
      year: String(u.year ?? '1'),
      role: u.role || 'user',
      created_at: u.createdAt || new Date(),
      updated_at: u.updatedAt || new Date(),
    });
  }
  await upsertAll('users', userRows);

  // ---------------------------------------------------------
  // 2. ADMINS
  // ---------------------------------------------------------
  console.log('→ admins');
  const adminsCol = await resolveCollection(db, ['admins']);
  const adminDocs = adminsCol ? await adminsCol.find({}).toArray() : [];
  const adminRows = [];
  for (const a of adminDocs) {
    adminRows.push({
      id: objectIdToUuid(a._id),
      username: a.username,
      password_hash: await toPasswordHash(a.password),
      role: a.role || 'admin',
      created_at: a.createdAt || new Date(),
    });
  }
  // Conflict on username, not id: a seed admin (e.g. from init-admin.js)
  // may already exist in Supabase under a different, randomly-generated
  // id. Matching on the unique username lets the migration take over
  // that row instead of colliding with it.
  await upsertAll('admins', adminRows, 'username');

  // ---------------------------------------------------------
  // 3. ALUMNI (directory entries)
  // ---------------------------------------------------------
  console.log('→ alumni');
  const alumniCol = await resolveCollection(db, ['alumni', 'alumnis']);
  const alumniDocs = alumniCol ? await alumniCol.find({}).toArray() : [];
  await upsertAll(
    'alumni',
    alumniDocs.map((a) => ({
      id: objectIdToUuid(a._id),
      name: a.name,
      email: a.email,
      phone: a.phone || null,
      pass_out_year: a.passOutYear,
      company: a.company || '',
      role: a.role || null,
      skills: a.skills || [],
      linkedin_url: a.linkedinUrl || null,
      bio: a.bio || null,
      achievements: a.achievements || [],
      image_url: a.imageUrl || null,
      is_verified: !!a.isVerified,
      created_at: a.createdAt || new Date(),
      updated_at: a.updatedAt || new Date(),
    }))
  );

  // ---------------------------------------------------------
  // 4. ALUMNI THOUGHTS
  // ---------------------------------------------------------
  console.log('→ alumni_thoughts');
  const thoughtsCol = await resolveCollection(db, ['alumnithoughts']);
  const thoughtDocs = thoughtsCol ? await thoughtsCol.find({}).toArray() : [];
  const thoughtRows = [];
  for (const t of thoughtDocs) {
    if (!t.authorId) { console.warn(`  ⚠ skipping thought ${t._id}: missing authorId`); continue; }
    thoughtRows.push({
      id: objectIdToUuid(t._id),
      text: t.text,
      author_name: t.authorName,
      author_id: objectIdToUuid(t.authorId),
      created_at: t.createdAt || new Date(),
      updated_at: t.updatedAt || new Date(),
    });
  }
  await upsertAll('alumni_thoughts', thoughtRows);

  // ---------------------------------------------------------
  // 5. EVENTS (+ poster -> Storage)
  // ---------------------------------------------------------
  console.log('→ events');
  const eventsCol = await resolveCollection(db, ['events']);
  const eventDocs = eventsCol ? await eventsCol.find({}).toArray() : [];
  const eventRows = [];
  let ei = 0;
  for (const e of eventDocs) {
    const id = objectIdToUuid(e._id);
    let posterUrl = null;
    let posterPath = null;
    if (e.poster) {
      const ext = guessExt(e.poster) || '.jpg';
      const uploaded = await migrateAsset(e.poster, 'event-posters', `events/${id}${ext}`);
      posterUrl = uploaded.url;
      posterPath = uploaded.path;
    }

    const details = {};
    for (const [k, v] of Object.entries(e)) {
      if (!EVENT_META_FIELDS.has(k) && v !== undefined && v !== null) details[k] = v;
    }

    eventRows.push({
      id,
      event_name: e.eventName,
      event_type: e.eventType,
      start_date: e.startDate,
      end_date: e.endDate,
      venue: e.venue || null,
      event_mode: e.eventMode || null,
      organizer: e.organizer || null,
      poster_url: posterUrl,
      poster_path: posterPath,
      thumbnail_url: e.thumbnailUrl || null,
      description: e.description || null,
      registration_link: e.registrationLink || null,
      contact: e.contact || null,
      eligibility: e.eligibility || null,
      max_participants: e.maxParticipants || null,
      fees: e.fees || null,
      deadlines: e.deadlines || null,
      start_time: e.startTime || null,
      end_time: e.endTime || null,
      details,
      created_at: e.createdAt || new Date(),
      updated_at: e.updatedAt || new Date(),
    });

    if (++ei % 20 === 0) console.log(`    ...${ei}/${eventDocs.length} events processed`);
  }
  await upsertAll('events', eventRows);

  // ---------------------------------------------------------
  // 6. LEADERBOARD ROWS
  // ---------------------------------------------------------
  console.log('→ leaderboard_rows');
  const lbCol = await resolveCollection(db, ['leaderboardrows']);
  const lbDocs = lbCol ? await lbCol.find({}).toArray() : [];
  await upsertAll(
    'leaderboard_rows',
    lbDocs.map((r) => ({
      id: objectIdToUuid(r._id),
      category: r.category,
      name: r.name,
      roll: r.roll,
      year: r.year ?? null,
      score: r.score ?? null,
      time: r.time ?? null,
      created_at: r.createdAt || new Date(),
      updated_at: r.updatedAt || new Date(),
    }))
  );

  // ---------------------------------------------------------
  // 7. POSTS (+ images -> Storage) and post_upvotes
  // ---------------------------------------------------------
  console.log('→ posts');
  const postsCol = await resolveCollection(db, ['posts']);
  const postDocs = postsCol ? await postsCol.find({}).toArray() : [];
  const postRows = [];
  const postUpvoteRows = [];
  let pi = 0;
  for (const p of postDocs) {
    if (!p.author) { console.warn(`  ⚠ skipping post ${p._id}: missing author`); continue; }
    const id = objectIdToUuid(p._id);

    const images = [];
    if (Array.isArray(p.images)) {
      let idx = 0;
      for (const img of p.images) {
        if (!img?.url) continue;
        const ext = guessExt(img.url) || '.jpg';
        const uploaded = await migrateAsset(img.url, 'post-images', `posts/${id}/${idx}${ext}`);
        if (uploaded.url) images.push({ url: uploaded.url, path: uploaded.path });
        idx++;
      }
    }

    for (const uid of p.upvotes || []) {
      postUpvoteRows.push({ post_id: id, user_id: objectIdToUuid(uid) });
    }

    postRows.push({
      id,
      title: p.title,
      content: p.content,
      author_id: objectIdToUuid(p.author),
      is_anonymous: !!p.isAnonymous,
      images,
      upvotes_count: (p.upvotes || []).length,
      is_deleted: !!p.isDeleted,
      deleted_at: p.deletedAt || null,
      deleted_by: p.deletedBy ? objectIdToUuid(p.deletedBy) : null,
      is_edited: !!p.isEdited,
      edited_at: p.editedAt || null,
      created_at: p.createdAt || new Date(),
      updated_at: p.updatedAt || new Date(),
    });

    if (++pi % 20 === 0) console.log(`    ...${pi}/${postDocs.length} posts processed`);
  }
  await upsertAll('posts', postRows);

  // ---------------------------------------------------------
  // 8. COMMENTS
  // ---------------------------------------------------------
  console.log('→ comments');
  const commentsCol = await resolveCollection(db, ['comments']);
  const commentDocs = commentsCol ? await commentsCol.find({}).toArray() : [];
  const commentRows = [];
  const commentUpvoteRows = [];
  for (const c of commentDocs) {
    if (!c.author || !c.parentPost) { console.warn(`  ⚠ skipping comment ${c._id}: missing author/parentPost`); continue; }
    const id = objectIdToUuid(c._id);
    for (const uid of c.upvotes || []) commentUpvoteRows.push({ comment_id: id, user_id: objectIdToUuid(uid) });

    commentRows.push({
      id,
      content: c.content,
      author_id: objectIdToUuid(c.author),
      parent_post_id: objectIdToUuid(c.parentPost),
      is_anonymous: !!c.isAnonymous,
      upvotes_count: (c.upvotes || []).length,
      is_deleted: !!c.isDeleted,
      deleted_at: c.deletedAt || null,
      deleted_by: c.deletedBy ? objectIdToUuid(c.deletedBy) : null,
      is_edited: !!c.isEdited,
      edited_at: c.editedAt || null,
      created_at: c.createdAt || new Date(),
      updated_at: c.updatedAt || new Date(),
    });
  }
  await upsertAll('comments', commentRows);

  // ---------------------------------------------------------
  // 9. REPLIES
  // ---------------------------------------------------------
  console.log('→ replies');
  const repliesCol = await resolveCollection(db, ['replies']);
  const replyDocs = repliesCol ? await repliesCol.find({}).toArray() : [];
  const replyRows = [];
  const replyUpvoteRows = [];
  for (const r of replyDocs) {
    if (!r.author || !r.parentComment || !r.parentPost) {
      console.warn(`  ⚠ skipping reply ${r._id}: missing author/parentComment/parentPost`);
      continue;
    }
    const id = objectIdToUuid(r._id);
    for (const uid of r.upvotes || []) replyUpvoteRows.push({ reply_id: id, user_id: objectIdToUuid(uid) });

    replyRows.push({
      id,
      content: r.content,
      author_id: objectIdToUuid(r.author),
      parent_comment_id: objectIdToUuid(r.parentComment),
      parent_post_id: objectIdToUuid(r.parentPost),
      is_anonymous: !!r.isAnonymous,
      upvotes_count: (r.upvotes || []).length,
      is_deleted: !!r.isDeleted,
      deleted_at: r.deletedAt || null,
      deleted_by: r.deletedBy ? objectIdToUuid(r.deletedBy) : null,
      is_edited: !!r.isEdited,
      edited_at: r.editedAt || null,
      created_at: r.createdAt || new Date(),
      updated_at: r.updatedAt || new Date(),
    });
  }
  await upsertAll('replies', replyRows);

  // ---------------------------------------------------------
  // 10. UPVOTE JOIN TABLES (must run after posts/comments/replies/users)
  // ---------------------------------------------------------
  console.log('→ upvote join tables');
  await upsertAll('post_upvotes', postUpvoteRows, 'post_id,user_id');
  await upsertAll('comment_upvotes', commentUpvoteRows, 'comment_id,user_id');
  await upsertAll('reply_upvotes', replyUpvoteRows, 'reply_id,user_id');

  // ---------------------------------------------------------
  // 11. PROFILES (+ profileImage, resume -> Storage)
  // ---------------------------------------------------------
  console.log('→ profiles');
  const profilesCol = await resolveCollection(db, ['profiles']);
  const profileDocs = profilesCol ? await profilesCol.find({}).toArray() : [];
  const profileRows = [];
  let fi = 0;
  for (const p of profileDocs) {
    if (!p.userId) { console.warn(`  ⚠ skipping profile ${p._id}: missing userId`); continue; }
    const userId = objectIdToUuid(p.userId);

    let profileImageUrl = null, profileImagePath = null;
    if (p.profileImage?.url) {
      const ext = guessExt(p.profileImage.url) || '.jpg';
      const uploaded = await migrateAsset(p.profileImage.url, 'profile-images', `profiles/${userId}${ext}`);
      profileImageUrl = uploaded.url;
      profileImagePath = uploaded.path;
    }

    let resumeUrl = null, resumePath = null;
    if (p.resume?.url) {
      const uploaded = await migrateAsset(p.resume.url, 'resumes', `resumes/${userId}.pdf`);
      resumeUrl = uploaded.url;
      resumePath = uploaded.path;
    }

    profileRows.push({
      id: objectIdToUuid(p._id),
      user_id: userId,
      name: p.name || null,
      year: p.year || null,
      dob: p.dob || null,
      register_number: p.registerNumber || null,
      bio: p.bio || null,
      skills: p.skills || [],
      social_github: p.socialLinks?.github || null,
      social_leetcode: p.socialLinks?.leetcode || null,
      social_linkedin: p.socialLinks?.linkedin || null,
      profile_image_url: profileImageUrl,
      profile_image_path: profileImagePath,
      resume_url: resumeUrl,
      resume_path: resumePath,
      resume_filename: p.resume?.filename || null,
      created_at: p.createdAt || new Date(),
      updated_at: p.updatedAt || new Date(),
    });

    if (++fi % 20 === 0) console.log(`    ...${fi}/${profileDocs.length} profiles processed`);
  }
  await upsertAll('profiles', profileRows);

  // ---------------------------------------------------------
  // 12. QUESTION PAPERS
  // ---------------------------------------------------------
  console.log('→ question_papers');
  const qpCol = await resolveCollection(db, ['questionpapers']);
  const qpDocs = qpCol ? await qpCol.find({}).toArray() : [];
  const qpRows = [];
  let qi = 0;
  for (const q of qpDocs) {
    if (!q.author) { console.warn(`  ⚠ skipping question paper ${q._id}: missing author`); continue; }
    const id = objectIdToUuid(q._id);
    const uploaded = await migrateAsset(q.fileUrl, 'question-papers', `question_papers/${id}.pdf`);

    qpRows.push({
      id,
      semester: q.semester,
      subject_code: q.subjectCode,
      subject_name: q.subjectName,
      exam_type: q.examType,
      file_name: q.fileName,
      file_url: uploaded.url || q.fileUrl,
      file_path: uploaded.path || q.publicId,
      author_id: objectIdToUuid(q.author),
      uploaded_at: q.uploadedAt || new Date(),
    });

    if (++qi % 20 === 0) console.log(`    ...${qi}/${qpDocs.length} question papers processed`);
  }
  await upsertAll('question_papers', qpRows);

  // ---------------------------------------------------------
  // 13. ACHIEVEMENTS
  // ---------------------------------------------------------
  console.log('→ achievements');
  const achCol = await resolveCollection(db, ['achievements']);
  const achDocs = achCol ? await achCol.find({}).toArray() : [];
  const achRows = [];
  let ai = 0;
  for (const a of achDocs) {
    if (!a.userId) { console.warn(`  ⚠ skipping achievement ${a._id}: missing userId`); continue; }
    const id = objectIdToUuid(a._id);

    let certUrl = null, certPath = null;
    if (a.certificate?.url) {
      const uploaded = await migrateAsset(a.certificate.url, 'achievement-certificates', `certificates/${id}.pdf`);
      certUrl = uploaded.url;
      certPath = uploaded.path;
    }

    achRows.push({
      id,
      user_id: objectIdToUuid(a.userId),
      title: a.title,
      description: a.description || null,
      certificate_url: certUrl,
      certificate_path: certPath,
      status: a.status || 'pending',
      reviewed_by: remapIfObjectId(a.reviewedBy),
      reviewed_at: a.reviewedAt || null,
      rejection_reason: a.rejectionReason || null,
      created_at: a.createdAt || new Date(),
      updated_at: a.updatedAt || new Date(),
    });

    if (++ai % 20 === 0) console.log(`    ...${ai}/${achDocs.length} achievements processed`);
  }
  await upsertAll('achievements', achRows);

  // ---------------------------------------------------------
  // 14. RECENT UPDATES
  // ---------------------------------------------------------
  console.log('→ recent_updates');
  const upCol = await resolveCollection(db, ['recentupdates']);
  const upDocs = upCol ? await upCol.find({}).toArray() : [];
  await upsertAll(
    'recent_updates',
    upDocs.map((u) => ({ id: objectIdToUuid(u._id), title: u.title, created_at: u.createdAt || new Date() }))
  );

  // ---------------------------------------------------------
  // 15. STATS
  // ---------------------------------------------------------
  console.log('→ stats');
  const statsCol = await resolveCollection(db, ['stats']);
  const statsDocs = statsCol ? await statsCol.find({}).toArray() : [];
  await upsertAll(
    'stats',
    statsDocs.map((s) => ({ key: s.key, value: s.value })),
    'key'
  );

  console.log(DRY_RUN ? '\n✓ Dry run complete — no data was written.' : '\n✓ Migration complete.');
}

main()
  .catch((err) => {
    console.error('\n❌ Migration failed:', err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
