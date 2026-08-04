-- Multiple businesses under one login.
-- Run this once in the Supabase SQL editor, after 0019_copilot_history.sql.
--
-- profiles.tenant_id is a single column, so an account could only ever belong
-- to one business. Rather than rip that out — every RLS policy in this schema
-- is written against auth_tenant_id(), which reads it — this keeps
-- profiles.tenant_id exactly as it is and redefines what it MEANS: it is now
-- the *currently active* business, a pointer, not the only one you have.
--
-- memberships records which businesses an account is actually allowed to point
-- at. Switching business = repointing profiles.tenant_id at another row you
-- have a membership for. The upshot is that not one existing policy, helper or
-- API route has to change: everything downstream still scopes to "your tenant",
-- it's just that which tenant that is can now change.
create table if not exists memberships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  tenant_id uuid not null references tenants(id) on delete cascade,
  role text not null default 'owner' check (role in ('owner', 'admin', 'member')),
  created_at timestamptz not null default now(),
  unique (user_id, tenant_id)
);

alter table memberships enable row level security;

-- Deliberately scoped to the row's own user_id rather than auth_tenant_id():
-- this table is what decides which tenants you may switch to, so scoping it by
-- your *current* tenant would make the other memberships invisible and the
-- switcher useless.
drop policy if exists "memberships: own rows" on memberships;
create policy "memberships: own rows" on memberships
  for all using (user_id = auth.uid());

-- Backfill: everyone who already has a profile keeps exactly what they have
-- today, now recorded as a real membership.
insert into memberships (user_id, tenant_id, role)
select p.id, p.tenant_id, p.role
from profiles p
where p.tenant_id is not null
on conflict (user_id, tenant_id) do nothing;

-- New signups get a membership alongside their tenant and profile, so the
-- switcher is correct from the very first login rather than only after the
-- backfill above. This replaces the same-named function from 0001_init.sql;
-- everything before the memberships insert is unchanged from that version.
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  new_tenant_id uuid;
begin
  insert into public.tenants (name, owner_id)
  values (coalesce(new.raw_user_meta_data->>'business_name', 'My Business'), new.id)
  returning id into new_tenant_id;

  insert into public.profiles (id, tenant_id, full_name, role)
  values (new.id, new_tenant_id, new.raw_user_meta_data->>'full_name', 'owner');

  insert into public.memberships (user_id, tenant_id, role)
  values (new.id, new_tenant_id, 'owner');

  insert into public.wallet_accounts (tenant_id, label, account_number, routing_number, balance_cents)
  values (new_tenant_id, 'Primary',
          lpad((random() * 1000000000)::bigint::text, 10, '0'),
          lpad((random() * 100000000)::bigint::text, 9, '0'),
          0);

  insert into public.crypto_wallets (tenant_id, asset, address)
  values
    (new_tenant_id, 'BTC', 'bc1q' || substr(md5(random()::text || clock_timestamp()::text), 1, 38)),
    (new_tenant_id, 'ETH', '0x' || substr(md5(random()::text || clock_timestamp()::text), 1, 40));

  return new;
end;
$$;

select
  (select count(*) from information_schema.tables where table_name = 'memberships') as has_memberships_table,
  (select count(*) from memberships) as backfilled_rows;
