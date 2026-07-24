type WalletTx = { direction: "credit" | "debit"; amount_cents: number; created_at: string };

const CHART_W = 760;
const CHART_H = 220;
const TOP_PAD = 20;
const BOTTOM_PAD = 24;

function buildMonthlySeries(transactions: WalletTx[]) {
  const now = new Date();
  const months: { label: string; revenue: number; expense: number }[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ label: d.toLocaleDateString("en-US", { month: "short" }), revenue: 0, expense: 0 });
  }
  for (const t of transactions) {
    const d = new Date(t.created_at);
    const monthsAgo = (now.getFullYear() - d.getFullYear()) * 12 + (now.getMonth() - d.getMonth());
    if (monthsAgo < 0 || monthsAgo > 11) continue;
    const bucket = months[11 - monthsAgo];
    if (t.direction === "credit") bucket.revenue += t.amount_cents;
    else bucket.expense += t.amount_cents;
  }
  return months;
}

function pathFor(values: number[], max: number) {
  const usableH = CHART_H - TOP_PAD - BOTTOM_PAD;
  const step = CHART_W / (values.length - 1);
  return values
    .map((v, i) => {
      const x = Math.round(i * step);
      const y = Math.round(TOP_PAD + usableH - (max > 0 ? (v / max) * usableH : 0));
      return `${i === 0 ? "M" : "L"}${x} ${y}`;
    })
    .join(" ");
}

export default function RevenueChart({ transactions, live }: { transactions?: WalletTx[]; live?: boolean }) {
  const months = live && transactions ? buildMonthlySeries(transactions) : null;
  const max = months ? Math.max(1, ...months.map((m) => Math.max(m.revenue, m.expense))) : 0;
  const revenuePath = months ? pathFor(months.map((m) => m.revenue), max) : null;
  const expensePath = months ? pathFor(months.map((m) => m.expense), max) : null;
  const areaPath = revenuePath ? `${revenuePath} L${CHART_W} ${CHART_H} L0 ${CHART_H} Z` : null;

  return (
    <div className="card elev-sm p-[18px_20px] gap-3">
      <div className="flex items-baseline gap-2.5">
        <div className="card-title text-[15px]">Revenue analytics</div>
        <div className="card-meta">{live ? "Last 12 months · real wallet data" : "Jul 2025 – Jul 2026"}</div>
        <div className="flex-1" />
        <div className="flex items-center gap-1.5 text-[11.5px] text-[var(--color-neutral-400)]">
          <span className="w-3.5 h-0.5 rounded-sm" style={{ background: "var(--color-accent)" }} />
          Revenue
        </div>
        <div className="flex items-center gap-1.5 text-[11.5px] text-[var(--color-neutral-400)]">
          <span className="w-3.5 h-0.5 rounded-sm" style={{ background: "var(--color-neutral-600)" }} />
          Expenses
        </div>
      </div>
      <svg viewBox={`0 0 ${CHART_W} ${CHART_H}`} className="w-full h-auto block" role="img" aria-label="Revenue and expenses over the last 12 months">
        <defs>
          <linearGradient id="rev1a" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#968ae0" stopOpacity="0.28" />
            <stop offset="1" stopColor="#968ae0" stopOpacity="0" />
          </linearGradient>
        </defs>
        <g stroke="rgba(233,233,237,0.09)" strokeWidth="1">
          <path d="M0 55h760M0 105h760M0 155h760M0 205h760" />
        </g>
        <path
          d={
            areaPath ??
            "M0 168 L65 150 L130 158 L195 132 L260 140 L325 112 L390 120 L455 96 L520 104 L585 72 L650 80 L720 52 L760 46 L760 220 L0 220 Z"
          }
          fill="url(#rev1a)"
        />
        <path
          d={
            revenuePath ??
            "M0 168 L65 150 L130 158 L195 132 L260 140 L325 112 L390 120 L455 96 L520 104 L585 72 L650 80 L720 52 L760 46"
          }
          fill="none"
          stroke="#968ae0"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <path
          d={
            expensePath ??
            "M0 192 L65 188 L130 194 L195 184 L260 190 L325 180 L390 186 L455 176 L520 182 L585 172 L650 178 L720 170 L760 168"
          }
          fill="none"
          stroke="#595d6c"
          strokeWidth="1.6"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <g fontFamily="Inter, sans-serif" fontSize="10" fill="rgba(233,233,237,0.45)">
          {months
            ? months
                .filter((_, i) => i % 2 === 0)
                .map((m, i) => (
                  <text key={m.label + i} x={i * (CHART_W / 6)} y={CHART_H - 4}>
                    {m.label}
                  </text>
                ))
            : (
              <>
                <text x="0" y="218">Jul</text>
                <text x="128" y="218">Sep</text>
                <text x="258" y="218">Nov</text>
                <text x="388" y="218">Jan</text>
                <text x="518" y="218">Mar</text>
                <text x="648" y="218">May</text>
                <text x="742" y="218">Jul</text>
              </>
            )}
        </g>
      </svg>
    </div>
  );
}
