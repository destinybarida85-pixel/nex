"use client";

import { useState } from "react";
import { IconLogoMark, IconGrid, IconPayments, IconWallet, IconMessages, IconToggles, IconSettings, IconMenu, IconX } from "@/components/icons";

const navItems = [
  { label: "Tenants", icon: IconGrid, href: "/admin" },
  { label: "Billing & plans", icon: IconPayments, href: "/admin/billing" },
  { label: "Wallet oversight", icon: IconWallet, href: "#" },
  { label: "Support", icon: IconMessages, href: "#" },
  { label: "Feature flags", icon: IconToggles, href: "#" },
  { label: "System", icon: IconSettings, href: "#" },
];

function AdminSidebarContent({ active }: { active: string }) {
  return (
    <>
      <div className="flex items-center gap-2.5 px-2 pb-1.5">
        <IconLogoMark size={26} />
        <div>
          <div className="font-medium text-[15px]">Origin</div>
          <div className="text-[9.5px] tracking-[.08em] uppercase text-[var(--color-neutral-500)]">Master console</div>
        </div>
      </div>
      <span className="tag tag-outline mx-2 mb-3.5 text-[9.5px] self-start">Super Admin</span>
      {navItems.map((item) => (
        <a
          key={item.label}
          href={item.href}
          className="flex items-center gap-2.5 px-2.5 py-[7px] rounded-lg text-[13px] no-underline"
          style={
            item.label === active
              ? { color: "var(--color-accent-300)", background: "color-mix(in srgb, var(--color-accent-900) 65%, transparent)" }
              : { color: "var(--color-neutral-400)" }
          }
        >
          <item.icon size={15} />
          {item.label}
        </a>
      ))}
    </>
  );
}

export default function AdminSidebar({ active }: { active: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="md:hidden">
        <button
          className="btn btn-icon btn-secondary fixed top-3 left-3 z-30"
          aria-label="Open menu"
          onClick={() => setOpen(true)}
        >
          <IconMenu size={18} />
        </button>
      </div>

      <aside className="hidden md:flex w-[200px] flex-none flex-col gap-0.5 p-[18px_12px] border-r border-[var(--color-divider)] min-h-screen">
        <AdminSidebarContent active={active} />
      </aside>

      {open && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div
            className="absolute inset-0 bg-[color-mix(in_srgb,var(--color-neutral-900)_60%,transparent)]"
            onClick={() => setOpen(false)}
          />
          <div className="relative w-[240px] flex-none flex flex-col gap-0.5 p-[18px_12px] bg-[var(--color-bg)] border-r border-[var(--color-divider)] h-full overflow-y-auto">
            <button className="btn btn-icon btn-secondary self-end mb-2" aria-label="Close menu" onClick={() => setOpen(false)}>
              <IconX size={16} />
            </button>
            <AdminSidebarContent active={active} />
          </div>
        </div>
      )}
    </>
  );
}
