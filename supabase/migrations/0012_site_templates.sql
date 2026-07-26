-- Add two more real site templates: a minimal white "Portfolio" style, and a
-- "Landing" style built purely to get the client to pay.
-- Run this once in the Supabase SQL editor, after 0011_chat.sql.

alter table tenants drop constraint if exists tenants_site_template_check;
alter table tenants add constraint tenants_site_template_check
  check (site_template in ('clarity', 'ledger', 'atrium', 'portfolio', 'landing'));
