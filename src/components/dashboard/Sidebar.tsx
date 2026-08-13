"use client";

import { useEffect, useRef, useState } from "react";
import { useHasSession } from "@/lib/useSession";
import { isBackendConfigured } from "@/lib/backendStatus";
import {
  IconLogoMark,
  IconChevronUpDown,
  IconChevronDown,
  IconCheckCircle,
  IconPlus,
  IconDashboard,
  IconAnalytics,
  IconWallet,
  IconPayments,
  IconInvoices,
  IconPayroll,
  IconDocuments,
  IconESign,
  IconProjects,
  IconClients,
  IconEmployees,
  IconSparkle,
  IconSettings,
  IconGlobe,
  IconTemplates,
  IconMenu,
  IconX,
  IconShieldCheck,
} from "@/components/icons";

type Business = { tenantId: string; name: string; role: string };

const COLLAPSE_KEY = "origin-sidebar-collapsed";

type NavItem = { label: string; icon: React.ComponentType<{ size?: number }>; href: string; badge?: string };

// Grouped so the sidebar reads as a short list of jobs-to-be-done rather than
// a flat dump of every route. Calendar and API Center were deliberately removed:
// both were static shells with no real data behind them, and API key management
// already lives (for real) inside Settings — keeping them here made the menu
// look fuller than the product actually is.
const primaryNav: NavItem[] = [
  { label: "Dashboard", icon: IconDashboard, href: "/dashboard" },
  { label: "AI Assistant", icon: IconSparkle, href: "/copilot", badge: "New" },
  { label: "VIP", icon: IconShieldCheck, href: "/vip/console", badge: "VIP" },
];

const moneyNav: NavItem[] = [
  { label: "Business Wallet", icon: IconWallet, href: "/wallet" },
  { label: "Payments", icon: IconPayments, href: "/payments" },
  { label: "Invoices", icon: IconInvoices, href: "/invoices" },
  { label: "Payroll", icon: IconPayroll, href: "/payroll" },
];

const workNav: NavItem[] = [
  { label: "Documents", icon: IconDocuments, href: "/assistant" },
  { label: "E-Signatures", icon: IconESign, href: "/sign" },
  { label: "Projects", icon: IconProjects, href: "/projects" },
  { label: "Clients", icon: IconClients, href: "/crm" },
  { label: "Employees", icon: IconEmployees, href: "/employees" },
  { label: "Certificates", icon: IconShieldCheck, href: "/certificates", badge: "New" },
];

// Promoted out of the bottom drawer — white-label is a headline feature, not a
// footnote, so it gets its own visible group instead of being buried under
// settings-style links.
const brandNav: NavItem[] = [
  { label: "White-label", icon: IconGlobe, href: "/whitelabel" },
  { label: "Templates", icon: IconTemplates, href: "/templates" },
];

const bottomNav: NavItem[] = [
  { label: "Analytics", icon: IconAnalytics, href: "/analytics" },
  { label: "Settings", icon: IconSettings, href: "/settings" },
  { label: "Billing", icon: IconPayments, href: "/billing" },
];

function NavLink({
  label,
  icon: Icon,
  href,
  badge,
  active,
  collapsed,
  onNavigate,
}: NavItem & { active: boolean; collapsed: boolean; onNavigate?: () => void }) {
  return (
    <a
      href={href}
      onClick={onNavigate}
      title={collapsed ? label : undefined}
      aria-label={label}
      className={`flex items-center gap-2.5 py-[7px] rounded-lg text-[14.5px] no-underline transition-colors ${
        collapsed ? "justify-center px-0" : "px-2.5"
      }`}
      style={
        active
          ? { color: "var(--color-accent-300)", background: "color-mix(in srgb, var(--color-accent-900) 65%, transparent)" }
          : { color: "var(--color-neutral-400)" }
      }
    >
      <Icon size={16} />
      {!collapsed && label}
      {!collapsed && badge && <span className="tag tag-accent ml-auto text-[9.5px] px-[7px] py-[1px]">{badge}</span>}
    </a>
  );
}

function SectionLabel({ children, collapsed }: { children: React.ReactNode; collapsed: boolean }) {
  if (collapsed) return <div className="h-px my-2.5 mx-2" style={{ background: "var(--color-divider)" }} />;
  return (
    <div className="text-[10px] tracking-[.1em] uppercase text-[var(--color-neutral-600)] px-2.5 pt-3.5 pb-[5px]">
      {children}
    </div>
  );
}

function BusinessSwitcher({ tenantName, collapsed }: { tenantName: string; collapsed: boolean }) {
  const { hasSession, checked } = useHasSession();
  const [open, setOpen] = useState(false);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [activeTenantId, setActiveTenantId] = useState<string | null>(null);
  const [switching, setSwitching] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [error, setError] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  async function loadBusinesses() {
    if (!checked || !isBackendConfigured || !hasSession) return;
    try {
      const res = await fetch("/api/memberships");
      const data = await res.json();
      if (data.configured) {
        setBusinesses(data.businesses ?? []);
        setActiveTenantId(data.activeTenantId ?? null);
      }
    } catch {
      // Switcher just stays empty — the current business still works fine.
    }
  }

  function toggleOpen() {
    if (!open) loadBusinesses();
    setOpen((v) => !v);
    setAdding(false);
    setError("");
  }

  async function switchTo(tenantId: string) {
    if (tenantId === activeTenantId) {
      setOpen(false);
      return;
    }
    setSwitching(true);
    try {
      const res = await fetch("/api/memberships/switch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenantId }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Couldn't switch businesses.");
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't switch businesses.");
      setSwitching(false);
    }
  }

  async function createBusiness() {
    if (!newName.trim()) return;
    setSwitching(true);
    setError("");
    try {
      const res = await fetch("/api/memberships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim() }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Couldn't create that business.");
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't create that business.");
      setSwitching(false);
    }
  }

  return (
    <div className="relative" ref={ref}>
      <button
        title={collapsed ? tenantName : undefined}
        onClick={toggleOpen}
        className={`flex items-center gap-2 mb-[18px] py-2 bg-[var(--color-surface)] border border-[var(--color-divider)] rounded-lg text-[var(--color-text)] text-[13.5px] cursor-pointer text-left hover:border-[var(--color-neutral-600)] transition-colors w-full ${
          collapsed ? "justify-center px-0 mx-0" : "mx-1 px-2.5"
        }`}
        style={{ width: collapsed ? undefined : "calc(100% - 8px)" }}
      >
        <span className="w-[18px] h-[18px] rounded-[5px] bg-[var(--color-accent-900)] text-[var(--color-accent-300)] grid place-items-center text-[10px] font-semibold flex-none">
          {tenantName.charAt(0).toUpperCase()}
        </span>
        {!collapsed && (
          <>
            <span className="flex-1 truncate">{tenantName}</span>
            <IconChevronUpDown size={12} className="opacity-50" />
          </>
        )}
      </button>

      {open && (
        <div
          className="absolute left-1 top-[calc(100%-8px)] w-[240px] rounded-lg border p-1.5 flex flex-col gap-0.5 z-30"
          style={{ background: "var(--color-bg)", borderColor: "var(--color-divider)", boxShadow: "var(--shadow-md)" }}
        >
          <div className="text-[10px] tracking-[.08em] uppercase text-[var(--color-neutral-500)] px-2 py-1.5">
            Your businesses
          </div>
          {businesses.length === 0 ? (
            <div className="px-2 py-2 text-[12px] text-[var(--color-neutral-500)]">{tenantName}</div>
          ) : (
            businesses.map((b) => (
              <button
                key={b.tenantId}
                onClick={() => switchTo(b.tenantId)}
                disabled={switching}
                className="flex items-center gap-2 px-2 py-[7px] rounded-md text-[13px] text-left cursor-pointer hover:bg-[var(--color-surface)] transition-colors"
              >
                <span className="w-[16px] h-[16px] rounded-[4px] bg-[var(--color-accent-900)] text-[var(--color-accent-300)] grid place-items-center text-[9px] font-semibold flex-none">
                  {b.name.charAt(0).toUpperCase()}
                </span>
                <span className="flex-1 truncate">{b.name}</span>
                {b.tenantId === activeTenantId && <IconCheckCircle size={12} className="text-[var(--color-accent)] flex-none" />}
              </button>
            ))
          )}

          <div className="h-px my-1" style={{ background: "var(--color-divider)" }} />

          {adding ? (
            <div className="flex flex-col gap-1.5 p-1">
              <input
                className="input text-[12px]"
                placeholder="New business name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && createBusiness()}
                autoFocus
              />
              <button className="btn btn-primary text-[11.5px]" onClick={createBusiness} disabled={switching || !newName.trim()}>
                {switching ? "Creating…" : "Create & switch"}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setAdding(true)}
              className="flex items-center gap-2 px-2 py-[7px] rounded-md text-[13px] text-left cursor-pointer hover:bg-[var(--color-surface)] transition-colors"
              style={{ color: "var(--color-accent-300)" }}
            >
              <IconPlus size={13} />
              Add a business
            </button>
          )}
          {error && <div className="text-[11px] px-2 pt-1" style={{ color: "var(--color-accent-300)" }}>{error}</div>}
        </div>
      )}
    </div>
  );
}

function SidebarContent({
  active,
  onNavigate,
  tenantName,
  collapsed = false,
}: {
  active: string;
  onNavigate?: () => void;
  tenantName: string;
  collapsed?: boolean;
}) {
  const groups: { label: string | null; items: NavItem[] }[] = [
    { label: null, items: primaryNav },
    { label: "Money", items: moneyNav },
    { label: "Work", items: workNav },
    { label: "Brand", items: brandNav },
  ];

  return (
    <>
      <div className={`flex items-center gap-2.5 pb-4 ${collapsed ? "justify-center px-0" : "px-2"}`}>
        <IconLogoMark size={26} />
        {!collapsed && <div className="font-medium text-[16px] tracking-[-0.01em]">Primue</div>}
      </div>

      <BusinessSwitcher tenantName={tenantName} collapsed={collapsed} />

      <nav className="flex flex-col gap-0.5 flex-1">
        {groups.map((group, gi) => (
          <div key={group.label ?? `group-${gi}`} className="flex flex-col gap-0.5">
            {group.label && <SectionLabel collapsed={collapsed}>{group.label}</SectionLabel>}
            {group.items.map((item) => (
              <NavLink
                key={item.label}
                {...item}
                active={item.label === active}
                collapsed={collapsed}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        ))}
      </nav>

      <div className="flex flex-col gap-0.5 pt-3 border-t border-[var(--color-divider)]">
        {bottomNav.map((item) => (
          <NavLink
            key={item.label}
            {...item}
            active={item.label === active}
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    </>
  );
}

export default function Sidebar({ active = "Dashboard" }: { active?: string }) {
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { hasSession, checked } = useHasSession();
  const [tenantName, setTenantName] = useState("Meridian Studio");

  // Read persisted state after mount rather than during render, so the server
  // and first client render agree (localStorage isn't available server-side).
  useEffect(() => {
    try {
      if (localStorage.getItem(COLLAPSE_KEY) === "1") setCollapsed(true);
    } catch {
      // Private mode / storage disabled — just stay expanded.
    }
  }, []);

  function toggleCollapsed() {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(COLLAPSE_KEY, next ? "1" : "0");
      } catch {
        // Non-fatal: the toggle still works for this session.
      }
      return next;
    });
  }

  useEffect(() => {
    if (!checked || !isBackendConfigured || !hasSession) return;
    fetch("/api/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.configured && data.tenantName) setTenantName(data.tenantName);
      })
      .catch(() => {
        // Stay on the demo name on any failure.
      });
  }, [checked, hasSession]);

  return (
    <>
      <div className="md:hidden no-print">
        <button
          className="btn btn-icon btn-secondary fixed top-3 left-3 z-30"
          aria-label="Open menu"
          onClick={() => setOpen(true)}
        >
          <IconMenu size={18} />
        </button>
      </div>

      <aside
        className={`hidden md:flex flex-none flex-col border-r border-[var(--color-divider)] min-h-screen relative transition-[width] duration-200 no-print ${
          collapsed ? "w-[68px] p-[18px_10px_14px]" : "w-[236px] p-[18px_14px_14px]"
        }`}
      >
        <SidebarContent active={active} tenantName={tenantName} collapsed={collapsed} />

        <button
          onClick={toggleCollapsed}
          aria-label={collapsed ? "Expand menu" : "Minimize menu"}
          title={collapsed ? "Expand menu" : "Minimize menu"}
          className="absolute -right-3 top-7 w-6 h-6 rounded-full grid place-items-center cursor-pointer transition-colors"
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-divider)",
            color: "var(--color-neutral-400)",
          }}
        >
          <span
            className="grid place-items-center transition-transform duration-200"
            style={{ transform: collapsed ? "rotate(-90deg)" : "rotate(90deg)" }}
          >
            <IconChevronDown size={13} />
          </span>
        </button>
      </aside>

      {open && (
        <div className="md:hidden fixed inset-0 z-40 flex no-print">
          <div className="absolute inset-0 bg-[color-mix(in_srgb,var(--color-neutral-900)_60%,transparent)]" onClick={() => setOpen(false)} />
          <div className="relative w-[260px] flex-none flex flex-col p-[18px_14px_14px] bg-[var(--color-bg)] border-r border-[var(--color-divider)] h-full overflow-y-auto">
            <button
              className="btn btn-icon btn-secondary self-end mb-2"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
            >
              <IconX size={16} />
            </button>
            <SidebarContent active={active} onNavigate={() => setOpen(false)} tenantName={tenantName} />
          </div>
        </div>
      )}
    </>
  );
}
