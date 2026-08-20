"use client";

import { useEffect, useState } from "react";
import { useHasSession } from "@/lib/useSession";
import { isBackendConfigured } from "@/lib/backendStatus";
import VipSidebar, { type VipSection } from "@/components/vip/VipSidebar";
import { VipThemeContext, VIP_PALETTES, type VipThemeName } from "@/components/vip/theme";
import DashboardPanel from "@/components/vip/panels/DashboardPanel";
import RequestsPanel from "@/components/vip/panels/RequestsPanel";
import FinancePanel from "@/components/vip/panels/FinancePanel";
import IntelligencePanel from "@/components/vip/panels/IntelligencePanel";
import DocumentsPanel from "@/components/vip/panels/DocumentsPanel";
import CertificatesPanel from "@/components/vip/panels/CertificatesPanel";
import IntegrationsPanel from "@/components/vip/panels/IntegrationsPanel";
import WhiteLabelPanel from "@/components/vip/panels/WhiteLabelPanel";
import AccountPanel from "@/components/vip/panels/AccountPanel";

const THEME_STORAGE_KEY = "vip-theme";

export default function VipConsolePage() {
  const { hasSession, checked } = useHasSession();
  const [live, setLive] = useState(false);
  const [plan, setPlan] = useState<string>("none");
  const [tenantName, setTenantName] = useState("");
  const [upgrading, setUpgrading] = useState(false);
  const [section, setSection] = useState<VipSection>("dashboard");
  // Always starts "dark" — matching the statically-prerendered server HTML —
  // and only picks up localStorage/the server preference after mount, so
  // hydration never has to reconcile two different themes (same class of bug
  // fixed on the Dashboard greeting: a value that can differ between the
  // server render and the client must never be used on the first render).
  const [theme, setTheme] = useState<VipThemeName>("dark");

  useEffect(() => {
    if (!checked || !isBackendConfigured || !hasSession) return;
    const stored = typeof window !== "undefined" ? window.localStorage.getItem(THEME_STORAGE_KEY) : null;
    if (stored === "dark" || stored === "light") setTheme(stored);

    fetch("/api/tenant")
      .then((r) => r.json())
      .then((data) => {
        if (data.configured && data.tenant) {
          setPlan(data.tenant.plan ?? "none");
          setTenantName(data.tenant.name ?? "");
        }
        setLive(true);
      })
      .catch(() => setLive(true));

    fetch("/api/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.configured && (data.themePreference === "dark" || data.themePreference === "light")) {
          setTheme(data.themePreference);
          window.localStorage.setItem(THEME_STORAGE_KEY, data.themePreference);
        }
      })
      .catch(() => {});
  }, [checked, hasSession]);

  function toggleTheme() {
    const next: VipThemeName = theme === "dark" ? "light" : "dark";
    setTheme(next);
    window.localStorage.setItem(THEME_STORAGE_KEY, next);
    fetch("/api/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ themePreference: next }),
    }).catch(() => {
      // Non-fatal — the choice still sticks locally via localStorage.
    });
  }

  const tokens = VIP_PALETTES[theme];

  async function upgrade() {
    setUpgrading(true);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "vip" }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      // Non-fatal — button just stops spinning.
    }
    setUpgrading(false);
  }

  if (live && plan !== "vip") {
    return (
      <div
        className="min-h-screen w-full flex items-center justify-center p-8"
        style={{ background: tokens.bg, color: tokens.text }}
      >
        <div className="card elev-md gap-3 p-6 max-w-[420px] w-full" style={{ background: tokens.surface, border: `1px solid ${tokens.text}` }}>
          <div className="flex items-baseline gap-3">
            <span className="font-medium text-[30px]">$249</span>
            <span className="text-[13px]" style={{ color: tokens.textSecondary }}>/ month</span>
          </div>
          <div className="flex flex-col gap-1.5 text-[13.5px]" style={{ color: tokens.textSecondary }}>
            <span>· Everything in Growth</span>
            <span>· Send a request by text or voice, any time</span>
            <span>· Teni AI drafts the real work</span>
            <span>· You review and send — nothing is dispatched automatically</span>
          </div>
          <button className="btn btn-block text-[14px]" style={{ background: tokens.accentBg, color: tokens.accentText, border: `1px solid ${tokens.accentBg}` }} onClick={upgrade} disabled={upgrading}>
            {upgrading ? "Redirecting…" : "Upgrade to VIP"}
          </button>
          <a href="/vip" className="text-[12px] text-center mt-1" style={{ color: tokens.textQuaternary }}>← Back to VIP</a>
        </div>
      </div>
    );
  }

  return (
    <VipThemeContext.Provider value={{ theme, tokens, toggleTheme }}>
      <div className="flex min-h-screen" style={{ background: tokens.bg, color: tokens.text }}>
        <VipSidebar active={section} onSelect={setSection} tenantName={tenantName} />
        <main className="flex-1 min-w-0 p-8">
          {section === "dashboard" && <DashboardPanel onNavigate={setSection} />}
          {section === "requests" && <RequestsPanel />}
          {section === "finance" && <FinancePanel />}
          {section === "intelligence" && <IntelligencePanel />}
          {section === "documents" && <DocumentsPanel />}
          {section === "certificates" && <CertificatesPanel />}
          {section === "whitelabel" && <WhiteLabelPanel />}
          {section === "integrations" && <IntegrationsPanel onNavigate={setSection} />}
          {section === "account" && <AccountPanel />}
        </main>
      </div>
    </VipThemeContext.Provider>
  );
}
