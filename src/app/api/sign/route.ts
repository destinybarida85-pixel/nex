import { NextResponse } from "next/server";
import { hashDocument, hashSignature, computeRecordHash, formatCertificateId } from "@/lib/signatureProof";
import { createAdminClient } from "@/lib/supabase/admin";

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
    });
  }

  const supabase = createAdminClient();

  let { data: doc } = await supabase
    .from("documents")
    .select("id")
    .eq("title", documentTitle)
    .eq("content_hash", documentHash)
    .maybeSingle();

  if (!doc) {
    const { data: inserted, error: insertError } = await supabase
      .from("documents")
      .insert({ title: documentTitle, content: { text: documentContent }, content_hash: documentHash, status: "sent" })
      .select("id")
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
  });
  if (sigError) {
    return NextResponse.json({ error: sigError.message }, { status: 500 });
  }

  await supabase.from("documents").update({ status: "signed", updated_at: signedAt }).eq("id", doc!.id);

  return NextResponse.json({
    certificateId: formatCertificateId(recordHash),
    recordHash,
    documentHash,
    signedAt,
    persisted: true,
  });
}
