import crypto from "crypto";

// Raw REST calls, same pattern as stripe.ts/email.ts talking to their own
// APIs — no NOWPayments SDK dependency for a couple of endpoints.
export const isNowPaymentsConfigured = !!process.env.NOWPAYMENTS_API_KEY;

const BASE_URL = "https://api.nowpayments.io/v1";

export async function createInvoice({
  priceAmountCents,
  priceCurrency,
  orderId,
  orderDescription,
  ipnCallbackUrl,
}: {
  priceAmountCents: number;
  priceCurrency: string;
  orderId: string;
  orderDescription: string;
  ipnCallbackUrl: string;
}): Promise<{ id: string; invoice_url: string }> {
  const res = await fetch(`${BASE_URL}/invoice`, {
    method: "POST",
    headers: {
      "x-api-key": process.env.NOWPAYMENTS_API_KEY!,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      price_amount: priceAmountCents / 100,
      price_currency: priceCurrency,
      order_id: orderId,
      order_description: orderDescription,
      ipn_callback_url: ipnCallbackUrl,
    }),
  });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`NOWPayments rejected the request: ${detail}`);
  }
  return res.json();
}

// NOWPayments signs each IPN body with HMAC-SHA512 over the JSON-stringified
// payload, keys sorted alphabetically (recursively) with no extra whitespace —
// their documented algorithm, not something inferred.
function sortKeysDeep(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortKeysDeep);
  if (value !== null && typeof value === "object") {
    return Object.keys(value as Record<string, unknown>)
      .sort()
      .reduce((acc, key) => {
        acc[key] = sortKeysDeep((value as Record<string, unknown>)[key]);
        return acc;
      }, {} as Record<string, unknown>);
  }
  return value;
}

export function verifyIpnSignature(rawBody: string, signature: string | null): boolean {
  const secret = process.env.NOWPAYMENTS_IPN_SECRET;
  if (!signature || !secret) return false;
  let parsed: unknown;
  try {
    parsed = JSON.parse(rawBody);
  } catch {
    return false;
  }
  const sorted = JSON.stringify(sortKeysDeep(parsed));
  const expected = crypto.createHmac("sha512", secret).update(sorted).digest("hex");
  const expectedBuf = Buffer.from(expected);
  const signatureBuf = Buffer.from(signature);
  if (expectedBuf.length !== signatureBuf.length) return false;
  return crypto.timingSafeEqual(expectedBuf, signatureBuf);
}
