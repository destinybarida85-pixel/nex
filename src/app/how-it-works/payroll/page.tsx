"use client";

import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";
import ScrollReveal from "@/components/site/ScrollReveal";
import TiltCard from "@/components/site/TiltCard";
import { IconPayroll, IconArrowRight, IconCheckCircle, IconEmployees } from "@/components/icons";

const steps = [
  {
    n: "01",
    kicker: "Your team, in one directory",
    title: "Every employee, their role, their pay.",
    copy: "Add your team once — role, salary, start date. It's the source of truth every payroll run and payslip pulls from.",
  },
  {
    n: "02",
    kicker: "Run payroll",
    title: "Review the run before anything goes out.",
    copy: "See exactly who's being paid, how much, and what's withheld, laid out clearly before you confirm a run.",
  },
  {
    n: "03",
    kicker: "Payslips, generated",
    title: "A clean payslip per employee, every run.",
    copy: "Each run produces a payslip history your team can look back on — no digging through spreadsheets from three months ago.",
  },
];

export default function PayrollHowItWorksPage() {
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
          <span className="tag tag-accent text-[10.5px]">HR & Payroll · How it works</span>
          <h1 className="text-[clamp(34px,5.5vw,54px)] mt-5 tracking-[-0.03em] leading-[1.05]">
            Payroll, laid out clearly.
          </h1>
          <p className="text-[16px] text-[var(--color-neutral-400)] max-w-[520px] mt-5 leading-[1.6]">
            Your team directory, a payroll run, and payslip history — the full loop, in one place.
          </p>
          <div className="flex gap-2.5 mt-7 flex-wrap justify-center">
            <a href="/signup" className="btn btn-primary text-sm px-[22px] py-[11px]">Try it free</a>
            <a href="/payroll" className="btn btn-secondary text-sm px-[22px] py-[11px]">Open Payroll</a>
          </div>
        </div>

        <div className="relative max-w-[560px] mx-auto px-6 pb-16">
          <TiltCard maxTilt={4} scale={1.01}>
            <div className="rounded-xl p-5 border flex flex-col gap-2.5" style={{ background: "var(--color-bg)", borderColor: "var(--color-divider)", boxShadow: "var(--shadow-md)" }}>
              <div className="flex items-center gap-2">
                <IconPayroll size={14} className="text-[var(--color-accent)]" />
                <span className="text-[11px] tracking-[.06em] uppercase text-[var(--color-neutral-500)]">This run</span>
              </div>
              {[
                { name: "Amara Osei", role: "Product Manager", amount: "$8,400.00" },
                { name: "D. Chen", role: "Engineer", amount: "$9,100.00" },
              ].map((p) => (
                <div key={p.name} className="flex items-center gap-2.5 py-1.5 border-t" style={{ borderColor: "var(--color-divider)" }}>
                  <span className="w-7 h-7 rounded-full grid place-items-center text-[10.5px] font-medium flex-none" style={{ background: "var(--color-accent-900)", color: "var(--color-accent-300)" }}>
                    {p.name.charAt(0)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12.5px]">{p.name}</div>
                    <div className="text-[10.5px] text-[var(--color-neutral-500)]">{p.role}</div>
                  </div>
                  <span className="text-[12.5px] font-medium">{p.amount}</span>
                </div>
              ))}
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
                  <IconEmployees size={14} className="text-[var(--color-accent)]" />
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
                Your employee directory and payroll run history are real and saved. Actually depositing pay through
                a payroll processor isn&rsquo;t wired up yet — running a payroll here records the numbers, it
                doesn&rsquo;t move real money.
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
