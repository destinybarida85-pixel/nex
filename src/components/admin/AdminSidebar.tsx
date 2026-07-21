import { IconLogoMark, IconGrid, IconPayments, IconWallet, IconMessages, IconToggles, IconSettings } from "@/components/icons";

const navItems = [
  { label: "Tenants", icon: IconGrid, href: "/admin" },
  { label: "Billing & plans", icon: IconPayments, href: "/admin/billing" },
  { label: "Wallet oversight", icon: IconWallet, href: "#" },
  { label: "Support", icon: IconMessages, href: "#" },
  { label: "Feature flags", icon: IconToggles, href: "#" },
  { label: "System", icon: IconSettings, href: "#" },
];

export default function AdminSidebar({ active }: { active: string }) {
  return (
    <aside className="w-[200px] flex-none flex flex-col gap-0.5 p-[18px_12px] border-r border-[var(--color-divider)] min-h-screen">
      <div className="flex items-center gap-2.5 px-2 pb-1.5">
        <IconLogoMark size={26} />
        <div>
          <div className="font-medium text-[15px]">Nex</div>
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
    </aside>
  );
}
