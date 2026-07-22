-- Origin core schema
-- Run this once in the Supabase SQL editor (or via `supabase db push` if using the CLI).

create extension if not exists "pgcrypto";

-- ── Tenants (white-label organizations) ────────────────────────────────────
create table if not exists tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  domain text,
  brand_color text default '#9184d9',
  logo_url text,
  owner_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

-- ── Profiles (extends Supabase auth.users) ─────────────────────────────────
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  tenant_id uuid references tenants(id) on delete set null,
  full_name text,
  avatar_url text,
  role text not null default 'member' check (role in ('owner', 'admin', 'member')),
  created_at timestamptz not null default now()
);

-- ── Wallet accounts (virtual bank accounts) ────────────────────────────────
create table if not exists wallet_accounts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  label text not null default 'Primary',
  account_number text not null,
  routing_number text not null,
  balance_cents bigint not null default 0,
  currency text not null default 'USD',
  created_at timestamptz not null default now()
);

create table if not exists wallet_transactions (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references wallet_accounts(id) on delete cascade,
  direction text not null check (direction in ('credit', 'debit')),
  counterparty text not null,
  amount_cents bigint not null,
  status text not null default 'completed',
  memo text,
  created_at timestamptz not null default now()
);

-- ── Crypto ledger (internal bookkeeping only — not a real custodial wallet) ─
create table if not exists crypto_wallets (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  asset text not null check (asset in ('BTC', 'ETH')),
  address text not null,
  balance numeric(24, 8) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists crypto_transactions (
  id uuid primary key default gen_random_uuid(),
  wallet_id uuid not null references crypto_wallets(id) on delete cascade,
  direction text not null check (direction in ('credit', 'debit')),
  amount numeric(24, 8) not null,
  counterparty_address text,
  tx_hash text not null,
  created_at timestamptz not null default now()
);

-- ── Documents ────────────────────────────────────────────────────────────
create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  -- Nullable: a document sent out for signature may be signed by someone with
  -- no Origin account of their own (the standard e-sign pattern). Only the
  -- sender needs a tenant; the signer doesn't.
  tenant_id uuid references tenants(id) on delete cascade,
  created_by uuid references auth.users(id) on delete set null,
  title text not null,
  kind text not null default 'general',
  content jsonb not null default '{}'::jsonb,
  status text not null default 'draft' check (status in ('draft', 'sent', 'signed', 'void')),
  content_hash text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── Signatures (tamper-evident hash chain) ─────────────────────────────────
-- Each row's `record_hash` is sha256(document_hash || signer info || signature_hash ||
-- previous_hash || signed_at), computed server-side. Any edit to an earlier row
-- breaks every record_hash after it, which is what makes the chain tamper-evident.
create table if not exists signatures (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references documents(id) on delete cascade,
  signer_name text not null,
  signer_email text not null,
  signature_hash text not null,
  document_hash text not null,
  previous_hash text,
  record_hash text not null,
  ip_address text,
  user_agent text,
  signed_at timestamptz not null default now()
);

-- ── Row Level Security ──────────────────────────────────────────────────────
alter table tenants enable row level security;
alter table profiles enable row level security;
alter table wallet_accounts enable row level security;
alter table wallet_transactions enable row level security;
alter table crypto_wallets enable row level security;
alter table crypto_transactions enable row level security;
alter table documents enable row level security;
alter table signatures enable row level security;

-- Helper: the caller's tenant_id, looked up from their profile row.
create or replace function auth_tenant_id()
returns uuid
language sql
security definer
stable
set search_path = public
as $$
  select tenant_id from public.profiles where id = auth.uid();
$$;

create policy "profiles: read own" on profiles
  for select using (id = auth.uid());
create policy "profiles: update own" on profiles
  for update using (id = auth.uid());

create policy "tenants: read own" on tenants
  for select using (id = auth_tenant_id());
create policy "tenants: update own" on tenants
  for update using (id = auth_tenant_id());

create policy "wallet_accounts: tenant scoped" on wallet_accounts
  for all using (tenant_id = auth_tenant_id());

create policy "wallet_transactions: tenant scoped" on wallet_transactions
  for all using (account_id in (select id from wallet_accounts where tenant_id = auth_tenant_id()));

create policy "crypto_wallets: tenant scoped" on crypto_wallets
  for all using (tenant_id = auth_tenant_id());

create policy "crypto_transactions: tenant scoped" on crypto_transactions
  for all using (wallet_id in (select id from crypto_wallets where tenant_id = auth_tenant_id()));

create policy "documents: tenant scoped" on documents
  for all using (tenant_id = auth_tenant_id());

create policy "signatures: tenant scoped" on signatures
  for select using (document_id in (select id from documents where tenant_id = auth_tenant_id()));
-- Signatures are inserted only via the server (service role), never directly by clients,
-- so there is intentionally no insert policy for regular users here.

-- ── New-user bootstrap ──────────────────────────────────────────────────────
-- When someone signs up, give them their own tenant and a profile row automatically.
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

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
