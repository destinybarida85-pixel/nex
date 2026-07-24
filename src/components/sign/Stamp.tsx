export default function Stamp({ label, sub, color }: { label: string; sub: string; color?: string }) {
  const c = color || "var(--color-accent)";
  return (
    <div
      className="pointer-events-none select-none"
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: 108,
        height: 108,
        borderRadius: "50%",
        border: `2.5px solid ${c}`,
        boxShadow: `inset 0 0 0 4px color-mix(in srgb, ${c} 25%, transparent)`,
        color: c,
        transform: "rotate(-11deg)",
        opacity: 0.9,
        textAlign: "center",
        lineHeight: 1.2,
      }}
    >
      <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: "0.06em" }}>{label}</span>
      <span style={{ fontSize: 8, letterSpacing: "0.04em", marginTop: 3, opacity: 0.85 }}>{sub}</span>
    </div>
  );
}
