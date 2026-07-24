"use client";

import { useEffect, useRef, useState } from "react";
import { IconSparkle, IconESign, IconLink, IconWallet, IconCheckCircle, IconDocuments } from "@/components/icons";

// A ~6.5s auto-playing guided demo: it drives itself through Origin's whole
// flow from the very beginning — ask the AI, it drafts, the client signs, a
// payment link is paid, money lands — inside a tilted 3D app window. Loops.
const STAGES = [
  { url: "app.origin.io/assistant", step: "01", kicker: "Ask", label: "Ask the AI", icon: IconSparkle, color: "#9184d9" },
  { url: "app.origin.io/assistant", step: "02", kicker: "Draft", label: "It drafts, live", icon: IconDocuments, color: "#9184d9" },
  { url: "app.origin.io/sign", step: "03", kicker: "Sign", label: "Client signs", icon: IconESign, color: "#63c3b2" },
  { url: "app.origin.io/payments", step: "04", kicker: "Pay", label: "Client pays", icon: IconLink, color: "#e0a35b" },
  { url: "app.origin.io/wallet", step: "05", kicker: "Land", label: "Money lands", icon: IconWallet, color: "#e896c9" },
] as const;

const DESIGN_W = 720;
const DESIGN_H = 452;
const AMOUNT = 6200;
const STEP_MS = 1300;

export default function WalkthroughScene() {
  const outerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [step, setStep] = useState(0);
  const [balance, setBalance] = useState(42180);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const el = outerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setScale(Math.min(1, el.clientWidth / DESIGN_W)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (reduced) {
      setStep(4);
      return;
    }
    const id = setInterval(() => setStep((s) => (s + 1) % STAGES.length), STEP_MS);
    return () => clearInterval(id);
  }, [reduced]);

  useEffect(() => {
    if (step !== 4) return;
    const start = balance;
    const target = start + AMOUNT;
    if (reduced) {
      setBalance(target);
      return;
    }
    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / 1000);
      const eased = 1 - Math.pow(1 - p, 3);
      setBalance(start + AMOUNT * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const stage = STAGES[step];

  return (
    <div ref={outerRef} className="relative w-full" style={{ height: DESIGN_H * scale }}>
      <div
        className="absolute left-1/2 top-0"
        style={{ width: DESIGN_W, height: DESIGN_H, transform: `translateX(-50%) scale(${scale})`, transformOrigin: "top center" }}
      >
        {/* ambient glow */}
        <div
          className="absolute pointer-events-none"
          style={{
            left: "50%",
            top: "46%",
            width: 560,
            height: 380,
            transform: "translate(-50%, -50%)",
            background: `radial-gradient(closest-side, color-mix(in srgb, ${stage.color} 24%, transparent), transparent)`,
            filter: "blur(30px)",
            transition: "background 0.8s ease",
          }}
        />

        <div className="absolute inset-0" style={{ perspective: 1700 }}>
          <div
            className="relative w-full"
            style={{
              transformStyle: "preserve-3d",
              transform: reduced ? "none" : "rotateX(9deg) rotateZ(-0.6deg)",
              animation: reduced ? "none" : "nx-scene-drift 14s ease-in-out infinite",
            }}
          >
            {/* the app window */}
            <div
              className="rounded-2xl overflow-hidden border mx-auto"
              style={{ width: 680, borderColor: "var(--color-divider)", background: "var(--color-bg)", boxShadow: "0 40px 80px -30px rgba(0,0,0,0.7)" }}
            >
              {/* chrome bar */}
              <div className="flex items-center gap-1.5 px-3.5 py-2.5 border-b" style={{ borderColor: "var(--color-divider)", background: "var(--color-surface)" }}>
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#e06c6c" }} />
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#e0b45b" }} />
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#63c3b2" }} />
                <div className="ml-3 flex items-center gap-2 px-3 py-1 rounded-md flex-1" style={{ background: "var(--color-bg)" }}>
                  <span className="w-2.5 h-2.5 rounded-full flex-none" style={{ background: stage.color, transition: "background 0.5s" }} />
                  <span className="font-mono text-[11px] text-[var(--color-neutral-500)]">{stage.url}</span>
                </div>
              </div>

              {/* stage viewport */}
              <div className="relative" style={{ height: 330, background: "var(--color-bg)" }}>
                <Stage active={step === 0} offset={step - 0}><AskScreen typed={step >= 0} /></Stage>
                <Stage active={step === 1} offset={step - 1}><DraftScreen fill={step >= 1} /></Stage>
                <Stage active={step === 2} offset={step - 2}><SignScreen draw={step === 2} /></Stage>
                <Stage active={step === 3} offset={step - 3}><PayScreen paid={step === 3} /></Stage>
                <Stage active={step === 4} offset={step - 4}><LandScreen balance={balance} /></Stage>
              </div>
            </div>

            {/* step progress rail */}
            <div className="flex items-center justify-center gap-2 mt-4" style={{ transform: "translateZ(30px)" }}>
              {STAGES.map((s, i) => {
                const done = i < step;
                const active = i === step;
                return (
                  <div key={s.step} className="flex items-center gap-2">
                    <div
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                      style={{
                        background: active ? `color-mix(in srgb, ${s.color} 18%, transparent)` : "transparent",
                        border: `1px solid ${active ? `color-mix(in srgb, ${s.color} 50%, transparent)` : "var(--color-divider)"}`,
                        opacity: active ? 1 : done ? 0.8 : 0.45,
                        transition: "all 0.4s ease",
                      }}
                    >
                      <span className="flex-none grid place-items-center" style={{ color: active || done ? s.color : "var(--color-neutral-500)" }}>
                        <s.icon size={12} />
                      </span>
                      <span className="text-[10px] font-medium" style={{ color: active ? "var(--color-text)" : "var(--color-neutral-500)" }}>
                        {s.label}
                      </span>
                    </div>
                    {i < STAGES.length - 1 && <span className="w-4 h-px" style={{ background: "var(--color-divider)" }} />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stage({ active, offset, children }: { active: boolean; offset: number; children: React.ReactNode }) {
  return (
    <div
      className="absolute inset-0 p-5"
      style={{
        opacity: active ? 1 : 0,
        transform: active ? "translateX(0)" : `translateX(${offset < 0 ? -24 : 24}px)`,
        transition: "opacity 0.55s cubic-bezier(0.22,1,0.36,1), transform 0.55s cubic-bezier(0.22,1,0.36,1)",
        pointerEvents: "none",
      }}
    >
      {children}
    </div>
  );
}

function AskScreen({ typed }: { typed: boolean }) {
  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="flex items-center gap-2">
        <IconSparkle size={15} className="text-[var(--color-accent)]" />
        <span className="text-[11px] tracking-[.06em] uppercase text-[var(--color-neutral-500)]">Origin AI</span>
      </div>
      <div className="flex-1 flex flex-col justify-center gap-3">
        <div className="rounded-xl p-4 text-[14px] self-end max-w-[70%]" style={{ background: "var(--color-accent-900)", color: "var(--color-text)" }}>
          Draft a services agreement for Northbeam Co., with a $6,200 deposit.
          {typed && <span className="inline-block w-[2px] h-[13px] ml-0.5 align-middle bg-[var(--color-accent-300)] animate-pulse" />}
        </div>
      </div>
      <div className="flex items-center gap-2 px-4 py-3 rounded-xl" style={{ background: "var(--color-surface)" }}>
        <span className="text-[12.5px] text-[var(--color-neutral-500)] flex-1">Ask Origin to draft anything…</span>
        <span className="w-7 h-7 rounded-lg grid place-items-center" style={{ background: "var(--color-accent)", color: "#0c0c10" }}>↑</span>
      </div>
    </div>
  );
}

function DraftScreen({ fill }: { fill: boolean }) {
  return (
    <div className="flex gap-4 h-full">
      <div className="w-[38%] flex flex-col gap-2">
        <div className="rounded-lg p-2.5 text-[11px]" style={{ background: "var(--color-accent-900)", color: "var(--color-text)" }}>
          Draft a services agreement…
        </div>
        <div className="rounded-lg p-2.5 text-[11px]" style={{ background: "var(--color-surface)", color: "var(--color-neutral-400)" }}>
          Done — drafted with a $6,200 deposit clause. Review it →
        </div>
      </div>
      <div className="flex-1 rounded-xl p-4 flex flex-col gap-2.5" style={{ background: "var(--color-surface)" }}>
        <div className="text-[13px] font-medium">Services Agreement</div>
        <div className="text-[9px] text-[var(--color-neutral-500)]">Origin Inc · Northbeam Co.</div>
        <div className="h-px my-1" style={{ background: "var(--color-divider)" }} />
        {["1. Scope of Services", "2. Deposit — $6,200 due on signing", "3. Term & Termination"].map((h, i) => (
          <div key={i} className="flex flex-col gap-1">
            <div className="text-[10px] font-medium" style={{ color: "var(--color-accent-300)" }}>{h}</div>
            {[100, 80].map((w, j) => (
              <span
                key={j}
                className="h-[3px] rounded-full"
                style={{
                  width: fill ? `${w}%` : "20%",
                  background: "var(--color-neutral-700)",
                  transition: "width 0.6s cubic-bezier(0.22,1,0.36,1)",
                  transitionDelay: `${i * 0.12 + j * 0.06}s`,
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function SignScreen({ draw }: { draw: boolean }) {
  return (
    <div className="flex flex-col gap-3 h-full items-center justify-center">
      <div className="text-[12px] text-[var(--color-neutral-500)]">Halcyon Ventures is signing…</div>
      <div className="w-[300px] rounded-xl p-5 flex flex-col gap-2" style={{ background: "var(--color-surface)", border: "1px solid var(--color-divider)" }}>
        <svg viewBox="0 0 260 60" className="w-full h-[56px] block">
          <path
            d="M8 46 C30 10, 44 10, 56 38 S92 62, 108 26 S140 6, 156 40 S196 54, 252 18"
            fill="none"
            stroke="#63c3b2"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="420"
            style={{ strokeDashoffset: draw ? 0 : 420, transition: draw ? "stroke-dashoffset 1.1s ease-out" : "none" }}
          />
        </svg>
        <div className="h-px" style={{ background: "var(--color-divider)" }} />
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-[var(--color-neutral-500)]">Signature</span>
          <span className="flex items-center gap-1 text-[11px] font-medium" style={{ color: "#63c3b2" }}>
            <IconCheckCircle size={12} /> Signed &amp; sealed
          </span>
        </div>
        <div className="font-mono text-[10px] text-[var(--color-neutral-600)]">Certificate OG-CERT-8F21 · hash-chained</div>
      </div>
    </div>
  );
}

function PayScreen({ paid }: { paid: boolean }) {
  return (
    <div className="flex flex-col gap-3 h-full items-center justify-center">
      <div className="w-[320px] rounded-xl overflow-hidden border" style={{ borderColor: "var(--color-divider)" }}>
        <div className="px-4 py-2.5 text-center" style={{ background: "var(--color-surface)" }}>
          <span className="text-[11px] text-[var(--color-neutral-500)]">Northbeam Co. · Secure checkout</span>
        </div>
        <div className="p-5 flex flex-col items-center gap-3" style={{ background: "var(--color-bg)" }}>
          <span className="text-[11px] tracking-[.06em] uppercase text-[var(--color-neutral-500)]">Deposit</span>
          <span className="text-[28px] font-medium">$6,200.00</span>
          <div
            className="w-full rounded-lg text-center py-2.5 text-[13px] font-medium flex items-center justify-center gap-1.5"
            style={{ background: paid ? "#63c3b2" : "var(--color-accent)", color: "#0c0c10", transition: "background 0.4s" }}
          >
            {paid ? (<><IconCheckCircle size={14} /> Payment received</>) : "Pay $6,200.00"}
          </div>
          <span className="font-mono text-[9px] text-[var(--color-neutral-600)]">buy.stripe.com/northbeam-deposit</span>
        </div>
      </div>
    </div>
  );
}

function LandScreen({ balance }: { balance: number }) {
  return (
    <div className="flex flex-col gap-3 h-full justify-center">
      <div className="rounded-xl p-5 flex flex-col gap-3" style={{ background: "linear-gradient(150deg, var(--color-surface), color-mix(in srgb, var(--color-accent-900) 55%, var(--color-surface)))" }}>
        <span className="text-[11px] tracking-[.08em] uppercase text-[var(--color-neutral-500)]">Available balance</span>
        <span className="text-[34px] font-medium tracking-[-0.015em]">
          ${balance.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
        </span>
        <div className="flex items-center gap-2 text-[12.5px]" style={{ color: "#63c3b2" }}>
          <IconCheckCircle size={14} /> +$6,200.00 received from Northbeam Co.
        </div>
      </div>
      <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg" style={{ background: "var(--color-surface)" }}>
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#63c3b2" }} />
        <span className="text-[12px] flex-1">Northbeam Co. · Services Agreement</span>
        <span className="text-[12px] font-medium" style={{ color: "#63c3b2" }}>+$6,200.00</span>
      </div>
    </div>
  );
}
