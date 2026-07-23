"use client";

import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";
import ScrollReveal from "@/components/site/ScrollReveal";
import TiltCard from "@/components/site/TiltCard";
import { IconAnalytics, IconArrowRight, IconCheckCircle, IconSparkle } from "@/components/icons";

const steps = [
  {
    n: "01",
    kicker: "Revenue & expenses",
    title: "The shape of your business, at a glance.",
    copy: "Revenue, expenses, and net profit charted side by side, so trends are obvious without exporting anything to a spreadsheet.",
  },
  {
    n: "02",
    kicker: "Cash flow",
    title: "See what's actually moving, month to month.",
    copy: "A rolling view of money in versus money out, so a slow month doesn't sneak up on you.",
  },
  {
    n: "03",
    kicker: "AI insights",
    title: "Origin AI reads the numbers with you.",
    copy: "Ask what's driving a change in spend or revenue, in plain language, instead of building a pivot table yourself.",
  },
];

export default function AnalyticsHowItWorksPage() {
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
          <span className="tag tag-accent text-[10.5px]">Analytics · How it works</span>
          <h1 className="text-[clamp(34px,5.5vw,54px)] mt-5 tracking-[-0.03em] leading-[1.05]">
            Your numbers, read in plain language.
          </h1>
          <p className="text-[16px] text-[var(--color-neutral-400)] max-w-[520px] mt-5 leading-[1.6]">
            Revenue, expenses, and cash flow, visualized clearly — with Origin AI on hand to explain what changed.
          </p>
          <div className="flex gap-2.5 mt-7 flex-wrap justify-center">
            <a href="/signup" className="btn btn-primary text-sm px-[22px] py-[11px]">Try it free</a>
            <a href="/analytics" className="btn btn-secondary text-sm px-[22px] py-[11px]">Open Analytics</a>
          </div>
        </div>

        <div className="relative max-w-[560px] mx-auto px-6 pb-16">
          <TiltCard maxTilt={4} scale={1.01}>
            <div className="rounded-xl p-5 border flex flex-col gap-3" style={{ background: "var(--color-bg)", borderColor: "var(--color-divider)", boxShadow: "var(--shadow-md)" }}>
              <div className="flex items-center gap-2">
                <IconAnalytics size={14} className="text-[var(--color-accent)]" />
                <span className="text-[11px] tracking-[.06em] uppercase text-[var(--color-neutral-500)]">Revenue · 6 months</span>
              </div>
              <div className="flex gap-[3px] items-end h-16">
                {[22, 30, 26, 40, 34, 48].map((h, i) => (
                  <span key={i} className="flex-1 rounded-sm" style={{ height: `${h}px`, background: "var(--color-accent)", opacity: 0.4 + i * 0.1 }} />
                ))}
              </div>
              <div className="text-[12.5px]" style={{ color: "#63c3b2" }}>▲ 18.4% vs last period</div>
            </div>
          </TiltCard>
        </div>
      </section>

      <section className="max-w-[980px] mx-auto px-6 pb-16 flex flex-col gap-2">
        {steps.map((step, i) => (
          <ScrollReveal key={step.n} delay={Math.min(i * 0.05, 0.2)}>
            <div className="flex items-start gap-4 py-6 border-t" style={{ borderColor: "var(--color-divider)" }}>
              <span
                className="w-9 h-9 rounded-full grid place-items-center text-[12px] font-medium flex-none"
                style={{ background: "var(--color-accent-900)", color: "var(--color-accent-300)", border: "1px solid color-mix(in srgb, var(--color-accent) 40%, transparent)" }}
              >
                {step.n}
              </span>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <IconSparkle size={14} className="text-[var(--color-accent)]" />
                  <span className="card-kicker">{step.kicker}</span>
                </div>
                <h3 className="text-[20px] tracking-[-0.01em]">{step.title}</h3>
                <p className="text-sm text-[var(--color-neutral-400)] leading-[1.65] mt-2 max-w-[560px]">{step.copy}</p>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </section>

      <section className="max-w-[1160px] mx-auto px-6 pb-20">
        <div className="nx-footer-panel flex flex-wrap items-center gap-6 justify-between">
          <div className="flex items-center gap-3">
            <IconCheckCircle size={20} className="text-[var(--color-accent)]" />
            <div>
              <div className="text-[15px] font-medium">Where this stands, honestly.</div>
              <div className="text-[12.5px] text-[var(--color-neutral-500)] mt-0.5">
                The top KPI row (revenue, expenses, margin, paying counterparties) is now computed from your real
                wallet transactions. The deeper charts below it (trend lines, health score, expense breakdown) are
                still illustrative — that's the next piece to wire to real time-series data.
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
