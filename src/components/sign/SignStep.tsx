"use client";

import { useEffect, useRef, useState } from "react";
import { IconPen } from "@/components/icons";

export default function SignStep({
  onContinue,
  onBack,
}: {
  onContinue: (signature: string) => void;
  onBack: () => void;
}) {
  const [mode, setMode] = useState<"type" | "draw">("type");
  const [typedName, setTypedName] = useState("Halcyon Ventures");
  const [hasDrawn, setHasDrawn] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawing = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.strokeStyle = "#e9e9ed";
    ctx.lineWidth = 2.4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, [mode]);

  function point(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function start(e: React.PointerEvent<HTMLCanvasElement>) {
    drawing.current = true;
    setHasDrawn(true);
    const ctx = canvasRef.current!.getContext("2d")!;
    const p = point(e);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
  }
  function move(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current) return;
    const ctx = canvasRef.current!.getContext("2d")!;
    const p = point(e);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
  }
  function end() {
    drawing.current = false;
  }
  function clearCanvas() {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  }

  const canSign = mode === "type" ? typedName.trim().length > 1 : hasDrawn;

  function adopt() {
    if (mode === "type") {
      onContinue(typedName.trim());
    } else {
      onContinue(canvasRef.current?.toDataURL() ?? "signature");
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <IconPen size={18} className="text-[var(--color-accent)]" />
        <div>
          <h4 className="m-0 text-[18px]">Adopt your signature</h4>
          <div className="text-[12px] text-[var(--color-neutral-500)] mt-0.5">MSA — Halcyon Ventures</div>
        </div>
      </div>

      <div className="seg self-start">
        <label className="seg-opt">
          <input type="radio" name="sigmode" checked={mode === "type"} onChange={() => setMode("type")} />
          <span>Type</span>
        </label>
        <label className="seg-opt">
          <input type="radio" name="sigmode" checked={mode === "draw"} onChange={() => setMode("draw")} />
          <span>Draw</span>
        </label>
      </div>

      {mode === "type" ? (
        <div className="flex flex-col gap-3">
          <input
            className="input"
            value={typedName}
            onChange={(e) => setTypedName(e.target.value)}
            placeholder="Type your full name"
          />
          <div
            className="rounded-xl flex items-center justify-center"
            style={{ background: "var(--color-surface)", height: 120, boxShadow: "var(--shadow-sm)" }}
          >
            <span style={{ fontFamily: "cursive", fontSize: 34, color: "var(--color-text)" }}>{typedName || " "}</span>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <canvas
            ref={canvasRef}
            width={400}
            height={140}
            className="rounded-xl w-full cursor-crosshair touch-none"
            style={{ background: "var(--color-surface)", boxShadow: "var(--shadow-sm)", height: 140 }}
            onPointerDown={start}
            onPointerMove={move}
            onPointerUp={end}
            onPointerLeave={end}
          />
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[var(--color-neutral-500)]">Draw your signature above</span>
            <button className="btn btn-ghost text-[12px]" onClick={clearCanvas}>Clear</button>
          </div>
        </div>
      )}

      <div className="text-[11px] leading-[1.5] text-[var(--color-neutral-500)]">
        By clicking &ldquo;Adopt &amp; sign&rdquo;, you agree this represents your legal signature on this document, with the same effect as a handwritten signature.
      </div>

      <button className="btn btn-primary btn-block" disabled={!canSign} onClick={adopt}>
        Adopt &amp; sign
      </button>
      <button className="btn btn-secondary btn-block" style={{ marginTop: 0 }} onClick={onBack}>
        Back
      </button>
    </div>
  );
}
