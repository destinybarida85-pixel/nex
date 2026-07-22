"use client";

import { useState } from "react";
import { IconDocuments } from "@/components/icons";

const sections = [
  { heading: "1. Parties", text: "This Master Services Agreement (“Agreement”) is entered into between Meridian Studio (“Provider”) and Halcyon Ventures (“Client”)." },
  { heading: "2. Scope of Services", text: "Provider shall deliver brand strategy, product design, and quarterly design-ops support as detailed in the attached Statement of Work." },
  { heading: "3. Fees & Payment", text: "Client agrees to pay $18,500 per milestone, net 15, via the connected business wallet or wire transfer." },
  { heading: "4. Term & Termination", text: "This Agreement is effective upon signature and continues for 12 months, renewable by mutual written consent." },
];

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
        className="rounded-xl p-7 flex flex-col gap-4 max-h-[320px] overflow-y-auto"
        style={{ background: "var(--color-surface)", boxShadow: "var(--shadow-sm)" }}
      >
        <h3 className="text-[17px] m-0">Master Services Agreement</h3>
        <div className="hr" style={{ margin: 0 }} />
        {sections.map((s) => (
          <div key={s.heading}>
            <h5 className="text-[12.5px] mb-1" style={{ color: "var(--color-accent-300)" }}>{s.heading}</h5>
            <p className="text-[12.5px] leading-[1.65] text-[var(--color-neutral-300)] m-0">{s.text}</p>
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
