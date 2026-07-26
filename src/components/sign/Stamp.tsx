export default function Stamp({
  label,
  sub,
  color,
  imageUrl,
  size = 108,
}: {
  label: string;
  sub: string;
  color?: string;
  imageUrl?: string | null;
  size?: number;
}) {
  const c = color || "var(--color-accent)";
  return (
    <div
      className="pointer-events-none select-none"
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        borderRadius: "50%",
        border: `2.5px solid ${c}`,
        boxShadow: `inset 0 0 0 4px color-mix(in srgb, ${c} 25%, transparent)`,
        color: c,
        transform: "rotate(-11deg)",
        opacity: 0.9,
        textAlign: "center",
        lineHeight: 1.2,
        overflow: "hidden",
      }}
    >
      {imageUrl ? (
        <img src={imageUrl} alt="" style={{ width: "62%", height: "62%", objectFit: "contain", marginBottom: 2 }} />
      ) : null}
      <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: "0.06em" }}>{label}</span>
      <span style={{ fontSize: 8, letterSpacing: "0.04em", marginTop: 3, opacity: 0.85 }}>{sub}</span>
    </div>
  );
}
