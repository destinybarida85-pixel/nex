"use client";

import { useEffect, useState } from "react";
import { IconX, IconGlobe, IconMessages } from "@/components/icons";
import type { Tenant } from "./tenants";

export default function TenantDrawer({ tenant, onClose }: { tenant: Tenant | null; onClose: () => void }) {
  const [entered, setEntered] = useState(false);

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
            style={{ background: `color-mix(in srgb, ${tenant.brand} 18%, transparent)`, color: tenant.brand }}
          >
            {tenant.initial}
          </span>
          <div className="min-w-0">
            <div className="text-[15px] font-medium truncate">{tenant.org}</div>
            <div className="text-[11px] font-mono text-[var(--color-neutral-500)] truncate">{tenant.domain}</div>
          </div>
          <span className={`tag ${tenant.statusTag} ml-auto flex-none`}>{tenant.status}</span>
          <button className="btn btn-icon btn-secondary flex-none" aria-label="Close" onClick={onClose}>
            <IconX size={14} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-3">
            <div className="card elev-sm gap-1 p-3">
              <div className="text-[10px] tracking-[.08em] uppercase text-[var(--color-neutral-500)]">Plan</div>
              <span className={`tag ${tenant.planTag} self-start`}>{tenant.plan}</span>
            </div>
            <div className="card elev-sm gap-1 p-3">
              <div className="text-[10px] tracking-[.08em] uppercase text-[var(--color-neutral-500)]">Users</div>
              <div className="text-[17px] font-medium">{tenant.users}</div>
            </div>
            <div className="card elev-sm gap-1 p-3">
              <div className="text-[10px] tracking-[.08em] uppercase text-[var(--color-neutral-500)]">Wallet vol · 30d</div>
              <div className="text-[17px] font-medium">{tenant.volume}</div>
            </div>
            <div className="card elev-sm gap-1 p-3">
              <div className="text-[10px] tracking-[.08em] uppercase text-[var(--color-neutral-500)]">MRR</div>
              <div className="text-[17px] font-medium">{tenant.mrr}</div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <IconGlobe size={14} className="text-[var(--color-accent)]" />
              <div className="card-title text-[13px]">Brand configuration</div>
            </div>
            <div className="card elev-sm gap-2.5 p-4">
              <div className="flex items-center justify-between text-[12.5px]">
                <span className="text-[var(--color-neutral-500)]">Brand color</span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-[4px]" style={{ background: tenant.brand }} />
                  {tenant.brandLabel}
                </span>
              </div>
              <div className="flex items-center justify-between text-[12.5px]">
                <span className="text-[var(--color-neutral-500)]">Custom domain</span>
                <span className="font-mono text-[11px]">{tenant.domain}</span>
              </div>
              <div className="flex items-center justify-between text-[12.5px]">
                <span className="text-[var(--color-neutral-500)]">&ldquo;Powered by&rdquo; badge</span>
                <span className="tag tag-outline text-[9.5px]">{tenant.poweredBy ? "On" : "Off"}</span>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <IconMessages size={14} className="text-[var(--color-accent)]" />
              <div className="card-title text-[13px]">Contact</div>
            </div>
            <div className="card elev-sm gap-2 p-4">
              <div className="flex items-center justify-between text-[12.5px]">
                <span className="text-[var(--color-neutral-500)]">Primary contact</span>
                <span>{tenant.contact}</span>
              </div>
              <div className="flex items-center justify-between text-[12.5px]">
                <span className="text-[var(--color-neutral-500)]">Tenant since</span>
                <span>{tenant.joined}</span>
              </div>
            </div>
          </div>

          <div>
            <div className="card-title text-[13px] mb-2.5">Recent activity</div>
            <div className="flex flex-col gap-2.5">
              {tenant.activity.map((a) => (
                <div key={a.label} className="flex items-center gap-2.5 text-[12px]">
                  <span className="w-[6px] h-[6px] rounded-full flex-none" style={{ background: "var(--color-accent)" }} />
                  <span className="flex-1">{a.label}</span>
                  <span className="text-[var(--color-neutral-500)] font-mono text-[10.5px]">{a.meta}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-[10.5px] text-[var(--color-neutral-600)] border-t border-[var(--color-divider)] pt-3">
            Tenant data is fully isolated · brand configs never cross tenants
          </div>
        </div>

        <div className="flex gap-2 p-4 border-t border-[var(--color-divider)]">
          <button className="btn btn-secondary flex-1 text-[12.5px]">View as tenant</button>
          <button className="btn btn-secondary flex-1 text-[12.5px]">Suspend tenant</button>
        </div>
      </div>
    </div>
  );
}
