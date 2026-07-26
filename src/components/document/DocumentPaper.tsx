import type { ReactNode } from "react";
import { paperBg, paperInk, paperMuted, paperRule, type DocumentLayout } from "./theme";

export type DocumentSection = { heading: string; text: string };

export default function DocumentPaper({
  title,
  meta,
  sections,
  accentColor,
  logoUrl,
  big = true,
  layout = "classic",
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
  layout?: DocumentLayout;
  headerRight?: ReactNode;
  footerSlot?: ReactNode;
  className?: string;
}) {
  const f = big ? 1 : 0.86;

  if (layout === "modern") {
    return (
      <div
        className={`w-full ${className}`}
        style={{ background: paperBg, color: paperInk, padding: `${40 * f}px ${44 * f}px`, boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 12px 32px -18px rgba(0,0,0,0.18)", borderRadius: 10 * f }}
      >
        <div className="flex items-start justify-between gap-4 flex-wrap" style={{ marginBottom: 26 * f, rowGap: 12 * f }}>
          <div className="min-w-0" style={{ flex: "1 1 auto" }}>
            <div className="flex items-center gap-2.5">
              {logoUrl ? <img src={logoUrl} alt="" style={{ width: 26 * f, height: 26 * f, borderRadius: 6 * f, objectFit: "cover", flexShrink: 0 }} /> : null}
              <span
                style={{
                  fontSize: 10 * f,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#fff",
                  background: accentColor,
                  padding: `${3 * f}px ${9 * f}px`,
                  borderRadius: 999,
                }}
              >
                Document
              </span>
            </div>
            <h1 style={{ fontFamily: "system-ui, -apple-system, sans-serif", fontSize: 24 * f, lineHeight: 1.2, margin: `${10 * f}px 0 0`, fontWeight: 800, color: paperInk, overflowWrap: "break-word" }}>
              {title}
            </h1>
            {meta && <div style={{ fontSize: 11.5 * f, color: paperMuted, marginTop: 4 * f, overflowWrap: "break-word" }}>{meta}</div>}
          </div>
          {headerRight && <div style={{ flexShrink: 0 }}>{headerRight}</div>}
        </div>

        <div className="flex flex-col" style={{ gap: 20 * f }}>
          {sections.map((s, i) => (
            <div key={s.heading} className="flex items-start gap-3 min-w-0">
              <span
                style={{
                  flexShrink: 0,
                  width: 22 * f,
                  height: 22 * f,
                  borderRadius: 6 * f,
                  background: `color-mix(in srgb, ${accentColor} 14%, transparent)`,
                  color: accentColor,
                  fontSize: 11 * f,
                  fontWeight: 700,
                  display: "grid",
                  placeItems: "center",
                }}
              >
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <div style={{ fontSize: 13.5 * f, fontWeight: 700, color: paperInk, marginBottom: 4 * f }}>{s.heading}</div>
                <p style={{ fontSize: 13 * f, lineHeight: 1.75, color: "#3a3a44", margin: 0, overflowWrap: "break-word", wordBreak: "break-word" }}>{s.text}</p>
              </div>
            </div>
          ))}
        </div>

        {footerSlot && (
          <>
            <div style={{ borderTop: `1px solid ${paperRule}`, marginTop: 26 * f, marginBottom: 18 * f }} />
            {footerSlot}
          </>
        )}
      </div>
    );
  }

  if (layout === "minimal") {
    return (
      <div
        className={`w-full ${className}`}
        style={{ background: paperBg, color: paperInk, padding: `${44 * f}px ${46 * f}px`, boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 12px 32px -18px rgba(0,0,0,0.18)", borderRadius: 10 * f }}
      >
        <div className="flex items-start justify-between gap-4 flex-wrap" style={{ marginBottom: 30 * f, rowGap: 12 * f }}>
          <div className="min-w-0" style={{ flex: "1 1 auto" }}>
            <div className="flex items-center gap-2.5" style={{ marginBottom: 8 * f }}>
              {logoUrl ? <img src={logoUrl} alt="" style={{ width: 22 * f, height: 22 * f, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} /> : null}
              <span style={{ fontSize: 10 * f, letterSpacing: "0.1em", textTransform: "uppercase", color: paperMuted }}>Document</span>
            </div>
            <h1 style={{ fontFamily: "system-ui, -apple-system, sans-serif", fontSize: 26 * f, lineHeight: 1.15, margin: 0, fontWeight: 500, color: paperInk, letterSpacing: "-0.01em", overflowWrap: "break-word" }}>
              {title}
            </h1>
            {meta && <div style={{ fontSize: 11.5 * f, color: paperMuted, marginTop: 6 * f, overflowWrap: "break-word" }}>{meta}</div>}
          </div>
          {headerRight && <div style={{ flexShrink: 0 }}>{headerRight}</div>}
        </div>

        <div className="flex flex-col" style={{ gap: 24 * f }}>
          {sections.map((s) => (
            <div key={s.heading} className="min-w-0" style={{ borderLeft: `2px solid ${accentColor}`, paddingLeft: 14 * f }}>
              <div style={{ fontSize: 12.5 * f, fontWeight: 600, color: paperInk, marginBottom: 5 * f }}>{s.heading}</div>
              <p style={{ fontSize: 13 * f, lineHeight: 1.8, color: "#45454e", margin: 0, overflowWrap: "break-word", wordBreak: "break-word" }}>{s.text}</p>
            </div>
          ))}
        </div>

        {footerSlot && <div style={{ marginTop: 30 * f }}>{footerSlot}</div>}
      </div>
    );
  }

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
