-- Portfolio Briefcase — run once in Supabase → SQL Editor.
-- Creates the metadata table and a PRIVATE storage bucket. The site talks to both with the
-- service-role key from server routes only; the anon key is never used, and RLS is enabled
-- with no policies, so nothing is readable from the browser directly.

create extension if not exists pgcrypto;

create table if not exists public.briefcase_items (
  id            uuid primary key default gen_random_uuid(),
  title         text        not null default '',
  category      text        not null default '',
  contribution  text        not null default '',
  result        text        not null default '',
  label         text        not null default 'Anonymised work sample'
                check (label in ('Anonymised work sample', 'Demo using synthetic data', 'Illustrative process')),
  case_id       text,
  status        text        not null default 'draft'
                check (status in ('draft', 'published', 'archived')),
  uploaded      boolean     not null default false,
  sort          integer     not null default 0,
  file_path     text        not null,
  file_name     text        not null,
  file_kind     text        not null check (file_kind in ('image', 'pdf', 'spreadsheet', 'document', 'video')),
  file_size     bigint      not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists briefcase_items_status_sort on public.briefcase_items (status, sort);

alter table public.briefcase_items enable row level security;
-- (no policies on purpose: only the service role, used by the server routes, can read or write)

-- Private bucket, 50 MB per file, only the accepted types.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'briefcase', 'briefcase', false, 52428800,
  array[
    'image/png','image/jpeg','image/webp','image/gif',
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','text/csv',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'video/mp4','video/webm','video/quicktime'
  ]
)
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
