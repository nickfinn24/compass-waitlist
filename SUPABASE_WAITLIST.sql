-- Run this in Supabase SQL Editor to create the waitlist table
create table if not exists waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  role text not null default 'Student' check (role in ('Student', 'Professor', 'Mentor')),
  school text,
  referral text,
  created_at timestamptz not null default now()
);

create index if not exists waitlist_email_idx on waitlist (email);

-- Enable RLS (optional) – if you enable RLS, you must add policies:
-- 1. Allow anon INSERT for signups: create policy "allow_anon_insert" on waitlist for insert to anon with check (true);
-- 2. For admin reads, use SUPABASE_SERVICE_ROLE_KEY in .env (bypasses RLS)
