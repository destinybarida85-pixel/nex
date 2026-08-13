"use client";

import { useEffect, useRef, useState } from "react";
import Stamp from "@/components/sign/Stamp";
import { findDesign, type CertificateStyle, type CertificateDesignSpec } from "./designs";

export { certificateDesigns } from "./designs";
export type { CertificateStyle } from "./designs";
export type CertificateDesign = string;

// All sizes below are fixed px against this canvas, then the whole canvas is
// scaled to fit whatever width the caller gives it — same technique as
// ProductFrame. Fixed sizes let every design hit exact, hand-tuned
// proportions; without the scale wrapper the same sizes overflow the moment
// the container is narrower than the design was tuned for.
const DESIGN_W = 760;
const DESIGN_H = Math.round(DESIGN_W / 1.55);

const SERIF_STACK = "Georgia, 'Times New Roman', serif";
const SANS_STACK = "system-ui, -apple-system, 'Segoe UI', sans-serif";

// Whether a design's page is dark decides how the seal has to blend and
// whether hairlines need lightening. Read it from the paper colour itself
// rather than maintaining a hand-kept list that drifts as designs are added.
// Gradients fall back to their first hex, which is enough to classify them.
function isDarkPaper(paper: string) {
  const hex = paper.match(/#([0-9a-f]{6})/i)?.[1];
  if (!hex) return false;
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  // Rec. 601 luma — good enough for a light/dark decision.
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.5;
}

function Guilloche({ uid, color }: { uid: string; color: string }) {
  // A stand-in for the engraved guilloché backgrounds on real certificates and
  // banknotes: overlapping repeating rings at low opacity read as fine printed
  // linework without needing an actual guilloché algorithm.
  return (
    <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, pointerEvents: "none" }} preserveAspectRatio="none">
      <defs>
        <pattern id={`gp-${uid}`} width={54} height={54} patternUnits="userSpaceOnUse">
          <circle cx={27} cy={27} r={24} fill="none" stroke={color} strokeWidth={0.5} opacity={0.3} />
          <circle cx={0} cy={0} r={24} fill="none" stroke={color} strokeWidth={0.5} opacity={0.3} />
          <circle cx={54} cy={54} r={24} fill="none" stroke={color} strokeWidth={0.5} opacity={0.3} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#gp-${uid})`} />
    </svg>
  );
}

function Frame({ d, accent, accent2 }: { d: CertificateDesignSpec; accent: string; accent2: string }) {
  switch (d.frame) {
    case "masthead":
      return (
        <>
          <div
            className="absolute top-0 left-0 w-full"
            style={{ height: "34%", background: `linear-gradient(120deg, ${accent2}, ${accent2}dd)`, clipPath: "polygon(0 0, 100% 0, 100% 46%, 0% 100%)" }}
          />
          <div
            className="absolute top-0 right-0"
            style={{ width: "62%", height: "22%", background: `linear-gradient(90deg, transparent, ${accent})`, clipPath: "polygon(20% 60%, 100% 0%, 100% 100%, 40% 100%)", opacity: 0.9 }}
          />
        </>
      );
    case "double-border":
      return (
        <>
          <div className="absolute" style={{ inset: 14, border: `2px solid ${accent}` }} />
          <div className="absolute" style={{ inset: 20, border: `1px solid ${accent}`, opacity: 0.6 }} />
        </>
      );
    case "full-border":
      return <div className="absolute" style={{ inset: 16, border: `3px double ${accent}` }} />;
    case "side-ribbon":
      return (
        <>
          <div className="absolute top-0 left-0 h-full" style={{ width: "16%", background: `linear-gradient(180deg, ${accent}, ${accent2})`, clipPath: "polygon(0 0, 100% 0, 55% 100%, 0% 100%)" }} />
          <div className="absolute top-0 left-0 h-full" style={{ width: "19%", background: accent, opacity: 0.9, clipPath: "polygon(0 0, 62% 0, 22% 100%, 0% 100%)" }} />
        </>
      );
    case "corner-flare":
      return (
        <>
          <div className="absolute top-0 left-0" style={{ width: "26%", height: "26%", background: accent, clipPath: "polygon(0 0, 100% 0, 0 100%)", opacity: 0.9 }} />
          <div className="absolute bottom-0 right-0" style={{ width: "26%", height: "26%", background: accent2 || accent, clipPath: "polygon(100% 0, 100% 100%, 0 100%)", opacity: 0.9 }} />
        </>
      );
    case "art-deco":
      return (
        <>
          {[
            { top: 18, left: 18, borderTop: `4px solid ${accent}`, borderLeft: `4px solid ${accent}` },
            { top: 18, right: 18, borderTop: `4px solid ${accent}`, borderRight: `4px solid ${accent}` },
            { bottom: 18, left: 18, borderBottom: `4px solid ${accent}`, borderLeft: `4px solid ${accent}` },
            { bottom: 18, right: 18, borderBottom: `4px solid ${accent}`, borderRight: `4px solid ${accent}` },
          ].map((s, i) => (
            <div key={i} className="absolute" style={{ width: 74, height: 74, ...s }} />
          ))}
          <div className="absolute" style={{ inset: 30, border: `1px solid ${accent}`, opacity: 0.4 }} />
        </>
      );
    default:
      return null;
  }
}

function CertificateArt({
  design,
  recipientName,
  title,
  citation,
  issuerName,
  issuedAt,
  accentColor,
  style,
}: {
  design: CertificateDesign;
  recipientName: string;
  title: string;
  citation: string;
  issuerName?: string;
  issuedAt: string;
  accentColor?: string;
  style?: CertificateStyle;
}) {
  const watermarkUrl = style?.watermarkUrl;
  const d = findDesign(design);
  const accent = accentColor || style?.accentColor || d.accent;
  const accent2 = d.accent2 || accent;
  const font = style?.font ?? d.titleFont;
  const titleStack = font === "serif" ? SERIF_STACK : SANS_STACK;
  const showStamp = style?.showStamp !== false;
  const stampShape = style?.stampShape ?? d.stamp;
  const stampLabel = style?.stampLabel || "CERTIFIED";
  // Deliberately not `|| accent`-linked beyond the initial default: once a
  // seal colour is explicitly set it must survive the certificate's own
  // accent or design changing later — that coupling was the bug.
  const sealColor = style?.sealColor || accent;
  const stampSub = style?.stampSub ?? "";
  const dateLabel = new Date(issuedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  const alignItems = d.header === "centre" ? "center" : d.header === "right" ? "flex-end" : "flex-start";
  const textAlign = d.header === "centre" ? "center" : d.header === "right" ? "right" : "left";
  // A left-edge ribbon eats the left ~20% of the page, so the content has to
  // start inside it rather than under it.
  const padLeft = d.frame === "side-ribbon" ? "24%" : "9%";
  const padRight = "9%";
  const onDarkPaper = isDarkPaper(d.paper);

  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: DESIGN_W,
        height: DESIGN_H,
        background: d.paper,
        borderRadius: 6,
        boxShadow: "0 1px 2px rgba(0,0,0,.05), 0 30px 70px -35px rgba(0,0,0,.4)",
      }}
    >
      {d.guilloche && <Guilloche uid={d.id} color={accent} />}
      <Frame d={d} accent={accent} accent2={accent2} />
      {watermarkUrl && (
        <img
          src={watermarkUrl}
          alt=""
          aria-hidden
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "46%",
            height: "46%",
            objectFit: "contain",
            opacity: 0.08,
            pointerEvents: "none",
            userSelect: "none",
          }}
        />
      )}

      <div
        className="relative h-full flex flex-col justify-center"
        style={{ paddingLeft: padLeft, paddingRight: padRight, alignItems, textAlign }}
      >
        {/* On a masthead design the title sits on the coloured band, so it
            needs the inverse ink or it disappears into it. */}
        <div
          style={{
            fontFamily: titleStack,
            fontSize: 30,
            letterSpacing: "0.03em",
            color: d.frame === "masthead" ? "#fff" : d.ink,
            position: d.frame === "masthead" ? "absolute" : "static",
            top: d.frame === "masthead" ? 34 : undefined,
            left: d.frame === "masthead" ? "9%" : undefined,
          }}
        >
          CERTIFICATE
        </div>
        <div
          style={{
            fontSize: 11,
            letterSpacing: "0.24em",
            color: d.frame === "masthead" ? "rgba(255,255,255,.75)" : d.muted,
            marginTop: 2,
            position: d.frame === "masthead" ? "absolute" : "static",
            top: d.frame === "masthead" ? 72 : undefined,
            left: d.frame === "masthead" ? "9%" : undefined,
          }}
        >
          OF {(title || "ACHIEVEMENT").toUpperCase()}
        </div>

        <div style={{ marginTop: d.frame === "masthead" ? 92 : 22, fontSize: 10.5, color: d.muted }}>
          This certificate is proudly presented to
        </div>
        <div
          style={{
            fontFamily: d.nameStyle === "italic" ? SERIF_STACK : titleStack,
            fontStyle: d.nameStyle === "italic" ? "italic" : "normal",
            fontSize: 33,
            color: d.ink,
            marginTop: 8,
            lineHeight: 1.15,
            maxWidth: "100%",
            overflowWrap: "break-word",
          }}
        >
          {recipientName || "Recipient Name"}
        </div>
        {d.header === "centre" && <div style={{ width: 180, height: 1, background: accent, margin: "14px 0" }} />}
        <div style={{ fontSize: 10.5, color: d.muted, maxWidth: 430, lineHeight: 1.6, marginTop: d.header === "centre" ? 0 : 12 }}>
          {citation}
        </div>

        <div
          className="flex items-end"
          style={{ gap: 28, marginTop: 26, alignSelf: d.header === "centre" ? "center" : "flex-start" }}
        >
          {showStamp && (
            <Stamp label={stampLabel.slice(0, 40)} sub={stampSub.slice(0, 40)} color={sealColor} size={58} shape={stampShape} onDarkPaper={onDarkPaper} />
          )}
          <div>
            <div style={{ borderTop: `1px solid ${onDarkPaper ? d.muted : d.ink}`, width: 150, paddingTop: 4, fontSize: 9.5, color: d.muted }}>
              {issuerName || "Issuer"}
            </div>
            <div style={{ fontSize: 9.5, color: d.muted, marginTop: 6 }}>{dateLabel}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CertificatePaper(props: {
  design: CertificateDesign;
  recipientName: string;
  title: string;
  citation: string;
  issuerName?: string;
  issuedAt: string;
  accentColor?: string;
  style?: CertificateStyle;
}) {
  const outerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = outerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setScale(Math.min(1, el.clientWidth / DESIGN_W)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={outerRef} className="w-full" style={{ height: DESIGN_H * scale }}>
      <div style={{ width: DESIGN_W, transform: `scale(${scale})`, transformOrigin: "top left" }}>
        <CertificateArt {...props} />
      </div>
    </div>
  );
}
