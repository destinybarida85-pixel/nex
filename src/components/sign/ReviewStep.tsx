"use client";

import { useState } from "react";
import { IconDocuments } from "@/components/icons";
import { demoDocument, type SignDocument } from "./document";

export default function ReviewStep({
  onContinue,
  document = demoDocument,
  requireSignature = true,
  onRequireSignatureChange,
  applyStamp = true,
  onApplyStampChange,
}: {
  onContinue: () => void;
  document?: SignDocument;
  requireSignature?: boolean;
  onRequireSignatureChange?: (value: boolean) => void;
  applyStamp?: boolean;
  onApplyStampChange?: (value: boolean) => void;
}) {
  const [reviewed, setReviewed] = useState(false);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <IconDocuments size={18} className="text-[var(--color-accent)]" />
        <div>
          <h4 className="m-0 text-[18px]">{document.title}</h4>
          <div className="text-[12px] text-[var(--color-neutral-500)] mt-0.5">
            Sent by {document.sentBy} · Requires your signature
          </div>
        </div>
      </div>

      <div
        className="rounded-xl p-7 flex flex-col gap-4 max-h-[320px] overflow-y-auto overflow-x-hidden min-w-0"
        style={{ background: "#f4f4f2", boxShadow: "var(--shadow-sm)" }}
      >
        <h3 className="text-[17px] m-0" style={{ color: "#181818" }}>{document.title}</h3>
        <div className="hr" style={{ margin: 0, borderColor: "rgba(0,0,0,0.1)" }} />
        {document.sections.map((s) => (
          <div key={s.heading} className="min-w-0">
            <h5 className="text-[12.5px] mb-1" style={{ color: "#5b4fb8" }}>{s.heading}</h5>
            <p className="text-[12.5px] leading-[1.65] m-0" style={{ color: "#33333a", overflowWrap: "break-word", wordBreak: "break-word" }}>
              {s.text}
            </p>
          </div>
        ))}
      </div>

      <label className="radio gap-2.5 text-[13px]">
        <input type="checkbox" checked={reviewed} onChange={(e) => setReviewed(e.target.checked)} />
        <span className="dot" style={{ borderRadius: 5 }} />
        I have reviewed this document in full
      </label>

      <div className="flex flex-col gap-1.5 p-3 rounded-lg" style={{ background: "var(--color-surface)" }}>
        <label className="flex items-center gap-2.5 text-[12.5px]">
          <input type="checkbox" checked={requireSignature} onChange={(e) => onRequireSignatureChange?.(e.target.checked)} />
          Require a signature
        </label>
        <label className="flex items-center gap-2.5 text-[12.5px]" style={{ opacity: requireSignature ? 1 : 0.5 }}>
          <input type="checkbox" checked={applyStamp} disabled={!requireSignature} onChange={(e) => onApplyStampChange?.(e.target.checked)} />
          Apply official stamp/seal
        </label>
      </div>

      <button className="btn btn-primary btn-block" disabled={!reviewed} onClick={onContinue}>
        {requireSignature ? "Continue to verification" : "Mark as reviewed & complete"}
      </button>
    </div>
  );
}
