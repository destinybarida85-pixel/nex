-- Real (polling-based "live") support chat thread per tenant.
-- Run this once in the Supabase SQL editor, after 0010_site.sql.

create table if not exists chat_messages (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  sender text not null check (sender in ('user', 'support')),
  body text not null,
  created_at timestamptz not null default now()
);

alter table chat_messages enable row level security;

create policy "chat_messages: tenant scoped" on chat_messages
  for all using (tenant_id = auth_tenant_id());
