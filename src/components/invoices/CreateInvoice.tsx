"use client";

import { useState } from "react";
import { IconPlus, IconCheckCircle } from "@/components/icons";
import SendInvoice from "./SendInvoice";

type Created = { id: string; title: string; amount_cents: number; currency: string };

// Creating an invoice and creating its payment link were the same act all
// along — an invoice here IS a real Stripe payment link with a title and an
// amount. This just stops making you go to a different page to do half of it,
// and hands back the shareable link the moment it exists.
export default function CreateInvoice({
  tenantName,
  onCreated,
}: {
  tenantName: string;
  onCreated: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [kind, setKind] = useState<"one_time" | "recurring">("one_time");
  const [interval, setIntervalValue] = useState<"day" | "week" | "month" | "year">("month");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [created, setCreated] = useState<Created | null>(null);

  function reset() {
    setTitle("");
    setAmount("");
    setKind("one_time");
    setError("");
  }

  async function create() {
    const cents = Math.round(Number(amount) * 100);
    if (!title.trim()) {
      setError("What is this invoice for?");
      return;
    }
    if (!cents || cents < 1 || Number.isNaN(cents)) {
      setError("Enter a valid amount.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/stripe/payment-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          amountCents: cents,
          kind,
          interval: kind === "recurring" ? interval : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || "Couldn't create that invoice.");
        return;
      }
      setCreated(data.link);
      setOpen(false);
      reset();
      onCreated();
    } catch {
      setError("Couldn't reach the server.");
    } finally {
      setSaving(false);
    }
  }

  const preview = (() => {
    const n = Number(amount);
    if (!amount || Number.isNaN(n)) return null;
    return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
  })();

  return (
    <div className="flex flex-col gap-2.5">
      {!open && !created && (
        <button className="btn btn-primary text-[13.5px] self-start" onClick={() => setOpen(true)}>
          <IconPlus size={13} />
          Create an invoice
        </button>
      )}

      {open && (
        <div className="flex flex-col gap-2.5 p-3.5 rounded-lg" style={{ background: "var(--color-bg)", border: "1px solid var(--color-divider)" }}>
          <div className="text-[13.5px] font-medium">New invoice</div>

          <input
            className="input text-[13.5px]"
            placeholder="What's it for? (e.g. Brand identity — phase 1)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />

          <div className="flex gap-2 flex-wrap">
            <input
              className="input text-[13.5px]"
              style={{ flex: "1 1 140px" }}
              placeholder="Amount (USD)"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <select
              className="input text-[13.5px]"
              style={{ maxWidth: 150 }}
              value={kind}
              onChange={(e) => setKind(e.target.value as "one_time" | "recurring")}
            >
              <option value="one_time">One-time</option>
              <option value="recurring">Recurring</option>
            </select>
            {kind === "recurring" && (
              <select
                className="input text-[13.5px]"
                style={{ maxWidth: 120 }}
                value={interval}
                onChange={(e) => setIntervalValue(e.target.value as typeof interval)}
              >
                <option value="day">Daily</option>
                <option value="week">Weekly</option>
                <option value="month">Monthly</option>
                <option value="year">Yearly</option>
              </select>
            )}
          </div>

          {preview && (
            <div className="text-[11px]" style={{ color: "var(--color-neutral-500)" }}>
              Your client will be asked to pay <strong style={{ color: "var(--color-text)" }}>{preview}</strong>
              {kind === "recurring" ? ` every ${interval}` : ""} through Stripe.
            </div>
          )}

          {error && <div className="text-[11.5px]" style={{ color: "var(--color-accent-300)" }}>{error}</div>}

          <div className="flex gap-1.5">
            <button className="btn btn-primary text-[13px]" onClick={create} disabled={saving}>
              {saving ? "Creating…" : "Create invoice"}
            </button>
            <button className="btn btn-secondary text-[13px]" onClick={() => { setOpen(false); reset(); }}>
              Cancel
            </button>
          </div>
          <div className="text-[10.5px]" style={{ color: "var(--color-neutral-600)" }}>
            This creates a real Stripe payment link. Money paid through it settles to your own Stripe account.
          </div>
        </div>
      )}

      {created && (
        <div className="flex flex-col gap-2.5 p-3.5 rounded-lg" style={{ background: "var(--color-bg)", border: "1px solid var(--color-divider)" }}>
          <div className="flex items-center gap-1.5 text-[13px] font-medium" style={{ color: "#63c3b2" }}>
            <IconCheckCircle size={14} />
            Invoice created — here's the link to send
          </div>
          <div className="text-[13px]">
            {created.title} ·{" "}
            {(created.amount_cents / 100).toLocaleString("en-US", { style: "currency", currency: created.currency.toUpperCase() })}
          </div>
          <SendInvoice
            invoiceId={created.id}
            title={created.title}
            amountLabel={(created.amount_cents / 100).toLocaleString("en-US", { style: "currency", currency: created.currency.toUpperCase() })}
            senderName={tenantName || "us"}
          />
          <button className="btn btn-ghost text-[11.5px] self-start" onClick={() => setCreated(null)}>
            Create another
          </button>
        </div>
      )}
    </div>
  );
}
