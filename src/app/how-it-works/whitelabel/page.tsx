"use client";

import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";
import ScrollReveal from "@/components/site/ScrollReveal";
import TiltCard from "@/components/site/TiltCard";
import {
  IconGlobe,
  IconDocuments,
  IconLink,
  IconArrowRight,
  IconCheckCircle,
  IconShieldCheck,
} from "@/components/icons";

const steps = [
  {
    n: "01",
    icon: IconGlobe,
    kicker: "Brand it",
    title: "Your name, your colors, your domain.",
    copy: "Set your company name, logo, and brand color once. Every page a client sees — the mini site, invoices, emails — carries your brand. Origin stays invisible unless you choose to show it.",
    visual: (
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-[9px] grid place-items-center font-medium text-[14px]" style={{ background: "color-mix(in srgb, var(--color-accent) 20%, transparent)", color: "var(--color-accent)" }}>A</span>
          <span className="text-[13px] font-medium">Atlas Chambers</span>
        </div>
        <div className="flex gap-2">
          {["#63c3b2", "#d9a05b", "#7fa3e8", "#c98bd9"].map((c, i) => (
            <span key={c} className="w-5 h-5 rounded-md" style={{ background: c, outline: i === 0 ? "2px solid var(--color-text)" : "none", outlineOffset: 2 }} />
          ))}
        </div>
        <div className="font-mono text-[11px] text-[var(--color-neutral-500)]">portal.atlaschambers.com</div>
      </div>
    ),
  },
  {
    n: "02",
    icon: IconDocuments,
    kicker: "Choose what clients see",
    title: "Pick a real document and a real price.",
    copy: "Attach one of your actual documents — a services agreement, terms, a proposal — and a real Stripe payment link. Whatever you choose is exactly what shows up on the client's page.",
    visual: (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 p-2.5 rounded-lg" style={{ background: "var(--color-surface)" }}>
          <IconDocuments size={14} className="text-[var(--color-accent)] flex-none" />
          <span className="text-[12px] flex-1">Service Agreement</span>
        </div>
        <div className="flex items-center gap-2 p-2.5 rounded-lg" style={{ background: "var(--color-surface)" }}>
          <IconLink size={14} className="text-[var(--color-accent)] flex-none" />
          <span className="text-[12px] flex-1">Consulting deposit</span>
          <span className="text-[12px] font-medium">$2,000.00</span>
        </div>
      </div>
    ),
  },
  {
    n: "03",
    icon: IconArrowRight,
    kicker: "Share the link",
    title: "Send it. It just works, on any device.",
    copy: "One link, fully hosted. No app to install, no login required to view. Send it by email, text, or put it in your own outreach — it opens as a clean, branded landing page.",
    visual: (
      <div className="rounded-lg overflow-hidden border" style={{ borderColor: "var(--color-divider)" }}>
        <div className="flex items-center gap-1.5 px-2.5 py-1.5" style={{ background: "var(--color-surface)" }}>
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-neutral-700)]" />
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-neutral-700)]" />
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-neutral-700)]" />
          <span className="ml-1.5 font-mono text-[9.5px] text-[var(--color-neutral-500)]">portal.atlaschambers.com</span>
        </div>
        <div className="p-4 flex flex-col items-center gap-1.5 text-center" style={{ background: "var(--color-bg)" }}>
          <span className="text-[13px] font-medium">Atlas Chambers</span>
          <span className="text-[10.5px] text-[var(--color-neutral-500)]">No Origin branding visible</span>
        </div>
      </div>
    ),
  },
  {
    n: "04",
    icon: IconCheckCircle,
    kicker: "Read & pay",
    title: "They read it, they pay it, you're done.",
    copy: "The client reads the document right there on the page, then pays through a genuine Stripe checkout. The payment settles to your account — Origin never touches the money.",
    visual: (
      <div className="flex flex-col gap-2">
        <div className="text-[11px] text-[var(--color-neutral-500)] uppercase tracking-[.06em]">Consulting deposit</div>
        <div className="font-medium text-[24px]">$2,000.00</div>
        <div className="rounded-md text-center text-[12px] font-medium py-2" style={{ background: "var(--color-accent)", color: "#0c0c10" }}>
          Pay $2,000.00 now
        </div>
      </div>
    ),
  },
];

export default function WhiteLabelHowItWorksPage() {
  return (
    <>
      <Nav />
      <section className="relative overflow-hidden">
        <div className="nx-grid-bg absolute inset-0 pointer-events-none" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(820px 460px at 50% -6%, color-mix(in srgb, var(--color-accent) 16%, transparent), transparent)" }}
        />
        <div className="relative max-w-[760px] mx-auto px-6 pt-[100px] pb-16 flex flex-col items-center text-center">
          <span className="tag tag-accent text-[10.5px]">White-label · How it works</span>
          <h1 className="text-[clamp(34px,5.5vw,54px)] mt-5 tracking-[-0.03em] leading-[1.05]">
            What your clients see is entirely up to you.
          </h1>
          <p className="text-[16px] text-[var(--color-neutral-400)] max-w-[520px] mt-5 leading-[1.6]">
            You control the page: your brand, the document they read, and the price they pay. Origin runs
            underneath, out of sight.
          </p>
          <div className="flex gap-2.5 mt-7 flex-wrap justify-center">
            <a href="/signup" className="btn btn-primary text-sm px-[22px] py-[11px]">Try it free</a>
            <a href="/whitelabel" className="btn btn-secondary text-sm px-[22px] py-[11px]">Open white-label</a>
          </div>
        </div>
      </section>

      <section className="max-w-[980px] mx-auto px-6 pb-24 flex flex-col gap-2">
        {steps.map((step, i) => (
          <div key={step.n} className="relative grid gap-6 md:grid-cols-[auto_1fr_1fr] items-center py-8">
            <div className="hidden md:flex flex-col items-center self-stretch">
              <span
                className="w-9 h-9 rounded-full grid place-items-center text-[12px] font-medium flex-none"
                style={{ background: "var(--color-accent-900)", color: "var(--color-accent-300)", border: "1px solid color-mix(in srgb, var(--color-accent) 40%, transparent)" }}
              >
                {step.n}
              </span>
              {i < steps.length - 1 && <span className="flex-1 w-px mt-2" style={{ background: "var(--color-divider)" }} />}
            </div>

            <ScrollReveal className={i % 2 === 1 ? "md:order-2" : ""}>
              <div className="flex items-center gap-2 mb-1">
                <step.icon size={14} className="text-[var(--color-accent)]" />
                <span className="card-kicker">{step.kicker}</span>
              </div>
              <h3 className="text-[24px] mt-1 tracking-[-0.015em]">{step.title}</h3>
              <p className="text-sm text-[var(--color-neutral-400)] leading-[1.65] mt-2.5 max-w-[420px]">{step.copy}</p>
            </ScrollReveal>

            <ScrollReveal delay={0.08} className={i % 2 === 1 ? "md:order-1" : ""}>
              <TiltCard maxTilt={5} scale={1.015}>
                <div
                  className="nx-auth-card rounded-xl p-5 border"
                  style={{
                    background: "var(--color-bg)",
                    borderColor: "var(--color-divider)",
                    boxShadow: "var(--shadow-md)",
                    animationDelay: `${i * 0.6}s`,
                  }}
                >
                  {step.visual}
                </div>
              </TiltCard>
            </ScrollReveal>
          </div>
        ))}
      </section>

      <section className="max-w-[1160px] mx-auto px-6 pb-20">
        <div className="nx-footer-panel flex flex-wrap items-center gap-6 justify-between">
          <div className="flex items-center gap-3">
            <IconShieldCheck size={20} className="text-[var(--color-accent)]" />
            <div>
              <div className="text-[15px] font-medium">One real link. Your brand, your document, your price.</div>
              <div className="text-[12.5px] text-[var(--color-neutral-500)] mt-0.5">
                Not a mockup — the mini site pulls your actual document and a live Stripe payment link.
              </div>
            </div>
          </div>
          <a href="/signup" className="btn btn-primary text-[13.5px] flex-none">
            Start free <IconArrowRight size={14} />
          </a>
        </div>
      </section>

      <Footer />
    </>
  );
}
