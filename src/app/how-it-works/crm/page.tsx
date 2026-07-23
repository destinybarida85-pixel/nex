"use client";

import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";
import ScrollReveal from "@/components/site/ScrollReveal";
import TiltCard from "@/components/site/TiltCard";
import {
  IconClients,
  IconArrowRight,
  IconCheckCircle,
} from "@/components/icons";

const stages = ["Lead", "Qualified", "Proposal", "Negotiation", "Won"];

const steps = [
  {
    n: "01",
    kicker: "See every deal",
    title: "One board, every stage of your pipeline.",
    copy: "Lead through Won, laid out as a kanban board. Each card shows the deal value and how long it's sat in that stage, so nothing quietly goes cold.",
  },
  {
    n: "02",
    kicker: "Drag it forward",
    title: "Move a deal by dragging the card — genuinely.",
    copy: "This isn't a static picture of a kanban board. Drag any card to a new column right now on the CRM page and it actually moves, live, in your browser.",
  },
  {
    n: "03",
    kicker: "Client history",
    title: "Every client's context, in one place.",
    copy: "Deals connect to a client record, so the people closing the deal have the same history in front of them, not scattered across email threads.",
  },
];

export default function CrmHowItWorksPage() {
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
          <span className="tag tag-accent text-[10.5px]">CRM & Pipeline · How it works</span>
          <h1 className="text-[clamp(34px,5.5vw,54px)] mt-5 tracking-[-0.03em] leading-[1.05]">
            Your pipeline, actually draggable.
          </h1>
          <p className="text-[16px] text-[var(--color-neutral-400)] max-w-[520px] mt-5 leading-[1.6]">
            A real, interactive kanban board — drag deals between stages right now on the live product page below.
          </p>
          <div className="flex gap-2.5 mt-7 flex-wrap justify-center">
            <a href="/signup" className="btn btn-primary text-sm px-[22px] py-[11px]">Try it free</a>
            <a href="/crm" className="btn btn-secondary text-sm px-[22px] py-[11px]">Open the pipeline</a>
          </div>
        </div>

        <div className="relative max-w-[900px] mx-auto px-6 pb-16">
          <TiltCard maxTilt={3} scale={1.008}>
            <div className="rounded-xl p-5 border overflow-x-auto" style={{ background: "var(--color-bg)", borderColor: "var(--color-divider)", boxShadow: "var(--shadow-md)" }}>
              <div className="flex gap-3 min-w-[640px]">
                {stages.map((s) => (
                  <div key={s} className="flex-1 min-w-[110px] rounded-lg p-2.5" style={{ background: "var(--color-surface)" }}>
                    <div className="text-[10.5px] tracking-[.04em] uppercase text-[var(--color-neutral-500)] mb-2">{s}</div>
                    <div className="rounded-md p-2 text-[10.5px]" style={{ background: "var(--color-bg)", border: "1px solid var(--color-divider)" }}>
                      Halcyon Ventures
                      <div className="text-[9.5px] text-[var(--color-neutral-500)] mt-0.5">$18,500</div>
                    </div>
                  </div>
                ))}
              </div>
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
                  <IconClients size={14} className="text-[var(--color-accent)]" />
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
              <div className="text-[15px] font-medium">Real and saved.</div>
              <div className="text-[12.5px] text-[var(--color-neutral-500)] mt-0.5">
                Every deal you add and every drag between stages is saved to your account. Refresh the page and it's
                still there.
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
