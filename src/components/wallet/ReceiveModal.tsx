"use client";

import { useState } from "react";
import { IconQrCode } from "@/components/icons";

export default function ReceiveModal({ onClose }: { onClose: () => void }) {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [copied, setCopied] = useState<"account" | "link" | null>(null);

  function copy(text: string, which: "account" | "link") {
    navigator.clipboard.writeText(text);
    setCopied(which);
    setTimeout(() => setCopied(null), 1800);
  }

  const requestLink = `https://pay.origin.io/req/${amount ? Number(amount).toFixed(2).replace(".", "") : "0000"}-mstudio${note ? "?note=" + encodeURIComponent(note) : ""}`;

  return (
    <div className="dialog-backdrop" onClick={onClose}>
      <div className="dialog" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-title">Receive money</div>
        <div className="dialog-body flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-neutral-500)] uppercase tracking-[.06em]">Your virtual account</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[15px] tracking-[.04em]">0219 4417 8830</span>
              <button className="btn btn-ghost text-[11px] px-1.5 py-0.5" onClick={() => copy("0219441788330", "account")}>
                {copied === "account" ? "Copied!" : "Copy"}
              </button>
            </div>
            <span className="text-[11px] text-[var(--color-neutral-500)]">Column Bank N.A. · ACH + Wire</span>
          </div>

          <div className="hr" />

          <div className="text-[12.5px] font-medium">Request a specific amount</div>
          <div className="field">
            <label>Amount (USD)</label>
            <input className="input" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="decimal" />
          </div>
          <div className="field">
            <label>Note (optional)</label>
            <input className="input" placeholder="What's this for?" value={note} onChange={(e) => setNote(e.target.value)} />
          </div>

          <div className="rounded-lg p-3 flex items-center gap-2.5" style={{ background: "var(--color-surface)" }}>
            <IconQrCode size={28} className="text-[var(--color-accent)] flex-none" />
            <div className="min-w-0 flex-1">
              <div className="text-[11px] text-[var(--color-neutral-500)]">Shareable payment link</div>
              <div className="text-[11.5px] font-mono truncate">{requestLink}</div>
            </div>
          </div>
        </div>
        <div className="dialog-actions">
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
          <button className="btn btn-primary" onClick={() => copy(requestLink, "link")}>
            {copied === "link" ? "Link copied!" : "Copy request link"}
          </button>
        </div>
      </div>
    </div>
  );
}
