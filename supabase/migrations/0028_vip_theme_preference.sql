-- Per-user light/dark preference for the VIP console. Lives on profiles
-- (not tenants) since it's a personal display preference, not a brand
-- setting shared by the whole tenant.
alter table profiles add column if not exists theme_preference text not null default 'dark' check (theme_preference in ('dark', 'light'));
