-- Certificate designs and per-certificate styling.
-- Run this once in the Supabase SQL editor, after 0016_certificates.sql.
--
-- 0016 pinned `design` to exactly three values with a CHECK constraint, which
-- means every new template would need its own migration — and a template is a
-- presentation choice, not a schema change. The constraint is dropped rather
-- than widened; the app validates the id against its own catalogue, which is
-- the only place that actually knows which designs exist.
alter table certificates drop constraint if exists certificates_design_check;

-- Everything else about how one certificate looks — font, stamp shape, stamp
-- wording, whether the seal is shown at all — lives in a single jsonb column
-- for the same reason: adding a new style control shouldn't require a
-- migration and a redeploy in lockstep.
alter table certificates add column if not exists style jsonb not null default '{}'::jsonb;

select
  (select count(*) from information_schema.columns
     where table_name = 'certificates' and column_name = 'style') as has_style_column,
  (select count(*) from information_schema.constraint_column_usage
     where table_name = 'certificates' and constraint_name = 'certificates_design_check') as design_check_still_there;
