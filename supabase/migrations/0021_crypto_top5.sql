-- Top-5 crypto assets instead of just BTC/ETH.
-- Run this once in the Supabase SQL editor, after 0020_multi_business.sql.
--
-- The original CHECK pinned this to exactly ('BTC', 'ETH'), so adding an asset
-- meant a migration every time. Dropped rather than widened for the same
-- reason as certificates_design_check in 0017: the app owns the catalogue of
-- assets it supports, and the database doesn't need a second, permanently
-- out-of-date copy of that list.
alter table crypto_wallets drop constraint if exists crypto_wallets_asset_check;

-- Backfill the three new assets for every tenant that only has BTC/ETH, so
-- existing accounts see the same five as a fresh signup rather than needing to
-- re-register. Addresses follow each chain's real surface format (see
-- generateCryptoAddress.ts) — these are still internal-ledger placeholders,
-- not custodial addresses; nothing here can receive real funds.
insert into crypto_wallets (tenant_id, asset, address)
select t.id, v.asset, v.prefix || substr(md5(random()::text || clock_timestamp()::text || t.id::text), 1, v.len)
from tenants t
cross join (values
  ('USDT', '0x', 40),
  ('BNB',  'bnb', 39),
  ('SOL',  '',   32)
) as v(asset, prefix, len)
where not exists (
  select 1 from crypto_wallets w where w.tenant_id = t.id and w.asset = v.asset
);

select
  (select count(*) from information_schema.constraint_column_usage
     where table_name = 'crypto_wallets' and constraint_name = 'crypto_wallets_asset_check') as constraint_still_there,
  (select count(distinct asset) from crypto_wallets) as distinct_assets;
