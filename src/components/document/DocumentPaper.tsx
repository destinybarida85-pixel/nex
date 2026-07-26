import type { ReactNode } from "react";
import { paperBg, paperInk, paperMuted, paperRule } from "./theme";

export type DocumentSection = { heading: string; text: string };

export default function DocumentPaper({
  title,
  meta,
  sections,
  accentColor,
  logoUrl,
  big = true,
  headerRight,
  footerSlot,
  className = "",
}: {
  title: string;
  meta?: string;
  sections: DocumentSection[];
  accentColor: string;
  logoUrl?: string | null;
  big?: boolean;
  headerRight?: ReactNode;
  footerSlot?: ReactNode;
  className?: string;
}) {
  const f = big ? 1 : 0.86;
  return (
    <div
      className={`w-full ${className}`}
      style={{
        background: paperBg,
        color: paperInk,
        padding: `${36 * f}px ${44 * f}px`,
        boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 12px 32px -18px rgba(0,0,0,0.18)",
        borderRadius: 10 * f,
      }}
    >
      <div className="flex items-start justify-between gap-4 flex-wrap" style={{ marginBottom: 22 * f, rowGap: 12 * f }}>
        <div className="flex items-center gap-2.5 min-w-0" style={{ flex: "1 1 auto" }}>
          {logoUrl ? (
            <img src={logoUrl} alt="" style={{ width: 28 * f, height: 28 * f, borderRadius: 6 * f, objectFit: "cover", flexShrink: 0 }} />
          ) : null}
          <div className="min-w-0">
            <h1 style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 21 * f, lineHeight: 1.25, margin: 0, fontWeight: 500, color: paperInk, overflowWrap: "break-word" }}>
              {title}
            </h1>
            {meta && (
              <div style={{ fontSize: 11.5 * f, color: paperMuted, marginTop: 3 * f, overflowWrap: "break-word" }}>{meta}</div>
            )}
          </div>
        </div>
        {headerRight && <div style={{ flexShrink: 0 }}>{headerRight}</div>}
      </div>

      <div style={{ borderTop: `1px solid ${paperRule}`, marginBottom: 22 * f }} />

      <div className="flex flex-col" style={{ gap: 18 * f }}>
        {sections.map((s) => (
          <div key={s.heading} className="min-w-0">
            <div
              style={{
                fontSize: 10.5 * f,
                letterSpacing: "0.07em",
                textTransform: "uppercase",
                fontWeight: 600,
                color: accentColor,
                marginBottom: 5 * f,
              }}
            >
              {s.heading}
            </div>
            <p style={{ fontSize: 13 * f, lineHeight: 1.75, color: "#3a3a44", margin: 0, overflowWrap: "break-word", wordBreak: "break-word" }}>
              {s.text}
            </p>
          </div>
        ))}
      </div>

      {footerSlot && (
        <>
          <div style={{ borderTop: `1px solid ${paperRule}`, marginTop: 24 * f, marginBottom: 18 * f }} />
          {footerSlot}
        </>
      )}
    </div>
  );
}
