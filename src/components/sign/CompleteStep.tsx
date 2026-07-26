"use client";

import { useRef, useState } from "react";
import { IconCheckCircle, IconLock, IconDownload, IconEdit, IconChevronDown, IconCamera } from "@/components/icons";

import Stamp from "./Stamp";
import { demoDocument, type SignDocument } from "./document";
import DocumentPaper from "@/components/document/DocumentPaper";
import type { SignatureProof } from "@/app/sign/page";

const audit = [
  { label: "Drafted", meta: "Jul 18, 2026 · 09:14" },
  { label: "Sent to signer", meta: "Jul 18, 2026 · 09:16" },
  { label: "Viewed by Halcyon Ventures", meta: "Jul 21, 2026 · 08:42" },
  { label: "Identity verified · OTP", meta: "Jul 21, 2026 · 08:44" },
  { label: "Signed & sealed", meta: "Jul 21, 2026 · 08:45" },
];

const stampColors = ["#9184d9", "#63c3b2", "#d9a05b", "#e0665f", "#5b8fd9", "#8a8a94", "#c96bb0", "#4fae7a"];

const today = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

const stampTypes: { id: string; name: string; label: string; sub: string }[] = [
  { id: "official", name: "Official Stamp", label: "SEALED", sub: "ORIGIN E-SIGN" },
  { id: "company", name: "Company Stamp", label: "COMPANY", sub: "AUTHORIZED" },
  { id: "signature", name: "Signature Stamp", label: "SIGNED", sub: "REPRODUCTION" },
  { id: "date", name: "Date Stamp", label: today.toUpperCase(), sub: "DATE STAMPED" },
  { id: "received", name: "Received Stamp", label: "RECEIVED", sub: today.toUpperCase() },
  { id: "paid", name: "Paid Stamp", label: "PAID", sub: "PAYMENT COMPLETE" },
  { id: "ctc", name: "Certified True Copy", label: "CERTIFIED", sub: "TRUE COPY" },
  { id: "notary", name: "Notary Stamp/Seal", label: "NOTARIZED", sub: "NOTARY SEAL" },
  { id: "name", name: "Name Stamp", label: "NAME", sub: "TITLE" },
  { id: "round_seal", name: "Round/Common Seal", label: "SEAL", sub: "COMMON SEAL" },
  { id: "logo", name: "Logo Stamp", label: "LOGO", sub: "" },
  { id: "inspection", name: "Inspection Stamp", label: "INSPECTED", sub: "QUALITY PASSED" },
  { id: "approval", name: "Approval Stamp", label: "APPROVED", sub: today.toUpperCase() },
  { id: "rejected", name: "Rejected/Cancelled", label: "REJECTED", sub: "VOIDED" },
  { id: "confidential", name: "Confidential Stamp", label: "CONFIDENTIAL", sub: "RESTRICTED" },
  { id: "customs", name: "Customs/Border Stamp", label: "CLEARED", sub: "CUSTOMS" },
  { id: "postal", name: "Postal Stamp", label: "POSTAGE", sub: "" },
  { id: "embossing", name: "Embossing Seal", label: "EMBOSSED", sub: "OFFICIAL SEAL" },
];

const positions: { id: "signature" | "header" | "footer"; label: string }[] = [
  { id: "signature", label: "Next to signature" },
  { id: "header", label: "In the document header" },
  { id: "footer", label: "In the document footer" },
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
  proof,
  sealing,
  signed = true,
  applyStamp: applyStampOption = true,
  accentColor,
}: {
  document?: SignDocument;
  signature: string;
  proof: SignatureProof | null;
  sealing: boolean;
  signed?: boolean;
  applyStamp?: boolean;
  accentColor: string;
}) {
  const [stampTypeId, setStampTypeId] = useState("official");
  const stampType = stampTypes.find((t) => t.id === stampTypeId) || stampTypes[0];
  const [stampLabel, setStampLabel] = useState(stampType.label);
  const [stampSub, setStampSub] = useState(stampType.sub);
  const [stampColor, setStampColor] = useState(stampColors[0]);
  const [stampPosition, setStampPosition] = useState<"signature" | "header" | "footer">("signature");
  const [stampImageUrl, setStampImageUrl] = useState<string | null>(null);
  const [rightsConfirmed, setRightsConfirmed] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [editingStamp, setEditingStamp] = useState(false);
  const [buyingCredits, setBuyingCredits] = useState(false);
  const [showAudit, setShowAudit] = useState(false);

  const stampBlocked = signed && applyStampOption && proof && !proof.stampApplied;
  const showStampCard = signed && applyStampOption;

  function selectStampType(id: string) {
    const t = stampTypes.find((s) => s.id === id) || stampTypes[0];
    setStampTypeId(id);
    setStampLabel(t.label);
    setStampSub(t.sub);
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

  const stampNode = !stampBlocked ? <Stamp label={stampLabel} sub={stampSub} color={stampColor} imageUrl={stampImageUrl} /> : null;
  const embeddedStampNode = !stampBlocked ? <Stamp label={stampLabel} sub={stampSub} color={stampColor} imageUrl={stampImageUrl} size={72} /> : null;
  const embeddedStamp = showStampCard && stampPosition !== "signature" ? embeddedStampNode : null;

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
            headerRight={stampPosition === "header" ? embeddedStamp : undefined}
            footerSlot={stampPosition === "footer" && embeddedStamp ? <div className="flex justify-center">{embeddedStamp}</div> : undefined}
          />
        </div>

        {signed && (
          <div className="card elev-sm w-full text-left gap-2.5 p-4 relative overflow-visible">
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-col gap-2.5 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <IconLock size={13} className="text-[var(--color-accent)]" />
                  <span className="text-[12px] font-mono text-[var(--color-neutral-400)]">
                    {sealing
                      ? "Computing certificate…"
                      : `Certificate ID: ${proof?.certificateId ?? "unavailable"}`}
                  </span>
                </div>
                {signature.startsWith("data:") ? (
                  <img src={signature} alt="Signature" className="h-10 self-start" />
                ) : (
                  <span style={{ fontFamily: "cursive", fontSize: 22 }}>{signature}</span>
                )}
                {proof && (
                  <div className="text-[9.5px] font-mono text-[var(--color-neutral-600)] break-all">
                    SHA-256: {proof.recordHash}
                  </div>
                )}
              </div>

              {showStampCard && (
                <div className="flex-none -mt-2 -mr-1 flex flex-col items-center gap-1.5">
                  {stampBlocked ? (
                    <div className="flex flex-col items-center gap-1.5 w-[108px]">
                      <div
                        className="w-[108px] h-[108px] rounded-full grid place-items-center text-center p-2"
                        style={{ border: "2.5px dashed var(--color-neutral-700)", color: "var(--color-neutral-500)" }}
                      >
                        <span className="text-[10px] leading-[1.4]">Out of stamp credits</span>
                      </div>
                      <button className="btn btn-primary text-[10.5px] no-print" style={{ padding: "5px 10px" }} onClick={buyCredits} disabled={buyingCredits}>
                        {buyingCredits ? "…" : "Buy 10 credits · $9"}
                      </button>
                    </div>
                  ) : (
                    <>
                      {stampPosition === "signature" ? stampNode : (
                        <div className="text-[10.5px] text-[var(--color-neutral-500)] italic w-[108px]">Placed in the document {stampPosition}</div>
                      )}
                      <button
                        className="btn btn-secondary text-[10.5px] no-print"
                        style={{ padding: "4px 9px" }}
                        onClick={() => setEditingStamp((v) => !v)}
                      >
                        <IconEdit size={11} />
                        Edit stamp
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {editingStamp && !stampBlocked && showStampCard && (
              <div className="no-print flex flex-col gap-2.5 p-3 rounded-lg border" style={{ borderColor: "var(--color-divider)" }}>
                <select className="input text-[12px]" value={stampTypeId} onChange={(e) => selectStampType(e.target.value)}>
                  {stampTypes.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
                <select className="input text-[12px]" value={stampPosition} onChange={(e) => setStampPosition(e.target.value as typeof stampPosition)}>
                  {positions.map((p) => (
                    <option key={p.id} value={p.id}>{p.label}</option>
                  ))}
                </select>
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

            {showStampCard && proof && !stampBlocked && proof.stampCreditsRemaining !== null && (
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
