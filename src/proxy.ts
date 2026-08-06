import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isPendingMigration } from "@/lib/schema";

// Routes that hold real business data and require a signed-in Primue account.
// Deliberately excludes /sign (external signers often have no Primue account
// of their own — same reason real e-sign services work this way) and
// /tenant-login (a white-label tenant's own branded portal, unrelated to
// Primue's own auth).
const PROTECTED_PREFIXES = [
  "/dashboard",
  "/wallet",
  "/assistant",
  "/copilot",
  "/admin",
  "/profile",
  "/analytics",
  "/calendar",
  "/crm",
  "/employees",
  "/payments",
  "/payroll",
  "/billing",
  "/invoices",
  "/certificates",
  "/templates",
  "/whitelabel",
  "/mobile",
];

const AUTH_PAGES = ["/signin", "/signup"];

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return response;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  const isAuthPage = AUTH_PAGES.some((p) => pathname === p);
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");

  if (!user && isProtected) {
    const redirectUrl = new URL("/signin", request.url);
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // The Super Admin console operates on every tenant's data, so being signed in
  // isn't enough — it's restricted to an explicit allowlist of platform-owner
  // emails, not just "whoever happens to be logged in."
  if (user && isAdminRoute) {
    const allowedEmails = (process.env.PLATFORM_ADMIN_EMAILS ?? "")
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);
    const email = user.email?.toLowerCase();
    if (!email || !allowedEmails.includes(email)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  if (user && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // A suspended tenant's data is already locked down at the API layer
  // (requireTenant() rejects with 403), but the page shell itself doesn't
  // call that — it renders the layout and lets client components fetch
  // their own data, silently falling back to demo placeholders on any
  // fetch failure. Without this check a suspended owner just sees a
  // dashboard full of generic demo numbers instead of a clear "you're
  // suspended" message, which looks like things are working fine.
  if (user && isProtected && !isAdminRoute && pathname !== "/suspended") {
    const { data: profile } = await supabase.from("profiles").select("tenant_id").eq("id", user.id).maybeSingle();
    if (profile?.tenant_id) {
      const { data: tenant, error: tenantError } = await supabase
        .from("tenants")
        .select("suspended")
        .eq("id", profile.tenant_id)
        .maybeSingle();
      if (!isPendingMigration(tenantError) && tenant?.suspended) {
        return NextResponse.redirect(new URL("/suspended", request.url));
      }
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
