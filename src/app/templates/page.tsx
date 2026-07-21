"use client";

import { useState } from "react";
import { IconInvoices, IconMail, IconDownload } from "@/components/icons";
import InvoiceTemplate from "@/components/templates/InvoiceTemplate";
import EmailTemplate from "@/components/templates/EmailTemplate";

const tenants = [
  { name: "Atlas Chambers", color: "#63c3b2" },
  { name: "Brightfield Academy", color: "#d9a05b" },
  { name: "Cascade Relief", color: "#7fa3e8" },
  { name: "Meridian Studio", color: "#9184d9" },
];

export default function TemplatesPage() {
  const [mode, setMode] = useState<"invoice" | "email">("invoice");
  const [tenant, setTenant] = useState(tenants[0]);
  const [poweredBy, setPoweredBy] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <div className="max-w-[1160px] mx-auto p-[26px_24px] flex flex-col gap-5">
        <div>
          <h4 className="m-0 text-[19px]">Branded templates</h4>
          <div className="text-muted text-xs mt-0.5">
            Every client-facing document and email carries the tenant&rsquo;s logo, color and domain — Nex stays invisible.
          </div>
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
            <span className="text-[11.5px] text-[var(--color-neutral-500)]">Tenant</span>
            <div className="flex gap-1.5">
              {tenants.map((t) => (
                <button
                  key={t.name}
                  aria-label={t.name}
                  onClick={() => setTenant(t)}
                  className="w-6 h-6 rounded-lg cursor-pointer"
                  style={{
                    background: t.color,
                    outline: tenant.name === t.name ? "2px solid var(--color-text)" : "none",
                    outlineOffset: 2,
                  }}
                />
              ))}
            </div>
            <span className="text-[12px] text-[var(--color-neutral-400)]">{tenant.name}</span>
          </div>

          <label className="radio gap-2 text-[12.5px] ml-2">
            <input type="checkbox" checked={poweredBy} onChange={(e) => setPoweredBy(e.target.checked)} />
            <span className="dot" style={{ borderRadius: 5 }} />
            &ldquo;Powered by&rdquo; badge
          </label>

          <div className="flex-1" />
          <button className="btn btn-secondary text-[12.5px]">
            <IconDownload size={13} />
            Download {mode === "invoice" ? "PDF" : "HTML"}
          </button>
        </div>

        <div
          className="rounded-2xl p-8"
          style={{ background: "var(--color-neutral-900)", boxShadow: "var(--shadow-sm)" }}
        >
          {mode === "invoice" ? (
            <InvoiceTemplate tenantName={tenant.name} tenantAccent={tenant.color} poweredBy={poweredBy} />
          ) : (
            <EmailTemplate tenantName={tenant.name} tenantAccent={tenant.color} poweredBy={poweredBy} />
          )}
        </div>
      </div>
    </div>
  );
}
