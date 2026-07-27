-- Per-document payment links: each document can optionally carry its own
-- attached payment link, distinct from the single site-wide payment link on
-- tenants.site_payment_link_id.
-- Run this once in the Supabase SQL editor, after 0013_custom_domain_api_keys_receipts.sql.

alter table documents add column if not exists payment_link_id uuid references payment_links(id) on delete set null;
