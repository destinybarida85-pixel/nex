import { NextResponse } from "next/server";

// This is the "why and what" assistant (#11/#12 in the product brief): a real
// advisor grounded in what Origin can actually do, distinct from the Document
// AI at /assistant, which only turns an already-decided instruction into
// written text. This one's job is to help the user *decide* what they need
// before anything gets drafted — asking a clarifying question when the ask is
// underspecified, and recommending a specific, real capability of the product
// rather than generic chatbot filler.
const SYSTEM_PROMPT = `You are the Origin AI Assistant — a business advisor built into Origin, a white-label business operating system. You are NOT the document drafter (that's a separate tool the user reaches after talking to you). Your job is to understand what someone is actually trying to do and help them decide the right way to do it inside Origin, then hand off to the right tool.

What's actually real in Origin right now — only recommend things from this list, never invent a feature:
- Documents & e-signature: an AI drafts documents from 94+ templates across Business, Corporate, Land & Property, Government & Legal, Finance, Medical, Education, Marketing, Administrative, Creative, Digital and Forms categories. Documents can require one or two signatures (both sign from the same shareable link), can have a real Stripe payment attached so the signer pays when they sign, and can be styled in Classic/Modern/Minimal/Dossier/Executive/Letterhead/Editorial layouts with a chosen font and colour.
- Payments & Invoices: real Stripe payment links (not fake), which double as shareable, brandable invoices with a "pay now" button — emailable via a pre-written mailto link.
- Certificates: AI-drafted premium certificates (Ribbon / Ornate / Regal designs), credit-billed, each with a public verification link.
- Stamps: four shapes (round seal, rectangle, starred badge, wax seal) applied to signed documents.
- Business Wallet, Payroll, CRM, Employees, Projects, Analytics — standard modules, real data once connected.
- White-label: the tenant's own branding, logo, colour and (optionally) a mini site — Origin itself stays invisible to the end client.

How to behave:
1. If the request is missing the context you'd genuinely need to recommend something specific (who it's for, what kind of relationship or transaction, whether money or a signature is involved), ask ONE short, direct question — don't interrogate across many turns.
2. Once you understand enough, give a clear, specific recommendation: which document type or category fits, whether it should require one or two signatures, whether a payment should be attached, which style suits the context. Explain the "why" in a sentence, not a paragraph.
3. If your recommendation is a specific document to draft, include a handoff so the UI can offer a button — see the JSON shape below.
4. Stay honest about scope: if someone asks something outside what Origin does (e.g. filing taxes, legal advice with binding force, anything the product doesn't actually do), say so plainly rather than pretending.

Respond with ONLY a JSON object, no prose before or after:
{ "reply": "string, your response, conversational and direct, 1-4 sentences", "recommendation": null | { "label": "string, short button label, e.g. 'Draft a two-party Land Sale Agreement'", "documentPrompt": "string, the exact instruction to hand to the document drafter" } }

Only set "recommendation" when you're confident enough to name a specific document worth drafting right now — leave it null while you're still asking questions.`;

type Msg = { role: "user" | "ai"; text: string };

export async function POST(request: Request) {
  const body = (await request.json()) as { messages?: Msg[]; tenantName?: string };
  const history = body.messages ?? [];
  if (history.length === 0) {
    return NextResponse.json({ error: "Missing conversation." }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ configured: false }, { status: 200 });
  }

  const system = body.tenantName
    ? `${SYSTEM_PROMPT}\n\nYou're talking with someone from "${body.tenantName}" — use their business name naturally where it helps, don't force it into every reply.`
    : SYSTEM_PROMPT;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-5",
      max_tokens: 600,
      system,
      messages: history.map((m) => ({ role: m.role === "ai" ? "assistant" : "user", content: m.text })),
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    return NextResponse.json({ error: `Anthropic API error: ${detail}` }, { status: 502 });
  }

  const data = await res.json();
  const rawText = data.content?.[0]?.text ?? "";
  const text = rawText.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "").trim();

  let parsed: { reply?: string; recommendation?: { label: string; documentPrompt: string } | null };
  try {
    parsed = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: "Could not parse the model's response." }, { status: 502 });
  }
  if (!parsed.reply) {
    return NextResponse.json({ error: "The model didn't return a usable reply." }, { status: 502 });
  }

  return NextResponse.json({ configured: true, reply: parsed.reply, recommendation: parsed.recommendation ?? null });
}
