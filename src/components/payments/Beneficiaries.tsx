"use client";

import { useEffect, useState } from "react";
import { banksByCountry, countryNames } from "@/components/wallet/data";
import { IconPlus, IconX } from "@/components/icons";
import { useHasSession } from "@/lib/useSession";
import { isBackendConfigured } from "@/lib/backendStatus";

type Beneficiary = { id: string; name: string; bank: string; account_number: string; country: string };

// A small fixed palette rather than an arbitrary hash-to-hue — keeps every
// avatar inside the app's existing accent family instead of drifting into
// colours nothing else on the page uses.
const AVATAR_COLORS = ["#9184d9", "#63c3b2", "#e0a35b", "#5b8fd9", "#c96bb0", "#4fae7a", "#d97b6b"];
function avatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

function maskAccount(accountNumber: string) {
  const digits = accountNumber.replace(/\s/g, "");
  return digits.length > 4 ? `•• ${digits.slice(-4)}` : accountNumber;
}

export default function Beneficiaries() {
  const { hasSession, checked } = useHasSession();
  const [live, setLive] = useState(false);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [name, setName] = useState("");
  const [country, setCountry] = useState("US");
  const [bank, setBank] = useState(banksByCountry.US[0]);
  const [accountNumber, setAccountNumber] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!checked || !isBackendConfigured || !hasSession) return;
    fetch("/api/beneficiaries")
      .then((r) => r.json())
      .then((data) => {
        if (!data.configured) return;
        setBeneficiaries(data.beneficiaries ?? []);
        setLive(true);
      })
      .catch(() => {
        // Stay in local, unsaved mode on any failure.
      });
  }, [checked, hasSession]);

  async function addBeneficiary() {
    if (!name.trim() || !accountNumber.trim()) return;
    setError("");

    if (!live) {
      setError("Sign in to save beneficiaries — they can't be saved right now.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/beneficiaries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), bank, accountNumber: accountNumber.trim(), country }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Couldn't save that beneficiary.");
      setBeneficiaries((prev) => [data.beneficiary, ...prev]);
      setName("");
      setAccountNumber("");
      setCountry("US");
      setBank(banksByCountry.US[0]);
      setFormOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save that beneficiary.");
    } finally {
      setSaving(false);
    }
  }

  async function removeBeneficiary(id: string) {
    setBeneficiaries((prev) => prev.filter((b) => b.id !== id));
    await fetch(`/api/beneficiaries/${id}`, { method: "DELETE" }).catch(() => {});
  }

  return (
    <div className="card elev-sm p-[16px_18px] gap-2.5">
      <div className="flex items-baseline">
        <div className="card-title text-sm">Beneficiaries</div>
        <button className="btn btn-ghost text-[11.5px] ml-auto" onClick={() => setFormOpen((v) => !v)}>
          <IconPlus size={12} />
          Add
        </button>
      </div>
      {formOpen && (
        <div className="flex flex-col gap-1.5 p-2.5 rounded-lg" style={{ background: "var(--color-bg)" }}>
          <input className="input text-[13px]" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <select
            className="input text-[13px]"
            value={country}
            onChange={(e) => {
              const c = e.target.value;
              setCountry(c);
              setBank(banksByCountry[c][0]);
            }}
          >
            {Object.keys(banksByCountry).map((c) => (
              <option key={c} value={c}>{countryNames[c]}</option>
            ))}
          </select>
          <select className="input text-[13px]" value={bank} onChange={(e) => setBank(e.target.value)}>
            {banksByCountry[country].map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
          <input
            className="input text-[13px] font-mono"
            placeholder="Account number"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
          />
          {error && <div className="text-[11.5px]" style={{ color: "var(--color-accent-300)" }}>{error}</div>}
          <button className="btn btn-primary text-[11.5px]" onClick={addBeneficiary} disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      )}
      <div className="flex flex-col gap-2">
        {beneficiaries.length === 0 && !formOpen && (
          <div className="text-[12.5px] text-[var(--color-neutral-500)] py-2">
            No beneficiaries yet — add one to save it for next time.
          </div>
        )}
        {beneficiaries.map((b) => (
          <div
            key={b.id}
            className="nx-tilt group flex items-center gap-2.5 p-2 rounded-lg border"
            style={{ background: "var(--color-bg)", borderColor: "var(--color-divider)" }}
          >
            <span
              className="w-7 h-7 rounded-[9px] grid place-items-center text-[11px] font-medium flex-none"
              style={{ background: `color-mix(in srgb, ${avatarColor(b.name)} 20%, transparent)`, color: avatarColor(b.name) }}
            >
              {b.name.charAt(0).toUpperCase()}
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-[13.5px] truncate">{b.name}</div>
              <div className="text-[10.5px] text-[var(--color-neutral-500)]">
                {b.bank}{b.country && ` · ${countryNames[b.country] || b.country}`}
              </div>
            </div>
            <span className="font-mono text-[11px] text-[var(--color-neutral-500)]">{maskAccount(b.account_number)}</span>
            <button
              className="opacity-0 group-hover:opacity-100 transition-opacity text-[var(--color-neutral-500)] hover:text-[var(--color-text)] flex-none"
              onClick={() => removeBeneficiary(b.id)}
              aria-label={`Remove ${b.name}`}
            >
              <IconX size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
