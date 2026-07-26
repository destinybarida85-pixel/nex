-- Custom domain field, developer API keys, and real receipts.
-- Run this once in the Supabase SQL editor, after 0012_site_templates.sql.

alter table tenants add column if not exists custom_domain text unique;

create table if not exists api_keys (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  name text not null,
  key_hash text not null,
  key_prefix text not null,
  last_used_at timestamptz,
  created_at timestamptz not null default now(),
  revoked_at timestamptz
);

alter table api_keys enable row level security;

create policy "api_keys: tenant scoped" on api_keys
  for all using (tenant_id = auth_tenant_id());

create table if not exists receipts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  kind text not null check (kind in ('payment', 'payout')),
  amount_cents bigint not null,
  currency text not null default 'usd',
  counterparty text,
  reference text,
  created_at timestamptz not null default now()
);

alter table receipts enable row level security;

create policy "receipts: tenant scoped" on receipts
  for select using (tenant_id = auth_tenant_id());
-- Receipts are inserted only via the server (service role), never directly by clients.
