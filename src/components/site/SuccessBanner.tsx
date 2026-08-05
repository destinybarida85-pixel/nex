import ScrollReveal from "@/components/site/ScrollReveal";
import { IconCheckCircle, IconWallet } from "@/components/icons";

export default function SuccessBanner() {
  return (
    <section className="max-w-[1160px] mx-auto px-6 pt-[64px]">
      <ScrollReveal>
        <div
          className="rounded-2xl overflow-hidden grid items-center"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            background: "linear-gradient(135deg, var(--color-accent-900), var(--color-bg) 70%)",
            border: "1px solid var(--color-divider)",
          }}
        >
          <div className="p-10 md:p-12 flex flex-col gap-3.5">
            <span className="card-kicker">Built to make things easier</span>
            <h3 className="text-[30px] tracking-[-0.02em] leading-[1.1]">
              Less admin. More of the win.
            </h3>
            <p className="text-sm text-[var(--color-neutral-400)] leading-[1.65] max-w-[420px]">
              Every payment, signature and payroll run happens without you chasing it down. Primue runs the
              back office so the moment you actually notice is the one worth celebrating.
            </p>
            <a href="/signup" className="btn btn-primary text-sm px-[22px] py-[11px] mt-1.5 self-start">
              Start free →
            </a>
          </div>

          <div className="relative h-full min-h-[380px]">
            {/* object-position top: source is a tall portrait crop (face +
                logo in the upper two-thirds) — the default center crop was
                cutting the face off once squeezed into this wide, shorter
                banner slot. */}
            <img
              src="/hero/success-banner.webp"
              alt=""
              aria-hidden
              className="w-full h-full object-cover block"
              style={{
                objectPosition: "center 15%",
                maskImage: "linear-gradient(to left, black 55%, transparent 100%)",
                WebkitMaskImage: "linear-gradient(to left, black 55%, transparent 100%)",
              }}
            />
            {/* Real notification shape, not a decorative graphic — matches
                what actually appears in the app's own TopBar bell dropdown. */}
            <div
              className="nx-hero-float absolute left-6 bottom-6 md:left-10 md:bottom-10 flex items-center gap-2.5 px-4 py-3 rounded-xl max-w-[260px]"
              style={{ background: "var(--color-bg)", border: "1px solid var(--color-divider)", boxShadow: "var(--shadow-lg)" }}
            >
              <span
                className="w-8 h-8 rounded-full grid place-items-center flex-none"
                style={{ color: "#63c3b2", background: "color-mix(in srgb, #63c3b2 16%, transparent)" }}
              >
                <IconWallet size={15} />
              </span>
              <div className="min-w-0">
                <div className="text-[12.5px] font-medium flex items-center gap-1">
                  Invoice paid <IconCheckCircle size={12} className="text-[#63c3b2]" />
                </div>
                <div className="text-[11px] text-[var(--color-neutral-500)]">Halcyon Ventures · $18,500.00</div>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
