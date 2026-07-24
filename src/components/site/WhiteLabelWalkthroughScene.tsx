"use client";

import { useEffect, useRef, useState } from "react";
import { IconGlobe, IconDocuments, IconLink, IconArrowRight, IconCheckCircle } from "@/components/icons";

// The white-label story, driven by a cursor: the owner brands it and picks what
// clients see, shares one link, and the client lands on a page showing only the
// owner's brand — reads the document, pays. Big screen, ~6.5s loop.
const ORIGIN = "#9184d9";
const BRAND = "#63c3b2"; // the tenant's own brand color (Atlas Chambers)

const STAGES = [
  { url: "app.origin.io/whitelabel", label: "Brand it", icon: IconGlobe, color: ORIGIN, cursor: { x: 300, y: 250, click: true } },
  { url: "app.origin.io/whitelabel", label: "Pick content", icon: IconDocuments, color: ORIGIN, cursor: { x: 300, y: 170, click: true } },
  { url: "app.origin.io/whitelabel", label: "Share the link", icon: IconLink, color: ORIGIN, cursor: { x: 250, y: 300, click: true } },
  { url: "portal.atlaschambers.com", label: "Client reads", icon: IconDocuments, color: BRAND, cursor: { x: 250, y: 238, click: false } },
  { url: "portal.atlaschambers.com", label: "Client pays", icon: IconCheckCircle, color: BRAND, cursor: { x: 600, y: 320, click: true } },
] as const;

const DESIGN_W = 960;
const DESIGN_H = 552;
const WINDOW_W = 900;
const STEP_MS = 1300;

export default function WhiteLabelWalkthroughScene() {
  const outerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [step, setStep] = useState(0);
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

  const stage = STAGES[step];
  const winOffset = (DESIGN_W - WINDOW_W) / 2;

  return (
    <div ref={outerRef} className="relative w-full" style={{ height: DESIGN_H * scale }}>
      <div
        className="absolute left-1/2 top-0"
        style={{ width: DESIGN_W, height: DESIGN_H, transform: `translateX(-50%) scale(${scale})`, transformOrigin: "top center" }}
      >
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
            <div
              className="relative rounded-2xl overflow-hidden border mx-auto"
              style={{ width: WINDOW_W, borderColor: "var(--color-divider)", background: "var(--color-bg)", boxShadow: "0 50px 100px -30px rgba(0,0,0,0.75)" }}
            >
              <div className="flex items-center gap-1.5 px-4 py-3 border-b" style={{ borderColor: "var(--color-divider)", background: "var(--color-surface)" }}>
                <span className="w-3 h-3 rounded-full" style={{ background: "#e06c6c" }} />
                <span className="w-3 h-3 rounded-full" style={{ background: "#e0b45b" }} />
                <span className="w-3 h-3 rounded-full" style={{ background: "#63c3b2" }} />
                <div className="ml-3 flex items-center gap-2 px-3.5 py-1.5 rounded-md flex-1" style={{ background: "var(--color-bg)" }}>
                  <span className="w-3 h-3 rounded-full flex-none" style={{ background: stage.color, transition: "background 0.5s" }} />
                  <span className="font-mono text-[13px] text-[var(--color-neutral-500)]">{stage.url}</span>
                </div>
              </div>

              <div className="relative" style={{ height: 420, background: "var(--color-bg)" }}>
                <Stage active={step === 0} offset={step - 0}><BrandScreen picked={step >= 0} /></Stage>
                <Stage active={step === 1} offset={step - 1}><PickScreen /></Stage>
                <Stage active={step === 2} offset={step - 2}><ShareScreen shared={step >= 2} /></Stage>
                <Stage active={step === 3} offset={step - 3}><BrandedPage paid={false} /></Stage>
                <Stage active={step === 4} offset={step - 4}><BrandedPage paid /></Stage>
              </div>

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
                      style={{ left: 3, top: 3, width: 34, height: 34, border: `2px solid ${stage.color}`, animation: "nx-cursor-ripple 0.9s ease-out 0.5s" }}
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

function BrandScreen({ picked }: { picked: boolean }) {
  const swatches = ["#9184d9", "#e0a35b", "#7fa3e8", "#63c3b2"];
  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex items-center gap-2">
        <IconGlobe size={16} className="text-[var(--color-accent)]" />
        <span className="text-[12.5px] tracking-[.06em] uppercase text-[var(--color-neutral-500)]">White-label</span>
      </div>
      <div className="grid grid-cols-2 gap-4 flex-1">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-neutral-500)]">Company name</span>
            <div className="px-3.5 py-2.5 rounded-lg text-[14px]" style={{ background: "var(--color-surface)" }}>Atlas Chambers</div>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-neutral-500)]">Custom domain</span>
            <div className="px-3.5 py-2.5 rounded-lg font-mono text-[12.5px]" style={{ background: "var(--color-surface)" }}>portal.atlaschambers.com</div>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-neutral-500)]">Logo</span>
            <div className="flex items-center gap-2.5 p-3 rounded-lg" style={{ background: "var(--color-surface)" }}>
              <span className="w-9 h-9 rounded-lg grid place-items-center text-[16px] font-medium" style={{ background: `color-mix(in srgb, ${BRAND} 20%, transparent)`, color: BRAND }}>A</span>
              <span className="text-[12px] text-[var(--color-neutral-400)]">atlas-mark.svg</span>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] text-[var(--color-neutral-500)]">Brand color</span>
            <div className="flex gap-2.5">
              {swatches.map((c) => (
                <span
                  key={c}
                  className="w-8 h-8 rounded-lg"
                  style={{ background: c, outline: picked && c === BRAND ? "2px solid var(--color-text)" : "none", outlineOffset: 2, transition: "outline 0.3s" }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PickScreen() {
  return (
    <div className="flex flex-col gap-4 h-full justify-center">
      <div className="flex flex-col gap-1.5">
        <span className="text-[11px] text-[var(--color-neutral-500)]">What document should clients see?</span>
        <div className="flex items-center gap-2.5 px-3.5 py-3 rounded-lg" style={{ background: "var(--color-surface)" }}>
          <span className="grid place-items-center" style={{ color: BRAND }}><IconDocuments size={15} /></span>
          <span className="text-[14px] flex-1">Service Agreement</span>
          <span className="text-[var(--color-neutral-500)]">▾</span>
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <span className="text-[11px] text-[var(--color-neutral-500)]">What are clients paying for?</span>
        <div className="flex items-center gap-2.5 px-3.5 py-3 rounded-lg" style={{ background: "var(--color-surface)" }}>
          <span className="grid place-items-center" style={{ color: BRAND }}><IconLink size={15} /></span>
          <span className="text-[14px] flex-1">Consulting deposit</span>
          <span className="text-[14px] font-medium">$2,000.00</span>
          <span className="text-[var(--color-neutral-500)]">▾</span>
        </div>
      </div>
    </div>
  );
}

function ShareScreen({ shared }: { shared: boolean }) {
  return (
    <div className="flex flex-col gap-4 h-full justify-center items-center">
      <div className="w-[420px] flex flex-col gap-3">
        <div className="flex gap-2.5">
          <div className="px-4 py-2.5 rounded-lg text-[13px] font-medium" style={{ background: "var(--color-accent)", color: "#0c0c10" }}>Publish branding</div>
          <div className="px-4 py-2.5 rounded-lg text-[13px] font-medium flex items-center gap-1.5" style={{ background: "var(--color-surface)", border: "1px solid var(--color-divider)" }}>
            <IconGlobe size={13} /> Create mini website
          </div>
        </div>
        <div className="flex items-center gap-2.5 px-3.5 py-3 rounded-lg" style={{ background: "var(--color-surface)", border: `1px solid ${shared ? `color-mix(in srgb, ${BRAND} 40%, transparent)` : "var(--color-divider)"}`, transition: "border 0.4s" }}>
          <span className="grid place-items-center" style={{ color: BRAND }}><IconLink size={15} /></span>
          <span className="font-mono text-[12.5px] flex-1 text-[var(--color-neutral-300)]">portal.atlaschambers.com</span>
          <span className="text-[11px] font-medium" style={{ color: shared ? BRAND : "var(--color-neutral-500)" }}>{shared ? "Copied!" : "Copy"}</span>
        </div>
        <div className="text-[11px] text-[var(--color-neutral-500)] text-center">One link. Your brand, your document, your price.</div>
      </div>
    </div>
  );
}

// The payoff: what the client actually sees — only Atlas Chambers, no Origin.
function BrandedPage({ paid }: { paid: boolean }) {
  return (
    <div className="h-full rounded-lg overflow-hidden flex flex-col" style={{ background: "#0c0c10", margin: -4 }}>
      <div className="flex items-center gap-2.5 px-5 py-3.5">
        <span className="w-7 h-7 rounded-lg grid place-items-center text-[14px] font-medium" style={{ background: `color-mix(in srgb, ${BRAND} 22%, transparent)`, color: BRAND }}>A</span>
        <span className="text-[14px] font-medium" style={{ color: "#f4f4f7" }}>Atlas Chambers</span>
        <div className="flex-1" />
        <span className="text-[12px] px-3.5 py-1.5 rounded-lg font-medium" style={{ background: BRAND, color: "#0c0c10" }}>Pay now</span>
      </div>
      <div className="flex-1 flex items-center justify-center gap-6 px-6">
        <div className="w-[46%] rounded-xl p-4 flex flex-col gap-2" style={{ background: "#141418", border: "1px solid #232329" }}>
          <span className="text-[10px] tracking-[.06em] uppercase" style={{ color: "#9a9aa4" }}>Document</span>
          <span className="text-[15px] font-medium" style={{ color: "#f4f4f7" }}>Service Agreement</span>
          <div className="h-px my-1" style={{ background: "#232329" }} />
          {[100, 88, 72].map((w, i) => (
            <span key={i} className="h-[3px] rounded-full" style={{ width: `${w}%`, background: "#2c2c34" }} />
          ))}
        </div>
        <div className="w-[42%] flex flex-col items-center gap-3">
          <span className="text-[11px] tracking-[.06em] uppercase" style={{ color: "#9a9aa4" }}>Consulting deposit</span>
          <span className="text-[30px] font-medium" style={{ color: "#f4f4f7" }}>$2,000.00</span>
          <div
            className="w-full rounded-lg text-center py-2.5 text-[14px] font-medium flex items-center justify-center gap-2"
            style={{ background: paid ? BRAND : BRAND, color: "#0c0c10", opacity: paid ? 1 : 0.95, transition: "opacity 0.3s" }}
          >
            {paid ? (<><IconCheckCircle size={15} /> Payment received</>) : (<>Pay $2,000.00 now <IconArrowRight size={14} /></>)}
          </div>
          <span className="font-mono text-[9px]" style={{ color: "#6b6b76" }}>Secured by Stripe · No Origin branding</span>
        </div>
      </div>
    </div>
  );
}
