"use client";

import { useRef, useState } from "react";

export default function TiltCard({
  children,
  maxTilt = 6,
  scale = 1.012,
  className = "",
  style,
  id,
}: {
  children: React.ReactNode;
  maxTilt?: number;
  scale?: number;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, active: false });

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: py * -maxTilt, y: px * maxTilt, active: true });
  }

  return (
    <div
      id={id}
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0, active: false })}
      className={className}
      style={{ perspective: 1400, ...style }}
    >
      <div
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${tilt.active ? scale : 1})`,
          transition: "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
          boxShadow: tilt.active
            ? "0 26px 50px -20px color-mix(in srgb, var(--color-accent) 28%, transparent), var(--shadow-md)"
            : "var(--shadow-md)",
          borderRadius: "inherit",
        }}
      >
        {children}
      </div>
    </div>
  );
}
