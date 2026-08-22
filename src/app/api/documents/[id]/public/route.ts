import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isBackendConfigured } from "@/lib/backendStatus";
import { isMissingColumn } from "@/lib/schema";

// Intentionally unauthenticated: this is the "anyone with the link" read path for a
// document shared via the white-label mini site. The document's random UUID is the
// access key, same pattern as a shareable Google Docs link. Only the fields a client
// actually needs to see are returned — never signer PII or internal metadata.
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isBackendConfigured) return NextResponse.json({ configured: false }, { status: 200 });

  const { id } = await params;
  const supabase = createAdminClient();

  type PaymentLinkRow = { title: string; amount_cents: number; currency: string; url: string; status: string; provider?: string };
  type DocRow = {
    id: string;
    title: string;
    content: unknown;
    status: string;
    created_at: string;
    signers_required?: number;
    payment_link_id: string | null;
    payment_links: PaymentLinkRow | PaymentLinkRow[] | null;
  };

  // provider falls back the same way signers_required already does below —
  // migration 0029 (payment_links.provider) may not be applied yet on every
  // deploy, and a missing column must degrade gracefully, not 500.
  async function fetchWithPaymentFields(paymentFields: string) {
    const withSigners = `id, title, content, status, created_at, signers_required, payment_link_id, payment_links(${paymentFields})`;
    const withoutSigners = `id, title, content, status, created_at, payment_link_id, payment_links(${paymentFields})`;
    let res = await supabase.from("documents").select(withSigners).eq("id", id).maybeSingle();
    if (isMissingColumn(res.error)) {
      res = await supabase.from("documents").select(withoutSigners).eq("id", id).maybeSingle();
    }
    return res as unknown as { data: DocRow | null; error: { code?: string; message?: string } | null };
  }

  let { data: document, error } = await fetchWithPaymentFields("title, amount_cents, currency, url, status, provider");
  if (isMissingColumn(error)) {
    ({ data: document, error } = await fetchWithPaymentFields("title, amount_cents, currency, url, status"));
  }

  // A malformed id (e.g. a mistyped or partial link) fails at the database
  // level with an "invalid input syntax for uuid" error, not a clean "no
  // rows" — without this check that surfaces as a raw 500 instead of the
  // same honest "not found" a real-but-missing id gets below.
  if (error) {
    if (error.code === "22P02") return NextResponse.json({ error: "Document not found." }, { status: 404 });
    // Public endpoint: never echo the database's own error text to a stranger.
    console.error("[documents/public] lookup failed:", error.message);
    return NextResponse.json({ error: "Document not found." }, { status: 404 });
  }
  if (!document) return NextResponse.json({ error: "Document not found." }, { status: 404 });

  const content = document.content as { text?: string; sections?: { heading: string; text: string }[]; layout?: string; font?: string; tone?: string; organisation?: string; accentColor?: string; logoUrl?: string; watermarkUrl?: string };

  // Who has already signed drives the second signer's view: they need to know
  // the first party is on the record, not just be handed a blank pad. Only the
  // name and time are exposed — never the email, IP or user agent stored
  // alongside them. signature_image and stamp are also public here on
  // purpose: this is the same visual mark that's already on the printed/
  // shared document itself, not a secret — it's what lets a document opened
  // again after signing still show the real signature and seal instead of a
  // blank page (see migration 0018).
  type SigRow = { signer_name: string; signed_at: string; signature_image?: string | null; stamp?: Record<string, unknown> | null };
  let signatures: SigRow[] | null;
  const { data: fullSignatures, error: sigErr } = await supabase
    .from("signatures")
    .select("signer_name, signed_at, signature_image, stamp")
    .eq("document_id", document.id)
    .order("signed_at", { ascending: true });
  if (isMissingColumn(sigErr)) {
    const { data: basicSignatures } = await supabase
      .from("signatures")
      .select("signer_name, signed_at")
      .eq("document_id", document.id)
      .order("signed_at", { ascending: true });
    signatures = basicSignatures;
  } else {
    signatures = fullSignatures;
  }

  const link = Array.isArray(document.payment_links) ? document.payment_links[0] : document.payment_links;

  return NextResponse.json({
    configured: true,
    document: {
      id: document.id,
      title: document.title,
      text: content?.text ?? "",
      sections: content?.sections ?? null,
      layout: content?.layout ?? null,
      font: content?.font ?? null,
      tone: content?.tone ?? null,
      organisation: content?.organisation ?? null,
      accentColor: content?.accentColor ?? null,
      logoUrl: content?.logoUrl ?? null,
      watermarkUrl: content?.watermarkUrl ?? null,
      status: document.status,
      createdAt: document.created_at,
      signersRequired: "signers_required" in document ? (document.signers_required as number) ?? 1 : 1,
      signedBy: (signatures ?? []).map((s) => ({
        name: s.signer_name,
        at: s.signed_at,
        signatureImage: s.signature_image ?? null,
        stamp: s.stamp ?? null,
      })),
      payment: link && link.status === "active"
        ? { title: link.title, amountCents: link.amount_cents, currency: link.currency, url: link.url, provider: ("provider" in link ? (link.provider as string) : null) || "stripe" }
        : null,
    },
  });
}
