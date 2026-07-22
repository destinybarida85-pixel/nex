"use client";

import { useEffect, useState } from "react";
import { paymentLinks as demoPaymentLinks } from "./data";
import { IconLink, IconPlus, IconCheckCircle, IconArrowRight } from "@/components/icons";
import { useHasSession } from "@/lib/useSession";
import { isBackendConfigured } from "@/lib/backendStatus";

type ConnectAccount = { stripe_account_id: string; charges_enabled: boolean; details_submitted: boolean } | null;
type PaymentLink = {
  id: string;
  title: string;
  amount_cents: number;
  currency: string;
  kind: "one_time" | "recurring";
  interval: string | null;
  url: string;
  uses_count: number;
  status: string;
};

function formatAmount(cents: number, currency: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: currency.toUpperCase() }).format(cents / 100);
}

export default function StripePaymentLinksSection() {
  const { hasSession, checked } = useHasSession();
  const [live, setLive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState<ConnectAccount>(null);
  const [links, setLinks] = useState<PaymentLink[]>([]);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState("");

  const [creating, setCreating] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [kind, setKind] = useState<"one_time" | "recurring">("one_time");
  const [interval, setIntervalValue] = useState<"day" | "week" | "month" | "year">("month");

  useEffect(() => {
    if (!checked || !isBackendConfigured || !hasSession) {
      setLoading(false);
      return;
    }
    Promise.all([
      fetch("/api/stripe/connect").then((r) => r.json()),
      fetch("/api/stripe/payment-links").then((r) => r.json()),
    ])
      .then(([connectData, linksData]) => {
        if (connectData.configured) {
          setLive(true);
          setAccount(connectData.account ?? null);
        }
        if (linksData.configured && linksData.links) {
          setLinks(linksData.links);
        }
      })
      .catch(() => {
        // Stay in demo mode on any failure.
      })
      .finally(() => setLoading(false));
  }, [checked, hasSession]);

  async function connectStripe() {
    setConnecting(true);
    setError("");
    try {
      const res = await fetch("/api/stripe/connect", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      setError(data.error || "Couldn't start Stripe onboarding.");
    } catch {
      setError("Couldn't reach the server.");
    }
    setConnecting(false);
  }

  async function createLink() {
    const cents = Math.round(Number(amount) * 100);
    if (!title.trim() || !cents || cents < 1) {
      setError("Give the link a title and a valid amount.");
      return;
    }
    setCreating(true);
    setError("");
    try {
      const res = await fetch("/api/stripe/payment-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), amountCents: cents, kind, interval: kind === "recurring" ? interval : undefined }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || "Couldn't create the payment link.");
        setCreating(false);
        return;
      }
      setLinks((prev) => [data.link, ...prev]);
      setFormOpen(false);
      setTitle("");
      setAmount("");
      setKind("one_time");
    } catch {
      setError("Couldn't reach the server.");
    }
    setCreating(false);
  }

  if (loading) {
    return (
      <div className="card elev-sm p-[16px_18px]">
        <div className="text-[12.5px] text-[var(--color-neutral-500)]">Loading payment links…</div>
      </div>
    );
  }

  // Not signed in, or backend not configured yet — show the original demo table untouched.
  if (!live) {
    return (
      <div className="card elev-sm p-[16px_18px] gap-2.5">
        <div className="flex items-center gap-2">
          <IconLink size={14} className="text-[var(--color-accent)]" />
          <div className="card-title text-sm">Payment links</div>
        </div>
        <div className="overflow-x-auto">
          <table className="table text-[12.5px] min-w-[440px]">
            <thead>
              <tr>
                <th>Name</th>
                <th>Amount</th>
                <th>Type</th>
                <th>Uses</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {demoPaymentLinks.map((l) => (
                <tr key={l.name}>
                  <td>{l.name}</td>
                  <td>{l.amount}</td>
                  <td>{l.type}</td>
                  <td>{l.uses}</td>
                  <td>
                    <span className={`tag ${l.statusTag}`}>{l.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (!account?.stripe_account_id) {
    return (
      <div className="card elev-sm p-[18px_20px] gap-3">
        <div className="flex items-center gap-2">
          <IconLink size={14} className="text-[var(--color-accent)]" />
          <div className="card-title text-sm">Payment links</div>
        </div>
        <div className="text-[12.5px] text-[var(--color-neutral-500)] leading-[1.6]">
          Connect a Stripe account to create real, live payment links. Money paid through them settles directly to
          your own Stripe account — Origin never touches or holds it.
        </div>
        {error && <div className="text-[12px]" style={{ color: "var(--color-accent-300)" }}>{error}</div>}
        <button className="btn btn-primary text-[13px] gap-2" style={{ width: "fit-content" }} onClick={connectStripe} disabled={connecting}>
          {connecting ? "Connecting…" : "Connect Stripe"}
          <IconArrowRight size={14} />
        </button>
      </div>
    );
  }

  if (!account.charges_enabled) {
    return (
      <div className="card elev-sm p-[18px_20px] gap-3">
        <div className="flex items-center gap-2">
          <IconLink size={14} className="text-[var(--color-accent)]" />
          <div className="card-title text-sm">Payment links</div>
        </div>
        <div className="text-[12.5px] text-[var(--color-neutral-500)] leading-[1.6]">
          Your Stripe account is connected but still finishing onboarding (identity/business verification with
          Stripe directly). Once Stripe marks it complete, you can start creating payment links here.
        </div>
        <button className="btn btn-secondary text-[13px] gap-2" style={{ width: "fit-content" }} onClick={connectStripe} disabled={connecting}>
          {connecting ? "Loading…" : "Continue onboarding"}
        </button>
      </div>
    );
  }

  return (
    <div className="card elev-sm p-[16px_18px] gap-3">
      <div className="flex items-center gap-2">
        <IconLink size={14} className="text-[var(--color-accent)]" />
        <div className="card-title text-sm">Payment links</div>
        <span className="tag tag-accent text-[9.5px]">Stripe connected</span>
        <div className="flex-1" />
        <button className="btn btn-secondary text-[12px] gap-1.5" onClick={() => setFormOpen((v) => !v)}>
          <IconPlus size={13} />
          New link
        </button>
      </div>

      {formOpen && (
        <div className="flex flex-col gap-2 p-3 rounded-lg" style={{ background: "var(--color-bg)" }}>
          <input className="input text-[12.5px]" placeholder="What's this for? (e.g. Consulting deposit)" value={title} onChange={(e) => setTitle(e.target.value)} />
          <div className="flex gap-2">
            <input className="input text-[12.5px]" placeholder="Amount (USD)" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} />
            <select className="input text-[12.5px]" style={{ maxWidth: 130 }} value={kind} onChange={(e) => setKind(e.target.value as "one_time" | "recurring")}>
              <option value="one_time">One-time</option>
              <option value="recurring">Recurring</option>
            </select>
            {kind === "recurring" && (
              <select className="input text-[12.5px]" style={{ maxWidth: 110 }} value={interval} onChange={(e) => setIntervalValue(e.target.value as typeof interval)}>
                <option value="day">Daily</option>
                <option value="week">Weekly</option>
                <option value="month">Monthly</option>
                <option value="year">Yearly</option>
              </select>
            )}
          </div>
          {error && <div className="text-[12px]" style={{ color: "var(--color-accent-300)" }}>{error}</div>}
          <button className="btn btn-primary text-[12.5px]" style={{ width: "fit-content" }} onClick={createLink} disabled={creating}>
            {creating ? "Creating…" : "Create real payment link"}
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="table text-[12.5px] min-w-[520px]">
          <thead>
            <tr>
              <th>Name</th>
              <th>Amount</th>
              <th>Type</th>
              <th>Uses</th>
              <th>Status</th>
              <th>Link</th>
            </tr>
          </thead>
          <tbody>
            {links.length === 0 && (
              <tr>
                <td colSpan={6} className="text-[var(--color-neutral-500)] py-3">
                  No payment links yet. Create one above — it'll be a real, live Stripe checkout page.
                </td>
              </tr>
            )}
            {links.map((l) => (
              <tr key={l.id}>
                <td>{l.title}</td>
                <td>
                  {formatAmount(l.amount_cents, l.currency)}
                  {l.kind === "recurring" ? `/${l.interval}` : ""}
                </td>
                <td>{l.kind === "recurring" ? "Recurring" : "One-time"}</td>
                <td>{l.uses_count}</td>
                <td>
                  <span className={`tag ${l.status === "active" ? "tag-accent" : "tag-outline"}`}>{l.status}</span>
                </td>
                <td>
                  <a href={l.url} target="_blank" rel="noreferrer" className="text-[11.5px] font-mono" style={{ color: "var(--color-accent-300)" }}>
                    Open ↗
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-1.5 text-[10.5px] text-[var(--color-neutral-500)]">
        <IconCheckCircle size={11} />
        These are genuine Stripe checkout links. Payments settle directly to your connected Stripe account.
      </div>
    </div>
  );
}
