-- ============================================================
-- Awaneesh Gupta Portfolio — Supabase Schema
-- Run this in the Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- PROJECTS
-- ============================================================
create table if not exists projects (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text not null,
  long_description text,
  tech_stack text[] default '{}',
  github_url text,
  live_url text,
  image_url text,
  featured boolean default false,
  order_index integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- CERTIFICATES
-- ============================================================
create table if not exists certificates (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  issuer text not null,
  issue_date text not null,
  credential_url text,
  image_url text,
  description text,
  created_at timestamptz default now()
);

-- ============================================================
-- GALLERY IMAGES
-- ============================================================
create table if not exists gallery_images (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  caption text,
  category text default 'events',
  image_url text not null,
  order_index integer default 0,
  created_at timestamptz default now()
);

-- ============================================================
-- SKILLS
-- ============================================================
create table if not exists skills (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  category text check (category in ('language','frontend','backend','database','tool','learning')) not null,
  proficiency integer check (proficiency >= 0 and proficiency <= 100) default 70,
  icon text,
  order_index integer default 0
);

-- ============================================================
-- ACHIEVEMENTS
-- ============================================================
create table if not exists achievements (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text not null,
  date text not null,
  category text not null,
  icon text default '🏆',
  created_at timestamptz default now()
);

-- ============================================================
-- RESUMES
-- ============================================================
create table if not exists resumes (
  id uuid default uuid_generate_v4() primary key,
  file_url text not null,
  uploaded_at timestamptz default now(),
  version text not null
);

-- ============================================================
-- CONTACT MESSAGES
-- ============================================================
create table if not exists contact_messages (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  read boolean default false,
  created_at timestamptz default now()
);

-- ============================================================
-- OPEN SOURCE CONTRIBUTIONS
-- ============================================================
create table if not exists open_source_contributions (
  id uuid default uuid_generate_v4() primary key,
  repo_name text not null,
  repo_url text not null,
  description text not null,
  pr_url text,
  pr_title text,
  status text check (status in ('merged','open','closed')) default 'open',
  date text not null,
  org_logo text,
  created_at timestamptz default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Enable RLS on all tables
alter table projects enable row level security;
alter table certificates enable row level security;
alter table gallery_images enable row level security;
alter table skills enable row level security;
alter table achievements enable row level security;
alter table resumes enable row level security;
alter table contact_messages enable row level security;
alter table open_source_contributions enable row level security;

-- Public READ policies (anyone can read portfolio data)
create policy "public read projects" on projects for select using (true);
create policy "public read certificates" on certificates for select using (true);
create policy "public read gallery" on gallery_images for select using (true);
create policy "public read skills" on skills for select using (true);
create policy "public read achievements" on achievements for select using (true);
create policy "public read resumes" on resumes for select using (true);
create policy "public read oss" on open_source_contributions for select using (true);

-- Public INSERT for contact (anyone can send a message)
create policy "public insert contact" on contact_messages for insert with check (true);

-- ADMIN WRITE policies (only the authenticated owner can write)
-- Replace 'kg3327949@gmail.com' with the actual user ID from auth.users after first login
create policy "admin write projects" on projects for all
  using (auth.jwt() ->> 'email' = 'kg3327949@gmail.com')
  with check (auth.jwt() ->> 'email' = 'kg3327949@gmail.com');

create policy "admin write certificates" on certificates for all
  using (auth.jwt() ->> 'email' = 'kg3327949@gmail.com')
  with check (auth.jwt() ->> 'email' = 'kg3327949@gmail.com');

create policy "admin write gallery" on gallery_images for all
  using (auth.jwt() ->> 'email' = 'kg3327949@gmail.com')
  with check (auth.jwt() ->> 'email' = 'kg3327949@gmail.com');

create policy "admin write skills" on skills for all
  using (auth.jwt() ->> 'email' = 'kg3327949@gmail.com')
  with check (auth.jwt() ->> 'email' = 'kg3327949@gmail.com');

create policy "admin write achievements" on achievements for all
  using (auth.jwt() ->> 'email' = 'kg3327949@gmail.com')
  with check (auth.jwt() ->> 'email' = 'kg3327949@gmail.com');

create policy "admin write resumes" on resumes for all
  using (auth.jwt() ->> 'email' = 'kg3327949@gmail.com')
  with check (auth.jwt() ->> 'email' = 'kg3327949@gmail.com');

create policy "admin write contact" on contact_messages for all
  using (auth.jwt() ->> 'email' = 'kg3327949@gmail.com')
  with check (auth.jwt() ->> 'email' = 'kg3327949@gmail.com');

create policy "admin write oss" on open_source_contributions for all
  using (auth.jwt() ->> 'email' = 'kg3327949@gmail.com')
  with check (auth.jwt() ->> 'email' = 'kg3327949@gmail.com');

-- ============================================================
-- STORAGE BUCKETS
-- Create these manually in Supabase Dashboard > Storage:
--   - gallery       (public)
--   - certificates  (public)
--   - projects      (public)
--   - resume        (public)
-- ============================================================

-- Storage policies (run after creating buckets)
-- INSERT: admin only
-- SELECT: public

insert into storage.buckets (id, name, public) values ('gallery', 'gallery', true) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('certificates', 'certificates', true) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('projects', 'projects', true) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('resume', 'resume', true) on conflict do nothing;

create policy "public gallery read" on storage.objects for select using (bucket_id = 'gallery');
create policy "admin gallery upload" on storage.objects for insert with check (bucket_id = 'gallery' and auth.jwt() ->> 'email' = 'kg3327949@gmail.com');
create policy "admin gallery delete" on storage.objects for delete using (bucket_id = 'gallery' and auth.jwt() ->> 'email' = 'kg3327949@gmail.com');

create policy "public certs read" on storage.objects for select using (bucket_id = 'certificates');
create policy "admin certs upload" on storage.objects for insert with check (bucket_id = 'certificates' and auth.jwt() ->> 'email' = 'kg3327949@gmail.com');
create policy "admin certs delete" on storage.objects for delete using (bucket_id = 'certificates' and auth.jwt() ->> 'email' = 'kg3327949@gmail.com');

create policy "public resume read" on storage.objects for select using (bucket_id = 'resume');
create policy "admin resume upload" on storage.objects for insert with check (bucket_id = 'resume' and auth.jwt() ->> 'email' = 'kg3327949@gmail.com');
create policy "admin resume delete" on storage.objects for delete using (bucket_id = 'resume' and auth.jwt() ->> 'email' = 'kg3327949@gmail.com');

create policy "public projects read" on storage.objects for select using (bucket_id = 'projects');
create policy "admin projects upload" on storage.objects for insert with check (bucket_id = 'projects' and auth.jwt() ->> 'email' = 'kg3327949@gmail.com');
create policy "admin projects delete" on storage.objects for delete using (bucket_id = 'projects' and auth.jwt() ->> 'email' = 'kg3327949@gmail.com');
