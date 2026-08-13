import ScrollReveal from "@/components/site/ScrollReveal";

export default function AntsBanner() {
  return (
    <section className="max-w-[1160px] mx-auto px-6 pt-[64px]">
      <ScrollReveal>
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{ border: "1px solid var(--color-divider)", minHeight: 360 }}
        >
          <img
            src="/hero/ants-building.webp"
            alt=""
            aria-hidden
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(0deg, var(--color-bg) 6%, color-mix(in srgb, var(--color-bg) 35%, transparent) 48%, transparent 78%)",
            }}
          />
          <div className="relative p-10 md:p-12 min-h-[360px] flex flex-col justify-end gap-2.5 max-w-[480px]">
            <span className="card-kicker">While you're doing the actual work</span>
            <h3 className="text-[27px] tracking-[-0.02em] leading-[1.1]">
              Primue is building the rest of it.
            </h3>
            <p className="text-sm text-[var(--color-neutral-400)] leading-[1.65]">
              Invoices chased, documents drafted, payroll run, the wallet reconciled — quietly, in the
              background, every day you don&rsquo;t have to think about it.
            </p>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
