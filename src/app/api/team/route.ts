import { NextResponse } from "next/server";
import { requireTenant } from "@/lib/requireTenant";
import { isBackendConfigured } from "@/lib/backendStatus";
import { sendEmail } from "@/lib/email";

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

  const { data: caller } = await supabase!.from("profiles").select("role, full_name").eq("id", userId).single();
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

  // Best-effort and isolated from the invite itself, same pattern as
  // notify.ts: the invite record is the real, durable outcome. If email
  // isn't configured (or the send fails), the invite still exists and the
  // UI falls back to "share the link yourself" — it just won't have been
  // true here.
  let emailSent = false;
  try {
    const { data: tenant } = await supabase!.from("tenants").select("name").eq("id", tenantId).maybeSingle();
    const signupUrl = `${new URL(request.url).origin}/signup`;
    const inviterName = caller.full_name || "Someone";
    const businessName = tenant?.name || "their business";
    const html = `
      <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; color: #1a1a1f;">
        <p>${inviterName} invited you to join <strong>${businessName}</strong> on Primue as a${inviteRole === "admin" ? "n" : ""} ${inviteRole}.</p>
        <p>Sign up with this exact email address (<strong>${email.trim().toLowerCase()}</strong>) and you&rsquo;ll join their business automatically instead of starting a new one:</p>
        <p><a href="${signupUrl}" style="display: inline-block; padding: 10px 18px; background: #6552c8; color: #fff; border-radius: 8px; text-decoration: none;">Create your account</a></p>
        <p style="font-size: 12px; color: #6b6b76;">If the button doesn't work, go to: ${signupUrl}</p>
      </div>
    `;
    const result = await sendEmail({ to: email.trim().toLowerCase(), subject: `${inviterName} invited you to ${businessName} on Primue`, html });
    emailSent = result.ok;
  } catch {
    // Non-fatal — see comment above.
  }

  return NextResponse.json({ invite, emailSent });
}
