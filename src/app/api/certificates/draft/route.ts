import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `You draft the text for a premium achievement certificate inside Primue, a business operating system. The user tells you who it's for and why. Respond with ONLY a JSON object, no prose before or after:

{ "title": "string, 2-4 words, what kind of certificate (e.g. 'Completion', 'Excellence', 'Achievement', 'Appreciation')", "citation": "string, one formal sentence of citation text explaining what the recipient did to earn this, written in third person, no placeholders" }

The "title" appears after the word "CERTIFICATE OF" on the design, so it must read naturally there — do not include the words "Certificate" or "Of". Write the citation the way an actual institution would: specific, dignified, no exclamation points, no filler like "for their outstanding contribution" unless the user actually described a contribution — use what the user told you. If the user gave a name, do not repeat it in the citation (the design already prints the recipient's name above it) — write the citation in the third person without restating who it's for (e.g. "In recognition of outstanding leadership and dedication throughout the 2026 program." not "John Smith is recognized for...").`;

export async function POST(request: Request) {
  const body = (await request.json()) as { prompt?: string };
  const prompt = body.prompt?.trim();
  if (!prompt) return NextResponse.json({ error: "Describe what the certificate is for." }, { status: 400 });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return NextResponse.json({ configured: false }, { status: 200 });

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-5",
      max_tokens: 400,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    return NextResponse.json({ error: `Anthropic API error: ${detail}` }, { status: 502 });
  }

  const data = await res.json();
  const rawText = data.content?.[0]?.text ?? "";
  const text = rawText.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "").trim();

  let parsed: { title?: string; citation?: string };
  try {
    parsed = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: "Could not parse the model's response." }, { status: 502 });
  }
  if (!parsed.title || !parsed.citation) {
    return NextResponse.json({ error: "The model didn't return usable text." }, { status: 502 });
  }

  return NextResponse.json({ configured: true, title: parsed.title, citation: parsed.citation });
}
