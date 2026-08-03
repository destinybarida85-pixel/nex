import { NextResponse } from "next/server";
import { hashDocument, hashSignature, computeRecordHash, formatCertificateId } from "@/lib/signatureProof";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient as createSessionClient } from "@/lib/supabase/server";
import { createNotification } from "@/lib/notify";
import { isMissingColumn } from "@/lib/schema";

const isConfigured = !!(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request: Request) {
  const body = await request.json();
  const { documentId, documentTitle, documentContent, signerName, signatureData, skipStamp } = body as {
    documentId?: string;
    documentTitle: string;
    documentContent: string;
    signerName: string;
    signerEmail?: string;
    signatureData: string;
    skipStamp?: boolean;
  };
  // Deliberately optional: a real shareable link (/sign/[id]) has no way to
  // know in advance who's about to open it, and there's no real identity
  // verification in this flow to require an email for anyway — that was a
  // decorative "we sent you a code" step that never actually sent or
  // checked anything, and has been removed.
  const signerEmail: string = body.signerEmail || "";

  if (!documentContent || !signerName || !signatureData) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const documentHash = await hashDocument(documentContent);
  const signatureHash = await hashSignature(signatureData);
  const signedAt = new Date().toISOString();

  if (!isConfigured) {
    // No database connected yet: compute and return the hash chain so the feature is
    // genuinely working end to end, but it isn't independently verifiable until a
    // real database is wired up (see NEXT_PUBLIC_SUPABASE_URL in .env.local).
    const recordHash = await computeRecordHash({
      documentHash,
      signerName,
      signerEmail,
      signatureHash,
      previousHash: null,
      signedAt,
    });
    return NextResponse.json({
      certificateId: formatCertificateId(recordHash),
      recordHash,
      documentHash,
      signedAt,
      persisted: false,
      stampApplied: true,
      stampCreditsRemaining: null,
    });
  }

  const supabase = createAdminClient();

  // Best-effort: if whoever is completing this signature is signed into their own
  // Origin account (e.g. the business owner sending or testing their own document),
  // attribute the resulting document to their tenant so it can show up in their
  // document list, be featured on their white-label site, and charge stamp credits
  // correctly. External signers with no Origin account simply have no session here
  // — /sign is intentionally reachable without one — and the document stays
  // unattributed, same as before.
  let authorTenantId: string | null = null;
  try {
    const sessionClient = await createSessionClient();
    const {
      data: { user },
    } = await sessionClient.auth.getUser();
    if (user) {
      const { data: profile } = await supabase.from("profiles").select("tenant_id").eq("id", user.id).maybeSingle();
      authorTenantId = profile?.tenant_id ?? null;
    }
  } catch {
    // No session cookie present — proceed as an anonymous signer.
  }

  let doc: { id: string; tenant_id: string | null; signers_required?: number } | null = null;

  if (documentId) {
    // A real shareable link (/sign/[id]) — this is the exact document, no
    // guessing needed. Keep content_hash in sync so the tamper-evident
    // record still reflects what was actually signed.
    let { data: existing, error: findError } = await supabase
      .from("documents")
      .select("id, tenant_id, signers_required")
      .eq("id", documentId)
      .maybeSingle();
    if (isMissingColumn(findError)) {
      ({ data: existing, error: findError } = await supabase
        .from("documents")
        .select("id, tenant_id")
        .eq("id", documentId)
        .maybeSingle());
    }
    if (findError || !existing) {
      return NextResponse.json({ error: "That document no longer exists." }, { status: 404 });
    }
    await supabase.from("documents").update({ content_hash: documentHash }).eq("id", documentId);
    doc = existing;
  } else {
    // No real id (the sessionStorage-only demo/preview path) — match an
    // existing document by title+content so re-completing the same demo
    // flow finds and updates that same row rather than creating a
    // duplicate each time. When the person here has their own tenant,
    // scope the match to their own documents only — otherwise two
    // unrelated businesses drafting from the same unedited starter
    // template (identical title+content) would collide onto the same
    // document and signature chain, which is a real cross-tenant leak.
    let docQuery = supabase.from("documents").select("id, tenant_id").eq("title", documentTitle).eq("content_hash", documentHash);
    if (authorTenantId) docQuery = docQuery.eq("tenant_id", authorTenantId);
    const { data: matched } = await docQuery.maybeSingle();
    doc = matched;

    if (!doc) {
      const { data: inserted, error: insertError } = await supabase
        .from("documents")
        .insert({ title: documentTitle, content: { text: documentContent }, content_hash: documentHash, status: "sent", tenant_id: authorTenantId })
        .select("id, tenant_id")
        .single();
      if (insertError) {
        return NextResponse.json({ error: insertError.message }, { status: 500 });
      }
      doc = inserted;
    }
  }

  const { data: previous } = await supabase
    .from("signatures")
    .select("record_hash")
    .eq("document_id", doc!.id)
    .order("signed_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const previousHash = previous?.record_hash ?? null;
  const recordHash = await computeRecordHash({
    documentHash,
    signerName,
    signerEmail,
    signatureHash,
    previousHash,
    signedAt,
  });

  let stampApplied = false;
  let stampCreditsRemaining: number | null = null;
  if (skipStamp) {
    // The signer opted out of applying a stamp — no credit charged, nothing to show.
  } else if (doc!.tenant_id) {
    const { data: tenant } = await supabase.from("tenants").select("stamp_credits").eq("id", doc!.tenant_id).single();
    if (tenant && tenant.stamp_credits > 0) {
      await supabase.from("tenants").update({ stamp_credits: tenant.stamp_credits - 1 }).eq("id", doc!.tenant_id);
      stampApplied = true;
      stampCreditsRemaining = tenant.stamp_credits - 1;
    } else {
      stampCreditsRemaining = tenant?.stamp_credits ?? 0;
    }
  } else {
    // No tenant to charge a credit against (a signer with no Origin account) — show the seal anyway.
    stampApplied = true;
  }

  const forwardedFor = request.headers.get("x-forwarded-for");
  const { error: sigError } = await supabase.from("signatures").insert({
    document_id: doc!.id,
    signer_name: signerName,
    signer_email: signerEmail,
    signature_hash: signatureHash,
    document_hash: documentHash,
    previous_hash: previousHash,
    record_hash: recordHash,
    ip_address: forwardedFor ? forwardedFor.split(",")[0].trim() : null,
    user_agent: request.headers.get("user-agent"),
    signed_at: signedAt,
    stamp_applied: stampApplied,
  });
  if (sigError) {
    return NextResponse.json({ error: sigError.message }, { status: 500 });
  }

  // A two-party document isn't finished when the first person signs it. Count
  // what's actually on the chain rather than assuming, so the status can never
  // claim "signed" while a required signature is still missing.
  const signersRequired = doc!.signers_required ?? 1;
  const { count: signatureCount } = await supabase
    .from("signatures")
    .select("id", { count: "exact", head: true })
    .eq("document_id", doc!.id);
  const signaturesSoFar = signatureCount ?? 1;
  const complete = signaturesSoFar >= signersRequired;

  const { error: statusError } = await supabase
    .from("documents")
    .update({ status: complete ? "signed" : "partially_signed", updated_at: signedAt })
    .eq("id", doc!.id);

  // Before migration 0015 the status check constraint has no 'partially_signed'
  // value. Leaving the document on 'sent' is the correct fallback: it keeps the
  // link open for the second signer rather than sealing it early.
  if (statusError && !complete) {
    await supabase.from("documents").update({ status: "sent", updated_at: signedAt }).eq("id", doc!.id);
  }

  if (doc!.tenant_id) {
    await createNotification(
      supabase,
      doc!.tenant_id,
      "document_signed",
      complete ? `"${documentTitle}" was signed` : `"${documentTitle}" was signed by one party`,
      complete
        ? `Signed by ${signerName}`
        : `Signed by ${signerName} — still waiting on ${signersRequired - signaturesSoFar} more signature`
    );
  }

  return NextResponse.json({
    certificateId: formatCertificateId(recordHash),
    recordHash,
    documentHash,
    signedAt,
    persisted: true,
    stampApplied,
    stampCreditsRemaining,
    signersRequired,
    signaturesSoFar,
    complete,
  });
}
