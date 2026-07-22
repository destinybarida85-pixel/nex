import { IconWallet, IconESign, IconAnalytics } from "@/components/icons";

function GlassCard({
  icon: Icon,
  color,
  kicker,
  children,
  top,
  left,
  rotate,
  z,
  delay,
}: {
  icon: typeof IconWallet;
  color: string;
  kicker: string;
  children: React.ReactNode;
  top: string;
  left: string;
  rotate: string;
  z: number;
  delay: string;
}) {
  return (
    <div
      className="nx-auth-card absolute w-[190px] rounded-xl p-3.5 flex flex-col gap-2"
      style={
        {
          top,
          left,
          zIndex: z,
          animationDelay: delay,
          "--r": rotate,
          background: "linear-gradient(160deg, color-mix(in srgb, var(--color-surface) 90%, transparent), color-mix(in srgb, var(--color-surface) 60%, transparent))",
          backdropFilter: "blur(14px)",
          border: `1px solid color-mix(in srgb, ${color} 30%, var(--color-divider))`,
          boxShadow: `0 24px 40px -20px color-mix(in srgb, ${color} 35%, transparent)`,
        } as React.CSSProperties
      }
    >
      <div className="flex items-center gap-1.5">
        <span
          className="w-5 h-5 rounded-[6px] grid place-items-center flex-none"
          style={{ background: `color-mix(in srgb, ${color} 20%, transparent)`, color }}
        >
          <Icon size={11} />
        </span>
        <span className="text-[9px] tracking-[.06em] uppercase text-[var(--color-neutral-500)]">{kicker}</span>
      </div>
      {children}
    </div>
  );
}

export default function AuthNicheScene() {
  return (
    <div
      className="nx-grid-bg relative w-full h-full overflow-hidden"
      style={{
        background:
          "radial-gradient(480px 360px at 30% 30%, color-mix(in srgb, var(--color-accent) 18%, transparent), transparent), linear-gradient(160deg, var(--color-bg), color-mix(in srgb, var(--color-accent-900) 55%, var(--color-bg)))",
      }}
    >
      <div className="absolute inset-0" style={{ perspective: 1200 }}>
        <GlassCard
          icon={IconWallet}
          color="#9184d9"
          kicker="Wallet balance"
          top="18%"
          left="14%"
          rotate="-6deg"
          z={3}
          delay="0s"
        >
          <div className="text-[16px] font-medium text-[var(--color-text)]">$248,610.44</div>
          <div className="flex gap-[3px] items-end h-4">
            {[6, 10, 8, 13, 11, 15].map((h, i) => (
              <span key={i} className="w-1.5 rounded-sm" style={{ height: h, background: "#9184d9", opacity: 0.4 + i * 0.1 }} />
            ))}
          </div>
        </GlassCard>

        <GlassCard
          icon={IconESign}
          color="#63c3b2"
          kicker="MSA · Halcyon Ventures"
          top="42%"
          left="42%"
          rotate="4deg"
          z={5}
          delay="0.9s"
        >
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#63c3b2" }} />
            <span className="text-[12px] font-medium" style={{ color: "#63c3b2" }}>Signed &amp; sealed</span>
          </div>
          <div className="text-[9px] font-mono text-[var(--color-neutral-600)]">Certificate OG-CERT-8F21</div>
        </GlassCard>

        <GlassCard
          icon={IconAnalytics}
          color="#e896c9"
          kicker="Revenue · 6 months"
          top="66%"
          left="12%"
          rotate="-3deg"
          z={4}
          delay="0.45s"
        >
          <div className="text-[13px] font-medium" style={{ color: "#e896c9" }}>▲ 18.4%</div>
          <svg viewBox="0 0 150 34" className="w-full h-auto block" role="presentation">
            <polyline
              points="0,28 24,22 48,25 72,14 96,17 120,6 150,9"
              fill="none"
              stroke="#e896c9"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </GlassCard>
      </div>
    </div>
  );
}
