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
type PaymentLink = {
  id: string;
  title: string;
  amount_cents: number;
  currency: string;
  kind: "one_time" | "recurring";
  status: string;
  uses_count: number;
  url: string;
};

function money(cents: number, currency = "usd") {
  return (cents / 100).toLocaleString(undefined, { style: "currency", currency: currency.toUpperCase() });
}

export default function FinancePanel() {
  const [balanceCents, setBalanceCents] = useState(0);
  const [transactions, setTransactions] = useState<WalletTx[]>([]);
  const [links, setLinks] = useState<PaymentLink[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/wallet").then((r) => r.json()),
      fetch("/api/stripe/payment-links").then((r) => r.json()),
    ])
      .then(([walletData, linksData]) => {
        if (walletData.configured && !walletData.error) {
          type Account = { balance_cents: number };
          const accounts: Account[] = walletData.accounts ?? [];
          setBalanceCents(accounts.reduce((sum, a) => sum + a.balance_cents, 0));
          setTransactions(walletData.transactions ?? []);
        }
        if (linksData.configured && !linksData.error) setLinks(linksData.links ?? []);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  const now = Date.now();
  const cutoff = now - 30 * 24 * 60 * 60 * 1000;
  const revenue30d = transactions
    .filter((t) => t.direction === "credit" && new Date(t.created_at).getTime() >= cutoff)
    .reduce((sum, t) => sum + t.amount_cents, 0);
  const expenses30d = transactions
    .filter((t) => t.direction === "debit" && new Date(t.created_at).getTime() >= cutoff)
    .reduce((sum, t) => sum + t.amount_cents, 0);

  return (
    <div className="flex flex-col gap-5 max-w-[760px]">
      <div>
        <h3 className="m-0 text-[22px]" style={{ color: "#fff" }}>Finance</h3>
        <div className="text-[13.5px] mt-1.5" style={{ color: "#a8a8a8" }}>
          Your real wallet, payment links and transaction history — nothing here is estimated.
        </div>
      </div>

      <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))" }}>
        {[
          { label: "Wallet balance", value: money(balanceCents) },
          { label: "Revenue · 30d", value: money(revenue30d) },
          { label: "Expenses · 30d", value: money(expenses30d) },
        ].map((k) => (
          <div key={k.label} className="card elev-sm gap-1 p-4" style={{ background: "#161616", border: "1px solid rgba(255,255,255,0.14)" }}>
            <div className="text-[10.5px] tracking-[.08em] uppercase" style={{ color: "#6b6b6b" }}>{k.label}</div>
            <div className="text-[20px] font-medium" style={{ color: "#fff" }}>{k.value}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <a href="/wallet" className="btn text-[13.5px]" style={{ background: "#fff", color: "#0a0a0a", border: "1px solid #fff" }}>
          Open full Wallet →
        </a>
        <a href="/payments" className="btn text-[13.5px]" style={{ border: "1px solid rgba(255,255,255,0.14)", color: "#a8a8a8" }}>
          Manage payment links →
        </a>
      </div>

      <div>
        <div className="text-[13px] font-medium mb-2" style={{ color: "#a8a8a8" }}>Payment links</div>
        {loaded && links.length === 0 && (
          <div className="text-[13.5px]" style={{ color: "#6b6b6b" }}>No payment links yet.</div>
        )}
        <div className="flex flex-col gap-2">
          {links.slice(0, 5).map((l) => (
            <div key={l.id} className="card elev-sm gap-1 p-4" style={{ background: "#161616", border: "1px solid rgba(255,255,255,0.14)" }}>
              <div className="flex items-center gap-2">
                <span className="text-[13.5px] flex-1 truncate" style={{ color: "#f5f5f5" }}>{l.title}</span>
                <span style={{ color: "#fff", fontSize: 13.5 }}>{money(l.amount_cents, l.currency)}</span>
              </div>
              <div className="text-[11px]" style={{ color: "#6b6b6b" }}>
                {l.kind === "recurring" ? "Recurring" : "One-time"} · {l.uses_count} use{l.uses_count === 1 ? "" : "s"} · {l.status}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="text-[13px] font-medium mb-2" style={{ color: "#a8a8a8" }}>Recent transactions</div>
        {loaded && transactions.length === 0 && (
          <div className="text-[13.5px]" style={{ color: "#6b6b6b" }}>No transactions yet.</div>
        )}
        <div className="flex flex-col gap-2">
          {transactions.slice(0, 6).map((t) => (
            <div key={t.id} className="flex items-center gap-3 py-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
              <span className="text-[13px] flex-1 truncate" style={{ color: "#f5f5f5" }}>{t.counterparty}</span>
              <span className="text-[11px]" style={{ color: "#6b6b6b" }}>
                {new Date(t.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
              </span>
              <span style={{ color: t.direction === "credit" ? "#8fd6a8" : "#f5f5f5", fontSize: 13.5, fontWeight: 500, minWidth: 90, textAlign: "right" }}>
                {t.direction === "credit" ? "+" : "−"}{money(t.amount_cents)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="card elev-sm gap-2 p-4" style={{ background: "#161616", border: "1px dashed rgba(255,255,255,0.2)" }}>
        <div className="flex items-center gap-2">
          <span className="text-[13.5px] font-medium" style={{ color: "#fff" }}>Crypto</span>
          <span className="tag text-[9px]" style={{ border: "1px solid #6b6b6b", color: "#6b6b6b" }}>Not connected</span>
        </div>
        <div className="text-[12.5px]" style={{ color: "#8a8a8a", lineHeight: 1.6 }}>
          Real crypto payment acceptance runs through NOWPayments and isn&rsquo;t wired in yet — the account owner
          needs to finish that signup before this can accept a real payment. Nothing crypto-related is faked in the
          meantime; this card will turn real the moment credentials land.
        </div>
      </div>
    </div>
  );
}
