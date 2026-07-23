"use client";

import AdminSidebar from "@/components/admin/AdminSidebar";
import { IconDownload } from "@/components/icons";

const kpis = [
  { label: "Platform MRR", value: "$186,420", meta: "▲ 6.2%", metaLabel: "vs June" },
  { label: "Platform ARR", value: "$2.24M", metaLabel: "run rate" },
  { label: "Active subscriptions", value: "397", meta: "▲ 14", metaLabel: "this month" },
  { label: "Past due", value: "$14,220", metaLabel: "8 invoices at risk" },
];

const planDistribution = [
  { label: "Starter", count: 142, note: "free" },
  { label: "Standard", count: 118, note: "$29/user/mo" },
  { label: "Growth", count: 104, note: "$49/user/mo" },
  { label: "Enterprise", count: 48, note: "custom" },
];
const maxCount = Math.max(...planDistribution.map((p) => p.count));

const invoices = [
  { org: "Harbor City Council", plan: "Enterprise", planTag: "tag-accent", amount: "$18,400.00", date: "Jul 14, 2026", status: "Pending", statusTag: "tag-outline" },
  { org: "Atlas Chambers", plan: "Enterprise", planTag: "tag-accent", amount: "$4,200.00", date: "Jul 20, 2026", status: "Paid", statusTag: "tag-neutral" },
  { org: "Brightfield Academy", plan: "Standard", planTag: "tag-neutral", amount: "$1,015.00", date: "Jul 15, 2026", status: "Paid", statusTag: "tag-neutral" },
  { org: "Meridian Studio", plan: "Growth", planTag: "tag-accent", amount: "$686.00", date: "Jul 18, 2026", status: "Paid", statusTag: "tag-neutral" },
  { org: "Fernbank Logistics", plan: "Growth", planTag: "tag-accent", amount: "$539.00", date: "Jul 9, 2026", status: "Failed", statusTag: "tag-outline" },
  { org: "Cascade Relief (NGO)", plan: "Standard", planTag: "tag-neutral", amount: "N/A", date: "Trial · ends Aug 4", status: "Trial", statusTag: "tag-outline" },
];

function exportInvoicesCsv() {
  const rows = [
    ["Organization", "Plan", "Amount", "Billing date", "Status"],
    ...invoices.map((inv) => [inv.org, inv.plan, inv.amount, inv.date, inv.status]),
  ];
  const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "origin-platform-invoices.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminBillingPage() {
  return (
    <div className="min-h-screen flex bg-[var(--color-bg)] text-[var(--color-text)]">
      <AdminSidebar active="Billing & plans" />

      <main className="flex-1 min-w-0 p-4 pt-16 md:p-[22px_26px] flex flex-col gap-[18px]">
        <div className="flex items-end gap-3 flex-wrap">
          <div>
            <h4 className="m-0 text-[19px]">Billing & plans</h4>
            <div className="text-muted text-xs mt-0.5">
              Platform-wide subscription revenue · billed in USD across all tenants
            </div>
          </div>
          <div className="flex-1 hidden sm:block" />
          <button className="btn btn-secondary text-[12.5px]" onClick={exportInvoicesCsv}>
            <IconDownload size={13} />
            Export CSV
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {kpis.map((kpi) => (
            <div key={kpi.label} className="card elev-sm gap-1 p-[14px_16px]">
              <div className="text-[10.5px] tracking-[.08em] uppercase text-[var(--color-neutral-500)]">{kpi.label}</div>
              <div className="font-medium text-[23px]">{kpi.value}</div>
              <div className="card-meta">
                {kpi.meta && <span className="tag tag-accent text-[9.5px]">{kpi.meta}</span>}
                {kpi.metaLabel}
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-3 grid-cols-1 lg:grid-cols-[1.1fr_1fr]">
          <div className="card elev-sm p-[18px_20px] gap-3">
            <div className="flex items-baseline gap-2.5">
              <div className="card-title text-[15px]">Platform revenue</div>
              <div className="card-meta">Jul 2025 – Jul 2026</div>
            </div>
            <svg viewBox="0 0 460 150" className="w-full h-auto block" role="img" aria-label="Platform revenue trending up across twelve months">
              <defs>
                <linearGradient id="billingRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#968ae0" stopOpacity="0.28" />
                  <stop offset="1" stopColor="#968ae0" stopOpacity="0" />
                </linearGradient>
              </defs>
              <g stroke="rgba(233,233,237,0.09)" strokeWidth="1">
                <path d="M0 38h460M0 76h460M0 114h460" />
              </g>
              <path
                d="M0 118 L42 110 L84 114 L126 98 L168 102 L210 84 L252 90 L294 66 L336 72 L378 48 L420 54 L460 34 L460 150 L0 150 Z"
                fill="url(#billingRev)"
              />
              <path
                d="M0 118 L42 110 L84 114 L126 98 L168 102 L210 84 L252 90 L294 66 L336 72 L378 48 L420 54 L460 34"
                fill="none"
                stroke="#968ae0"
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </svg>
            <div className="card-meta justify-between">
              <span>Jul 2025</span>
              <span style={{ color: "var(--color-accent-300)" }}>+38% YoY</span>
              <span>Jul 2026</span>
            </div>
          </div>

          <div className="card elev-sm p-[18px_20px] gap-3">
            <div className="card-title text-[15px]">Plan distribution</div>
            <div className="flex flex-col gap-3 mt-1">
              {planDistribution.map((p) => (
                <div key={p.label} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-[12.5px]">
                    <span>{p.label}</span>
                    <span className="text-[var(--color-neutral-500)]">
                      {p.count} · {p.note}
                    </span>
                  </div>
                  <div className="h-[6px] rounded-full" style={{ background: "var(--color-neutral-800)" }}>
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${(p.count / maxCount) * 100}%`, background: "var(--color-accent)" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card elev-sm p-[16px_18px] gap-2.5 overflow-x-auto">
          <div className="card-title text-sm">Recent invoices</div>
          <table className="table text-[12.5px] min-w-[480px]">
            <thead>
              <tr>
                <th>Organization</th>
                <th>Plan</th>
                <th>Amount</th>
                <th>Billing date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.org + inv.date}>
                  <td>{inv.org}</td>
                  <td>
                    <span className={`tag ${inv.planTag}`}>{inv.plan}</span>
                  </td>
                  <td>{inv.amount}</td>
                  <td>{inv.date}</td>
                  <td>
                    <span className={`tag ${inv.statusTag}`}>{inv.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="card-meta justify-between">
            <span>Showing 6 of 397 active subscriptions</span>
            <span>Failed payments retry automatically for 5 days before a tenant is flagged</span>
          </div>
        </div>
      </main>
    </div>
  );
}
