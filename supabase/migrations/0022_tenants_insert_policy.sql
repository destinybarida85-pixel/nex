-- tenants' RLS policies never accounted for a login having more than one
-- business (see migration 0020).
-- Run this once in the Supabase SQL editor, after 0021_crypto_top5.sql.
--
-- Two real gaps, both only found by actually running the "add a business"
-- flow end-to-end, not by re-reading the policy list:
--
-- 1. No INSERT policy at all. 0001_init.sql only ever gave tenants "read
--    own" and "update own" — creating one was assumed to only ever happen
--    inside handle_new_user()'s own SECURITY DEFINER trigger, which bypasses
--    RLS. The "create another business" endpoint hits this table directly
--    from a normal session and was rejected outright: "new row violates
--    row-level security policy for table tenants".
--
-- 2. "read own" only means the CURRENTLY ACTIVE tenant (id =
--    auth_tenant_id()) — fine everywhere else in the app, which only ever
--    needs to read the one tenant you're in, but wrong for the business
--    switcher, whose whole job is listing every business you're a member of,
--    including the ones you're NOT currently in. Under that policy the
--    switcher's tenants(name) join silently came back null for every
--    inactive business — it showed up in the list with no name and nothing
--    to click.
--
-- The API routes (GET/POST /api/memberships) now run on the admin client
-- rather than depend on either policy, so the feature works immediately
-- without waiting on this migration. Both policies are still added here for
-- the same reason as the INSERT one: so tenants isn't left with a real gap
-- for any future caller that isn't those two routes.
drop policy if exists "tenants: insert own" on tenants;
create policy "tenants: insert own" on tenants
  for insert with check (owner_id = auth.uid());

drop policy if exists "tenants: read own" on tenants;
create policy "tenants: read own" on tenants
  for select using (
    id = auth_tenant_id()
    or exists (select 1 from memberships m where m.tenant_id = tenants.id and m.user_id = auth.uid())
  );

select
  (select count(*) from pg_policies where tablename = 'tenants' and policyname = 'tenants: insert own') as has_insert_policy,
  (select count(*) from pg_policies where tablename = 'tenants' and policyname = 'tenants: read own') as has_read_policy;
