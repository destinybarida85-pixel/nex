"use client";

import { IconLogoMark, IconSparkle, IconDocuments, IconShieldCheck, IconGlobe, IconWallet, IconActivity, IconTemplates, IconPerson, IconGrid, IconSun, IconMoon } from "@/components/icons";
import { useVipTheme } from "@/components/vip/theme";

export type VipSection = "dashboard" | "requests" | "finance" | "intelligence" | "documents" | "certificates" | "whitelabel" | "integrations" | "account";

const NAV: { id: VipSection; label: string; icon: React.ComponentType<{ size?: number }> }[] = [
  { id: "dashboard", label: "Dashboard", icon: IconGrid },
  { id: "requests", label: "Teni AI", icon: IconSparkle },
  { id: "finance", label: "Finance", icon: IconWallet },
  { id: "intelligence", label: "Intelligence", icon: IconActivity },
  { id: "documents", label: "Documents", icon: IconDocuments },
  { id: "certificates", label: "Certificates", icon: IconShieldCheck },
  { id: "whitelabel", label: "White-label", icon: IconTemplates },
  { id: "integrations", label: "Integrations", icon: IconGlobe },
  { id: "account", label: "Account", icon: IconPerson },
];

export default function VipSidebar({
  active,
  onSelect,
  tenantName,
}: {
  active: VipSection;
  onSelect: (s: VipSection) => void;
  tenantName?: string;
}) {
  const { theme, tokens, toggleTheme } = useVipTheme();

  return (
    <>
      {/* Desktop/tablet: full fixed-width sidebar. Was rendering unconditionally
          at every viewport with no responsive handling at all — on a phone that
          forced the whole console wider than the screen, which is what reads as
          "lag" (janky scroll/zoom from an oversized canvas), not a real perf bug. */}
      <aside
        className="hidden md:flex w-[220px] flex-none flex-col gap-6 p-4"
        style={{ background: tokens.bg, borderRight: `1px solid ${tokens.border}`, minHeight: "100vh" }}
      >
        <div className="flex items-center gap-2.5 px-1">
          <IconLogoMark size={24} />
          <span style={{ fontSize: 14, fontWeight: 600, color: tokens.text }}>Primue</span>
          <span className="tag text-[9px]" style={{ border: `1px solid ${tokens.text}`, color: tokens.text }}>VIP</span>
        </div>

        {tenantName && (
          <div className="px-1 text-[11.5px] truncate" style={{ color: tokens.textQuaternary }}>{tenantName}</div>
        )}

        <nav className="flex flex-col gap-0.5">
          {NAV.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelect(item.id)}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13.5px] text-left cursor-pointer"
                style={{
                  background: isActive ? tokens.tint2 : "transparent",
                  color: isActive ? tokens.text : tokens.textTertiary,
                  border: `1px solid ${isActive ? tokens.borderActive : "transparent"}`,
                }}
              >
                <Icon size={15} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="flex-1" />

        <button
          onClick={toggleTheme}
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[12.5px] text-left cursor-pointer"
          style={{ background: "transparent", color: tokens.textTertiary, border: `1px solid ${tokens.border}` }}
        >
          {theme === "dark" ? <IconMoon size={14} /> : <IconSun size={14} />}
          {theme === "dark" ? "Dark mode" : "Light mode"}
        </button>

        <a href="/" className="px-1 text-[11.5px]" style={{ color: tokens.textQuaternary }}>← Back to primue.com</a>
      </aside>

      {/* Mobile: a slim top bar with a horizontally-scrollable nav strip instead
          of the full sidebar — scrolls within itself (overflow-x-auto) rather
          than ever pushing the page wider than the viewport. */}
      <div
        className="md:hidden flex flex-col gap-2.5 p-3"
        style={{ background: tokens.bg, borderBottom: `1px solid ${tokens.border}` }}
      >
        <div className="flex items-center gap-2.5 px-1">
          <IconLogoMark size={22} />
          <span style={{ fontSize: 13.5, fontWeight: 600, color: tokens.text }}>Primue</span>
          <span className="tag text-[9px]" style={{ border: `1px solid ${tokens.text}`, color: tokens.text }}>VIP</span>
          <div className="flex-1" />
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center w-8 h-8 rounded-lg flex-none cursor-pointer"
            style={{ background: "transparent", color: tokens.textTertiary, border: `1px solid ${tokens.border}` }}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <IconMoon size={14} /> : <IconSun size={14} />}
          </button>
        </div>
        <nav className="flex items-center gap-1.5 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {NAV.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelect(item.id)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12.5px] flex-none whitespace-nowrap cursor-pointer"
                style={{
                  background: isActive ? tokens.tint2 : "transparent",
                  color: isActive ? tokens.text : tokens.textTertiary,
                  border: `1px solid ${isActive ? tokens.borderActive : tokens.border}`,
                }}
              >
                <Icon size={13} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
}
