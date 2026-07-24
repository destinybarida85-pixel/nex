"use client";

import { useEffect, useRef, useState } from "react";
import { IconSparkle, IconESign, IconLink, IconWallet, IconCheckCircle, IconDocuments } from "@/components/icons";

// A ~6.5s auto-playing guided demo, shown big: a cursor drives the whole flow
// from the very beginning — asks the AI, it drafts, the client signs, a payment
// link is paid, money lands — inside a tilted 3D app window. Loops.
const STAGES = [
  { url: "app.origin.io/assistant", label: "Ask the AI", icon: IconSparkle, color: "#9184d9", cursor: { x: 838, y: 392, click: true } },
  { url: "app.origin.io/assistant", label: "It drafts, live", icon: IconDocuments, color: "#9184d9", cursor: { x: 612, y: 150, click: false } },
  { url: "app.origin.io/sign", label: "Client signs", icon: IconESign, color: "#63c3b2", cursor: { x: 452, y: 214, click: true } },
  { url: "app.origin.io/payments", label: "Client pays", icon: IconLink, color: "#e0a35b", cursor: { x: 452, y: 300, click: true } },
  { url: "app.origin.io/wallet", label: "Money lands", icon: IconWallet, color: "#e896c9", cursor: { x: 214, y: 150, click: false } },
] as const;

const DESIGN_W = 960;
const DESIGN_H = 552;
const WINDOW_W = 900;
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
  const winOffset = (DESIGN_W - WINDOW_W) / 2;

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
            top: "44%",
            width: 700,
            height: 460,
            transform: "translate(-50%, -50%)",
            background: `radial-gradient(closest-side, color-mix(in srgb, ${stage.color} 24%, transparent), transparent)`,
            filter: "blur(34px)",
            transition: "background 0.8s ease",
          }}
        />

        <div className="absolute inset-0" style={{ perspective: 2000 }}>
          <div
            className="relative w-full"
            style={{
              transformStyle: "preserve-3d",
              transform: reduced ? "none" : "rotateX(8deg) rotateZ(-0.5deg)",
              animation: reduced ? "none" : "nx-scene-drift 16s ease-in-out infinite",
            }}
          >
            {/* the app window */}
            <div
              className="relative rounded-2xl overflow-hidden border mx-auto"
              style={{ width: WINDOW_W, borderColor: "var(--color-divider)", background: "var(--color-bg)", boxShadow: "0 50px 100px -30px rgba(0,0,0,0.75)" }}
            >
              {/* chrome bar */}
              <div className="flex items-center gap-1.5 px-4 py-3 border-b" style={{ borderColor: "var(--color-divider)", background: "var(--color-surface)" }}>
                <span className="w-3 h-3 rounded-full" style={{ background: "#e06c6c" }} />
                <span className="w-3 h-3 rounded-full" style={{ background: "#e0b45b" }} />
                <span className="w-3 h-3 rounded-full" style={{ background: "#63c3b2" }} />
                <div className="ml-3 flex items-center gap-2 px-3.5 py-1.5 rounded-md flex-1" style={{ background: "var(--color-bg)" }}>
                  <span className="w-3 h-3 rounded-full flex-none" style={{ background: stage.color, transition: "background 0.5s" }} />
                  <span className="font-mono text-[13px] text-[var(--color-neutral-500)]">{stage.url}</span>
                </div>
              </div>

              {/* stage viewport */}
              <div className="relative" style={{ height: 420, background: "var(--color-bg)" }}>
                <Stage active={step === 0} offset={step - 0}><AskScreen typed={step >= 0} /></Stage>
                <Stage active={step === 1} offset={step - 1}><DraftScreen fill={step >= 1} /></Stage>
                <Stage active={step === 2} offset={step - 2}><SignScreen draw={step === 2} /></Stage>
                <Stage active={step === 3} offset={step - 3}><PayScreen paid={step === 3} /></Stage>
                <Stage active={step === 4} offset={step - 4}><LandScreen balance={balance} /></Stage>
              </div>

              {/* the working cursor — someone driving the app */}
              {!reduced && (
                <div
                  className="absolute pointer-events-none z-20"
                  style={{
                    left: stage.cursor.x - winOffset,
                    top: stage.cursor.y,
                    transition: "left 0.6s cubic-bezier(0.5,0,0.2,1), top 0.6s cubic-bezier(0.5,0,0.2,1)",
                  }}
                >
                  {stage.cursor.click && (
                    <span
                      key={`ripple-${step}`}
                      className="nx-cursor-ripple absolute rounded-full"
                      style={{
                        left: 3,
                        top: 3,
                        width: 34,
                        height: 34,
                        border: `2px solid ${stage.color}`,
                        animation: "nx-cursor-ripple 0.9s ease-out 0.5s",
                      }}
                    />
                  )}
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    key={`cursor-${step}`}
                    style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))", animation: stage.cursor.click ? "nx-cursor-dip 0.9s ease 0.5s" : "none" }}
                  >
                    <path d="M4 2 L4 18 L8.5 13.5 L11.5 20 L14 19 L11 12.5 L17 12.5 Z" fill="#ffffff" stroke="#0c0c10" strokeWidth="1.1" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </div>

            {/* step progress rail */}
            <div className="flex items-center justify-center gap-2.5 mt-5" style={{ transform: "translateZ(30px)" }}>
              {STAGES.map((s, i) => {
                const done = i < step;
                const active = i === step;
                return (
                  <div key={s.label} className="flex items-center gap-2.5">
                    <div
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                      style={{
                        background: active ? `color-mix(in srgb, ${s.color} 18%, transparent)` : "transparent",
                        border: `1px solid ${active ? `color-mix(in srgb, ${s.color} 50%, transparent)` : "var(--color-divider)"}`,
                        opacity: active ? 1 : done ? 0.8 : 0.45,
                        transition: "all 0.4s ease",
                      }}
                    >
                      <span className="flex-none grid place-items-center" style={{ color: active || done ? s.color : "var(--color-neutral-500)" }}>
                        <s.icon size={13} />
                      </span>
                      <span className="text-[11.5px] font-medium" style={{ color: active ? "var(--color-text)" : "var(--color-neutral-500)" }}>
                        {s.label}
                      </span>
                    </div>
                    {i < STAGES.length - 1 && <span className="w-5 h-px" style={{ background: "var(--color-divider)" }} />}
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
      className="absolute inset-0 p-6"
      style={{
        opacity: active ? 1 : 0,
        transform: active ? "translateX(0)" : `translateX(${offset < 0 ? -30 : 30}px)`,
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
    <div className="flex flex-col gap-4 h-full">
      <div className="flex items-center gap-2">
        <IconSparkle size={17} className="text-[var(--color-accent)]" />
        <span className="text-[12.5px] tracking-[.06em] uppercase text-[var(--color-neutral-500)]">Origin AI</span>
      </div>
      <div className="flex-1 flex flex-col justify-center gap-3">
        <div className="rounded-xl p-4 text-[16px] self-end max-w-[68%] leading-[1.5]" style={{ background: "var(--color-accent-900)", color: "var(--color-text)" }}>
          Draft a services agreement for Northbeam Co., with a $6,200 deposit.
          {typed && <span className="inline-block w-[2px] h-[15px] ml-0.5 align-middle bg-[var(--color-accent-300)] animate-pulse" />}
        </div>
      </div>
      <div className="flex items-center gap-2 px-5 py-4 rounded-xl" style={{ background: "var(--color-surface)" }}>
        <span className="text-[14px] text-[var(--color-neutral-500)] flex-1">Ask Origin to draft anything…</span>
        <span className="w-9 h-9 rounded-lg grid place-items-center text-[16px]" style={{ background: "var(--color-accent)", color: "#0c0c10" }}>↑</span>
      </div>
    </div>
  );
}

function DraftScreen({ fill }: { fill: boolean }) {
  return (
    <div className="flex gap-5 h-full">
      <div className="w-[36%] flex flex-col gap-2.5">
        <div className="rounded-lg p-3 text-[13px]" style={{ background: "var(--color-accent-900)", color: "var(--color-text)" }}>
          Draft a services agreement…
        </div>
        <div className="rounded-lg p-3 text-[13px] leading-[1.5]" style={{ background: "var(--color-surface)", color: "var(--color-neutral-400)" }}>
          Done — drafted with a $6,200 deposit clause. Review it →
        </div>
      </div>
      <div className="flex-1 rounded-xl p-5 flex flex-col gap-3" style={{ background: "var(--color-surface)" }}>
        <div className="text-[16px] font-medium">Services Agreement</div>
        <div className="text-[11px] text-[var(--color-neutral-500)]">Origin Inc · Northbeam Co.</div>
        <div className="h-px my-1" style={{ background: "var(--color-divider)" }} />
        {["1. Scope of Services", "2. Deposit — $6,200 due on signing", "3. Term & Termination"].map((h, i) => (
          <div key={i} className="flex flex-col gap-1.5">
            <div className="text-[12px] font-medium" style={{ color: "var(--color-accent-300)" }}>{h}</div>
            {[100, 80].map((w, j) => (
              <span
                key={j}
                className="h-[4px] rounded-full"
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
    <div className="flex flex-col gap-4 h-full items-center justify-center">
      <div className="text-[14px] text-[var(--color-neutral-500)]">Halcyon Ventures is signing…</div>
      <div className="w-[380px] rounded-xl p-6 flex flex-col gap-3" style={{ background: "var(--color-surface)", border: "1px solid var(--color-divider)" }}>
        <svg viewBox="0 0 320 70" className="w-full h-[64px] block">
          <path
            d="M10 56 C38 12, 54 12, 70 46 S114 76, 134 30 S172 8, 192 48 S240 66, 310 22"
            fill="none"
            stroke="#63c3b2"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="520"
            style={{ strokeDashoffset: draw ? 0 : 520, transition: draw ? "stroke-dashoffset 1.1s ease-out" : "none" }}
          />
        </svg>
        <div className="h-px" style={{ background: "var(--color-divider)" }} />
        <div className="flex items-center justify-between">
          <span className="text-[12px] text-[var(--color-neutral-500)]">Signature</span>
          <span className="flex items-center gap-1.5 text-[13px] font-medium" style={{ color: "#63c3b2" }}>
            <IconCheckCircle size={14} /> Signed &amp; sealed
          </span>
        </div>
        <div className="font-mono text-[11px] text-[var(--color-neutral-600)]">Certificate OG-CERT-8F21 · hash-chained</div>
      </div>
    </div>
  );
}

function PayScreen({ paid }: { paid: boolean }) {
  return (
    <div className="flex flex-col gap-3 h-full items-center justify-center">
      <div className="w-[400px] rounded-xl overflow-hidden border" style={{ borderColor: "var(--color-divider)" }}>
        <div className="px-5 py-3 text-center" style={{ background: "var(--color-surface)" }}>
          <span className="text-[13px] text-[var(--color-neutral-500)]">Northbeam Co. · Secure checkout</span>
        </div>
        <div className="p-6 flex flex-col items-center gap-4" style={{ background: "var(--color-bg)" }}>
          <span className="text-[12px] tracking-[.06em] uppercase text-[var(--color-neutral-500)]">Deposit</span>
          <span className="text-[36px] font-medium">$6,200.00</span>
          <div
            className="w-full rounded-lg text-center py-3 text-[15px] font-medium flex items-center justify-center gap-2"
            style={{ background: paid ? "#63c3b2" : "var(--color-accent)", color: "#0c0c10", transition: "background 0.4s" }}
          >
            {paid ? (<><IconCheckCircle size={16} /> Payment received</>) : "Pay $6,200.00"}
          </div>
          <span className="font-mono text-[10px] text-[var(--color-neutral-600)]">buy.stripe.com/northbeam-deposit</span>
        </div>
      </div>
    </div>
  );
}

function LandScreen({ balance }: { balance: number }) {
  return (
    <div className="flex flex-col gap-4 h-full justify-center">
      <div className="rounded-xl p-6 flex flex-col gap-3.5" style={{ background: "linear-gradient(150deg, var(--color-surface), color-mix(in srgb, var(--color-accent-900) 55%, var(--color-surface)))" }}>
        <span className="text-[12px] tracking-[.08em] uppercase text-[var(--color-neutral-500)]">Available balance</span>
        <span className="text-[44px] font-medium tracking-[-0.015em] leading-none">
          ${balance.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
        </span>
        <div className="flex items-center gap-2 text-[14px]" style={{ color: "#63c3b2" }}>
          <IconCheckCircle size={15} /> +$6,200.00 received from Northbeam Co.
        </div>
      </div>
      <div className="flex items-center gap-2.5 px-5 py-3.5 rounded-lg" style={{ background: "var(--color-surface)" }}>
        <span className="w-2 h-2 rounded-full" style={{ background: "#63c3b2" }} />
        <span className="text-[14px] flex-1">Northbeam Co. · Services Agreement</span>
        <span className="text-[14px] font-medium" style={{ color: "#63c3b2" }}>+$6,200.00</span>
      </div>
    </div>
  );
}
