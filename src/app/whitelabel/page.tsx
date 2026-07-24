"use client";

import { useEffect, useRef, useState } from "react";
import { IconGlobe, IconCamera, IconCheckCircle } from "@/components/icons";
import { useHasSession } from "@/lib/useSession";
import { isBackendConfigured } from "@/lib/backendStatus";

const baseSwatches = ["#63c3b2", "#d9a05b", "#7fa3e8", "#c98bd9"];

type PaymentLink = { id: string; title: string; amount_cents: number; currency: string; url: string };
type TenantDocument = { id: string; title: string; status: string };
type Template = "clarity" | "ledger" | "atrium";

const templates: { id: Template; name: string; why: string }[] = [
  { id: "clarity", name: "Clarity", why: "Best for consulting & legal — a calm, centered page that puts the document and price front and center." },
  { id: "ledger", name: "Ledger", why: "Best for ongoing client relationships — a dashboard-style sidebar layout that feels like a real portal." },
  { id: "atrium", name: "Atrium", why: "Best if you have a strong header photo — a bold full-width banner up top for agencies and studios." },
];

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function slugify(input: string) {
  return input.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 48);
}

export default function WhiteLabelPage() {
  const { hasSession, checked } = useHasSession();
  const [customSwatches, setCustomSwatches] = useState<string[]>([]);
  const swatches = [...baseSwatches, ...customSwatches];
  const colorPickerRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const headerInputRef = useRef<HTMLInputElement>(null);
  const [tenantAccent, setTenantAccent] = useState(baseSwatches[0]);
  const [poweredBy, setPoweredBy] = useState(false);
  const [companyName, setCompanyName] = useState("Atlas Chambers");
  const [domain, setDomain] = useState("portal.atlaschambers.com");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [headerImageUrl, setHeaderImageUrl] = useState<string | null>(null);
  const [template, setTemplate] = useState<Template>("clarity");
  const [siteSlug, setSiteSlug] = useState("atlas-chambers");
  const [slugTouched, setSlugTouched] = useState(false);
  const [sitePublished, setSitePublished] = useState(false);
  const [paymentLinks, setPaymentLinks] = useState<PaymentLink[]>([]);
  const [selectedLinkId, setSelectedLinkId] = useState("");
  const [documents, setDocuments] = useState<TenantDocument[]>([]);
  const [selectedDocIds, setSelectedDocIds] = useState<string[]>([]);
  const [docFormOpen, setDocFormOpen] = useState(false);
  const [docTitle, setDocTitle] = useState("");
  const [docText, setDocText] = useState("");
  const [docSaving, setDocSaving] = useState(false);
  const [docError, setDocError] = useState("");
  const [live, setLive] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishedAt, setPublishedAt] = useState<string | null>(null);
  const [publishError, setPublishError] = useState("");

  useEffect(() => {
    if (!slugTouched) setSiteSlug(slugify(companyName));
  }, [companyName, slugTouched]);

  useEffect(() => {
    if (!checked || !isBackendConfigured || !hasSession) return;
    fetch("/api/tenant")
      .then((r) => r.json())
      .then((data) => {
        if (data.configured && data.tenant) {
          setLive(true);
          if (data.tenant.name) setCompanyName(data.tenant.name);
          if (data.tenant.domain) setDomain(data.tenant.domain);
          if (data.tenant.brand_color) setTenantAccent(data.tenant.brand_color);
          setPoweredBy(!!data.tenant.powered_by_badge);
          if (data.tenant.logo_url) setLogoUrl(data.tenant.logo_url);
          if (data.tenant.header_image_url) setHeaderImageUrl(data.tenant.header_image_url);
          if (data.tenant.site_template) setTemplate(data.tenant.site_template);
          if (data.tenant.site_slug) {
            setSiteSlug(data.tenant.site_slug);
            setSlugTouched(true);
          }
          setSitePublished(!!data.tenant.site_published);
          if (Array.isArray(data.tenant.site_document_ids)) setSelectedDocIds(data.tenant.site_document_ids);
          if (data.tenant.site_payment_link_id) setSelectedLinkId(data.tenant.site_payment_link_id);
        }
      })
      .catch(() => {});
    fetch("/api/stripe/payment-links")
      .then((r) => r.json())
      .then((data) => {
        if (data.configured && data.links) {
          setPaymentLinks(data.links);
          setSelectedLinkId((prev) => prev || (data.links.length > 0 ? data.links[0].id : ""));
        }
      })
      .catch(() => {
        // Stay empty on any failure — the picker just shows the "create one" hint.
      });
    fetch("/api/documents")
      .then((r) => r.json())
      .then((data) => {
        if (data.configured && data.documents) setDocuments(data.documents);
      })
      .catch(() => {});
  }, [checked, hasSession]);

  async function createDocument() {
    if (!docTitle.trim() || !docText.trim()) {
      setDocError("Give it a title and some content.");
      return;
    }
    setDocSaving(true);
    setDocError("");
    const res = await fetch("/api/documents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: docTitle.trim(), text: docText.trim() }),
    });
    const data = await res.json();
    if (!res.ok || data.error) {
      setDocError(data.error || "Couldn't save the document.");
      setDocSaving(false);
      return;
    }
    setDocuments((prev) => [data.document, ...prev]);
    setSelectedDocIds((prev) => [...prev, data.document.id]);
    setDocFormOpen(false);
    setDocTitle("");
    setDocText("");
    setDocSaving(false);
  }

  function toggleDoc(id: string) {
    setSelectedDocIds((prev) => (prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]));
  }

  async function handleLogoFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    setLogoUrl(await readAsDataUrl(file));
  }

  async function handleHeaderFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    setHeaderImageUrl(await readAsDataUrl(file));
  }

  async function publishBranding(publish?: boolean) {
    setPublishing(true);
    setPublishError("");
    const nextPublished = publish ?? sitePublished;
    if (live) {
      const res = await fetch("/api/tenant", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: companyName,
          domain,
          brandColor: tenantAccent,
          poweredByBadge: poweredBy,
          logoUrl: logoUrl || "",
          headerImageUrl: headerImageUrl || "",
          siteSlug,
          siteTemplate: template,
          siteDocumentIds: selectedDocIds,
          sitePaymentLinkId: selectedLinkId || null,
          sitePublished: nextPublished,
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setPublishError(data.error || "Couldn't save your branding.");
        setPublishing(false);
        return;
      }
      setSitePublished(nextPublished);
    }
    setPublishedAt(new Date().toLocaleTimeString());
    setPublishing(false);
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <div className="max-w-[1240px] mx-auto p-4 sm:p-[22px_26px] flex flex-col gap-4">
        <div>
          <h4 className="m-0 text-[19px]">White-label</h4>
          <div className="text-muted text-xs mt-0.5">
            Your clients see only your brand. The platform runs behind the scenes.
          </div>
        </div>

        <div className="grid gap-5 items-start grid-cols-1 lg:grid-cols-[380px_1fr]">
          <div className="flex flex-col gap-3.5">
            <div className="field">
              <label>Company name</label>
              <input className="input" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
            </div>
            <div className="field">
              <label>Logo</label>
              <div className="flex items-center gap-3 p-3 border border-dashed border-[var(--color-divider)] rounded-lg">
                {logoUrl ? (
                  <img src={logoUrl} alt="" className="w-9 h-9 rounded-[9px] object-cover flex-none" />
                ) : (
                  <span
                    className="w-9 h-9 rounded-[9px] grid place-items-center font-medium text-[15px] flex-none"
                    style={{ background: `color-mix(in srgb, ${tenantAccent} 18%, transparent)`, color: tenantAccent }}
                  >
                    {companyName.trim().charAt(0).toUpperCase() || "A"}
                  </span>
                )}
                <div className="text-xs text-[var(--color-neutral-400)] flex-1">
                  {logoUrl ? "Custom logo uploaded" : "No logo yet — using your initial"}
                </div>
                <button className="btn btn-secondary text-[11.5px] flex-none" onClick={() => logoInputRef.current?.click()}>
                  <IconCamera size={12} />
                  Upload
                </button>
                <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoFile} />
              </div>
            </div>
            <div className="field">
              <label>Header image (optional)</label>
              <div className="flex items-center gap-3 p-3 border border-dashed border-[var(--color-divider)] rounded-lg">
                {headerImageUrl ? (
                  <img src={headerImageUrl} alt="" className="w-14 h-9 rounded-md object-cover flex-none" />
                ) : (
                  <div className="w-14 h-9 rounded-md flex-none grid place-items-center" style={{ background: "var(--color-surface)" }}>
                    <IconCamera size={13} className="text-[var(--color-neutral-500)]" />
                  </div>
                )}
                <div className="text-xs text-[var(--color-neutral-400)] flex-1">
                  {headerImageUrl ? "Banner uploaded" : "Used by the Atrium template"}
                </div>
                <button className="btn btn-secondary text-[11.5px] flex-none" onClick={() => headerInputRef.current?.click()}>
                  <IconCamera size={12} />
                  Upload
                </button>
                <input ref={headerInputRef} type="file" accept="image/*" className="hidden" onChange={handleHeaderFile} />
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
                <button
                  type="button"
                  aria-label="Add a custom color"
                  onClick={() => colorPickerRef.current?.click()}
                  className="w-[26px] h-[26px] rounded-lg border border-dashed border-[var(--color-divider)] grid place-items-center text-[var(--color-neutral-500)] text-[13px] cursor-pointer hover:border-[var(--color-neutral-600)] transition-colors"
                >
                  +
                </button>
                <input
                  ref={colorPickerRef}
                  type="color"
                  className="hidden"
                  value={tenantAccent}
                  onChange={(e) => {
                    const color = e.target.value;
                    setCustomSwatches((prev) => (prev.includes(color) || baseSwatches.includes(color) ? prev : [...prev, color]));
                    setTenantAccent(color);
                  }}
                />
              </div>
            </div>
            <div className="field">
              <label>Custom domain (marketing/reference only)</label>
              <input className="input font-mono text-[12.5px]" value={domain} onChange={(e) => setDomain(e.target.value)} />
            </div>

            <div className="field">
              <label>Website template</label>
              <div className="flex flex-col gap-1.5">
                {templates.map((t) => (
                  <label
                    key={t.id}
                    className="flex items-start gap-2.5 p-2.5 rounded-lg border cursor-pointer"
                    style={{ borderColor: template === t.id ? tenantAccent : "var(--color-divider)", background: template === t.id ? `color-mix(in srgb, ${tenantAccent} 8%, transparent)` : "transparent" }}
                  >
                    <input type="radio" name="template" className="mt-0.5" checked={template === t.id} onChange={() => setTemplate(t.id)} />
                    <div>
                      <div className="text-[12.5px] font-medium">{t.name}</div>
                      <div className="text-[11px] text-[var(--color-neutral-500)] leading-[1.5]">{t.why}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="field">
              <label>Website address</label>
              <div className="flex items-center gap-1.5">
                <span className="text-[12px] text-[var(--color-neutral-500)] font-mono">origin.app/site/</span>
                <input
                  className="input font-mono text-[12.5px] flex-1"
                  value={siteSlug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    setSiteSlug(slugify(e.target.value));
                  }}
                />
              </div>
            </div>

            <div className="field">
              <label>What are clients paying for?</label>
              {paymentLinks.length > 0 ? (
                <select className="input text-[12.5px]" value={selectedLinkId} onChange={(e) => setSelectedLinkId(e.target.value)}>
                  <option value="">None</option>
                  {paymentLinks.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.title} · {(l.amount_cents / 100).toLocaleString(undefined, { style: "currency", currency: l.currency.toUpperCase() })}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="text-[11.5px] text-[var(--color-neutral-500)] leading-[1.6]">
                  No real payment links yet. <a href="/payments" style={{ color: "var(--color-accent-300)" }}>Create one on the Payments page</a>, then it'll show up here so the mini site can actually charge clients.
                </div>
              )}
            </div>
            <div className="field">
              <label>Documents to feature (their work, shown to clients)</label>
              <div className="flex flex-col gap-1">
                {documents.map((d) => (
                  <label key={d.id} className="flex items-center gap-2 text-[12.5px] py-0.5">
                    <input type="checkbox" checked={selectedDocIds.includes(d.id)} onChange={() => toggleDoc(d.id)} />
                    {d.title}
                  </label>
                ))}
                {documents.length === 0 && <div className="text-[11.5px] text-[var(--color-neutral-500)]">No documents yet.</div>}
              </div>
              {docFormOpen ? (
                <div className="flex flex-col gap-2 p-3 mt-2 rounded-lg border border-[var(--color-divider)]">
                  <input className="input text-[12.5px]" placeholder="Document title (e.g. Service Agreement)" value={docTitle} onChange={(e) => setDocTitle(e.target.value)} />
                  <textarea
                    className="input text-[12.5px]"
                    style={{ minHeight: 100 }}
                    placeholder="Paste or write what clients should read..."
                    value={docText}
                    onChange={(e) => setDocText(e.target.value)}
                  />
                  {docError && <div className="text-[11.5px]" style={{ color: "var(--color-accent-300)" }}>{docError}</div>}
                  <div className="flex gap-1.5">
                    <button className="btn btn-primary text-[12px] flex-none" onClick={createDocument} disabled={docSaving}>
                      {docSaving ? "Saving…" : "Save document"}
                    </button>
                    <button className="btn btn-secondary text-[12px] flex-none" onClick={() => setDocFormOpen(false)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <button className="btn btn-ghost text-[11.5px] self-start mt-1.5" onClick={() => setDocFormOpen(true)}>
                  + Add a document
                </button>
              )}
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
            {publishError && <div className="text-[11.5px]" style={{ color: "var(--color-accent-300)" }}>{publishError}</div>}
            <div className="flex gap-2 mt-0.5 flex-wrap items-center">
              <button className="btn btn-secondary text-[12.5px]" onClick={() => publishBranding()} disabled={publishing}>
                {publishing ? "Saving…" : "Save changes"}
              </button>
              <button
                className="btn btn-primary text-[12.5px]"
                onClick={() => publishBranding(!sitePublished)}
                disabled={publishing || !live}
              >
                {sitePublished ? <IconCheckCircle size={13} /> : <IconGlobe size={13} />}
                {sitePublished ? "Live · click to unpublish" : "Publish website"}
              </button>
              {sitePublished && (
                <a href={`/site/${siteSlug}`} target="_blank" rel="noopener noreferrer" className="btn btn-ghost text-[12.5px]">
                  View live site →
                </a>
              )}
              {publishedAt && (
                <span className="text-[11px] text-[var(--color-neutral-500)]">
                  {live ? `Saved at ${publishedAt}` : `Sign in to save this for real`}
                </span>
              )}
            </div>
            <a href="/templates" className="btn btn-ghost text-[12.5px] self-start">
              View branded invoice &amp; email templates →
            </a>
          </div>

          <div className="flex flex-col gap-2.5">
            <div className="text-[10.5px] tracking-[.08em] uppercase text-[var(--color-neutral-500)]">
              Preview · what your clients will see
            </div>
            <div className="border border-[var(--color-divider)] rounded-xl overflow-hidden">
              <div className="flex items-center gap-1.5 px-3 py-2 border-b border-[var(--color-divider)] bg-[var(--color-surface)]">
                <span className="w-2 h-2 rounded-full bg-[var(--color-neutral-700)]" />
                <span className="w-2 h-2 rounded-full bg-[var(--color-neutral-700)]" />
                <span className="w-2 h-2 rounded-full bg-[var(--color-neutral-700)]" />
                <span className="ml-2.5 font-mono text-[10.5px] text-[var(--color-neutral-500)]">origin.app/site/{siteSlug}</span>
              </div>

              {template === "ledger" ? (
                <div className="flex" style={{ background: "#0c0c10", color: "#f4f4f7" }}>
                  <div className="w-[110px] flex-none p-3 border-r flex flex-col gap-1" style={{ borderColor: "#1c1c22" }}>
                    <div className="flex items-center gap-1.5 pb-2">
                      {logoUrl ? <img src={logoUrl} alt="" className="w-4 h-4 rounded object-cover" /> : <span className="w-4 h-4 rounded grid place-items-center text-[8px]" style={{ background: tenantAccent, color: "#0c0c10" }}>{companyName.charAt(0)}</span>}
                      <span className="text-[10px] font-medium truncate">{companyName}</span>
                    </div>
                    <span className="px-1.5 py-1 rounded text-[9px]" style={{ color: tenantAccent, background: `color-mix(in srgb, ${tenantAccent} 14%, transparent)` }}>Overview</span>
                    <span className="px-1.5 py-1 text-[9px]" style={{ color: "#9a9aa4" }}>Documents</span>
                  </div>
                  <div className="flex-1 p-3.5 flex flex-col gap-2">
                    <div className="text-[11px] font-medium">Welcome back.</div>
                    {selectedDocIds.slice(0, 2).map((id) => (
                      <div key={id} className="text-[9.5px] p-1.5 rounded" style={{ background: "#141418" }}>{documents.find((d) => d.id === id)?.title}</div>
                    ))}
                  </div>
                </div>
              ) : template === "atrium" ? (
                <div style={{ background: "#0c0c10", color: "#f4f4f7" }}>
                  <div
                    className="h-[70px]"
                    style={headerImageUrl ? { backgroundImage: `url(${headerImageUrl})`, backgroundSize: "cover", backgroundPosition: "center" } : { background: `linear-gradient(160deg, color-mix(in srgb, ${tenantAccent} 30%, transparent), transparent)` }}
                  />
                  <div className="p-3.5 flex flex-col gap-1.5">
                    <div className="flex items-center gap-1.5">
                      {logoUrl ? <img src={logoUrl} alt="" className="w-4 h-4 rounded object-cover" /> : <span className="w-4 h-4 rounded grid place-items-center text-[8px]" style={{ background: tenantAccent, color: "#0c0c10" }}>{companyName.charAt(0)}</span>}
                      <span className="text-[10px] font-medium">{companyName}</span>
                    </div>
                    <div className="text-[12px] font-medium mt-1">{companyName}, all in one branded portal.</div>
                  </div>
                </div>
              ) : (
                <div className="flex bg-[var(--color-bg)]">
                  <div className="flex-1 p-3.5 flex flex-col gap-2.5 items-center text-center">
                    {logoUrl ? (
                      <img src={logoUrl} alt="" className="w-6 h-6 rounded-md object-cover" />
                    ) : (
                      <span className="w-6 h-6 rounded-md grid place-items-center text-[11px] font-medium" style={{ background: `color-mix(in srgb, ${tenantAccent} 18%, transparent)`, color: tenantAccent }}>
                        {companyName.trim().charAt(0).toUpperCase() || "A"}
                      </span>
                    )}
                    <div className="text-[12px] font-medium">Everything {companyName} clients need, in one place.</div>
                    {selectedLinkId && (
                      <span className="px-2.5 py-1 rounded-md text-[10px]" style={{ background: tenantAccent, color: "#0c0c10" }}>
                        Pay now
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="text-[10.5px] text-[var(--color-neutral-500)]">
              {sitePublished ? "This is live — anyone with the link can see it." : "Publish to make this a real, reachable page for your clients."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
