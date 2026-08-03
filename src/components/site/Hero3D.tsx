"use client";

import FadeIn from "./motion/FadeIn";
import Magnet from "./motion/Magnet";
import { GlowButton } from "./motion/PillButtons";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Pricing", href: "#pricing" },
  { label: "Modules", href: "#modules" },
  { label: "Contact", href: "/contact" },
];

export default function Hero3D() {
  return (
    <section
      id="top"
      className="font-kanit relative h-screen flex flex-col justify-between"
      style={{ background: "#0C0C0C", overflowX: "clip" }}
    >
      <FadeIn delay={0} y={-20}>
        <nav className="flex items-center justify-between px-6 md:px-10 pt-6 md:pt-8">
          {navLinks.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="no-underline uppercase font-medium tracking-wider transition-opacity hover:opacity-70 text-sm md:text-lg lg:text-[1.4rem]"
              style={{ color: "#D7E2EA" }}
            >
              {l.label}
            </a>
          ))}
        </nav>
      </FadeIn>

      <div className="overflow-hidden mt-6 sm:mt-4 md:-mt-5 relative z-20 pointer-events-none">
        <FadeIn delay={0.15} y={40}>
          <h1
            className="hero-heading font-black uppercase tracking-tight leading-none whitespace-nowrap w-full text-center"
            style={{ fontSize: "clamp(2.6rem, 11.5vw, 9.5rem)" }}
          >
            This is Origin.
          </h1>
        </FadeIn>
      </div>

      {/* The Magnet-wrapped visual replaces the original spec's personal
          portrait — this is a product, not a person, so the centered hero
          image is a Wavespeed-generated render of Origin's own dashboard
          concept instead of a headshot.
          The spec's portrait was a transparent cut-out, so the giant heading
          could sit over it. This render is a rectangular image with a hard
          edge, so it needs the mask below to dissolve into the background —
          without it the photo reads as a box pasted across the headline. */}
      <Magnet
        padding={150}
        strength={6}
        className="absolute left-1/2 -translate-x-1/2 z-0 top-1/2 -translate-y-1/2 sm:top-auto sm:translate-y-0 sm:bottom-0 w-[300px] sm:w-[380px] md:w-[460px] lg:w-[540px]"
      >
        <FadeIn delay={0.6} y={30}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/marketing/hero-dashboard.jpg"
            alt=""
            className="w-full h-auto"
            style={{
              maskImage: "radial-gradient(70% 60% at 50% 55%, #000 45%, transparent 100%)",
              WebkitMaskImage: "radial-gradient(70% 60% at 50% 55%, #000 45%, transparent 100%)",
            }}
          />
        </FadeIn>
      </Magnet>

      <div className="flex items-end justify-between pb-7 sm:pb-8 md:pb-10 px-6 md:px-10 relative z-20">
        <FadeIn delay={0.35} y={20} className="max-w-[160px] sm:max-w-[220px] md:max-w-[260px]">
          <p
            className="font-light uppercase tracking-wide leading-snug m-0"
            style={{ color: "#D7E2EA", fontSize: "clamp(0.75rem, 1.4vw, 1.5rem)" }}
          >
            the operating system for businesses that run under their own brand
          </p>
        </FadeIn>
        <FadeIn delay={0.5} y={20}>
          <GlowButton href="/signup">Start Free</GlowButton>
        </FadeIn>
      </div>
    </section>
  );
}
