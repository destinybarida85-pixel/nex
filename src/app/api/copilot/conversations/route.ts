import { NextResponse } from "next/server";
import { requireTenant } from "@/lib/requireTenant";
import { isBackendConfigured } from "@/lib/backendStatus";
import { isPendingMigration } from "@/lib/schema";

type Msg = { role: "user" | "ai"; text: string; recommendation?: { label: string; documentPrompt: string } | null };

// List (for the history tab) and save (auto-save as the conversation
// progresses, upserting by id) — the copilot page owns the id after the
// first save and keeps passing it back, same shape as how documents/[id]
// already works elsewhere in this app.
export async function GET() {
  if (!isBackendConfigured) return NextResponse.json({ configured: false });

  const { error, status, supabase, tenantId } = await requireTenant();
  if (error) return NextResponse.json({ configured: true, error }, { status });

  const { data: conversations, error: listError } = await supabase!
    .from("copilot_conversations")
    .select("id, title, rating, created_at, updated_at")
    .eq("tenant_id", tenantId)
    .order("updated_at", { ascending: false })
    .limit(50);

  if (isPendingMigration(listError)) return NextResponse.json({ configured: true, conversations: [] });
  if (listError) return NextResponse.json({ error: listError.message }, { status: 500 });

  return NextResponse.json({ configured: true, conversations: conversations ?? [] });
}

export async function POST(request: Request) {
  if (!isBackendConfigured) return NextResponse.json({ configured: false });

  const { error, status, supabase, tenantId } = await requireTenant();
  if (error) return NextResponse.json({ error }, { status });

  const { id, messages } = (await request.json()) as { id?: string; messages: Msg[] };
  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "Nothing to save yet." }, { status: 400 });
  }

  // The title is just the first thing the user actually asked — enough to
  // recognize a conversation in a list without adding a second AI call just
  // to summarize it.
  const firstUserMessage = messages.find((m) => m.role === "user")?.text ?? "New conversation";
  const title = firstUserMessage.length > 60 ? `${firstUserMessage.slice(0, 60)}…` : firstUserMessage;

  if (id) {
    const { error: updateError } = await supabase!
      .from("copilot_conversations")
      .update({ messages, updated_at: new Date().toISOString() })
      .eq("id", id)
      .eq("tenant_id", tenantId);
    if (isPendingMigration(updateError)) return NextResponse.json({ configured: true, saved: false });
    if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });
    return NextResponse.json({ configured: true, id, saved: true });
  }

  const { data: inserted, error: insertError } = await supabase!
    .from("copilot_conversations")
    .insert({ tenant_id: tenantId, title, messages })
    .select("id")
    .single();
  if (isPendingMigration(insertError)) return NextResponse.json({ configured: true, saved: false });
  if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 });

  return NextResponse.json({ configured: true, id: inserted.id, saved: true });
}
