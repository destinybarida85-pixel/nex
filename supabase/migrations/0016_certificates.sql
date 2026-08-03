-- AI-generated premium certificates, credit-billed separately from stamp credits.
-- Run this once in the Supabase SQL editor, after 0015_two_party_signing.sql.
--
-- A certificate is a real record with its own id (not just a rendered image),
-- because a certificate that can't be verified by anyone who holds a copy of
-- it isn't a certificate — it's a picture. /certificate/[id] is the public,
-- unauthenticated verification page, same pattern as /sign/[id] and
-- /invoice/[id].

alter table tenants add column if not exists certificate_credits integer not null default 2;

create table if not exists certificates (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  created_by uuid references auth.users(id) on delete set null,
  design text not null default 'ribbon' check (design in ('ribbon', 'ornate', 'regal')),
  recipient_name text not null,
  title text not null,
  citation text not null,
  issuer_name text,
  issued_at timestamptz not null default now(),
  accent_color text,
  created_at timestamptz not null default now()
);

alter table certificates enable row level security;

create policy "certificates: tenant scoped" on certificates
  for all using (tenant_id = auth_tenant_id());
