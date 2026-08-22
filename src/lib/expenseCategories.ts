// Keyword-based, not AI-based: cheap and instant on every page load, rather
// than a paid/latency-adding classification call per transaction. Trades some
// accuracy (an unrecognized counterparty falls into "Vendor payments" by
// default) for being genuinely real — computed from the tenant's own
// transactions, not fabricated — with zero added cost or delay.
export type ExpenseCategory = "Payroll" | "Software & tools" | "Vendor payments" | "Office & ops";

const PAYROLL_KEYWORDS = ["payroll", "salary", "salaries", "wage", "gusto", "adp", "rippling"];

const SOFTWARE_KEYWORDS = [
  "aws", "amazon web services", "stripe", "nowpayments", "notion", "vercel", "github",
  "slack", "zoom", "figma", "openai", "anthropic", "claude", "adobe", "dropbox",
  "supabase", "cloudflare", "google workspace", "microsoft", "azure", "digitalocean",
  "heroku", "twilio", "sendgrid", "mailchimp", "hubspot", "salesforce", "zendesk",
  "intercom", "linear", "asana", "trello", "quickbooks", "xero", "canva", "webflow",
  "shopify", "resend", "postmark", "software", "saas", "subscription",
];

const OFFICE_KEYWORDS = [
  "rent", "office", "utilities", "electric", "internet", "insurance", "lease",
  "wework", "regus", "coworking",
];

export function categorizeExpense(counterparty: string, memo: string | null): ExpenseCategory {
  const text = `${counterparty} ${memo ?? ""}`.toLowerCase();
  if (PAYROLL_KEYWORDS.some((k) => text.includes(k))) return "Payroll";
  if (SOFTWARE_KEYWORDS.some((k) => text.includes(k))) return "Software & tools";
  if (OFFICE_KEYWORDS.some((k) => text.includes(k))) return "Office & ops";
  return "Vendor payments";
}

export const EXPENSE_CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  "Payroll": "var(--color-accent)",
  "Software & tools": "var(--color-accent-600)",
  "Vendor payments": "var(--color-neutral-600)",
  "Office & ops": "var(--color-neutral-700)",
};

export function sumByCategory(
  transactions: { direction: "credit" | "debit"; amount_cents: number; counterparty: string; memo: string | null }[]
): Record<ExpenseCategory, number> {
  const totals: Record<ExpenseCategory, number> = { "Payroll": 0, "Software & tools": 0, "Vendor payments": 0, "Office & ops": 0 };
  for (const t of transactions) {
    if (t.direction !== "debit") continue;
    totals[categorizeExpense(t.counterparty, t.memo)] += t.amount_cents;
  }
  return totals;
}
