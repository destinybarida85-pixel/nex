"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { GhostButton } from "./motion/PillButtons";

const showcase = [
  {
    n: "01",
    category: "Documents & Signing",
    name: "Draft it, send it, get it signed",
    href: "/how-it-works/signing",
    hero: "/marketing/showcase-documents.jpg",
    small: ["/marketing/tile-documents.jpg", "/marketing/tile-signature.jpg"],
  },
  {
    n: "02",
    category: "Payments & Invoices",
    name: "A real invoice with a real pay button",
    href: "/how-it-works/payments",
    hero: "/marketing/showcase-payments.jpg",
    small: ["/marketing/tile-payments.jpg", "/marketing/tile-wallet.jpg"],
  },
  {
    n: "03",
    category: "White-label",
    name: "Your brand, front to back",
    href: "/how-it-works/whitelabel",
    hero: "/marketing/showcase-whitelabel.jpg",
    small: ["/marketing/tile-whitelabel.jpg", "/marketing/tile-certificate.jpg"],
  },
];

function Card({ card, index, total }: { card: (typeof showcase)[number]; index: number; total: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start start"] });
  // Each card settles slightly smaller than the one after it, so the stack
  // reads as depth rather than as cards simply covering each other.
  const targetScale = 1 - (total - 1 - index) * 0.03;
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale]);

  return (
    <div ref={ref} className="h-[85vh] flex items-start justify-center sticky" style={{ top: `calc(6rem + ${index * 28}px)` }}>
      <motion.div
        style={{ scale, background: "#0C0C0C", border: "2px solid #D7E2EA" }}
        className="w-full max-w-5xl rounded-[40px] sm:rounded-[50px] md:rounded-[60px] p-4 sm:p-6 md:p-8"
      >
        <div className="flex items-start justify-between gap-4 flex-wrap mb-4 sm:mb-6">
          <div className="flex items-start gap-4 sm:gap-6 min-w-0">
            <div className="font-black leading-none flex-none" style={{ color: "#D7E2EA", fontSize: "clamp(2rem, 7vw, 5rem)" }}>
              {card.n}
            </div>
            <div className="min-w-0 pt-1">
              <div className="uppercase tracking-widest text-[10px] sm:text-xs" style={{ color: "#8f9aa3" }}>
                {card.category}
              </div>
              <div className="font-medium mt-1" style={{ color: "#D7E2EA", fontSize: "clamp(1rem, 2.4vw, 1.9rem)" }}>
                {card.name}
              </div>
            </div>
          </div>
          <div className="hidden sm:block flex-none">
            <GhostButton href={card.href}>See it work</GhostButton>
          </div>
        </div>

        <div className="flex gap-3 sm:gap-4">
          <div className="flex flex-col gap-3 sm:gap-4" style={{ width: "40%" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={card.small[0]} alt="" loading="lazy" className="w-full object-cover rounded-[24px] sm:rounded-[34px] md:rounded-[44px]" style={{ height: "clamp(130px, 16vw, 230px)" }} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={card.small[1]} alt="" loading="lazy" className="w-full object-cover rounded-[24px] sm:rounded-[34px] md:rounded-[44px]" style={{ height: "clamp(160px, 22vw, 340px)" }} />
          </div>
          <div style={{ width: "60%" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={card.hero} alt="" loading="lazy" className="w-full h-full object-cover rounded-[24px] sm:rounded-[34px] md:rounded-[44px]" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function ShowcaseSection() {
  return (
    <section
      className="font-kanit relative z-10 -mt-10 sm:-mt-12 md:-mt-14 rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 pt-20 sm:pt-24 md:pt-28 pb-10"
      style={{ background: "#0C0C0C" }}
    >
      <h2
        className="hero-heading font-black uppercase leading-none tracking-tight text-center m-0 mb-12 sm:mb-16"
        style={{ fontSize: "clamp(3rem, 12vw, 160px)" }}
      >
        In practice
      </h2>

      {showcase.map((card, i) => (
        <Card key={card.n} card={card} index={i} total={showcase.length} />
      ))}
    </section>
  );
}
