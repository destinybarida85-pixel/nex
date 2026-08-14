"use client";

import { useEffect, useRef, useState } from "react";

// Animates a real numeric value counting up to itself on mount/change — a
// "live reading" feel for stat tiles, not fabricated motion: it always
// settles on the exact real number, just eases into it.
export function useCountUp(target: number, durationMs = 700) {
  const [value, setValue] = useState(target);
  const prevTarget = useRef(target);

  useEffect(() => {
    const from = prevTarget.current;
    prevTarget.current = target;
    if (from === target) return;

    let raf: number;
    const start = performance.now();
    function tick(now: number) {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(from + (target - from) * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
      else setValue(target);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, durationMs]);

  return value;
}
