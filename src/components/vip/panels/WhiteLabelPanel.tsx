"use client";

import { useEffect, useRef, useState } from "react";
import { IconCamera, IconCheckCircle } from "@/components/icons";
import { useVipTheme } from "@/components/vip/theme";
import { ClaritySite, LedgerSite, AtriumSite, PortfolioSite, LandingSite, type Site } from "@/app/site/[slug]/page";

type TenantData = {
  name: string;
  logo_url: string | null;
  brand_color: string;
  site_slug: string | null;
  site_published: boolean;
  site_template: string | null;
  custom_domain: string | null;
  powered_by_badge: boolean;
};

// Brand-color picker options — a fixed palette to choose FROM, unrelated to
// (and never swapped by) the VIP console's own light/dark theme.
const SWATCHES = ["#9184d9", "#63c3b2", "#d9a05b", "#7fa3e8", "#c98bd9"];

// The five real templates the public site renderer (/site/[slug]) actually
// supports — same catalogue as the main /whitelabel builder.
const TEMPLATES = [
  { id: "clarity", label: "Clarity" },
  { id: "ledger", label: "Ledger" },
  { id: "atrium", label: "Atrium" },
  { id: "portfolio", label: "Portfolio" },
  { id: "landing", label: "Landing" },
];

async function uploadImage(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body: form });
  const data = await res.json();
  if (!res.ok || data.error) throw new Error(data.error || "Upload failed.");
  return data.url as string;
}

export default function WhiteLabelPanel() {
  const { tokens } = useVipTheme();
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [brandColor, setBrandColor] = useState(SWATCHES[0]);
  const [siteSlug, setSiteSlug] = useState<string | null>(null);
  const [sitePublished, setSitePublished] = useState(false);
  const [siteTemplate, setSiteTemplate] = useState("clarity");
  const [customDomain, setCustomDomain] = useState("");
  const [poweredBy, setPoweredBy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);

  const [slugInput, setSlugInput] = useState("");
  const [savingSite, setSavingSite] = useState(false);
  const [siteSaved, setSiteSaved] = useState(false);
  const [siteError, setSiteError] = useState("");

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
        setSlugInput(t.site_slug ?? "");
        setSitePublished(!!t.site_published);
        setSiteTemplate(t.site_template || "clarity");
        setCustomDomain(t.custom_domain ?? "");
        setPoweredBy(!!t.powered_by_badge);
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
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

  async function saveSite(publish?: boolean) {
    setSavingSite(true);
    setSiteSaved(false);
    setSiteError("");
    try {
      const res = await fetch("/api/tenant", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteSlug: slugInput.trim() || undefined,
          siteTemplate,
          sitePublished: publish !== undefined ? publish : sitePublished,
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Couldn't save that.");
      setSiteSlug(data.tenant?.site_slug ?? slugInput.trim() ?? null);
      setSitePublished(!!data.tenant?.site_published);
      setSiteSaved(true);
    } catch (err) {
      setSiteError(err instanceof Error ? err.message : "Couldn't reach the server.");
    } finally {
      setSavingSite(false);
    }
  }

  // The real Site shape, built live from current (possibly unsaved) form
  // state, so this renders the exact same template components the public
  // /site/[slug] page uses — never a hand-copied mockup that can drift out
  // of sync with what actually gets published. VIP's simplified builder
  // doesn't collect featured documents or a payment link (that's the full
  // editor's job), so those come through honestly empty here too.
  const previewSite: Site = {
    name: name || "Your Business",
    brandColor,
    logoUrl,
    headerImageUrl: null,
    template: (["clarity", "ledger", "atrium", "portfolio", "landing"].includes(siteTemplate) ? siteTemplate : "clarity") as Site["template"],
    poweredByBadge: poweredBy,
    documents: [],
    paymentLink: null,
  };
  const PreviewSiteComponent =
    siteTemplate === "ledger" ? LedgerSite : siteTemplate === "atrium" ? AtriumSite : siteTemplate === "portfolio" ? PortfolioSite : siteTemplate === "landing" ? LandingSite : ClaritySite;

  return (
    <div className="flex flex-col gap-4 max-w-[1080px]">
      <div>
        <h3 className="m-0 text-[22px]" style={{ color: tokens.text }}>White-label</h3>
        <div className="text-[13.5px] mt-1.5" style={{ color: tokens.textSecondary }}>
          Your brand identity across Primue — name, logo, color, and your client-facing site.
        </div>
      </div>

      {/* Status row — same stat-tile treatment as Dashboard / Finance / Intelligence */}
      <div className="grid gap-3.5" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        <div className="card elev-sm gap-1.5 p-4" style={{ background: tokens.surface, border: `1px solid ${tokens.border}` }}>
          <span className="text-[11px] tracking-[.06em] uppercase" style={{ color: tokens.textQuaternary }}>Site status</span>
          <span className="text-[16px] font-medium" style={{ color: tokens.text }}>{sitePublished ? "Published" : "Not published"}</span>
          <span
            className="tag text-[9.5px] self-start"
            style={{
              border: `1px solid ${sitePublished ? tokens.success : tokens.textQuaternary}`,
              color: sitePublished ? tokens.success : tokens.textQuaternary,
            }}
          >
            {siteSlug ? `primue.com/site/${siteSlug}` : "Not set up yet"}
          </span>
        </div>

        <div className="card elev-sm gap-1.5 p-4" style={{ background: tokens.surface, border: `1px solid ${tokens.border}` }}>
          <span className="text-[11px] tracking-[.06em] uppercase" style={{ color: tokens.textQuaternary }}>Custom domain</span>
          <span className="text-[16px] font-medium truncate" style={{ color: tokens.text }}>{customDomain || "Not set"}</span>
          {customDomain && (
            <span className="tag text-[9.5px] self-start" style={{ border: `1px solid ${tokens.warning}`, color: tokens.warning }}>
              Not resolving yet
            </span>
          )}
        </div>

        <div className="card elev-sm gap-1.5 p-4" style={{ background: tokens.surface, border: `1px solid ${tokens.border}` }}>
          <span className="text-[11px] tracking-[.06em] uppercase" style={{ color: tokens.textQuaternary }}>Brand color</span>
          <div className="flex items-center gap-2">
            <span className="rounded-full flex-none" style={{ width: 16, height: 16, background: brandColor }} />
            <span className="text-[16px] font-medium font-mono" style={{ color: tokens.text }}>{brandColor}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-3.5" style={{ gridTemplateColumns: "1.6fr 1fr" }}>
        {/* Left: identity form */}
        <div className="card elev-sm gap-3.5 p-5" style={{ background: tokens.surface, border: `1px solid ${tokens.border}` }}>
          <div className="text-[13px] font-medium" style={{ color: tokens.text }}>Identity</div>

          <div className="field">
            <label style={{ fontSize: 12, fontWeight: 600, color: tokens.textTertiary }}>Business name</label>
            <input
              className="input text-[14px]"
              style={{ background: tokens.surfaceInset, color: tokens.text, border: `1px solid ${tokens.border}` }}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="field">
            <label style={{ fontSize: 12, fontWeight: 600, color: tokens.textTertiary }}>Logo</label>
            <div className="flex items-center gap-3">
              <div
                className="rounded-lg grid place-items-center flex-none overflow-hidden"
                style={{ width: 44, height: 44, background: tokens.surfaceInset, border: `1px solid ${tokens.border}` }}
              >
                {logoUrl ? <img src={logoUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : (
                  <span style={{ color: tokens.textQuaternary, fontSize: 11 }}>None</span>
                )}
              </div>
              <button
                className="btn text-[12.5px]"
                style={{ border: `1px solid ${tokens.border}`, color: tokens.textSecondary }}
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
            <label style={{ fontSize: 12, fontWeight: 600, color: tokens.textTertiary }}>Brand color</label>
            <div className="flex items-center gap-2">
              {SWATCHES.map((c) => (
                <button
                  key={c}
                  aria-label={`Use ${c}`}
                  onClick={() => setBrandColor(c)}
                  className="rounded-md cursor-pointer"
                  style={{ width: 24, height: 24, background: c, outline: brandColor === c ? `2px solid ${tokens.text}` : "none", outlineOffset: 2 }}
                />
              ))}
              <label className="rounded-md cursor-pointer grid place-items-center overflow-hidden" style={{ width: 24, height: 24, border: `1px dashed ${tokens.borderStrong}` }}>
                <input type="color" value={brandColor} onChange={(e) => setBrandColor(e.target.value)} className="opacity-0 w-full h-full cursor-pointer" />
              </label>
            </div>
          </div>

          {error && <div className="text-[12px]" style={{ color: tokens.danger }}>{error}</div>}
          {saved && !error && (
            <div className="text-[12px] flex items-center gap-1.5" style={{ color: tokens.success }}>
              <IconCheckCircle size={12} /> Saved
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

        {/* Right: site builder + domain, stacked like Dashboard's right column */}
        <div className="flex flex-col gap-3.5">
          <div className="card elev-sm gap-2.5 p-5" style={{ background: tokens.surface, border: `1px solid ${tokens.border}` }}>
            <div className="text-[13.5px] font-medium" style={{ color: tokens.text }}>Your client-facing site</div>

            <div className="field">
              <label style={{ fontSize: 11.5, fontWeight: 600, color: tokens.textTertiary }}>Template</label>
              <div className="grid gap-1.5" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
                {TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSiteTemplate(t.id)}
                    className="text-[12px] py-1.5 rounded-md cursor-pointer"
                    style={{
                      border: `1px solid ${siteTemplate === t.id ? tokens.text : tokens.border}`,
                      background: siteTemplate === t.id ? tokens.tint1 : "transparent",
                      color: siteTemplate === t.id ? tokens.text : tokens.textSecondary,
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="field">
              <label style={{ fontSize: 11.5, fontWeight: 600, color: tokens.textTertiary }}>Site address</label>
              <div className="flex items-center gap-1.5">
                <span className="text-[12px]" style={{ color: tokens.textQuaternary }}>primue.com/site/</span>
                <input
                  className="input text-[13px] flex-1"
                  style={{ background: tokens.surfaceInset, color: tokens.text, border: `1px solid ${tokens.border}` }}
                  placeholder="your-business"
                  value={slugInput}
                  onChange={(e) => setSlugInput(e.target.value)}
                />
              </div>
            </div>

            {siteError && <div className="text-[12px]" style={{ color: tokens.danger }}>{siteError}</div>}
            {siteSaved && !siteError && (
              <div className="text-[12px] flex items-center gap-1.5" style={{ color: tokens.success }}>
                <IconCheckCircle size={12} /> Saved
              </div>
            )}

            <div className="flex items-center gap-2 flex-wrap">
              <button
                className="btn text-[12.5px]"
                style={{ border: `1px solid ${tokens.border}`, color: tokens.textSecondary }}
                onClick={() => saveSite()}
                disabled={savingSite || !slugInput.trim()}
              >
                {savingSite ? "Saving…" : "Save"}
              </button>
              <button
                className="btn text-[12.5px]"
                style={{ background: tokens.accentBg, color: tokens.accentText, border: `1px solid ${tokens.accentBg}` }}
                onClick={() => saveSite(!sitePublished)}
                disabled={savingSite || !slugInput.trim()}
              >
                {savingSite ? "Saving…" : sitePublished ? "Unpublish" : "Publish"}
              </button>
              {sitePublished && siteSlug && (
                <a href={`/site/${siteSlug}`} target="_blank" rel="noreferrer" className="text-[12px]" style={{ color: tokens.text }}>
                  View live site →
                </a>
              )}
            </div>

            <a href="/whitelabel" className="text-[11px]" style={{ color: tokens.textQuaternary }}>
              Add featured documents, a payment link or a header image → full editor
            </a>
          </div>

          {/* Pops in the moment there's a real business to show — a quiet
              loading placeholder fills the same space for the brief window
              before the tenant's real data arrives, then this replaces it. */}
          {loaded && name ? (
            <div className="flex flex-col gap-2">
              <span className="text-[11px] tracking-[.06em] uppercase" style={{ color: tokens.textQuaternary }}>
                Preview · what your clients will see
              </span>
              <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${tokens.border}` }}>
                <div className="flex items-center gap-1.5 px-3 py-2" style={{ borderBottom: `1px solid ${tokens.border}`, background: tokens.surface }}>
                  <span className="w-2 h-2 rounded-full" style={{ background: tokens.tint2 }} />
                  <span className="w-2 h-2 rounded-full" style={{ background: tokens.tint2 }} />
                  <span className="w-2 h-2 rounded-full" style={{ background: tokens.tint2 }} />
                  <span className="ml-2.5 font-mono text-[10.5px]" style={{ color: tokens.textQuaternary }}>
                    primue.com/site/{slugInput || "your-business"}
                  </span>
                </div>
                <div style={{ height: 360, overflow: "hidden", position: "relative" }}>
                  <div style={{ transform: "scale(0.42)", transformOrigin: "top left", width: "238%", pointerEvents: "none" }}>
                    <PreviewSiteComponent site={previewSite} />
                  </div>
                </div>
              </div>
              <span className="text-[10.5px]" style={{ color: tokens.textQuaternary }}>
                {sitePublished ? "This is live — anyone with the link can see it." : "Updates as you edit. Publish to make it a real, reachable page."}
              </span>
            </div>
          ) : (
            <div className="rounded-xl grid place-items-center" style={{ height: 200, border: `1px solid ${tokens.border}`, color: tokens.textQuaternary }}>
              <span className="text-[12px]">Loading preview…</span>
            </div>
          )}

          <div className="card elev-sm gap-2 p-5" style={{ background: tokens.surface, border: `1px solid ${tokens.border}` }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: tokens.textTertiary }}>Connect your own domain</label>
            <input
              className="input text-[13.5px] font-mono"
              style={{ background: tokens.surfaceInset, color: tokens.text, border: `1px solid ${tokens.border}` }}
              placeholder="yourbrand.com"
              value={customDomain}
              onChange={(e) => setCustomDomain(e.target.value.toLowerCase())}
            />
            <div className="text-[11.5px] leading-[1.6]" style={{ color: tokens.textQuaternary }}>
              Saving this reserves the domain on your account — it doesn&rsquo;t make it resolve on its own. You still
              need to add it under this project&rsquo;s Domains in Vercel and point its DNS there. Until then, your site
              stays reachable at the primue.com address above. Already have a full website elsewhere? Use{" "}
              <span style={{ color: tokens.textSecondary }}>Integrations</span>{" "}instead of this field.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
