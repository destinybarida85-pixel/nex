import ScrollReveal from "@/components/site/ScrollReveal";

const stats = [
  { value: "412", label: "organizations run on Origin" },
  { value: "$42.8M", label: "moved through wallets monthly" },
  { value: "96k", label: "documents signed and sealed" },
  { value: "99.99%", label: "uptime, enterprise SLA" },
];

export default function StatBand() {
  return (
    <section className="border-y border-[var(--color-divider)]">
      <div
        className="max-w-[1160px] mx-auto px-6 py-11 grid gap-6"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}
      >
        {stats.map((s, i) => (
          <ScrollReveal key={s.label} delay={i * 0.06}>
            <div className="nx-stat-tile">
              <div className="font-medium text-[34px] tracking-[-0.01em]">{s.value}</div>
              <div className="text-[12.5px] text-[var(--color-neutral-400)] mt-1">{s.label}</div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
