"use client";

import { useEffect, useState } from "react";
import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";
import ScrollReveal from "@/components/site/ScrollReveal";
import TiltCard from "@/components/site/TiltCard";
import {
  IconSparkle,
  IconMessages,
  IconDocuments,
  IconESign,
  IconArrowRight,
  IconShieldCheck,
} from "@/components/icons";

const PROMPT = "Draft an NDA for Northbeam Co., standard mutual terms, 2-year survival.";
const REPLY = "Done — I've drafted a mutual NDA for Northbeam Co. with a 2-year survival clause. Review it on the right.";

function useTypedText(fullText: string, active: boolean, speed = 28) {
  const [text, setText] = useState("");
  useEffect(() => {
    if (!active) {
      setText("");
      return;
    }
    let i = 0;
    setText("");
    const id = setInterval(() => {
      i += 1;
      setText(fullText.slice(0, i));
      if (i >= fullText.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [fullText, active, speed]);
  return text;
}

function LiveTypingDemo() {
  // Cycle: type the prompt -> pause -> show "thinking" -> reveal the reply -> pause -> restart.
  const [phase, setPhase] = useState<"typing" | "thinking" | "reply" | "pause">("typing");
  const typedPrompt = useTypedText(PROMPT, phase === "typing");

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (phase === "typing") {
      timeout = setTimeout(() => setPhase("thinking"), PROMPT.length * 28 + 500);
    } else if (phase === "thinking") {
      timeout = setTimeout(() => setPhase("reply"), 1100);
    } else if (phase === "reply") {
      timeout = setTimeout(() => setPhase("pause"), 3400);
    } else if (phase === "pause") {
      timeout = setTimeout(() => setPhase("typing"), 1400);
    }
    return () => clearTimeout(timeout);
  }, [phase]);

  const showPrompt = phase !== "typing" || typedPrompt.length > 0;

  return (
    <div className="rounded-xl p-5 flex flex-col gap-3 border min-h-[220px]" style={{ background: "var(--color-bg)", borderColor: "var(--color-divider)", boxShadow: "var(--shadow-md)" }}>
      <div className="flex items-center gap-2">
        <IconSparkle size={14} className="text-[var(--color-accent)]" />
        <span className="text-[11px] tracking-[.06em] uppercase text-[var(--color-neutral-500)]">Origin AI</span>
      </div>

      {showPrompt && (
        <div className="rounded-lg p-3 text-[13px] self-end max-w-[85%]" style={{ background: "var(--color-accent-900)", color: "var(--color-text)" }}>
          {phase === "typing" ? typedPrompt : PROMPT}
          {phase === "typing" && <span className="inline-block w-[2px] h-[13px] ml-0.5 align-middle" style={{ background: "var(--color-accent-300)", animation: "nx-caret-blink 0.9s steps(1) infinite" }} />}
        </div>
      )}

      {phase === "thinking" && (
        <div className="flex items-center gap-1.5 rounded-lg p-3 max-w-[60%]" style={{ background: "var(--color-surface)" }}>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "var(--color-neutral-500)", animation: `nx-dot-bounce 1s ${i * 0.15}s ease-in-out infinite` }}
            />
          ))}
        </div>
      )}

      {phase === "reply" || phase === "pause" ? (
        <div className="rounded-lg p-3 text-[13px] max-w-[90%]" style={{ background: "var(--color-surface)" }}>
          {REPLY}
        </div>
      ) : null}

      <style>{`
        @keyframes nx-caret-blink { 0%, 50% { opacity: 1; } 50.01%, 100% { opacity: 0; } }
        @keyframes nx-dot-bounce { 0%, 60%, 100% { transform: translateY(0); opacity: 0.5; } 30% { transform: translateY(-4px); opacity: 1; } }
      `}</style>
    </div>
  );
}

const steps = [
  {
    n: "01",
    icon: IconMessages,
    kicker: "Just ask",
    title: "Type what you need, in plain English.",
    copy: "No templates to hunt for. Tell Origin AI what you're drafting — an NDA, an invoice, an offer letter, a report — the same way you'd ask a colleague.",
  },
  {
    n: "02",
    icon: IconSparkle,
    kicker: "Real AI, not canned text",
    title: "Claude drafts it, live, using your business context.",
    copy: "This runs on a real Claude API call, not a script that fills in a template. It writes real sections, real clauses, real numbers — genuinely usable language, not lorem ipsum.",
  },
  {
    n: "03",
    icon: IconDocuments,
    kicker: "Edit anything",
    title: "Every field is yours to change.",
    copy: "Title, sections, numbers — click Edit and it's a real editable document, not a static preview. Fix a clause, adjust an amount, and it's saved.",
  },
  {
    n: "04",
    icon: IconESign,
    kicker: "Put it to work",
    title: "Send it for signature or attach a payment.",
    copy: "The document you just drafted flows straight into the real e-signature and payment flows — no exporting, no copy-pasting into another tool.",
  },
];

export default function AiAssistantHowItWorksPage() {
  return (
    <>
      <Nav />
      <section className="relative overflow-hidden">
        <div className="nx-grid-bg absolute inset-0 pointer-events-none" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(820px 460px at 50% -6%, color-mix(in srgb, var(--color-accent) 16%, transparent), transparent)" }}
        />
        <div className="relative max-w-[760px] mx-auto px-6 pt-[100px] pb-10 flex flex-col items-center text-center">
          <span className="tag tag-accent text-[10.5px]">AI Assistant · How it works</span>
          <h1 className="text-[clamp(34px,5.5vw,54px)] mt-5 tracking-[-0.03em] leading-[1.05]">
            Watch it draft, right in front of you.
          </h1>
          <p className="text-[16px] text-[var(--color-neutral-400)] max-w-[520px] mt-5 leading-[1.6]">
            This is a live simulation of exactly what happens in the real product — type a request, get a real,
            usable draft back in seconds.
          </p>
        </div>

        <div className="relative max-w-[620px] mx-auto px-6 pb-16">
          <TiltCard maxTilt={4} scale={1.01}>
            <LiveTypingDemo />
          </TiltCard>
        </div>

        <div className="relative flex gap-2.5 justify-center pb-16 flex-wrap">
          <a href="/signup" className="btn btn-primary text-sm px-[22px] py-[11px]">Try it free</a>
          <a href="/assistant" className="btn btn-secondary text-sm px-[22px] py-[11px]">Open AI Assistant</a>
        </div>
      </section>

      <section className="max-w-[980px] mx-auto px-6 pb-24 flex flex-col gap-2">
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
                  <step.icon size={14} className="text-[var(--color-accent)]" />
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
            <IconShieldCheck size={20} className="text-[var(--color-accent)]" />
            <div>
              <div className="text-[15px] font-medium">A real Claude API call, every time.</div>
              <div className="text-[12.5px] text-[var(--color-neutral-500)] mt-0.5">
                If no API key is configured yet, the product falls back to a canned demo response — never silently pretends.
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
