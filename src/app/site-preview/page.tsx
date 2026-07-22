"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { IconArrowRight, IconCheckCircle, IconShieldCheck, IconSparkle } from "@/components/icons";

const features = [
  { icon: IconShieldCheck, title: "Bank-grade security", copy: "Every account, card, and document is protected end-to-end." },
  { icon: IconSparkle, title: "AI-assisted workflows", copy: "Draft, review, and send documents in minutes, not days." },
  { icon: IconCheckCircle, title: "Built for your brand", copy: "Your clients only ever see your name, your colors, your domain." },
];

function SitePreview() {
  const params = useSearchParams();
  const name = params.get("name") || "Atlas Chambers";
  const color = params.get("color") || "#63c3b2";
  const domain = params.get("domain") || "portal.example.com";
  const powered = params.get("powered") === "1";
  const initial = name.trim().charAt(0).toUpperCase() || "A";

  return (
    <div className="min-h-screen" style={{ background: "#0c0c10", color: "#f4f4f7" }}>
      <header className="flex items-center gap-2.5 px-6 py-5 max-w-[1080px] mx-auto">
        <span
          className="w-8 h-8 rounded-[9px] grid place-items-center font-medium text-[15px]"
          style={{ background: `color-mix(in srgb, ${color} 22%, transparent)`, color }}
        >
          {initial}
        </span>
        <span className="text-[15px] font-medium">{name}</span>
        <div className="flex-1" />
        <a
          href="#get-started"
          className="text-[13px] px-4 py-2 rounded-lg no-underline font-medium"
          style={{ background: color, color: "#0c0c10" }}
        >
          Get started
        </a>
      </header>

      <section className="max-w-[760px] mx-auto text-center px-6 pt-16 pb-20 flex flex-col items-center gap-5">
        <span
          className="text-[11px] tracking-[.08em] uppercase px-3 py-1 rounded-full"
          style={{ background: `color-mix(in srgb, ${color} 16%, transparent)`, color }}
        >
          {name} client portal
        </span>
        <h1 className="text-[40px] sm:text-[52px] leading-[1.05] font-medium m-0 tracking-[-0.02em]">
          Everything {name} clients need, in one place.
        </h1>
        <p className="text-[16px] leading-[1.6] max-w-[520px]" style={{ color: "#a3a3ad" }}>
          Documents, payments, e-signatures, and support, all in a single branded portal built and hosted for you.
        </p>
        <a
          id="get-started"
          href="#"
          className="inline-flex items-center gap-2 text-[14px] font-medium px-5 py-3 rounded-lg no-underline mt-1"
          style={{ background: color, color: "#0c0c10" }}
        >
          Sign in to your portal
          <IconArrowRight size={15} />
        </a>
        <div className="text-[12px] font-mono mt-2" style={{ color: "#6b6b76" }}>{domain}</div>
      </section>

      <section className="max-w-[1080px] mx-auto px-6 pb-20 grid gap-4 grid-cols-1 sm:grid-cols-3">
        {features.map((f) => (
          <div
            key={f.title}
            className="rounded-xl p-5 flex flex-col gap-2.5"
            style={{ background: "#141418", border: "1px solid #232329" }}
          >
            <span
              className="w-8 h-8 rounded-[9px] grid place-items-center"
              style={{ background: `color-mix(in srgb, ${color} 18%, transparent)`, color }}
            >
              <f.icon size={16} />
            </span>
            <div className="text-[14px] font-medium">{f.title}</div>
            <div className="text-[13px] leading-[1.55]" style={{ color: "#9a9aa4" }}>{f.copy}</div>
          </div>
        ))}
      </section>

      <footer className="max-w-[1080px] mx-auto px-6 py-8 flex flex-wrap items-center gap-3 border-t" style={{ borderColor: "#1c1c22" }}>
        <span className="text-[12px]" style={{ color: "#6b6b76" }}>© {new Date().getFullYear()} {name}. All rights reserved.</span>
        <div className="flex-1" />
        {powered && (
          <span className="text-[11px]" style={{ color: "#6b6b76" }}>
            Powered by <span style={{ color: "#a3a3ad" }}>Origin</span>
          </span>
        )}
      </footer>
    </div>
  );
}

export default function SitePreviewPage() {
  return (
    <Suspense fallback={null}>
      <SitePreview />
    </Suspense>
  );
}
