-- Persist the "Powered by Origin" badge toggle alongside the existing
-- tenants.name / domain / brand_color / logo_url columns from 0001_init.sql.
-- Run this once in the Supabase SQL editor, after 0005_payroll.sql.

alter table tenants add column if not exists powered_by_badge boolean not null default false;
