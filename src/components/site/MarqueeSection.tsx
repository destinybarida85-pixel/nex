"use client";

import { useEffect, useRef } from "react";

const row1 = ["/marketing/tile-documents.jpg", "/marketing/tile-signature.jpg", "/marketing/tile-payments.jpg"];
const row2 = ["/marketing/tile-wallet.jpg", "/marketing/tile-whitelabel.jpg", "/marketing/tile-certificate.jpg"];

function Row({ images, direction, sectionRef }: { images: string[]; direction: 1 | -1; sectionRef: React.RefObject<HTMLElement | null> }) {
  const rowRef = useRef<HTMLDivElement>(null);
  // Tripled so the row can scroll well past its own width in either
  // direction without ever exposing empty space at either edge.
  const tripled = [...images, ...images, ...images];

  useEffect(() => {
    function onScroll() {
      const section = sectionRef.current;
      const row = rowRef.current;
      if (!section || !row) return;
      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      const offset = (window.scrollY - sectionTop + window.innerHeight) * 0.3;
      row.style.transform = `translateX(${direction * (offset - 200)}px)`;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [direction, sectionRef]);

  return (
    <div className="flex gap-3 overflow-hidden">
      <div ref={rowRef} className="flex gap-3 flex-none" style={{ willChange: "transform" }}>
        {tripled.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={i}
            src={src}
            alt=""
            loading="lazy"
            className="rounded-2xl object-cover flex-none"
            style={{ width: 420, height: 270 }}
          />
        ))}
      </div>
    </div>
  );
}

export default function MarqueeSection() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section ref={sectionRef} className="font-kanit" style={{ background: "#0C0C0C" }}>
      <div className="flex flex-col gap-3 pt-24 sm:pt-32 md:pt-40 pb-10">
        <Row images={row1} direction={1} sectionRef={sectionRef} />
        <Row images={row2} direction={-1} sectionRef={sectionRef} />
      </div>
    </section>
  );
}
