"use client";

import { useRef, useState } from "react";
import { IconShieldCheck } from "@/components/icons";

export default function VerifyStep({ onContinue, onBack }: { onContinue: () => void; onBack: () => void }) {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState(false);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  function setDigit(i: number, value: string) {
    const v = value.replace(/[^0-9]/g, "").slice(-1);
    const next = [...digits];
    next[i] = v;
    setDigits(next);
    setError(false);
    if (v && i < 5) inputs.current[i + 1]?.focus();
  }

  function handleKeyDown(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      inputs.current[i - 1]?.focus();
    }
  }

  function verify() {
    if (digits.every((d) => d !== "")) {
      onContinue();
    } else {
      setError(true);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <IconShieldCheck size={18} className="text-[var(--color-accent)]" />
        <div>
          <h4 className="m-0 text-[18px]">Verify your identity</h4>
          <div className="text-[12px] text-[var(--color-neutral-500)] mt-0.5">
            We sent a 6-digit code to j***@halcyonventures.com
          </div>
        </div>
      </div>

      <div className="flex gap-2 justify-center">
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => {
              inputs.current[i] = el;
            }}
            className="input text-center text-[18px] font-mono"
            style={{ width: 44, height: 52, padding: 0, borderColor: error ? "var(--color-accent-500)" : undefined }}
            maxLength={1}
            inputMode="numeric"
            value={d}
            onChange={(e) => setDigit(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
          />
        ))}
      </div>
      {error && (
        <div className="text-[11.5px] text-center" style={{ color: "var(--color-accent-300)" }}>
          Enter all 6 digits to continue.
        </div>
      )}

      <div className="text-[11.5px] text-center text-[var(--color-neutral-500)]">
        Didn&rsquo;t get a code? <a href="#" style={{ color: "var(--color-accent-300)" }}>Resend</a>
      </div>

      <button className="btn btn-primary btn-block" onClick={verify}>
        Verify &amp; continue
      </button>
      <button className="btn btn-secondary btn-block" style={{ marginTop: 0 }} onClick={onBack}>
        Back
      </button>
    </div>
  );
}
