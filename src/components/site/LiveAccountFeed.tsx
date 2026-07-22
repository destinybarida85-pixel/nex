"use client";

import { useEffect, useRef, useState } from "react";
import { generateAccountNumber } from "@/lib/generateAccountNumber";

const orgPool = [
  "Northbeam Co.",
  "Harborview Clinic",
  "Vantage Legal Group",
  "Fernbank Nonprofit",
  "Kestrel Studio",
  "Union Street Bakery",
  "Prairie Robotics",
  "Solene & Co.",
  "Brightfield Academy",
  "Cascade Relief",
];

type Entry = { id: number; org: string; account: string };

export default function LiveAccountFeed() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [reducedMotion, setReducedMotion] = useState(false);
  const idRef = useRef(0);
  const usedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);

    function pushEntry() {
      let org = orgPool[Math.floor(Math.random() * orgPool.length)];
      if (usedRef.current.size >= orgPool.length) usedRef.current.clear();
      let guard = 0;
      while (usedRef.current.has(org) && guard < orgPool.length) {
        org = orgPool[Math.floor(Math.random() * orgPool.length)];
        guard += 1;
      }
      usedRef.current.add(org);
      idRef.current += 1;
      setEntries((prev) => [{ id: idRef.current, org, account: generateAccountNumber() }, ...prev].slice(0, 4));
    }

    pushEntry();
    const interval = setInterval(pushEntry, 2400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-2 pt-2.5 mt-1 border-t border-[var(--color-divider)]">
      <div className="flex items-center gap-1.5">
        <span className="relative flex h-[7px] w-[7px]">
          {!reducedMotion && (
            <span
              className="absolute inline-flex h-full w-full rounded-full opacity-70 animate-ping"
              style={{ background: "#63c3b2" }}
            />
          )}
          <span className="relative inline-flex rounded-full h-[7px] w-[7px]" style={{ background: "#63c3b2" }} />
        </span>
        <span className="text-[9.5px] tracking-[.08em] uppercase text-[var(--color-neutral-500)]">
          Live · virtual accounts generating
        </span>
      </div>
      <div className="flex flex-col gap-[5px] font-mono text-[11px]">
        {entries.map((e, i) => (
          <div
            key={e.id}
            className="nx-feed-item flex items-center gap-2 text-[var(--color-neutral-400)]"
            style={{ opacity: 1 - i * 0.2 }}
          >
            <span className="text-[var(--color-neutral-300)] truncate max-w-[128px] font-sans">{e.org}</span>
            <span className="ml-auto">{e.account}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
