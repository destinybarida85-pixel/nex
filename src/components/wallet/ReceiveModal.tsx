"use client";

import { useEffect, useState } from "react";
import { useHasSession } from "@/lib/useSession";
import { isBackendConfigured } from "@/lib/backendStatus";

type PaymentLink = { id: string; title: string; amount_cents: number; currency: string; url: string };

export default function ReceiveModal({ onClose }: { onClose: () => void }) {
  const { hasSession, checked } = useHasSession();
  const [live, setLive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [links, setLinks] = useState<PaymentLink[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!checked || !isBackendConfigured || !hasSession) {
      setLoading(false);
      return;
    }
    fetch("/api/stripe/payment-links")
      .then((r) => r.json())
      .then((data) => {
        if (data.configured) {
          setLive(true);
          setLinks(data.links ?? []);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [checked, hasSession]);

  function copy(text: string, id: string) {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 1800);
  }

  async function createLink() {
    const cents = Math.round(Number(amount) * 100);
    if (!title.trim() || !cents || cents < 1) {
      setError("Give it a title and a valid amount.");
      return;
    }
    setError("");
    const res = await fetch("/api/stripe/payment-links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title.trim(), amountCents: cents, kind: "one_time" }),
    });
    const data = await res.json();
    if (!res.ok || data.error) {
      setError(data.error || "Couldn't create the payment link.");
      return;
    }
    setLinks((prev) => [data.link, ...prev]);
    setCreating(false);
    setTitle("");
    setAmount("");
  }

  return (
    <div className="dialog-backdrop" onClick={onClose}>
      <div className="dialog" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-title">Receive money</div>
        <div className="dialog-body flex flex-col gap-3">
          {loading ? (
            <div className="text-[12.5px] text-[var(--color-neutral-500)]">Loading…</div>
          ) : !live ? (
            <div className="text-[12.5px] text-[var(--color-neutral-500)] leading-[1.6]">
              Sign in and connect Stripe on the{" "}
              <a href="/payments" style={{ color: "var(--color-accent-300)" }}>Payments page</a>{" "}
              to generate a real, shareable link people can actually pay.
            </div>
          ) : (
            <>
              <div className="text-[12px] text-[var(--color-neutral-500)] leading-[1.6]">
                Share a link below — anyone who opens it pays through a real Stripe checkout page, and it lands
                directly in your account.
              </div>

              {links.length === 0 && !creating && (
                <div className="text-[12.5px] text-[var(--color-neutral-500)]">No payment links yet.</div>
              )}

              <div className="flex flex-col gap-2">
                {links.slice(0, 4).map((l) => (
                  <div key={l.id} className="flex items-center gap-2 p-2.5 rounded-lg" style={{ background: "var(--color-surface)" }}>
                    <div className="flex-1 min-w-0">
                      <div className="text-[12.5px] truncate">{l.title}</div>
                      <div className="text-[11px] text-[var(--color-neutral-500)]">
                        {(l.amount_cents / 100).toLocaleString(undefined, { style: "currency", currency: l.currency.toUpperCase() })}
                      </div>
                    </div>
                    <button className="btn btn-ghost text-[11px] px-1.5 py-0.5 flex-none" onClick={() => copy(l.url, l.id)}>
                      {copied === l.id ? "Copied!" : "Copy link"}
                    </button>
                  </div>
                ))}
              </div>

              {creating ? (
                <div className="flex flex-col gap-2 p-3 rounded-lg" style={{ background: "var(--color-surface)" }}>
                  <input className="input text-[12.5px]" placeholder="What's this for?" value={title} onChange={(e) => setTitle(e.target.value)} />
                  <input className="input text-[12.5px]" placeholder="Amount (USD)" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} />
                  {error && <div className="text-[11.5px]" style={{ color: "var(--color-accent-300)" }}>{error}</div>}
                  <button className="btn btn-primary text-[12.5px]" onClick={createLink}>Create link</button>
                </div>
              ) : (
                <button className="btn btn-secondary text-[12.5px]" onClick={() => setCreating(true)}>
                  New payment link
                </button>
              )}
            </>
          )}
        </div>
        <div className="dialog-actions">
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
