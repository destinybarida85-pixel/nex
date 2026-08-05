import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isBackendConfigured } from "@/lib/backendStatus";

// Public, unauthenticated, and deliberately aggregate-only — this backs the
// homepage stat band, which used to show hardcoded numbers (412 orgs,
// $42.8M/mo, a flat 99.99% SLA figure nothing actually monitors) with
// nothing marking them as placeholders. No per-tenant data is ever returned
// here, only counts and sums across everyone — the same privacy shape as
// StatBand always had, just backed by real queries now instead of literals.
export async function GET() {
  if (!isBackendConfigured) {
    return NextResponse.json({ configured: false, organizations: 0, walletVolume30dCents: 0, documentsSigned: 0 });
  }

  const admin = createAdminClient();
  const since30d = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const [{ count: organizations }, { count: documentsSigned }, { data: recentTx }] = await Promise.all([
    admin.from("tenants").select("id", { count: "exact", head: true }),
    admin.from("signatures").select("id", { count: "exact", head: true }),
    admin.from("wallet_transactions").select("amount_cents").gte("created_at", since30d),
  ]);

  const walletVolume30dCents = (recentTx ?? []).reduce((sum, t) => sum + Math.abs(t.amount_cents), 0);

  return NextResponse.json({
    configured: true,
    organizations: organizations ?? 0,
    walletVolume30dCents,
    documentsSigned: documentsSigned ?? 0,
  });
}
