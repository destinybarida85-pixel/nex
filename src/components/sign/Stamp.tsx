import { useId } from "react";

export type StampShape = "round" | "rectangle" | "badge" | "wax";

export const stampShapes: { id: StampShape; label: string }[] = [
  { id: "round", label: "Round seal" },
  { id: "rectangle", label: "Rectangle stamp" },
  { id: "badge", label: "Starred badge" },
  { id: "wax", label: "Wax seal" },
];

type ShapeProps = { uid: string; label: string; sub: string; c: string; imageUrl?: string | null; size: number };

// A shared "roughen" filter gives every shape the slightly uneven, ink-on-a-
// worn-stamp edge from the reference images, instead of a perfectly crisp
// vector line that reads as a screenshot rather than a stamp.
function RoughFilter({ uid }: { uid: string }) {
  return (
    <filter id={`rough-${uid}`} x="-20%" y="-20%" width="140%" height="140%">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={3} result="noise" />
      <feDisplacementMap in="SourceGraphic" in2="noise" scale={2.2} />
    </filter>
  );
}

function RoundSeal({ uid, label, sub, c, imageUrl, size }: ShapeProps) {
  const cx = 100;
  const cy = 100;
  const topPath = `M 22 100 A 78 78 0 0 1 178 100`;
  const bottomPath = `M 22 100 A 78 78 0 0 0 178 100`;
  return (
    <svg viewBox="0 0 200 200" width={size} height={size}>
      <defs>
        <path id={`top-${uid}`} d={topPath} />
        <path id={`bottom-${uid}`} d={bottomPath} />
        <clipPath id={`clip-${uid}`}>
          <circle cx={cx} cy={cy} r={46} />
        </clipPath>
        <RoughFilter uid={uid} />
      </defs>
      <g filter={`url(#rough-${uid})`}>
        <circle cx={cx} cy={cy} r={94} fill="none" stroke={c} strokeWidth={5.5} />
        <circle cx={cx} cy={cy} r={82} fill="none" stroke={c} strokeWidth={1.4} strokeDasharray="1.5 3.5" opacity={0.75} />
      </g>

      {imageUrl ? (
        <image href={imageUrl} x={cx - 46} y={cy - 46} width={92} height={92} preserveAspectRatio="xMidYMid slice" clipPath={`url(#clip-${uid})`} />
      ) : (
        <g stroke={c} strokeWidth={2} fill="none">
          <circle cx={cx} cy={cy} r={5} fill={c} stroke="none" />
          <path d={`M ${cx - 22} ${cy} h 12 M ${cx + 10} ${cy} h 12 M ${cx} ${cy - 22} v 12 M ${cx} ${cy + 10} v 12`} strokeLinecap="round" />
        </g>
      )}

      <text fontSize={20} fontWeight={800} letterSpacing="2.5" fill={c} style={{ fontFamily: "'Arial Black', system-ui, -apple-system, sans-serif" }}>
        <textPath href={`#top-${uid}`} startOffset="50%" textAnchor="middle">{label}</textPath>
      </text>
      <text fontSize={12} fontWeight={600} letterSpacing="3" fill={c} opacity={0.85} style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
        <textPath href={`#bottom-${uid}`} startOffset="50%" textAnchor="middle">{sub}</textPath>
      </text>
    </svg>
  );
}

function RectangleStamp({ uid, label, sub, c, size }: ShapeProps) {
  // Wider than tall — a rectangle at `size` square would crop the text — so
  // this shape uses its own aspect ratio rather than forcing the caller's
  // square box, same as the reference "PAID" / "TOP SECRET" stamps.
  const w = size * 1.7;
  const h = size * 0.72;
  return (
    <svg viewBox="0 0 340 144" width={w} height={h}>
      <defs>
        <RoughFilter uid={uid} />
      </defs>
      <g filter={`url(#rough-${uid})`} stroke={c} fill="none">
        <rect x={6} y={6} width={328} height={132} strokeWidth={5} />
        <rect x={16} y={16} width={308} height={112} strokeWidth={1.5} opacity={0.7} />
      </g>
      <text
        x={170}
        y={sub ? 74 : 84}
        textAnchor="middle"
        fontSize={sub ? 40 : 46}
        fontWeight={800}
        letterSpacing="2"
        fill={c}
        style={{ fontFamily: "'Arial Black', system-ui, -apple-system, sans-serif" }}
      >
        {label}
      </text>
      {sub && (
        <text x={170} y={106} textAnchor="middle" fontSize={16} fontWeight={700} letterSpacing="3" fill={c} opacity={0.85}>
          {sub}
        </text>
      )}
    </svg>
  );
}

function BadgeSeal({ uid, label, sub, c, imageUrl, size }: ShapeProps) {
  const cx = 100;
  const cy = 100;
  const topPath = `M 26 100 A 74 74 0 0 1 174 100`;
  const bottomPath = `M 26 100 A 74 74 0 0 0 174 100`;
  // Stars sit at fixed angles top and bottom, mirroring the "GUARANTEE / BEST
  // QUALITY" reference — the detail that reads as a quality badge rather than
  // a plain seal.
  const starAngles = [-38, -18, 0, 18, 38];
  function star(angle: number, r: number, s: number) {
    const rad = (angle * Math.PI) / 180;
    const x = cx + r * Math.sin(rad);
    const y = cy - r * Math.cos(rad);
    const pts = Array.from({ length: 10 }, (_, i) => {
      const a = (Math.PI / 5) * i - Math.PI / 2;
      const rr = i % 2 === 0 ? s : s * 0.42;
      return `${x + rr * Math.cos(a)},${y + rr * Math.sin(a)}`;
    }).join(" ");
    return <polygon key={angle} points={pts} fill={c} />;
  }
  return (
    <svg viewBox="0 0 200 200" width={size} height={size}>
      <defs>
        <path id={`top-${uid}`} d={topPath} />
        <path id={`bottom-${uid}`} d={bottomPath} />
        <clipPath id={`clip-${uid}`}><circle cx={cx} cy={cy} r={40} /></clipPath>
        <RoughFilter uid={uid} />
      </defs>
      <g filter={`url(#rough-${uid})`}>
        <circle cx={cx} cy={cy} r={92} fill="none" stroke={c} strokeWidth={4} />
        <circle cx={cx} cy={cy} r={86} fill="none" stroke={c} strokeWidth={1.3} opacity={0.75} />
      </g>
      <g opacity={0.9}>{starAngles.map((a) => star(a, 66, 5))}</g>
      <g opacity={0.9} transform={`rotate(180 ${cx} ${cy})`}>{starAngles.map((a) => star(a, 66, 5))}</g>

      {imageUrl && (
        <image href={imageUrl} x={cx - 40} y={cy - 40} width={80} height={80} preserveAspectRatio="xMidYMid slice" clipPath={`url(#clip-${uid})`} />
      )}

      <text fontSize={19} fontWeight={800} letterSpacing="2" fill={c} style={{ fontFamily: "'Arial Black', system-ui, -apple-system, sans-serif" }}>
        <textPath href={`#top-${uid}`} startOffset="50%" textAnchor="middle">{label}</textPath>
      </text>
      {sub && (
        <text fontSize={11} fontWeight={700} letterSpacing="1.5" fill={c} opacity={0.85}>
          <textPath href={`#bottom-${uid}`} startOffset="50%" textAnchor="middle">{sub}</textPath>
        </text>
      )}
    </svg>
  );
}

function WaxSeal({ uid, label, sub, c, size }: ShapeProps) {
  const cx = 100;
  const cy = 100;
  const topPath = `M 30 104 A 70 70 0 0 1 170 104`;
  // Wax is a solid pool of colour, not an outline — the one shape here that
  // reads as melted wax via a radial highlight plus a darker rim, rather than
  // a flat circle.
  return (
    <svg viewBox="0 0 200 200" width={size} height={size}>
      <defs>
        <path id={`top-${uid}`} d={topPath} />
        <radialGradient id={`wax-${uid}`} cx="38%" cy="32%" r="75%">
          <stop offset="0%" stopColor={c} stopOpacity={0.55} />
          <stop offset="55%" stopColor={c} stopOpacity={1} />
          <stop offset="100%" stopColor="#000" stopOpacity={0.28} />
        </radialGradient>
        <RoughFilter uid={uid} />
      </defs>
      <g filter={`url(#rough-${uid})`}>
        <circle cx={cx} cy={cy} r={88} fill={`url(#wax-${uid})`} />
        <circle cx={cx} cy={cy} r={88} fill="none" stroke="#000" strokeOpacity={0.18} strokeWidth={2} />
      </g>
      <text fontSize={17} fontWeight={700} letterSpacing="1.5" fill="#fff" opacity={0.92} style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
        <textPath href={`#top-${uid}`} startOffset="50%" textAnchor="middle">{label}</textPath>
      </text>
      {sub && (
        <text x={cx} y={128} textAnchor="middle" fontSize={11} fontWeight={600} letterSpacing="1" fill="#fff" opacity={0.8} style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
          {sub}
        </text>
      )}
    </svg>
  );
}

export default function Stamp({
  label,
  sub,
  color,
  imageUrl,
  size = 108,
  shape = "round",
}: {
  label: string;
  sub: string;
  color?: string;
  imageUrl?: string | null;
  size?: number;
  shape?: StampShape;
}) {
  const c = color || "var(--color-accent)";
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const rotation = shape === "rectangle" ? -4 : -9;

  return (
    <div
      className="pointer-events-none select-none"
      style={{ transform: `rotate(${rotation}deg)`, opacity: 0.95, mixBlendMode: "multiply" }}
    >
      {shape === "rectangle" && <RectangleStamp uid={uid} label={label} sub={sub} c={c} size={size} />}
      {shape === "badge" && <BadgeSeal uid={uid} label={label} sub={sub} c={c} imageUrl={imageUrl} size={size} />}
      {shape === "wax" && <WaxSeal uid={uid} label={label} sub={sub} c={c} size={size} />}
      {shape === "round" && <RoundSeal uid={uid} label={label} sub={sub} c={c} imageUrl={imageUrl} size={size} />}
    </div>
  );
}
