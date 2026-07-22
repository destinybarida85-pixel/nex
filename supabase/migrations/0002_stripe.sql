-- Stripe Connect + payment links
-- Run this once in the Supabase SQL editor, after 0001_init.sql.

create table if not exists stripe_connect_accounts (
  tenant_id uuid primary key references tenants(id) on delete cascade,
  stripe_account_id text not null unique,
  charges_enabled boolean not null default false,
  payouts_enabled boolean not null default false,
  details_submitted boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists payment_links (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  title text not null,
  amount_cents bigint not null,
  currency text not null default 'usd',
  kind text not null check (kind in ('one_time', 'recurring')),
  interval text check (interval in ('day', 'week', 'month', 'year')),
  stripe_payment_link_id text not null,
  stripe_price_id text not null,
  url text not null,
  uses_count integer not null default 0,
  status text not null default 'active' check (status in ('active', 'archived')),
  created_at timestamptz not null default now()
);

create table if not exists payment_link_events (
  id uuid primary key default gen_random_uuid(),
  payment_link_id uuid not null references payment_links(id) on delete cascade,
  stripe_checkout_session_id text not null unique,
  amount_cents bigint not null,
  customer_email text,
  created_at timestamptz not null default now()
);

create or replace function increment_payment_link_uses(link_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update payment_links set uses_count = uses_count + 1 where id = link_id;
$$;

alter table stripe_connect_accounts enable row level security;
alter table payment_links enable row level security;
alter table payment_link_events enable row level security;

create policy "stripe_connect_accounts: tenant scoped" on stripe_connect_accounts
  for all using (tenant_id = auth_tenant_id());

create policy "payment_links: tenant scoped" on payment_links
  for all using (tenant_id = auth_tenant_id());

create policy "payment_link_events: tenant scoped" on payment_link_events
  for select using (payment_link_id in (select id from payment_links where tenant_id = auth_tenant_id()));
-- Events are inserted only via the webhook (service role), never directly by clients.
