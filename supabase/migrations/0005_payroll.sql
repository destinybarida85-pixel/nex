-- Real employee directory + payroll runs
-- Run this once in the Supabase SQL editor, after 0004_crm.sql.

create table if not exists employees (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  name text not null,
  role text not null,
  department text not null default 'General',
  location text,
  status text not null default 'Active' check (status in ('Active', 'On leave', 'Onboarding')),
  gross_cents bigint not null default 0,
  deduction_cents bigint not null default 0,
  start_date date not null default current_date,
  created_at timestamptz not null default now()
);

create table if not exists payroll_runs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  period text not null,
  employee_count integer not null,
  total_cents bigint not null,
  created_at timestamptz not null default now()
);

alter table employees enable row level security;
alter table payroll_runs enable row level security;

create policy "employees: tenant scoped" on employees
  for all using (tenant_id = auth_tenant_id());

create policy "payroll_runs: tenant scoped" on payroll_runs
  for all using (tenant_id = auth_tenant_id());
