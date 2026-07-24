-- A real, persisted white-label mini site (not just a query-string preview).
-- Run this once in the Supabase SQL editor, after 0009_crm_notes.sql.

alter table tenants add column if not exists site_slug text unique;
alter table tenants add column if not exists site_published boolean not null default false;
alter table tenants add column if not exists site_template text not null default 'clarity' check (site_template in ('clarity', 'ledger', 'atrium'));
alter table tenants add column if not exists header_image_url text;
alter table tenants add column if not exists site_document_ids uuid[] not null default '{}';
alter table tenants add column if not exists site_payment_link_id uuid references payment_links(id) on delete set null;
