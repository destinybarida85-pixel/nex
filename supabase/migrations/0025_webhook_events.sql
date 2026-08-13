-- Real, per-tenant record of Stripe webhook deliveries that actually did
-- something (subscription changes, credit top-ups, payment-link payments) —
-- replaces a hardcoded fake log that even pointed at the pre-rename domain
-- (api.meridian.app).
create table if not exists webhook_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) on delete cascade,
  event_type text not null,
  status text not null default 'processed',
  detail text,
  created_at timestamptz not null default now()
);

alter table webhook_events enable row level security;

create policy "webhook_events: tenant scoped" on webhook_events
  for select using (tenant_id = auth_tenant_id());
-- Inserted only by the webhook route via the service-role client, so there is
-- intentionally no insert policy for regular users here (same pattern as
-- signatures).
