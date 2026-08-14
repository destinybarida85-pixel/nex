"use client";

import { useEffect, useRef, useState } from "react";
import { IconCamera, IconCheckCircle } from "@/components/icons";

type TenantData = {
  name: string;
  logo_url: string | null;
  brand_color: string;
  site_slug: string | null;
  site_published: boolean;
  custom_domain: string | null;
};

const SWATCHES = ["#9184d9", "#63c3b2", "#d9a05b", "#7fa3e8", "#c98bd9"];

async function uploadImage(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body: form });
  const data = await res.json();
  if (!res.ok || data.error) throw new Error(data.error || "Upload failed.");
  return data.url as string;
}

export default function WhiteLabelPanel() {
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [brandColor, setBrandColor] = useState(SWATCHES[0]);
  const [siteSlug, setSiteSlug] = useState<string | null>(null);
  const [sitePublished, setSitePublished] = useState(false);
  const [customDomain, setCustomDomain] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/tenant")
      .then((r) => r.json())
      .then((data) => {
        if (!data.configured || !data.tenant) return;
        const t: TenantData = data.tenant;
        setName(t.name ?? "");
        setLogoUrl(t.logo_url ?? null);
        setBrandColor(t.brand_color || SWATCHES[0]);
        setSiteSlug(t.site_slug ?? null);
        setSitePublished(!!t.site_published);
        setCustomDomain(t.custom_domain ?? "");
      })
      .catch(() => {});
  }, []);

  async function handleLogoFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const url = await uploadImage(file);
      setLogoUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't upload that logo.");
    } finally {
      setUploading(false);
    }
  }

  async function save() {
    setSaving(true);
    setSaved(false);
    setError("");
    try {
      const res = await fetch("/api/tenant", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || undefined,
          logoUrl,
          brandColor,
          customDomain: customDomain.trim() || "",
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Couldn't save that.");
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't reach the server.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-4 max-w-[1080px]">
      <div>
        <h3 className="m-0 text-[22px]" style={{ color: "#fff" }}>White-label</h3>
        <div className="text-[13.5px] mt-1.5" style={{ color: "#a8a8a8" }}>
          Your brand identity across Primue — name, logo, color, and your client-facing site.
        </div>
      </div>

      {/* Status row — same stat-tile treatment as Dashboard / Finance / Intelligence */}
      <div className="grid gap-3.5" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        <div className="card elev-sm gap-1.5 p-4" style={{ background: "#161616", border: "1px solid rgba(255,255,255,0.14)" }}>
          <span className="text-[11px] tracking-[.06em] uppercase" style={{ color: "#6b6b6b" }}>Site status</span>
          <span className="text-[16px] font-medium" style={{ color: "#fff" }}>{sitePublished ? "Published" : "Not published"}</span>
          <span
            className="tag text-[9.5px] self-start"
            style={{
              border: `1px solid ${sitePublished ? "#8fd6a8" : "#6b6b6b"}`,
              color: sitePublished ? "#8fd6a8" : "#6b6b6b",
            }}
          >
            {siteSlug ? `primue.com/site/${siteSlug}` : "Not set up yet"}
          </span>
        </div>

        <div className="card elev-sm gap-1.5 p-4" style={{ background: "#161616", border: "1px solid rgba(255,255,255,0.14)" }}>
          <span className="text-[11px] tracking-[.06em] uppercase" style={{ color: "#6b6b6b" }}>Custom domain</span>
          <span className="text-[16px] font-medium truncate" style={{ color: "#fff" }}>{customDomain || "Not set"}</span>
          {customDomain && (
            <span className="tag text-[9.5px] self-start" style={{ border: "1px solid #d9a05b", color: "#d9a05b" }}>
              Not resolving yet
            </span>
          )}
        </div>

        <div className="card elev-sm gap-1.5 p-4" style={{ background: "#161616", border: "1px solid rgba(255,255,255,0.14)" }}>
          <span className="text-[11px] tracking-[.06em] uppercase" style={{ color: "#6b6b6b" }}>Brand color</span>
          <div className="flex items-center gap-2">
            <span className="rounded-full flex-none" style={{ width: 16, height: 16, background: brandColor }} />
            <span className="text-[16px] font-medium font-mono" style={{ color: "#fff" }}>{brandColor}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-3.5" style={{ gridTemplateColumns: "1.6fr 1fr" }}>
        {/* Left: identity form */}
        <div className="card elev-sm gap-3.5 p-5" style={{ background: "#161616", border: "1px solid rgba(255,255,255,0.14)" }}>
          <div className="text-[13px] font-medium" style={{ color: "#fff" }}>Identity</div>

          <div className="field">
            <label style={{ fontSize: 12, fontWeight: 600, color: "#8a8a8a" }}>Business name</label>
            <input
              className="input text-[14px]"
              style={{ background: "#0a0a0a", color: "#f5f5f5", border: "1px solid rgba(255,255,255,0.14)" }}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="field">
            <label style={{ fontSize: 12, fontWeight: 600, color: "#8a8a8a" }}>Logo</label>
            <div className="flex items-center gap-3">
              <div
                className="rounded-lg grid place-items-center flex-none overflow-hidden"
                style={{ width: 44, height: 44, background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.14)" }}
              >
                {logoUrl ? <img src={logoUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : (
                  <span style={{ color: "#6b6b6b", fontSize: 11 }}>None</span>
                )}
              </div>
              <button
                className="btn text-[12.5px]"
                style={{ border: "1px solid rgba(255,255,255,0.14)", color: "#a8a8a8" }}
                onClick={() => logoInputRef.current?.click()}
                disabled={uploading}
              >
                <IconCamera size={12} />
                {uploading ? "Uploading…" : logoUrl ? "Replace" : "Upload"}
              </button>
              <input ref={logoInputRef} type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif" className="hidden" onChange={handleLogoFile} />
            </div>
          </div>

          <div className="field">
            <label style={{ fontSize: 12, fontWeight: 600, color: "#8a8a8a" }}>Brand color</label>
            <div className="flex items-center gap-2">
              {SWATCHES.map((c) => (
                <button
                  key={c}
                  aria-label={`Use ${c}`}
                  onClick={() => setBrandColor(c)}
                  className="rounded-md cursor-pointer"
                  style={{ width: 24, height: 24, background: c, outline: brandColor === c ? "2px solid #fff" : "none", outlineOffset: 2 }}
                />
              ))}
              <label className="rounded-md cursor-pointer grid place-items-center overflow-hidden" style={{ width: 24, height: 24, border: "1px dashed rgba(255,255,255,0.3)" }}>
                <input type="color" value={brandColor} onChange={(e) => setBrandColor(e.target.value)} className="opacity-0 w-full h-full cursor-pointer" />
              </label>
            </div>
          </div>

          {error && <div className="text-[12px]" style={{ color: "#ff8a8a" }}>{error}</div>}
          {saved && !error && (
            <div className="text-[12px] flex items-center gap-1.5" style={{ color: "#8fd6a8" }}>
              <IconCheckCircle size={12} /> Saved
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

        {/* Right: site + domain, stacked like Dashboard's right column */}
        <div className="flex flex-col gap-3.5">
          <div className="card elev-sm gap-2 p-5" style={{ background: "#161616", border: "1px solid rgba(255,255,255,0.14)" }}>
            <div className="text-[13.5px] font-medium" style={{ color: "#fff" }}>Your client-facing site</div>
            {siteSlug ? (
              <>
                <div className="text-[12.5px]" style={{ color: "#a8a8a8" }}>
                  primue.com/site/{siteSlug} — {sitePublished ? "published" : "not published yet"}
                </div>
                {sitePublished && (
                  <a href={`/site/${siteSlug}`} target="_blank" rel="noreferrer" className="text-[12.5px]" style={{ color: "#fff" }}>
                    View live site →
                  </a>
                )}
              </>
            ) : (
              <div className="text-[12.5px]" style={{ color: "#6b6b6b" }}>Not set up yet.</div>
            )}
            <a href="/whitelabel" className="btn text-[12.5px] self-start mt-1" style={{ border: "1px solid rgba(255,255,255,0.14)", color: "#a8a8a8" }}>
              Choose template &amp; content →
            </a>
          </div>

          <div className="card elev-sm gap-2 p-5" style={{ background: "#161616", border: "1px solid rgba(255,255,255,0.14)" }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#8a8a8a" }}>Connect your own domain</label>
            <input
              className="input text-[13.5px] font-mono"
              style={{ background: "#0a0a0a", color: "#f5f5f5", border: "1px solid rgba(255,255,255,0.14)" }}
              placeholder="yourbrand.com"
              value={customDomain}
              onChange={(e) => setCustomDomain(e.target.value.toLowerCase())}
            />
            <div className="text-[11.5px] leading-[1.6]" style={{ color: "#6b6b6b" }}>
              Saving this reserves the domain on your account — it doesn&rsquo;t make it resolve on its own. You still
              need to add it under this project&rsquo;s Domains in Vercel and point its DNS there. Until then, your site
              stays reachable at the primue.com address above. Already have a full website elsewhere? Use{" "}
              <span style={{ color: "#a8a8a8" }}>Integrations</span> instead of this field.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
