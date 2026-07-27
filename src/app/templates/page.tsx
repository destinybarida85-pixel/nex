"use client";

import { useEffect, useState } from "react";
import { IconInvoices, IconMail, IconDownload } from "@/components/icons";
import InvoiceTemplate from "@/components/templates/InvoiceTemplate";
import EmailTemplate from "@/components/templates/EmailTemplate";
import { useHasSession } from "@/lib/useSession";
import { isBackendConfigured } from "@/lib/backendStatus";

const sampleSwatches = ["#63c3b2", "#d9a05b", "#7fa3e8", "#9184d9"];

export default function TemplatesPage() {
  const { hasSession, checked } = useHasSession();
  const [mode, setMode] = useState<"invoice" | "email">("invoice");
  const [live, setLive] = useState(false);
  const [tenantName, setTenantName] = useState("Atlas Chambers");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [accent, setAccent] = useState(sampleSwatches[0]);
  const [poweredBy, setPoweredBy] = useState(false);

  useEffect(() => {
    if (!checked || !isBackendConfigured || !hasSession) return;
    fetch("/api/tenant")
      .then((r) => r.json())
      .then((data) => {
        if (data.configured && data.tenant) {
          setLive(true);
          if (data.tenant.name) setTenantName(data.tenant.name);
          if (data.tenant.brand_color) setAccent(data.tenant.brand_color);
          if (data.tenant.logo_url) setLogoUrl(data.tenant.logo_url);
          setPoweredBy(!!data.tenant.powered_by_badge);
        }
      })
      .catch(() => {});
  }, [checked, hasSession]);

  const swatches = live && !sampleSwatches.includes(accent) ? [accent, ...sampleSwatches] : sampleSwatches;

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <div className="max-w-[1160px] mx-auto p-[26px_24px] flex flex-col gap-5">
        <div>
          <h4 className="m-0 text-[19px]">Branded templates</h4>
          <div className="text-muted text-xs mt-0.5">
            Every client-facing document and email carries the tenant&rsquo;s logo, color and domain. Origin stays invisible.
          </div>
          {!live && (
            <div className="text-[11.5px] mt-1.5" style={{ color: "var(--color-neutral-500)" }}>
              {checked && !hasSession
                ? "Showing a sample business — sign in to preview these with your own name, logo and color."
                : "Loading your branding…"}
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <div className="seg">
            <label className="seg-opt">
              <input type="radio" name="tmode" checked={mode === "invoice"} onChange={() => setMode("invoice")} />
              <IconInvoices size={13} />
              <span>Invoice</span>
            </label>
            <label className="seg-opt">
              <input type="radio" name="tmode" checked={mode === "email"} onChange={() => setMode("email")} />
              <IconMail size={13} />
              <span>Signature email</span>
            </label>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11.5px] text-[var(--color-neutral-500)]">Accent color</span>
            <div className="flex gap-1.5">
              {swatches.map((color) => (
                <button
                  key={color}
                  aria-label={`Use ${color}`}
                  onClick={() => setAccent(color)}
                  className="w-6 h-6 rounded-lg cursor-pointer"
                  style={{
                    background: color,
                    outline: accent === color ? "2px solid var(--color-text)" : "none",
                    outlineOffset: 2,
                  }}
                />
              ))}
            </div>
            <span className="text-[12px] text-[var(--color-neutral-400)]">{tenantName}</span>
          </div>

          <label className="radio gap-2 text-[12.5px] ml-2">
            <input type="checkbox" checked={poweredBy} onChange={(e) => setPoweredBy(e.target.checked)} />
            <span className="dot" style={{ borderRadius: 5 }} />
            &ldquo;Powered by&rdquo; badge
          </label>

          <div className="flex-1" />
          <button className="btn btn-secondary text-[12.5px] no-print" onClick={() => window.print()}>
            <IconDownload size={13} />
            Print / Save as PDF
          </button>
        </div>

        <div
          className="rounded-2xl p-4 sm:p-8 overflow-x-auto print-area"
          style={{ background: "var(--color-neutral-900)", boxShadow: "var(--shadow-sm)" }}
        >
          {mode === "invoice" ? (
            <InvoiceTemplate tenantName={tenantName} tenantAccent={accent} poweredBy={poweredBy} logoUrl={logoUrl} />
          ) : (
            <EmailTemplate tenantName={tenantName} tenantAccent={accent} poweredBy={poweredBy} logoUrl={logoUrl} />
          )}
        </div>
      </div>
    </div>
  );
}
