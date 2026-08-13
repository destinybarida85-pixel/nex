"use client";

import { useEffect, useState } from "react";
import { useHasSession } from "@/lib/useSession";
import { isBackendConfigured } from "@/lib/backendStatus";
import VipSidebar, { type VipSection } from "@/components/vip/VipSidebar";
import RequestsPanel from "@/components/vip/panels/RequestsPanel";
import FinancePanel from "@/components/vip/panels/FinancePanel";
import IntelligencePanel from "@/components/vip/panels/IntelligencePanel";
import DocumentsPanel from "@/components/vip/panels/DocumentsPanel";
import CertificatesPanel from "@/components/vip/panels/CertificatesPanel";
import IntegrationsPanel from "@/components/vip/panels/IntegrationsPanel";

const vipVars = {
  "--color-bg": "#0a0a0a",
  "--color-surface": "#161616",
  "--color-text": "#f5f5f5",
  "--color-accent": "#ffffff",
  "--color-divider": "rgba(255,255,255,0.14)",
  "--color-neutral-400": "#a8a8a8",
  "--color-neutral-500": "#8a8a8a",
  "--color-neutral-600": "#6b6b6b",
} as React.CSSProperties;

export default function VipConsolePage() {
  const { hasSession, checked } = useHasSession();
  const [live, setLive] = useState(false);
  const [plan, setPlan] = useState<string>("none");
  const [tenantName, setTenantName] = useState("");
  const [upgrading, setUpgrading] = useState(false);
  const [section, setSection] = useState<VipSection>("requests");

  useEffect(() => {
    if (!checked || !isBackendConfigured || !hasSession) return;
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
  }, [checked, hasSession]);

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
        style={{ ...vipVars, background: "var(--color-bg)", color: "var(--color-text)" }}
      >
        <div className="card elev-md gap-3 p-6 max-w-[420px] w-full" style={{ background: "var(--color-surface)", border: "1px solid #fff" }}>
          <div className="flex items-baseline gap-3">
            <span className="font-medium text-[30px]">$249</span>
            <span className="text-[13px]" style={{ color: "var(--color-neutral-400)" }}>/ month</span>
          </div>
          <div className="flex flex-col gap-1.5 text-[13.5px]" style={{ color: "var(--color-neutral-400)" }}>
            <span>· Everything in Growth</span>
            <span>· Send a request by text or voice, any time</span>
            <span>· Primue AI drafts the real work</span>
            <span>· You review and send — nothing is dispatched automatically</span>
          </div>
          <button className="btn btn-block text-[14px]" style={{ background: "#fff", color: "#0a0a0a", border: "1px solid #fff" }} onClick={upgrade} disabled={upgrading}>
            {upgrading ? "Redirecting…" : "Upgrade to VIP"}
          </button>
          <a href="/vip" className="text-[12px] text-center mt-1" style={{ color: "var(--color-neutral-600)" }}>← Back to VIP</a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen" style={{ ...vipVars, background: "var(--color-bg)", color: "var(--color-text)" }}>
      <VipSidebar active={section} onSelect={setSection} tenantName={tenantName} />
      <main className="flex-1 min-w-0 p-8">
        {section === "requests" && <RequestsPanel />}
        {section === "finance" && <FinancePanel />}
        {section === "intelligence" && <IntelligencePanel />}
        {section === "documents" && <DocumentsPanel />}
        {section === "certificates" && <CertificatesPanel />}
        {section === "integrations" && <IntegrationsPanel />}
      </main>
    </div>
  );
}
