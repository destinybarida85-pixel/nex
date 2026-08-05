-- Lets the Super Admin console's "Suspend tenant" button actually do
-- something, instead of being another dead button next to the ones just
-- fixed on the marketing site.
-- Run this once in the Supabase SQL editor, after 0022_tenants_insert_policy.sql.
alter table tenants add column if not exists suspended boolean not null default false;

select
  (select count(*) from information_schema.columns
     where table_name = 'tenants' and column_name = 'suspended') as has_suspended_column;
