"use client";

import { useEffect, useRef, useState } from "react";
import { IconGlobe, IconDocuments, IconLink, IconArrowRight, IconCheckCircle, IconPerson } from "@/components/icons";

// Two perspectives, one story. First the MANAGER builds the page — brand,
// document, price — with a live preview updating as they go. Then it flips to
// the CLIENT's view: the finished branded page they land on, and pay. ~7s loop.
const ORIGIN = "#9184d9";
const BRAND = "#63c3b2"; // the tenant's own brand color (Atlas Chambers)

const STAGES = [
  { role: "manager", url: "app.origin.io/whitelabel", label: "Set the brand", color: ORIGIN, cursor: { x: 300, y: 268, click: true } },
  { role: "manager", url: "app.origin.io/whitelabel", label: "Add the document", color: ORIGIN, cursor: { x: 250, y: 175, click: true } },
  { role: "manager", url: "app.origin.io/whitelabel", label: "Price & publish", color: ORIGIN, cursor: { x: 150, y: 330, click: true } },
  { role: "client", url: "portal.atlaschambers.com", label: "Client opens it", color: BRAND, cursor: { x: 250, y: 250, click: false } },
  { role: "client", url: "portal.atlaschambers.com", label: "Client pays", color: BRAND, cursor: { x: 610, y: 322, click: true } },
] as const;

const DESIGN_W = 960;
const DESIGN_H = 560;
const WINDOW_W = 900;
const STEP_MS = 1400;

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
  const isManager = stage.role === "manager";

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
            {/* role badge — whose screen you're watching */}
            <div className="flex justify-center mb-3" style={{ transform: "translateZ(20px)" }}>
              <div
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full"
                style={{ background: `color-mix(in srgb, ${stage.color} 16%, transparent)`, border: `1px solid color-mix(in srgb, ${stage.color} 45%, transparent)`, transition: "all 0.5s ease" }}
              >
                <span className="grid place-items-center" style={{ color: stage.color }}>
                  {isManager ? <IconPerson size={13} /> : <IconGlobe size={13} />}
                </span>
                <span className="text-[12px] font-medium" style={{ color: "var(--color-text)" }}>
                  {isManager ? "Manager · building the page" : "Client · what they actually see"}
                </span>
              </div>
            </div>

            {/* the app window */}
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

              <div className="relative" style={{ height: 400, background: "var(--color-bg)" }}>
                {/* MANAGER ACT — building, with live preview */}
                <Act visible={isManager}>
                  <ManagerView step={step} />
                </Act>
                {/* CLIENT ACT — the finished branded page */}
                <Act visible={!isManager}>
                  <BrandedPage hasDoc hasPrice paid={step === 4} big />
                </Act>
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
                      style={{ left: 3, top: 3, width: 34, height: 34, border: `2px solid ${stage.color}`, animation: "nx-cursor-ripple 0.9s ease-out 0.6s" }}
                    />
                  )}
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    key={`cursor-${step}`}
                    style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))", animation: stage.cursor.click ? "nx-cursor-dip 0.9s ease 0.6s" : "none" }}
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

function Act({ visible, children }: { visible: boolean; children: React.ReactNode }) {
  return (
    <div
      className="absolute inset-0"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0)" : "translateX(24px)",
        transition: "opacity 0.55s cubic-bezier(0.22,1,0.36,1), transform 0.55s cubic-bezier(0.22,1,0.36,1)",
        pointerEvents: "none",
      }}
    >
      {children}
    </div>
  );
}

// The manager's screen: config controls on the left, a LIVE PREVIEW on the
// right that builds up as they configure (brand → document → price).
function ManagerView({ step }: { step: number }) {
  const swatches = ["#9184d9", "#e0a35b", "#7fa3e8", "#63c3b2"];
  const hasDoc = step >= 1;
  const hasPrice = step >= 2;
  return (
    <div className="flex gap-4 h-full p-5">
      {/* config controls */}
      <div className="w-[42%] flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <IconGlobe size={15} className="text-[var(--color-accent)]" />
          <span className="text-[11px] tracking-[.06em] uppercase text-[var(--color-neutral-500)]">White-label setup</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] text-[var(--color-neutral-500)]">Company name</span>
          <div className="px-3 py-2 rounded-lg text-[12.5px]" style={{ background: "var(--color-surface)" }}>Atlas Chambers</div>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] text-[var(--color-neutral-500)]">Brand color</span>
          <div className="flex gap-2">
            {swatches.map((c) => (
              <span key={c} className="w-6 h-6 rounded-md" style={{ background: c, outline: c === BRAND ? "2px solid var(--color-text)" : "none", outlineOffset: 2 }} />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] text-[var(--color-neutral-500)]">Document clients see</span>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-[12px]" style={{ background: "var(--color-surface)", opacity: hasDoc ? 1 : 0.5, transition: "opacity 0.4s" }}>
            <span className="grid place-items-center" style={{ color: BRAND }}><IconDocuments size={13} /></span>
            <span className="flex-1">{hasDoc ? "Service Agreement" : "Select…"}</span>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] text-[var(--color-neutral-500)]">They&rsquo;re paying for</span>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-[12px]" style={{ background: "var(--color-surface)", opacity: hasPrice ? 1 : 0.5, transition: "opacity 0.4s" }}>
            <span className="grid place-items-center" style={{ color: BRAND }}><IconLink size={13} /></span>
            <span className="flex-1">{hasPrice ? "Consulting deposit" : "Select…"}</span>
            {hasPrice && <span className="font-medium">$2,000</span>}
          </div>
        </div>
        <div
          className="mt-1 px-3 py-2 rounded-lg text-[12px] font-medium text-center flex items-center justify-center gap-1.5"
          style={{ background: hasPrice ? "var(--color-accent)" : "var(--color-surface)", color: hasPrice ? "#0c0c10" : "var(--color-neutral-500)", transition: "all 0.4s" }}
        >
          {hasPrice ? (<><IconCheckCircle size={13} /> Published</>) : "Publish branding"}
        </div>
      </div>

      {/* live preview */}
      <div className="flex-1 flex flex-col gap-1.5 min-w-0">
        <span className="text-[10px] tracking-[.08em] uppercase text-[var(--color-neutral-500)] pl-0.5">Live preview · what clients will see</span>
        <div className="flex-1 rounded-lg overflow-hidden border" style={{ borderColor: "var(--color-divider)" }}>
          <BrandedPage hasDoc={hasDoc} hasPrice={hasPrice} paid={false} big={false} />
        </div>
      </div>
    </div>
  );
}

// The branded page the client sees — no Origin anywhere. Reused as the live
// preview (small) and the full client view (big).
function BrandedPage({ hasDoc, hasPrice, paid, big }: { hasDoc: boolean; hasPrice: boolean; paid: boolean; big: boolean }) {
  const f = big ? 1 : 0.72;
  return (
    <div className="h-full overflow-hidden flex flex-col" style={{ background: "#0c0c10" }}>
      <div className="flex items-center gap-2.5" style={{ padding: `${12 * f}px ${16 * f}px` }}>
        <span className="rounded-lg grid place-items-center font-medium" style={{ width: 28 * f, height: 28 * f, fontSize: 14 * f, background: `color-mix(in srgb, ${BRAND} 22%, transparent)`, color: BRAND }}>A</span>
        <span className="font-medium" style={{ fontSize: 14 * f, color: "#f4f4f7" }}>Atlas Chambers</span>
        <div className="flex-1" />
        {hasPrice && <span className="rounded-lg font-medium" style={{ fontSize: 12 * f, padding: `${6 * f}px ${13 * f}px`, background: BRAND, color: "#0c0c10" }}>Pay now</span>}
      </div>
      <div className="flex-1 flex items-center justify-center" style={{ gap: 24 * f, padding: `0 ${24 * f}px` }}>
        {hasDoc ? (
          <div className="rounded-xl flex flex-col" style={{ width: "46%", padding: 16 * f, gap: 8 * f, background: "#141418", border: "1px solid #232329" }}>
            <span className="tracking-[.06em] uppercase" style={{ fontSize: 10 * f, color: "#9a9aa4" }}>Document</span>
            <span className="font-medium" style={{ fontSize: 15 * f, color: "#f4f4f7" }}>Service Agreement</span>
            <div style={{ height: 1, margin: `${4 * f}px 0`, background: "#232329" }} />
            {[100, 88, 72].map((w, i) => (
              <span key={i} className="rounded-full" style={{ width: `${w}%`, height: 3 * f, background: "#2c2c34" }} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl grid place-items-center text-center" style={{ width: "60%", height: "50%", border: "1px dashed #2c2c34", color: "#6b6b76", fontSize: 11 * f }}>
            Your page builds here as you configure it
          </div>
        )}
        {hasPrice && (
          <div className="flex flex-col items-center" style={{ width: "42%", gap: 12 * f }}>
            <span className="tracking-[.06em] uppercase" style={{ fontSize: 11 * f, color: "#9a9aa4" }}>Consulting deposit</span>
            <span className="font-medium" style={{ fontSize: 30 * f, color: "#f4f4f7" }}>$2,000.00</span>
            <div
              className="w-full rounded-lg text-center flex items-center justify-center"
              style={{ padding: `${10 * f}px 0`, fontSize: 14 * f, gap: 8 * f, background: BRAND, color: "#0c0c10" }}
            >
              {paid ? (<><IconCheckCircle size={15 * f} /> Payment received</>) : (<>Pay $2,000.00 <IconArrowRight size={14 * f} /></>)}
            </div>
            <span className="font-mono" style={{ fontSize: 9 * f, color: "#6b6b76" }}>Secured by Stripe · No Origin branding</span>
          </div>
        )}
      </div>
    </div>
  );
}
