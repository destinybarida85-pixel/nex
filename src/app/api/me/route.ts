import { NextResponse } from "next/server";
import { requireTenant } from "@/lib/requireTenant";
import { isBackendConfigured } from "@/lib/backendStatus";

export async function GET() {
  if (!isBackendConfigured) return NextResponse.json({ configured: false });

  const { error, status, supabase, tenantId, userId } = await requireTenant();
  if (error) return NextResponse.json({ configured: true, error }, { status });

  const [{ data: profile }, { data: tenant }, { data: userRes }] = await Promise.all([
    supabase!.from("profiles").select("full_name, avatar_url, created_at").eq("id", userId).single(),
    supabase!.from("tenants").select("name").eq("id", tenantId).single(),
    supabase!.auth.getUser(),
  ]);

  return NextResponse.json({
    configured: true,
    fullName: profile?.full_name || "",
    avatarUrl: profile?.avatar_url || null,
    email: userRes?.user?.email || "",
    tenantName: tenant?.name || "My Business",
    createdAt: profile?.created_at || null,
  });
}

export async function PATCH(request: Request) {
  if (!isBackendConfigured) return NextResponse.json({ error: "Backend isn't connected yet." }, { status: 200 });

  const { error, status, supabase, userId } = await requireTenant();
  if (error) return NextResponse.json({ error }, { status });

  const body = (await request.json()) as { fullName?: string; avatarUrl?: string | null };
  const update: Record<string, unknown> = {};
  if (typeof body.fullName === "string") update.full_name = body.fullName.trim();
  if (body.avatarUrl !== undefined) update.avatar_url = body.avatarUrl || null;

  const { data: profile, error: updateError } = await supabase!
    .from("profiles")
    .update(update)
    .eq("id", userId)
    .select("full_name, avatar_url")
    .single();
  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });

  return NextResponse.json({ fullName: profile.full_name || "", avatarUrl: profile.avatar_url || null });
}
