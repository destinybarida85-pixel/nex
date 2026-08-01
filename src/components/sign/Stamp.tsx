import { useId } from "react";

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
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const cx = 100;
  const cy = 100;
  const rTop = 78;
  const rBottom = 78;
  const topPath = `M ${cx - rTop} ${cy} A ${rTop} ${rTop} 0 0 1 ${cx + rTop} ${cy}`;
  const bottomPath = `M ${cx - rBottom} ${cy} A ${rBottom} ${rBottom} 0 0 0 ${cx + rBottom} ${cy}`;

  return (
    <div
      className="pointer-events-none select-none"
      style={{ width: size, height: size, transform: "rotate(-9deg)", opacity: 0.95, mixBlendMode: "multiply" }}
    >
      <svg viewBox="0 0 200 200" width="100%" height="100%">
        <defs>
          <path id={`top-${uid}`} d={topPath} />
          <path id={`bottom-${uid}`} d={bottomPath} />
          <clipPath id={`clip-${uid}`}>
            <circle cx={cx} cy={cy} r={46} />
          </clipPath>
        </defs>

        <circle cx={cx} cy={cy} r={94} fill="none" stroke={c} strokeWidth={5.5} />
        <circle cx={cx} cy={cy} r={82} fill="none" stroke={c} strokeWidth={1.4} strokeDasharray="1.5 3.5" opacity={0.75} />

        {imageUrl ? (
          <image href={imageUrl} x={cx - 46} y={cy - 46} width={92} height={92} preserveAspectRatio="xMidYMid slice" clipPath={`url(#clip-${uid})`} />
        ) : (
          <g stroke={c} strokeWidth={2} fill="none">
            <circle cx={cx} cy={cy} r={5} fill={c} stroke="none" />
            <path d={`M ${cx - 22} ${cy} h 12 M ${cx + 10} ${cy} h 12 M ${cx} ${cy - 22} v 12 M ${cx} ${cy + 10} v 12`} strokeLinecap="round" />
          </g>
        )}

        <text fontSize={20} fontWeight={800} letterSpacing="2.5" fill={c} style={{ fontFamily: "'Arial Black', system-ui, -apple-system, sans-serif" }}>
          <textPath href={`#top-${uid}`} startOffset="50%" textAnchor="middle">
            {label}
          </textPath>
        </text>
        <text fontSize={12} fontWeight={600} letterSpacing="3" fill={c} opacity={0.85} style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
          <textPath href={`#bottom-${uid}`} startOffset="50%" textAnchor="middle">
            {sub}
          </textPath>
        </text>
      </svg>
    </div>
  );
}
