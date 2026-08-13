"use client";

import { useEffect, useState } from "react";
import { useHasSession } from "@/lib/useSession";
import { isBackendConfigured } from "@/lib/backendStatus";

type WalletTx = {
  id: string;
  direction: "credit" | "debit";
  counterparty: string;
  amount_cents: number;
  status: string;
  memo: string | null;
  created_at: string;
};

type Row = { id: string; party: string; type: string; date: string; status: string; tag: string; amount: string };

function toRow(t: WalletTx): Row {
  return {
    id: t.id,
    party: t.counterparty,
    type: t.memo || "Wallet transaction",
    date: new Date(t.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    status: t.status === "completed" ? (t.direction === "credit" ? "Received" : "Cleared") : t.status,
    tag: t.status !== "completed" ? "tag-outline" : t.direction === "credit" ? "tag-accent" : "tag-neutral",
    amount: `${t.direction === "credit" ? "+" : "−"}${(t.amount_cents / 100).toLocaleString(undefined, { style: "currency", currency: "USD" })}`,
  };
}

export default function PaymentHistoryTable() {
  const { hasSession, checked } = useHasSession();
  const [live, setLive] = useState(false);
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    if (!checked || !isBackendConfigured || !hasSession) return;
    fetch("/api/wallet")
      .then((r) => r.json())
      .then((data) => {
        if (!data.configured) return;
        const transactions: WalletTx[] = data.transactions ?? [];
        setRows(transactions.slice(0, 8).map(toRow));
        setLive(true);
      })
      .catch(() => {
        // Stay on the empty state on any failure.
      });
  }, [checked, hasSession]);

  return (
    <div className="card elev-sm p-[16px_18px] gap-2.5">
      <div className="flex items-baseline">
        <div className="card-title text-sm">Payment history</div>
        <a href="/wallet" className="btn btn-ghost text-[13.5px] ml-auto">View all</a>
      </div>
      <div className="overflow-x-auto">
      <table className="table text-[14px] min-w-[480px]">
        <thead>
          <tr>
            <th>Counterparty</th>
            <th>Type</th>
            <th>Date</th>
            <th>Status</th>
            <th className="text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td colSpan={5} className="text-[var(--color-neutral-500)] py-3">
                {live ? "No payments yet." : "Loading…"}
              </td>
            </tr>
          )}
          {rows.map((r) => (
            <tr key={r.id}>
              <td>{r.party}</td>
              <td>{r.type}</td>
              <td>{r.date}</td>
              <td>
                <span className={`tag ${r.tag}`}>{r.status}</span>
              </td>
              <td className="text-right">{r.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      {live && (
        <div className="text-[10.5px] text-[var(--color-neutral-500)] mt-1">Live from your Primue wallet.</div>
      )}
    </div>
  );
}
