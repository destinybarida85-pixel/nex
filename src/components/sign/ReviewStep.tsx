"use client";

import { useState } from "react";
import { IconDocuments } from "@/components/icons";
import { demoDocument, type SignDocument } from "./document";
import DocumentPaper from "@/components/document/DocumentPaper";
import { documentAccents, documentLayouts, type DocumentLayout } from "@/components/document/theme";

export default function ReviewStep({
  onContinue,
  document = demoDocument,
  requireSignature = true,
  onRequireSignatureChange,
  applyStamp = true,
  onApplyStampChange,
  accentColor,
  onAccentColorChange,
  layout,
  onLayoutChange,
}: {
  onContinue: () => void;
  document?: SignDocument;
  requireSignature?: boolean;
  onRequireSignatureChange?: (value: boolean) => void;
  applyStamp?: boolean;
  onApplyStampChange?: (value: boolean) => void;
  accentColor: string;
  onAccentColorChange: (color: string) => void;
  layout: DocumentLayout;
  onLayoutChange: (layout: DocumentLayout) => void;
}) {
  const [reviewed, setReviewed] = useState(false);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <IconDocuments size={18} className="text-[var(--color-accent)]" />
        <div>
          <h4 className="m-0 text-[18px]">{document.title}</h4>
          <div className="text-[13px] text-[var(--color-neutral-500)] mt-0.5">
            {document.sentBy ? `Sent by ${document.sentBy} · ` : ""}Requires your signature
          </div>
        </div>
      </div>

      <div className="rounded-xl overflow-hidden max-h-[320px] overflow-y-auto">
        <DocumentPaper title={document.title} sections={document.sections} accentColor={accentColor} layout={layout} font={document.font} tone={document.tone} organisation={document.organisation ?? undefined} logoUrl={document.logoUrl} big={false} />
      </div>

      <div className="field">
        <label className="text-[11px] text-[var(--color-neutral-500)]">Document style</label>
        <select className="input text-[13.5px]" value={layout} onChange={(e) => onLayoutChange(e.target.value as DocumentLayout)}>
          {documentLayouts.map((l) => (
            <option key={l.id} value={l.id}>{l.label} — {l.why}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-1.5">
        <span className="text-[11px] text-[var(--color-neutral-500)]">Document color</span>
        {documentAccents.map((a) => (
          <button
            key={a.id}
            aria-label={a.label}
            onClick={() => onAccentColorChange(a.color)}
            className="w-[18px] h-[18px] rounded-md cursor-pointer"
            style={{ background: a.color, outline: accentColor === a.color ? "2px solid var(--color-text)" : "none", outlineOffset: 2 }}
          />
        ))}
      </div>

      <label className="radio gap-2.5 text-[14px]">
        <input type="checkbox" checked={reviewed} onChange={(e) => setReviewed(e.target.checked)} />
        <span className="dot" style={{ borderRadius: 5 }} />
        I have reviewed this document in full
      </label>

      <div className="flex flex-col gap-1.5 p-3 rounded-lg" style={{ background: "var(--color-surface)" }}>
        <label className="flex items-center gap-2.5 text-[13.5px]">
          <input type="checkbox" checked={requireSignature} onChange={(e) => onRequireSignatureChange?.(e.target.checked)} />
          Require a signature
        </label>
        <label className="flex items-center gap-2.5 text-[13.5px]" style={{ opacity: requireSignature ? 1 : 0.5 }}>
          <input type="checkbox" checked={applyStamp} disabled={!requireSignature} onChange={(e) => onApplyStampChange?.(e.target.checked)} />
          Apply official stamp/seal
        </label>
      </div>

      <button className="btn btn-primary btn-block" disabled={!reviewed} onClick={onContinue}>
        {requireSignature ? "Continue to signing" : "Mark as reviewed & complete"}
      </button>
    </div>
  );
}
