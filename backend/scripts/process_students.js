const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { createClient } = require('@supabase/supabase-js');

const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%&*';

function generateRandomPassword(length = 8) {
  let pwd = '';
  const bytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    pwd += CHARS[bytes[i] % CHARS.length];
  }
  return pwd;
}

function parseCSVLine(line) {
  const regex = /(?:^|,)(?:"([^"]*)"|([^,]*))/g;
  const matches = [];
  let match;
  while ((match = regex.exec(line)) !== null) {
    if (match.index === regex.lastIndex) regex.lastIndex++;
    matches.push(match[1] !== undefined ? match[1] : match[2]);
  }
  return matches;
}

async function main() {
  const dataDir = path.resolve(__dirname, '../data');
  const csvOutputPath = path.join(dataDir, 'students_passwords.csv');

  let students = [];

  if (fs.existsSync(csvOutputPath)) {
    console.log(`Loading existing student records and passwords from: ${csvOutputPath}`);
    const content = fs.readFileSync(csvOutputPath, 'utf8');
    const lines = content.trim().split(/\r?\n/).filter(l => l.trim().length > 0);
    const dataLines = lines.slice(1);
    for (const line of dataLines) {
      const parts = parseCSVLine(line);
      if (parts.length >= 4) {
        students.push({
          name: parts[0].trim(),
          email: parts[1].trim(),
          pass_out_year: parts[2].trim(),
          raw_password: parts[3].trim()
        });
      }
    }
    console.log(`Loaded ${students.length} students from CSV.`);
  } else {
    console.error('students_passwords.csv does not exist. Please run initial generation.');
    process.exit(1);
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  console.log('Checking Supabase connection and students table...');
  const { error: testErr } = await supabase.from('students').select('id').limit(1);

  if (testErr) {
    console.log(`\n❌ Supabase table 'students' does not exist yet: ${testErr.message}`);
    console.log('\n=== ACTION REQUIRED ===');
    console.log('Open your Supabase Dashboard SQL Editor for project `zympmztrkzpqexqmqdfy` and run:');
    console.log(`--------------------------------------------------------------------------------
create table if not exists students (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  pass_out_year text not null,
  password text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_students_email on students (email);
create index if not exists idx_students_pass_out_year on students (pass_out_year);
--------------------------------------------------------------------------------`);
    console.log('\nAfter running the SQL above, run:');
    console.log('  node scripts/process_students.js');
    return;
  }

  // Check if students already inserted
  const { count: existingCount } = await supabase.from('students').select('*', { count: 'exact', head: true });
  if (existingCount && existingCount > 0) {
    console.log(`Notice: 'students' table already contains ${existingCount} records.`);
    console.log('If you want to re-seed, truncate the table first.');
    return;
  }

  console.log(`Hashing ${students.length} passwords and inserting into Supabase...`);
  const batchSize = 25;
  for (let i = 0; i < students.length; i += batchSize) {
    const batch = students.slice(i, i + batchSize);
    const hashedBatch = [];

    for (const s of batch) {
      const password_hash = await bcrypt.hash(s.raw_password, 10);
      hashedBatch.push({
        name: s.name,
        email: s.email,
        pass_out_year: s.pass_out_year,
        password: password_hash
      });
    }

    const { error: insertErr } = await supabase.from('students').insert(hashedBatch);
    if (insertErr) {
      console.error(`Error inserting batch starting at row ${i + 1}:`, insertErr.message);
      return;
    }
    console.log(`  Inserted rows ${i + 1} - ${Math.min(i + batchSize, students.length)} of ${students.length}...`);
  }

  console.log('✓ Successfully inserted all students into Supabase!');
}

main().catch(console.error);
