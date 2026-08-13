"use client";

import { IconLogoMark, IconSparkle, IconDocuments, IconShieldCheck, IconGlobe, IconWallet } from "@/components/icons";

export type VipSection = "requests" | "finance" | "documents" | "certificates" | "integrations";

const NAV: { id: VipSection; label: string; icon: React.ComponentType<{ size?: number }> }[] = [
  { id: "requests", label: "Requests", icon: IconSparkle },
  { id: "finance", label: "Finance", icon: IconWallet },
  { id: "documents", label: "Documents", icon: IconDocuments },
  { id: "certificates", label: "Certificates", icon: IconShieldCheck },
  { id: "integrations", label: "Integrations", icon: IconGlobe },
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
  return (
    <aside
      className="w-[220px] flex-none flex flex-col gap-6 p-4"
      style={{ background: "#0a0a0a", borderRight: "1px solid rgba(255,255,255,0.14)", minHeight: "100vh" }}
    >
      <div className="flex items-center gap-2.5 px-1">
        <IconLogoMark size={24} />
        <span style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>Primue</span>
        <span className="tag text-[9px]" style={{ border: "1px solid #fff", color: "#fff" }}>VIP</span>
      </div>

      {tenantName && (
        <div className="px-1 text-[11.5px] truncate" style={{ color: "#6b6b6b" }}>{tenantName}</div>
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
                background: isActive ? "rgba(255,255,255,0.08)" : "transparent",
                color: isActive ? "#fff" : "#8a8a8a",
                border: isActive ? "1px solid rgba(255,255,255,0.16)" : "1px solid transparent",
              }}
            >
              <Icon size={15} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="flex-1" />

      <a href="/" className="px-1 text-[11.5px]" style={{ color: "#6b6b6b" }}>← Back to primue.com</a>
    </aside>
  );
}
