"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  IconSearch,
  IconDashboard,
  IconWallet,
  IconPayments,
  IconInvoices,
  IconPayroll,
  IconDocuments,
  IconESign,
  IconProjects,
  IconClients,
  IconEmployees,
  IconShieldCheck,
  IconGlobe,
  IconTemplates,
  IconAnalytics,
  IconSettings,
  IconSparkle,
  IconPlus,
  IconX,
} from "@/components/icons";

type Item = { label: string; hint?: string; icon: React.ComponentType<{ size?: number }>; href: string };

// A second, hand-kept copy of the sidebar's destinations rather than a shared
// import from Sidebar.tsx — that file exports a component, not the nav data,
// and restructuring it just to share a list here is more churn than a second
// short array is worth. If a route changes, both need updating; that's an
// acceptable trade for not touching the sidebar's internals.
const destinations: Item[] = [
  { label: "Dashboard", icon: IconDashboard, href: "/dashboard" },
  { label: "AI Assistant", hint: "Ask what to use", icon: IconSparkle, href: "/copilot" },
  { label: "Business Wallet", icon: IconWallet, href: "/wallet" },
  { label: "Payments", icon: IconPayments, href: "/payments" },
  { label: "Invoices", icon: IconInvoices, href: "/invoices" },
  { label: "Payroll", icon: IconPayroll, href: "/payroll" },
  { label: "Documents", hint: "Draft with AI", icon: IconDocuments, href: "/assistant" },
  { label: "E-Signatures", icon: IconESign, href: "/sign" },
  { label: "Projects", icon: IconProjects, href: "/projects" },
  { label: "Clients", icon: IconClients, href: "/crm" },
  { label: "Employees", icon: IconEmployees, href: "/employees" },
  { label: "Certificates", icon: IconShieldCheck, href: "/certificates" },
  { label: "White-label", icon: IconGlobe, href: "/whitelabel" },
  { label: "Templates", icon: IconTemplates, href: "/templates" },
  { label: "Analytics", icon: IconAnalytics, href: "/analytics" },
  { label: "Settings", icon: IconSettings, href: "/settings" },
];

const actions: Item[] = [
  { label: "New document", icon: IconPlus, href: "/assistant" },
  { label: "New payment link / invoice", icon: IconPlus, href: "/payments" },
  { label: "New employee", icon: IconPlus, href: "/employees" },
  { label: "New client", icon: IconPlus, href: "/crm" },
];

export default function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const all = [...destinations, ...actions];
    if (!q) return all;
    return all.filter((item) => item.label.toLowerCase().includes(q) || item.hint?.toLowerCase().includes(q));
  }, [query]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      // Focus after the dialog paints, not before — focusing a not-yet-visible
      // input is a no-op in some browsers.
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  function go(href: string) {
    onClose();
    window.location.href = href;
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[activeIndex]) {
      go(results[activeIndex].href);
    }
  }

  if (!open) return null;

  return (
    <div className="dialog-backdrop" onClick={onClose} style={{ alignItems: "flex-start", paddingTop: "12vh" }}>
      <div className="dialog" style={{ maxWidth: 520, width: "100%" }} onClick={(e) => e.stopPropagation()} onKeyDown={onKeyDown}>
        <div className="flex items-center gap-2.5 px-3.5 py-3 border-b" style={{ borderColor: "var(--color-divider)" }}>
          <IconSearch size={15} className="text-[var(--color-neutral-500)] flex-none" />
          <input
            ref={inputRef}
            className="flex-1 bg-transparent border-none outline-none text-[14px] text-[var(--color-text)]"
            placeholder="Search pages, or create something new…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="btn btn-icon btn-ghost flex-none" aria-label="Close" onClick={onClose}>
            <IconX size={14} />
          </button>
        </div>

        <div className="flex flex-col p-1.5" style={{ maxHeight: "56vh", overflowY: "auto" }}>
          {results.length === 0 ? (
            <div className="text-[13.5px] text-[var(--color-neutral-500)] text-center py-8">
              No matches for &ldquo;{query}&rdquo;.
            </div>
          ) : (
            results.map((item, i) => (
              <button
                key={item.href + item.label}
                onClick={() => go(item.href)}
                onMouseEnter={() => setActiveIndex(i)}
                className="flex items-center gap-2.5 px-2.5 py-[9px] rounded-md text-[14px] text-left cursor-pointer transition-colors"
                style={{
                  background: i === activeIndex ? "var(--color-surface)" : "transparent",
                  color: "var(--color-text)",
                }}
              >
                <item.icon size={15} />
                <span className="flex-1">{item.label}</span>
                {item.hint && <span className="text-[11px] text-[var(--color-neutral-500)]">{item.hint}</span>}
              </button>
            ))
          )}
        </div>

        <div className="flex items-center gap-3 px-3.5 py-2 border-t text-[10.5px] text-[var(--color-neutral-500)]" style={{ borderColor: "var(--color-divider)" }}>
          <span><kbd className="font-mono">↑↓</kbd> navigate</span>
          <span><kbd className="font-mono">↵</kbd> open</span>
          <span><kbd className="font-mono">esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
}
