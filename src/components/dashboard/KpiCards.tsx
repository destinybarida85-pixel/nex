"use client";

import { useEffect, useState } from "react";
import { IconEye, IconEyeOff } from "@/components/icons";
import { useHasSession } from "@/lib/useSession";
import { isBackendConfigured } from "@/lib/backendStatus";

type WalletAccount = { balance_cents: number };
type WalletTx = { direction: "credit" | "debit"; amount_cents: number; created_at: string };

function formatCents(cents: number) {
  return (cents / 100).toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export default function KpiCards() {
  const { hasSession, checked } = useHasSession();
  const [hideBalances, setHideBalances] = useState(false);
  const [live, setLive] = useState(false);
  const [balanceCents, setBalanceCents] = useState(24861044);
  const [revenueCents, setRevenueCents] = useState(8624000);
  const [expensesCents, setExpensesCents] = useState(3190500);

  useEffect(() => {
    if (!checked || !isBackendConfigured || !hasSession) return;
    fetch("/api/wallet")
      .then((r) => r.json())
      .then((data) => {
        if (!data.configured) return;
        const accounts: WalletAccount[] = data.accounts ?? [];
        const transactions: WalletTx[] = data.transactions ?? [];
        const now = new Date();
        const monthTx = transactions.filter((t) => {
          const d = new Date(t.created_at);
          return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        });
        setBalanceCents(accounts.reduce((sum, a) => sum + a.balance_cents, 0));
        setRevenueCents(monthTx.filter((t) => t.direction === "credit").reduce((sum, t) => sum + t.amount_cents, 0));
        setExpensesCents(monthTx.filter((t) => t.direction === "debit").reduce((sum, t) => sum + t.amount_cents, 0));
        setLive(true);
      })
      .catch(() => {
        // Stay on the demo values on any failure.
      });
  }, [checked, hasSession]);

  const filter = hideBalances ? { filter: "blur(7px)" } : undefined;
  const netProfitCents = revenueCents - expensesCents;
  const margin = revenueCents > 0 ? Math.round((netProfitCents / revenueCents) * 100) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      <div className="card elev-sm gap-[7px] p-[16px_18px]">
        <div className="flex items-center gap-1.5 text-[11px] tracking-[.08em] uppercase text-[var(--color-neutral-500)]">
          Wallet balance
          <button
            onClick={() => setHideBalances((v) => !v)}
            className="ml-auto text-[var(--color-neutral-500)] hover:text-[var(--color-text)] transition-colors"
            aria-label={hideBalances ? "Show balances" : "Hide balances"}
          >
            {hideBalances ? <IconEyeOff size={13} /> : <IconEye size={13} />}
          </button>
        </div>
        <div className="font-medium text-[26px] tracking-[-0.01em]" style={filter}>
          {formatCents(balanceCents)}
        </div>
        <div className="card-meta whitespace-nowrap">
          {live ? "Your Origin wallet" : "Demo wallet balance"}
        </div>
      </div>

      <div className="card elev-sm gap-[7px] p-[16px_18px]">
        <div className="text-[11px] tracking-[.08em] uppercase text-[var(--color-neutral-500)]">Monthly revenue</div>
        <div className="font-medium text-[26px] tracking-[-0.01em]" style={filter}>
          {formatCents(revenueCents)}
        </div>
        <div className="card-meta">{live ? "This calendar month" : <><span className="tag tag-accent text-[10px]">▲ 12.4%</span>vs June</>}</div>
      </div>

      <div className="card elev-sm gap-[7px] p-[16px_18px]">
        <div className="text-[11px] tracking-[.08em] uppercase text-[var(--color-neutral-500)]">Expenses</div>
        <div className="font-medium text-[26px] tracking-[-0.01em]" style={filter}>
          {formatCents(expensesCents)}
        </div>
        <div className="card-meta">{live ? "This calendar month" : <><span className="tag tag-neutral text-[10px]">▼ 3.1%</span>vs June</>}</div>
      </div>

      <div className="card elev-sm gap-[7px] p-[16px_18px]">
        <div className="text-[11px] tracking-[.08em] uppercase text-[var(--color-neutral-500)]">Net profit</div>
        <div className="font-medium text-[26px] tracking-[-0.01em]" style={filter}>
          {formatCents(netProfitCents)}
        </div>
        <div className="card-meta">
          {live ? (
            revenueCents > 0 ? `margin ${margin}%` : "No revenue yet this month"
          ) : (
            <><span className="tag tag-accent text-[10px]">▲ 18.2%</span>margin 63%</>
          )}
        </div>
      </div>
    </div>
  );
}
