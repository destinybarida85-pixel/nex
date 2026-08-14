"use client";

import { useEffect, useState } from "react";

type WalletTx = {
  id: string;
  direction: "credit" | "debit";
  counterparty: string;
  amount_cents: number;
  status: string;
  memo: string | null;
  created_at: string;
};
type PaymentLink = { id: string; title: string; amount_cents: number; currency: string };

function money(cents: number, currency = "usd") {
  return (cents / 100).toLocaleString(undefined, { style: "currency", currency: currency.toUpperCase(), maximumFractionDigits: cents % 100 === 0 ? 0 : 2 });
}

function pctChange(current: number, previous: number): number | null {
  if (previous === 0) return null;
  return Math.round(((current - previous) / Math.abs(previous)) * 100);
}

// A tiny real bar sparkline — last 8 weeks of net cash flow, no library.
function Sparkline({ values, color }: { values: number[]; color: string }) {
  const max = Math.max(1, ...values.map((v) => Math.abs(v)));
  return (
    <svg viewBox="0 0 100 32" width="100" height="32" preserveAspectRatio="none">
      {values.map((v, i) => {
        const h = Math.max(2, (Math.abs(v) / max) * 28);
        const w = 100 / values.length;
        return (
          <rect
            key={i}
            x={i * w + w * 0.2}
            y={v >= 0 ? 32 - h : 32}
            width={w * 0.6}
            height={h}
            rx={1}
            fill={color}
            opacity={0.35 + 0.65 * (i / values.length)}
          />
        );
      })}
    </svg>
  );
}

export default function FinancePanel() {
  const [balanceCents, setBalanceCents] = useState(0);
  const [transactions, setTransactions] = useState<WalletTx[]>([]);
  const [links, setLinks] = useState<PaymentLink[]>([]);
  const [certCredits, setCertCredits] = useState<number | null>(null);
  const [stampCredits, setStampCredits] = useState<number | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/wallet").then((r) => r.json()),
      fetch("/api/stripe/payment-links").then((r) => r.json()),
      fetch("/api/tenant").then((r) => r.json()),
      fetch("/api/certificates").then((r) => r.json()),
    ])
      .then(([walletData, linksData, tenantData, certData]) => {
        if (walletData.configured && !walletData.error) {
          type Account = { balance_cents: number };
          const accounts: Account[] = walletData.accounts ?? [];
          setBalanceCents(accounts.reduce((sum, a) => sum + a.balance_cents, 0));
          setTransactions(walletData.transactions ?? []);
        }
        if (linksData.configured && !linksData.error) setLinks(linksData.links ?? []);
        if (tenantData.configured && tenantData.tenant) setStampCredits(tenantData.tenant.stamp_credits ?? null);
        if (certData.configured && !certData.setupRequired) setCertCredits(certData.credits ?? null);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  async function manageBilling() {
    setPortalLoading(true);
    try {
      const res = await fetch("/api/billing/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      // Non-fatal.
    } finally {
      setPortalLoading(false);
    }
  }

  function downloadStatement() {
    const rows = [
      ["Counterparty", "Type", "Date", "Status", "Amount"],
      ...transactions.map((t) => [t.counterparty, t.memo || "Wallet transaction", new Date(t.created_at).toLocaleDateString(), t.status, `${t.direction === "credit" ? "+" : "-"}${(t.amount_cents / 100).toFixed(2)}`]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "primue-finance-statement.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  const cur30 = transactions.filter((t) => now - new Date(t.created_at).getTime() < 30 * day);
  const prev30 = transactions.filter((t) => {
    const age = now - new Date(t.created_at).getTime();
    return age >= 30 * day && age < 60 * day;
  });
  const sum = (rows: WalletTx[], dir: "credit" | "debit") => rows.filter((t) => t.direction === dir).reduce((s, t) => s + t.amount_cents, 0);
  const revenue30 = sum(cur30, "credit");
  const revenuePrev30 = sum(prev30, "credit");
  const expense30 = sum(cur30, "debit");
  const expensePrev30 = sum(prev30, "debit");
  const revenueChange = pctChange(revenue30, revenuePrev30);
  const expenseChange = pctChange(expense30, expensePrev30);

  // Last 8 weeks of net flow, oldest to newest — a real, if simple, sparkline.
  const weeklyNet: number[] = [];
  for (let w = 7; w >= 0; w--) {
    const from = now - (w + 1) * 7 * day;
    const to = now - w * 7 * day;
    const inWeek = transactions.filter((t) => {
      const ts = new Date(t.created_at).getTime();
      return ts >= from && ts < to;
    });
    weeklyNet.push(sum(inWeek, "credit") - sum(inWeek, "debit"));
  }

  const todayReceived = transactions
    .filter((t) => t.direction === "credit" && new Date(t.created_at).toDateString() === new Date().toDateString())
    .reduce((s, t) => s + t.amount_cents, 0);

  const CERT_MAX = 10;
  const STAMP_MAX = 10;

  return (
    <div className="flex flex-col gap-4 max-w-[900px]">
      <div>
        <h3 className="m-0 text-[22px]" style={{ color: "#fff" }}>Finance</h3>
        <div className="text-[13.5px] mt-1.5" style={{ color: "#a8a8a8" }}>
          Your real wallet, credits and transaction history — nothing here is estimated.
        </div>
      </div>

      {/* Row 1: balance / income / expense — mirrors the reference's three-up top row */}
      <div className="grid gap-3.5" style={{ gridTemplateColumns: "1.3fr 1fr 1fr" }}>
        <div className="card elev-sm gap-3 p-5" style={{ background: "#161616", border: "1px solid rgba(255,255,255,0.14)" }}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] tracking-[.08em] uppercase" style={{ color: "#6b6b6b" }}>My balance</span>
            <Sparkline values={weeklyNet} color="#fff" />
          </div>
          <div className="text-[30px] font-medium" style={{ color: "#fff" }}>{money(balanceCents)}</div>
          <div className="flex gap-2">
            <a href="/wallet" className="btn text-[12px]" style={{ background: "#fff", color: "#0a0a0a", border: "1px solid #fff" }}>Transfer</a>
            <a href="/wallet" className="btn text-[12px]" style={{ border: "1px solid rgba(255,255,255,0.14)", color: "#a8a8a8" }}>Receive</a>
            <a href="/payments" className="btn text-[12px]" style={{ border: "1px solid rgba(255,255,255,0.14)", color: "#a8a8a8" }}>Payment link</a>
          </div>
        </div>

        <div className="card elev-sm gap-2 p-5" style={{ background: "#161616", border: "1px solid rgba(255,255,255,0.14)" }}>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full grid place-items-center flex-none" style={{ background: "color-mix(in srgb, #8fd6a8 18%, transparent)", color: "#8fd6a8" }}>↓</span>
            <span className="text-[12.5px]" style={{ color: "#a8a8a8" }}>Income · 30d</span>
          </div>
          <div className="text-[22px] font-medium" style={{ color: "#fff" }}>{money(revenue30)}</div>
          {revenueChange !== null && (
            <span className="tag text-[10px] self-start" style={{ border: `1px solid ${revenueChange >= 0 ? "#8fd6a8" : "#ff8a8a"}`, color: revenueChange >= 0 ? "#8fd6a8" : "#ff8a8a" }}>
              {revenueChange >= 0 ? "▲" : "▼"} {Math.abs(revenueChange)}% vs prior 30d
            </span>
          )}
        </div>

        <div className="card elev-sm gap-2 p-5" style={{ background: "#161616", border: "1px solid rgba(255,255,255,0.14)" }}>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full grid place-items-center flex-none" style={{ background: "color-mix(in srgb, #ff8a8a 18%, transparent)", color: "#ff8a8a" }}>↑</span>
            <span className="text-[12.5px]" style={{ color: "#a8a8a8" }}>Expenses · 30d</span>
          </div>
          <div className="text-[22px] font-medium" style={{ color: "#fff" }}>{money(expense30)}</div>
          {expenseChange !== null && (
            <span className="tag text-[10px] self-start" style={{ border: `1px solid ${expenseChange <= 0 ? "#8fd6a8" : "#ff8a8a"}`, color: expenseChange <= 0 ? "#8fd6a8" : "#ff8a8a" }}>
              {expenseChange >= 0 ? "▲" : "▼"} {Math.abs(expenseChange)}% vs prior 30d
            </span>
          )}
        </div>
      </div>

      {/* Row 2: credits (real, replaces the reference's fabricated "goals") + cash flow */}
      <div className="grid gap-3.5" style={{ gridTemplateColumns: "1fr 1.4fr" }}>
        <div className="card elev-sm gap-3 p-5" style={{ background: "#161616", border: "1px solid rgba(255,255,255,0.14)" }}>
          <div className="text-[13px] font-medium" style={{ color: "#fff" }}>Credits</div>
          {[
            { label: "Certificate credits", value: certCredits, max: CERT_MAX },
            { label: "Stamp credits", value: stampCredits, max: STAMP_MAX },
          ].map((c) => (
            <div key={c.label} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-[12px]" style={{ color: "#a8a8a8" }}>
                <span>{c.label}</span>
                <span>{c.value ?? "—"}</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
                <div
                  className="h-full rounded-full"
                  style={{ width: `${c.value ? Math.min(100, (c.value / c.max) * 100) : 0}%`, background: "#fff" }}
                />
              </div>
            </div>
          ))}
          <a href="/billing" className="text-[11.5px]" style={{ color: "#8a8a8a" }}>Buy more credits →</a>
        </div>

        <div className="card elev-sm gap-2 p-5" style={{ background: "#161616", border: "1px solid rgba(255,255,255,0.14)" }}>
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-medium" style={{ color: "#fff" }}>Cash flow</span>
            <span className="text-[11px]" style={{ color: "#6b6b6b" }}>Last 8 weeks</span>
          </div>
          <svg viewBox="0 0 320 90" width="100%" height="90" preserveAspectRatio="none">
            {(() => {
              const max = Math.max(1, ...weeklyNet.map((v) => Math.abs(v)));
              const w = 320 / weeklyNet.length;
              return weeklyNet.map((v, i) => {
                const h = Math.max(2, (Math.abs(v) / max) * 40);
                return (
                  <rect
                    key={i}
                    x={i * w + w * 0.22}
                    y={v >= 0 ? 45 - h : 45}
                    width={w * 0.56}
                    height={h}
                    rx={2}
                    fill={v >= 0 ? "#fff" : "#6b6b6b"}
                  />
                );
              });
            })()}
            <line x1="0" y1="45" x2="320" y2="45" stroke="rgba(255,255,255,0.14)" strokeWidth="1" />
          </svg>
        </div>
      </div>

      {/* Row 3: billing / today / statement — mirrors the reference's right-hand promo stack, laid horizontally here */}
      <div className="grid gap-3.5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
        <div className="card elev-sm gap-2 p-4" style={{ background: "#fff", color: "#0a0a0a" }}>
          <div className="text-[12px] font-medium">Manage billing</div>
          <div className="text-[11px]" style={{ color: "#4a4a4a" }}>Update your card, view invoices, or cancel — real Stripe portal.</div>
          <button className="btn text-[11.5px] self-start mt-1" style={{ background: "#0a0a0a", color: "#fff", border: "1px solid #0a0a0a" }} onClick={manageBilling} disabled={portalLoading}>
            {portalLoading ? "Opening…" : "Open →"}
          </button>
        </div>
        <div className="card elev-sm gap-1 p-4" style={{ background: "#161616", border: "1px solid rgba(255,255,255,0.14)" }}>
          <div className="text-[11px] tracking-[.08em] uppercase" style={{ color: "#6b6b6b" }}>Received today</div>
          <div className="text-[20px] font-medium" style={{ color: "#fff" }}>{money(todayReceived)}</div>
        </div>
        <div className="card elev-sm gap-2 p-4" style={{ background: "#161616", border: "1px solid rgba(255,255,255,0.14)" }}>
          <div className="text-[12px] font-medium" style={{ color: "#fff" }}>Financial report</div>
          <button className="btn text-[11.5px] self-start" style={{ border: "1px solid rgba(255,255,255,0.14)", color: "#a8a8a8" }} onClick={downloadStatement} disabled={transactions.length === 0}>
            Download CSV →
          </button>
        </div>
      </div>

      {links.length > 0 && (
        <div>
          <div className="text-[13px] font-medium mb-2" style={{ color: "#a8a8a8" }}>Payment links</div>
          <div className="flex flex-col gap-2">
            {links.slice(0, 3).map((l) => (
              <div key={l.id} className="flex items-center gap-2 p-3 rounded-lg" style={{ background: "#161616", border: "1px solid rgba(255,255,255,0.14)" }}>
                <span className="text-[13px] flex-1 truncate" style={{ color: "#f5f5f5" }}>{l.title}</span>
                <span style={{ color: "#fff", fontSize: 13 }}>{money(l.amount_cents, l.currency)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transaction history table — mirrors the reference's table structure */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[13px] font-medium" style={{ color: "#a8a8a8" }}>Transaction history</span>
          <a href="/wallet" className="text-[11.5px]" style={{ color: "#8a8a8a" }}>View all →</a>
        </div>
        {loaded && transactions.length === 0 && (
          <div className="text-[13.5px]" style={{ color: "#6b6b6b" }}>No transactions yet.</div>
        )}
        {transactions.length > 0 && (
          <div className="overflow-x-auto rounded-lg" style={{ border: "1px solid rgba(255,255,255,0.14)" }}>
            <table className="w-full text-[12.5px]" style={{ borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.14)" }}>
                  {["Name", "Type", "Date", "Status", "Amount"].map((h) => (
                    <th key={h} className="text-left p-2.5" style={{ color: "#6b6b6b", fontWeight: 500 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {transactions.slice(0, 8).map((t) => (
                  <tr key={t.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <td className="p-2.5" style={{ color: "#f5f5f5" }}>{t.counterparty}</td>
                    <td className="p-2.5" style={{ color: "#a8a8a8" }}>{t.memo || "Wallet transaction"}</td>
                    <td className="p-2.5" style={{ color: "#a8a8a8" }}>{new Date(t.created_at).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}</td>
                    <td className="p-2.5">
                      <span className="tag text-[9.5px]" style={{ background: t.status === "completed" ? "color-mix(in srgb, #8fd6a8 20%, transparent)" : "rgba(255,255,255,0.1)", color: t.status === "completed" ? "#8fd6a8" : "#a8a8a8" }}>
                        {t.status === "completed" ? "Complete" : t.status}
                      </span>
                    </td>
                    <td className="p-2.5 text-right" style={{ color: t.direction === "credit" ? "#8fd6a8" : "#f5f5f5", fontWeight: 500 }}>
                      {t.direction === "credit" ? "+" : "−"}{money(t.amount_cents)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="card elev-sm gap-2 p-4" style={{ background: "#161616", border: "1px dashed rgba(255,255,255,0.2)" }}>
        <div className="flex items-center gap-2">
          <span className="text-[13.5px] font-medium" style={{ color: "#fff" }}>Crypto</span>
          <span className="tag text-[9px]" style={{ border: "1px solid #6b6b6b", color: "#6b6b6b" }}>Not connected</span>
        </div>
        <div className="text-[12.5px]" style={{ color: "#8a8a8a", lineHeight: 1.6 }}>
          Real crypto payment acceptance runs through NOWPayments and isn&rsquo;t wired in yet — the account owner
          needs to finish that signup before this can accept a real payment.
        </div>
      </div>
    </div>
  );
}
