"use client";

import { useEffect, useState } from "react";

export default function IntegrationsPanel() {
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
        <h3 className="m-0 text-[22px]" style={{ color: "#fff" }}>Integrations</h3>
        <div className="text-[13.5px] mt-1.5" style={{ color: "#a8a8a8" }}>
          Already have a website? Link it here instead of using Primue&rsquo;s own white-label site builder — your
          own domain stays exactly what your clients see.
        </div>
      </div>

      <div className="grid gap-3.5" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
        <div className="card elev-sm gap-1.5 p-4" style={{ background: "#161616", border: "1px solid rgba(255,255,255,0.14)" }}>
          <span className="text-[11px] tracking-[.06em] uppercase" style={{ color: "#6b6b6b" }}>External website</span>
          <span className="text-[16px] font-medium truncate" style={{ color: "#fff" }}>{saved || "Not linked"}</span>
          <span
            className="tag text-[9.5px] self-start"
            style={{ border: `1px solid ${saved ? "#8fd6a8" : "#6b6b6b"}`, color: saved ? "#8fd6a8" : "#6b6b6b" }}
          >
            {saved ? "Linked" : "Not set"}
          </span>
        </div>
        <div className="card elev-sm gap-1.5 p-4" style={{ background: "#161616", border: "1px solid rgba(255,255,255,0.14)" }}>
          <span className="text-[11px] tracking-[.06em] uppercase" style={{ color: "#6b6b6b" }}>Primue-built site</span>
          <span className="text-[16px] font-medium" style={{ color: "#fff" }}>{sitePublished ? "Published" : "Not published"}</span>
          <span
            className="tag text-[9.5px] self-start"
            style={{ border: `1px solid ${sitePublished ? "#8fd6a8" : "#6b6b6b"}`, color: sitePublished ? "#8fd6a8" : "#6b6b6b" }}
          >
            {siteSlug ? `primue.com/site/${siteSlug}` : "Not set up"}
          </span>
        </div>
      </div>

      <div className="grid gap-3.5" style={{ gridTemplateColumns: "1.6fr 1fr" }}>
        <div className="card elev-sm gap-3 p-5" style={{ background: "#161616", border: "1px solid rgba(255,255,255,0.14)" }}>
          <div className="text-[13px] font-medium" style={{ color: "#fff" }}>Connect your website</div>
          <div className="field">
            <label style={{ fontSize: 12, fontWeight: 600, color: "#8a8a8a" }}>Your website</label>
            <input
              className="input text-[14px]"
              style={{ background: "#0a0a0a", color: "#f5f5f5", border: "1px solid rgba(255,255,255,0.14)" }}
              placeholder="https://yourbusiness.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          {error && <div className="text-[12px]" style={{ color: "#ff8a8a" }}>{error}</div>}
          {saved && !error && (
            <div className="text-[12px]" style={{ color: "#8fd6a8" }}>
              Linked — {saved}
            </div>
          )}
          <button
            className="btn text-[13.5px] self-start"
            style={{ background: "#fff", color: "#0a0a0a", border: "1px solid #fff" }}
            onClick={save}
            disabled={saving}
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>

        <div className="card elev-sm gap-2 p-4" style={{ background: "#161616", border: "1px dashed rgba(255,255,255,0.2)" }}>
          <div className="text-[12.5px] font-medium" style={{ color: "#fff" }}>How this works</div>
          <div className="text-[11.5px]" style={{ color: "#8a8a8a", lineHeight: 1.6 }}>
            This just tells Primue where your real site lives — it doesn&rsquo;t change or take over anything on it.
            Want a Primue-built white-label site instead? That&rsquo;s under{" "}
            <a href="/whitelabel" style={{ color: "#fff" }}>White-label</a> on the main dashboard.
          </div>
        </div>
      </div>
    </div>
  );
}
