"use client";

import { useEffect, useState } from "react";
import { useHasSession } from "@/lib/useSession";
import { isBackendConfigured } from "@/lib/backendStatus";

type WalletTx = { direction: "credit" | "debit"; amount_cents: number; created_at: string };

const CHART_W = 320;
const CHART_H = 190;
const BASE_Y = 180;
const TOP_PAD = 10;

function buildMonthlyNet(transactions: WalletTx[]) {
  const now = new Date();
  const months: { label: string; inCents: number; outCents: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ label: d.toLocaleDateString("en-US", { month: "short" }), inCents: 0, outCents: 0 });
  }
  for (const t of transactions) {
    const d = new Date(t.created_at);
    const monthsAgo = (now.getFullYear() - d.getFullYear()) * 12 + (now.getMonth() - d.getMonth());
    if (monthsAgo < 0 || monthsAgo > 5) continue;
    const bucket = months[5 - monthsAgo];
    if (t.direction === "credit") bucket.inCents += t.amount_cents;
    else bucket.outCents += t.amount_cents;
  }
  return months;
}

export default function CashFlowChart() {
  const { hasSession, checked } = useHasSession();
  const [live, setLive] = useState(false);
  const [transactions, setTransactions] = useState<WalletTx[]>([]);

  useEffect(() => {
    if (!checked || !isBackendConfigured || !hasSession) return;
    fetch("/api/wallet")
      .then((r) => r.json())
      .then((data) => {
        if (!data.configured) return;
        setTransactions(data.transactions ?? []);
        setLive(true);
      })
      .catch(() => {
        // Stay on the demo path on any failure.
      });
  }, [checked, hasSession]);

  const months = live ? buildMonthlyNet(transactions) : null;
  const max = months ? Math.max(1, ...months.map((m) => Math.max(m.inCents, m.outCents))) : 0;
  const usableH = BASE_Y - TOP_PAD;
  const barW = 14;
  const groupW = CHART_W / 6;

  const netAvgLabel = (() => {
    if (!months) return null;
    const totalNet = months.reduce((sum, m) => sum + (m.inCents - m.outCents), 0);
    const avgCents = totalNet / months.length;
    const sign = avgCents >= 0 ? "+" : "−";
    const abs = Math.abs(avgCents) / 100;
    const formatted = abs >= 1000 ? `$${(abs / 1000).toFixed(1)}k` : `$${abs.toFixed(0)}`;
    return `Net ${sign}${formatted} avg`;
  })();

  return (
    <div className="card elev-sm p-[18px_20px] gap-3">
      <div className="flex items-baseline gap-2.5">
        <div className="card-title text-[15px]">Cash flow</div>
        <div className="flex-1" />
        <div className="card-meta">{live ? "Last 6 months · real wallet data" : "6 months"}</div>
      </div>
      <svg viewBox={`0 0 ${CHART_W} ${CHART_H}`} className="w-full h-auto block" role="img" aria-label="Monthly cash in and out">
        <g stroke="rgba(233,233,237,0.09)" strokeWidth="1">
          <path d="M0 45h320M0 90h320M0 135h320" />
        </g>
        <g>
          {months
            ? months.map((m, i) => {
                const x0 = i * groupW + 14;
                const inH = (m.inCents / max) * usableH;
                const outH = (m.outCents / max) * usableH;
                return (
                  <g key={m.label + i}>
                    <rect x={x0} y={BASE_Y - inH} width={barW} height={Math.max(inH, m.inCents > 0 ? 2 : 0)} rx="3" fill="#968ae0" />
                    <rect x={x0 + barW + 4} y={BASE_Y - outH} width={barW} height={Math.max(outH, m.outCents > 0 ? 2 : 0)} rx="3" fill="#3f424d" />
                  </g>
                );
              })
            : (
              <>
                <rect x="14" y="92" width="14" height="88" rx="3" fill="#968ae0" />
                <rect x="32" y="128" width="14" height="52" rx="3" fill="#3f424d" />
                <rect x="66" y="78" width="14" height="102" rx="3" fill="#968ae0" />
                <rect x="84" y="118" width="14" height="62" rx="3" fill="#3f424d" />
                <rect x="118" y="98" width="14" height="82" rx="3" fill="#968ae0" />
                <rect x="136" y="132" width="14" height="48" rx="3" fill="#3f424d" />
                <rect x="170" y="62" width="14" height="118" rx="3" fill="#968ae0" />
                <rect x="188" y="122" width="14" height="58" rx="3" fill="#3f424d" />
                <rect x="222" y="70" width="14" height="110" rx="3" fill="#968ae0" />
                <rect x="240" y="112" width="14" height="68" rx="3" fill="#3f424d" />
                <rect x="274" y="42" width="14" height="138" rx="3" fill="#968ae0" />
                <rect x="292" y="118" width="14" height="62" rx="3" fill="#3f424d" />
              </>
            )}
        </g>
      </svg>
      <div className="card-meta justify-between">
        <span>{months ? months.map((m) => m.label).join(" · ") : "Feb · Mar · Apr · May · Jun · Jul"}</span>
        <span style={{ color: "var(--color-accent-300)" }}>{netAvgLabel ?? "Net +$22.4k avg"}</span>
      </div>
    </div>
  );
}
