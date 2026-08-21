-- Adds NOWPayments as a second payment-link provider alongside Stripe.
-- payment_links.url stays the generic field every surface already reads
-- (site pages, documents, invoices, VIP) — so nothing downstream needs to
-- know or care which provider a given link uses.

alter table payment_links
  add column if not exists provider text not null default 'stripe' check (provider in ('stripe', 'crypto')),
  add column if not exists nowpayments_invoice_id text,
  alter column stripe_payment_link_id drop not null,
  alter column stripe_price_id drop not null;

alter table payment_link_events
  add column if not exists nowpayments_payment_id text,
  alter column stripe_checkout_session_id drop not null;

alter table payment_link_events
  drop constraint if exists payment_link_events_has_provider_ref;
alter table payment_link_events
  add constraint payment_link_events_has_provider_ref
  check (stripe_checkout_session_id is not null or nowpayments_payment_id is not null);

create unique index if not exists payment_link_events_nowpayments_payment_id_key
  on payment_link_events (nowpayments_payment_id) where nowpayments_payment_id is not null;
