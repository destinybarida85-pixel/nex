-- Origin's own subscription billing (tenants paying Origin, not the payment-links
-- feature where tenants get paid by their own clients).
-- Run this once in the Supabase SQL editor, after 0002_stripe.sql.

alter table tenants add column if not exists stripe_customer_id text;
alter table tenants add column if not exists subscription_id text;
alter table tenants add column if not exists plan text not null default 'none' check (plan in ('none', 'starter', 'growth'));
alter table tenants add column if not exists subscription_status text not null default 'none';
