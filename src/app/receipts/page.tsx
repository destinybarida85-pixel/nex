"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import { useHasSession } from "@/lib/useSession";
import { isBackendConfigured } from "@/lib/backendStatus";
import { IconWallet, IconLink } from "@/components/icons";

type Receipt = { id: string; kind: "payment" | "payout"; amount_cents: number; currency: string; counterparty: string | null; reference: string | null; created_at: string };

export default function ReceiptsPage() {
  const { hasSession, checked } = useHasSession();
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [live, setLive] = useState(false);

  useEffect(() => {
    if (!checked || !isBackendConfigured || !hasSession) return;
    fetch("/api/receipts")
      .then((r) => r.json())
      .then((data) => {
        if (data.configured) {
          setLive(true);
          if (data.receipts) setReceipts(data.receipts);
        }
      })
      .catch(() => {});
  }, [checked, hasSession]);

  return (
    <div className="flex min-h-screen bg-[var(--color-bg)]">
      <Sidebar active="Business Wallet" />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <main className="p-4 pt-16 sm:p-[24px_28px_28px] flex flex-col gap-5 min-w-0 max-w-[720px]">
          <div>
            <h3 className="m-0 text-[22px]">Receipts</h3>
            <div className="text-muted text-[12.5px] mt-[3px]">Every real payment received and payout sent.</div>
          </div>

          {!live && <div className="card elev-sm p-4 text-[12.5px] text-[var(--color-neutral-500)]">Sign in to see your real receipts.</div>}

          {live && receipts.length === 0 && (
            <div className="card elev-sm p-6 text-center text-[12.5px] text-[var(--color-neutral-500)]">No receipts yet.</div>
          )}

          <div className="flex flex-col gap-2">
            {receipts.map((r) => (
              <div key={r.id} className="card elev-sm p-4 flex items-center gap-3">
                {r.kind === "payment" ? <IconLink size={15} className="text-[var(--color-accent)] flex-none" /> : <IconWallet size={15} className="text-[var(--color-accent)] flex-none" />}
                <div className="flex-1 min-w-0">
                  <div className="text-[13px]">{r.kind === "payment" ? "Payment received" : "Payout to bank"}</div>
                  <div className="text-[11.5px] text-[var(--color-neutral-500)] truncate">
                    {r.counterparty}{r.reference ? ` · ${r.reference}` : ""} · {new Date(r.created_at).toLocaleString()}
                  </div>
                </div>
                <div className="text-[14px] font-medium flex-none">
                  {r.kind === "payment" ? "+" : "-"}
                  {(r.amount_cents / 100).toLocaleString(undefined, { style: "currency", currency: r.currency.toUpperCase() })}
                </div>
              </div>
            ))}
          </div>

          <div className="text-[11px] text-[var(--color-neutral-500)] leading-[1.6]">
            These receipts are real and stored on your account. Emailing a copy to the client automatically needs a
            connected email service (Resend/Postmark) tied to your own domain — not set up yet.
          </div>
        </main>
      </div>
    </div>
  );
}
