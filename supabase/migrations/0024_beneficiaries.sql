-- Real, persisted wallet beneficiaries — replaces a UI that looked like it
-- saved payees but only held them in React state (gone on refresh).
create table if not exists beneficiaries (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  name text not null,
  bank text not null,
  account_number text not null,
  country text not null default 'US',
  created_at timestamptz not null default now()
);

alter table beneficiaries enable row level security;

create policy "beneficiaries: tenant scoped" on beneficiaries
  for all using (tenant_id = auth_tenant_id());
