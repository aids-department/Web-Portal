-- ============================================================
-- Create students table
-- ============================================================
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

-- Auto-update updated_at trigger
drop trigger if exists trg_set_updated_at on students;
create trigger trg_set_updated_at
  before update on students
  for each row execute function set_updated_at();
