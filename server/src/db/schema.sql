-- Jalankan di Supabase SQL Editor.
-- Aman di-run ulang (pakai IF NOT EXISTS) kalau tabel members/teams kamu
-- sudah ada dengan nama & kolom lain, sesuaikan dulu nama kolomnya di sini
-- dan di server/src/routes/*.js.

create extension if not exists pgcrypto;

create table if not exists teams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null default 'main' check (type in ('main', 'secondary')),
  created_at timestamptz not null default now()
);

create table if not exists members (
  id uuid primary key default gen_random_uuid(),
  nickname text not null,
  gear integer not null default 0,
  job_id text not null,
  party_id text,              -- format "<teamId>-<index>", null = masih di roster
  created_at timestamptz not null default now()
);

create table if not exists admin_users (
  id uuid primary key default gen_random_uuid(),
  username text unique not null,
  password_hash text not null,
  display_name text,
  created_at timestamptz not null default now()
);

-- RLS: siapa aja boleh baca (buat halaman utama/viewer), tapi TIDAK ADA
-- policy insert/update/delete untuk role anon/authenticated. Jadi satu-satunya
-- cara nulis data adalah lewat server Express (pakai service_role key, yang
-- otomatis bypass RLS). Ini lapisan pengaman kedua di luar cek JWT di API.
alter table teams enable row level security;
alter table members enable row level security;
alter table admin_users enable row level security; -- sengaja gak dikasih policy sama sekali

create policy "Public read teams" on teams for select using (true);
create policy "Public read members" on members for select using (true);
