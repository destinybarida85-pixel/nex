"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import RevenueChart from "@/components/dashboard/RevenueChart";
import HealthScore from "@/components/analytics/HealthScore";
import ExpenseBreakdown from "@/components/analytics/ExpenseBreakdown";
import GrowthChart from "@/components/analytics/GrowthChart";
import { useHasSession } from "@/lib/useSession";
import { isBackendConfigured } from "@/lib/backendStatus";
import { IconSparkle, IconDownload } from "@/components/icons";

const ranges = ["30 days", "Quarter", "Year"];
const rangeDays: Record<string, number> = { "30 days": 30, Quarter: 90, Year: 365 };

const kpisByRange: Record<string, { label: string; value: string; meta?: string; metaLabel: string }[]> = {
  "30 days": [
    { label: "Revenue", value: "$86,240", meta: "▲ 12.4%", metaLabel: "vs prior 30d" },
    { label: "Expenses", value: "$50,670", meta: "▲ 8.1%", metaLabel: "vs prior 30d" },
    { label: "Net margin", value: "41.2%", meta: "▲ 2.1pt", metaLabel: "vs prior 30d" },
    { label: "New customers", value: "14", meta: "▲ 18%", metaLabel: "vs prior 30d" },
  ],
  Quarter: [
    { label: "Revenue", value: "$241,860", meta: "▲ 21.3%", metaLabel: "vs prior quarter" },
    { label: "Expenses", value: "$146,220", meta: "▲ 9.4%", metaLabel: "vs prior quarter" },
    { label: "Net margin", value: "39.5%", meta: "▲ 4.6pt", metaLabel: "vs prior quarter" },
    { label: "New customers", value: "37", meta: "▲ 26%", metaLabel: "vs prior quarter" },
  ],
  Year: [
    { label: "Revenue", value: "$938,420", meta: "▲ 34.8%", metaLabel: "vs prior year" },
    { label: "Expenses", value: "$561,900", meta: "▲ 14.2%", metaLabel: "vs prior year" },
    { label: "Net margin", value: "40.1%", meta: "▲ 7.3pt", metaLabel: "vs prior year" },
    { label: "New customers", value: "142", meta: "▲ 61%", metaLabel: "vs prior year" },
  ],
};

type WalletTx = { direction: "credit" | "debit"; amount_cents: number; created_at: string; counterparty: string };

export default function AnalyticsPage() {
  const { hasSession, checked } = useHasSession();
  const [range, setRange] = useState("30 days");
  const [live, setLive] = useState(false);
  const [transactions, setTransactions] = useState<WalletTx[]>([]);

  useEffect(() => {
    if (!checked || !isBackendConfigured || !hasSession) return;
    fetch("/api/wallet")
      .then((r) => r.json())
      .then((data) => {
        if (data.configured) {
          setLive(true);
          setTransactions(data.transactions ?? []);
        }
      })
      .catch(() => {});
  }, [checked, hasSession]);

  let kpis = kpisByRange[range];
  if (live) {
    const cutoff = Date.now() - rangeDays[range] * 24 * 60 * 60 * 1000;
    const inRange = transactions.filter((t) => new Date(t.created_at).getTime() >= cutoff);
    const revenueCents = inRange.filter((t) => t.direction === "credit").reduce((s, t) => s + t.amount_cents, 0);
    const expenseCents = inRange.filter((t) => t.direction === "debit").reduce((s, t) => s + t.amount_cents, 0);
    const netMargin = revenueCents > 0 ? Math.round(((revenueCents - expenseCents) / revenueCents) * 100) : 0;
    const uniqueCounterparties = new Set(inRange.filter((t) => t.direction === "credit").map((t) => t.counterparty)).size;
    kpis = [
      { label: "Revenue", value: `$${(revenueCents / 100).toLocaleString()}`, metaLabel: `Real, last ${rangeDays[range]}d` },
      { label: "Expenses", value: `$${(expenseCents / 100).toLocaleString()}`, metaLabel: `Real, last ${rangeDays[range]}d` },
      { label: "Net margin", value: revenueCents > 0 ? `${netMargin}%` : "—", metaLabel: revenueCents > 0 ? "Real" : "No revenue yet" },
      { label: "Paying counterparties", value: String(uniqueCounterparties), metaLabel: `Real, last ${rangeDays[range]}d` },
    ];
  }

  return (
    <div className="flex min-h-screen bg-[var(--color-bg)]">
      <Sidebar active="Analytics" />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <main className="p-4 pt-16 sm:p-[24px_28px_28px] flex flex-col gap-5 min-w-0">
          <div className="flex items-end gap-3 flex-wrap">
            <div>
              <h3 className="m-0 text-[22px]">Analytics</h3>
              <div className="text-muted text-[12.5px] mt-[3px]">{live ? "Real numbers from your wallet" : "Business performance for Meridian Studio"}</div>
            </div>
            <div className="flex-1 hidden sm:block" />
            <div className="seg">
              {ranges.map((r) => (
                <label key={r} className="seg-opt">
                  <input type="radio" name="arange" checked={range === r} onChange={() => setRange(r)} />
                  <span>{r}</span>
                </label>
              ))}
            </div>
            <button className="btn btn-secondary text-[13px]">
              <IconDownload size={14} />
              Export report
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
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

          <div className="grid gap-3.5 grid-cols-1 lg:grid-cols-[2fr_1fr]">
            <RevenueChart />
            <HealthScore score={82} />
          </div>

          <div className="grid gap-3.5 grid-cols-1 sm:grid-cols-2">
            <ExpenseBreakdown />
            <GrowthChart />
          </div>

          {live && (
            <div className="text-[11px] text-[var(--color-neutral-500)]">
              The KPI tiles above are computed from your real wallet transactions. The charts below (revenue trend,
              health score, expense breakdown, growth) are still illustrative — wiring those to real time-series
              data is the next piece.
            </div>
          )}

          <div
            className="rounded-xl p-4 flex items-center gap-3 border"
            style={{ borderColor: "color-mix(in srgb, var(--color-accent) 35%, transparent)" }}
          >
            <IconSparkle size={16} className="text-[var(--color-accent)] flex-none" />
            <div className="text-[12.5px] text-[var(--color-neutral-300)]">
              <strong className="text-[var(--color-text)]">Origin AI insight:</strong> revenue growth is outpacing expense growth by 4.3pt this {range.toLowerCase()}, so margins are expanding. Software spend is the fastest-growing cost line; consider a vendor consolidation review.
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
