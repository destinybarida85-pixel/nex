import { NextResponse } from "next/server";
import { hashDocument, hashSignature, computeRecordHash, formatCertificateId } from "@/lib/signatureProof";
import { createAdminClient } from "@/lib/supabase/admin";
import { createNotification } from "@/lib/notify";

const isConfigured = !!(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request: Request) {
  const body = await request.json();
  const { documentTitle, documentContent, signerName, signerEmail, signatureData } = body as {
    documentTitle: string;
    documentContent: string;
    signerName: string;
    signerEmail: string;
    signatureData: string;
  };

  if (!documentContent || !signerName || !signerEmail || !signatureData) {
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

  let { data: doc } = await supabase
    .from("documents")
    .select("id, tenant_id")
    .eq("title", documentTitle)
    .eq("content_hash", documentHash)
    .maybeSingle();

  if (!doc) {
    const { data: inserted, error: insertError } = await supabase
      .from("documents")
      .insert({ title: documentTitle, content: { text: documentContent }, content_hash: documentHash, status: "sent" })
      .select("id, tenant_id")
      .single();
    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }
    doc = inserted;
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
  if (doc!.tenant_id) {
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

  await supabase.from("documents").update({ status: "signed", updated_at: signedAt }).eq("id", doc!.id);

  if (doc!.tenant_id) {
    await createNotification(supabase, doc!.tenant_id, "document_signed", `"${documentTitle}" was signed`, `Signed by ${signerName}`);
  }

  return NextResponse.json({
    certificateId: formatCertificateId(recordHash),
    recordHash,
    documentHash,
    signedAt,
    persisted: true,
    stampApplied,
    stampCreditsRemaining,
  });
}
