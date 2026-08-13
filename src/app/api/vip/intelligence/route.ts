import { NextResponse } from "next/server";
import { requireTenant } from "@/lib/requireTenant";
import { isBackendConfigured } from "@/lib/backendStatus";

// Every "insight" here is a fact computed from this tenant's own real rows —
// never a market/competitor claim, since Primue has no data source for that.
// The model is only ever handed these pre-computed numbers and told to
// phrase them, not to invent anything beyond them.
const SYSTEM_PROMPT = `You are Primue AI's insight engine for a VIP account. You will be given a JSON object of real, pre-computed facts about this one business's own account — nothing else. Turn them into at most 4 short, prioritized recommendations of what the owner should look at next.

Hard rules:
- Use ONLY the facts given. Never mention market trends, competitors, industry benchmarks, or any number not present in the input — you have no access to any of that.
- If a fact indicates something is fine (e.g. no overdue items, credits plenty, cash flow positive), do not manufacture a problem about it.
- If nothing in the facts warrants a recommendation, return an empty array — do not pad it with generic advice like "consider marketing more."
- Each recommendation must reference the specific real number or fact it's based on, not a vague generality.

Respond with ONLY a JSON object, no prose before or after:
{ "recommendations": [ { "headline": "string, one short sentence", "detail": "string, one sentence, cites the specific fact" } ] }`;

export async function GET() {
  if (!isBackendConfigured) return NextResponse.json({ configured: false });

  const { error, status, supabase, tenantId } = await requireTenant();
  if (error) return NextResponse.json({ configured: true, error }, { status });

  const { data: tenant } = await supabase!
    .from("tenants")
    .select("plan, certificate_credits, stamp_credits")
    .eq("id", tenantId)
    .maybeSingle();
  if (tenant?.plan !== "vip") {
    return NextResponse.json({ configured: true, error: "Intelligence is only available on the VIP plan." }, { status: 403 });
  }

  // — Gather real facts —
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;

  const { data: docs } = await supabase!
    .from("documents")
    .select("title, status, created_at")
    .eq("tenant_id", tenantId)
    .in("status", ["draft", "sent"]);
  const pending = docs ?? [];
  const oldestPending = pending.length
    ? pending.reduce((a, b) => (new Date(a.created_at) < new Date(b.created_at) ? a : b))
    : null;
  const oldestPendingDays = oldestPending ? Math.floor((now - new Date(oldestPending.created_at).getTime()) / day) : null;

  const { data: accounts } = await supabase!.from("wallet_accounts").select("id").eq("tenant_id", tenantId);
  const accountIds = (accounts ?? []).map((a) => a.id);
  const { data: transactions } = accountIds.length
    ? await supabase!
        .from("wallet_transactions")
        .select("direction, amount_cents, created_at")
        .in("account_id", accountIds)
        .order("created_at", { ascending: false })
        .limit(200)
    : { data: [] as { direction: string; amount_cents: number; created_at: string }[] };
  const txs = transactions ?? [];

  const last30 = txs.filter((t) => now - new Date(t.created_at).getTime() < 30 * day);
  const prev30 = txs.filter((t) => {
    const age = now - new Date(t.created_at).getTime();
    return age >= 30 * day && age < 60 * day;
  });
  const netCents = (rows: typeof txs) =>
    rows.reduce((sum, t) => sum + (t.direction === "credit" ? t.amount_cents : -t.amount_cents), 0);
  const net30 = netCents(last30);
  const netPrev30 = netCents(prev30);

  const daysSinceLastTx = txs.length ? Math.floor((now - new Date(txs[0].created_at).getTime()) / day) : null;

  const { data: readyRequests } = await supabase!
    .from("vip_requests")
    .select("input_text, created_at")
    .eq("tenant_id", tenantId)
    .eq("status", "ready");
  const ready = readyRequests ?? [];
  const oldestReady = ready.length
    ? ready.reduce((a, b) => (new Date(a.created_at) < new Date(b.created_at) ? a : b))
    : null;
  const oldestReadyDays = oldestReady ? Math.floor((now - new Date(oldestReady.created_at).getTime()) / day) : null;

  const facts = {
    pendingSignatures: { count: pending.length, oldestDays: oldestPendingDays, oldestTitle: oldestPending?.title ?? null },
    cashFlow30d: { netCents: net30, previousPeriodNetCents: netPrev30 },
    daysSinceLastWalletActivity: daysSinceLastTx,
    unreviewedAiDrafts: { count: ready.length, oldestDays: oldestReadyDays },
    certificateCreditsRemaining: tenant?.certificate_credits ?? null,
    stampCreditsRemaining: tenant?.stamp_credits ?? null,
  };

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return NextResponse.json({ configured: true, facts, recommendations: [] });

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({
        model: "claude-sonnet-4-5",
        max_tokens: 500,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: JSON.stringify(facts) }],
      }),
    });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    const rawText = data.content?.[0]?.text ?? "";
    const cleaned = rawText.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "").trim();
    const parsed = JSON.parse(cleaned);
    return NextResponse.json({ configured: true, facts, recommendations: parsed.recommendations ?? [] });
  } catch {
    return NextResponse.json({ configured: true, facts, recommendations: [], error: "Couldn't reach the AI service." });
  }
}
