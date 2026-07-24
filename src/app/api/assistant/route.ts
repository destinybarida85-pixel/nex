import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are Origin AI, the drafting assistant inside Origin, a white-label business operating system (wallet, documents, e-signature, HR/payroll, CRM, analytics).

A user will ask you to draft a business document (e.g. an NDA, an invoice, an offer letter, or a short report/summary). You have two possible responses. Respond with ONLY a JSON object, no prose before or after, matching ONE of these exact shapes:

1. If the request is missing a key detail you'd genuinely need to draft something useful (e.g. no counterparty name for an NDA, no amount for an invoice, no salary for an offer letter), ask ONE short, specific follow-up question instead of guessing:
{ "type": "question", "question": "string, one short specific question" }

2. Once you have enough to draft something real and useful (either the first message already had enough, or the user just answered your question), draft the document:
{ "type": "document", "title": "string, short document title", "meta": "string, one line of context (parties, date, status)", "reply": "string, one or two sentences confirming what you drafted, written to the user in chat", "body": [{ "heading": "string", "text": "string" }] }

Keep "body" to 3-5 sections. Write real, usable business language, not placeholders. Do not invent illegal, defamatory, or misleading content. Don't ask more than one clarifying question in a row — after the user answers, draft with what you have even if some minor details are still generic.`;

type Msg = { role: "user" | "ai"; text: string };

export async function POST(request: Request) {
  const body = (await request.json()) as { prompt?: string; messages?: Msg[] };

  const history: Msg[] = body.messages?.length ? body.messages : body.prompt ? [{ role: "user", text: body.prompt }] : [];
  if (history.length === 0) {
    return NextResponse.json({ error: "Missing prompt." }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ configured: false }, { status: 200 });
  }

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-5",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
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

  let parsed: { type?: string; question?: string; title?: string; meta?: string; reply?: string; body?: { heading: string; text: string }[] };
  try {
    parsed = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: "Could not parse the model's response." }, { status: 502 });
  }

  if (parsed.type === "question" && parsed.question) {
    return NextResponse.json({ configured: true, type: "question", question: parsed.question });
  }

  return NextResponse.json({ configured: true, type: "document", ...parsed });
}
