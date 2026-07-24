"use client";

import { useEffect, useState } from "react";

export default function PayoutModal({ onClose, onPaidOut }: { onClose: () => void; onPaidOut: () => void }) {
  const [loading, setLoading] = useState(true);
  const [availableCents, setAvailableCents] = useState(0);
  const [pendingCents, setPendingCents] = useState(0);
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<{ status: string; arrivalDate?: number } | null>(null);
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
      setSuccess(data.payout);
      onPaidOut();
    } catch {
      setError("Couldn't reach the server.");
    }
    setSubmitting(false);
  }

  return (
    <div className="dialog-backdrop" onClick={onClose}>
      <div className="dialog" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-title">Payout to your bank</div>
        <div className="dialog-body flex flex-col gap-3">
          {loading ? (
            <div className="text-[12.5px] text-[var(--color-neutral-500)]">Checking your Stripe balance…</div>
          ) : success ? (
            <div className="text-[12.5px] text-[var(--color-neutral-300)] leading-[1.6]">
              Real payout created (status: <strong className="text-[var(--color-text)]">{success.status}</strong>).
              {success.arrivalDate && ` Expected to arrive around ${new Date(success.arrivalDate * 1000).toLocaleDateString()}.`}
              {" "}This moves money from your Stripe balance to the bank account linked to your Stripe account.
            </div>
          ) : (
            <>
              <div className="text-[12px] text-[var(--color-neutral-500)] leading-[1.6]">
                This is a real Stripe payout — it moves money from your Stripe balance to your own bank account,
                the one linked to your Stripe account. It doesn&rsquo;t pay a vendor or third party.
              </div>
              <div className="flex items-center justify-between text-[12.5px] p-2.5 rounded-lg" style={{ background: "var(--color-surface)" }}>
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
        <div className="dialog-actions">
          <button className="btn btn-secondary" onClick={onClose}>{success ? "Close" : "Cancel"}</button>
          {!success && !loading && (
            <button className="btn btn-primary" onClick={submit} disabled={submitting || availableCents === 0}>
              {submitting ? "Sending…" : "Pay out"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
