"use client";

import { useRef, useState } from "react";
import { IconWallet, IconSparkle, IconESign, IconGrid, IconLogoMark } from "@/components/icons";

const cards = [
  {
    key: "wallet",
    icon: IconWallet,
    label: "Business Wallet",
    tx: "-210px",
    ty: "-118px",
    tz: "70px",
    ry: "-8deg",
    delay: "0s",
    duration: "7.5s",
    content: (
      <>
        <div className="text-[9.5px] tracking-[.08em] uppercase text-[var(--color-neutral-500)]">Wallet balance</div>
        <div className="text-[17px] font-medium mt-0.5">$248,610.44</div>
        <div className="flex gap-[3px] mt-2 items-end h-5">
          {[6, 10, 8, 14, 11, 17].map((h, i) => (
            <span key={i} className="w-1.5 rounded-sm" style={{ height: h, background: "var(--color-accent)", opacity: 0.4 + i * 0.1 }} />
          ))}
        </div>
      </>
    ),
  },
  {
    key: "ai",
    icon: IconSparkle,
    label: "AI Assistant",
    tx: "210px",
    ty: "-132px",
    tz: "40px",
    ry: "8deg",
    delay: "1.4s",
    duration: "8.5s",
    content: (
      <>
        <div className="text-[9.5px] tracking-[.08em] uppercase text-[var(--color-neutral-500)]">Nex AI</div>
        <div
          className="text-[10.5px] leading-[1.4] mt-1.5 px-2 py-1.5 rounded-md text-[var(--color-neutral-300)]"
          style={{ background: "color-mix(in srgb, var(--color-accent-900) 55%, transparent)" }}
        >
          &ldquo;Draft an NDA for Northbeam Co.&rdquo;
        </div>
        <div className="text-[9px] text-[var(--color-neutral-500)] mt-1">Drafted in 8 seconds</div>
      </>
    ),
  },
  {
    key: "sign",
    icon: IconESign,
    label: "E-Signatures",
    tx: "-220px",
    ty: "128px",
    tz: "55px",
    ry: "-6deg",
    delay: "0.7s",
    duration: "8s",
    content: (
      <>
        <div className="text-[9.5px] tracking-[.08em] uppercase text-[var(--color-neutral-500)]">MSA · Halcyon Ventures</div>
        <div className="flex items-center gap-1.5 mt-1.5">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--color-accent)" }} />
          <span className="text-[12px] font-medium" style={{ color: "var(--color-accent-300)" }}>Signed &amp; sealed</span>
        </div>
        <div className="text-[9px] text-[var(--color-neutral-500)] mt-1">Certificate NX-CERT-8F21</div>
      </>
    ),
  },
  {
    key: "crm",
    icon: IconGrid,
    label: "Sales Pipeline",
    tx: "215px",
    ty: "138px",
    tz: "20px",
    ry: "7deg",
    delay: "2.1s",
    duration: "7s",
    content: (
      <>
        <div className="text-[9.5px] tracking-[.08em] uppercase text-[var(--color-neutral-500)]">Pipeline value</div>
        <div className="text-[17px] font-medium mt-0.5">$188,800</div>
        <div className="flex gap-1 mt-2">
          {[1, 1, 1, 1].map((_, i) => (
            <span key={i} className="flex-1 h-1.5 rounded-full" style={{ background: i < 3 ? "var(--color-accent)" : "var(--color-neutral-800)", opacity: 0.3 + i * 0.2 }} />
          ))}
        </div>
      </>
    ),
  },
];

const lines = [
  { angle: 209, length: 240 },
  { angle: -32, length: 245 },
  { angle: 150, length: 250 },
  { angle: -33, length: 255 },
];

export default function Overview3D() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = sceneRef.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: py * -14, y: px * 16 });
  }

  return (
    <section className="max-w-[1160px] mx-auto px-6 pt-[72px]">
      <div className="text-center max-w-[560px] mx-auto">
        <span className="card-kicker">How Nex works</span>
        <h3 className="text-[27px] mt-2.5 tracking-[-0.015em]">Every part of your business, in one orbit.</h3>
        <p className="text-sm text-[var(--color-neutral-400)] leading-[1.65] mt-2.5">
          Money, AI, documents and clients stay connected — one platform quietly running everything behind your brand.
        </p>
      </div>

      {/* Mobile fallback: static grid, no absolute 3D positioning (avoids off-screen overflow on narrow viewports) */}
      <div className="md:hidden mt-10 flex flex-col items-center gap-6">
        <div className="nx-hub-glow rounded-xl">
          <IconLogoMark size={48} />
        </div>
        <div className="grid grid-cols-2 gap-3 w-full">
          {cards.map((card) => (
            <div key={card.key} className="card elev-md gap-0" style={{ padding: "12px 14px" }}>
              <div className="flex items-center gap-1.5 mb-2">
                <card.icon size={13} className="text-[var(--color-accent)]" />
                <span className="text-[10.5px] font-medium">{card.label}</span>
              </div>
              {card.content}
            </div>
          ))}
        </div>
      </div>

      <div
        ref={sceneRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setTilt({ x: 0, y: 0 })}
        className="hidden md:block relative mt-10 mx-auto select-none"
        style={{ height: 420, maxWidth: 720, perspective: 1400 }}
      >
        <div
          className="absolute inset-0"
          style={{
            transformStyle: "preserve-3d",
            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            transition: "transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          {lines.map((l, i) => (
            <div
              key={i}
              className="absolute left-1/2 top-1/2"
              style={{
                width: l.length,
                height: 1,
                transformOrigin: "0 0",
                transform: `rotate(${l.angle}deg)`,
                background:
                  "linear-gradient(to right, color-mix(in srgb, var(--color-accent) 35%, transparent), transparent)",
              }}
            />
          ))}

          <div
            className="nx-hub-glow absolute left-1/2 top-1/2"
            style={{ transform: "translate3d(-50%, -50%, 90px)" }}
          >
            <IconLogoMark size={56} />
          </div>

          {cards.map((card) => (
            <div
              key={card.key}
              className="nx-orbit-card absolute left-1/2 top-1/2 w-[168px] card elev-md gap-0"
              style={
                {
                  "--tx": `calc(${card.tx} - 84px)`,
                  "--ty": `calc(${card.ty} - 44px)`,
                  "--tz": card.tz,
                  "--ry": card.ry,
                  animationDelay: card.delay,
                  animationDuration: card.duration,
                  padding: "12px 14px",
                } as React.CSSProperties
              }
            >
              <div className="flex items-center gap-1.5 mb-2">
                <card.icon size={13} className="text-[var(--color-accent)]" />
                <span className="text-[10.5px] font-medium">{card.label}</span>
              </div>
              {card.content}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
