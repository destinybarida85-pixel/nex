"use client";

import { useEffect, useState } from "react";
import { IconGlobe } from "@/components/icons";
import { useHasSession } from "@/lib/useSession";
import { isBackendConfigured } from "@/lib/backendStatus";

const swatches = ["#63c3b2", "#d9a05b", "#7fa3e8", "#c98bd9"];

type PaymentLink = { id: string; title: string; amount_cents: number; currency: string; url: string };
type TenantDocument = { id: string; title: string; status: string };

export default function WhiteLabelPage() {
  const { hasSession, checked } = useHasSession();
  const [tenantAccent, setTenantAccent] = useState(swatches[0]);
  const [poweredBy, setPoweredBy] = useState(false);
  const [companyName, setCompanyName] = useState("Atlas Chambers");
  const [domain, setDomain] = useState("portal.atlaschambers.com");
  const [paymentLinks, setPaymentLinks] = useState<PaymentLink[]>([]);
  const [selectedLinkId, setSelectedLinkId] = useState("");
  const [documents, setDocuments] = useState<TenantDocument[]>([]);
  const [selectedDocId, setSelectedDocId] = useState("");
  const [docFormOpen, setDocFormOpen] = useState(false);
  const [docTitle, setDocTitle] = useState("");
  const [docText, setDocText] = useState("");
  const [docSaving, setDocSaving] = useState(false);
  const [docError, setDocError] = useState("");

  useEffect(() => {
    if (!checked || !isBackendConfigured || !hasSession) return;
    fetch("/api/stripe/payment-links")
      .then((r) => r.json())
      .then((data) => {
        if (data.configured && data.links) {
          setPaymentLinks(data.links);
          if (data.links.length > 0) setSelectedLinkId(data.links[0].id);
        }
      })
      .catch(() => {
        // Stay empty on any failure — the picker just shows the "create one" hint.
      });
    fetch("/api/documents")
      .then((r) => r.json())
      .then((data) => {
        if (data.configured && data.documents) {
          setDocuments(data.documents);
          if (data.documents.length > 0) setSelectedDocId(data.documents[0].id);
        }
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
    setSelectedDocId(data.document.id);
    setDocFormOpen(false);
    setDocTitle("");
    setDocText("");
    setDocSaving(false);
  }

  const selectedLink = paymentLinks.find((l) => l.id === selectedLinkId);

  const siteUrl =
    `/site-preview?name=${encodeURIComponent(companyName)}&color=${encodeURIComponent(tenantAccent)}&domain=${encodeURIComponent(domain)}&powered=${poweredBy ? "1" : "0"}` +
    (selectedLink
      ? `&product=${encodeURIComponent(selectedLink.title)}&price=${selectedLink.amount_cents}&currency=${selectedLink.currency}&payUrl=${encodeURIComponent(selectedLink.url)}`
      : "") +
    (selectedDocId ? `&docId=${encodeURIComponent(selectedDocId)}` : "");

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
                <span
                  className="w-9 h-9 rounded-[9px] grid place-items-center font-medium text-[15px]"
                  style={{ background: `color-mix(in srgb, ${tenantAccent} 18%, transparent)`, color: tenantAccent }}
                >
                  {companyName.trim().charAt(0).toUpperCase() || "A"}
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
              <input className="input font-mono text-[12.5px]" value={domain} onChange={(e) => setDomain(e.target.value)} />
            </div>
            <div className="field">
              <label>What are clients paying for?</label>
              {paymentLinks.length > 0 ? (
                <select className="input text-[12.5px]" value={selectedLinkId} onChange={(e) => setSelectedLinkId(e.target.value)}>
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
              <label>What document should clients see?</label>
              {documents.length > 0 && (
                <select className="input text-[12.5px]" value={selectedDocId} onChange={(e) => setSelectedDocId(e.target.value)}>
                  <option value="">None</option>
                  {documents.map((d) => (
                    <option key={d.id} value={d.id}>{d.title}</option>
                  ))}
                </select>
              )}
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
            <div className="flex gap-2 mt-0.5 flex-wrap">
              <button className="btn btn-primary text-[12.5px]">Publish branding</button>
              <a href={siteUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary text-[12.5px]">
                <IconGlobe size={13} />
                Create mini website
              </a>
            </div>
            <a href="/templates" className="btn btn-ghost text-[12.5px] self-start">
              View branded invoice &amp; email templates →
            </a>
          </div>

          <div className="flex flex-col gap-2.5">
            <div className="text-[10.5px] tracking-[.08em] uppercase text-[var(--color-neutral-500)]">
              Live preview: what your clients see
            </div>
            <div className="border border-[var(--color-divider)] rounded-xl overflow-hidden">
              <div className="flex items-center gap-1.5 px-3 py-2 border-b border-[var(--color-divider)] bg-[var(--color-surface)]">
                <span className="w-2 h-2 rounded-full bg-[var(--color-neutral-700)]" />
                <span className="w-2 h-2 rounded-full bg-[var(--color-neutral-700)]" />
                <span className="w-2 h-2 rounded-full bg-[var(--color-neutral-700)]" />
                <span className="ml-2.5 font-mono text-[10.5px] text-[var(--color-neutral-500)]">
                  {domain}
                </span>
              </div>
              <div className="flex bg-[var(--color-bg)]">
                <div className="w-[150px] flex-none p-[14px_10px] border-r border-[var(--color-divider)] flex flex-col gap-1.5">
                  <div className="flex items-center gap-[7px] px-1 pb-2">
                    <span
                      className="w-5 h-5 rounded-[6px] grid place-items-center text-[11px] font-medium"
                      style={{ background: `color-mix(in srgb, ${tenantAccent} 18%, transparent)`, color: tenantAccent }}
                    >
                      {companyName.trim().charAt(0).toUpperCase() || "A"}
                    </span>
                    <span className="text-xs font-medium">{companyName}</span>
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
