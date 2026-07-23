"use client";

import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";
import ScrollReveal from "@/components/site/ScrollReveal";
import TiltCard from "@/components/site/TiltCard";
import {
  IconPlus,
  IconLink,
  IconArrowRight,
  IconCheckCircle,
  IconWallet,
  IconShieldCheck,
} from "@/components/icons";

const steps = [
  {
    n: "01",
    icon: IconPlus,
    kicker: "Create a link",
    title: "Name it, price it, done in seconds.",
    copy: "One-time or recurring — a workshop ticket, a retainer, a deposit. Set a title and an amount, and Origin creates a genuine Stripe Payment Link on your own account.",
    visual: (
      <div className="flex flex-col gap-2.5">
        <input className="input text-[12.5px]" disabled value="Consulting deposit" />
        <div className="flex gap-2">
          <input className="input text-[12.5px]" disabled value="$2,000.00" />
          <select className="input text-[12.5px]" disabled style={{ maxWidth: 110 }}><option>One-time</option></select>
        </div>
        <button className="btn btn-primary text-[12.5px]" disabled>Create real payment link</button>
      </div>
    ),
  },
  {
    n: "02",
    icon: IconLink,
    kicker: "Share it",
    title: "It's a real stripe.com link, not a mockup.",
    copy: "Text it, email it, put it in an invoice, drop it on your white-label mini site. However your client gets it, it opens a genuine Stripe-hosted checkout page.",
    visual: (
      <div className="flex items-center gap-2 p-3 rounded-lg" style={{ background: "var(--color-surface)" }}>
        <IconLink size={14} className="text-[var(--color-accent)] flex-none" />
        <span className="text-[12px] font-mono truncate" style={{ color: "var(--color-neutral-400)" }}>
          buy.stripe.com/consulting-deposit
        </span>
      </div>
    ),
  },
  {
    n: "03",
    icon: IconCheckCircle,
    kicker: "They pay",
    title: "Real card processing, real receipt.",
    copy: "Your client pays with a real card through Stripe's own checkout — the same infrastructure processing billions of dollars for companies far bigger than either of us.",
    visual: (
      <div className="flex flex-col gap-2">
        <div className="text-[11px] text-[var(--color-neutral-500)] uppercase tracking-[.06em]">Consulting deposit</div>
        <div className="font-medium text-[22px]">$2,000.00</div>
        <div className="rounded-md text-center text-[12px] font-medium py-2" style={{ background: "var(--color-accent)", color: "#0c0c10" }}>
          Pay $2,000.00
        </div>
      </div>
    ),
  },
  {
    n: "04",
    icon: IconWallet,
    kicker: "Get paid",
    title: "Money settles to you. Your ledger updates itself.",
    copy: "Stripe settles the payment to your own bank account — Origin never touches it. A webhook simultaneously credits your Origin wallet balance, so your records stay in sync automatically.",
    visual: (
      <div className="flex flex-col gap-2">
        <div className="text-[11px] tracking-[.08em] uppercase text-[var(--color-neutral-500)]">Available balance</div>
        <div className="font-medium text-[24px]">$50,610.44</div>
        <div className="flex items-center gap-2 text-[12px]" style={{ color: "#63c3b2" }}>
          <IconCheckCircle size={13} />
          +$2,000.00 received
        </div>
      </div>
    ),
  },
];

export default function PaymentsHowItWorksPage() {
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
          <span className="tag tag-accent text-[10.5px]">Payments · How it works</span>
          <h1 className="text-[clamp(34px,5.5vw,54px)] mt-5 tracking-[-0.03em] leading-[1.05]">
            A real checkout link, not a promise of one.
          </h1>
          <p className="text-[16px] text-[var(--color-neutral-400)] max-w-[520px] mt-5 leading-[1.6]">
            No fake account numbers, no simulated balances. Every payment link created here is a genuine Stripe
            checkout page, and every dollar paid through it is real.
          </p>
          <div className="flex gap-2.5 mt-7 flex-wrap justify-center">
            <a href="/signup" className="btn btn-primary text-sm px-[22px] py-[11px]">Try it free</a>
            <a href="/payments" className="btn btn-secondary text-sm px-[22px] py-[11px]">Open Payments</a>
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
                  style={{ background: "var(--color-bg)", borderColor: "var(--color-divider)", boxShadow: "var(--shadow-md)", animationDelay: `${i * 0.6}s` }}
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
              <div className="text-[15px] font-medium">Origin never holds your money.</div>
              <div className="text-[12.5px] text-[var(--color-neutral-500)] mt-0.5">
                Stripe processes the charge and settles directly to your account — that's what makes this legal to run today.
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
