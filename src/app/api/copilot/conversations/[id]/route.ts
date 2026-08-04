import { NextResponse } from "next/server";
import { requireTenant } from "@/lib/requireTenant";
import { isBackendConfigured } from "@/lib/backendStatus";
import { isPendingMigration } from "@/lib/schema";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isBackendConfigured) return NextResponse.json({ configured: false });

  const { error, status, supabase, tenantId } = await requireTenant();
  if (error) return NextResponse.json({ error }, { status });

  const { id } = await params;
  const { data, error: fetchError } = await supabase!
    .from("copilot_conversations")
    .select("id, title, messages, rating")
    .eq("id", id)
    .eq("tenant_id", tenantId)
    .maybeSingle();

  if (isPendingMigration(fetchError)) return NextResponse.json({ configured: true, error: "Not found." }, { status: 404 });
  if (fetchError) return NextResponse.json({ error: fetchError.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Conversation not found." }, { status: 404 });

  return NextResponse.json({ configured: true, conversation: data });
}

// Rating a conversation is the "did this actually produce a good document"
// signal the tenant leaves behind — thumbs up/down, nothing more granular,
// since anything fancier needs actual volume to be worth building.
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isBackendConfigured) return NextResponse.json({ configured: false });

  const { error, status, supabase, tenantId } = await requireTenant();
  if (error) return NextResponse.json({ error }, { status });

  const { id } = await params;
  const { rating } = (await request.json()) as { rating: boolean | null };

  const { error: updateError } = await supabase!
    .from("copilot_conversations")
    .update({ rating })
    .eq("id", id)
    .eq("tenant_id", tenantId);

  if (isPendingMigration(updateError)) return NextResponse.json({ configured: true, saved: false });
  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });

  return NextResponse.json({ configured: true, saved: true });
}
