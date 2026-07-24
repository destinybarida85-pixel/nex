-- Stamp credits: every tenant starts with 3 free digital stamps, then buys more.
-- Run this once in the Supabase SQL editor, after 0007_projects_team_notifications.sql.

alter table tenants add column if not exists stamp_credits integer not null default 3;
alter table signatures add column if not exists stamp_applied boolean not null default false;
