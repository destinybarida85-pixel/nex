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
    .select("id, title, content, status")
    .eq("id", id)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!document) return NextResponse.json({ error: "Document not found." }, { status: 404 });

  return NextResponse.json({
    configured: true,
    document: {
      id: document.id,
      title: document.title,
      text: (document.content as { text?: string })?.text ?? "",
      status: document.status,
    },
  });
}
