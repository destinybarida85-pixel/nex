export type WalletTx = {
  id: string;
  party: string;
  type: string;
  date: string;
  status: "Received" | "Sent" | "Cleared" | "Pending";
  statusTag: string;
  amount: string;
  credit: boolean;
};

export const initialTransactions: WalletTx[] = [
  { id: "t1", party: "Halcyon Ventures", type: "Invoice #INV-2041", date: "Jul 21", status: "Received", statusTag: "tag-accent", amount: "+$18,500.00", credit: true },
  { id: "t2", party: "AWS", type: "Vendor payment", date: "Jul 20", status: "Cleared", statusTag: "tag-neutral", amount: "-$2,340.18", credit: false },
  { id: "t3", party: "Payroll · 14 employees", type: "Salary run", date: "Jul 18", status: "Cleared", statusTag: "tag-neutral", amount: "-$41,200.00", credit: false },
  { id: "t4", party: "Northbeam Co.", type: "Payment link", date: "Jul 17", status: "Received", statusTag: "tag-accent", amount: "+$6,750.00", credit: true },
  { id: "t5", party: "Figment Design", type: "Invoice #INV-2038", date: "Jul 15", status: "Pending", statusTag: "tag-outline", amount: "+$4,200.00", credit: true },
];

export const beneficiaries = [
  { name: "AWS", account: "•• 7742", bank: "Wells Fargo", country: "US" },
  { name: "Figment Design", account: "•• 3310", bank: "Chase", country: "US" },
  { name: "Northbeam Co.", account: "•• 9021", bank: "Mercury", country: "US" },
];

export const banksByCountry: Record<string, string[]> = {
  US: ["Wells Fargo", "Chase", "Bank of America", "Mercury", "Citibank"],
  GB: ["Barclays", "HSBC UK", "NatWest", "Lloyds", "Monzo"],
  NG: ["GTBank", "Access Bank", "Zenith Bank", "First Bank", "UBA"],
  KE: ["Equity Bank", "KCB", "Co-operative Bank", "NCBA"],
  ZA: ["Standard Bank", "FNB", "Absa", "Nedbank"],
  CA: ["RBC", "TD Bank", "Scotiabank", "CIBC"],
};

export const countryNames: Record<string, string> = {
  US: "United States",
  GB: "United Kingdom",
  NG: "Nigeria",
  KE: "Kenya",
  ZA: "South Africa",
  CA: "Canada",
};
