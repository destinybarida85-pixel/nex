"use client";

import { useState } from "react";
import {
  IconLogoMark,
  IconChevronUpDown,
  IconDashboard,
  IconAnalytics,
  IconCalendar,
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
  IconApi,
  IconMenu,
  IconX,
} from "@/components/icons";

const primaryNav = [
  { label: "Dashboard", icon: IconDashboard, href: "/dashboard" },
  { label: "Analytics", icon: IconAnalytics, href: "/analytics" },
  { label: "Calendar", icon: IconCalendar, href: "/calendar" },
];

const moneyNav = [
  { label: "Business Wallet", icon: IconWallet, href: "/wallet" },
  { label: "Payments", icon: IconPayments, href: "/payments" },
  { label: "Invoices", icon: IconInvoices, href: "/invoices" },
  { label: "Payroll", icon: IconPayroll, href: "/payroll" },
];

const workNav = [
  { label: "Documents", icon: IconDocuments, href: "/assistant" },
  { label: "E-Signatures", icon: IconESign, href: "/sign" },
  { label: "Projects", icon: IconProjects, href: "#" },
  { label: "Clients", icon: IconClients, href: "/crm" },
  { label: "Employees", icon: IconEmployees, href: "/employees" },
];

const bottomNav = [
  { label: "Settings", icon: IconSettings, href: "#" },
  { label: "White-label", icon: IconGlobe, href: "/whitelabel" },
  { label: "API Center", icon: IconApi, href: "#" },
];

function NavLink({
  label,
  icon: Icon,
  href,
  active,
  onNavigate,
}: {
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  href: string;
  active: boolean;
  onNavigate?: () => void;
}) {
  return (
    <a
      href={href}
      onClick={onNavigate}
      className="flex items-center gap-2.5 px-2.5 py-[7px] rounded-lg text-[13.5px] no-underline transition-colors"
      style={
        active
          ? { color: "var(--color-accent-300)", background: "color-mix(in srgb, var(--color-accent-900) 65%, transparent)" }
          : { color: "var(--color-neutral-400)" }
      }
    >
      <Icon size={16} />
      {label}
    </a>
  );
}

function SidebarContent({ active, onNavigate }: { active: string; onNavigate?: () => void }) {
  return (
    <>
      <div className="flex items-center gap-2.5 px-2 pb-4">
        <IconLogoMark size={26} />
        <div className="font-medium text-[16px] tracking-[-0.01em]">Nex</div>
      </div>

      <button className="flex items-center gap-2 mx-1 mb-[18px] px-2.5 py-2 bg-[var(--color-surface)] border border-[var(--color-divider)] rounded-lg text-[var(--color-text)] text-[12.5px] cursor-pointer text-left hover:border-[var(--color-neutral-600)] transition-colors">
        <span className="w-[18px] h-[18px] rounded-[5px] bg-[var(--color-accent-900)] text-[var(--color-accent-300)] grid place-items-center text-[10px] font-semibold">
          M
        </span>
        <span className="flex-1">Meridian Studio</span>
        <IconChevronUpDown size={12} className="opacity-50" />
      </button>

      <nav className="flex flex-col gap-0.5 flex-1">
        {primaryNav.map((item) => (
          <NavLink key={item.label} {...item} active={item.label === active} onNavigate={onNavigate} />
        ))}
        <div className="text-[10px] tracking-[.1em] uppercase text-[var(--color-neutral-600)] px-2.5 pt-3.5 pb-[5px]">
          Money
        </div>
        {moneyNav.map((item) => (
          <NavLink key={item.label} {...item} active={item.label === active} onNavigate={onNavigate} />
        ))}
        <div className="text-[10px] tracking-[.1em] uppercase text-[var(--color-neutral-600)] px-2.5 pt-3.5 pb-[5px]">
          Work
        </div>
        {workNav.map((item) => (
          <NavLink key={item.label} {...item} active={item.label === active} onNavigate={onNavigate} />
        ))}
        <a
          href="/assistant"
          onClick={onNavigate}
          className="flex items-center gap-2.5 px-2.5 py-[7px] rounded-lg text-[13.5px] no-underline mt-3 transition-colors"
          style={
            active === "AI Assistant"
              ? { color: "var(--color-accent-300)", background: "color-mix(in srgb, var(--color-accent-900) 65%, transparent)" }
              : { color: "var(--color-neutral-400)" }
          }
        >
          <IconSparkle size={16} />
          AI Assistant
          <span className="tag tag-accent ml-auto text-[9.5px] px-[7px] py-[1px]">New</span>
        </a>
      </nav>

      <div className="flex flex-col gap-0.5 pt-3 border-t border-[var(--color-divider)]">
        {bottomNav.map((item) => (
          <NavLink key={item.label} {...item} active={item.label === active} onNavigate={onNavigate} />
        ))}
      </div>
    </>
  );
}

export default function Sidebar({ active = "Dashboard" }: { active?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="btn btn-icon btn-secondary md:hidden fixed top-3 left-3 z-30"
        aria-label="Open menu"
        onClick={() => setOpen(true)}
      >
        <IconMenu size={18} />
      </button>

      <aside className="hidden md:flex w-[236px] flex-none flex-col p-[18px_14px_14px] border-r border-[var(--color-divider)] min-h-screen">
        <SidebarContent active={active} />
      </aside>

      {open && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-[color-mix(in_srgb,var(--color-neutral-900)_60%,transparent)]" onClick={() => setOpen(false)} />
          <div className="relative w-[260px] flex-none flex flex-col p-[18px_14px_14px] bg-[var(--color-bg)] border-r border-[var(--color-divider)] h-full overflow-y-auto">
            <button
              className="btn btn-icon btn-secondary self-end mb-2"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
            >
              <IconX size={16} />
            </button>
            <SidebarContent active={active} onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
