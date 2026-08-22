"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import TransferModal from "@/components/wallet/TransferModal";
import ReceiveModal from "@/components/wallet/ReceiveModal";
import PayoutModal from "@/components/wallet/PayoutModal";
import CardsTab from "@/components/wallet/CardsTab";
import CryptoTab from "@/components/wallet/CryptoTab";
import Beneficiaries from "@/components/payments/Beneficiaries";
import { initialTransactions, type WalletTx } from "@/components/wallet/data";
import { useHasSession } from "@/lib/useSession";
import { isBackendConfigured } from "@/lib/backendStatus";
import { IconDownload, IconSend, IconReceive, IconArrowUpCircle, IconArrowDownCircle, IconEye, IconEyeOff } from "@/components/icons";

// A small fixed palette rather than an arbitrary hash-to-hue — keeps every
// avatar inside the app's existing accent family instead of drifting into
// colours nothing else on the page uses.
const AVATAR_COLORS = ["#9184d9", "#63c3b2", "#e0a35b", "#5b8fd9", "#c96bb0", "#4fae7a", "#d97b6b"];
function avatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

export default function WalletPage() {
  const { hasSession, checked } = useHasSession();
  const [live, setLive] = useState(false);
  const [primaryAccountId, setPrimaryAccountId] = useState<string | null>(null);

  const [view, setView] = useState<"overview" | "cards" | "crypto">("overview");
  const [transactions, setTransactions] = useState<WalletTx[]>(initialTransactions);
  const [balance, setBalance] = useState(248610.44);
  const [showTransfer, setShowTransfer] = useState(false);
  const [showReceive, setShowReceive] = useState(false);
  const [showPayout, setShowPayout] = useState(false);
  const [hideBalances, setHideBalances] = useState(false);
  const [stripeConfigured, setStripeConfigured] = useState(false);
  const [cryptoConfigured, setCryptoConfigured] = useState(false);

  function refetchWallet() {
    fetch("/api/wallet")
      .then((res) => res.json())
      .then((data) => {
        if (!data.configured || !data.accounts?.length) return;
        type DbAccount = { id: string; label: string; balance_cents: number };
        const accounts = data.accounts as DbAccount[];
        const primary = accounts.find((a) => a.label === "Primary") ?? accounts[0];

        setPrimaryAccountId(primary.id);
        setBalance(primary.balance_cents / 100);

        type DbTx = { id: string; counterparty: string; direction: string; amount_cents: number; created_at: string };
        const txs = (data.transactions ?? []) as DbTx[];
        setTransactions(
          txs.map((t) => ({
            id: t.id,
            party: t.counterparty,
            type: "Transfer",
            date: new Date(t.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
            status: t.direction === "credit" ? "Received" : "Sent",
            statusTag: t.direction === "credit" ? "tag-accent" : "tag-neutral",
            amount: `${t.direction === "credit" ? "+" : "-"}$${(t.amount_cents / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
            credit: t.direction === "credit",
          }))
        );
        setLive(true);
      })
      .catch(() => {
        // Stay in local demo mode on any failure.
      });
  }

  useEffect(() => {
    if (!checked || !isBackendConfigured || !hasSession) return;
    refetchWallet();
    fetch("/api/stripe/payment-links")
      .then((r) => r.json())
      .then((data) => {
        if (data.configured) {
          setStripeConfigured(!!data.stripeConfigured);
          setCryptoConfigured(!!data.cryptoConfigured);
        }
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checked, hasSession]);

  async function handleSend(party: string, amount: number) {
    if (live && primaryAccountId) {
      const res = await fetch("/api/wallet/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountId: primaryAccountId, counterparty: party, amountCents: Math.round(amount * 100) }),
      });
      const data = await res.json();
      if (res.ok && data.account) {
        setBalance(data.account.balance_cents / 100);
        setTransactions((prev) => [
          {
            id: `t-${Date.now()}`,
            party,
            type: "Transfer",
            date: "Just now",
            status: "Sent",
            statusTag: "tag-neutral",
            amount: `-$${amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
            credit: false,
          },
          ...prev,
        ]);
      }
      setShowTransfer(false);
      return;
    }

    const tx: WalletTx = {
      id: `t-${Date.now()}`,
      party,
      type: "Transfer",
      date: "Jul 21",
      status: "Sent",
      statusTag: "tag-neutral",
      amount: `-$${amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      credit: false,
    };
    setTransactions((prev) => [tx, ...prev]);
    setBalance((prev) => prev - amount);
    setShowTransfer(false);
  }

  function downloadStatement() {
    const rows = [
      ["Counterparty", "Type", "Date", "Status", "Amount"],
      ...transactions.map((t) => [t.party, t.type, t.date, t.status, t.amount]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "meridian-studio-statement.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  const filter = hideBalances ? { filter: "blur(7px)" } : undefined;

  // Parsed back out of the display string rather than kept as a separate
  // numeric field — WalletTx has always stored amount pre-formatted (both the
  // demo data and the live-mode mapper build it that way), so this reads
  // whatever's actually on screen instead of introducing a second source of
  // truth that could drift from it.
  function parseAmount(amount: string) {
    return Number(amount.replace(/[^0-9.]/g, "")) || 0;
  }
  const moneyIn = transactions.filter((t) => t.credit).reduce((sum, t) => sum + parseAmount(t.amount), 0);
  const moneyOut = transactions.filter((t) => !t.credit).reduce((sum, t) => sum + parseAmount(t.amount), 0);

  return (
    <div className="flex min-h-screen bg-[var(--color-bg)]">
      <Sidebar active="Business Wallet" />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <main className="p-4 pt-16 sm:p-[24px_28px_32px] flex flex-col gap-5 min-w-0">
          <div className="flex items-end gap-3 flex-wrap">
            <div>
              <h3 className="m-0 text-[22px]" style={{ color: "var(--color-text)" }}>Business Wallet</h3>
              <div className="text-[13.5px] mt-[3px]" style={{ color: "var(--color-neutral-500)" }}>
                Your Primue business balance{live && " · Saved to your account"}
              </div>
            </div>
            <div className="flex-1 hidden sm:block" />
            <div className="seg">
              <label className="seg-opt">
                <input type="radio" name="walletview" checked={view === "overview"} onChange={() => setView("overview")} />
                <span>Overview</span>
              </label>
              <label className="seg-opt">
                <input type="radio" name="walletview" checked={view === "cards"} onChange={() => setView("cards")} />
                <span>Cards</span>
              </label>
              <label className="seg-opt">
                <input type="radio" name="walletview" checked={view === "crypto"} onChange={() => setView("crypto")} />
                <span>Crypto</span>
              </label>
            </div>
            <button className="btn btn-secondary text-[14px]" onClick={downloadStatement}>
              <IconDownload size={14} />
              Download statement
            </button>
          </div>

          {view === "cards" && <CardsTab />}
          {view === "crypto" && <CryptoTab />}

          {view === "overview" && (
          <>
          <div className="grid gap-3.5 grid-cols-1 lg:grid-cols-[1.4fr_1fr]">
            <div
              className="rounded-xl p-7 flex flex-col gap-6"
              style={{
                background: "linear-gradient(150deg, var(--color-surface), color-mix(in srgb, var(--color-accent-900) 55%, var(--color-surface)))",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="flex items-center gap-1.5">
                    <div className="text-[11px] tracking-[.08em] uppercase text-[var(--color-neutral-500)]">Available balance</div>
                    <button
                      onClick={() => setHideBalances((v) => !v)}
                      className="text-[var(--color-neutral-500)] hover:text-[var(--color-text)] transition-colors"
                      aria-label={hideBalances ? "Show balances" : "Hide balances"}
                    >
                      {hideBalances ? <IconEyeOff size={13} /> : <IconEye size={13} />}
                    </button>
                  </div>
                  <div className="font-medium text-[40px] tracking-[-0.015em] mt-1" style={filter}>
                    ${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex flex-col gap-0.5">
                    <span className="flex items-center gap-1 text-[11px]" style={{ color: "#63c3b2" }}>
                      <IconArrowDownCircle size={12} /> In
                    </span>
                    <span className="text-[15px] font-medium" style={filter}>
                      ${moneyIn.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="flex items-center gap-1 text-[11px] text-[var(--color-neutral-400)]">
                      <IconArrowUpCircle size={12} /> Out
                    </span>
                    <span className="text-[15px] font-medium" style={filter}>
                      ${moneyOut.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2.5 flex-wrap">
                <button className="btn btn-primary text-[14px]" onClick={() => setShowTransfer(true)}>
                  <IconSend size={14} />
                  Transfer
                </button>
                <button className="btn btn-secondary text-[14px]" onClick={() => setShowReceive(true)}>
                  <IconReceive size={14} />
                  Receive
                </button>
                {live && (
                  <button className="btn btn-secondary text-[14px]" onClick={() => setShowPayout(true)}>
                    <IconArrowUpCircle size={14} />
                    Payout to bank
                  </button>
                )}
                {live && (
                  <a href="/receipts" className="btn btn-ghost text-[14px]">
                    Receipts
                  </a>
                )}
              </div>
            </div>

            <div className="card elev-sm p-5 gap-2.5">
              <div className="flex items-center">
                <span className="text-[10.5px] tracking-[.08em] uppercase text-[var(--color-neutral-500)]">Get paid</span>
                <span className="tag tag-accent ml-auto text-[9.5px]">
                  {stripeConfigured && cryptoConfigured ? "Stripe + Crypto" : cryptoConfigured ? "Crypto" : "Stripe"}
                </span>
              </div>
              <div className="text-[13.5px] text-[var(--color-neutral-300)] leading-[1.6]">
                Primue doesn&rsquo;t issue its own account numbers &mdash; real payments run through your own{" "}
                {stripeConfigured && cryptoConfigured
                  ? "Stripe or NOWPayments account"
                  : cryptoConfigured
                    ? "NOWPayments account"
                    : "Stripe account"}{" "}
                instead, so nothing here can bounce or mislead anyone.
              </div>
              <div className="text-[11.5px] text-[var(--color-neutral-500)] leading-[1.6]">
                Hit &ldquo;Receive&rdquo; to share a real, payable link, or manage all your links on the{" "}
                <a href="/payments" style={{ color: "var(--color-accent-300)" }}>Payments page</a>.
              </div>
              <button className="btn btn-secondary text-[13.5px] mt-1" onClick={() => setShowReceive(true)}>
                <IconReceive size={13} />
                Get a payment link
              </button>
            </div>
          </div>

          <div className="grid gap-3.5 items-start grid-cols-1 lg:grid-cols-[2fr_1fr]">
            <div className="card elev-sm p-[16px_18px] gap-1">
              <div className="card-title text-sm mb-1.5">Transaction history</div>
              {transactions.length === 0 ? (
                <div className="text-[12.5px] text-[var(--color-neutral-500)] py-4 text-center">No transactions yet.</div>
              ) : (
                transactions.map((t) => (
                  <div key={t.id} className="flex items-center gap-3 py-2.5 border-b last:border-b-0" style={{ borderColor: "var(--color-divider)" }}>
                    <span
                      className="w-9 h-9 rounded-full grid place-items-center text-[13px] font-medium flex-none"
                      style={{ background: `color-mix(in srgb, ${avatarColor(t.party)} 20%, transparent)`, color: avatarColor(t.party) }}
                    >
                      {t.party.charAt(0).toUpperCase()}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13.5px] truncate">{t.party}</div>
                      <div className="text-[11px] text-[var(--color-neutral-500)] truncate">{t.type} · {t.date}</div>
                    </div>
                    <span className={`tag ${t.statusTag} flex-none`}>{t.status}</span>
                    <span
                      className="text-[14px] font-medium flex-none w-[110px] text-right"
                      style={{ ...filter, color: t.credit ? "#63c3b2" : "var(--color-text)" }}
                    >
                      {t.amount}
                    </span>
                  </div>
                ))
              )}
            </div>

            <Beneficiaries />
          </div>
          </>
          )}
        </main>
      </div>

      {showTransfer && <TransferModal onClose={() => setShowTransfer(false)} onSend={handleSend} />}
      {showReceive && <ReceiveModal onClose={() => setShowReceive(false)} />}
      {showPayout && <PayoutModal onClose={() => setShowPayout(false)} onPaidOut={refetchWallet} />}
    </div>
  );
}
