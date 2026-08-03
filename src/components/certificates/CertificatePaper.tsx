import { useEffect, useRef, useState } from "react";
import Stamp from "@/components/sign/Stamp";

export type CertificateDesign = "ribbon" | "ornate" | "regal";

export const certificateDesigns: { id: CertificateDesign; label: string; why: string }[] = [
  { id: "ribbon", label: "Ribbon", why: "Navy masthead, gold award ribbon — the classic certificate of achievement." },
  { id: "ornate", label: "Ornate", why: "Deep border frame with a fine guilloché pattern — formal, ceremonial." },
  { id: "regal", label: "Regal", why: "A gold ribbon sweeps the left edge over a soft marble ground." },
];

const GOLD = "#c9a227";

function GuillochePattern({ uid, color }: { uid: string; color: string }) {
  // A cheap but convincing stand-in for the engraved guilloché backgrounds on
  // real certificates and banknotes: overlapping repeating radial rings at a
  // low opacity read as fine printed linework at a glance without needing an
  // actual guilloché-generation algorithm.
  return (
    <svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }} preserveAspectRatio="none">
      <defs>
        <pattern id={`gp-${uid}`} width={54} height={54} patternUnits="userSpaceOnUse">
          <circle cx={27} cy={27} r={24} fill="none" stroke={color} strokeWidth={0.5} opacity={0.35} />
          <circle cx={0} cy={0} r={24} fill="none" stroke={color} strokeWidth={0.5} opacity={0.35} />
          <circle cx={54} cy={54} r={24} fill="none" stroke={color} strokeWidth={0.5} opacity={0.35} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#gp-${uid})`} />
    </svg>
  );
}

// All font sizes below are fixed px against this design canvas, then the
// whole canvas is scaled to fit whatever width the caller gives it — same
// technique as ProductFrame. Fixed sizes let every design hit exact,
// hand-tuned proportions; without the scale wrapper around it, the same
// fixed sizes overflow or collide the moment the container is narrower than
// the design was tuned for (this broke the live-preview column, which is
// much narrower than the full-width public verify page).
const DESIGN_W = 760;
const DESIGN_H = Math.round(DESIGN_W / 1.55);

function CertificateArt({
  design,
  recipientName,
  title,
  citation,
  issuerName,
  issuedAt,
  accentColor,
}: {
  design: CertificateDesign;
  recipientName: string;
  title: string;
  citation: string;
  issuerName?: string;
  issuedAt: string;
  accentColor?: string;
}) {
  const accent = accentColor || GOLD;
  const f = 1;
  const dateLabel = new Date(issuedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  if (design === "ornate") {
    return (
      <div
        className="relative overflow-hidden"
        style={{ width: DESIGN_W, height: DESIGN_H, background: "#faf7f0", borderRadius: 6 * f, boxShadow: "0 1px 2px rgba(0,0,0,.05), 0 30px 70px -35px rgba(0,0,0,.4)" }}
      >
        <div className="absolute inset-0" style={{ background: `radial-gradient(120% 120% at 50% 0%, color-mix(in srgb, ${accent} 10%, transparent), transparent 60%)` }} />
        <GuillochePattern uid="orn" color={accent} />
        <div className="absolute" style={{ inset: 14 * f, border: `2px solid ${accent}` }} />
        <div className="absolute" style={{ inset: 20 * f, border: `1px solid ${accent}`, opacity: 0.6 }} />

        <div className="relative h-full flex flex-col items-center justify-center text-center px-[10%]">
          <div style={{ fontSize: 13 * f, letterSpacing: "0.32em", color: accent, fontWeight: 700 }}>CERTIFICATE</div>
          <div style={{ fontSize: 11 * f, letterSpacing: "0.28em", color: "#8a7a4a", marginTop: 4 * f }}>OF {title.toUpperCase()}</div>

          <div style={{ fontSize: 10.5 * f, color: "#6b6355", marginTop: 22 * f }}>This certificate is proudly presented to</div>
          <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: "italic", fontSize: 34 * f, color: "#2a241a", marginTop: 10 * f, lineHeight: 1.1 }}>
            {recipientName || "Recipient Name"}
          </div>
          <div style={{ width: 180 * f, height: 1, background: accent, margin: `${14 * f}px 0` }} />
          <div style={{ fontSize: 10.5 * f, color: "#6b6355", maxWidth: 420 * f, lineHeight: 1.6 }}>{citation}</div>

          <div className="flex items-center justify-between w-full mt-auto" style={{ paddingTop: 26 * f }}>
            <div className="flex flex-col items-center" style={{ width: 140 * f }}>
              <div style={{ borderTop: `1px solid ${accent}`, width: "100%", paddingTop: 4 * f, fontSize: 9.5 * f, color: "#6b6355" }}>SIGNATURE</div>
            </div>
            <Stamp label="CERTIFIED" sub="" color={accent} size={54 * f} shape="badge" />
            <div className="flex flex-col items-center" style={{ width: 140 * f }}>
              <div style={{ borderTop: `1px solid ${accent}`, width: "100%", paddingTop: 4 * f, fontSize: 9.5 * f, color: "#6b6355" }}>{dateLabel}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (design === "regal") {
    return (
      <div
        className="relative overflow-hidden"
        style={{ width: DESIGN_W, height: DESIGN_H, background: "linear-gradient(135deg, #f4f3f0, #eae7e0)", borderRadius: 6 * f, boxShadow: "0 1px 2px rgba(0,0,0,.05), 0 30px 70px -35px rgba(0,0,0,.4)" }}
      >
        <div
          className="absolute top-0 left-0 h-full"
          style={{
            width: "16%",
            background: `linear-gradient(180deg, color-mix(in srgb, ${accent} 88%, #6a4fb0), color-mix(in srgb, ${accent} 60%, #2b3a55))`,
            clipPath: "polygon(0 0, 100% 0, 55% 100%, 0% 100%)",
          }}
        />
        <div
          className="absolute top-0 left-0 h-full"
          style={{ width: "19%", background: accent, opacity: 0.9, clipPath: "polygon(0 0, 62% 0, 22% 100%, 0% 100%)" }}
        />

        <div className="relative h-full flex flex-col justify-center" style={{ paddingLeft: "24%", paddingRight: "8%" }}>
          <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 30 * f, color: "#22222a", letterSpacing: "0.02em" }}>CERTIFICATE</div>
          <div style={{ fontSize: 11 * f, letterSpacing: "0.24em", color: "#6b6355", marginTop: 2 * f }}>OF {title.toUpperCase()}</div>

          <div style={{ fontSize: 10.5 * f, color: "#6b6355", marginTop: 20 * f }}>This certificate is proudly presented to</div>
          <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: "italic", fontSize: 32 * f, color: "#22222a", marginTop: 8 * f, lineHeight: 1.1 }}>
            {recipientName || "Recipient Name"}
          </div>
          <div style={{ fontSize: 10.5 * f, color: "#6b6355", maxWidth: 420 * f, lineHeight: 1.6, marginTop: 12 * f }}>{citation}</div>

          <div className="flex items-center gap-8" style={{ marginTop: 24 * f }}>
            <Stamp label="CERTIFIED" sub="AUTHENTIC" color={accent} size={56 * f} shape="wax" />
            <div>
              <div style={{ borderTop: "1px solid #22222a", width: 150 * f, paddingTop: 4 * f, fontSize: 9.5 * f, color: "#6b6355" }}>
                {issuerName || "Issuer"}
              </div>
              <div style={{ fontSize: 9.5 * f, color: "#8a8578", marginTop: 8 * f }}>{dateLabel}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // "ribbon" — the default, closest to the navy-masthead reference.
  return (
    <div
      className="relative overflow-hidden"
      style={{ width: DESIGN_W, height: DESIGN_H, background: "#faf9f6", borderRadius: 6 * f, boxShadow: "0 1px 2px rgba(0,0,0,.05), 0 30px 70px -35px rgba(0,0,0,.4)" }}
    >
      <div
        className="absolute top-0 left-0 w-full"
        style={{
          height: "34%",
          background: "linear-gradient(120deg, #142238, #1f3452)",
          clipPath: "polygon(0 0, 100% 0, 100% 46%, 0% 100%)",
        }}
      />
      <div
        className="absolute top-0 right-0"
        style={{
          width: "62%",
          height: "22%",
          background: `linear-gradient(90deg, transparent, ${accent})`,
          clipPath: "polygon(20% 60%, 100% 0%, 100% 100%, 40% 100%)",
          opacity: 0.9,
        }}
      />

      <div className="relative h-full flex flex-col" style={{ padding: `${34 * f}px ${44 * f}px` }}>
        <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 30 * f, color: "#fff", letterSpacing: "0.04em" }}>
          CERTIFICATE
        </div>
        <div style={{ fontSize: 11 * f, letterSpacing: "0.22em", color: "rgba(255,255,255,.75)" }}>OF {title.toUpperCase()}</div>

        <div className="flex-1 flex flex-col items-end text-right justify-center" style={{ paddingTop: 10 * f }}>
          <div style={{ fontSize: 10.5 * f, color: "#6b6355" }}>This certificate is presented to</div>
          <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: "italic", fontSize: 32 * f, color: "#22222a", marginTop: 6 * f }}>
            {recipientName || "Recipient Name"}
          </div>
          <div style={{ fontSize: 10.5 * f, color: "#6b6355", maxWidth: 420 * f, lineHeight: 1.6, marginTop: 10 * f }}>{citation}</div>
        </div>

        <div className="flex items-end justify-between" style={{ marginTop: 14 * f }}>
          <Stamp label={(issuerName || "OFFICIAL").slice(0, 10)} sub="BEST AWARD" color={accent} size={64 * f} shape="badge" />
          <div className="flex flex-col items-end">
            <div style={{ borderTop: "1px solid #22222a", width: 150 * f, paddingTop: 4 * f, fontSize: 9.5 * f, color: "#6b6355", textAlign: "right" }}>
              SIGNATURE
            </div>
            <div style={{ fontSize: 9.5 * f, color: "#8a8578", marginTop: 8 * f }}>{dateLabel}</div>
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
