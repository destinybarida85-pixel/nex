import { NextResponse } from "next/server";
import { requirePlatformAdmin } from "@/lib/requirePlatformAdmin";
import { isStripeConfigured, getStripe } from "@/lib/stripe";
import { isBackendConfigured } from "@/lib/backendStatus";
import { isPendingMigration } from "@/lib/schema";

// List-price fallback for MRR when a tenant has a plan but Stripe isn't
// configured (or a specific subscription lookup fails) — kept in sync with
// the monthly (non-annual) prices on the public pricing page. An annual
// subscriber's real monthly contribution is lower than this, which is why a
// live Stripe lookup is tried first for every tenant that has one; this is
// only the fallback for when that isn't possible.
const LIST_PRICE_CENTS: Record<string, number> = { starter: 2500, growth: 3500 };

export async function GET() {
  if (!isBackendConfigured) return NextResponse.json({ configured: false });

  const { error, status, admin } = await requirePlatformAdmin();
  if (error) return NextResponse.json({ error }, { status });

  const TENANT_COLUMNS = "id, name, domain, brand_color, plan, subscription_status, subscription_id, powered_by_badge, suspended, owner_id, created_at";
  const TENANT_COLUMNS_NO_SUSPENDED = "id, name, domain, brand_color, plan, subscription_status, subscription_id, powered_by_badge, owner_id, created_at";

  let tenantsResult = await admin!.from("tenants").select(TENANT_COLUMNS).order("created_at", { ascending: false });
  // suspended (migration 0023) may not exist yet — the rest of this route
  // works fine without it, just without the suspend action actually
  // persisting, so this degrades instead of the whole console going blank.
  if (isPendingMigration(tenantsResult.error)) {
    const fallback = await admin!.from("tenants").select(TENANT_COLUMNS_NO_SUSPENDED).order("created_at", { ascending: false });
    tenantsResult = { ...fallback, data: fallback.data?.map((t) => ({ ...t, suspended: false })) ?? null } as typeof tenantsResult;
  }
  const { data: tenants, error: tenantsError } = tenantsResult;
  if (tenantsError) return NextResponse.json({ error: tenantsError.message }, { status: 500 });

  const { count: profilesTotal } = await admin!.from("profiles").select("id", { count: "exact", head: true });

  const tenantList = tenants ?? [];
  const tenantIds = tenantList.map((t) => t.id);

  const since30d = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  // Fetched once for every tenant rather than per-row (N+1) — wallet_accounts
  // and wallet_transactions are both small tables at real usage, and this
  // keeps the whole page to two extra queries no matter how many tenants
  // there are.
  const [{ data: accounts }, { data: owners }] = await Promise.all([
    admin!.from("wallet_accounts").select("id, tenant_id"),
    tenantIds.length
      ? admin!.auth.admin.listUsers({ perPage: 1000 }).then((r) => ({ data: r.data.users }))
      : Promise.resolve({ data: [] as { id: string; email?: string }[] }),
  ]);

  const accountIds = (accounts ?? []).map((a) => a.id);
  const accountToTenant = new Map((accounts ?? []).map((a) => [a.id, a.tenant_id]));

  const { data: recentTx } = accountIds.length
    ? await admin!
        .from("wallet_transactions")
        .select("account_id, amount_cents, created_at")
        .in("account_id", accountIds)
        .gte("created_at", since30d)
    : { data: [] as { account_id: string; amount_cents: number; created_at: string }[] };

  const volumeByTenant = new Map<string, number>();
  for (const tx of recentTx ?? []) {
    const tenantId = accountToTenant.get(tx.account_id);
    if (!tenantId) continue;
    volumeByTenant.set(tenantId, (volumeByTenant.get(tenantId) ?? 0) + Math.abs(tx.amount_cents));
  }

  const { data: memberships } = tenantIds.length
    ? await admin!.from("memberships").select("tenant_id")
    : { data: [] as { tenant_id: string }[] };
  const usersByTenant = new Map<string, number>();
  for (const m of memberships ?? []) usersByTenant.set(m.tenant_id, (usersByTenant.get(m.tenant_id) ?? 0) + 1);

  // Support "open tickets" — the newest message per tenant thread. A thread
  // is "awaiting reply" when that newest message is from the tenant, not
  // from support. There's no separate ticket/status entity in this schema
  // (chat_messages is a plain running thread), so this reconstructs the
  // equivalent from what's actually there instead of inventing a status
  // field nothing else in the app respects.
  const { data: chatMessages } = tenantIds.length
    ? await admin!.from("chat_messages").select("tenant_id, sender, created_at").order("created_at", { ascending: true })
    : { data: [] as { tenant_id: string; sender: string; created_at: string }[] };
  const lastSenderByTenant = new Map<string, string>();
  for (const m of chatMessages ?? []) lastSenderByTenant.set(m.tenant_id, m.sender);
  const awaitingReply = Array.from(lastSenderByTenant.values()).filter((s) => s === "user").length;

  const ownerEmailById = new Map((owners ?? []).map((u) => [u.id, u.email ?? ""]));

  let mrrCents = 0;
  const stripe = isStripeConfigured ? getStripe() : null;
  const tenantsOut = await Promise.all(
    tenantList.map(async (t) => {
      let tenantMrrCents = 0;
      if (t.subscription_status === "active") {
        if (stripe && t.subscription_id) {
          try {
            const sub = await stripe.subscriptions.retrieve(t.subscription_id);
            const item = sub.items.data[0];
            const amount = item?.price?.unit_amount ?? 0;
            // Normalize to a monthly figure regardless of billing interval,
            // so an annual subscriber contributes their real monthly share
            // to MRR instead of spiking it in whichever month they renew.
            const interval = item?.price?.recurring?.interval;
            tenantMrrCents = interval === "year" ? Math.round(amount / 12) : amount;
          } catch {
            tenantMrrCents = LIST_PRICE_CENTS[t.plan] ?? 0;
          }
        } else {
          tenantMrrCents = LIST_PRICE_CENTS[t.plan] ?? 0;
        }
      }
      mrrCents += tenantMrrCents;

      return {
        id: t.id,
        name: t.name,
        domain: t.domain,
        brandColor: t.brand_color,
        plan: t.plan,
        subscriptionStatus: t.subscription_status,
        poweredByBadge: t.powered_by_badge,
        suspended: t.suspended ?? false,
        createdAt: t.created_at,
        ownerEmail: t.owner_id ? ownerEmailById.get(t.owner_id) ?? null : null,
        users: usersByTenant.get(t.id) ?? 0,
        walletVolume30dCents: volumeByTenant.get(t.id) ?? 0,
        mrrCents: tenantMrrCents,
      };
    })
  );

  const walletVolume30dCents = Array.from(volumeByTenant.values()).reduce((a, b) => a + b, 0);

  return NextResponse.json({
    configured: true,
    kpis: {
      activeTenants: tenantList.length,
      totalUsers: profilesTotal ?? 0,
      mrrCents,
      walletVolume30dCents,
      awaitingReply,
    },
    tenants: tenantsOut,
  });
}
