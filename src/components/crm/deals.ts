export type Stage = "Lead" | "Qualified" | "Proposal" | "Negotiation" | "Won";

export type Deal = {
  id: string;
  company: string;
  title: string;
  value: string;
  contact: string;
  stage: Stage;
  days: number;
  notes?: string;
};

// Static, illustrative FX rates (approximate, not a live feed) — good enough to
// compare pipeline value across currencies without wiring a paid FX API.
export const fxRates: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.78,
  NGN: 1550,
  KES: 129,
  ZAR: 18.2,
};

export function convertFromUsd(usd: number, currency: string): number {
  return usd * (fxRates[currency] ?? 1);
}

export function formatCurrency(amount: number, currency: string): string {
  try {
    return amount.toLocaleString(undefined, { style: "currency", currency, maximumFractionDigits: 0 });
  } catch {
    return `${currency} ${Math.round(amount).toLocaleString()}`;
  }
}

export const stages: Stage[] = ["Lead", "Qualified", "Proposal", "Negotiation", "Won"];

export const initialDeals: Deal[] = [
  { id: "d1", company: "Fernbank Logistics", title: "Platform migration", value: "$12,400", contact: "R. Otieno", stage: "Lead", days: 3 },
  { id: "d2", company: "Solstice Retail", title: "POS + wallet rollout", value: "$8,200", contact: "L. Marsh", stage: "Lead", days: 6 },
  { id: "d3", company: "Ridgeline Co-op", title: "Payroll pilot", value: "$5,600", contact: "T. Fenn", stage: "Lead", days: 1 },
  { id: "d4", company: "Vantage Media", title: "Agency suite", value: "$15,600", contact: "J. Cole", stage: "Qualified", days: 9 },
  { id: "d5", company: "Harbor City Council", title: "Gov services expansion", value: "$84,000", contact: "M. Reyes", stage: "Qualified", days: 14 },
  { id: "d6", company: "Brightfield Academy", title: "Campus-wide rollout", value: "$22,000", contact: "S. Grant", stage: "Proposal", days: 4 },
  { id: "d7", company: "Cascade Relief", title: "NGO donor wallet", value: "$9,800", contact: "P. Nyong'o", stage: "Proposal", days: 11 },
  { id: "d8", company: "Atlas Chambers", title: "Enterprise renewal + seats", value: "$31,200", contact: "D. Okafor", stage: "Negotiation", days: 2 },
  { id: "d9", company: "Meridian Studio", title: "Growth plan upgrade", value: "$8,232", contact: "A. Owusu", stage: "Won", days: 0 },
  { id: "d10", company: "Northbeam Co.", title: "Wallet + AI bundle", value: "$18,500", contact: "K. Lindqvist", stage: "Won", days: 0 },
];
