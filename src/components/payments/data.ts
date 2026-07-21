export const paymentLinks = [
  { name: "Invoice #INV-2041", amount: "$18,500.00", type: "One-time", status: "Paid", statusTag: "tag-neutral", created: "Jul 19, 2026", uses: 1 },
  { name: "Website design retainer", amount: "$4,500.00/mo", type: "Recurring", status: "Active", statusTag: "tag-accent", created: "Jun 2, 2026", uses: 3 },
  { name: "Workshop tickets", amount: "$150.00", type: "One-time", status: "Active", statusTag: "tag-accent", created: "Jul 10, 2026", uses: 12 },
  { name: "Consulting deposit", amount: "$2,000.00", type: "One-time", status: "Expired", statusTag: "tag-outline", created: "May 15, 2026", uses: 0 },
];

export const beneficiaries = [
  { name: "AWS", account: "•• 7742", bank: "Wells Fargo" },
  { name: "Figment Design", account: "•• 3310", bank: "Chase" },
  { name: "Payroll pool", account: "•• 4417", bank: "Column Bank N.A." },
  { name: "Northbeam Co.", account: "•• 9021", bank: "Mercury" },
];

export const paymentHistory = [
  { party: "Halcyon Ventures", method: "ACH", date: "Jul 21", status: "Received", statusTag: "tag-accent", amount: "+$18,500.00" },
  { party: "AWS", method: "Card", date: "Jul 20", status: "Cleared", statusTag: "tag-neutral", amount: "−$2,340.18" },
  { party: "Northbeam Co.", method: "Wire", date: "Jul 17", status: "Received", statusTag: "tag-accent", amount: "+$6,750.00" },
  { party: "Figment Design", method: "Card", date: "Jul 15", status: "Pending", statusTag: "tag-outline", amount: "+$4,200.00" },
  { party: "Workshop tickets ×12", method: "Card", date: "Jul 10–19", status: "Received", statusTag: "tag-accent", amount: "+$1,800.00" },
];

export const webhookEvents = [
  { event: "payment.succeeded", endpoint: "api.meridian.app/webhooks/nex", code: 200, time: "Jul 21, 09:14" },
  { event: "payment_link.created", endpoint: "api.meridian.app/webhooks/nex", code: 200, time: "Jul 19, 14:02" },
  { event: "subscription.renewed", endpoint: "api.meridian.app/webhooks/nex", code: 200, time: "Jul 18, 08:00" },
  { event: "payment.failed", endpoint: "api.meridian.app/webhooks/nex", code: 500, time: "Jul 16, 22:41" },
];
