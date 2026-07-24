import HeroScene from "@/components/site/HeroScene";

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="nx-grid-bg absolute inset-0 pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(820px 460px at 50% -6%, color-mix(in srgb, var(--color-accent) 16%, transparent), transparent)",
        }}
      />
      <div className="relative max-w-[860px] mx-auto px-6 pt-[110px] pb-6 flex flex-col items-center text-center">
        <span className="tag tag-accent text-[10.5px]">
          AI-powered · Real Stripe payments · True white-label
        </span>
        <h1 className="text-[clamp(40px,6.5vw,68px)] mt-5 tracking-[-0.03em] leading-[1.02] text-pretty">
          The complete business operating system.
        </h1>
        <p className="text-[17px] text-[var(--color-neutral-400)] max-w-[520px] mt-5 leading-[1.6]">
          Money, documents, people and clients: run your entire organization from one platform, under your own brand.
        </p>
        <div className="flex gap-2.5 mt-7 flex-wrap justify-center">
          <a href="/signup" className="btn btn-primary text-sm px-[22px] py-[11px]">Start free</a>
          <a href="/how-it-works/wallet" className="btn btn-secondary text-sm px-[22px] py-[11px]">See it work</a>
        </div>
        <div className="text-[11.5px] text-[var(--color-neutral-600)] mt-3">
          No card required · Payments powered by Stripe
        </div>
      </div>

      {/* The 4D act: Origin's real loop — draft, sign, pay, land — playing out live. */}
      <div className="relative max-w-[1000px] mx-auto px-6 pb-8">
        <HeroScene />
        <div className="flex items-center justify-center gap-2 -mt-2">
          <span className="text-[11px] tracking-[.06em] uppercase text-[var(--color-neutral-600)]">
            Draft · Sign · Pay · Land — one continuous flow
          </span>
        </div>
      </div>
    </section>
  );
}
