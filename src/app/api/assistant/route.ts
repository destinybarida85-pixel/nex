import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are Origin AI, the drafting assistant inside Origin, a white-label business operating system (wallet, documents, e-signature, HR/payroll, CRM, analytics).

A user will ask you to draft a business document (e.g. an NDA, an invoice, an offer letter, or a short report/summary). Respond with ONLY a JSON object, no prose before or after, matching this exact shape:

{
  "title": "string, short document title",
  "meta": "string, one line of context (parties, date, status)",
  "reply": "string, one or two sentences confirming what you drafted, written to the user in chat",
  "body": [{ "heading": "string", "text": "string" }]
}

Keep "body" to 3-5 sections. Write real, usable business language, not placeholders. Do not invent illegal, defamatory, or misleading content.`;

export async function POST(request: Request) {
  const { prompt } = (await request.json()) as { prompt: string };

  if (!prompt || !prompt.trim()) {
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
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    return NextResponse.json({ error: `Anthropic API error: ${detail}` }, { status: 502 });
  }

  const data = await res.json();
  const text = data.content?.[0]?.text ?? "";

  let parsed: { title: string; meta: string; reply: string; body: { heading: string; text: string }[] };
  try {
    parsed = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: "Could not parse the model's response." }, { status: 502 });
  }

  return NextResponse.json({ configured: true, ...parsed });
}
