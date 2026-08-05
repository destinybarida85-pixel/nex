import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Same allowlist check as proxy.ts, duplicated deliberately rather than
// shared: proxy.ts gates page navigation to /admin, but that match is on the
// exact path "/admin" and doesn't cover "/api/admin/*" — API routes need
// their own check regardless of what the page-level gate does, the same way
// every other API route uses requireTenant() instead of trusting that a
// page redirect already happened.
export async function requirePlatformAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not signed in.", status: 401 as const, admin: null };

  const allowedEmails = (process.env.PLATFORM_ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  const email = user.email?.toLowerCase();
  if (!email || !allowedEmails.includes(email)) {
    return { error: "Not authorized.", status: 403 as const, admin: null };
  }

  return { error: null, status: 200 as const, admin: createAdminClient() };
}
