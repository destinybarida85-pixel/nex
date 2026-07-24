"use client";

import { useEffect, useRef, useState } from "react";
import { IconSparkle, IconESign, IconLink, IconWallet, IconCheckCircle } from "@/components/icons";

// The four beats of Origin's real loop: a contract drafts itself, gets signed,
// a payment fires, money lands. This scene plays that out continuously on a
// tilted 3D stage — the product's story, in motion.
const STEPS = [
  { key: "draft", icon: IconSparkle, color: "#9184d9", kicker: "AI drafts" },
  { key: "sign", icon: IconESign, color: "#63c3b2", kicker: "Client signs" },
  { key: "pay", icon: IconLink, color: "#e0a35b", kicker: "Client pays" },
  { key: "land", icon: IconWallet, color: "#e896c9", kicker: "Money lands" },
] as const;

const DESIGN_W = 760;
const DESIGN_H = 400;
const AMOUNT = 6200;

export default function HeroScene() {
  const outerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [phase, setPhase] = useState(0);
  const [balance, setBalance] = useState(42180);
  const [reduced, setReduced] = useState(false);

  // Scale the fixed-design stage to fit whatever width it's given.
  useEffect(() => {
    const el = outerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setScale(Math.min(1, el.clientWidth / DESIGN_W));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  // Advance the active beat.
  useEffect(() => {
    if (reduced) {
      setPhase(3);
      return;
    }
    const id = setInterval(() => setPhase((p) => (p + 1) % 4), 2000);
    return () => clearInterval(id);
  }, [reduced]);

  // When the "money lands" beat hits, count the balance up.
  useEffect(() => {
    if (phase !== 3) return;
    const start = balance;
    const target = start + AMOUNT;
    if (reduced) {
      setBalance(target);
      return;
    }
    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / 1100);
      const eased = 1 - Math.pow(1 - p, 3);
      setBalance(start + AMOUNT * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  return (
    <div ref={outerRef} className="relative w-full" style={{ height: DESIGN_H * scale }}>
      <div
        className="absolute left-1/2 top-0"
        style={{ width: DESIGN_W, height: DESIGN_H, transform: `translateX(-50%) scale(${scale})`, transformOrigin: "top center" }}
      >
        {/* ambient shifting glow */}
        <div
          className="absolute pointer-events-none"
          style={{
            left: "50%",
            top: "42%",
            width: 620,
            height: 360,
            background: "radial-gradient(closest-side, color-mix(in srgb, var(--color-accent) 26%, transparent), transparent)",
            filter: "blur(28px)",
            animation: reduced ? "none" : "nx-scene-glow 9s ease-in-out infinite",
          }}
        />

        {/* rising particles */}
        {!reduced &&
          [...Array(9)].map((_, i) => (
            <span
              key={i}
              className="nx-scene-particle absolute rounded-full"
              style={
                {
                  left: `${12 + i * 9}%`,
                  top: `${58 + (i % 3) * 8}%`,
                  width: 3,
                  height: 3,
                  background: STEPS[i % 4].color,
                  "--px": `${(i % 2 === 0 ? 1 : -1) * (6 + i)}px`,
                  animationDelay: `${i * 0.5}s`,
                } as React.CSSProperties
              }
            />
          ))}

        {/* the tilted 3D stage */}
        <div className="absolute inset-0" style={{ perspective: 1600 }}>
          <div className="nx-scene-stage relative w-full h-full">
            {/* connecting rail */}
            <div
              className="absolute"
              style={{
                left: "8%",
                right: "8%",
                top: "50%",
                height: 2,
                background: "linear-gradient(90deg, transparent, color-mix(in srgb, var(--color-accent) 55%, transparent), transparent)",
                transform: "translateZ(10px)",
              }}
            >
              {/* traveling light pulse */}
              <span
                className="nx-scene-pulse-dot absolute"
                style={{
                  top: "50%",
                  marginTop: -4,
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "var(--color-accent-300)",
                  boxShadow: "0 0 14px 3px var(--color-accent)",
                }}
              />
            </div>

            {/* the four beats */}
            <div className="absolute inset-0 flex items-center justify-between px-[6%]">
              {STEPS.map((step, i) => {
                const active = phase === i;
                return (
                  <div
                    key={step.key}
                    className="nx-scene-tile relative rounded-2xl p-3.5 flex flex-col gap-2.5"
                    style={{
                      width: 150,
                      minHeight: 132,
                      background: active
                        ? "linear-gradient(160deg, color-mix(in srgb, var(--color-surface) 96%, transparent), color-mix(in srgb, var(--color-surface) 74%, transparent))"
                        : "linear-gradient(160deg, color-mix(in srgb, var(--color-surface) 72%, transparent), color-mix(in srgb, var(--color-surface) 44%, transparent))",
                      backdropFilter: "blur(12px)",
                      border: `1px solid ${active ? `color-mix(in srgb, ${step.color} 60%, transparent)` : "var(--color-divider)"}`,
                      boxShadow: active
                        ? `0 30px 50px -22px color-mix(in srgb, ${step.color} 55%, transparent)`
                        : "0 16px 30px -24px rgba(0,0,0,0.6)",
                      transform: active ? "translateY(-14px) translateZ(52px)" : "translateY(0) translateZ(0)",
                      opacity: active ? 1 : 0.62,
                    }}
                  >
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-6 h-6 rounded-lg grid place-items-center flex-none"
                        style={{ background: `color-mix(in srgb, ${step.color} ${active ? 26 : 16}%, transparent)`, color: step.color }}
                      >
                        <step.icon size={13} />
                      </span>
                      <span className="text-[9px] tracking-[.07em] uppercase text-[var(--color-neutral-500)]">{step.kicker}</span>
                    </div>

                    {step.key === "draft" && <DraftTile active={active} />}
                    {step.key === "sign" && <SignTile active={active} color={step.color} />}
                    {step.key === "pay" && <PayTile active={active} color={step.color} />}
                    {step.key === "land" && <LandTile balance={balance} color={step.color} />}
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

function DraftTile({ active }: { active: boolean }) {
  return (
    <div className="flex flex-col gap-1.5 mt-0.5">
      <div className="text-[11px] font-medium text-[var(--color-text)] leading-tight">
        Services Agreement
        {active && <span className="inline-block w-[2px] h-[10px] ml-0.5 align-middle bg-[var(--color-accent-300)] animate-pulse" />}
      </div>
      {[92, 78, 60].map((w, i) => (
        <span
          key={i}
          className="h-[3px] rounded-full"
          style={{
            width: active ? `${w}%` : "34%",
            background: "var(--color-neutral-600)",
            transition: "width 0.6s cubic-bezier(0.22,1,0.36,1)",
            transitionDelay: `${i * 0.12}s`,
          }}
        />
      ))}
    </div>
  );
}

function SignTile({ active, color }: { active: boolean; color: string }) {
  return (
    <div className="flex flex-col gap-1.5 mt-0.5">
      <svg viewBox="0 0 120 34" className="w-full h-[30px] block">
        <path
          d="M4 26 C14 6, 22 6, 28 20 S44 34, 52 16 S66 4, 74 22 S92 30, 116 12"
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="200"
          style={{
            strokeDashoffset: active ? 0 : 200,
            transition: active ? "stroke-dashoffset 1.1s ease-out" : "none",
          }}
        />
      </svg>
      <div className="font-mono text-[9px] text-[var(--color-neutral-600)]">OG-CERT-8F21</div>
    </div>
  );
}

function PayTile({ active, color }: { active: boolean; color: string }) {
  return (
    <div className="flex flex-col gap-2 mt-0.5">
      <div className="text-[15px] font-medium" style={{ color: "var(--color-text)" }}>$6,200.00</div>
      {active ? (
        <div className="flex items-center gap-1 text-[10px] font-medium" style={{ color }}>
          <IconCheckCircle size={11} />
          Paid
        </div>
      ) : (
        <div className="text-[9px] font-mono text-[var(--color-neutral-600)] truncate">buy.stripe.com/…</div>
      )}
    </div>
  );
}

function LandTile({ balance, color }: { balance: number; color: string }) {
  return (
    <div className="flex flex-col gap-2 mt-0.5">
      <div className="text-[15px] font-medium tracking-[-0.01em]" style={{ color: "var(--color-text)" }}>
        ${balance.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
      </div>
      <div className="flex gap-[3px] items-end h-4">
        {[6, 9, 7, 12, 10, 15].map((h, i) => (
          <span key={i} className="w-[5px] rounded-sm" style={{ height: h, background: color, opacity: 0.4 + i * 0.1 }} />
        ))}
      </div>
    </div>
  );
}
