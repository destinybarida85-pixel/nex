"use client";

import { useEffect, useState } from "react";
import { useVipTheme } from "@/components/vip/theme";
import type { VipSection } from "@/components/vip/VipSidebar";

export default function IntegrationsPanel({ onNavigate }: { onNavigate?: (s: VipSection) => void }) {
  const { tokens } = useVipTheme();
  const [url, setUrl] = useState("");
  const [saved, setSaved] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [sitePublished, setSitePublished] = useState(false);
  const [siteSlug, setSiteSlug] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/tenant")
      .then((r) => r.json())
      .then((data) => {
        if (data.configured && data.tenant) {
          const existing = data.tenant.external_website_url ?? null;
          setSaved(existing);
          setUrl(existing ?? "");
          setSitePublished(!!data.tenant.site_published);
          setSiteSlug(data.tenant.site_slug ?? null);
        }
      })
      .catch(() => {});
  }, []);

  async function save() {
    setSaving(true);
    setError("");
    try {
      const trimmed = url.trim();
      if (trimmed && !/^https?:\/\/.+\..+/.test(trimmed)) {
        throw new Error("Enter a full URL, including https://");
      }
      const res = await fetch("/api/tenant", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ externalWebsiteUrl: trimmed || null }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Couldn't save that.");
      setSaved(trimmed || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't reach the server.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-4 max-w-[1080px]">
      <div>
        <h3 className="m-0 text-[22px]" style={{ color: tokens.text }}>Integrations</h3>
        <div className="text-[13.5px] mt-1.5" style={{ color: tokens.textSecondary }}>
          Already have a website? Link it here instead of using Primue&rsquo;s own white-label site builder — your
          own domain stays exactly what your clients see.
        </div>
      </div>

      <div className="grid gap-3.5" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
        <div className="card elev-sm gap-1.5 p-4" style={{ background: tokens.surface, border: `1px solid ${tokens.border}` }}>
          <span className="text-[11px] tracking-[.06em] uppercase" style={{ color: tokens.textQuaternary }}>External website</span>
          <span className="text-[16px] font-medium truncate" style={{ color: tokens.text }}>{saved || "Not linked"}</span>
          <span
            className="tag text-[9.5px] self-start"
            style={{ border: `1px solid ${saved ? tokens.success : tokens.textQuaternary}`, color: saved ? tokens.success : tokens.textQuaternary }}
          >
            {saved ? "Linked" : "Not set"}
          </span>
        </div>
        <div className="card elev-sm gap-1.5 p-4" style={{ background: tokens.surface, border: `1px solid ${tokens.border}` }}>
          <span className="text-[11px] tracking-[.06em] uppercase" style={{ color: tokens.textQuaternary }}>Primue-built site</span>
          <span className="text-[16px] font-medium" style={{ color: tokens.text }}>{sitePublished ? "Published" : "Not published"}</span>
          <span
            className="tag text-[9.5px] self-start"
            style={{ border: `1px solid ${sitePublished ? tokens.success : tokens.textQuaternary}`, color: sitePublished ? tokens.success : tokens.textQuaternary }}
          >
            {siteSlug ? `primue.com/site/${siteSlug}` : "Not set up"}
          </span>
        </div>
      </div>

      <div className="grid gap-3.5" style={{ gridTemplateColumns: "1.6fr 1fr" }}>
        <div className="card elev-sm gap-3 p-5" style={{ background: tokens.surface, border: `1px solid ${tokens.border}` }}>
          <div className="text-[13px] font-medium" style={{ color: tokens.text }}>Connect your website</div>
          <div className="field">
            <label style={{ fontSize: 12, fontWeight: 600, color: tokens.textTertiary }}>Your website</label>
            <input
              className="input text-[14px]"
              style={{ background: tokens.surfaceInset, color: tokens.text, border: `1px solid ${tokens.border}` }}
              placeholder="https://yourbusiness.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          {error && <div className="text-[12px]" style={{ color: tokens.danger }}>{error}</div>}
          {saved && !error && (
            <div className="text-[12px]" style={{ color: tokens.success }}>
              Linked — {saved}
            </div>
          )}
          <button
            className="btn text-[13.5px] self-start"
            style={{ background: tokens.accentBg, color: tokens.accentText, border: `1px solid ${tokens.accentBg}` }}
            onClick={save}
            disabled={saving}
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>

        <div className="card elev-sm gap-2 p-4" style={{ background: tokens.surface, border: `1px solid ${tokens.border}` }}>
          <div className="text-[12.5px] font-medium" style={{ color: tokens.text }}>How this works</div>
          <div className="text-[11.5px]" style={{ color: tokens.textTertiary, lineHeight: 1.6 }}>
            This just tells Primue where your real site lives — it doesn&rsquo;t change or take over anything on it.
            Want a Primue-built white-label site instead? That&rsquo;s right here in VIP — see{" "}
            <button
              onClick={() => onNavigate?.("whitelabel")}
              style={{ background: "none", border: "none", padding: 0, color: tokens.text, cursor: "pointer", textDecoration: "underline" }}
            >
              White-label
            </button>{" "}in the sidebar.
          </div>
        </div>
      </div>
    </div>
  );
}
