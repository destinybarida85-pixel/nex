"use client";

import { useRef, useState } from "react";
import { IconCheckCircle, IconDownload, IconEdit, IconChevronDown, IconCamera } from "@/components/icons";

import Stamp, { stampShapes, type StampShape } from "./Stamp";
import { demoDocument, type SignDocument } from "./document";
import DocumentPaper from "@/components/document/DocumentPaper";
import SignatureBlock from "@/components/document/SignatureBlock";
import type { DocumentLayout } from "@/components/document/theme";
import type { SignatureProof } from "./SignFlow";

const stampColors = ["#c81e1e", "#9184d9", "#63c3b2", "#d9a05b", "#5b8fd9", "#8a8a94", "#c96bb0", "#4fae7a"];

const today = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

// defaultShape mirrors what each of these actually looks like in the wild —
// a notary or embossing seal is wax/pressed, a "PAID"/"CONFIDENTIAL" is a
// rubber rectangle, an approval/inspection mark is a starred quality badge —
// but it's only ever a suggestion: shape and type stay independently
// editable, same pattern as document layout vs. template.
const stampTypes: { id: string; name: string; label: string; sub: string; defaultShape: StampShape }[] = [
  { id: "official", name: "Official Stamp", label: "SEALED", sub: "PRIMUE E-SIGN", defaultShape: "round" },
  { id: "company", name: "Company Stamp", label: "COMPANY", sub: "AUTHORIZED", defaultShape: "badge" },
  { id: "signature", name: "Signature Stamp", label: "SIGNED", sub: "REPRODUCTION", defaultShape: "round" },
  { id: "date", name: "Date Stamp", label: today.toUpperCase(), sub: "DATE STAMPED", defaultShape: "rectangle" },
  { id: "received", name: "Received Stamp", label: "RECEIVED", sub: today.toUpperCase(), defaultShape: "rectangle" },
  { id: "paid", name: "Paid Stamp", label: "PAID", sub: "PAYMENT COMPLETE", defaultShape: "rectangle" },
  { id: "ctc", name: "Certified True Copy", label: "CERTIFIED", sub: "TRUE COPY", defaultShape: "badge" },
  { id: "notary", name: "Notary Stamp/Seal", label: "NOTARIZED", sub: "NOTARY SEAL", defaultShape: "wax" },
  { id: "name", name: "Name Stamp", label: "NAME", sub: "TITLE", defaultShape: "round" },
  { id: "round_seal", name: "Round/Common Seal", label: "SEAL", sub: "COMMON SEAL", defaultShape: "round" },
  { id: "logo", name: "Logo Stamp", label: "LOGO", sub: "", defaultShape: "round" },
  { id: "inspection", name: "Inspection Stamp", label: "INSPECTED", sub: "QUALITY PASSED", defaultShape: "badge" },
  { id: "approval", name: "Approval Stamp", label: "APPROVED", sub: today.toUpperCase(), defaultShape: "badge" },
  { id: "rejected", name: "Rejected/Cancelled", label: "REJECTED", sub: "VOIDED", defaultShape: "rectangle" },
  { id: "confidential", name: "Confidential Stamp", label: "CONFIDENTIAL", sub: "RESTRICTED", defaultShape: "rectangle" },
  { id: "customs", name: "Customs/Border Stamp", label: "CLEARED", sub: "CUSTOMS", defaultShape: "rectangle" },
  { id: "postal", name: "Postal Stamp", label: "POSTAGE", sub: "", defaultShape: "round" },
  { id: "embossing", name: "Embossing Seal", label: "EMBOSSED", sub: "OFFICIAL SEAL", defaultShape: "wax" },
];

type StampPosition = "footer" | "header" | "custom";
const positions: { id: StampPosition; label: string }[] = [
  { id: "footer", label: "Next to the signature" },
  { id: "header", label: "In the document header" },
  { id: "custom", label: "Anywhere — drag to place" },
];

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function CompleteStep({
  document = demoDocument,
  signature,
  signerName,
  proof,
  sealing,
  signed = true,
  applyStamp: applyStampOption = true,
  accentColor,
  layout,
}: {
  document?: SignDocument;
  signature: string;
  signerName?: string;
  proof: SignatureProof | null;
  sealing: boolean;
  signed?: boolean;
  applyStamp?: boolean;
  accentColor: string;
  layout: DocumentLayout;
}) {
  const [stampTypeId, setStampTypeId] = useState("official");
  const stampType = stampTypes.find((t) => t.id === stampTypeId) || stampTypes[0];
  const [stampLabel, setStampLabel] = useState(stampType.label);
  const [stampSub, setStampSub] = useState(stampType.sub);
  const [stampShape, setStampShape] = useState<StampShape>(stampType.defaultShape);
  const [stampColor, setStampColor] = useState(stampColors[0]);
  const [stampPosition, setStampPosition] = useState<StampPosition>("footer");
  const [stampX, setStampX] = useState(82);
  const [stampY, setStampY] = useState(90);
  const [dragging, setDragging] = useState(false);
  const [stampImageUrl, setStampImageUrl] = useState<string | null>(null);
  const [rightsConfirmed, setRightsConfirmed] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [editingStamp, setEditingStamp] = useState(false);
  const [buyingCredits, setBuyingCredits] = useState(false);
  const [showAudit, setShowAudit] = useState(false);

  const stampBlocked = signed && applyStampOption && proof && !proof.stampApplied;
  const showStamp = signed && applyStampOption;

  function selectStampType(id: string) {
    const t = stampTypes.find((s) => s.id === id) || stampTypes[0];
    setStampTypeId(id);
    setStampLabel(t.label);
    setStampSub(t.sub);
    setStampShape(t.defaultShape);
  }

  async function handleImageFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    setStampImageUrl(await readAsDataUrl(file));
  }

  async function buyCredits() {
    setBuyingCredits(true);
    try {
      const res = await fetch("/api/billing/stamp-credits", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
        return;
      }
    } catch {
      // Stay on the page — the button just goes back to normal.
    }
    setBuyingCredits(false);
  }

  function clampPercent(v: number) {
    return Math.max(8, Math.min(92, v));
  }

  function stampPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (stampPosition !== "custom" || !editingStamp) return;
    e.preventDefault();
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function stampPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragging) return;
    const rect = e.currentTarget.parentElement?.getBoundingClientRect();
    if (!rect) return;
    setStampX(clampPercent(((e.clientX - rect.left) / rect.width) * 100));
    setStampY(clampPercent(((e.clientY - rect.top) / rect.height) * 100));
  }

  function stampPointerUp() {
    setDragging(false);
  }

  const embeddedStampNode = showStamp && !stampBlocked ? <Stamp label={stampLabel} sub={stampSub} color={stampColor} imageUrl={stampImageUrl} size={72} shape={stampShape} /> : null;

  const headerStamp = stampPosition === "header" ? embeddedStampNode : null;
  const footerStamp = stampPosition === "footer" ? embeddedStampNode : null;
  const overlayStamp =
    stampPosition === "custom" && embeddedStampNode ? (
      <div
        onPointerDown={stampPointerDown}
        onPointerMove={stampPointerMove}
        onPointerUp={stampPointerUp}
        style={{
          position: "absolute",
          left: `${stampX}%`,
          top: `${stampY}%`,
          transform: "translate(-50%, -50%)",
          touchAction: "none",
          cursor: editingStamp ? (dragging ? "grabbing" : "grab") : "default",
        }}
      >
        {embeddedStampNode}
      </div>
    ) : null;

  const signedDateLabel = proof?.signedAt
    ? new Date(proof.signedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : undefined;
  const signatureBlockNode =
    signed && signature ? <SignatureBlock signature={signature} signerName={signerName || "Signed electronically"} dateLabel={signedDateLabel} /> : null;

  // Only two events are ever actually tracked — when the document row was
  // created and when it was signed. Everything else this used to show
  // ("Sent to signer", "Viewed by...", "Identity verified · OTP") was
  // fabricated and didn't correspond to anything the app does, including an
  // OTP step that no longer exists in this flow at all.
  function formatAuditTime(iso: string) {
    const d = new Date(iso);
    return `${d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} · ${d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`;
  }
  const audit: { label: string; meta: string }[] = [];
  if (document.createdAt) audit.push({ label: "Drafted", meta: formatAuditTime(document.createdAt) });
  if (proof?.signedAt) audit.push({ label: "Signed & sealed", meta: formatAuditTime(proof.signedAt) });

  const footerSlot =
    signatureBlockNode || footerStamp ? (
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>{signatureBlockNode}</div>
        {footerStamp}
      </div>
    ) : undefined;

  return (
    <div className="flex flex-col items-center gap-5 text-center">
      <span
        className="w-14 h-14 rounded-full grid place-items-center"
        style={{ color: "var(--color-accent)", background: "color-mix(in srgb, var(--color-accent-900) 65%, transparent)" }}
      >
        <IconCheckCircle size={30} />
      </span>
      <div>
        <h4 className="m-0 text-[19px]">{signed ? "Document signed and sealed" : "Document reviewed and completed"}</h4>
        <div className="text-[12.5px] text-[var(--color-neutral-500)] mt-1.5 max-w-[320px]">
          {signed
            ? `${document.title} has been signed and sealed with a tamper-evident certificate.`
            : `${document.title} has been marked reviewed and completed — no signature was required.`}
        </div>
      </div>

      <div className="print-area w-full flex flex-col gap-5 items-center text-center" style={{ padding: 4 }}>
        <div className="rounded-xl overflow-hidden w-full">
          <DocumentPaper
            title={document.title}
            sections={document.sections}
            accentColor={accentColor}
            layout={layout}
            font={document.font}
            tone={document.tone}
            organisation={document.organisation ?? undefined}
            logoUrl={document.logoUrl}
            headerRight={headerStamp}
            footerSlot={footerSlot}
            overlay={overlayStamp}
          />
        </div>

        {signed && (
          <div className="card elev-sm w-full text-left gap-2.5 p-4 relative overflow-visible">
            {showStamp && (
              <div className="no-print flex items-center justify-between gap-3 flex-wrap">
                {stampBlocked ? (
                  <>
                    <span className="text-[11px] text-[var(--color-neutral-500)]">Out of stamp credits — the seal is skipped on this document.</span>
                    <button className="btn btn-primary text-[10.5px] flex-none" onClick={buyCredits} disabled={buyingCredits}>
                      {buyingCredits ? "…" : "Buy 10 credits · $9"}
                    </button>
                  </>
                ) : (
                  <>
                    <span className="text-[11px] text-[var(--color-neutral-500)]">
                      Stamp is live on the document — {positions.find((p) => p.id === stampPosition)?.label.toLowerCase()}.
                    </span>
                    <button className="btn btn-secondary text-[10.5px] flex-none" onClick={() => setEditingStamp((v) => !v)}>
                      <IconEdit size={11} />
                      {editingStamp ? "Close" : "Edit stamp"}
                    </button>
                  </>
                )}
              </div>
            )}

            {editingStamp && !stampBlocked && showStamp && (
              <div className="no-print flex flex-col gap-2.5 p-3 rounded-lg border" style={{ borderColor: "var(--color-divider)" }}>
                <select className="input text-[12px]" value={stampTypeId} onChange={(e) => selectStampType(e.target.value)}>
                  {stampTypes.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
                <div className="flex gap-1.5">
                  {stampShapes.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      title={s.label}
                      onClick={() => setStampShape(s.id)}
                      className="flex-1 flex flex-col items-center gap-1 py-1.5 rounded-lg cursor-pointer text-[9.5px]"
                      style={{
                        border: `1px solid ${stampShape === s.id ? "var(--color-accent)" : "var(--color-divider)"}`,
                        color: stampShape === s.id ? "var(--color-accent-300)" : "var(--color-neutral-500)",
                        background: stampShape === s.id ? "color-mix(in srgb, var(--color-accent-900) 45%, transparent)" : "transparent",
                      }}
                    >
                      {/* mix-blend-mode:multiply (real "ink on paper") only
                          reads correctly against a light backing — against
                          this panel's dark surface it multiplies toward
                          black and the swatch nearly disappears. A small
                          white chip behind the preview only, matching what
                          the stamp actually sits on in the document. */}
                      {/* Fixed width accommodates the rectangle shape, which
                          renders 1.7x wider than tall at any given size — a
                          square chip would either clip it or force every
                          other shape down to fit its width. */}
                      <span className="rounded-md grid place-items-center overflow-hidden" style={{ width: 48, height: 34, background: "#fff" }}>
                        <Stamp label={stampLabel.slice(0, 6) || "SEAL"} sub="" color={stampColor} size={28} shape={s.id} />
                      </span>
                      {s.label}
                    </button>
                  ))}
                </div>
                <select className="input text-[12px]" value={stampPosition} onChange={(e) => setStampPosition(e.target.value as StampPosition)}>
                  {positions.map((p) => (
                    <option key={p.id} value={p.id}>{p.label}</option>
                  ))}
                </select>
                {stampPosition === "custom" && (
                  <div className="text-[11px] italic" style={{ color: "var(--color-accent-300)" }}>
                    Drag the stamp on the document above to place it anywhere on the page.
                  </div>
                )}
                <div className="grid grid-cols-2 gap-2">
                  <input className="input text-[12px]" placeholder="Main text" value={stampLabel} onChange={(e) => setStampLabel(e.target.value.toUpperCase().slice(0, 14))} />
                  <input className="input text-[12px]" placeholder="Sub text" value={stampSub} onChange={(e) => setStampSub(e.target.value.toUpperCase().slice(0, 20))} />
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] text-[var(--color-neutral-500)]">Color</span>
                  {stampColors.map((c) => (
                    <button
                      key={c}
                      aria-label={`Use ${c}`}
                      onClick={() => setStampColor(c)}
                      className="w-[18px] h-[18px] rounded-md cursor-pointer"
                      style={{ background: c, outline: stampColor === c ? "2px solid var(--color-text)" : "none", outlineOffset: 2 }}
                    />
                  ))}
                </div>

                <div className="flex flex-col gap-1.5 pt-1.5 border-t" style={{ borderColor: "var(--color-divider)" }}>
                  <label className="flex items-start gap-2 text-[11px] text-[var(--color-neutral-400)]">
                    <input type="checkbox" checked={rightsConfirmed} onChange={(e) => setRightsConfirmed(e.target.checked)} className="mt-0.5" />
                    I confirm I have the right to use the image I upload on this stamp.
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      className="btn btn-secondary text-[11px]"
                      style={{ padding: "4px 9px" }}
                      disabled={!rightsConfirmed}
                      onClick={() => imageInputRef.current?.click()}
                    >
                      <IconCamera size={11} />
                      {stampImageUrl ? "Replace image" : "Add image"}
                    </button>
                    {stampImageUrl && (
                      <button className="btn btn-ghost text-[11px]" style={{ padding: "4px 9px" }} onClick={() => setStampImageUrl(null)}>
                        Remove
                      </button>
                    )}
                    <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageFile} />
                  </div>
                </div>

                <button className="btn btn-secondary text-[11px] self-end" style={{ padding: "4px 9px" }} onClick={() => setEditingStamp(false)}>
                  Done
                </button>
              </div>
            )}

            {showStamp && proof && !stampBlocked && proof.stampCreditsRemaining !== null && (
              <div className="text-[10.5px] no-print text-[var(--color-neutral-500)]">
                {proof.stampCreditsRemaining} stamp {proof.stampCreditsRemaining === 1 ? "credit" : "credits"} left ·{" "}
                <a href="/stamps" style={{ color: "var(--color-accent-300)" }}>view stamp history</a>
              </div>
            )}

            {proof && (
              <div
                className="text-[10.5px] no-print flex items-center gap-1.5 pt-2 mt-1 border-t border-[var(--color-divider)]"
                style={{ color: proof.persisted ? "#63c3b2" : "var(--color-neutral-500)" }}
              >
                <IconCheckCircle size={11} />
                {proof.persisted
                  ? "Independently verifiable: stored server-side in the signatures ledger."
                  : "Computed live from the document and signature. Connect a database to make this independently verifiable."}
              </div>
            )}
          </div>
        )}

        {audit.length > 0 && (
          <div className="card elev-sm w-full text-left no-print">
            <button
              className="w-full flex items-center gap-2 p-4 cursor-pointer"
              style={{ background: "transparent", border: "none", color: "inherit" }}
              onClick={() => setShowAudit((v) => !v)}
            >
              <span className="card-title text-[13px]">Audit trail</span>
              <span className="text-[11px] text-[var(--color-neutral-500)] ml-auto">{showAudit ? "Hide" : "Show"}</span>
              <span style={{ transform: showAudit ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                <IconChevronDown size={13} className="text-[var(--color-neutral-500)]" />
              </span>
            </button>
            {showAudit && (
              <div className="flex flex-col gap-2.5 px-4 pb-4">
                {audit.map((a) => (
                  <div key={a.label} className="flex items-center gap-2.5 text-[12px]">
                    <span className="w-[7px] h-[7px] rounded-full flex-none" style={{ background: "var(--color-accent)" }} />
                    <span className="flex-1">{a.label}</span>
                    <span className="text-[var(--color-neutral-500)] font-mono text-[10.5px]">{a.meta}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <button className="btn btn-primary btn-block" onClick={() => window.print()}>
        <IconDownload size={14} />
        Print / Save as PDF
      </button>
      <a href="/signatures" className="btn btn-secondary btn-block" style={{ marginTop: 0 }}>
        View signature history
      </a>
      <a href="/dashboard" className="btn btn-ghost btn-block" style={{ marginTop: 0 }}>
        Back to dashboard
      </a>
    </div>
  );
}
