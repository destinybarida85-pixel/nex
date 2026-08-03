// Two pill-button styles used across the 3D homepage sections. Colours use
// Origin's real accent family (--color-accent / accent-900) rather than the
// original spec's arbitrary magenta-to-orange gradient, so this still reads
// as the same product as the rest of the site, not a different brand pasted
// on top.

export function GlowButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="no-underline inline-flex items-center justify-center rounded-full font-medium uppercase tracking-widest text-white px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4 text-xs sm:text-sm md:text-base"
      style={{
        background: "linear-gradient(123deg, #1a1530 7%, #6a4fd9 37%, #9184d9 72%, #c98bd9 100%)",
        boxShadow: "0px 4px 4px rgba(145, 132, 217, 0.25), 4px 4px 12px rgba(145, 132, 217, 0.35) inset",
        outline: "2px solid rgba(255,255,255,0.9)",
        outlineOffset: -3,
      }}
    >
      {children}
    </a>
  );
}

export function GhostButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="no-underline inline-flex items-center justify-center rounded-full font-medium uppercase tracking-widest px-8 py-3 sm:px-10 sm:py-3.5 text-sm sm:text-base transition-colors"
      style={{ border: "2px solid #D7E2EA", color: "#D7E2EA" }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(215,226,234,0.1)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      {children}
    </a>
  );
}
