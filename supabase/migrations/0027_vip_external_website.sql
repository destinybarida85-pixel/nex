-- Lets a VIP tenant point Primue at a website they already own instead of
-- using Primue's own white-label site builder.
alter table tenants add column if not exists external_website_url text;
