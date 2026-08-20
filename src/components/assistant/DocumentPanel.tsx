"use client";

import { useEffect, useRef, useState } from "react";
import { IconDocuments, IconDownload, IconESign, IconCamera, IconTemplates, IconCheckCircle } from "@/components/icons";
import DocumentPaper from "@/components/document/DocumentPaper";
import { documentAccents, documentLayouts, documentFonts, documentPaperTones, type DocumentLayout, type DocumentFont, type DocumentPaperTone } from "@/components/document/theme";
import TemplatePicker, { type TemplateChoice } from "@/components/document/TemplatePicker";

// A safety net independent of how well the AI behaved: whatever produced this
// document, an unfilled [Bracket] left in the final text means it isn't
// actually finished, and printing or sending it that way looks exactly like
// the failure mode this exists to catch — a blank-riddled template mistaken
// for a real document.
function findPlaceholders(doc: DocumentData): string[] {
  const pattern = /\[([^[\]]{1,60})\]/g;
  const found = new Set<string>();
  const scan = (text: string) => {
    for (const m of text.matchAll(pattern)) found.add(m[1]);
  };
  scan(doc.title);
  doc.body.forEach((s) => {
    scan(s.heading);
    scan(s.text);
  });
  return Array.from(found);
}

export type DocumentStep = { label: string; done: boolean };
export type DocumentData = {
  title: string;
  meta: string;
  status: string;
  statusTag: string;
  body: { heading: string; text: string }[];
  steps: DocumentStep[];
};

export default function DocumentPanel({
  document,
  onUpdate,
}: {
  document: DocumentData;
  onUpdate: (next: DocumentData) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<DocumentData>(document);
  const [accentColor, setAccentColor] = useState(documentAccents[0].color);
  const [layout, setLayout] = useState<DocumentLayout>("classic");
  const [font, setFont] = useState<DocumentFont>("auto");
  const [tone, setTone] = useState<DocumentPaperTone>("white");
  // Letterhead block for the premium layouts. Seeded from the tenant's real
  // name so it isn't blank on first use, then editable — most businesses want
  // their address and phone on a document they send out.
  const [organisation, setOrganisation] = useState("");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [showWatermark, setShowWatermark] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const [sentLink, setSentLink] = useState<string | null>(null);
  const [sentDocumentId, setSentDocumentId] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);
  const [emailTo, setEmailTo] = useState("");
  const [emailSending, setEmailSending] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  // Send options. Defaults match the old behaviour exactly — one signer, no
  // payment attached — so nothing changes for anyone who ignores this panel.
  const [signersRequired, setSignersRequired] = useState(1);
  const [sendToPartner, setSendToPartner] = useState(true);
  const [paymentLinkId, setPaymentLinkId] = useState("");
  const [payLinks, setPayLinks] = useState<{ id: string; title: string; amount_cents: number; currency: string }[]>([]);

  useEffect(() => {
    fetch("/api/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.configured && data.tenantName) setOrganisation((prev) => prev || data.tenantName);
      })
      .catch(() => {
        // Not signed in — the letterhead shows its placeholder instead.
      });
  }, []);

  useEffect(() => {
    fetch("/api/stripe/payment-links")
      .then((r) => r.json())
      .then((data) => {
        if (data.configured && data.links) setPayLinks(data.links.filter((l: { status: string }) => l.status === "active"));
      })
      .catch(() => {
        // Stripe not connected or not signed in — the picker just stays empty
        // and says so, rather than offering links that don't exist.
      });
  }, []);

  useEffect(() => {
    if (!editing) setDraft(document);
  }, [document, editing]);

  function startEditing() {
    setDraft(document);
    setEditing(true);
  }

  function saveEditing() {
    onUpdate(draft);
    setEditing(false);
  }

  function cancelEditing() {
    setDraft(document);
    setEditing(false);
  }

  function updateSection(index: number, field: "heading" | "text", value: string) {
    setDraft((prev) => ({
      ...prev,
      body: prev.body.map((section, i) => (i === index ? { ...section, [field]: value } : section)),
    }));
  }

  async function handleLogoFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    setLogoUploading(true);
    setSendError("");
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Upload failed.");
      setLogoUrl(data.url);
    } catch (err) {
      setSendError(err instanceof Error ? err.message : "Couldn't upload that logo.");
    } finally {
      setLogoUploading(false);
    }
  }

  function applyTemplate({ template, layout: pickedLayout, accentColor: pickedAccent }: TemplateChoice) {
    setLayout(pickedLayout);
    setAccentColor(pickedAccent);
    onUpdate({
      title: template.title,
      meta: template.meta,
      status: "Draft",
      statusTag: "tag-outline",
      body: template.sections.map((s) => ({ heading: s.heading, text: s.text })),
      steps: [
        { label: "Drafted", done: true },
        { label: "Sent for signature", done: false },
        { label: "Signed & sealed", done: false },
      ],
    });
    setEditing(false);
    setPickerOpen(false);
  }

  async function sendForSignature() {
    setSending(true);
    setSendError("");
    setSentLink(null);
    setSentDocumentId(null);
    setLinkCopied(false);
    setEmailSent(false);
    setEmailError("");
    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: document.title,
          sections: document.body,
          layout,
          font,
          tone,
          organisation,
          accentColor,
          logoUrl,
          watermarkUrl: showWatermark ? logoUrl : null,
          signersRequired,
          paymentLinkId: paymentLinkId || null,
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Couldn't create a shareable link.");
      setSentDocumentId(data.document.id);
      setSentLink(`${window.location.origin}/sign/${data.document.id}`);
    } catch (err) {
      setSendError(err instanceof Error ? err.message : "Couldn't create a shareable link.");
    } finally {
      setSending(false);
    }
  }

  async function copyLink() {
    if (!sentLink) return;
    try {
      await navigator.clipboard.writeText(sentLink);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      // Clipboard API unavailable — the link is still shown and selectable.
    }
  }

  async function emailDocument() {
    if (!sentDocumentId || !sentLink || !emailTo.trim()) return;
    setEmailSending(true);
    setEmailError("");
    setEmailSent(false);
    try {
      const res = await fetch(`/api/documents/${sentDocumentId}/send-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: emailTo.trim(), link: sentLink }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Couldn't send that email.");
      setEmailSent(true);
      setEmailTo("");
    } catch (err) {
      setEmailError(err instanceof Error ? err.message : "Couldn't send that email.");
    } finally {
      setEmailSending(false);
    }
  }

  const shown = editing ? draft : document;
  const isLetterheadLayout = layout === "executive" || layout === "letterhead" || layout === "editorial";
  const placeholders = findPlaceholders(shown);

  return (
    <div className="flex-1 min-w-0 flex flex-col">
      <div className="flex items-center gap-3 px-4 md:px-6 py-4 border-b border-[var(--color-divider)] flex-wrap">
        <IconDocuments size={16} className="text-[var(--color-accent)]" />
        <div className="card-title text-[14px]">Document</div>
        <span className={`tag ${shown.statusTag} ml-auto`}>{editing ? "Editing" : shown.status}</span>
        <button className="btn btn-secondary text-[13px] no-print" onClick={() => setPickerOpen(true)}>
          <IconTemplates size={13} />
          Templates
        </button>
        <button className="btn btn-icon btn-secondary" aria-label="Print document" onClick={() => window.print()}>
          <IconDownload size={14} />
        </button>
      </div>

      {placeholders.length > 0 && (
        <div
          className="no-print mx-4 md:mx-6 mt-4 px-3.5 py-2.5 rounded-lg text-[13px] flex items-start gap-2"
          style={{ background: "color-mix(in srgb, var(--color-accent-900) 45%, transparent)", border: "1px solid var(--color-accent-900)", color: "var(--color-accent-300)" }}
        >
          <span className="flex-1">
            {placeholders.length === 1 ? "1 blank still needs filling" : `${placeholders.length} blanks still need filling`} before this is
            ready to print or send: {placeholders.slice(0, 6).map((p) => `[${p}]`).join(", ")}
            {placeholders.length > 6 ? ", …" : ""}
          </span>
          <button className="btn btn-secondary text-[11px] flex-none" style={{ padding: "3px 9px" }} onClick={startEditing}>
            Fill them in
          </button>
        </div>
      )}

      {pickerOpen && <TemplatePicker onPick={applyTemplate} onClose={() => setPickerOpen(false)} />}

      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6 flex flex-col md:flex-row gap-6">
        {editing ? (
          <div className="flex-1 min-w-0 max-w-[620px]">
            <DocumentPaper
              title={draft.title}
              meta={draft.meta}
              sections={draft.body}
              accentColor={accentColor}
              layout={layout}
              font={font}
              tone={tone}
              organisation={organisation}
              logoUrl={logoUrl}
              watermarkUrl={showWatermark ? logoUrl : null}
              editable
              onTitleChange={(v) => setDraft((prev) => ({ ...prev, title: v }))}
              onMetaChange={(v) => setDraft((prev) => ({ ...prev, meta: v }))}
              onSectionChange={updateSection}
            />
          </div>
        ) : (
          <div className="flex-1 min-w-0 max-w-[620px] print-area">
            <DocumentPaper title={shown.title} meta={shown.meta} sections={shown.body} accentColor={accentColor} layout={layout} font={font} tone={tone} organisation={organisation} logoUrl={logoUrl} watermarkUrl={showWatermark ? logoUrl : null} />
          </div>
        )}

        <div className="w-full md:w-[220px] flex-none flex flex-col gap-4">
          <div className="card elev-sm gap-2.5 p-4">
            <div className="card-title text-[14px]">Signing status</div>
            <div className="flex flex-col gap-2.5 mt-1">
              {document.steps.map((step, i) => (
                <div key={step.label} className="flex items-center gap-2.5 text-[13px]">
                  <span
                    className="w-[7px] h-[7px] rounded-full flex-none"
                    style={{ background: step.done ? "var(--color-accent)" : "var(--color-neutral-700)" }}
                  />
                  <span style={{ color: step.done ? "var(--color-text)" : "var(--color-neutral-500)" }}>{step.label}</span>
                  {i < document.steps.length - 1 && (
                    <span className="flex-1 h-px" style={{ background: "var(--color-divider)" }} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="card elev-sm gap-2.5 p-4 no-print">
            <div className="card-title text-[14px]">Document style</div>
            <select className="input text-[11.5px]" value={layout} onChange={(e) => setLayout(e.target.value as DocumentLayout)}>
              {documentLayouts.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.premium ? `★ ${l.label}` : l.label}
                </option>
              ))}
            </select>
            {isLetterheadLayout && (
              <div className="flex flex-col gap-1">
                <input
                  className="input text-[11px]"
                  placeholder="Acme Ltd · 12 Broad St, Lagos · hello@acme.com"
                  value={organisation}
                  onChange={(e) => setOrganisation(e.target.value)}
                />
                <span className="text-[10px]" style={{ color: "var(--color-neutral-500)" }}>
                  Letterhead line — separate name, address and contact with ·
                </span>
              </div>
            )}
            <select className="input text-[11.5px]" value={font} onChange={(e) => setFont(e.target.value as DocumentFont)}>
              {documentFonts.map((f) => (
                <option key={f.id} value={f.id}>{f.label}</option>
              ))}
            </select>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] text-[var(--color-neutral-500)]">Page colour</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {documentPaperTones.map((t) => (
                  <button
                    key={t.id}
                    aria-label={t.label}
                    title={t.label}
                    onClick={() => setTone(t.id)}
                    className="w-[18px] h-[18px] rounded-md cursor-pointer"
                    style={{
                      background: t.bg,
                      border: "1px solid var(--color-divider)",
                      outline: tone === t.id ? "2px solid var(--color-text)" : "none",
                      outlineOffset: 2,
                    }}
                  />
                ))}
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              {documentAccents.map((a) => (
                <button
                  key={a.id}
                  aria-label={a.label}
                  onClick={() => setAccentColor(a.color)}
                  className="w-[18px] h-[18px] rounded-md cursor-pointer"
                  style={{ background: a.color, outline: accentColor === a.color ? "2px solid var(--color-text)" : "none", outlineOffset: 2 }}
                />
              ))}
              {/* Any colour, not just the four presets — a business whose brand
                  colour isn't in the list shouldn't have to settle for close. */}
              <label
                className="w-[18px] h-[18px] rounded-md cursor-pointer grid place-items-center flex-none"
                title="Custom colour"
                style={{
                  border: "1px dashed var(--color-neutral-600)",
                  outline: documentAccents.some((a) => a.color === accentColor) ? "none" : "2px solid var(--color-text)",
                  outlineOffset: 2,
                  background: documentAccents.some((a) => a.color === accentColor) ? "transparent" : accentColor,
                }}
              >
                <input
                  type="color"
                  aria-label="Custom document colour"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="opacity-0 w-full h-full cursor-pointer"
                />
              </label>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[11px] text-[var(--color-neutral-500)] flex-1">
                {logoUploading ? "Uploading…" : logoUrl ? "Logo added" : "No letterhead logo (optional)"}
              </span>
              <button className="btn btn-secondary text-[10.5px] flex-none" onClick={() => logoInputRef.current?.click()} disabled={logoUploading}>
                <IconCamera size={11} />
                {logoUploading ? "…" : logoUrl ? "Replace" : "Add"}
              </button>
              <input ref={logoInputRef} type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif" className="hidden" onChange={handleLogoFile} />
            </div>
            {logoUrl && (
              <label className="radio gap-2 text-[11.5px] pt-1">
                <input type="checkbox" checked={showWatermark} onChange={(e) => setShowWatermark(e.target.checked)} />
                <span className="dot" style={{ borderRadius: 5 }} />
                Watermark this logo behind the page
              </label>
            )}
          </div>

          {editing ? (
            <>
              <button className="btn btn-primary btn-block text-[13.5px]" onClick={saveEditing}>
                Save changes
              </button>
              <button className="btn btn-secondary btn-block text-[13.5px]" onClick={cancelEditing}>
                Cancel
              </button>
            </>
          ) : (
            <>
              <div className="card elev-sm gap-2.5 p-4 no-print">
                <div className="card-title text-[14px]">Before you send</div>

                <div className="flex flex-col gap-1">
                  <span className="text-[11px] text-[var(--color-neutral-500)]">Who signs?</span>
                  <select
                    className="input text-[11.5px]"
                    value={signersRequired}
                    onChange={(e) => setSignersRequired(Number(e.target.value))}
                  >
                    <option value={1}>One person signs</option>
                    <option value={2}>Two people sign (both parties)</option>
                  </select>
                  {signersRequired === 2 && (
                    <span className="text-[10.5px]" style={{ color: "var(--color-neutral-500)" }}>
                      Both sign from the same link — whoever opens it first signs first.
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-1 pt-1">
                  <span className="text-[11px] text-[var(--color-neutral-500)]">Ask for payment? (optional)</span>
                  {payLinks.length === 0 ? (
                    <span className="text-[10.5px]" style={{ color: "var(--color-neutral-500)" }}>
                      No payment links yet —{" "}
                      <a href="/payments" style={{ color: "var(--color-accent-300)" }}>create one</a>{" "}to attach it here.
                    </span>
                  ) : (
                    <select className="input text-[11.5px]" value={paymentLinkId} onChange={(e) => setPaymentLinkId(e.target.value)}>
                      <option value="">No payment</option>
                      {payLinks.map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.title} · {(l.amount_cents / 100).toLocaleString("en-US", { style: "currency", currency: l.currency.toUpperCase() })}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <label className="radio gap-2 text-[11.5px] pt-1">
                  <input type="checkbox" checked={sendToPartner} onChange={(e) => setSendToPartner(e.target.checked)} />
                  <span className="dot" style={{ borderRadius: 5 }} />
                  Share this with someone else
                </label>
                {!sendToPartner && (
                  <span className="text-[10.5px]" style={{ color: "var(--color-neutral-500)" }}>
                    Keeping it private — the link still exists, it just isn&rsquo;t shown for sharing. You can sign
                    it yourself from the Open button.
                  </span>
                )}
              </div>

              <button className="btn btn-primary btn-block text-[13.5px]" onClick={sendForSignature} disabled={sending}>
                <IconESign size={14} />
                {sending ? "Creating link…" : sendToPartner ? "Create signing link" : "Save & sign myself"}
              </button>
              {sendError && <div className="text-[11px]" style={{ color: "var(--color-accent-300)" }}>{sendError}</div>}
              {sentLink && (
                <div className="card elev-sm gap-2 p-3">
                  <div className="flex items-center gap-1.5 text-[11.5px] font-medium" style={{ color: "#63c3b2" }}>
                    <IconCheckCircle size={13} />
                    {sendToPartner
                      ? `Real link — ${signersRequired === 2 ? "both parties" : "anyone who opens it"} can review and sign`
                      : "Saved. Only you have this link."}
                  </div>
                  {sendToPartner && (
                    <div className="text-[10.5px] font-mono break-all" style={{ color: "var(--color-neutral-400)" }}>{sentLink}</div>
                  )}
                  <div className="flex gap-1.5">
                    {sendToPartner && (
                      <button className="btn btn-secondary text-[11px] flex-1" onClick={copyLink}>
                        {linkCopied ? "Copied!" : "Copy link"}
                      </button>
                    )}
                    <a href={sentLink} target="_blank" rel="noopener noreferrer" className="btn btn-ghost text-[11px] flex-1">
                      {sendToPartner ? "Open" : "Sign it now"}
                    </a>
                  </div>
                  {sendToPartner && (
                    <div className="flex flex-col gap-1.5 pt-1.5 mt-1 border-t" style={{ borderColor: "var(--color-divider)" }}>
                      <span className="text-[10.5px] text-[var(--color-neutral-500)]">Or email it directly — no separate mail app needed</span>
                      <div className="flex gap-1.5">
                        <input
                          className="input text-[11px] flex-1"
                          type="email"
                          placeholder="recipient@company.com"
                          value={emailTo}
                          onChange={(e) => setEmailTo(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && emailDocument()}
                        />
                        <button className="btn btn-secondary text-[11px] flex-none" onClick={emailDocument} disabled={emailSending || !emailTo.trim()}>
                          {emailSending ? "Sending…" : "Send"}
                        </button>
                      </div>
                      {emailSent && <span className="text-[10.5px]" style={{ color: "#63c3b2" }}>Sent.</span>}
                      {emailError && <span className="text-[10.5px]" style={{ color: "var(--color-accent-300)" }}>{emailError}</span>}
                    </div>
                  )}
                </div>
              )}
              <button className="btn btn-secondary btn-block text-[13.5px]" onClick={startEditing}>
                Edit document
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
