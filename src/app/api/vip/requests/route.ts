import { NextResponse } from "next/server";
import { requireTenant } from "@/lib/requireTenant";
import { isBackendConfigured } from "@/lib/backendStatus";
import { isPendingMigration } from "@/lib/schema";

// What the VIP drafter is actually allowed to promise: it turns a request into
// a concrete, ready-to-send draft — it never claims to have already sent,
// called, or paid anyone, because it hasn't and can't. Every VIP request ends
// in the tenant's own queue for a human to review before anything goes out.
const SYSTEM_PROMPT = `You are Primue's VIP drafting assistant. A business owner on Primue's VIP plan has sent you a short request — by typed text or a voice note transcribed in the browser — describing something they want handled in their business (a reply to a client, an invoice follow-up, an internal task list, a hiring note, a project update, anything covered by a normal business's day-to-day operations).

Your job: turn that request into one or more concrete, ready-to-send drafts. You are NOT allowed to claim you have already sent an email, made a call, issued a payment, or taken any real-world action — you only ever produce a draft for the business owner to review, edit, and send themselves. Never say "I've sent," "I've called," or "I've handled it" — say "Here's a draft, ready for you to review and send."

If the request is missing information you'd genuinely need (a name, an amount, a deadline, who the message is to), draft your best reasonable attempt and flag exactly what's missing in "gaps" rather than refusing outright.

Respond with ONLY a JSON object, no prose before or after:
{
  "summary": "string, one sentence: what you understood the request to be",
  "drafts": [
    { "label": "string, short name for this draft, e.g. 'Reply to Sarah'", "body": "string, the full ready-to-send text" }
  ],
  "gaps": "string or null — what's missing/assumed, in one short sentence, or null if nothing is missing"
}`;

export async function GET() {
  if (!isBackendConfigured) return NextResponse.json({ configured: false });

  const { error, status, supabase, tenantId } = await requireTenant();
  if (error) return NextResponse.json({ configured: true, error }, { status });

  const { data: tenant } = await supabase!.from("tenants").select("plan").eq("id", tenantId).maybeSingle();
  if (tenant?.plan !== "vip") {
    return NextResponse.json({ configured: true, error: "VIP requests are only available on the VIP plan." }, { status: 403 });
  }

  const { data: requests, error: dbError } = await supabase!
    .from("vip_requests")
    .select("id, input_text, input_source, ai_draft, status, created_at")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false })
    .limit(30);

  if (isPendingMigration(dbError)) return NextResponse.json({ configured: true, requests: [], migrationPending: true });
  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });

  return NextResponse.json({ configured: true, requests });
}

export async function POST(request: Request) {
  if (!isBackendConfigured) return NextResponse.json({ error: "Backend isn't connected yet." }, { status: 200 });

  const { error, status, supabase, tenantId, userId } = await requireTenant();
  if (error) return NextResponse.json({ error }, { status });

  const { data: tenant } = await supabase!.from("tenants").select("plan").eq("id", tenantId).maybeSingle();
  if (tenant?.plan !== "vip") {
    return NextResponse.json({ error: "VIP requests are only available on the VIP plan." }, { status: 403 });
  }

  const body = (await request.json()) as { inputText?: string; inputSource?: "text" | "voice" };
  if (!body.inputText?.trim()) {
    return NextResponse.json({ error: "Say or type what you need before sending." }, { status: 400 });
  }

  const { data: row, error: insertError } = await supabase!
    .from("vip_requests")
    .insert({
      tenant_id: tenantId,
      created_by: userId,
      input_text: body.inputText.trim(),
      input_source: body.inputSource === "voice" ? "voice" : "text",
      status: "drafting",
    })
    .select("id")
    .single();

  if (isPendingMigration(insertError)) {
    return NextResponse.json({ error: "VIP isn't set up on the database yet — run the latest migration first." }, { status: 409 });
  }
  if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    await supabase!.from("vip_requests").update({ status: "error" }).eq("id", row.id);
    return NextResponse.json({ error: "Drafting isn't connected yet." }, { status: 502 });
  }

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({
        model: "claude-sonnet-4-5",
        max_tokens: 1200,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: body.inputText.trim() }],
      }),
    });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    const rawText = data.content?.[0]?.text ?? "";
    const cleaned = rawText.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "").trim();
    const draft = JSON.parse(cleaned);

    const { data: updated, error: updateError } = await supabase!
      .from("vip_requests")
      .update({ ai_draft: draft, status: "ready" })
      .eq("id", row.id)
      .select("id, input_text, input_source, ai_draft, status, created_at")
      .single();
    if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });

    return NextResponse.json({ request: updated });
  } catch (err) {
    await supabase!.from("vip_requests").update({ status: "error" }).eq("id", row.id);
    return NextResponse.json({ error: err instanceof Error ? err.message : "Couldn't draft that." }, { status: 502 });
  }
}
