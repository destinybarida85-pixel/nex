"use client";

import { useEffect, useState } from "react";
import ProductFrame from "@/components/site/ProductFrame";

// Drop-in slot for the hero visual.
//
// Put a file at one of these paths in /public and this component uses it
// automatically — no code change needed:
//
//   public/hero/hero.mp4     ← preferred: a short silent loop (Wavespeed etc.)
//   public/hero/hero.webp    ← or a still image
//
// With neither present it falls back to ProductFrame — the real product UI
// rendered live — so the page is never broken while an asset is being made,
// and stays sharp at any size.
// The probe runs client-side because /public is served statically and there is
// nothing to ask the server about at build time.
const VIDEO_SRC = "/hero/hero.mp4";
const IMAGE_SRC = "/hero/hero.webp";

type Slot = "checking" | "video" | "image" | "fallback";

export default function HeroMedia() {
  const [slot, setSlot] = useState<Slot>("checking");

  useEffect(() => {
    let cancelled = false;

    async function probe(url: string) {
      try {
        const res = await fetch(url, { method: "HEAD" });
        // Next serves an HTML 404 page rather than a hard failure for missing
        // static files in some setups, so the content type is the real check.
        const type = res.headers.get("content-type") ?? "";
        return res.ok && !type.includes("text/html");
      } catch {
        return false;
      }
    }

    (async () => {
      if (await probe(VIDEO_SRC)) {
        if (!cancelled) setSlot("video");
        return;
      }
      if (await probe(IMAGE_SRC)) {
        if (!cancelled) setSlot("image");
        return;
      }
      if (!cancelled) setSlot("fallback");
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (slot === "checking" || slot === "fallback") {
    return <ProductFrame />;
  }

  return (
    <div
      className="relative rounded-2xl overflow-hidden"
      style={{
        border: "1px solid var(--color-divider)",
        boxShadow: "0 40px 90px -50px color-mix(in srgb, var(--color-accent) 45%, transparent), var(--shadow-lg)",
      }}
    >
      {slot === "video" ? (
        <video
          src={VIDEO_SRC}
          autoPlay
          muted
          loop
          playsInline
          // Decorative: the headline already carries the meaning, and an
          // autoplaying loop with no audio track has nothing to caption.
          aria-hidden
          className="w-full h-auto block"
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={IMAGE_SRC} alt="" aria-hidden className="w-full h-auto block" />
      )}

      {/* Keeps the visual sitting in the page rather than punching out of it —
          the restrained treatment, not a full-bleed hero video. */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, transparent 60%, color-mix(in srgb, var(--color-bg) 85%, transparent))",
        }}
      />
    </div>
  );
}
