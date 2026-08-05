import { NextResponse } from "next/server";
import { requireTenant } from "@/lib/requireTenant";
import { createAdminClient } from "@/lib/supabase/admin";
import { isBackendConfigured } from "@/lib/backendStatus";
import { isPendingMigration } from "@/lib/schema";

// Lists every business this login can switch into (see migration 0020),
// plus which one is active right now — active isn't a membership property,
// it's just whichever tenant profiles.tenant_id currently points at.
//
// Reads on the admin client for the same reason POST writes on it: tenants'
// only SELECT policy is "id = auth_tenant_id()" — the CURRENTLY ACTIVE
// tenant only. That's fine for every other place in the app, which only
// ever needs to read the one tenant you're in, but this endpoint's whole job
// is listing every business you're NOT currently in too — under the
// session client, the tenants(name) join silently comes back null for all
// of those (RLS filters per-row inside the join, not just the top-level
// query), which surfaced as a business showing up in the switcher with no
// name and no way to click it. requireTenant() already confirms who's
// asking; the membership row itself, not client input, decides what they
// can see.
export async function GET() {
  if (!isBackendConfigured) return NextResponse.json({ configured: false });

  const { error, status, tenantId, userId } = await requireTenant();
  if (error) return NextResponse.json({ configured: true, error }, { status });

  const admin = createAdminClient();
  const { data: memberships, error: listError } = await admin
    .from("memberships")
    .select("tenant_id, role, tenants(name)")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (isPendingMigration(listError)) {
    // Pre-0020: behave as a single business, same as before this feature existed.
    return NextResponse.json({ configured: true, businesses: [], activeTenantId: tenantId });
  }
  if (listError) return NextResponse.json({ error: listError.message }, { status: 500 });

  const businesses = (memberships ?? []).map((m) => ({
    tenantId: m.tenant_id,
    name: Array.isArray(m.tenants) ? m.tenants[0]?.name : (m.tenants as { name: string } | null)?.name,
    role: m.role,
  }));

  return NextResponse.json({ configured: true, businesses, activeTenantId: tenantId });
}

// Adds a new business to this login and switches to it immediately — "create
// a business" without a reason to land you somewhere you didn't just create.
//
// Runs on the admin client, not the caller's session client. tenants only
// ever got read/update RLS policies (0001_init.sql) — creating one was never
// meant to happen outside handle_new_user()'s own SECURITY DEFINER trigger,
// which is exactly why a plain session-scoped insert here fails RLS outright.
// The wallet_accounts insert has the same shape of problem one step further
// in: its policy checks tenant_id = auth_tenant_id(), but auth_tenant_id()
// still reads the OLD active tenant until the profiles update below runs, so
// even a correctly-RLS'd tenants insert would still fail creating a wallet
// for the brand new one. Using the admin client sidesteps both instead of
// growing a policy just to let this one endpoint run itself — every value
// written still derives from userId, which requireTenant() already verified
// against the real session, never from client input.
export async function POST(request: Request) {
  if (!isBackendConfigured) return NextResponse.json({ error: "Backend isn't connected yet." }, { status: 200 });

  const { error, status, userId } = await requireTenant();
  if (error) return NextResponse.json({ error }, { status });

  const { name } = (await request.json()) as { name?: string };
  if (!name?.trim()) return NextResponse.json({ error: "Give the new business a name." }, { status: 400 });

  const admin = createAdminClient();

  const { data: tenant, error: tenantError } = await admin
    .from("tenants")
    .insert({ name: name.trim(), owner_id: userId })
    .select("id, name")
    .single();
  if (isPendingMigration(tenantError)) {
    return NextResponse.json({ error: "Multiple businesses need a migration that hasn't been run yet (0020_multi_business.sql)." }, { status: 409 });
  }
  if (tenantError) return NextResponse.json({ error: tenantError.message }, { status: 500 });

  const { error: memberError } = await admin
    .from("memberships")
    .insert({ user_id: userId, tenant_id: tenant.id, role: "owner" });
  if (memberError) return NextResponse.json({ error: memberError.message }, { status: 500 });

  await admin.from("wallet_accounts").insert({
    tenant_id: tenant.id,
    label: "Primary",
    account_number: String(Math.floor(Math.random() * 1e10)).padStart(10, "0"),
    routing_number: String(Math.floor(Math.random() * 1e9)).padStart(9, "0"),
    balance_cents: 0,
  });

  await admin.from("profiles").update({ tenant_id: tenant.id }).eq("id", userId);

  return NextResponse.json({ configured: true, business: { tenantId: tenant.id, name: tenant.name, role: "owner" } });
}
