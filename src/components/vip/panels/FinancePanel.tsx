"use client";

import { useEffect, useState } from "react";
import { useVipTheme } from "@/components/vip/theme";
import { useCountUp } from "@/components/vip/useCountUp";

type WalletTx = {
  id: string;
  direction: "credit" | "debit";
  counterparty: string;
  amount_cents: number;
  status: string;
  memo: string | null;
  created_at: string;
};
type PaymentLink = { id: string; title: string; amount_cents: number; currency: string; url?: string };
type WalletAccount = { id: string; label: string; balance_cents: number; currency: string };

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
  const { tokens } = useVipTheme();
  const [accounts, setAccounts] = useState<WalletAccount[]>([]);
  const [transactions, setTransactions] = useState<WalletTx[]>([]);
  const [links, setLinks] = useState<PaymentLink[]>([]);
  const [certCredits, setCertCredits] = useState<number | null>(null);
  const [stampCredits, setStampCredits] = useState<number | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const [buyingCredits, setBuyingCredits] = useState<"certificate" | "stamp" | null>(null);

  const [activeAction, setActiveAction] = useState<"transfer" | "receive" | "link" | null>(null);
  const [transferTo, setTransferTo] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [transferring, setTransferring] = useState(false);
  const [transferError, setTransferError] = useState("");
  const [transferDone, setTransferDone] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [linkTitle, setLinkTitle] = useState("");
  const [linkAmount, setLinkAmount] = useState("");
  const [linkKind, setLinkKind] = useState<"one_time" | "recurring">("one_time");
  const [creatingLink, setCreatingLink] = useState(false);
  const [linkError, setLinkError] = useState("");
  const [createdLinkUrl, setCreatedLinkUrl] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);

  function loadWallet() {
    fetch("/api/wallet")
      .then((r) => r.json())
      .then((walletData) => {
        if (walletData.configured && !walletData.error) {
          setAccounts(walletData.accounts ?? []);
          setTransactions(walletData.transactions ?? []);
        }
      })
      .catch(() => {});
  }

  useEffect(() => {
    Promise.all([
      fetch("/api/wallet").then((r) => r.json()),
      fetch("/api/stripe/payment-links").then((r) => r.json()),
      fetch("/api/tenant").then((r) => r.json()),
      fetch("/api/certificates").then((r) => r.json()),
    ])
      .then(([walletData, linksData, tenantData, certData]) => {
        if (walletData.configured && !walletData.error) {
          setAccounts(walletData.accounts ?? []);
          setTransactions(walletData.transactions ?? []);
        }
        if (linksData.configured && !linksData.error) setLinks(linksData.links ?? []);
        if (tenantData.configured && tenantData.tenant) setStampCredits(tenantData.tenant.stamp_credits ?? null);
        if (certData.configured && !certData.setupRequired) setCertCredits(certData.credits ?? null);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  const balanceCents = accounts.reduce((sum, a) => sum + a.balance_cents, 0);
  const primaryAccount = accounts[0];

  async function submitTransfer() {
    if (!primaryAccount || !transferTo.trim() || !transferAmount) return;
    setTransferring(true);
    setTransferError("");
    setTransferDone(false);
    try {
      const cents = Math.round(parseFloat(transferAmount) * 100);
      if (!cents || cents <= 0) throw new Error("Enter a valid amount.");
      const res = await fetch("/api/wallet/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountId: primaryAccount.id, counterparty: transferTo.trim(), amountCents: cents }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Couldn't send that transfer.");
      setTransferDone(true);
      setTransferTo("");
      setTransferAmount("");
      loadWallet();
    } catch (err) {
      setTransferError(err instanceof Error ? err.message : "Couldn't reach the server.");
    } finally {
      setTransferring(false);
    }
  }

  function copyToClipboard(text: string, field: string) {
    navigator.clipboard?.writeText(text).then(() => {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 1500);
    });
  }

  async function createLink() {
    if (!linkTitle.trim() || !linkAmount) return;
    setCreatingLink(true);
    setLinkError("");
    setCreatedLinkUrl(null);
    try {
      const cents = Math.round(parseFloat(linkAmount) * 100);
      if (!cents || cents < 1) throw new Error("Enter a valid amount.");
      const res = await fetch("/api/stripe/payment-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: linkTitle.trim(), amountCents: cents, kind: linkKind, interval: linkKind === "recurring" ? "month" : undefined }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Couldn't create that link.");
      setCreatedLinkUrl(data.link.url);
      setLinks((prev) => [data.link, ...prev]);
      setLinkTitle("");
      setLinkAmount("");
    } catch (err) {
      setLinkError(err instanceof Error ? err.message : "Couldn't reach the server.");
    } finally {
      setCreatingLink(false);
    }
  }

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

  // Same real Stripe Checkout endpoints /certificates and /stamps already
  // use for this — calling them directly here means buying more credits
  // never has to leave VIP for a page (/billing) that doesn't even offer it.
  async function buyCredits(kind: "certificate" | "stamp") {
    setBuyingCredits(kind);
    try {
      const res = await fetch(`/api/billing/${kind}-credits`, { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      // Non-fatal.
    }
    setBuyingCredits(null);
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

  const animatedBalance = useCountUp(balanceCents);
  const animatedRevenue = useCountUp(revenue30);
  const animatedExpense = useCountUp(expense30);
  const tiltAccent = { "--color-accent": tokens.accentBlue } as React.CSSProperties;

  return (
    <div className="flex flex-col gap-4 max-w-[900px]">
      <div>
        <h3 className="m-0 text-[22px]" style={{ color: tokens.text }}>Finance</h3>
        <div className="text-[13.5px] mt-1.5" style={{ color: tokens.textSecondary }}>
          Your real wallet, credits and transaction history — nothing here is estimated.
        </div>
      </div>

      {/* Row 1: balance / income / expense — mirrors the reference's three-up top row */}
      <div className="grid gap-3.5" style={{ gridTemplateColumns: "1.3fr 1fr 1fr" }}>
        <div className="card elev-sm nx-tilt gap-3 p-5" style={{ background: tokens.surface, border: `1px solid ${tokens.border}`, ...tiltAccent }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[11px] tracking-[.08em] uppercase" style={{ color: tokens.textQuaternary }}>My balance</span>
              <span className="tag text-[9px] flex items-center gap-1" style={{ border: `1px solid ${tokens.success}`, color: tokens.success }}>
                <span className="vip-live-dot w-1.5 h-1.5 rounded-full" style={{ background: tokens.success }} />
                Live
              </span>
            </div>
            <Sparkline values={weeklyNet} color={tokens.accentBlue} />
          </div>
          <div className="text-[30px] font-medium" style={{ color: tokens.text }}>{money(animatedBalance)}</div>
          <div className="flex gap-2">
            <button
              className="btn text-[12px]"
              style={{ background: activeAction === "transfer" ? tokens.accentBg : "transparent", color: activeAction === "transfer" ? tokens.accentText : tokens.text, border: `1px solid ${tokens.accentBg}` }}
              onClick={() => setActiveAction(activeAction === "transfer" ? null : "transfer")}
              disabled={!primaryAccount}
            >
              Transfer
            </button>
            <button
              className="btn text-[12px]"
              style={{ border: `1px solid ${tokens.border}`, color: tokens.textSecondary, background: activeAction === "receive" ? tokens.tint1 : "transparent" }}
              onClick={() => setActiveAction(activeAction === "receive" ? null : "receive")}
            >
              Receive
            </button>
            <button
              className="btn text-[12px]"
              style={{ border: `1px solid ${tokens.border}`, color: tokens.textSecondary, background: activeAction === "link" ? tokens.tint1 : "transparent" }}
              onClick={() => setActiveAction(activeAction === "link" ? null : "link")}
            >
              Payment link
            </button>
          </div>

          {activeAction === "transfer" && (
            <div className="flex flex-col gap-2 pt-1" style={{ borderTop: `1px solid ${tokens.tint2}` }}>
              <input
                className="input text-[13px]"
                style={{ background: tokens.surfaceInset, color: tokens.text, border: `1px solid ${tokens.border}` }}
                placeholder="Send to (name or business)"
                value={transferTo}
                onChange={(e) => setTransferTo(e.target.value)}
              />
              <input
                className="input text-[13px]"
                style={{ background: tokens.surfaceInset, color: tokens.text, border: `1px solid ${tokens.border}` }}
                placeholder="Amount (USD)"
                inputMode="decimal"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
              />
              {transferError && <div className="text-[11.5px]" style={{ color: tokens.danger }}>{transferError}</div>}
              {transferDone && !transferError && <div className="text-[11.5px]" style={{ color: tokens.success }}>Sent</div>}
              <button
                className="btn text-[12px] self-start"
                style={{ background: tokens.accentBg, color: tokens.accentText, border: `1px solid ${tokens.accentBg}` }}
                onClick={submitTransfer}
                disabled={transferring || !transferTo.trim() || !transferAmount}
              >
                {transferring ? "Sending…" : "Send transfer"}
              </button>
            </div>
          )}

          {activeAction === "receive" && (
            <div className="flex flex-col gap-1.5 pt-1" style={{ borderTop: `1px solid ${tokens.tint2}` }}>
              <div className="text-[11px]" style={{ color: tokens.textQuaternary }}>
                Primue doesn&rsquo;t issue its own account numbers — share a real Stripe payment link to get paid instead.
              </div>
              {links.length === 0 && (
                <div className="text-[12px] py-1" style={{ color: tokens.textTertiary }}>No payment links yet.</div>
              )}
              {links.slice(0, 3).map((l) => (
                <div key={l.id} className="flex items-center justify-between text-[12.5px] py-1">
                  <span className="truncate pr-2" style={{ color: tokens.text }}>{l.title} · {money(l.amount_cents, l.currency)}</span>
                  <button
                    className="flex-none cursor-pointer"
                    style={{ background: "none", border: "none", color: tokens.textQuaternary }}
                    onClick={() => l.url && copyToClipboard(l.url, l.id)}
                    disabled={!l.url}
                  >
                    {copiedField === l.id ? "Copied" : "Copy link"}
                  </button>
                </div>
              ))}
              <button
                className="btn text-[12px] self-start mt-1"
                style={{ background: tokens.accentBg, color: tokens.accentText, border: `1px solid ${tokens.accentBg}` }}
                onClick={() => setActiveAction("link")}
              >
                Create new link →
              </button>
            </div>
          )}

          {activeAction === "link" && (
            <div className="flex flex-col gap-2 pt-1" style={{ borderTop: `1px solid ${tokens.tint2}` }}>
              <input
                className="input text-[13px]"
                style={{ background: tokens.surfaceInset, color: tokens.text, border: `1px solid ${tokens.border}` }}
                placeholder="What's this for?"
                value={linkTitle}
                onChange={(e) => setLinkTitle(e.target.value)}
              />
              <div className="flex gap-2">
                <input
                  className="input text-[13px] flex-1"
                  style={{ background: tokens.surfaceInset, color: tokens.text, border: `1px solid ${tokens.border}` }}
                  placeholder="Amount (USD)"
                  inputMode="decimal"
                  value={linkAmount}
                  onChange={(e) => setLinkAmount(e.target.value)}
                />
                <select
                  className="input text-[12px]"
                  style={{ background: tokens.surfaceInset, color: tokens.text, border: `1px solid ${tokens.border}` }}
                  value={linkKind}
                  onChange={(e) => setLinkKind(e.target.value as "one_time" | "recurring")}
                >
                  <option value="one_time">One-time</option>
                  <option value="recurring">Monthly</option>
                </select>
              </div>
              {linkError && <div className="text-[11.5px]" style={{ color: tokens.danger }}>{linkError}</div>}
              {createdLinkUrl && (
                <div className="flex items-center gap-2 text-[11.5px]" style={{ color: tokens.success }}>
                  <span className="truncate">{createdLinkUrl}</span>
                  <button
                    style={{ background: "none", border: "none", color: tokens.textSecondary, cursor: "pointer", flex: "none" }}
                    onClick={() => {
                      navigator.clipboard?.writeText(createdLinkUrl);
                      setLinkCopied(true);
                      setTimeout(() => setLinkCopied(false), 1500);
                    }}
                  >
                    {linkCopied ? "Copied" : "Copy"}
                  </button>
                </div>
              )}
              <button
                className="btn text-[12px] self-start"
                style={{ background: tokens.accentBg, color: tokens.accentText, border: `1px solid ${tokens.accentBg}` }}
                onClick={createLink}
                disabled={creatingLink || !linkTitle.trim() || !linkAmount}
              >
                {creatingLink ? "Creating…" : "Create link"}
              </button>
            </div>
          )}
        </div>

        <div className="card elev-sm nx-tilt gap-2 p-5" style={{ background: tokens.surface, border: `1px solid ${tokens.border}`, ...tiltAccent }}>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full grid place-items-center flex-none" style={{ background: `color-mix(in srgb, ${tokens.success} 18%, transparent)`, color: tokens.success }}>↓</span>
            <span className="text-[12.5px]" style={{ color: tokens.textSecondary }}>Income · 30d</span>
          </div>
          <div className="text-[22px] font-medium" style={{ color: tokens.text }}>{money(animatedRevenue)}</div>
          {revenueChange !== null && (
            <span className="tag text-[10px] self-start" style={{ border: `1px solid ${revenueChange >= 0 ? tokens.success : tokens.danger}`, color: revenueChange >= 0 ? tokens.success : tokens.danger }}>
              {revenueChange >= 0 ? "▲" : "▼"} {Math.abs(revenueChange)}% vs prior 30d
            </span>
          )}
        </div>

        <div className="card elev-sm nx-tilt gap-2 p-5" style={{ background: tokens.surface, border: `1px solid ${tokens.border}`, ...tiltAccent }}>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full grid place-items-center flex-none" style={{ background: `color-mix(in srgb, ${tokens.danger} 18%, transparent)`, color: tokens.danger }}>↑</span>
            <span className="text-[12.5px]" style={{ color: tokens.textSecondary }}>Expenses · 30d</span>
          </div>
          <div className="text-[22px] font-medium" style={{ color: tokens.text }}>{money(animatedExpense)}</div>
          {expenseChange !== null && (
            <span className="tag text-[10px] self-start" style={{ border: `1px solid ${expenseChange <= 0 ? tokens.success : tokens.danger}`, color: expenseChange <= 0 ? tokens.success : tokens.danger }}>
              {expenseChange >= 0 ? "▲" : "▼"} {Math.abs(expenseChange)}% vs prior 30d
            </span>
          )}
        </div>
      </div>

      {/* Row 2: credits (real, replaces the reference's fabricated "goals") + cash flow */}
      <div className="grid gap-3.5" style={{ gridTemplateColumns: "1fr 1.4fr" }}>
        <div className="card elev-sm gap-3 p-5" style={{ background: tokens.surface, border: `1px solid ${tokens.border}` }}>
          <div className="text-[13px] font-medium" style={{ color: tokens.text }}>Credits</div>
          {[
            { kind: "certificate" as const, label: "Certificate credits", value: certCredits, max: CERT_MAX },
            { kind: "stamp" as const, label: "Stamp credits", value: stampCredits, max: STAMP_MAX },
          ].map((c) => (
            <div key={c.label} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-[12px]" style={{ color: tokens.textSecondary }}>
                <span>{c.label}</span>
                <span>{c.value ?? "—"}</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: tokens.tint1 }}>
                <div
                  className="h-full rounded-full"
                  style={{ width: `${c.value ? Math.min(100, (c.value / c.max) * 100) : 0}%`, background: tokens.text }}
                />
              </div>
              <button
                onClick={() => buyCredits(c.kind)}
                disabled={buyingCredits === c.kind}
                className="self-start text-[11px] cursor-pointer"
                style={{ background: "none", border: "none", color: tokens.textTertiary, padding: 0 }}
              >
                {buyingCredits === c.kind ? "Opening checkout…" : `Buy more ${c.label.toLowerCase()} →`}
              </button>
            </div>
          ))}
        </div>

        <div className="card elev-sm gap-2 p-5" style={{ background: tokens.surface, border: `1px solid ${tokens.border}` }}>
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-medium" style={{ color: tokens.text }}>Cash flow</span>
            <span className="text-[11px]" style={{ color: tokens.textQuaternary }}>Last 8 weeks</span>
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
                    fill={v >= 0 ? tokens.accentBlue : tokens.textQuaternary}
                  />
                );
              });
            })()}
            <line x1="0" y1="45" x2="320" y2="45" stroke={tokens.border} strokeWidth="1" />
          </svg>
        </div>
      </div>

      {/* Row 3: billing / today / statement — mirrors the reference's right-hand promo stack, laid horizontally here */}
      <div className="grid gap-3.5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
        <div className="card elev-sm gap-2 p-4" style={{ background: tokens.accentBg, color: tokens.accentText }}>
          <div className="text-[12px] font-medium">Manage billing</div>
          <div className="text-[11px]" style={{ color: tokens.accentTextMuted }}>Update your card, view invoices, or cancel — real Stripe portal.</div>
          <button className="btn text-[11.5px] self-start mt-1" style={{ background: tokens.accentText, color: tokens.accentBg, border: `1px solid ${tokens.accentText}` }} onClick={manageBilling} disabled={portalLoading}>
            {portalLoading ? "Opening…" : "Open →"}
          </button>
        </div>
        <div className="card elev-sm gap-1 p-4" style={{ background: tokens.surface, border: `1px solid ${tokens.border}` }}>
          <div className="text-[11px] tracking-[.08em] uppercase" style={{ color: tokens.textQuaternary }}>Received today</div>
          <div className="text-[20px] font-medium" style={{ color: tokens.text }}>{money(todayReceived)}</div>
        </div>
        <div className="card elev-sm gap-2 p-4" style={{ background: tokens.surface, border: `1px solid ${tokens.border}` }}>
          <div className="text-[12px] font-medium" style={{ color: tokens.text }}>Financial report</div>
          <button className="btn text-[11.5px] self-start" style={{ border: `1px solid ${tokens.border}`, color: tokens.textSecondary }} onClick={downloadStatement} disabled={transactions.length === 0}>
            Download CSV →
          </button>
        </div>
      </div>

      {links.length > 0 && (
        <div>
          <div className="text-[13px] font-medium mb-2" style={{ color: tokens.textSecondary }}>Payment links</div>
          <div className="flex flex-col gap-2">
            {links.slice(0, 3).map((l) => (
              <div key={l.id} className="flex items-center gap-2 p-3 rounded-lg" style={{ background: tokens.surface, border: `1px solid ${tokens.border}` }}>
                <span className="text-[13px] flex-1 truncate" style={{ color: tokens.text }}>{l.title}</span>
                <span style={{ color: tokens.text, fontSize: 13 }}>{money(l.amount_cents, l.currency)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transaction history table — mirrors the reference's table structure */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[13px] font-medium" style={{ color: tokens.textSecondary }}>Transaction history</span>
          <a href="/wallet" className="text-[11.5px]" style={{ color: tokens.textTertiary }}>View all →</a>
        </div>
        {loaded && transactions.length === 0 && (
          <div className="text-[13.5px]" style={{ color: tokens.textQuaternary }}>No transactions yet.</div>
        )}
        {transactions.length > 0 && (
          <div className="overflow-x-auto rounded-lg" style={{ border: `1px solid ${tokens.border}` }}>
            <table className="w-full text-[12.5px]" style={{ borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${tokens.border}` }}>
                  {["Name", "Type", "Date", "Status", "Amount"].map((h) => (
                    <th key={h} className="text-left p-2.5" style={{ color: tokens.textQuaternary, fontWeight: 500 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {transactions.slice(0, 8).map((t) => (
                  <tr key={t.id} style={{ borderBottom: `1px solid ${tokens.tint3}` }}>
                    <td className="p-2.5" style={{ color: tokens.text }}>{t.counterparty}</td>
                    <td className="p-2.5" style={{ color: tokens.textSecondary }}>{t.memo || "Wallet transaction"}</td>
                    <td className="p-2.5" style={{ color: tokens.textSecondary }}>{new Date(t.created_at).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}</td>
                    <td className="p-2.5">
                      <span className="tag text-[9.5px]" style={{ background: t.status === "completed" ? `color-mix(in srgb, ${tokens.success} 20%, transparent)` : tokens.tint1, color: t.status === "completed" ? tokens.success : tokens.textSecondary }}>
                        {t.status === "completed" ? "Complete" : t.status}
                      </span>
                    </td>
                    <td className="p-2.5 text-right" style={{ color: t.direction === "credit" ? tokens.success : tokens.text, fontWeight: 500 }}>
                      {t.direction === "credit" ? "+" : "−"}{money(t.amount_cents)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="card elev-sm gap-2 p-4" style={{ background: tokens.surface, border: `1px solid ${tokens.border}` }}>
        <div className="flex items-center gap-2">
          <span className="text-[13.5px] font-medium" style={{ color: tokens.text }}>Crypto</span>
          <span className="tag text-[9px]" style={{ border: `1px solid ${tokens.textQuaternary}`, color: tokens.textQuaternary }}>Not connected</span>
        </div>
        <div className="text-[12.5px]" style={{ color: tokens.textTertiary, lineHeight: 1.6 }}>
          Real crypto payment acceptance runs through NOWPayments and isn&rsquo;t wired in yet — the account owner
          needs to finish that signup before this can accept a real payment.
        </div>
      </div>
    </div>
  );
}
