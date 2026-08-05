"use client";

import { useEffect, useState } from "react";
import ScrollReveal from "@/components/site/ScrollReveal";
import CountUp from "@/components/site/CountUp";

type Stats = { organizations: number; walletVolume30dCents: number; documentsSigned: number };

export default function StatBand() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/public-stats")
      .then((r) => r.json())
      .then((data) => {
        if (data.configured) {
          setStats({
            organizations: data.organizations,
            walletVolume30dCents: data.walletVolume30dCents,
            documentsSigned: data.documentsSigned,
          });
        }
      })
      .catch(() => {
        // Band just doesn't render below — no fabricated fallback numbers.
      });
  }, []);

  if (!stats) return null;

  const tiles = [
    { value: stats.organizations, format: (n: number) => n.toLocaleString(), label: "organizations run on Primue" },
    {
      value: stats.walletVolume30dCents / 100,
      format: (n: number) => `$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
      label: "moved through wallets, last 30 days",
    },
    { value: stats.documentsSigned, format: (n: number) => n.toLocaleString(), label: "documents signed and sealed" },
    { value: 9, format: (n: number) => String(n), label: "core modules, one login" },
  ];

  return (
    <section className="border-y border-[var(--color-divider)]">
      <div
        className="max-w-[1160px] mx-auto px-6 py-11 grid gap-6"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}
      >
        {tiles.map((s, i) => (
          <ScrollReveal key={s.label} delay={i * 0.06}>
            <div className="nx-stat-tile">
              <div className="font-medium text-[34px] tracking-[-0.01em]">
                <CountUp value={s.value} format={s.format} />
              </div>
              <div className="text-[13.5px] text-[var(--color-neutral-400)] mt-1">{s.label}</div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
