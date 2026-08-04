"use client";

import { useEffect, useRef, useState } from "react";
import { IconPen, IconCamera } from "@/components/icons";

const penColors = [
  { id: "black", label: "Black", value: "#181818" },
  { id: "blue", label: "Blue", value: "#1d4ed8" },
  { id: "red", label: "Red", value: "#b91c1c" },
];

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function SignStep({
  documentTitle,
  onContinue,
  onBack,
}: {
  documentTitle?: string;
  onContinue: (signature: string, fullName: string) => void;
  onBack: () => void;
}) {
  // "upload" is signing physically: sign on paper the ordinary way, then
  // photograph or scan just the signature and attach that image — as opposed
  // to "type"/"draw", which are both signed electronically, right here on
  // screen. All three end up as the same kind of value (a data URL or plain
  // text) passed to onContinue, so nothing downstream needs to know which one
  // was used.
  const [mode, setMode] = useState<"type" | "draw" | "upload">("type");
  const [typedName, setTypedName] = useState("");
  const [hasDrawn, setHasDrawn] = useState(false);
  const [penColor, setPenColor] = useState(penColors[0].value);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawing = useRef(false);
  const [uploadedSignature, setUploadedSignature] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.strokeStyle = penColor;
    ctx.lineWidth = 2.2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, [mode, penColor]);

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

  const canSign =
    typedName.trim().length > 1 &&
    (mode === "type" || (mode === "draw" && hasDrawn) || (mode === "upload" && !!uploadedSignature));

  function adopt() {
    const fullName = typedName.trim();
    if (mode === "type") {
      onContinue(fullName, fullName);
    } else if (mode === "upload") {
      onContinue(uploadedSignature ?? "signature", fullName);
    } else {
      onContinue(canvasRef.current?.toDataURL() ?? "signature", fullName);
    }
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setUploadError("That doesn't look like an image — try a photo or scan.");
      return;
    }
    setUploadError("");
    try {
      setUploadedSignature(await readAsDataUrl(file));
    } catch {
      setUploadError("Couldn't read that file — try again.");
    }
  }

  const penPicker = (
    <div className="flex items-center gap-2">
      <span className="text-[11px] text-[var(--color-neutral-500)]">Pen color</span>
      {penColors.map((p) => (
        <button
          key={p.id}
          type="button"
          aria-label={p.label}
          onClick={() => setPenColor(p.value)}
          className="w-[18px] h-[18px] rounded-full cursor-pointer"
          style={{ background: p.value, outline: penColor === p.value ? "2px solid var(--color-text)" : "none", outlineOffset: 2 }}
        />
      ))}
    </div>
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <IconPen size={18} className="text-[var(--color-accent)]" />
        <div>
          <h4 className="m-0 text-[18px]">Adopt your signature</h4>
          {documentTitle && <div className="text-[13px] text-[var(--color-neutral-500)] mt-0.5">{documentTitle}</div>}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="text-[11px] text-[var(--color-neutral-500)]">
          Sign electronically, right here — or sign physically on paper and attach a photo.
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
          <label className="seg-opt">
            <input type="radio" name="sigmode" checked={mode === "upload"} onChange={() => setMode("upload")} />
            <span>Signed on paper</span>
          </label>
        </div>
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
            style={{ background: "#f4f4f2", height: 120, boxShadow: "var(--shadow-sm)" }}
          >
            <span style={{ fontFamily: "cursive", fontSize: 34, color: penColor }}>{typedName || " "}</span>
          </div>
          {penPicker}
        </div>
      ) : mode === "draw" ? (
        <div className="flex flex-col gap-3">
          <input
            className="input"
            value={typedName}
            onChange={(e) => setTypedName(e.target.value)}
            placeholder="Your full name (printed under the signature)"
          />
          <canvas
            ref={canvasRef}
            width={400}
            height={140}
            className="rounded-xl w-full cursor-crosshair touch-none"
            style={{ background: "#f4f4f2", boxShadow: "var(--shadow-sm)", height: 140 }}
            onPointerDown={start}
            onPointerMove={move}
            onPointerUp={end}
            onPointerLeave={end}
          />
          <div className="flex items-center justify-between">
            {penPicker}
            <button className="btn btn-ghost text-[13px]" onClick={clearCanvas}>Clear</button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <input
            className="input"
            value={typedName}
            onChange={(e) => setTypedName(e.target.value)}
            placeholder="Your full name (printed under the signature)"
          />
          <div
            className="rounded-xl flex items-center justify-center overflow-hidden"
            style={{ background: "#f4f4f2", height: 140, boxShadow: "var(--shadow-sm)" }}
          >
            {uploadedSignature ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={uploadedSignature} alt="Uploaded signature" style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }} />
            ) : (
              <div className="flex flex-col items-center gap-1.5 text-[var(--color-neutral-500)]">
                <IconCamera size={20} />
                <span className="text-[11.5px]">Print, sign by hand, then photograph just the signature</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button type="button" className="btn btn-secondary text-[13px]" onClick={() => fileInputRef.current?.click()}>
              <IconCamera size={12} />
              {uploadedSignature ? "Replace photo" : "Upload photo"}
            </button>
            {uploadedSignature && (
              <button type="button" className="btn btn-ghost text-[13px]" onClick={() => setUploadedSignature(null)}>
                Remove
              </button>
            )}
          </div>
          {uploadError && <div className="text-[11.5px]" style={{ color: "var(--color-accent-300)" }}>{uploadError}</div>}
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
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
