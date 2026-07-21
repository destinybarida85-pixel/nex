import { IconDashboard, IconWallet, IconDocuments, IconSparkle, IconClients } from "@/components/icons";

const tabs = [
  { key: "home", label: "Home", icon: IconDashboard, href: "/mobile/home" },
  { key: "wallet", label: "Wallet", icon: IconWallet, href: "/mobile/wallet" },
  { key: "docs", label: "Docs", icon: IconDocuments, href: "#" },
  { key: "ai", label: "AI", icon: IconSparkle, href: "#" },
  { key: "profile", label: "Profile", icon: IconClients, href: "#" },
] as const;

export default function BottomTabBar({ active }: { active: (typeof tabs)[number]["key"] }) {
  return (
    <div className="flex px-3 pt-2.5 pb-7 border-t border-[var(--color-divider)]">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = tab.key === active;
        return (
          <a
            key={tab.key}
            href={tab.href}
            className="flex-1 flex flex-col items-center gap-[3px] no-underline"
            style={{ color: isActive ? "var(--color-accent-300)" : "var(--color-neutral-500)" }}
          >
            <Icon size={18} />
            <span className="text-[9.5px]">{tab.label}</span>
          </a>
        );
      })}
    </div>
  );
}
