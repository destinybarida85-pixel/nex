"use client";

import { useRef, useState } from "react";
import {
  IconWallet,
  IconSparkle,
  IconESign,
  IconGrid,
  IconAnalytics,
  IconCalendar,
  IconPayments,
  IconGlobe,
  IconLogoMark,
} from "@/components/icons";

const ORBIT_RX = 335;
const ORBIT_RY = 208;

function polar(angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: Math.round(Math.cos(rad) * ORBIT_RX), y: Math.round(Math.sin(rad) * ORBIT_RY) };
}

type CardDef = {
  key: string;
  angle: number;
  tz: number;
  icon: typeof IconWallet;
  label: string;
  color: string;
  delay: string;
  duration: string;
  content: React.ReactNode;
};

const cardDefs: CardDef[] = [
  {
    key: "wallet",
    angle: 205,
    tz: 70,
    icon: IconWallet,
    label: "Business Wallet",
    color: "#9184d9",
    delay: "0s",
    duration: "7.5s",
    content: (
      <>
        <div className="text-[9.5px] tracking-[.08em] uppercase text-[var(--color-neutral-500)]">Wallet balance</div>
        <div className="text-[17px] font-medium mt-0.5">$248,610.44</div>
        <div className="flex gap-[3px] mt-2 items-end h-5">
          {[6, 10, 8, 14, 11, 17].map((h, i) => (
            <span key={i} className="w-1.5 rounded-sm" style={{ height: h, background: "#9184d9", opacity: 0.4 + i * 0.1 }} />
          ))}
        </div>
      </>
    ),
  },
  {
    key: "ai",
    angle: -20,
    tz: 40,
    icon: IconSparkle,
    label: "AI Assistant",
    color: "#7fa3e8",
    delay: "1.4s",
    duration: "8.5s",
    content: (
      <>
        <div className="text-[9.5px] tracking-[.08em] uppercase text-[var(--color-neutral-500)]">Nex AI</div>
        <div
          className="text-[10.5px] leading-[1.4] mt-1.5 px-2 py-1.5 rounded-md text-[var(--color-neutral-300)]"
          style={{ background: "color-mix(in srgb, #7fa3e8 20%, transparent)" }}
        >
          &ldquo;Draft an NDA for Northbeam Co.&rdquo;
        </div>
        <div className="text-[9px] text-[var(--color-neutral-500)] mt-1">Drafted in 8 seconds</div>
      </>
    ),
  },
  {
    key: "sign",
    angle: 160,
    tz: 55,
    icon: IconESign,
    label: "E-Signatures",
    color: "#63c3b2",
    delay: "0.7s",
    duration: "8s",
    content: (
      <>
        <div className="text-[9.5px] tracking-[.08em] uppercase text-[var(--color-neutral-500)]">MSA · Halcyon Ventures</div>
        <div className="flex items-center gap-1.5 mt-1.5">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#63c3b2" }} />
          <span className="text-[12px] font-medium" style={{ color: "#63c3b2" }}>Signed &amp; sealed</span>
        </div>
        <div className="text-[9px] text-[var(--color-neutral-500)] mt-1">Certificate NX-CERT-8F21</div>
      </>
    ),
  },
  {
    key: "crm",
    angle: 25,
    tz: 20,
    icon: IconGrid,
    label: "Sales Pipeline",
    color: "#d9a05b",
    delay: "2.1s",
    duration: "7s",
    content: (
      <>
        <div className="text-[9.5px] tracking-[.08em] uppercase text-[var(--color-neutral-500)]">Pipeline value</div>
        <div className="text-[17px] font-medium mt-0.5">$188,800</div>
        <div className="flex gap-1 mt-2">
          {[1, 1, 1, 1].map((_, i) => (
            <span key={i} className="flex-1 h-1.5 rounded-full" style={{ background: i < 3 ? "#d9a05b" : "var(--color-neutral-800)", opacity: 0.3 + i * 0.2 }} />
          ))}
        </div>
      </>
    ),
  },
  {
    key: "analytics",
    angle: 70,
    tz: 65,
    icon: IconAnalytics,
    label: "Analytics",
    color: "#c98bd9",
    delay: "0.35s",
    duration: "8s",
    content: (
      <>
        <div className="text-[9.5px] tracking-[.08em] uppercase text-[var(--color-neutral-500)]">Revenue trend</div>
        <div className="text-[17px] font-medium mt-0.5" style={{ color: "#c98bd9" }}>▲ 18.4%</div>
        <svg viewBox="0 0 90 20" className="w-full h-4 mt-1.5" role="presentation">
          <polyline points="0,17 15,12 30,14 45,7 60,9 75,3 90,5" fill="none" stroke="#c98bd9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.85" />
        </svg>
      </>
    ),
  },
  {
    key: "payments",
    angle: 115,
    tz: 30,
    icon: IconPayments,
    label: "Payments",
    color: "#8bc98b",
    delay: "1.05s",
    duration: "7.2s",
    content: (
      <>
        <div className="text-[9.5px] tracking-[.08em] uppercase text-[var(--color-neutral-500)]">Payment links</div>
        <div className="text-[17px] font-medium mt-0.5">$42,900</div>
        <div className="w-full h-[5px] rounded-full mt-2" style={{ background: "var(--color-neutral-800)" }}>
          <div className="h-full rounded-full" style={{ width: "72%", background: "#8bc98b" }} />
        </div>
      </>
    ),
  },
  {
    key: "calendar",
    angle: 250,
    tz: 50,
    icon: IconCalendar,
    label: "Calendar",
    color: "#e2867a",
    delay: "1.75s",
    duration: "7.8s",
    content: (
      <>
        <div className="text-[9.5px] tracking-[.08em] uppercase text-[var(--color-neutral-500)]">Today</div>
        <div className="text-[17px] font-medium mt-0.5">4 events</div>
        <div className="flex gap-1 mt-2">
          {[0, 1, 2, 3, 4, 5, 6].map((d) => (
            <span
              key={d}
              className="flex-1 h-[7px] rounded-full"
              style={{ background: d === 3 ? "#e2867a" : "var(--color-neutral-800)", opacity: d === 3 ? 1 : 0.6 }}
            />
          ))}
        </div>
      </>
    ),
  },
  {
    key: "whitelabel",
    angle: 295,
    tz: 25,
    icon: IconGlobe,
    label: "White-label",
    color: "#6fb8c9",
    delay: "2.45s",
    duration: "8.2s",
    content: (
      <>
        <div className="text-[9.5px] tracking-[.08em] uppercase text-[var(--color-neutral-500)]">Client portal</div>
        <div className="flex items-center gap-1.5 mt-1.5">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#6fb8c9" }} />
          <span className="text-[12px] font-medium" style={{ color: "#6fb8c9" }}>Live</span>
        </div>
        <div className="text-[9px] text-[var(--color-neutral-500)] mt-1">portal.yourbrand.com</div>
      </>
    ),
  },
];

const cards = cardDefs.map((c) => {
  const { x, y } = polar(c.angle);
  const ry = Math.round((x / ORBIT_RX) * 9);
  return { ...c, x, y, ry };
});

const lines = cards.map((c) => {
  const angle = (Math.atan2(c.y, c.x) * 180) / Math.PI;
  const length = Math.round(Math.sqrt(c.x * c.x + c.y * c.y) * 1.04);
  return { angle, length, color: c.color };
});

const particles = [
  { left: "6%", top: "18%", size: 4, delay: "0s", duration: "9s", tz: 30 },
  { left: "88%", top: "12%", size: 3, delay: "1.2s", duration: "11s", tz: -20 },
  { left: "12%", top: "78%", size: 5, delay: "2.4s", duration: "10s", tz: 50 },
  { left: "92%", top: "72%", size: 3, delay: "0.6s", duration: "8s", tz: -10 },
  { left: "50%", top: "3%", size: 3, delay: "3s", duration: "12s", tz: 10 },
  { left: "47%", top: "95%", size: 4, delay: "1.8s", duration: "9.5s", tz: -30 },
  { left: "22%", top: "46%", size: 3, delay: "2.6s", duration: "10.5s", tz: 60 },
  { left: "76%", top: "42%", size: 4, delay: "0.9s", duration: "11.5s", tz: -40 },
  { left: "34%", top: "10%", size: 3, delay: "3.6s", duration: "9.8s", tz: 20 },
  { left: "64%", top: "88%", size: 3, delay: "1.5s", duration: "10.8s", tz: -25 },
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
          Money, AI, documents, clients and operations stay connected — one platform quietly running everything behind your brand.
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
                <span
                  className="w-5 h-5 rounded-[6px] grid place-items-center flex-none"
                  style={{ background: `color-mix(in srgb, ${card.color} 20%, transparent)`, color: card.color }}
                >
                  <card.icon size={11} />
                </span>
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
        style={{ height: 580, maxWidth: 980, perspective: 1600 }}
      >
        <div
          className="absolute inset-0"
          style={{
            transformStyle: "preserve-3d",
            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            transition: "transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          {particles.map((p, i) => (
            <span
              key={i}
              className="nx-particle absolute rounded-full"
              style={
                {
                  left: p.left,
                  top: p.top,
                  width: p.size,
                  height: p.size,
                  background: "var(--color-accent)",
                  animationDelay: p.delay,
                  animationDuration: p.duration,
                  "--tz": `${p.tz}px`,
                } as React.CSSProperties
              }
            />
          ))}

          {lines.map((l, i) => (
            <div
              key={i}
              className="nx-orbit-line absolute left-1/2 top-1/2"
              style={
                {
                  width: l.length,
                  height: 1,
                  transformOrigin: "0 0",
                  transform: `rotate(${l.angle}deg)`,
                  background: `linear-gradient(to right, color-mix(in srgb, ${l.color} 55%, transparent), transparent)`,
                  animationDelay: `${i * 0.3}s`,
                } as React.CSSProperties
              }
            />
          ))}

          <svg
            className="nx-hub-ring absolute left-1/2 top-1/2"
            style={{ width: 150, height: 150, transform: "translate3d(-75px, -75px, 88px)" }}
            viewBox="0 0 150 150"
            role="presentation"
          >
            <circle cx="75" cy="75" r="68" fill="none" stroke="var(--color-accent)" strokeOpacity="0.28" strokeWidth="1" strokeDasharray="2 7" strokeLinecap="round" />
          </svg>

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
                  "--tx": `calc(${card.x}px - 84px)`,
                  "--ty": `calc(${card.y}px - 44px)`,
                  "--tz": `${card.tz}px`,
                  "--ry": `${card.ry}deg`,
                  "--card-color": card.color,
                  animationDelay: card.delay,
                  animationDuration: card.duration,
                  padding: "12px 14px",
                } as React.CSSProperties
              }
            >
              <div className="flex items-center gap-1.5 mb-2">
                <span
                  className="w-5 h-5 rounded-[6px] grid place-items-center flex-none"
                  style={{ background: `color-mix(in srgb, ${card.color} 20%, transparent)`, color: card.color }}
                >
                  <card.icon size={11} />
                </span>
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
