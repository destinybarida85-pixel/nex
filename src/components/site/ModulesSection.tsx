"use client";

import FadeIn from "./motion/FadeIn";

// Every line here is a module that actually exists and was verified working
// in the product — no aspirational entries.
const modules = [
  { n: "01", name: "AI Documents", desc: "Draft from 94+ real templates across business, legal, land & property, finance and more — then style them with premium letterhead layouts, your own fonts and colours." },
  { n: "02", name: "E-Signature", desc: "Send one link, get it signed. One signer or two, both signing from the same link, with a tamper-evident certificate and a real stamp on the page." },
  { n: "03", name: "Payments & Invoices", desc: "Real Stripe payment links that double as branded invoices with their own shareable page — money settles straight into your own account." },
  { n: "04", name: "Certificates", desc: "AI-drafted premium certificates in three designs, each issued with a public verification link anyone holding a copy can check." },
  { n: "05", name: "White-label", desc: "Your name, your logo, your colour, your domain. Origin stays invisible — your clients only ever see you." },
];

export default function ModulesSection() {
  return (
    <section
      id="modules"
      className="font-kanit relative z-0 px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32 rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px]"
      style={{ background: "#FFFFFF" }}
    >
      <h2
        className="font-black uppercase text-center m-0 mb-16 sm:mb-20 md:mb-28"
        style={{ color: "#0C0C0C", fontSize: "clamp(3rem, 12vw, 160px)" }}
      >
        Modules
      </h2>

      <div className="max-w-5xl mx-auto">
        {modules.map((m, i) => (
          <FadeIn key={m.n} delay={i * 0.1}>
            <div
              className="flex items-start gap-5 sm:gap-8 md:gap-12 py-8 sm:py-10 md:py-12"
              style={{ borderTop: i === 0 ? "none" : "1px solid rgba(12, 12, 12, 0.15)" }}
            >
              <div
                className="font-black flex-none leading-none"
                style={{ color: "#0C0C0C", fontSize: "clamp(2rem, 10vw, 140px)" }}
              >
                {m.n}
              </div>
              <div className="min-w-0 pt-1 sm:pt-2">
                <div
                  className="font-medium uppercase"
                  style={{ color: "#0C0C0C", fontSize: "clamp(1rem, 2.2vw, 2.1rem)" }}
                >
                  {m.name}
                </div>
                <div
                  className="font-light leading-relaxed max-w-2xl mt-2"
                  style={{ color: "#0C0C0C", opacity: 0.6, fontSize: "clamp(0.85rem, 1.6vw, 1.25rem)" }}
                >
                  {m.desc}
                </div>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
