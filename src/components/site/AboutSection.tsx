"use client";

import FadeIn from "./motion/FadeIn";
import AnimatedText from "./motion/AnimatedText";
import { GlowButton } from "./motion/PillButtons";

// The original spec floated four decorative 3D props (a moon, a lego brick)
// in the corners. Those belong to a creator portfolio; here the same corner
// composition is filled with the product's own generated renders, so the
// decoration still says what Origin actually does.
const corners = [
  { src: "/marketing/tile-documents.jpg", cls: "top-[4%] left-[1%] sm:left-[2%] md:left-[4%] w-[120px] sm:w-[160px] md:w-[210px]", x: -80, delay: 0.1 },
  { src: "/marketing/tile-wallet.jpg", cls: "bottom-[8%] left-[3%] sm:left-[6%] md:left-[10%] w-[100px] sm:w-[140px] md:w-[180px]", x: -80, delay: 0.25 },
  { src: "/marketing/tile-certificate.jpg", cls: "top-[4%] right-[1%] sm:right-[2%] md:right-[4%] w-[120px] sm:w-[160px] md:w-[210px]", x: 80, delay: 0.15 },
  { src: "/marketing/tile-payments.jpg", cls: "bottom-[8%] right-[3%] sm:right-[6%] md:right-[10%] w-[130px] sm:w-[170px] md:w-[220px]", x: 80, delay: 0.3 },
];

export default function AboutSection() {
  return (
    <section
      id="about"
      className="font-kanit relative min-h-screen flex flex-col items-center justify-center px-5 sm:px-8 md:px-10 py-20 overflow-hidden"
      style={{ background: "#0C0C0C" }}
    >
      {corners.map((c) => (
        <FadeIn key={c.src} delay={c.delay} x={c.x} y={0} duration={0.9} className={`absolute ${c.cls} pointer-events-none hidden sm:block`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={c.src} alt="" className="w-full h-auto rounded-2xl opacity-70" />
        </FadeIn>
      ))}

      <div className="relative z-10 flex flex-col items-center gap-10 sm:gap-14 md:gap-16">
        <FadeIn delay={0} y={40}>
          <h2
            className="hero-heading font-black uppercase leading-none tracking-tight text-center m-0"
            style={{ fontSize: "clamp(3rem, 12vw, 160px)" }}
          >
            What it is
          </h2>
        </FadeIn>

        <AnimatedText
          text="Origin runs the whole business under your own name: draft a document with AI, send it for signature, take the payment, and watch the money land in your wallet. Your clients never see us — only you. Let's build something that finally works end to end."
          className="font-medium text-center leading-relaxed max-w-[560px] m-0"
          style={{ color: "#D7E2EA", fontSize: "clamp(1rem, 2vw, 1.35rem)" }}
        />
      </div>

      <div className="relative z-10 mt-16 sm:mt-20 md:mt-24">
        <FadeIn delay={0.1} y={20}>
          <GlowButton href="/signup">Start Free</GlowButton>
        </FadeIn>
      </div>
    </section>
  );
}
