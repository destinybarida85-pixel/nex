import type { ReactNode } from "react";
import { paperBg, paperInk, paperMuted, paperRule, monoStack, fontStack, type DocumentLayout, type DocumentFont } from "./theme";

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
  font = "auto",
  organisation,
  headerRight,
  footerSlot,
  overlay,
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
  font?: DocumentFont;
  /** Sender's letterhead block, dot-separated: "Acme Ltd · 12 Broad St ·
   *  hello@acme.com · +234 800 000 0000". First part is the name, the rest
   *  print as the address/contact line. Only the letterhead layouts use it. */
  organisation?: string;
  headerRight?: ReactNode;
  footerSlot?: ReactNode;
  /** Free-floating content positioned by the caller (e.g. a draggable stamp
   *  placed anywhere on the page) — rendered over the whole paper, which is
   *  why this wraps every layout in position:relative rather than each
   *  branch handling its own positioning context. */
  overlay?: ReactNode;
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

  // Layouts that print their own numeral (Executive's "01", Editorial's "1")
  // must not double up on templates whose headings already read "1. Parties" —
  // otherwise the page shows "1  1. Parties". Only strips a leading numeral
  // when the layout is supplying one, and never while editing, so the author
  // still sees and controls their own text.
  const stripLeadingNumber = (heading: string) => heading.replace(/^\s*\d+[.)]\s*/, "");

  const numberedHeadingNode = (index: number, style: React.CSSProperties) =>
    editable && onSectionChange ? (
      <EditableText as="input" value={sections[index].heading} onChange={(v) => onSectionChange(index, "heading", v)} style={style} placeholder="Section heading" />
    ) : (
      <div style={style}>{stripLeadingNumber(sections[index].heading)}</div>
    );

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

  let content: ReactNode = null;

  // Printed on the letterhead layouts. Real letterhead carries the sender's
  // address block; when a tenant hasn't filled theirs in, these render as
  // visible placeholders rather than being silently dropped, so nobody sends a
  // client a document with an invisible gap where their address should be.
  const senderLines = (organisation || "").split("·").map((s) => s.trim()).filter(Boolean);

  if (layout === "executive") {
    content = (
      <div
        className={`w-full ${className}`}
        style={{
          background: paperBg,
          color: paperInk,
          boxShadow: "0 1px 2px rgba(0,0,0,0.05), 0 18px 44px -22px rgba(0,0,0,0.28)",
          borderRadius: 10 * f,
          overflow: "hidden",
        }}
      >
        <div style={{ background: accentColor, padding: `${28 * f}px ${52 * f}px ${24 * f}px` }}>
          <div className="flex items-start justify-between gap-4 flex-wrap" style={{ rowGap: 10 * f }}>
            <div className="flex items-center" style={{ gap: 10 * f, minWidth: 0 }}>
              {logoUrl ? (
                <img src={logoUrl} alt="" style={{ width: 34 * f, height: 34 * f, borderRadius: 8 * f, objectFit: "cover", flexShrink: 0, background: "rgba(255,255,255,.15)" }} />
              ) : (
                <span
                  style={{
                    width: 34 * f, height: 34 * f, borderRadius: 8 * f, flexShrink: 0,
                    display: "grid", placeItems: "center",
                    background: "rgba(255,255,255,.16)", color: "#fff",
                    fontSize: 15 * f, fontWeight: 700,
                  }}
                >
                  {(senderLines[0] || "•").charAt(0).toUpperCase()}
                </span>
              )}
              <span style={{ color: "#fff", fontSize: 14 * f, fontWeight: 600, letterSpacing: "0.01em" }}>
                {senderLines[0] || "Your organisation"}
              </span>
            </div>
            <span style={{ color: "rgba(255,255,255,.72)", fontSize: 9.5 * f, letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 600 }}>
              Document
            </span>
          </div>
        </div>

        <div style={{ padding: `${40 * f}px ${52 * f}px ${48 * f}px` }}>
          <div className="flex items-start justify-between gap-4 flex-wrap" style={{ marginBottom: 30 * f, rowGap: 12 * f }}>
            <div className="min-w-0" style={{ flex: "1 1 auto" }}>
              {titleNode({ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 34 * f, lineHeight: 1.14, margin: 0, fontWeight: 500, color: paperInk, letterSpacing: "-0.015em", overflowWrap: "break-word" })}
              {metaNode({ fontSize: 11.5 * f, color: paperMuted, marginTop: 9 * f, letterSpacing: "0.02em", overflowWrap: "break-word" })}
            </div>
            {headerRight && <div style={{ flexShrink: 0 }}>{headerRight}</div>}
          </div>

          <div style={{ height: 3 * f, width: 56 * f, background: accentColor, marginBottom: 30 * f, borderRadius: 2 }} />

          <div className="flex flex-col" style={{ gap: 26 * f }}>
            {sections.map((s, i) => (
              <div key={i} className="min-w-0 flex" style={{ gap: 18 * f }}>
                <span
                  style={{
                    fontSize: 10.5 * f, fontWeight: 700, color: accentColor, flexShrink: 0,
                    width: 22 * f, paddingTop: 3 * f, fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0" style={{ flex: "1 1 auto" }}>
                  {numberedHeadingNode(i, {
                    fontSize: 11 * f, letterSpacing: "0.09em", textTransform: "uppercase",
                    fontWeight: 700, color: paperInk, marginBottom: 8 * f,
                  })}
                  {bodyNode(i, { fontSize: 13.5 * f, lineHeight: 1.85, color: "#3a3a44", overflowWrap: "break-word", wordBreak: "break-word", whiteSpace: "pre-wrap" })}
                </div>
              </div>
            ))}
          </div>

          {footerSlot && (
            <>
              <div style={{ borderTop: `1px solid ${paperRule}`, marginTop: 30 * f, marginBottom: 18 * f }} />
              {footerSlot}
            </>
          )}
        </div>

        {senderLines.length > 1 && (
          <div
            style={{
              borderTop: `1px solid ${paperRule}`,
              padding: `${14 * f}px ${52 * f}px`,
              fontSize: 9.5 * f,
              color: paperMuted,
              letterSpacing: "0.03em",
            }}
          >
            {senderLines.slice(1).join("  ·  ")}
          </div>
        )}
      </div>
    );
  }

  if (layout === "letterhead") {
    content = (
      <div
        className={`w-full ${className}`}
        style={{
          background: paperBg,
          color: paperInk,
          padding: `${46 * f}px ${54 * f}px ${0}px`,
          boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 14px 36px -20px rgba(0,0,0,0.22)",
          borderRadius: 10 * f,
          overflow: "hidden",
        }}
      >
        <div className="flex items-start justify-between gap-6 flex-wrap" style={{ rowGap: 14 * f, marginBottom: 18 * f }}>
          <div className="flex items-center" style={{ gap: 11 * f, minWidth: 0 }}>
            {logoUrl ? (
              <img src={logoUrl} alt="" style={{ width: 40 * f, height: 40 * f, borderRadius: 8 * f, objectFit: "cover", flexShrink: 0 }} />
            ) : (
              <span
                style={{
                  width: 40 * f, height: 40 * f, borderRadius: 8 * f, flexShrink: 0,
                  display: "grid", placeItems: "center", background: accentColor, color: "#fff",
                  fontSize: 17 * f, fontWeight: 700,
                }}
              >
                {(senderLines[0] || "•").charAt(0).toUpperCase()}
              </span>
            )}
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 15 * f, fontWeight: 600, color: paperInk, letterSpacing: "-0.005em" }}>
                {senderLines[0] || "Your organisation"}
              </div>
              <div style={{ fontSize: 9.5 * f, letterSpacing: "0.16em", textTransform: "uppercase", color: accentColor, fontWeight: 600, marginTop: 2 * f }}>
                Official correspondence
              </div>
            </div>
          </div>
          <div style={{ textAlign: "right", fontSize: 10 * f, lineHeight: 1.7, color: paperMuted, flexShrink: 0 }}>
            {senderLines.length > 1
              ? senderLines.slice(1).map((line, i) => <div key={i}>{line}</div>)
              : <div style={{ fontStyle: "italic" }}>[Address · Phone · Email]</div>}
          </div>
        </div>

        {/* The double rule is the detail that reads as printed stationery
            rather than a word-processor document. */}
        <div style={{ borderTop: `2px solid ${accentColor}`, marginBottom: 2 * f }} />
        <div style={{ borderTop: `1px solid ${paperRule}`, marginBottom: 34 * f }} />

        <div className="flex items-start justify-between gap-4 flex-wrap" style={{ marginBottom: 26 * f, rowGap: 10 * f }}>
          <div className="min-w-0" style={{ flex: "1 1 auto" }}>
            {titleNode({ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 25 * f, lineHeight: 1.2, margin: 0, fontWeight: 600, color: paperInk, overflowWrap: "break-word" })}
            {metaNode({ fontSize: 11.5 * f, color: paperMuted, marginTop: 7 * f, overflowWrap: "break-word" })}
          </div>
          {headerRight && <div style={{ flexShrink: 0 }}>{headerRight}</div>}
        </div>

        <div className="flex flex-col" style={{ gap: 20 * f, paddingBottom: 40 * f }}>
          {sections.map((s, i) => (
            <div key={i} className="min-w-0">
              {headingNode(i, {
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: 13 * f, fontWeight: 700, color: paperInk, marginBottom: 6 * f,
              })}
              {bodyNode(i, { fontSize: 13 * f, lineHeight: 1.85, color: "#3a3a44", overflowWrap: "break-word", wordBreak: "break-word", whiteSpace: "pre-wrap" })}
            </div>
          ))}

          {footerSlot && (
            <>
              <div style={{ borderTop: `1px solid ${paperRule}`, marginTop: 12 * f, marginBottom: 14 * f }} />
              {footerSlot}
            </>
          )}
        </div>

        <div
          style={{
            marginLeft: -54 * f, marginRight: -54 * f,
            background: accentColor, height: 10 * f,
          }}
        />
      </div>
    );
  }

  if (layout === "editorial") {
    const first = sections[0];
    content = (
      <div
        className={`w-full ${className}`}
        style={{
          background: "#fbfaf8",
          color: paperInk,
          padding: `${56 * f}px ${58 * f}px`,
          boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 16px 40px -22px rgba(0,0,0,0.24)",
          borderRadius: 10 * f,
        }}
      >
        <div className="flex items-center justify-between gap-4 flex-wrap" style={{ marginBottom: 40 * f, rowGap: 10 * f }}>
          <div className="flex items-center" style={{ gap: 9 * f, minWidth: 0 }}>
            {logoUrl && <img src={logoUrl} alt="" style={{ width: 22 * f, height: 22 * f, borderRadius: 5 * f, objectFit: "cover", flexShrink: 0 }} />}
            <span style={{ fontSize: 9.5 * f, letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 700, color: paperMuted }}>
              {senderLines[0] || "Document"}
            </span>
          </div>
          {headerRight && <div style={{ flexShrink: 0 }}>{headerRight}</div>}
        </div>

        <div className="min-w-0" style={{ maxWidth: `${580 * f}px` }}>
          {titleNode({ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 46 * f, lineHeight: 1.06, margin: 0, fontWeight: 400, color: paperInk, letterSpacing: "-0.025em", overflowWrap: "break-word" })}
          {metaNode({ fontSize: 12 * f, color: paperMuted, marginTop: 14 * f, fontStyle: "italic", overflowWrap: "break-word" })}
        </div>

        <div style={{ borderTop: `1px solid ${paperInk}`, marginTop: 34 * f, marginBottom: 32 * f, opacity: 0.85 }} />

        <div className="flex flex-col" style={{ gap: 30 * f }}>
          {sections.map((s, i) => (
            <div key={i} className="min-w-0">
              <div className="flex items-baseline" style={{ gap: 12 * f, marginBottom: 10 * f }}>
                <span
                  style={{
                    fontFamily: "Georgia, 'Times New Roman', serif",
                    fontSize: 20 * f, lineHeight: 1, color: accentColor, fontWeight: 400,
                    flexShrink: 0, fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {i + 1}
                </span>
                <div className="min-w-0" style={{ flex: "1 1 auto" }}>
                  {numberedHeadingNode(i, {
                    fontFamily: "Georgia, 'Times New Roman', serif",
                    fontSize: 17 * f, fontWeight: 600, color: paperInk, letterSpacing: "-0.01em",
                  })}
                </div>
              </div>
              <div style={{ paddingLeft: 32 * f }}>
                {/* Drop cap on the opening paragraph only — the classic
                    editorial signal that this is a considered document. */}
                {i === 0 && !editable && first?.text ? (
                  <p
                    style={{
                      fontSize: 13.5 * f, lineHeight: 1.9, color: "#3a3a44", margin: 0,
                      overflowWrap: "break-word", wordBreak: "break-word", whiteSpace: "pre-wrap",
                    }}
                  >
                    <span
                      style={{
                        float: "left",
                        fontFamily: "Georgia, 'Times New Roman', serif",
                        fontSize: 46 * f,
                        lineHeight: 0.82,
                        paddingRight: 7 * f,
                        paddingTop: 3 * f,
                        color: accentColor,
                        fontWeight: 500,
                      }}
                    >
                      {first.text.trim().charAt(0)}
                    </span>
                    {first.text.trim().slice(1)}
                  </p>
                ) : (
                  bodyNode(i, { fontSize: 13.5 * f, lineHeight: 1.9, color: "#3a3a44", overflowWrap: "break-word", wordBreak: "break-word", whiteSpace: "pre-wrap" })
                )}
              </div>
            </div>
          ))}
        </div>

        {footerSlot && (
          <>
            <div style={{ borderTop: `1px solid ${paperRule}`, marginTop: 34 * f, marginBottom: 20 * f }} />
            {footerSlot}
          </>
        )}
      </div>
    );
  }

  if (layout === "modern") {
    content = (
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
    content = (
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

  if (layout === "dossier") {
    const metaLines = (meta || "").split("·").map((s) => s.trim()).filter(Boolean);
    content = (
      <div
        className={`w-full ${className}`}
        style={{ background: "#fdfdfc", color: "#0a0a0a", fontFamily: monoStack, padding: `${46 * f}px ${48 * f}px`, boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 12px 32px -18px rgba(0,0,0,0.18)", borderRadius: 6 * f }}
      >
        <div className="flex items-start justify-between gap-4 flex-wrap" style={{ marginBottom: 46 * f, rowGap: 12 * f }}>
          <div className="flex items-center gap-2">
            {logoUrl ? (
              <img src={logoUrl} alt="" style={{ width: 20 * f, height: 20 * f, borderRadius: 4 * f, objectFit: "cover", flexShrink: 0 }} />
            ) : (
              <span style={{ width: 8 * f, height: 8 * f, borderRadius: "50%", background: accentColor, flexShrink: 0 }} />
            )}
            <span style={{ fontSize: 9.5 * f, letterSpacing: "0.06em", textTransform: "uppercase", color: paperMuted }}>{"// document"}</span>
          </div>
          {headerRight && <div style={{ flexShrink: 0 }}>{headerRight}</div>}
        </div>

        {titleNode({ fontFamily: monoStack, fontSize: 30 * f, lineHeight: 1.08, margin: 0, fontWeight: 700, letterSpacing: "-0.01em", textTransform: "uppercase", color: "#0a0a0a", overflowWrap: "break-word", maxWidth: `${560 * f}px` })}

        <div style={{ borderTop: "1.5px solid #0a0a0a", marginTop: 24 * f, marginBottom: 30 * f }} />

        <div className="grid grid-cols-1 sm:grid-cols-[1fr_2.4fr]" style={{ gap: 32 * f }}>
          <div className="min-w-0">
            <div style={{ fontSize: 9.5 * f, letterSpacing: "0.08em", textTransform: "uppercase", color: paperMuted, marginBottom: 8 * f }}>Reference</div>
            {editable && onMetaChange ? (
              metaNode({ fontSize: 11.5 * f, color: "#0a0a0a", lineHeight: 1.6, overflowWrap: "break-word" })
            ) : metaLines.length > 0 ? (
              <div className="flex flex-col" style={{ gap: 2 * f }}>
                {metaLines.map((line, i) => (
                  <span key={i} style={{ fontSize: 11.5 * f, color: "#0a0a0a", lineHeight: 1.6, overflowWrap: "break-word" }}>{line}</span>
                ))}
              </div>
            ) : null}
          </div>

          <div className="flex flex-col min-w-0" style={{ gap: 26 * f }}>
            {sections.map((s, i) => (
              <div key={i} className="min-w-0">
                {headingNode(i, { fontSize: 12 * f, fontWeight: 700, letterSpacing: "0.01em", textTransform: "uppercase", color: "#0a0a0a", marginBottom: 8 * f })}
                {bodyNode(i, { fontSize: 12 * f, lineHeight: 1.85, color: "#3a3a3a", overflowWrap: "break-word", wordBreak: "break-word", whiteSpace: "pre-wrap" })}
              </div>
            ))}
          </div>
        </div>

        {footerSlot && (
          <>
            <div style={{ borderTop: "1px solid rgba(0,0,0,0.12)", marginTop: 34 * f, marginBottom: 22 * f }} />
            {footerSlot}
          </>
        )}
      </div>
    );
  }

  // Classic is the fallback, not an override. This guard is load-bearing:
  // without it, the assignment below ran unconditionally and clobbered
  // whichever layout branch had just matched — so Modern, Minimal and Dossier
  // all silently rendered as Classic and the layout picker did nothing.
  if (!content) content = (
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

  // Each layout sets its own fonts inline, which beat anything inherited. The
  // override rule in globals.css uses !important to win, and reads the stack
  // from a custom property set here — so it stays per-instance rather than the
  // last-rendered document dictating the font for every other one on the page.
  const chosenStack = fontStack(font);

  return (
    <div
      style={{ position: "relative", ...(chosenStack ? ({ "--doc-font": chosenStack } as React.CSSProperties) : {}) }}
      className={chosenStack ? "doc-font-override" : undefined}
    >
      {content}
      {overlay}
    </div>
  );
}
