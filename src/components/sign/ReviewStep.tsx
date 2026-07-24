"use client";

import { useState } from "react";
import { IconDocuments } from "@/components/icons";
import { demoDocument } from "./document";

const sections = demoDocument.sections;

export default function ReviewStep({ onContinue }: { onContinue: () => void }) {
  const [reviewed, setReviewed] = useState(false);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <IconDocuments size={18} className="text-[var(--color-accent)]" />
        <div>
          <h4 className="m-0 text-[18px]">MSA · Halcyon Ventures</h4>
          <div className="text-[12px] text-[var(--color-neutral-500)] mt-0.5">
            Sent by Meridian Studio · Requires your signature
          </div>
        </div>
      </div>

      <div
        className="rounded-xl p-7 flex flex-col gap-4 max-h-[320px] overflow-y-auto overflow-x-hidden min-w-0"
        style={{ background: "var(--color-surface)", boxShadow: "var(--shadow-sm)" }}
      >
        <h3 className="text-[17px] m-0">Master Services Agreement</h3>
        <div className="hr" style={{ margin: 0 }} />
        {sections.map((s) => (
          <div key={s.heading} className="min-w-0">
            <h5 className="text-[12.5px] mb-1" style={{ color: "var(--color-accent-300)" }}>{s.heading}</h5>
            <p className="text-[12.5px] leading-[1.65] text-[var(--color-neutral-300)] m-0" style={{ overflowWrap: "break-word", wordBreak: "break-word" }}>
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

      <button className="btn btn-primary btn-block" disabled={!reviewed} onClick={onContinue}>
        Continue to verification
      </button>
    </div>
  );
}
