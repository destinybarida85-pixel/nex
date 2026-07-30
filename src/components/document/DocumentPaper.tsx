import type { ReactNode } from "react";
import { paperBg, paperInk, paperMuted, paperRule, type DocumentLayout } from "./theme";

export type DocumentSection = { heading: string; text: string };

// Stable, module-level component — never redefined during a parent re-render,
// which matters here: a component type recreated inside another component's
// render body gets remounted by React on every render (a new function
// reference is a new "type" as far as reconciliation is concerned), which
// tears down and rebuilds the underlying <input>/<textarea> DOM node on every
// keystroke. That silently drops focus and can even scramble cursor position
// mid-type. Keeping this at module scope is what keeps the same DOM node
// alive across renders.
function EditableText({
  as,
  value,
  onChange,
  style,
  placeholder,
}: {
  as: "input" | "textarea";
  value: string;
  onChange: (v: string) => void;
  style: React.CSSProperties;
  placeholder?: string;
}) {
  const shared: React.CSSProperties = {
    ...style,
    background: "transparent",
    border: "none",
    outline: "none",
    width: "100%",
    padding: 0,
    resize: "none",
  };
  if (as === "textarea") {
    return (
      <textarea
        ref={(el) => {
          if (el) {
            el.style.height = "auto";
            el.style.height = `${el.scrollHeight}px`;
          }
        }}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          e.target.style.height = "auto";
          e.target.style.height = `${e.target.scrollHeight}px`;
        }}
        placeholder={placeholder}
        rows={1}
        style={shared}
      />
    );
  }
  return <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={shared} />;
}

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
  editable = false,
  onTitleChange,
  onMetaChange,
  onSectionChange,
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
  editable?: boolean;
  onTitleChange?: (v: string) => void;
  onMetaChange?: (v: string) => void;
  onSectionChange?: (index: number, field: "heading" | "text", value: string) => void;
}) {
  const f = big ? 1 : 0.86;

  const titleNode = (style: React.CSSProperties) =>
    editable && onTitleChange ? (
      <EditableText as="input" value={title} onChange={onTitleChange} style={style} placeholder="Document title" />
    ) : (
      <h1 style={{ ...style, margin: style.margin ?? 0 }}>{title}</h1>
    );

  const metaNode = (style: React.CSSProperties) =>
    editable && onMetaChange ? (
      <EditableText as="input" value={meta || ""} onChange={onMetaChange} style={style} placeholder="Subtitle or reference" />
    ) : meta ? (
      <div style={style}>{meta}</div>
    ) : null;

  const headingNode = (index: number, style: React.CSSProperties) =>
    editable && onSectionChange ? (
      <EditableText as="input" value={sections[index].heading} onChange={(v) => onSectionChange(index, "heading", v)} style={style} placeholder="Section heading" />
    ) : (
      <div style={style}>{sections[index].heading}</div>
    );

  const bodyNode = (index: number, style: React.CSSProperties) =>
    editable && onSectionChange ? (
      <EditableText as="textarea" value={sections[index].text} onChange={(v) => onSectionChange(index, "text", v)} style={style} placeholder="Section content" />
    ) : (
      <p style={{ ...style, margin: 0 }}>{sections[index].text}</p>
    );

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
            {titleNode({ fontFamily: "system-ui, -apple-system, sans-serif", fontSize: 30 * f, lineHeight: 1.1, margin: `${12 * f}px 0 0`, fontWeight: 800, letterSpacing: "-0.01em", color: paperInk, overflowWrap: "break-word" })}
            {metaNode({ fontSize: 11.5 * f, color: paperMuted, marginTop: 4 * f, overflowWrap: "break-word" })}
          </div>
          {headerRight && <div style={{ flexShrink: 0 }}>{headerRight}</div>}
        </div>

        <div className="flex flex-col" style={{ gap: 20 * f }}>
          {sections.map((s, i) => (
            <div key={i} className="flex items-start gap-3 min-w-0">
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
                {headingNode(i, { fontSize: 13.5 * f, fontWeight: 700, color: paperInk, marginBottom: 4 * f })}
                {bodyNode(i, { fontSize: 13 * f, lineHeight: 1.75, color: "#3a3a44", overflowWrap: "break-word", wordBreak: "break-word", whiteSpace: "pre-wrap" })}
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
            {titleNode({ fontFamily: "system-ui, -apple-system, sans-serif", fontSize: 32 * f, lineHeight: 1.1, margin: 0, fontWeight: 500, color: paperInk, letterSpacing: "-0.015em", overflowWrap: "break-word" })}
            {metaNode({ fontSize: 11.5 * f, color: paperMuted, marginTop: 6 * f, overflowWrap: "break-word" })}
          </div>
          {headerRight && <div style={{ flexShrink: 0 }}>{headerRight}</div>}
        </div>

        <div className="flex flex-col" style={{ gap: 24 * f }}>
          {sections.map((s, i) => (
            <div key={i} className="min-w-0" style={{ borderLeft: `2px solid ${accentColor}`, paddingLeft: 14 * f }}>
              {headingNode(i, { fontSize: 12.5 * f, fontWeight: 600, color: paperInk, marginBottom: 5 * f })}
              {bodyNode(i, { fontSize: 13 * f, lineHeight: 1.8, color: "#45454e", overflowWrap: "break-word", wordBreak: "break-word", whiteSpace: "pre-wrap" })}
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
        padding: `${52 * f}px ${52 * f}px`,
        boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 12px 32px -18px rgba(0,0,0,0.18)",
        borderRadius: 10 * f,
      }}
    >
      <div className="flex items-start justify-between gap-4 flex-wrap" style={{ marginBottom: 34 * f, rowGap: 14 * f }}>
        <div className="min-w-0" style={{ flex: "1 1 auto" }}>
          <div className="flex items-center gap-2.5" style={{ marginBottom: 12 * f }}>
            {logoUrl ? <img src={logoUrl} alt="" style={{ width: 24 * f, height: 24 * f, borderRadius: 6 * f, objectFit: "cover", flexShrink: 0 }} /> : null}
            <span style={{ fontSize: 10 * f, letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 600, color: paperMuted }}>Document</span>
          </div>
          {titleNode({ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 36 * f, lineHeight: 1.12, margin: 0, fontWeight: 500, color: paperInk, letterSpacing: "-0.01em", overflowWrap: "break-word" })}
          {metaNode({ fontSize: 12 * f, color: paperMuted, marginTop: 10 * f, overflowWrap: "break-word" })}
        </div>
        {headerRight && <div style={{ flexShrink: 0 }}>{headerRight}</div>}
      </div>

      <div style={{ borderTop: `1.5px solid ${paperInk}`, marginBottom: 26 * f }} />

      <div className="flex flex-col" style={{ gap: 22 * f }}>
        {sections.map((s, i) => (
          <div key={i} className="min-w-0">
            {headingNode(i, {
              fontSize: 10.5 * f,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              fontWeight: 700,
              color: accentColor,
              marginBottom: 7 * f,
            })}
            {bodyNode(i, { fontSize: 13.5 * f, lineHeight: 1.8, color: "#3a3a44", overflowWrap: "break-word", wordBreak: "break-word", whiteSpace: "pre-wrap" })}
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
