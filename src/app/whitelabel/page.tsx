"use client";

import { useState } from "react";

const swatches = ["#63c3b2", "#d9a05b", "#7fa3e8", "#c98bd9"];

export default function WhiteLabelPage() {
  const [tenantAccent, setTenantAccent] = useState(swatches[0]);
  const [poweredBy, setPoweredBy] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <div className="max-w-[1240px] mx-auto p-[22px_26px] flex flex-col gap-4">
        <div>
          <h4 className="m-0 text-[19px]">White-label</h4>
          <div className="text-muted text-xs mt-0.5">
            Your clients see only your brand — the platform runs behind the scenes.
          </div>
        </div>

        <div className="grid gap-5 items-start" style={{ gridTemplateColumns: "380px 1fr" }}>
          <div className="flex flex-col gap-3.5">
            <div className="field">
              <label>Company name</label>
              <input className="input" defaultValue="Atlas Chambers" />
            </div>
            <div className="field">
              <label>Logo</label>
              <div className="flex items-center gap-3 p-3 border border-dashed border-[var(--color-divider)] rounded-lg">
                <span
                  className="w-9 h-9 rounded-[9px] grid place-items-center font-medium text-[15px]"
                  style={{ background: `color-mix(in srgb, ${tenantAccent} 18%, transparent)`, color: tenantAccent }}
                >
                  A
                </span>
                <div className="text-xs text-[var(--color-neutral-400)]">
                  atlas-mark.svg
                  <div className="text-[10.5px] text-[var(--color-neutral-500)]">Drop a new file to replace</div>
                </div>
              </div>
            </div>
            <div className="field">
              <label>Brand color</label>
              <div className="flex gap-2">
                {swatches.map((color) => (
                  <button
                    key={color}
                    aria-label={`Use ${color}`}
                    onClick={() => setTenantAccent(color)}
                    className="w-[26px] h-[26px] rounded-lg cursor-pointer"
                    style={{
                      background: color,
                      outline: tenantAccent === color ? "2px solid var(--color-text)" : "none",
                      outlineOffset: 2,
                    }}
                  />
                ))}
                <span className="w-[26px] h-[26px] rounded-lg border border-dashed border-[var(--color-divider)] grid place-items-center text-[var(--color-neutral-500)] text-[13px]">
                  +
                </span>
              </div>
            </div>
            <div className="field">
              <label>Custom domain</label>
              <input className="input font-mono text-[12.5px]" defaultValue="portal.atlaschambers.com" />
            </div>
            <div className="field">
              <label>Applies to</label>
              <div className="flex flex-wrap gap-1.5">
                {["Login", "Dashboard", "Emails", "PDFs & invoices", "Client portal", "Notifications"].map((t) => (
                  <span key={t} className="tag tag-neutral">{t}</span>
                ))}
              </div>
            </div>
            <label className="radio gap-2.5 text-[13px]">
              <input type="checkbox" checked={poweredBy} onChange={(e) => setPoweredBy(e.target.checked)} />
              <span className="dot" style={{ borderRadius: 5 }} />
              Show &ldquo;Powered by&rdquo; badge to clients
              <span className="tag tag-outline text-[9.5px] ml-auto">{poweredBy ? "On" : "Off"}</span>
            </label>
            <div className="flex gap-2 mt-0.5">
              <button className="btn btn-primary text-[12.5px]">Publish branding</button>
              <button className="btn btn-secondary text-[12.5px]">Preview as client</button>
            </div>
            <a href="/templates" className="btn btn-ghost text-[12.5px] self-start">
              View branded invoice &amp; email templates →
            </a>
          </div>

          <div className="flex flex-col gap-2.5">
            <div className="text-[10.5px] tracking-[.08em] uppercase text-[var(--color-neutral-500)]">
              Live preview — what your clients see
            </div>
            <div className="border border-[var(--color-divider)] rounded-xl overflow-hidden">
              <div className="flex items-center gap-1.5 px-3 py-2 border-b border-[var(--color-divider)] bg-[var(--color-surface)]">
                <span className="w-2 h-2 rounded-full bg-[var(--color-neutral-700)]" />
                <span className="w-2 h-2 rounded-full bg-[var(--color-neutral-700)]" />
                <span className="w-2 h-2 rounded-full bg-[var(--color-neutral-700)]" />
                <span className="ml-2.5 font-mono text-[10.5px] text-[var(--color-neutral-500)]">
                  portal.atlaschambers.com
                </span>
              </div>
              <div className="flex bg-[var(--color-bg)]">
                <div className="w-[150px] flex-none p-[14px_10px] border-r border-[var(--color-divider)] flex flex-col gap-1.5">
                  <div className="flex items-center gap-[7px] px-1 pb-2">
                    <span
                      className="w-5 h-5 rounded-[6px] grid place-items-center text-[11px] font-medium"
                      style={{ background: `color-mix(in srgb, ${tenantAccent} 18%, transparent)`, color: tenantAccent }}
                    >
                      A
                    </span>
                    <span className="text-xs font-medium">Atlas Chambers</span>
                  </div>
                  <div
                    className="px-2 py-[5px] rounded-md text-[11px]"
                    style={{ color: tenantAccent, background: `color-mix(in srgb, ${tenantAccent} 12%, transparent)` }}
                  >
                    Dashboard
                  </div>
                  <div className="px-2 py-[5px] text-[11px] text-[var(--color-neutral-500)]">Matters</div>
                  <div className="px-2 py-[5px] text-[11px] text-[var(--color-neutral-500)]">Documents</div>
                  <div className="px-2 py-[5px] text-[11px] text-[var(--color-neutral-500)]">Billing</div>
                </div>
                <div className="flex-1 p-3.5 flex flex-col gap-2.5">
                  <div className="text-[13px] font-medium">Good morning, Counsel</div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2.5 rounded-lg bg-[var(--color-surface)]">
                      <div className="text-[9px] tracking-[.08em] uppercase text-[var(--color-neutral-500)]">Trust balance</div>
                      <div className="text-[15px] font-medium mt-0.5">$412,080</div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[var(--color-surface)]">
                      <div className="text-[9px] tracking-[.08em] uppercase text-[var(--color-neutral-500)]">Open matters</div>
                      <div className="text-[15px] font-medium mt-0.5">37</div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[var(--color-surface)]">
                      <div className="text-[9px] tracking-[.08em] uppercase text-[var(--color-neutral-500)]">Awaiting signature</div>
                      <div className="text-[15px] font-medium mt-0.5" style={{ color: tenantAccent }}>5</div>
                    </div>
                  </div>
                  <div
                    className="h-14 rounded-lg"
                    style={{
                      background: `linear-gradient(180deg, color-mix(in srgb, ${tenantAccent} 14%, transparent), transparent)`,
                      border: `1px solid color-mix(in srgb, ${tenantAccent} 25%, transparent)`,
                    }}
                  />
                  <div className="text-[10px] text-[var(--color-neutral-600)] text-center">
                    No platform branding visible to clients
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
