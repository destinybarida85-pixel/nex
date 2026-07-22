"use client";

import { useEffect, useState } from "react";
import { useHasSession } from "@/lib/useSession";
import { isBackendConfigured } from "@/lib/backendStatus";

const demoRows = [
  { party: "Halcyon Ventures", type: "Invoice #INV-2041", date: "Jul 21", status: "Received", tag: "tag-accent", amount: "+$18,500.00" },
  { party: "AWS", type: "Vendor payment", date: "Jul 20", status: "Cleared", tag: "tag-neutral", amount: "−$2,340.18" },
  { party: "Payroll · 14 employees", type: "Salary run", date: "Jul 18", status: "Cleared", tag: "tag-neutral", amount: "−$41,200.00" },
  { party: "Northbeam Co.", type: "Payment link", date: "Jul 17", status: "Received", tag: "tag-accent", amount: "+$6,750.00" },
  { party: "Figment Design", type: "Invoice #INV-2038", date: "Jul 15", status: "Pending", tag: "tag-outline", amount: "+$4,200.00" },
];

type WalletTx = {
  id: string;
  direction: "credit" | "debit";
  counterparty: string;
  amount_cents: number;
  status: string;
  memo: string | null;
  created_at: string;
};

export default function TransactionsTable() {
  const { hasSession, checked } = useHasSession();
  const [live, setLive] = useState(false);
  const [rows, setRows] = useState(demoRows);

  useEffect(() => {
    if (!checked || !isBackendConfigured || !hasSession) return;
    fetch("/api/wallet")
      .then((r) => r.json())
      .then((data) => {
        if (!data.configured) return;
        const transactions: WalletTx[] = data.transactions ?? [];
        setRows(
          transactions.slice(0, 5).map((t) => ({
            party: t.counterparty,
            type: t.memo || "Wallet transaction",
            date: new Date(t.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
            status: t.status === "completed" ? (t.direction === "credit" ? "Received" : "Cleared") : t.status,
            tag: t.status !== "completed" ? "tag-outline" : t.direction === "credit" ? "tag-accent" : "tag-neutral",
            amount: `${t.direction === "credit" ? "+" : "−"}${(t.amount_cents / 100).toLocaleString(undefined, { style: "currency", currency: "USD" })}`,
          }))
        );
        setLive(true);
      })
      .catch(() => {
        // Stay on the demo rows on any failure.
      });
  }, [checked, hasSession]);

  return (
    <div className="card elev-sm p-[18px_20px] gap-2.5">
      <div className="flex items-baseline gap-2.5">
        <div className="card-title text-[15px]">Recent transactions</div>
        <div className="flex-1" />
        <a href="/wallet" className="btn btn-ghost text-[12.5px]">View all</a>
      </div>
      <div className="overflow-x-auto -mx-1">
        <table className="table text-[13px] min-w-[520px] px-1">
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
                  No transactions yet.
                </td>
              </tr>
            )}
            {rows.map((r) => (
              <tr key={r.party + r.date}>
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
        <div className="text-[10.5px] text-[var(--color-neutral-500)] mt-1">Live from your Origin wallet.</div>
      )}
    </div>
  );
}
