-- Projects, team invites, and notifications.
-- Run this once in the Supabase SQL editor, after 0006_whitelabel.sql.

-- ── Projects ─────────────────────────────────────────────────────────────
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  name text not null,
  client text,
  status text not null default 'Planning' check (status in ('Planning', 'Active', 'Blocked', 'Done')),
  due_date date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table projects enable row level security;

create policy "projects: tenant scoped" on projects
  for all using (tenant_id = auth_tenant_id());

-- ── Team invites ─────────────────────────────────────────────────────────
create table if not exists invites (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  email text not null,
  role text not null default 'member' check (role in ('admin', 'member')),
  invited_by uuid references auth.users(id) on delete set null,
  accepted_at timestamptz,
  created_at timestamptz not null default now()
);

alter table invites enable row level security;

create policy "invites: tenant scoped" on invites
  for all using (tenant_id = auth_tenant_id());

-- New signups join an existing tenant if there's a pending invite matching their
-- email, instead of always getting a brand-new tenant of their own.
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  new_tenant_id uuid;
  pending_invite record;
begin
  select * into pending_invite from public.invites
    where lower(email) = lower(new.email) and accepted_at is null
    order by created_at desc limit 1;

  if pending_invite is not null then
    insert into public.profiles (id, tenant_id, full_name, role)
    values (new.id, pending_invite.tenant_id, coalesce(new.raw_user_meta_data->>'full_name', ''), pending_invite.role);

    update public.invites set accepted_at = now() where id = pending_invite.id;

    return new;
  end if;

  insert into public.tenants (name, owner_id)
  values (coalesce(new.raw_user_meta_data->>'company_name', 'My Business'), new.id)
  returning id into new_tenant_id;

  insert into public.profiles (id, tenant_id, full_name, role)
  values (new.id, new_tenant_id, coalesce(new.raw_user_meta_data->>'full_name', ''), 'owner');

  insert into public.wallet_accounts (tenant_id, label, account_number, routing_number)
  values (new_tenant_id, 'Primary', lpad((floor(random() * 1000000000000))::text, 12, '0'), lpad((100000000 + floor(random() * 900000000))::text, 9, '0'));

  insert into public.crypto_wallets (tenant_id, asset, address)
  values
    (new_tenant_id, 'BTC', 'bc1q' || substr(md5(random()::text || clock_timestamp()::text), 1, 38)),
    (new_tenant_id, 'ETH', '0x' || substr(md5(random()::text || clock_timestamp()::text), 1, 40));

  return new;
end;
$$;

-- ── Notifications ────────────────────────────────────────────────────────
create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  kind text not null check (kind in ('document_signed', 'payment_received', 'invite_accepted')),
  title text not null,
  body text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

alter table notifications enable row level security;

create policy "notifications: tenant scoped" on notifications
  for all using (tenant_id = auth_tenant_id());
