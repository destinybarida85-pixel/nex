"use client";

import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";
import ScrollReveal from "@/components/site/ScrollReveal";
import TiltCard from "@/components/site/TiltCard";
import {
  IconESign,
  IconPen,
  IconLock,
  IconCheckCircle,
  IconArrowRight,
  IconShieldCheck,
} from "@/components/icons";

const steps = [
  {
    n: "01",
    icon: IconESign,
    kicker: "Send it",
    title: "No account needed on their end.",
    copy: "Send any document for signature. Your signer opens a link on any device — phone, tablet, laptop — and doesn't need an Origin account of their own. Same reason every real e-sign service works this way.",
    visual: (
      <div className="flex flex-col gap-2">
        <div className="text-[12.5px] font-medium">Master Services Agreement</div>
        <div className="text-[11px] text-[var(--color-neutral-500)]">Sent to Halcyon Ventures · Requires signature</div>
        <div className="flex gap-1.5 mt-1">
          {["Review", "Verify", "Sign", "Complete"].map((s, i) => (
            <span key={s} className="tag text-[9px]" style={i === 0 ? { color: "var(--color-accent-300)" } : undefined}>{s}</span>
          ))}
        </div>
      </div>
    ),
  },
  {
    n: "02",
    icon: IconPen,
    kicker: "They sign",
    title: "Draw, type, or upload — their real signature.",
    copy: "Not a checkbox that says 'I agree.' The signer draws or types their actual signature, which gets hashed immediately along with the document they just read.",
    visual: (
      <div className="flex flex-col gap-2">
        <div className="h-14 rounded-lg border flex items-center justify-center" style={{ borderColor: "var(--color-divider)" }}>
          <span className="text-[22px]" style={{ fontFamily: "cursive", color: "var(--color-accent-300)" }}>D. Osei</span>
        </div>
        <div className="text-[10.5px] text-[var(--color-neutral-500)] text-center">Signed here</div>
      </div>
    ),
  },
  {
    n: "03",
    icon: IconLock,
    kicker: "It's hashed and chained",
    title: "Tamper-evidence, not just a promise.",
    copy: "Origin computes SHA-256 hashes of the document and signature, then chains this record to the previous one. Change anything in an earlier record, and every hash after it stops matching — provably.",
    visual: (
      <div className="flex flex-col gap-2 font-mono text-[10.5px]" style={{ color: "var(--color-neutral-400)" }}>
        <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full flex-none" style={{ background: "#63c3b2" }} />document_hash: 8f21a9…</div>
        <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full flex-none" style={{ background: "#63c3b2" }} />signature_hash: 40c9e2…</div>
        <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full flex-none" style={{ background: "var(--color-accent)" }} />record_hash: OG-CERT-8F21</div>
      </div>
    ),
  },
  {
    n: "04",
    icon: IconCheckCircle,
    kicker: "Certified",
    title: "A certificate ID either side can verify.",
    copy: "The signed document gets a certificate ID tied to its hash chain. Anyone can independently confirm the document hasn't been altered since it was signed — that's what makes it actually provable, not just logged.",
    visual: (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1.5 text-[12.5px]">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#63c3b2" }} />
          <span style={{ color: "#63c3b2" }} className="font-medium">Signed &amp; sealed</span>
        </div>
        <div className="font-mono text-[11px] text-[var(--color-neutral-500)]">Certificate OG-CERT-8F21</div>
        <div className="text-[10px] text-[var(--color-neutral-600)]">IP logged · timestamped · chain-verified</div>
      </div>
    ),
  },
];

export default function SigningHowItWorksPage() {
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
          <span className="tag tag-accent text-[10.5px]">E-Signatures · How it works</span>
          <h1 className="text-[clamp(34px,5.5vw,54px)] mt-5 tracking-[-0.03em] leading-[1.05]">
            Provable, not just promised.
          </h1>
          <p className="text-[16px] text-[var(--color-neutral-400)] max-w-[520px] mt-5 leading-[1.6]">
            Most e-sign tools just log that a click happened. Origin hash-chains every signature to the document it
            belongs to, so tampering after the fact is mathematically detectable.
          </p>
          <div className="flex gap-2.5 mt-7 flex-wrap justify-center">
            <a href="/signup" className="btn btn-primary text-sm px-[22px] py-[11px]">Try it free</a>
            <a href="/sign" className="btn btn-secondary text-sm px-[22px] py-[11px]">See the signing flow</a>
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
              <div className="text-[15px] font-medium">Independently verifiable, not just internally logged.</div>
              <div className="text-[12.5px] text-[var(--color-neutral-500)] mt-0.5">
                The hash-chain math works the same way regardless of who's asking — it's not a trust-us claim.
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
