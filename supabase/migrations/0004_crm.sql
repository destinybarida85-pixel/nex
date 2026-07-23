-- Real CRM pipeline (deals)
-- Run this once in the Supabase SQL editor, after 0003_billing.sql.

create table if not exists deals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  company text not null,
  title text not null,
  value_cents bigint not null default 0,
  contact text,
  stage text not null default 'Lead' check (stage in ('Lead', 'Qualified', 'Proposal', 'Negotiation', 'Won')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table deals enable row level security;

create policy "deals: tenant scoped" on deals
  for all using (tenant_id = auth_tenant_id());
