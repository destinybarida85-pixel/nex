"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import StripePaymentLinksSection from "@/components/payments/StripePaymentLinksSection";
import Beneficiaries from "@/components/payments/Beneficiaries";
import PaymentHistoryTable from "@/components/payments/PaymentHistoryTable";
import WebhookLog from "@/components/payments/WebhookLog";
import { useHasSession } from "@/lib/useSession";
import { isBackendConfigured } from "@/lib/backendStatus";

const demoKpis = [
  { label: "Processed · 30d", value: "$33,590.18", meta: "▲ 9.4%", metaLabel: "vs June" },
  { label: "Active payment links", value: "2", metaLabel: "12 uses this month" },
  { label: "Active subscriptions", value: "1", metaLabel: "$4,500/mo" },
  { label: "Refunds issued", value: "$0.00", metaLabel: "0 this month" },
];

type PaymentLink = { status: string; uses_count: number };
type WalletTx = { direction: "credit" | "debit"; amount_cents: number; created_at: string };

export default function PaymentsPage() {
  const { hasSession, checked } = useHasSession();
  const [live, setLive] = useState(false);
  const [kpis, setKpis] = useState(demoKpis);

  useEffect(() => {
    if (!checked || !isBackendConfigured || !hasSession) return;
    Promise.all([
      fetch("/api/stripe/payment-links").then((r) => r.json()),
      fetch("/api/wallet").then((r) => r.json()),
    ])
      .then(([linksData, walletData]) => {
        if (!linksData.configured || !walletData.configured) return;
        const links: PaymentLink[] = linksData.links ?? [];
        const transactions: WalletTx[] = walletData.transactions ?? [];
        const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
        const processed30d = transactions
          .filter((t) => t.direction === "credit" && new Date(t.created_at).getTime() >= cutoff)
          .reduce((sum, t) => sum + t.amount_cents, 0);
        const totalUses = links.reduce((sum, l) => sum + l.uses_count, 0);

        setKpis([
          { label: "Processed · 30d", value: `$${(processed30d / 100).toLocaleString()}`, metaLabel: "Real, from your wallet" },
          { label: "Active payment links", value: String(links.filter((l) => l.status === "active").length), metaLabel: `${totalUses} uses total` },
          { label: "Recurring plans", value: "Origin plans only", metaLabel: "see /billing for your own plan" },
          { label: "Refunds issued", value: "$0.00", metaLabel: "Refunds run through Stripe directly" },
        ]);
        setLive(true);
      })
      .catch(() => {});
  }, [checked, hasSession]);

  return (
    <div className="flex min-h-screen bg-[var(--color-bg)]">
      <Sidebar active="Payments" />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <main className="p-4 pt-16 sm:p-[24px_28px_28px] flex flex-col gap-5 min-w-0">
          <div className="flex items-end gap-3 flex-wrap">
            <div>
              <h3 className="m-0 text-[22px]">Payments</h3>
              <div className="text-muted text-[12.5px] mt-[3px]">
                {live ? "Real payment links and transactions" : "Links, recurring billing and transfers for Meridian Studio"}
              </div>
            </div>
            <div className="flex-1 hidden sm:block" />
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

          <div className="grid gap-3.5 items-start grid-cols-1 lg:grid-cols-[2fr_1fr]">
            <StripePaymentLinksSection />
            <Beneficiaries />
          </div>

          <PaymentHistoryTable />
          <WebhookLog />
        </main>
      </div>
    </div>
  );
}
