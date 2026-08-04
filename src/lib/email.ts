// Resend over their plain REST API rather than the resend npm package — the
// app already talks to Anthropic and Stripe the same way (raw fetch, no
// vendor SDK), and a single POST doesn't justify a new dependency.
//
// Not configured until RESEND_API_KEY is set (and, for real delivery, a
// sending domain verified in the Resend dashboard) — same "flag it, don't
// fake it" pattern as every other integration in this app (Stripe, the
// Anthropic key). Until then, callers get a clear, honest reason instead of
// a silently-swallowed failure.
export const isEmailConfigured = !!process.env.RESEND_API_KEY;

export async function sendEmail({
  to,
  subject,
  html,
  replyTo,
}: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!isEmailConfigured) {
    return { ok: false, error: "Email sending isn't set up yet — add a RESEND_API_KEY in your environment (resend.com has a free tier) and verify a sending domain." };
  }

  const from = process.env.RESEND_FROM_EMAIL || "Primue <onboarding@resend.dev>";

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${process.env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({ from, to, subject, html, reply_to: replyTo }),
  });

  if (!res.ok) {
    const detail = await res.text();
    return { ok: false, error: `Resend rejected the email: ${detail}` };
  }
  return { ok: true };
}
