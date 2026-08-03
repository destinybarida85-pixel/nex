"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

function Char({ ch, progress, index, total }: { ch: string; progress: MotionValue<number>; index: number; total: number }) {
  const opacity = useTransform(progress, [index / total, (index + 1) / total], [0.2, 1]);
  return (
    <motion.span style={{ opacity }}>
      {ch === " " ? " " : ch}
    </motion.span>
  );
}

// Reveals text one character at a time as the reader scrolls past it, rather
// than all at once on viewport entry — the same technique the "About" section
// uses to pace a longer paragraph against scroll speed instead of a timer.
export default function AnimatedText({ text, className, style }: { text: string; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "end 0.2"] });
  const chars = Array.from(text);

  return (
    <p ref={ref} className={className} style={{ ...style, whiteSpace: "pre-wrap" }}>
      {chars.map((ch, i) => (
        <Char key={i} ch={ch} progress={scrollYProgress} index={i} total={chars.length} />
      ))}
    </p>
  );
}
