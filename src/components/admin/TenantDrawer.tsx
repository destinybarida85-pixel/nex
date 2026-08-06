"use client";

import { useEffect, useState } from "react";
import { IconX, IconGlobe } from "@/components/icons";
import type { Tenant } from "./tenants";

function money(cents: number) {
  return `$${(cents / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function TenantDrawer({
  tenant,
  onClose,
  onChanged,
}: {
  tenant: Tenant | null;
  onClose: () => void;
  onChanged: () => void;
}) {
  const [entered, setEntered] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (tenant) {
      const raf = requestAnimationFrame(() => setEntered(true));
      return () => cancelAnimationFrame(raf);
    }
    setEntered(false);
  }, [tenant]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!tenant) return null;

  async function toggleSuspend() {
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/tenants/${tenant!.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ suspended: !tenant!.suspended }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Couldn't update that tenant.");
      onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't update that tenant.");
    } finally {
      setBusy(false);
    }
  }

  const initial = tenant.name.charAt(0).toUpperCase();
  const brand = tenant.brandColor || "var(--color-accent)";

  return (
    <div className="fixed inset-0 z-30 flex justify-end">
      <div
        className="absolute inset-0 transition-opacity duration-200"
        style={{ background: "color-mix(in srgb, var(--color-neutral-900) 55%, transparent)", opacity: entered ? 1 : 0 }}
        onClick={onClose}
      />
      <div
        className="relative w-[420px] max-w-full h-full flex flex-col transition-transform duration-200 ease-out"
        style={{
          background: "var(--color-bg)",
          borderLeft: "1px solid var(--color-divider)",
          boxShadow: "var(--shadow-lg)",
          transform: entered ? "translateX(0)" : "translateX(100%)",
        }}
      >
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[var(--color-divider)]">
          <span
            className="w-9 h-9 rounded-[10px] grid place-items-center font-medium text-[15px] flex-none"
            style={{ background: `color-mix(in srgb, ${brand} 18%, transparent)`, color: brand }}
          >
            {initial}
          </span>
          <div className="min-w-0">
            <div className="text-[15px] font-medium truncate">{tenant.name}</div>
            <div className="text-[11px] font-mono text-[var(--color-neutral-500)] truncate">{tenant.domain || "No custom domain"}</div>
          </div>
          <span className={`tag ${tenant.suspended ? "tag-outline" : "tag-accent"} ml-auto flex-none`}>
            {tenant.suspended ? "Suspended" : tenant.subscriptionStatus}
          </span>
          <button className="btn btn-icon btn-secondary flex-none" aria-label="Close" onClick={onClose}>
            <IconX size={14} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-3">
            <div className="card elev-sm gap-1 p-3">
              <div className="text-[10px] tracking-[.08em] uppercase text-[var(--color-neutral-500)]">Plan</div>
              <span className="tag tag-neutral self-start capitalize">{tenant.plan}</span>
            </div>
            <div className="card elev-sm gap-1 p-3">
              <div className="text-[10px] tracking-[.08em] uppercase text-[var(--color-neutral-500)]">Users</div>
              <div className="text-[17px] font-medium">{tenant.users}</div>
            </div>
            <div className="card elev-sm gap-1 p-3">
              <div className="text-[10px] tracking-[.08em] uppercase text-[var(--color-neutral-500)]">Wallet vol · 30d</div>
              <div className="text-[17px] font-medium">{money(tenant.walletVolume30dCents)}</div>
            </div>
            <div className="card elev-sm gap-1 p-3">
              <div className="text-[10px] tracking-[.08em] uppercase text-[var(--color-neutral-500)]">MRR</div>
              <div className="text-[17px] font-medium">{money(tenant.mrrCents)}</div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <IconGlobe size={14} className="text-[var(--color-accent)]" />
              <div className="card-title text-[14px]">Brand configuration</div>
            </div>
            <div className="card elev-sm gap-2.5 p-4">
              <div className="flex items-center justify-between text-[13.5px]">
                <span className="text-[var(--color-neutral-500)]">Brand color</span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-[4px]" style={{ background: brand }} />
                  <span className="font-mono text-[11px]">{tenant.brandColor || "default"}</span>
                </span>
              </div>
              <div className="flex items-center justify-between text-[13.5px]">
                <span className="text-[var(--color-neutral-500)]">Custom domain</span>
                <span className="font-mono text-[11px]">{tenant.domain || "—"}</span>
              </div>
              <div className="flex items-center justify-between text-[13.5px]">
                <span className="text-[var(--color-neutral-500)]">&ldquo;Powered by&rdquo; badge</span>
                <span className="tag tag-outline text-[9.5px]">{tenant.poweredByBadge ? "On" : "Off"}</span>
              </div>
            </div>
          </div>

          <div>
            <div className="card-title text-[14px] mb-2.5">Contact</div>
            <div className="card elev-sm gap-2 p-4">
              <div className="flex items-center justify-between text-[13.5px]">
                <span className="text-[var(--color-neutral-500)]">Owner</span>
                <span className="truncate">{tenant.ownerEmail || "—"}</span>
              </div>
              <div className="flex items-center justify-between text-[13.5px]">
                <span className="text-[var(--color-neutral-500)]">Tenant since</span>
                <span>{new Date(tenant.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</span>
              </div>
            </div>
          </div>

          <div className="text-[10.5px] text-[var(--color-neutral-600)] border-t border-[var(--color-divider)] pt-3">
            Tenant data is fully isolated · brand configs never cross tenants
          </div>
        </div>

        <div className="flex flex-col gap-2 p-4 border-t border-[var(--color-divider)]">
          {error && <div className="text-[11.5px]" style={{ color: "var(--color-accent-300)" }}>{error}</div>}
          {tenant.suspended && (tenant.subscriptionStatus === "unpaid" || tenant.subscriptionStatus === "canceled") && (
            <div className="text-[11.5px] text-[var(--color-neutral-500)]">
              Auto-suspended for non-payment — Stripe subscription is {tenant.subscriptionStatus}. Unsuspending won&rsquo;t fix billing; the tenant still needs to update their card.
            </div>
          )}
          <button className="btn btn-secondary btn-block text-[13.5px]" onClick={toggleSuspend} disabled={busy}>
            {busy ? "Working…" : tenant.suspended ? "Unsuspend tenant" : "Suspend tenant"}
          </button>
        </div>
      </div>
    </div>
  );
}
