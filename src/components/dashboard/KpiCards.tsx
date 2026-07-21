"use client";

import { useState } from "react";
import { IconEye, IconEyeOff } from "@/components/icons";

export default function KpiCards() {
  const [hideBalances, setHideBalances] = useState(false);
  const filter = hideBalances ? { filter: "blur(7px)" } : undefined;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      <div className="card elev-sm gap-[7px] p-[16px_18px]">
        <div className="flex items-center gap-1.5 text-[11px] tracking-[.08em] uppercase text-[var(--color-neutral-500)]">
          Wallet balance
          <button
            onClick={() => setHideBalances((v) => !v)}
            className="ml-auto text-[var(--color-neutral-500)] hover:text-[var(--color-text)] transition-colors"
            aria-label={hideBalances ? "Show balances" : "Hide balances"}
          >
            {hideBalances ? <IconEyeOff size={13} /> : <IconEye size={13} />}
          </button>
        </div>
        <div className="font-medium text-[26px] tracking-[-0.01em]" style={filter}>
          $248,610.44
        </div>
        <div className="card-meta whitespace-nowrap">
          <span style={filter}>•• 4417</span> · Column Bank N.A.
        </div>
      </div>

      <div className="card elev-sm gap-[7px] p-[16px_18px]">
        <div className="text-[11px] tracking-[.08em] uppercase text-[var(--color-neutral-500)]">Monthly revenue</div>
        <div className="font-medium text-[26px] tracking-[-0.01em]" style={filter}>
          $86,240
        </div>
        <div className="card-meta">
          <span className="tag tag-accent text-[10px]">▲ 12.4%</span>vs June
        </div>
      </div>

      <div className="card elev-sm gap-[7px] p-[16px_18px]">
        <div className="text-[11px] tracking-[.08em] uppercase text-[var(--color-neutral-500)]">Expenses</div>
        <div className="font-medium text-[26px] tracking-[-0.01em]" style={filter}>
          $31,905
        </div>
        <div className="card-meta">
          <span className="tag tag-neutral text-[10px]">▼ 3.1%</span>vs June
        </div>
      </div>

      <div className="card elev-sm gap-[7px] p-[16px_18px]">
        <div className="text-[11px] tracking-[.08em] uppercase text-[var(--color-neutral-500)]">Net profit</div>
        <div className="font-medium text-[26px] tracking-[-0.01em]" style={filter}>
          $54,335
        </div>
        <div className="card-meta">
          <span className="tag tag-accent text-[10px]">▲ 18.2%</span>margin 63%
        </div>
      </div>
    </div>
  );
}
