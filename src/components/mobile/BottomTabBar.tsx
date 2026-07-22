import { IconDashboard, IconGrid, IconAnalytics, IconClients } from "@/components/icons";

const tabs = [
  { key: "home", label: "Home", icon: IconDashboard, href: "/mobile/home" },
  { key: "wallet", label: "Wallet", icon: IconGrid, href: "/mobile/wallet" },
  { key: "ai", label: "AI", icon: IconAnalytics, href: "#" },
  { key: "profile", label: "Profile", icon: IconClients, href: "/mobile/profile" },
] as const;

export default function BottomTabBar({ active }: { active: (typeof tabs)[number]["key"] }) {
  return (
    <div className="px-5 pb-6 pt-1">
      <div
        className="flex items-center justify-around rounded-full px-2.5 py-2.5"
        style={{ background: "var(--color-neutral-900)", boxShadow: "var(--shadow-md)" }}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.key === active;
          return (
            <a
              key={tab.key}
              href={tab.href}
              aria-label={tab.label}
              className="flex items-center justify-center no-underline transition-colors"
              style={
                isActive
                  ? {
                      width: 42,
                      height: 42,
                      borderRadius: "50%",
                      background: "var(--color-accent-100)",
                      color: "var(--color-neutral-900)",
                    }
                  : {
                      width: 42,
                      height: 42,
                      borderRadius: "50%",
                      color: "var(--color-neutral-400)",
                    }
              }
            >
              <Icon size={18} />
            </a>
          );
        })}
      </div>
    </div>
  );
}
