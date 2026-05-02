create extension if not exists "pgcrypto";

create type case_status as enum (
  'pending',
  'active',
  'urgent',
  'found_safe',
  'archived',
  'rejected',
  'duplicate',
  'needs_more_info'
);

create type sighting_status as enum (
  'new',
  'reviewing',
  'credible',
  'false_lead',
  'forwarded',
  'archived'
);

create type admin_role as enum ('super_admin', 'moderator', 'editor');

create table if not exists public.cases (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  full_name text not null,
  nickname text,
  age integer check (age >= 0 and age <= 120),
  gender text not null,
  height text,
  photo_url text,
  province text not null,
  municipality text not null,
  location_last_seen text not null,
  date_last_seen date not null,
  time_last_seen time,
  clothing_description text,
  physical_traits text,
  circumstances text,
  contact_name text,
  contact_phone text,
  whatsapp text,
  email text,
  police_report boolean default false,
  urgency_level text default 'standard',
  status case_status not null default 'pending',
  verified boolean default false,
  internal_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tips (
  id uuid primary key default gen_random_uuid(),
  case_id uuid references public.cases(id) on delete cascade,
  message text not null,
  sender_name text,
  sender_phone text,
  whatsapp text,
  media_url text,
  reviewed boolean default false,
  created_at timestamptz not null default now()
);

create table if not exists public.sightings (
  id uuid primary key default gen_random_uuid(),
  case_id uuid references public.cases(id) on delete cascade,
  location_text text not null,
  province text not null,
  date_seen date not null,
  time_seen time,
  description text not null,
  image_url text,
  video_url text,
  external_link text,
  maps_link text,
  sender_name text,
  sender_phone text,
  whatsapp text,
  email text,
  anonymous boolean default false,
  priority text default 'medium',
  status sighting_status not null default 'new',
  created_at timestamptz not null default now()
);

create table if not exists public.admins (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  role admin_role not null default 'editor',
  created_at timestamptz not null default now()
);

create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid references public.admins(id),
  action_type text not null,
  case_id uuid references public.cases(id),
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.resources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  phone text,
  website text,
  category text
);

create index if not exists cases_status_idx on public.cases(status);
create index if not exists cases_province_idx on public.cases(province);
create index if not exists tips_case_id_idx on public.tips(case_id);
create index if not exists sightings_case_id_idx on public.sightings(case_id);

alter table public.cases enable row level security;
alter table public.tips enable row level security;
alter table public.sightings enable row level security;
alter table public.admins enable row level security;
alter table public.activity_logs enable row level security;
alter table public.resources enable row level security;

create or replace function public.current_admin_role()
returns admin_role
language sql
security definer
set search_path = public
as $$
  select role from public.admins where id = auth.uid()
$$;

create policy "Public can read approved cases"
on public.cases for select
using (status in ('active', 'urgent', 'found_safe') and verified = true);

create policy "Public can submit pending cases"
on public.cases for insert
with check (status = 'pending' and verified = false);

create policy "Admins can manage cases"
on public.cases for all
using (public.current_admin_role() in ('super_admin', 'moderator', 'editor'))
with check (public.current_admin_role() in ('super_admin', 'moderator', 'editor'));

create policy "Public can submit tips"
on public.tips for insert
with check (true);

create policy "Only admins can read tips"
on public.tips for select
using (public.current_admin_role() in ('super_admin', 'moderator'));

create policy "Public can submit sightings"
on public.sightings for insert
with check (status = 'new');

create policy "Only admins can read sightings"
on public.sightings for select
using (public.current_admin_role() in ('super_admin', 'moderator'));

create policy "Super admins manage admins"
on public.admins for all
using (public.current_admin_role() = 'super_admin')
with check (public.current_admin_role() = 'super_admin');

create policy "Admins read activity logs"
on public.activity_logs for select
using (public.current_admin_role() in ('super_admin', 'moderator', 'editor'));

create policy "Admins insert activity logs"
on public.activity_logs for insert
with check (public.current_admin_role() in ('super_admin', 'moderator', 'editor'));

create policy "Public reads resources"
on public.resources for select
using (true);

create policy "Editors manage resources"
on public.resources for all
using (public.current_admin_role() in ('super_admin', 'editor'))
with check (public.current_admin_role() in ('super_admin', 'editor'));

insert into public.resources (title, description, phone, website, category) values
('Sistema Nacional de Atencion a Emergencias', 'Emergencias y asistencia inmediata.', '911', 'https://911.gob.do', 'Emergencia'),
('Policia Nacional', 'Reporte formal y seguimiento institucional.', '809-682-2151', 'https://policianacional.gob.do', 'Autoridad'),
('Linea Vida', 'Apoyo emocional y orientacion en crisis.', '*462', 'https://msp.gob.do', 'Apoyo')
on conflict do nothing;
