import HeroMedia from "@/components/site/HeroMedia";
import TiltCard from "@/components/site/TiltCard";

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="nx-grid-bg absolute inset-0 pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(820px 460px at 15% -6%, color-mix(in srgb, var(--color-accent) 16%, transparent), transparent)",
        }}
      />

      {/* Side-by-side split (text left, product visual right), not stacked —
          this is the actual structural difference from the reference that
          made the previous version read as "not like that": a centered
          stack puts the product a full scroll below the fold, a split shows
          it in the same first view as the pitch. */}
      {/* minmax(min(380px, 100%), 1fr) — not a bare 380px floor: on a
          narrower-than-380px viewport a bare floor forces the grid item wider
          than the viewport itself instead of shrinking, which pushed the
          heading and body text off the right edge on mobile (caught by
          actually checking the mobile viewport, not just desktop). Capping
          the floor at 100% means it can still shrink to fit. */}
      <div className="relative max-w-[1160px] mx-auto px-6 pt-[100px] pb-[64px] grid gap-10 items-center" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(380px, 100%), 1fr))" }}>
        <div className="flex flex-col items-start text-left order-1">
          <span className="tag tag-accent text-[10.5px]">
            AI-powered · Real Stripe payments · True white-label
          </span>
          <h1 className="text-[clamp(36px,5vw,54px)] mt-5 tracking-[-0.03em] leading-[1.05] text-pretty">
            The complete business operating system.
          </h1>
          <p className="text-[16px] text-[var(--color-neutral-400)] max-w-[440px] mt-4 leading-[1.6]">
            Money, documents, people and clients: run your entire organization from one platform, under your own
            brand.
          </p>
          <div className="flex gap-2.5 mt-6 flex-wrap">
            <a href="/signup" className="btn btn-primary text-sm px-[22px] py-[11px]">Start free</a>
            <a href="/how-it-works/wallet" className="btn btn-secondary text-sm px-[22px] py-[11px]">See it work</a>
          </div>
          <div className="text-[11.5px] text-[var(--color-neutral-600)] mt-3">
            No card required · Payments powered by Stripe
          </div>
        </div>

        {/* Primue's real loop — draft, sign, pay, land — playing out live, or
            a supplied hero asset if one has been dropped into public/hero/.
            TiltCard for real depth on mouse move (the same primitive
            ProductStory uses), plus a slow idle float so the hero has
            motion even before anyone touches it — kept to genuine
            depth/parallax rather than a rendered 3D scene, which was
            explicitly disliked earlier. */}
        <div className="relative order-2">
          <div className="nx-hero-float">
            <TiltCard maxTilt={4} scale={1.008}>
              <HeroMedia />
            </TiltCard>
          </div>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="text-[11px] tracking-[.06em] uppercase text-[var(--color-neutral-600)]">
              Draft · Sign · Pay · Land — one continuous flow
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
