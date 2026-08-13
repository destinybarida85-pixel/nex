"use client";

import { useEffect, useRef } from "react";

// A real, continuous animation — not a looping video, not a static image.
// Each ant is a plain positioned <div> holding an inline SVG silhouette;
// position/rotation are written directly to style.transform inside a
// requestAnimationFrame loop (refs, not React state) so N ants can move every
// frame without triggering a re-render per ant per tick. Kept deliberately
// monochrome/accent-tinted rather than literal ant photography — the brief
// asked for "elegant and minimal, not childish or cartoonish," and a
// silhouette reads as a premium interactive system where a full-color
// illustration would read as a game sprite.
const ANT_SVG = `
<svg viewBox="0 0 64 30" width="30" height="14" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g stroke="currentColor" stroke-width="1.3" stroke-linecap="round" opacity="0.85">
    <path class="leg-a" d="M22 15 L14 8 M22 15 L12 15 M22 15 L14 22" />
    <path class="leg-b" d="M30 14 L24 6 M30 14 L22 20" />
    <path class="leg-a" d="M38 15 L46 8 M38 15 L48 15 M38 15 L46 22" />
  </g>
  <path d="M6 14.5 Q2 10 5 6" stroke="currentColor" stroke-width="1.1" fill="none" stroke-linecap="round" opacity="0.7" />
  <path d="M7 15.5 Q4 12.5 6 9.5" stroke="currentColor" stroke-width="1.1" fill="none" stroke-linecap="round" opacity="0.7" />
  <ellipse cx="9" cy="15" rx="5.2" ry="4.4" fill="currentColor" />
  <ellipse cx="19" cy="14.5" rx="4.6" ry="3.8" fill="currentColor" />
  <ellipse cx="34" cy="15" rx="10.5" ry="7" fill="currentColor" />
</svg>`.trim();

const BLOCK_SIZE = 12;
const ANT_COUNT = 7;
const CARRY_OFFSET_Y = -10;

type Phase = "wander" | "toCenter" | "leaving";

type Ant = {
  el: HTMLDivElement;
  legWrap: HTMLDivElement;
  x: number;
  y: number;
  angle: number;
  targetX: number;
  targetY: number;
  phase: Phase;
  speed: number;
  carrying: boolean;
  waitUntil: number;
};

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

export default function LiveAntScene({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const layer = layerRef.current;
    const stack = stackRef.current;
    if (!container || !layer || !stack) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let width = container.clientWidth;
    let height = container.clientHeight;
    const centerX = () => width / 2;
    const centerY = () => height / 2;

    const ants: Ant[] = [];
    for (let i = 0; i < ANT_COUNT; i++) {
      const el = document.createElement("div");
      el.style.position = "absolute";
      el.style.left = "0";
      el.style.top = "0";
      el.style.color = i % 3 === 0 ? "var(--color-accent, #9184d9)" : "rgba(255,255,255,0.55)";
      el.style.willChange = "transform";
      el.innerHTML = ANT_SVG;
      layer.appendChild(el);

      const legWrap = el as HTMLDivElement;
      const x = rand(0, width);
      const y = rand(0, height);
      ants.push({
        el,
        legWrap,
        x,
        y,
        angle: rand(0, 360),
        targetX: rand(0, width),
        targetY: rand(0, height),
        phase: "wander",
        speed: rand(14, 26),
        carrying: false,
        waitUntil: 0,
      });
    }

    let blocksDelivered = 0;
    const MAX_STACK = 6;

    function growStack() {
      if (blocksDelivered >= MAX_STACK) return;
      blocksDelivered++;
      const cube = document.createElement("div");
      const size = BLOCK_SIZE + blocksDelivered * 1.4;
      const row = Math.floor((blocksDelivered - 1) / 3);
      const col = (blocksDelivered - 1) % 3;
      cube.style.position = "absolute";
      cube.style.left = `calc(50% + ${(col - 1) * (size + 2)}px)`;
      cube.style.bottom = `${row * (size + 2)}px`;
      cube.style.width = `${size}px`;
      cube.style.height = `${size}px`;
      cube.style.transform = "translate(-50%, 0) scale(0.4)";
      cube.style.borderRadius = "2px";
      cube.style.background = "linear-gradient(160deg, var(--color-accent, #9184d9), color-mix(in srgb, var(--color-accent, #9184d9) 60%, #fff))";
      cube.style.boxShadow = "0 0 14px color-mix(in srgb, var(--color-accent, #9184d9) 70%, transparent)";
      cube.style.opacity = "0";
      cube.style.transition = "transform 0.5s cubic-bezier(.34,1.56,.64,1), opacity 0.4s";
      stack.appendChild(cube);
      requestAnimationFrame(() => {
        cube.style.opacity = "1";
        cube.style.transform = "translate(-50%, 0) scale(1)";
      });
    }

    function pickNewWanderTarget(a: Ant) {
      a.targetX = rand(width * 0.06, width * 0.94);
      a.targetY = rand(height * 0.12, height * 0.94);
    }

    let last = performance.now();
    let raf = 0;

    function tick(now: number) {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      for (const a of ants) {
        if (now < a.waitUntil) {
          raf = requestAnimationFrame(tick);
          continue;
        }

        const dx = a.targetX - a.x;
        const dy = a.targetY - a.y;
        const dist = Math.hypot(dx, dy);

        if (dist < 4) {
          if (a.phase === "wander") {
            // Occasionally decide to head to the structure with a "block."
            if (Math.random() < 0.35 && blocksDelivered < MAX_STACK) {
              a.phase = "toCenter";
              a.carrying = true;
              a.targetX = centerX() + rand(-14, 14);
              a.targetY = centerY() + rand(6, 20);
            } else {
              a.waitUntil = now + rand(300, 1400);
              pickNewWanderTarget(a);
            }
          } else if (a.phase === "toCenter") {
            a.carrying = false;
            growStack();
            a.phase = "leaving";
            a.waitUntil = now + rand(150, 400);
            pickNewWanderTarget(a);
          } else {
            a.phase = "wander";
          }
        } else {
          const angle = Math.atan2(dy, dx);
          a.angle = (angle * 180) / Math.PI;
          const step = a.speed * dt;
          a.x += Math.cos(angle) * step;
          a.y += Math.sin(angle) * step;
        }

        const facingFlip = Math.abs(a.angle) > 90 ? "scaleY(-1)" : "";
        const carryLift = a.carrying ? CARRY_OFFSET_Y : 0;
        a.el.style.transform = `translate(${a.x}px, ${a.y + carryLift}px) rotate(${facingFlip ? a.angle - 180 : a.angle}deg) ${facingFlip}`;
      }

      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);

    const onResize = () => {
      width = container.clientWidth;
      height = container.clientHeight;
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      layer.innerHTML = "";
      stack.innerHTML = "";
    };
  }, []);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`} style={style}>
      <div
        className="absolute rounded-full"
        style={{
          left: "50%",
          top: "50%",
          width: 220,
          height: 220,
          transform: "translate(-50%, -50%)",
          background: "radial-gradient(circle, color-mix(in srgb, var(--color-accent) 22%, transparent), transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        ref={stackRef}
        className="absolute"
        style={{ left: "50%", bottom: "38%", width: 1, height: 1, pointerEvents: "none" }}
      />
      <div ref={layerRef} className="absolute inset-0" style={{ pointerEvents: "none" }} />
    </div>
  );
}
