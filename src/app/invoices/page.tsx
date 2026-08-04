"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import { useHasSession } from "@/lib/useSession";
import { isBackendConfigured } from "@/lib/backendStatus";
import SendInvoice from "@/components/invoices/SendInvoice";
import { IconSparkle, IconInvoices, IconMail } from "@/components/icons";

const demoInvoices = [
  { number: "INV-2041", client: "Halcyon Ventures", amount: "$18,500.00", due: "Jul 21, 2026", status: "Paid", statusTag: "tag-neutral" },
  { number: "INV-2040", client: "Northbeam Co.", amount: "$6,750.00", due: "Jul 17, 2026", status: "Paid", statusTag: "tag-neutral" },
  { number: "INV-2039", client: "Vantage Media", amount: "$5,200.00", due: "Jul 16, 2026", status: "Paid", statusTag: "tag-neutral" },
  { number: "INV-2038", client: "Figment Design", amount: "$4,200.00", due: "Jul 15, 2026", status: "Overdue", statusTag: "tag-outline" },
  { number: "INV-2037", client: "Brightfield Academy", amount: "$9,800.00", due: "Jul 28, 2026", status: "Pending", statusTag: "tag-accent" },
  { number: "INV-2036", client: "Atlas Chambers", amount: "$12,400.00", due: "Aug 2, 2026", status: "Draft", statusTag: "tag-neutral" },
];

const demoKpis = [
  { label: "Outstanding", value: "$14,000.00", metaLabel: "2 invoices" },
  { label: "Paid this month", value: "$30,450.00", meta: "▲ 11%", metaLabel: "vs June" },
  { label: "Overdue", value: "$4,200.00", metaLabel: "1 invoice, 6 days" },
  { label: "Drafts", value: "1", metaLabel: "not yet sent" },
];

type PaymentEvent = {
  id: string;
  amount_cents: number;
  customer_email: string | null;
  created_at: string;
  payment_links: { title: string; currency: string } | { title: string; currency: string }[];
};

type SendableInvoice = {
  id: string;
  title: string;
  amount_cents: number;
  currency: string;
  kind: "one_time" | "recurring";
  interval: string | null;
  uses_count: number;
  status: string;
  created_at: string;
};

function linkInfo(e: PaymentEvent) {
  return Array.isArray(e.payment_links) ? e.payment_links[0] : e.payment_links;
}

function money(cents: number, currency: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: currency.toUpperCase() }).format(cents / 100);
}

export default function InvoicesPage() {
  const { hasSession, checked } = useHasSession();
  const [live, setLive] = useState(false);
  const [events, setEvents] = useState<PaymentEvent[]>([]);
  const [sendable, setSendable] = useState<SendableInvoice[]>([]);
  const [tenantName, setTenantName] = useState("");

  useEffect(() => {
    if (!checked || !isBackendConfigured || !hasSession) return;
    fetch("/api/invoices")
      .then((r) => r.json())
      .then((data) => {
        if (data.configured) {
          setLive(true);
          if (data.events) setEvents(data.events);
          if (data.links) setSendable(data.links);
          if (data.tenantName) setTenantName(data.tenantName);
        }
      })
      .catch(() => {});
  }, [checked, hasSession]);

  const rows = live
    ? events.map((e, i) => ({
        number: `PAY-${String(events.length - i).padStart(4, "0")}`,
        client: e.customer_email || linkInfo(e)?.title || "Customer",
        amount: (e.amount_cents / 100).toLocaleString(undefined, { style: "currency", currency: (linkInfo(e)?.currency || "usd").toUpperCase() }),
        due: new Date(e.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        status: "Paid",
        statusTag: "tag-neutral",
      }))
    : demoInvoices;

  const totalPaidCents = live ? events.reduce((s, e) => s + e.amount_cents, 0) : 0;

  const kpis = live
    ? [
        { label: "Total received", value: `$${(totalPaidCents / 100).toLocaleString()}`, metaLabel: `${events.length} real payments` },
        { label: "Paid invoices", value: String(events.length), metaLabel: "via real payment links" },
        { label: "Outstanding", value: "$0.00", metaLabel: "no net-terms invoicing yet" },
        { label: "Drafts", value: "0", metaLabel: "not yet sent" },
      ]
    : demoKpis;

  return (
    <div className="flex min-h-screen bg-[var(--color-bg)]">
      <Sidebar active="Invoices" />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <main className="p-4 pt-16 sm:p-[24px_28px_28px] flex flex-col gap-5 min-w-0">
          <div className="flex items-end gap-3 flex-wrap">
            <div>
              <h3 className="m-0 text-[22px]">Invoices</h3>
              <div className="text-muted text-[12.5px] mt-[3px]">
                {live ? "Real payments received via your payment links" : "Meridian Studio · billed in USD"}
              </div>
            </div>
            <div className="flex-1 hidden sm:block" />
            <a href="/assistant" className="btn btn-secondary text-[13px]">
              <IconSparkle size={14} />
              Generate with AI
            </a>
            <a href="/payments" className="btn btn-primary text-[13px]">
              <IconInvoices size={14} />
              New payment link
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {kpis.map((kpi) => (
              <div key={kpi.label} className="card elev-sm gap-1 p-[14px_16px]">
                <div className="text-[10.5px] tracking-[.08em] uppercase text-[var(--color-neutral-500)]">{kpi.label}</div>
                <div className="font-medium text-[23px]">{kpi.value}</div>
                <div className="card-meta">
                  {"meta" in kpi && kpi.meta && <span className="tag tag-accent text-[9.5px]">{kpi.meta}</span>}
                  {kpi.metaLabel}
                </div>
              </div>
            ))}
          </div>

          {live && (
            <div className="card elev-sm p-[16px_18px] gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <IconMail size={14} className="text-[var(--color-accent)]" />
                <div className="card-title text-sm">Send an invoice</div>
                <div className="flex-1" />
                <a href="/payments" className="btn btn-secondary text-[12px]">
                  <IconInvoices size={13} />
                  New invoice
                </a>
              </div>
              <div className="text-[11.5px] text-[var(--color-neutral-500)]">
                Each one has its own web page your client can open and pay from. Email the link, or paste it into
                a message — Primue doesn&rsquo;t send the email for you yet, so &ldquo;Email this invoice&rdquo;
                opens your own mail app with everything already written.
              </div>

              {sendable.length === 0 ? (
                <div className="text-[12.5px] text-[var(--color-neutral-500)] py-2">
                  No invoices yet. <a href="/payments" style={{ color: "var(--color-accent-300)" }}>Create one →</a>
                </div>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {sendable.map((inv) => {
                    // A recurring link is never "Paid" — it keeps collecting on
                    // every cycle, so a past payment makes it Active, not settled.
                    const used = inv.uses_count > 0;
                    const paid = used && inv.kind !== "recurring";
                    const label = inv.status !== "active" ? "Archived" : paid ? "Paid" : used ? "Active" : "Unpaid";
                    return (
                      <div
                        key={inv.id}
                        className="flex flex-col gap-2.5 p-3 rounded-lg"
                        style={{ background: "var(--color-bg)" }}
                      >
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <div className="min-w-0">
                            <div className="text-[13px] truncate">{inv.title}</div>
                            <div className="text-[11px] text-[var(--color-neutral-500)] font-mono">
                              INV-{inv.id.slice(0, 8).toUpperCase()}
                            </div>
                          </div>
                          <div className="flex-1" />
                          <div className="text-[13.5px]">
                            {money(inv.amount_cents, inv.currency)}
                            {inv.kind === "recurring" && inv.interval ? `/${inv.interval}` : ""}
                          </div>
                          <span className={`tag ${paid || used ? "tag-accent" : "tag-outline"}`}>
                            {label}
                          </span>
                        </div>
                        <SendInvoice
                          invoiceId={inv.id}
                          title={inv.title}
                          amountLabel={money(inv.amount_cents, inv.currency)}
                          senderName={tenantName || "us"}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          <div className="card elev-sm p-[16px_18px] gap-2.5 overflow-x-auto">
            <div className="card-title text-sm">{live ? "Payments received" : "All invoices"}</div>
            {live && (
              <div className="text-[11px] text-[var(--color-neutral-500)] -mt-1">
                Real money already collected. Primue doesn&rsquo;t track net-terms due dates yet, so the date
                column is when payment landed.
              </div>
            )}
            {rows.length === 0 ? (
              <div className="text-[12.5px] text-[var(--color-neutral-500)] p-4 text-center">
                No payments yet. <a href="/payments" style={{ color: "var(--color-accent-300)" }}>Create a payment link →</a>
              </div>
            ) : (
              <table className="table text-[12.5px] min-w-[480px]">
                <thead>
                  <tr>
                    <th>Invoice</th>
                    <th>Client</th>
                    <th>Amount</th>
                    <th>{live ? "Paid on" : "Due date"}</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((inv) => (
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
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
