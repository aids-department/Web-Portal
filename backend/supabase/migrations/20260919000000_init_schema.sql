-- ============================================================
-- Web Portal: MongoDB -> Supabase Postgres initial schema
-- Run via: supabase db push   (or paste into the SQL editor)
-- ============================================================

create extension if not exists pgcrypto;

-- ============================================================
-- USERS
-- ============================================================
create table users (
  id            uuid primary key default gen_random_uuid(),
  full_name     text not null,
  username      text not null unique,
  email         text not null unique,
  password_hash text not null,
  year          text not null check (year in ('1', '2', '3', '4')),
  role          text not null default 'user' check (role in ('user', 'admin', 'alumni')),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ============================================================
-- ADMINS
-- ============================================================
create table admins (
  id            uuid primary key default gen_random_uuid(),
  username      text not null unique,
  password_hash text not null,
  role          text not null default 'admin',
  created_at    timestamptz not null default now()
);

-- ============================================================
-- ALUMNI (directory entries, not the same as users.role = 'alumni')
-- ============================================================
create table alumni (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  email          text not null,
  phone          text,
  pass_out_year  int not null check (pass_out_year >= 2000),
  company        text not null,
  role           text,
  skills         text[] not null default '{}',
  linkedin_url   text,
  bio            text,
  achievements   text[] not null default '{}',
  image_url      text,
  is_verified    boolean not null default false,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index idx_alumni_pass_out_year on alumni (pass_out_year);
create index idx_alumni_is_verified on alumni (is_verified);
create index idx_alumni_skills on alumni using gin (skills);

-- ============================================================
-- ALUMNI THOUGHTS
-- ============================================================
create table alumni_thoughts (
  id          uuid primary key default gen_random_uuid(),
  text        text not null,
  author_name text not null,
  author_id   uuid not null references users(id) on delete cascade,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index idx_alumni_thoughts_created_at on alumni_thoughts (created_at desc);

-- ============================================================
-- EVENTS
-- Type-specific fields (hackathon/workshop/literary/sports/...) live in
-- `details` jsonb since they're mutually exclusive per event and never
-- filtered/sorted on individually.
-- ============================================================
create table events (
  id                  uuid primary key default gen_random_uuid(),
  event_name          text not null,
  event_type          text not null,
  start_date          text not null,
  end_date            text not null,
  start_time          text,
  end_time            text,
  venue               text,
  event_mode          text,
  organizer           text,
  poster_url          text,
  poster_path         text,
  thumbnail_url       text,
  description         text,
  registration_link   text,
  contact             text,
  eligibility         text,
  max_participants    text,
  fees                text,
  deadlines           text,
  details             jsonb not null default '{}'::jsonb,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index idx_events_created_at on events (created_at desc);
create index idx_events_event_type on events (event_type);

-- ============================================================
-- LEADERBOARD
-- ============================================================
create table leaderboard_rows (
  id         uuid primary key default gen_random_uuid(),
  category   text not null,
  name       text not null,
  roll       text not null,
  year       int,
  score      numeric,
  time       numeric,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (category, roll)
);

create index idx_leaderboard_category on leaderboard_rows (category);

-- ============================================================
-- POSTS / COMMENTS / REPLIES
-- upvotes[] arrays become join tables + a denormalized count so
-- both "is this user's upvote toggled" and "sort by popularity" are
-- real indexed queries instead of loading the whole array.
-- ============================================================
create table posts (
  id             uuid primary key default gen_random_uuid(),
  title          text not null,
  content        text not null,
  author_id      uuid not null references users(id),
  is_anonymous   boolean not null default false,
  images         jsonb not null default '[]'::jsonb, -- [{ "url": "...", "path": "..." }]
  upvotes_count  int not null default 0,
  is_deleted     boolean not null default false,
  deleted_at     timestamptz,
  deleted_by     uuid references users(id),
  is_edited      boolean not null default false,
  edited_at      timestamptz,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index idx_posts_feed_new on posts (is_deleted, created_at desc);
create index idx_posts_feed_top on posts (is_deleted, upvotes_count desc, created_at desc);
create index idx_posts_author on posts (author_id, is_deleted, created_at desc);

create table post_upvotes (
  post_id    uuid not null references posts(id) on delete cascade,
  user_id    uuid not null references users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

create table comments (
  id              uuid primary key default gen_random_uuid(),
  content         text not null,
  author_id       uuid not null references users(id),
  parent_post_id  uuid not null references posts(id) on delete cascade,
  is_anonymous    boolean not null default false,
  upvotes_count   int not null default 0,
  is_deleted      boolean not null default false,
  deleted_at      timestamptz,
  deleted_by      uuid references users(id),
  is_edited       boolean not null default false,
  edited_at       timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index idx_comments_parent_post on comments (parent_post_id, is_deleted);
create index idx_comments_author on comments (author_id, is_deleted, created_at desc);

create table comment_upvotes (
  comment_id uuid not null references comments(id) on delete cascade,
  user_id    uuid not null references users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (comment_id, user_id)
);

create table replies (
  id                 uuid primary key default gen_random_uuid(),
  content            text not null,
  author_id          uuid not null references users(id),
  parent_comment_id  uuid not null references comments(id) on delete cascade,
  parent_post_id     uuid not null references posts(id) on delete cascade,
  is_anonymous       boolean not null default false,
  upvotes_count      int not null default 0,
  is_deleted         boolean not null default false,
  deleted_at         timestamptz,
  deleted_by         uuid references users(id),
  is_edited          boolean not null default false,
  edited_at          timestamptz,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create index idx_replies_parent_comment on replies (parent_comment_id, is_deleted);
create index idx_replies_author on replies (author_id, is_deleted, created_at desc);

create table reply_upvotes (
  reply_id   uuid not null references replies(id) on delete cascade,
  user_id    uuid not null references users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (reply_id, user_id)
);

-- ============================================================
-- PROFILES
-- ============================================================
create table profiles (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null unique references users(id) on delete cascade,
  name                text,
  year                text,
  dob                 text,
  register_number     text,
  bio                 text,
  skills              text[] not null default '{}',
  social_github       text,
  social_leetcode     text,
  social_linkedin     text,
  profile_image_url   text,
  profile_image_path  text,
  resume_url          text,
  resume_path         text,
  resume_filename     text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index idx_profiles_name on profiles (name);

-- ============================================================
-- QUESTION PAPERS
-- ============================================================
create table question_papers (
  id            uuid primary key default gen_random_uuid(),
  semester      text not null,
  subject_code  text not null,
  subject_name  text not null,
  exam_type     text not null,
  file_name     text not null,
  file_url      text not null,
  file_path     text not null,
  author_id     uuid not null references users(id),
  uploaded_at   timestamptz not null default now()
);

create index idx_question_papers_subject_name on question_papers (subject_name);
create index idx_question_papers_subject_code on question_papers (subject_code);

-- ============================================================
-- ACHIEVEMENTS
-- reviewed_by stays free text: the current route accepts an
-- unvalidated client-supplied string, not a real admin FK.
-- ============================================================
create table achievements (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null references users(id) on delete cascade,
  title              text not null,
  description        text,
  certificate_url    text,
  certificate_path   text,
  status             text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  reviewed_by        text,
  reviewed_at        timestamptz,
  rejection_reason   text,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create index idx_achievements_user on achievements (user_id);
create index idx_achievements_status on achievements (status);

-- ============================================================
-- MISC (previously inline in server.js)
-- ============================================================
create table recent_updates (
  id         uuid primary key default gen_random_uuid(),
  title      text not null,
  created_at timestamptz not null default now()
);

create table stats (
  key   text primary key,
  value numeric not null default 0
);

insert into stats (key, value) values ('participant_count', 23);

-- ============================================================
-- updated_at auto-touch trigger
-- ============================================================
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

do $$
declare
  t text;
begin
  foreach t in array array[
    'users', 'alumni', 'alumni_thoughts', 'events', 'leaderboard_rows',
    'posts', 'comments', 'replies', 'profiles', 'achievements'
  ]
  loop
    execute format(
      'create trigger trg_set_updated_at before update on %I for each row execute function set_updated_at();',
      t
    );
  end loop;
end $$;

-- ============================================================
-- STORAGE BUCKETS (all public, matching current Cloudinary behavior)
-- ============================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('event-posters', 'event-posters', true, 10485760, array['image/jpeg','image/png','image/gif','image/webp']),
  ('post-images', 'post-images', true, 10485760, array['image/jpeg','image/png','image/gif','image/webp']),
  ('profile-images', 'profile-images', true, 10485760, array['image/jpeg','image/png','image/gif','image/webp']),
  ('resumes', 'resumes', true, 10485760, array['application/pdf']),
  ('question-papers', 'question-papers', true, 10485760, array['application/pdf']),
  ('achievement-certificates', 'achievement-certificates', true, 10485760, array['application/pdf'])
on conflict (id) do nothing;

-- Public read policies (buckets are public, but Storage still requires
-- an explicit SELECT policy for anonymous access to object contents).
do $$
declare
  b text;
begin
  foreach b in array array[
    'event-posters', 'post-images', 'profile-images',
    'resumes', 'question-papers', 'achievement-certificates'
  ]
  loop
    execute format(
      $f$create policy "Public read %1$s" on storage.objects for select using (bucket_id = %1$L);$f$,
      b
    );
  end loop;
end $$;

-- Writes go through the service-role key from the backend only, so no
-- insert/update/delete policies are added for anon/authenticated roles.
