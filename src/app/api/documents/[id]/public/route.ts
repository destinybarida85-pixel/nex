import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isBackendConfigured } from "@/lib/backendStatus";

// Intentionally unauthenticated: this is the "anyone with the link" read path for a
// document shared via the white-label mini site. The document's random UUID is the
// access key, same pattern as a shareable Google Docs link. Only the fields a client
// actually needs to see are returned — never signer PII or internal metadata.
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isBackendConfigured) return NextResponse.json({ configured: false }, { status: 200 });

  const { id } = await params;
  const supabase = createAdminClient();

  const { data: document, error } = await supabase
    .from("documents")
    .select("id, title, content, status, created_at")
    .eq("id", id)
    .maybeSingle();

  // A malformed id (e.g. a mistyped or partial link) fails at the database
  // level with an "invalid input syntax for uuid" error, not a clean "no
  // rows" — without this check that surfaces as a raw 500 instead of the
  // same honest "not found" a real-but-missing id gets below.
  if (error) {
    if (error.code === "22P02") return NextResponse.json({ error: "Document not found." }, { status: 404 });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!document) return NextResponse.json({ error: "Document not found." }, { status: 404 });

  const content = document.content as { text?: string; sections?: { heading: string; text: string }[]; layout?: string; accentColor?: string; logoUrl?: string };

  return NextResponse.json({
    configured: true,
    document: {
      id: document.id,
      title: document.title,
      text: content?.text ?? "",
      sections: content?.sections ?? null,
      layout: content?.layout ?? null,
      accentColor: content?.accentColor ?? null,
      logoUrl: content?.logoUrl ?? null,
      status: document.status,
      createdAt: document.created_at,
    },
  });
}
