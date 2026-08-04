import { NextResponse } from "next/server";
import { requireTenant } from "@/lib/requireTenant";
import { isBackendConfigured } from "@/lib/backendStatus";
import { sendEmail } from "@/lib/email";

// The link itself is built client-side (DocumentPanel already has
// window.location.origin, same as the "Copy link" button next to this one)
// rather than reconstructed here from request headers, which get unreliable
// behind proxies/tunnels.
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isBackendConfigured) return NextResponse.json({ error: "Backend isn't connected yet." }, { status: 200 });

  const { error, status, supabase, tenantId } = await requireTenant();
  if (error) return NextResponse.json({ error }, { status });

  const { id } = await params;
  const { to, link, message } = (await request.json()) as { to?: string; link?: string; message?: string };

  if (!to?.trim() || !to.includes("@")) return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  if (!link) return NextResponse.json({ error: "Missing document link." }, { status: 400 });

  const { data: document, error: docError } = await supabase!
    .from("documents")
    .select("id, title")
    .eq("id", id)
    .eq("tenant_id", tenantId)
    .single();
  if (docError || !document) return NextResponse.json({ error: "Document not found." }, { status: 404 });

  const html = `
    <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; color: #1a1a1f;">
      <p>You've been sent a document to review${message ? "" : " and sign"}: <strong>${document.title}</strong></p>
      ${message ? `<p style="white-space: pre-wrap; color: #45454e;">${message}</p>` : ""}
      <p><a href="${link}" style="display: inline-block; padding: 10px 18px; background: #6552c8; color: #fff; border-radius: 8px; text-decoration: none;">Open document</a></p>
      <p style="font-size: 12px; color: #6b6b76;">Sent via Primue. If the button doesn't work, copy this link: ${link}</p>
    </div>
  `;

  const result = await sendEmail({ to: to.trim(), subject: `Document to review: ${document.title}`, html });
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 502 });

  return NextResponse.json({ sent: true });
}
