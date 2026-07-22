import TiltCard from "@/components/site/TiltCard";

const sidebarItems = [
  { label: "Dashboard", active: true },
  { label: "Business Wallet" },
  { label: "Documents" },
  { label: "AI Assistant" },
  { label: "Payroll" },
  { label: "Analytics" },
];

const kpis = [
  { label: "Wallet balance", value: "$248,610.44" },
  { label: "Monthly revenue", value: "$86,240", delta: "▲ 12.4%" },
  { label: "Pending signatures", value: "3", accent: true },
];

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(720px 420px at 30% 8%, color-mix(in srgb, var(--color-accent) 13%, transparent), transparent)",
        }}
      />
      <div className="relative max-w-[1160px] mx-auto px-6 pt-[88px] pb-16">
        <div className="max-w-[660px]">
          <span className="tag tag-accent text-[10.5px]">
            AI-powered · Bank-backed wallets · True white-label
          </span>
          <h1 className="text-[clamp(38px,5.5vw,58px)] mt-[18px] tracking-[-0.02em] leading-[1.06] text-pretty">
            The complete business operating system.
          </h1>
          <p className="text-[16.5px] text-[var(--color-neutral-400)] max-w-[540px] mt-4 leading-[1.6]">
            Money, documents, people and clients — run your entire organization from one platform, under your own brand.
          </p>
          <div className="flex gap-2.5 mt-[26px] flex-wrap">
            <a href="/signup" className="btn btn-primary text-sm px-[22px] py-[11px]">Start free</a>
            <button className="btn btn-secondary text-sm px-[22px] py-[11px]">Book a demo</button>
          </div>
          <div className="text-[11.5px] text-[var(--color-neutral-600)] mt-3">
            No card required · Funds held by licensed banking partners
          </div>
        </div>

        <TiltCard id="product" maxTilt={4} scale={1.008} className="relative mt-[52px]">
          <div className="border border-[var(--color-divider)] rounded-2xl overflow-hidden">
            <div className="flex items-center gap-1.5 px-3.5 py-2.5 border-b border-[var(--color-divider)] bg-[var(--color-surface)]">
              <span className="w-2 h-2 rounded-full bg-[var(--color-neutral-700)]" />
              <span className="w-2 h-2 rounded-full bg-[var(--color-neutral-700)]" />
              <span className="w-2 h-2 rounded-full bg-[var(--color-neutral-700)]" />
              <span className="ml-2.5 font-mono text-[10.5px] text-[var(--color-neutral-500)]">
                app.nex.com/dashboard
              </span>
            </div>
            <div className="flex bg-[var(--color-bg)]">
              <div className="hidden sm:flex w-[180px] flex-none p-4 px-3 border-r border-[var(--color-divider)] flex-col gap-[7px]">
                {sidebarItems.map((item) => (
                  <div
                    key={item.label}
                    className="px-[9px] py-[5px] text-[11.5px] rounded-md"
                    style={
                      item.active
                        ? {
                            color: "var(--color-accent-300)",
                            background: "color-mix(in srgb, var(--color-accent-900) 65%, transparent)",
                          }
                        : { color: "var(--color-neutral-500)" }
                    }
                  >
                    {item.label}
                  </div>
                ))}
              </div>
              <div className="flex-1 min-w-0 p-[18px] flex flex-col gap-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {kpis.map((kpi) => (
                    <div key={kpi.label} className="p-3 rounded-lg bg-[var(--color-surface)]">
                      <div className="text-[9.5px] tracking-[.08em] uppercase text-[var(--color-neutral-500)]">
                        {kpi.label}
                      </div>
                      <div
                        className="text-[18px] font-medium mt-[3px]"
                        style={kpi.accent ? { color: "var(--color-accent-300)" } : undefined}
                      >
                        {kpi.value}{" "}
                        {kpi.delta && (
                          <span className="text-[10px]" style={{ color: "var(--color-accent-300)" }}>
                            {kpi.delta}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <svg
                  viewBox="0 0 900 150"
                  className="w-full h-auto block rounded-lg bg-[var(--color-surface)]"
                  role="img"
                  aria-label="Revenue curve"
                >
                  <defs>
                    <linearGradient id="heroW" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="#968ae0" stopOpacity="0.25" />
                      <stop offset="1" stopColor="#968ae0" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0 118 L90 106 L180 112 L270 92 L360 98 L450 76 L540 84 L630 60 L720 68 L810 42 L900 32 L900 150 L0 150 Z"
                    fill="url(#heroW)"
                  />
                  <path
                    d="M0 118 L90 106 L180 112 L270 92 L360 98 L450 76 L540 84 L630 60 L720 68 L810 42 L900 32"
                    fill="none"
                    stroke="#968ae0"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </TiltCard>
      </div>
    </section>
  );
}
