import { NextResponse } from "next/server";
import { requireTenant } from "@/lib/requireTenant";
import { isBackendConfigured } from "@/lib/backendStatus";
import { isMissingColumn } from "@/lib/schema";

const SELECT_FIELDS = "full_name, avatar_url, created_at, theme_preference";
const SELECT_FIELDS_NO_THEME = "full_name, avatar_url, created_at";

export async function GET() {
  if (!isBackendConfigured) return NextResponse.json({ configured: false });

  const { error, status, supabase, tenantId, userId } = await requireTenant();
  if (error) return NextResponse.json({ configured: true, error }, { status });

  let { data: profile, error: profileError } = await supabase!.from("profiles").select(SELECT_FIELDS).eq("id", userId).single();
  if (isMissingColumn(profileError)) {
    ({ data: profile, error: profileError } = await supabase!.from("profiles").select(SELECT_FIELDS_NO_THEME).eq("id", userId).single());
  }

  const [{ data: tenant }, { data: userRes }] = await Promise.all([
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
    themePreference: (profile as { theme_preference?: string } | null)?.theme_preference || null,
  });
}

export async function PATCH(request: Request) {
  if (!isBackendConfigured) return NextResponse.json({ error: "Backend isn't connected yet." }, { status: 200 });

  const { error, status, supabase, userId } = await requireTenant();
  if (error) return NextResponse.json({ error }, { status });

  const body = (await request.json()) as { fullName?: string; avatarUrl?: string | null; themePreference?: "dark" | "light" };
  const update: Record<string, unknown> = {};
  if (typeof body.fullName === "string") update.full_name = body.fullName.trim();
  if (body.avatarUrl !== undefined) update.avatar_url = body.avatarUrl || null;
  if (body.themePreference === "dark" || body.themePreference === "light") update.theme_preference = body.themePreference;

  let { data: profile, error: updateError } = await supabase!
    .from("profiles")
    .update(update)
    .eq("id", userId)
    .select(SELECT_FIELDS)
    .single();

  if (isMissingColumn(updateError) && "theme_preference" in update) {
    // Theme isn't set up on the database yet — save whatever else was in the
    // update and let the client keep the theme choice in localStorage only.
    // An empty `rest` (a theme-only PATCH, which is what the toggle sends)
    // has nothing left to update, so just re-read the row instead of issuing
    // a no-op update PostgREST would reject.
    const { theme_preference: _themePreference, ...rest } = update;
    void _themePreference;
    if (Object.keys(rest).length === 0) {
      ({ data: profile, error: updateError } = await supabase!.from("profiles").select(SELECT_FIELDS_NO_THEME).eq("id", userId).single());
    } else {
      ({ data: profile, error: updateError } = await supabase!
        .from("profiles")
        .update(rest)
        .eq("id", userId)
        .select(SELECT_FIELDS_NO_THEME)
        .single());
    }
  }
  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });

  return NextResponse.json({
    fullName: profile?.full_name || "",
    avatarUrl: profile?.avatar_url || null,
    themePreference: (profile as { theme_preference?: string } | null)?.theme_preference || null,
  });
}
