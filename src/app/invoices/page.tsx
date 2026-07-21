import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import { IconSparkle, IconInvoices } from "@/components/icons";

const invoices = [
  { number: "INV-2041", client: "Halcyon Ventures", amount: "$18,500.00", due: "Jul 21, 2026", status: "Paid", statusTag: "tag-neutral" },
  { number: "INV-2040", client: "Northbeam Co.", amount: "$6,750.00", due: "Jul 17, 2026", status: "Paid", statusTag: "tag-neutral" },
  { number: "INV-2039", client: "Vantage Media", amount: "$5,200.00", due: "Jul 16, 2026", status: "Paid", statusTag: "tag-neutral" },
  { number: "INV-2038", client: "Figment Design", amount: "$4,200.00", due: "Jul 15, 2026", status: "Overdue", statusTag: "tag-outline" },
  { number: "INV-2037", client: "Brightfield Academy", amount: "$9,800.00", due: "Jul 28, 2026", status: "Pending", statusTag: "tag-accent" },
  { number: "INV-2036", client: "Atlas Chambers", amount: "$12,400.00", due: "Aug 2, 2026", status: "Draft", statusTag: "tag-neutral" },
];

const kpis = [
  { label: "Outstanding", value: "$14,000.00", metaLabel: "2 invoices" },
  { label: "Paid this month", value: "$30,450.00", meta: "▲ 11%", metaLabel: "vs June" },
  { label: "Overdue", value: "$4,200.00", metaLabel: "1 invoice, 6 days" },
  { label: "Drafts", value: "1", metaLabel: "not yet sent" },
];

export default function InvoicesPage() {
  return (
    <div className="flex min-h-screen bg-[var(--color-bg)]">
      <Sidebar active="Invoices" />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <main className="p-[24px_28px_28px] flex flex-col gap-5 min-w-0">
          <div className="flex items-end gap-3">
            <div>
              <h3 className="m-0 text-[22px]">Invoices</h3>
              <div className="text-muted text-[12.5px] mt-[3px]">Meridian Studio · billed in USD</div>
            </div>
            <div className="flex-1" />
            <a href="/assistant" className="btn btn-secondary text-[13px]">
              <IconSparkle size={14} />
              Generate with AI
            </a>
            <a href="/templates" className="btn btn-primary text-[13px]">
              <IconInvoices size={14} />
              New invoice
            </a>
          </div>

          <div className="grid grid-cols-4 gap-3.5">
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

          <div className="card elev-sm p-[16px_18px] gap-2.5">
            <div className="card-title text-sm">All invoices</div>
            <table className="table text-[12.5px]">
              <thead>
                <tr>
                  <th>Invoice</th>
                  <th>Client</th>
                  <th>Amount</th>
                  <th>Due date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.number}>
                    <td className="font-mono text-[11.5px]">{inv.number}</td>
                    <td>{inv.client}</td>
                    <td>{inv.amount}</td>
                    <td>{inv.due}</td>
                    <td>
                      <span className={`tag ${inv.statusTag}`}>{inv.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
