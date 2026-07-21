const stats = [
  { label: "Monthly revenue", value: "$86,240", meta: "▲ 12.4%", tag: "tag-accent" },
  { label: "Expenses", value: "$31,905", meta: "▼ 3.1%", tag: "tag-neutral" },
  { label: "Net profit", value: "$54,335", meta: "▲ 18.2%", tag: "tag-accent" },
];

export default function HeroBalance() {
  return (
    <div className="grid gap-3.5 grid-cols-1 lg:grid-cols-[1.6fr_1fr]">
      <div
        className="rounded-xl p-7 flex flex-col justify-between gap-6"
        style={{
          background: "linear-gradient(150deg, var(--color-surface), color-mix(in srgb, var(--color-accent-900) 55%, var(--color-surface)))",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <div>
          <div className="text-[11px] tracking-[.08em] uppercase text-[var(--color-neutral-500)]">Wallet balance</div>
          <div className="font-medium text-[42px] tracking-[-0.015em] mt-1.5">$248,610.44</div>
          <div className="text-[12px] text-[var(--color-neutral-500)] mt-1">•• 4417 · Column Bank N.A.</div>
        </div>
        <svg viewBox="0 0 400 60" className="w-full h-auto block" role="img" aria-label="Balance trend, 30 days">
          <defs>
            <linearGradient id="heroBal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#968ae0" stopOpacity="0.3" />
              <stop offset="1" stopColor="#968ae0" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M0 46 L50 40 L100 44 L150 30 L200 34 L250 20 L300 26 L350 12 L400 8 L400 60 L0 60 Z" fill="url(#heroBal)" />
          <path
            d="M0 46 L50 40 L100 44 L150 30 L200 34 L250 20 L300 26 L350 12 L400 8"
            fill="none"
            stroke="#968ae0"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="flex flex-col gap-3.5">
        {stats.map((s) => (
          <div key={s.label} className="card elev-sm gap-1.5 p-[14px_16px] flex-1 justify-center">
            <div className="text-[10.5px] tracking-[.08em] uppercase text-[var(--color-neutral-500)]">{s.label}</div>
            <div className="flex items-baseline gap-2">
              <div className="font-medium text-[20px]">{s.value}</div>
              <span className={`tag ${s.tag} text-[9.5px]`}>{s.meta}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
