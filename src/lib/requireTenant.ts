import { createClient } from "@/lib/supabase/server";

// Resolves the caller's Supabase session and their tenant_id in one call.
// Every real (non-public) API route uses this instead of trusting a client-supplied
// tenant id, so a user can never read or write another tenant's data by guessing an id.
export async function requireTenant() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not signed in.", status: 401 as const, supabase: null, tenantId: null, userId: null };
  }

  const { data: profile } = await supabase.from("profiles").select("tenant_id").eq("id", user.id).single();

  if (!profile?.tenant_id) {
    return { error: "No tenant found for this account.", status: 404 as const, supabase: null, tenantId: null, userId: null };
  }

  return { error: null, status: 200 as const, supabase, tenantId: profile.tenant_id as string, userId: user.id };
}
