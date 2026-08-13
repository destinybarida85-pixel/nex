-- VIP: a done-for-you tier. The tenant sends a request (text or a voice note
-- transcribed in-browser); Primue AI drafts a concrete response — but it
-- lands in the tenant's own queue for them to review and send, never
-- auto-dispatched. See vip_requests.status.

alter table tenants drop constraint if exists tenants_plan_check;
alter table tenants add constraint tenants_plan_check check (plan in ('none', 'starter', 'growth', 'vip'));

create table if not exists vip_requests (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  created_by uuid references auth.users(id) on delete set null,
  input_text text not null,
  input_source text not null default 'text' check (input_source in ('text', 'voice')),
  ai_draft jsonb,
  status text not null default 'drafting' check (status in ('drafting', 'ready', 'approved', 'dismissed', 'error')),
  created_at timestamptz not null default now()
);

alter table vip_requests enable row level security;

create policy "vip_requests: tenant scoped" on vip_requests
  for all using (tenant_id = auth_tenant_id());
