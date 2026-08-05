-- tenants was missing an INSERT policy entirely.
-- Run this once in the Supabase SQL editor, after 0021_crypto_top5.sql.
--
-- 0001_init.sql only ever gave tenants "read own" and "update own" — creating
-- one was assumed to only ever happen inside handle_new_user()'s own
-- SECURITY DEFINER trigger, which bypasses RLS. That held until 0020 added a
-- real "create another business" action reachable from a normal session,
-- which hits this table directly and was rejected outright: "new row
-- violates row-level security policy for table tenants". Found by actually
-- running the flow end-to-end, not by re-reading the policy list.
--
-- The API route (POST /api/memberships) now does this write on the admin
-- client rather than depend on this policy, since a second identical gap on
-- wallet_accounts — its policy checks tenant_id = auth_tenant_id(), which
-- still points at the OLD tenant until after this whole sequence finishes —
-- needed the same fix either way. This policy is added regardless, so
-- tenants isn't quietly missing basic coverage for any future caller that
-- isn't that one route.
drop policy if exists "tenants: insert own" on tenants;
create policy "tenants: insert own" on tenants
  for insert with check (owner_id = auth.uid());

select
  (select count(*) from pg_policies where tablename = 'tenants' and policyname = 'tenants: insert own') as has_insert_policy;
