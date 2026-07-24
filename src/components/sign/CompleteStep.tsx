"use client";

import { useState } from "react";
import { IconCheckCircle, IconLock, IconDownload, IconEdit } from "@/components/icons";

import Stamp from "./Stamp";
import { demoDocument } from "./document";
import type { SignatureProof } from "@/app/sign/page";

const audit = [
  { label: "Drafted", meta: "Jul 18, 2026 · 09:14" },
  { label: "Sent to signer", meta: "Jul 18, 2026 · 09:16" },
  { label: "Viewed by Halcyon Ventures", meta: "Jul 21, 2026 · 08:42" },
  { label: "Identity verified · OTP", meta: "Jul 21, 2026 · 08:44" },
  { label: "Signed & sealed", meta: "Jul 21, 2026 · 08:45" },
];

const stampColors = ["#9184d9", "#63c3b2", "#d9a05b", "#e0665f"];

export default function CompleteStep({
  signature,
  proof,
  sealing,
}: {
  signature: string;
  proof: SignatureProof | null;
  sealing: boolean;
}) {
  const [stampLabel, setStampLabel] = useState("SEALED");
  const [stampSub, setStampSub] = useState("ORIGIN E-SIGN");
  const [stampColor, setStampColor] = useState(stampColors[0]);
  const [editingStamp, setEditingStamp] = useState(false);
  const [buyingCredits, setBuyingCredits] = useState(false);

  const stampBlocked = proof && !proof.stampApplied;

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

  return (
    <div className="flex flex-col items-center gap-5 text-center">
      <span
        className="w-14 h-14 rounded-full grid place-items-center"
        style={{ color: "var(--color-accent)", background: "color-mix(in srgb, var(--color-accent-900) 65%, transparent)" }}
      >
        <IconCheckCircle size={30} />
      </span>
      <div>
        <h4 className="m-0 text-[19px]">Document signed and sealed</h4>
        <div className="text-[12.5px] text-[var(--color-neutral-500)] mt-1.5 max-w-[320px]">
          MSA · Halcyon Ventures has been signed by all parties and sealed with a tamper-evident certificate.
        </div>
      </div>

      <div className="print-area w-full flex flex-col gap-5 items-center text-center" style={{ padding: 4 }}>
        <div className="card elev-sm w-full text-left gap-3 p-4">
          <h5 className="text-[14px] m-0">{demoDocument.title}</h5>
          <div className="hr" style={{ margin: 0 }} />
          {demoDocument.sections.map((s) => (
            <div key={s.heading}>
              <h6 className="text-[11.5px] mb-1 m-0" style={{ color: "var(--color-accent-300)" }}>{s.heading}</h6>
              <p className="text-[11.5px] leading-[1.6] text-[var(--color-neutral-300)] m-0" style={{ overflowWrap: "break-word" }}>
                {s.text}
              </p>
            </div>
          ))}
        </div>

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
                  <Stamp label={stampLabel} sub={stampSub} color={stampColor} />
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
          </div>

          {editingStamp && !stampBlocked && (
            <div className="no-print flex flex-col gap-2 p-3 rounded-lg border" style={{ borderColor: "var(--color-divider)" }}>
              <div className="grid grid-cols-2 gap-2">
                <input className="input text-[12px]" placeholder="Main text" value={stampLabel} onChange={(e) => setStampLabel(e.target.value.toUpperCase().slice(0, 14))} />
                <input className="input text-[12px]" placeholder="Sub text" value={stampSub} onChange={(e) => setStampSub(e.target.value.toUpperCase().slice(0, 20))} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-[var(--color-neutral-500)]">Color</span>
                {stampColors.map((c) => (
                  <button
                    key={c}
                    aria-label={`Use ${c}`}
                    onClick={() => setStampColor(c)}
                    className="w-[20px] h-[20px] rounded-md cursor-pointer"
                    style={{ background: c, outline: stampColor === c ? "2px solid var(--color-text)" : "none", outlineOffset: 2 }}
                  />
                ))}
                <button className="btn btn-secondary text-[11px] ml-auto" style={{ padding: "4px 9px" }} onClick={() => setEditingStamp(false)}>
                  Done
                </button>
              </div>
              <div className="text-[10.5px] text-[var(--color-neutral-500)]">This stamp's text and color apply to this document only.</div>
            </div>
          )}

          {proof && !stampBlocked && proof.stampCreditsRemaining !== null && (
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

        <div className="card elev-sm w-full text-left gap-2.5 p-4">
          <div className="card-title text-[13px]">Audit trail</div>
          <div className="flex flex-col gap-2.5 mt-1">
            {audit.map((a) => (
              <div key={a.label} className="flex items-center gap-2.5 text-[12px]">
                <span className="w-[7px] h-[7px] rounded-full flex-none" style={{ background: "var(--color-accent)" }} />
                <span className="flex-1">{a.label}</span>
                <span className="text-[var(--color-neutral-500)] font-mono text-[10.5px]">{a.meta}</span>
              </div>
            ))}
          </div>
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
