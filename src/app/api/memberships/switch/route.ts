import { NextResponse } from "next/server";
import { requireTenant } from "@/lib/requireTenant";
import { isBackendConfigured } from "@/lib/backendStatus";

// Switching business = repointing profiles.tenant_id at a tenant this login
// actually has a membership for (never trust a client-supplied tenantId
// without checking that) — every existing RLS policy and API route already
// reads "your tenant" from that one column, so nothing downstream needs to
// change to support this.
export async function POST(request: Request) {
  if (!isBackendConfigured) return NextResponse.json({ error: "Backend isn't connected yet." }, { status: 200 });

  const { error, status, supabase, userId } = await requireTenant();
  if (error) return NextResponse.json({ error }, { status });

  const { tenantId } = (await request.json()) as { tenantId?: string };
  if (!tenantId) return NextResponse.json({ error: "Missing business id." }, { status: 400 });

  const { data: membership } = await supabase!
    .from("memberships")
    .select("tenant_id")
    .eq("user_id", userId)
    .eq("tenant_id", tenantId)
    .maybeSingle();
  if (!membership) return NextResponse.json({ error: "You don't have access to that business." }, { status: 403 });

  const { error: updateError } = await supabase!.from("profiles").update({ tenant_id: tenantId }).eq("id", userId);
  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });

  return NextResponse.json({ configured: true, switched: true });
}
