"use client";

import { useEffect, useState } from "react";
import { IconCheckCircle, IconArrowUpCircle } from "@/components/icons";

export default function PayoutModal({ onClose, onPaidOut }: { onClose: () => void; onPaidOut: () => void }) {
  const [loading, setLoading] = useState(true);
  const [availableCents, setAvailableCents] = useState(0);
  const [pendingCents, setPendingCents] = useState(0);
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<{ status: string; arrivalDate?: number; amountCents: number } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/wallet/payout")
      .then((r) => r.json())
      .then((data) => {
        if (data.configured) {
          setAvailableCents(data.availableCents ?? 0);
          setPendingCents(data.pendingCents ?? 0);
        } else {
          setError("Stripe isn't connected yet.");
        }
      })
      .catch(() => setError("Couldn't reach the server."))
      .finally(() => setLoading(false));
  }, []);

  async function submit() {
    const cents = Math.round(Number(amount) * 100);
    if (!cents || cents < 1) {
      setError("Enter a valid amount.");
      return;
    }
    if (cents > availableCents) {
      setError("That's more than your available Stripe balance.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/wallet/payout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amountCents: cents }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || "Couldn't create the payout.");
        setSubmitting(false);
        return;
      }
      setSuccess({ ...data.payout, amountCents: cents });
      onPaidOut();
    } catch {
      setError("Couldn't reach the server.");
    }
    setSubmitting(false);
  }

  return (
    <div className="dialog-backdrop" onClick={onClose}>
      <div className="dialog" onClick={(e) => e.stopPropagation()}>
        {success ? (
          <div className="dialog-body flex flex-col items-center gap-3 text-center py-2">
            <span
              className="w-14 h-14 rounded-full grid place-items-center"
              style={{ color: "#63c3b2", background: "color-mix(in srgb, #63c3b2 16%, transparent)" }}
            >
              <IconCheckCircle size={28} />
            </span>
            <div>
              <div className="text-[22px] font-medium tracking-[-0.01em]">
                ${(success.amountCents / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
              <div className="text-[12.5px] text-[var(--color-neutral-500)] mt-0.5">sent to your bank</div>
            </div>
            <div className="w-full flex flex-col gap-1.5 mt-1 p-3 rounded-lg text-left" style={{ background: "var(--color-surface)" }}>
              <div className="flex items-center justify-between text-[12.5px]">
                <span className="text-[var(--color-neutral-500)]">Status</span>
                <span className="tag tag-accent text-[10px] capitalize">{success.status}</span>
              </div>
              {success.arrivalDate && (
                <div className="flex items-center justify-between text-[12.5px]">
                  <span className="text-[var(--color-neutral-500)]">Expected to arrive</span>
                  <span className="font-medium">{new Date(success.arrivalDate * 1000).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-[12.5px]">
                <span className="text-[var(--color-neutral-500)]">Destination</span>
                <span className="font-medium">Your linked bank account</span>
              </div>
            </div>
            <div className="text-[10.5px] text-[var(--color-neutral-500)] leading-[1.5]">
              A real Stripe payout — this moved money from your Stripe balance to the bank account linked to
              your Stripe account.
            </div>
          </div>
        ) : (
          <>
            <div className="dialog-title">Payout to your bank</div>
            <div className="dialog-body flex flex-col gap-3">
              {loading ? (
                <div className="text-[13.5px] text-[var(--color-neutral-500)]">Checking your Stripe balance…</div>
              ) : (
                <>
                  <div className="text-[13px] text-[var(--color-neutral-500)] leading-[1.6]">
                    This is a real Stripe payout — it moves money from your Stripe balance to your own bank account,
                    the one linked to your Stripe account. It doesn&rsquo;t pay a vendor or third party.
                  </div>
                  <div className="flex items-center justify-between text-[13.5px] p-2.5 rounded-lg" style={{ background: "var(--color-surface)" }}>
                    <span className="text-[var(--color-neutral-500)]">Available now</span>
                    <span className="font-medium">${(availableCents / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                  {pendingCents > 0 && (
                    <div className="text-[11px] text-[var(--color-neutral-500)]">
                      +${(pendingCents / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })} still settling, not payable yet.
                    </div>
                  )}
                  <div className="field">
                    <label>Amount (USD)</label>
                    <input className="input" placeholder="0.00" value={amount} onChange={(e) => { setAmount(e.target.value); setError(""); }} inputMode="decimal" />
                  </div>
                  {error && <div className="text-[11.5px]" style={{ color: "var(--color-accent-300)" }}>{error}</div>}
                </>
              )}
            </div>
          </>
        )}
        <div className="dialog-actions">
          <button className="btn btn-secondary" onClick={onClose}>{success ? "Close" : "Cancel"}</button>
          {!success && !loading && (
            <button className="btn btn-primary" onClick={submit} disabled={submitting || availableCents === 0}>
              <IconArrowUpCircle size={13} />
              {submitting ? "Sending…" : "Pay out"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
