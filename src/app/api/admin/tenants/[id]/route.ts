import { NextResponse } from "next/server";
import { requirePlatformAdmin } from "@/lib/requirePlatformAdmin";
import { isBackendConfigured } from "@/lib/backendStatus";
import { isPendingMigration } from "@/lib/schema";

// Suspend/unsuspend a tenant. Enforced in requireTenant() (checked on every
// request that tenant's users make, not just at their next sign-in), so this
// takes effect immediately.
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isBackendConfigured) return NextResponse.json({ error: "Backend isn't connected yet." }, { status: 200 });

  const { error, status, admin } = await requirePlatformAdmin();
  if (error) return NextResponse.json({ error }, { status });

  const { id } = await params;
  const { suspended } = (await request.json()) as { suspended?: boolean };
  if (typeof suspended !== "boolean") {
    return NextResponse.json({ error: "Missing suspended value." }, { status: 400 });
  }

  const { error: updateError } = await admin!.from("tenants").update({ suspended }).eq("id", id);
  if (isPendingMigration(updateError)) {
    return NextResponse.json({ error: "Suspension needs a migration that hasn't been run yet (0023_tenant_suspension.sql)." }, { status: 409 });
  }
  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });

  return NextResponse.json({ configured: true, suspended });
}
