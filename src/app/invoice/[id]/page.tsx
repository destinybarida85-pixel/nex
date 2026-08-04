"use client";

import { use, useEffect, useState } from "react";
import { IconLogoMark, IconCheckCircle, IconLock, IconDownload } from "@/components/icons";

type Invoice = {
  id: string;
  title: string;
  amountCents: number;
  currency: string;
  kind: "one_time" | "recurring";
  interval: string | null;
  payUrl: string | null;
  issuedAt: string;
  paidAt: string | null;
  from: { name: string; accent: string; logoUrl: string | null; poweredBy: boolean };
};

function money(cents: number, currency: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: currency.toUpperCase() }).format(cents / 100);
}

function longDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-[var(--color-neutral-900)] flex flex-col items-center py-12 px-4 overflow-hidden">
      <div className="nx-grid-bg absolute inset-0 pointer-events-none no-print" />
      <div className="relative flex items-center gap-2.5 mb-8 no-print">
        <IconLogoMark size={26} />
        <span className="font-medium text-[16px] text-[var(--color-text)]">Primue</span>
        <span className="text-[13px] text-[var(--color-neutral-500)] ml-1">invoice</span>
      </div>
      {children}
    </div>
  );
}

export default function PublicInvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/invoices/${id}/public`)
      .then((r) => r.json())
      .then((data) => {
        if (!data.configured || !data.invoice) {
          setNotFound(true);
          return;
        }
        setInvoice(data.invoice);
      })
      .catch(() => setNotFound(true));
  }, [id]);

  if (notFound) {
    return (
      <Shell>
        <div
          className="relative w-full max-w-[440px] mt-8 p-8 rounded-2xl bg-[var(--color-bg)] text-[var(--color-text)] text-center"
          style={{ boxShadow: "var(--shadow-lg)" }}
        >
          <div className="text-[16px] font-medium">This invoice isn&rsquo;t available.</div>
          <div className="text-[13.5px] text-[var(--color-neutral-500)] mt-1.5">
            It may have been removed, or the link is incomplete.
          </div>
        </div>
      </Shell>
    );
  }

  if (!invoice) return <Shell><div /></Shell>;

  const { from, paidAt } = invoice;
  const accent = from.accent;
  const shortId = invoice.id.slice(0, 8).toUpperCase();
  const isRecurring = invoice.kind === "recurring";
  const recurringSuffix = isRecurring && invoice.interval ? ` / ${invoice.interval}` : "";
  // A subscription is never "paid in full" — closing it out after the first
  // payment would hide the Pay button forever and leave the customer with no
  // way to pay the next cycle from the link they were sent. Only a one-time
  // invoice is settled by a single payment.
  const settled = !!paidAt && !isRecurring;

  return (
    <Shell>
      <div className="relative w-full max-w-[620px] flex flex-col gap-4 print-area">
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: "#f5f5f7", color: "#1a1a1f", boxShadow: "var(--shadow-lg)" }}
        >
          <div className="p-7 sm:p-10 flex flex-col gap-7">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-2.5 min-w-0">
                {from.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={from.logoUrl} alt="" className="w-9 h-9 rounded-[9px] object-cover flex-none" />
                ) : (
                  <span
                    className="w-9 h-9 rounded-[9px] grid place-items-center font-semibold text-[15px] flex-none"
                    style={{ background: accent, color: "#fff" }}
                  >
                    {from.name.charAt(0) || "?"}
                  </span>
                )}
                <span className="font-medium text-[16px] truncate">{from.name || "Invoice"}</span>
              </div>
              <div className="text-right flex-none">
                <div className="text-[20px] font-medium tracking-[0.04em]" style={{ color: accent }}>
                  INVOICE
                </div>
                <div className="text-[13px] mt-0.5 font-mono" style={{ color: "#6b6b76" }}>
                  INV-{shortId}
                </div>
              </div>
            </div>

            <div className="flex gap-8 flex-wrap text-[13px]" style={{ color: "#6b6b76" }}>
              <div>
                <div className="uppercase tracking-[.06em] text-[10px]">Issued</div>
                <div style={{ color: "#1a1a1f" }}>{longDate(invoice.issuedAt)}</div>
              </div>
              <div>
                <div className="uppercase tracking-[.06em] text-[10px]">Billed by</div>
                <div style={{ color: "#1a1a1f" }}>{from.name || "—"}</div>
              </div>
              <div>
                <div className="uppercase tracking-[.06em] text-[10px]">Status</div>
                <div style={{ color: settled ? "#1f7a4d" : "#1a1a1f" }}>
                  {settled
                    ? `Paid ${longDate(paidAt!)}`
                    : paidAt
                      ? `Active · last paid ${longDate(paidAt)}`
                      : "Awaiting payment"}
                </div>
              </div>
            </div>

            <table className="w-full text-[13.5px]" style={{ borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: `1.5px solid ${accent}` }}>
                  <th className="text-left pb-2 font-medium" style={{ color: "#6b6b76" }}>Description</th>
                  <th className="text-right pb-2 font-medium" style={{ color: "#6b6b76" }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: "1px solid #e4e4ea" }}>
                  <td className="py-3">{invoice.title}</td>
                  <td className="text-right py-3">
                    {money(invoice.amountCents, invoice.currency)}
                    {recurringSuffix}
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="flex justify-end">
              <div className="w-[220px] flex flex-col gap-1.5 text-[13.5px]">
                <div
                  className="flex justify-between text-[17px] font-medium pt-1.5"
                  style={{ borderTop: `1.5px solid ${accent}`, color: "#1a1a1f" }}
                >
                  <span>{settled ? "Total paid" : isRecurring ? "Amount per cycle" : "Total due"}</span>
                  <span>{money(invoice.amountCents, invoice.currency)}</span>
                </div>
              </div>
            </div>

            {settled ? (
              <div
                className="rounded-lg p-4 flex items-center gap-2.5 text-[13.5px]"
                style={{ background: "#e6f4ec", color: "#1f7a4d" }}
              >
                <IconCheckCircle size={16} />
                Paid in full on {longDate(paidAt!)}. Nothing further is owed.
              </div>
            ) : invoice.payUrl ? (
              <div className="flex flex-col gap-2.5">
                <a
                  href={invoice.payUrl}
                  className="no-print rounded-lg py-3 text-center text-[14px] font-medium no-underline"
                  style={{ background: accent, color: "#fff" }}
                >
                  Pay {money(invoice.amountCents, invoice.currency)}
                  {recurringSuffix} securely
                </a>
                <div className="flex items-center justify-center gap-1.5 text-[11px]" style={{ color: "#6b6b76" }}>
                  <IconLock size={11} />
                  Payment is processed by Stripe. {from.name || "The sender"} never sees your card details.
                </div>
              </div>
            ) : (
              <div className="rounded-lg p-4 text-[13px]" style={{ background: "#eceef0", color: "#4a4a54" }}>
                This invoice is no longer accepting payment. Contact {from.name || "the sender"} if you believe
                that&rsquo;s a mistake.
              </div>
            )}

            {from.poweredBy && (
              <div className="text-center text-[10.5px]" style={{ color: "#9a9aa6" }}>
                Powered by Primue
              </div>
            )}
          </div>
        </div>

        <button
          className="btn btn-secondary text-[13.5px] no-print self-center"
          onClick={() => window.print()}
        >
          <IconDownload size={13} />
          Print / Save as PDF
        </button>
      </div>
    </Shell>
  );
}
