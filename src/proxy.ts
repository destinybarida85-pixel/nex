import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Routes that hold real business data and require a signed-in Origin account.
// Deliberately excludes /sign (external signers often have no Origin account
// of their own — same reason real e-sign services work this way) and
// /tenant-login (a white-label tenant's own branded portal, unrelated to
// Origin's own auth).
const PROTECTED_PREFIXES = [
  "/dashboard",
  "/wallet",
  "/assistant",
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

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
