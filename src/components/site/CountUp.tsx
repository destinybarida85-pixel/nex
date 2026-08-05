"use client";

import { useEffect, useRef, useState } from "react";

// Counts up from 0 to `value` once scrolled into view, once — not on every
// re-render, and not before anyone's actually looking at it. Reduced-motion
// visitors get the final number immediately rather than a forced animation.
export default function CountUp({
  value,
  duration = 1400,
  format,
}: {
  value: number;
  duration?: number;
  format: (n: number) => string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(value);
      return;
    }
    // Backstop, not a normal code path: requestAnimationFrame is throttled
    // or fully paused for a backgrounded/non-composited tab in some
    // environments, which would otherwise leave this stuck at 0 forever —
    // strictly worse than the hardcoded numbers this replaced, since now
    // it'd be displaying wrong information by accident instead of by
    // design. Guarantees the real value lands even if the animation
    // mechanism never gets to run at all.
    const fallback = setTimeout(() => setDisplay(value), duration + 400);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !done.current) {
          done.current = true;
          const start = performance.now();
          function tick(now: number) {
            const t = Math.min(1, (now - start) / duration);
            // ease-out cubic — fast start, settles gently rather than
            // ticking linearly to a hard stop.
            const eased = 1 - Math.pow(1 - t, 3);
            setDisplay(Math.round(value * eased));
            if (t < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      clearTimeout(fallback);
    };
  }, [value, duration]);

  return <span ref={ref}>{format(display)}</span>;
}
