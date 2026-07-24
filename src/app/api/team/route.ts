import { NextResponse } from "next/server";
import { requireTenant } from "@/lib/requireTenant";
import { isBackendConfigured } from "@/lib/backendStatus";

export async function GET() {
  if (!isBackendConfigured) return NextResponse.json({ configured: false });

  const { error, status, supabase, tenantId } = await requireTenant();
  if (error) return NextResponse.json({ configured: true, error }, { status });

  const [{ data: members, error: membersError }, { data: invites, error: invitesError }] = await Promise.all([
    supabase!.from("profiles").select("id, full_name, role, created_at").eq("tenant_id", tenantId).order("created_at"),
    supabase!
      .from("invites")
      .select("id, email, role, created_at, accepted_at")
      .eq("tenant_id", tenantId)
      .is("accepted_at", null)
      .order("created_at", { ascending: false }),
  ]);
  if (membersError) return NextResponse.json({ error: membersError.message }, { status: 500 });
  if (invitesError) return NextResponse.json({ error: invitesError.message }, { status: 500 });

  return NextResponse.json({ configured: true, members, invites });
}

export async function POST(request: Request) {
  if (!isBackendConfigured) return NextResponse.json({ error: "Backend isn't connected yet." }, { status: 200 });

  const { error, status, supabase, tenantId, userId } = await requireTenant();
  if (error) return NextResponse.json({ error }, { status });

  const { data: caller } = await supabase!.from("profiles").select("role").eq("id", userId).single();
  if (!caller || !["owner", "admin"].includes(caller.role)) {
    return NextResponse.json({ error: "Only owners and admins can invite teammates." }, { status: 403 });
  }

  const { email, role } = (await request.json()) as { email?: string; role?: string };
  if (!email?.trim() || !email.includes("@")) {
    return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
  }
  const inviteRole = role === "admin" ? "admin" : "member";

  const { data: invite, error: insertError } = await supabase!
    .from("invites")
    .insert({ tenant_id: tenantId, email: email.trim().toLowerCase(), role: inviteRole, invited_by: userId })
    .select()
    .single();
  if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 });

  return NextResponse.json({ invite });
}
