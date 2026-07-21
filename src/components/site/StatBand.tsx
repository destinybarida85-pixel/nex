const stats = [
  { value: "412", label: "organizations run on Nex" },
  { value: "$42.8M", label: "moved through wallets monthly" },
  { value: "96k", label: "documents signed and sealed" },
  { value: "99.99%", label: "uptime, enterprise SLA" },
];

export default function StatBand() {
  return (
    <section
      style={{ background: "linear-gradient(140deg, var(--color-section), var(--color-section-glow))" }}
    >
      <div
        className="max-w-[1160px] mx-auto px-6 py-11 grid gap-6"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}
      >
        {stats.map((s) => (
          <div key={s.label}>
            <div className="font-medium text-[34px] tracking-[-0.01em]">{s.value}</div>
            <div className="text-[12.5px] text-[var(--color-neutral-300)] mt-1">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
