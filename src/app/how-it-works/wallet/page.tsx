"use client";

import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";
import ScrollReveal from "@/components/site/ScrollReveal";
import TiltCard from "@/components/site/TiltCard";
import WalkthroughScene from "@/components/site/WalkthroughScene";
import {
  IconSparkle,
  IconESign,
  IconLink,
  IconWallet,
  IconArrowRight,
  IconCheckCircle,
  IconShieldCheck,
} from "@/components/icons";

const steps = [
  {
    n: "01",
    icon: IconSparkle,
    kicker: "Draft",
    title: "Ask the AI Assistant for the contract.",
    copy: "Tell Origin AI what you need — an NDA, a services agreement, a deposit invoice. It drafts real, usable language in seconds, pulling in your business context automatically.",
    visual: (
      <div className="flex flex-col gap-2.5">
        <div className="rounded-lg p-3 text-[12.5px] self-end max-w-[80%]" style={{ background: "var(--color-accent-900)", color: "var(--color-text)" }}>
          Draft a services agreement for Northbeam Co., $6,200 deposit.
        </div>
        <div className="rounded-lg p-3 text-[12.5px] max-w-[85%]" style={{ background: "var(--color-surface)" }}>
          Done — I&rsquo;ve drafted the agreement with a $6,200 deposit clause. Review it on the right.
        </div>
      </div>
    ),
  },
  {
    n: "02",
    icon: IconESign,
    kicker: "Sign",
    title: "Send it, they sign it, it's provable.",
    copy: "Your client signs from any device — no account needed. Every signature is hashed and chained to the document, so tampering after the fact is mathematically detectable, not just promised.",
    visual: (
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-[12.5px]">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#63c3b2" }} />
          <span style={{ color: "#63c3b2" }} className="font-medium">Signed &amp; sealed</span>
        </div>
        <div className="font-mono text-[11px] text-[var(--color-neutral-500)]">Certificate OG-CERT-8F21</div>
        <div className="h-8 border-b border-[var(--color-divider)]" />
        <div className="text-[10.5px] text-[var(--color-neutral-500)]">Signed Jul 22, 2026 · IP verified · Hash-chained</div>
      </div>
    ),
  },
  {
    n: "03",
    icon: IconLink,
    kicker: "Attach payment",
    title: "Turn the deposit clause into a real payment link.",
    copy: "One click creates a genuine, live Stripe checkout link for the exact amount in the contract. Share it however you like — it's a real stripe.com page, not a mockup.",
    visual: (
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between text-[12.5px]">
          <span>Northbeam Co. deposit</span>
          <span className="font-medium">$6,200.00</span>
        </div>
        <div className="flex items-center gap-2 p-2.5 rounded-lg" style={{ background: "var(--color-surface)" }}>
          <IconLink size={13} className="text-[var(--color-accent)] flex-none" />
          <span className="text-[11px] font-mono truncate flex-1" style={{ color: "var(--color-neutral-400)" }}>
            buy.stripe.com/northbeam-deposit
          </span>
        </div>
        <span className="tag tag-accent text-[9.5px] self-start">Live</span>
      </div>
    ),
  },
  {
    n: "04",
    icon: IconWallet,
    kicker: "Get paid",
    title: "Money lands. Your ledger updates itself.",
    copy: "The moment they pay, a webhook credits your Origin wallet balance and logs the transaction — no manual reconciliation, no spreadsheet. You just watch the number go up.",
    visual: (
      <div className="flex flex-col gap-2.5">
        <div className="text-[11px] tracking-[.08em] uppercase text-[var(--color-neutral-500)]">Available balance</div>
        <div className="font-medium text-[26px]">$54,810.44</div>
        <div className="flex items-center gap-2 text-[12px]" style={{ color: "#63c3b2" }}>
          <IconCheckCircle size={13} />
          +$6,200.00 from Northbeam Co.
        </div>
      </div>
    ),
  },
];

export default function WalletHowItWorksPage() {
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
          <span className="tag tag-accent text-[10.5px]">Business Wallet · How it works</span>
          <h1 className="text-[clamp(34px,5.5vw,54px)] mt-5 tracking-[-0.03em] leading-[1.05]">
            From contract to cash, in one flow.
          </h1>
          <p className="text-[16px] text-[var(--color-neutral-400)] max-w-[520px] mt-5 leading-[1.6]">
            One real feature, start to finish: draft a contract, get it signed, attach a real payment link, get
            paid. No separate tools, no copy-pasting between apps.
          </p>
          <div className="flex gap-2.5 mt-7 flex-wrap justify-center">
            <a href="/signup" className="btn btn-primary text-sm px-[22px] py-[11px]">Try it free</a>
            <a href="/wallet" className="btn btn-secondary text-sm px-[22px] py-[11px]">Open the wallet</a>
          </div>
        </div>

        {/* Auto-playing 3D walkthrough: the whole flow driving itself, start to finish. */}
        <div className="relative max-w-[900px] mx-auto px-6 pb-6">
          <div className="text-center mb-4">
            <span className="text-[11px] tracking-[.08em] uppercase text-[var(--color-neutral-500)]">Watch it run, start to finish</span>
          </div>
          <WalkthroughScene />
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
              <div className="flex items-center gap-2 mb-1 md:hidden">
                <step.icon size={14} className="text-[var(--color-accent)]" />
                <span className="card-kicker">{step.kicker}</span>
              </div>
              <div className="hidden md:flex items-center gap-2 mb-1">
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
              <div className="text-[15px] font-medium">Real signatures. Real payments. Nothing simulated.</div>
              <div className="text-[12.5px] text-[var(--color-neutral-500)] mt-0.5">
                Signature hashes are independently verifiable. Payments run through Stripe, settling to your own account.
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
