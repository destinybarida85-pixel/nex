"use client";

import { useState } from "react";
import TiltCard from "@/components/site/TiltCard";
import ScrollReveal from "@/components/site/ScrollReveal";
import {
  IconWallet,
  IconSparkle,
  IconESign,
  IconPayments,
  IconClients,
  IconEmployees,
  IconAnalytics,
  IconGlobe,
  IconShieldCheck,
} from "@/components/icons";

function VisualFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="border border-[var(--color-divider)] rounded-xl p-5 bg-[var(--color-surface)] flex flex-col gap-2.5 h-full">
      {children}
    </div>
  );
}

const tenantBrands = [
  { initial: "A", color: "#63c3b2", name: "Atlas Chambers", domain: "portal.atlaschambers.com" },
  { initial: "B", color: "#d9a05b", name: "Brightfield Academy", domain: "brightfield.origin.io" },
  { initial: "C", color: "#7fa3e8", name: "Cascade Relief", domain: "give.cascaderelief.org" },
  { initial: "H", color: null as string | null, name: "Harbor City Council", domain: "services.harborcity.gov" },
];

const pipelineCols = [
  { label: "Lead", count: 12, color: "#7fa3e8" },
  { label: "Proposal", count: 6, color: "#d9a05b" },
  { label: "Won", count: 4, color: "#63c3b2" },
];

// "Replaces" is the consolidation pitch made concrete — not "an all-in-one
// platform" as an abstract claim, but the actual named tools/processes each
// module makes unnecessary, plus what that actually saves in time. This is
// the copy HighLevel's own site leans on hard and Primue's didn't have.
const modules = [
  {
    id: "wallet",
    kicker: "Business Wallet",
    icon: IconWallet,
    title: "A real business balance, inside your OS.",
    copy: "Track your balance and transactions in one place, and get paid through real, live Stripe payment links, not a fake account number. Receive, transfer, run payroll and pay vendors, all from one dashboard.",
    replaces: "Replaces a separate business bank portal and a standalone payment processor account.",
    timeframe: "Live the moment you sign up — no separate bank application or approval wait.",
    cta: "See how it works",
    ctaHref: "/how-it-works/wallet",
    visual: (
      <VisualFrame>
        <div className="flex items-center">
          <span className="text-[10.5px] tracking-[.08em] uppercase text-[var(--color-neutral-500)]">Available balance</span>
          <span className="tag tag-accent ml-auto text-[9.5px]">Live</span>
        </div>
        <div className="font-medium text-[26px] tracking-[-0.01em]">$48,610.44</div>
        <div className="flex gap-2 mt-1 flex-wrap">
          <button className="btn btn-primary text-xs">Receive</button>
          <button className="btn btn-secondary text-xs">Transfer</button>
          <button className="btn btn-secondary text-xs">Payment link</button>
        </div>
        <div className="flex flex-col gap-2 pt-2.5 mt-1 border-t border-[var(--color-divider)]">
          <span className="text-[9.5px] tracking-[.08em] uppercase text-[var(--color-neutral-500)]">Real payment links</span>
          {[
            { title: "Consulting deposit", amount: "$2,000.00" },
            { title: "Workshop tickets", amount: "$150.00" },
          ].map((l) => (
            <div key={l.title} className="flex items-center gap-2 text-[11px] text-[var(--color-neutral-400)]">
              <span className="truncate flex-1">{l.title}</span>
              <span className="text-[var(--color-neutral-300)]">{l.amount}</span>
            </div>
          ))}
        </div>
      </VisualFrame>
    ),
  },
  {
    id: "ai",
    kicker: "AI Assistant",
    icon: IconSparkle,
    title: "From prompt to finished document.",
    copy: "Draft contracts, invoices, HR letters and reports in seconds. Primue AI understands your business context (clients, terms, prior documents), so drafts arrive nearly done.",
    replaces: "Replaces paying a lawyer or consultant for routine drafting, and the blank-page time of starting from scratch.",
    timeframe: "Seconds per document instead of days waiting on a draft back.",
    cta: "See how it works",
    ctaHref: "/how-it-works/ai-assistant",
    visual: (
      <div
        className="rounded-xl p-5 flex flex-col gap-2.5 border h-full"
        style={{ borderColor: "color-mix(in srgb, var(--color-accent) 30%, transparent)", background: "var(--color-surface)" }}
      >
        <div className="flex items-center gap-2">
          <IconSparkle size={15} className="text-[var(--color-accent)]" />
          <span className="text-[14px] font-medium">Primue AI</span>
        </div>
        <div
          className="text-[14px] leading-[1.55] text-[var(--color-neutral-300)] px-3.5 py-3 rounded-lg"
          style={{ background: "color-mix(in srgb, var(--color-accent-900) 45%, transparent)" }}
        >
          &ldquo;Draft an NDA for Northbeam Co., standard mutual terms, 2-year survival.&rdquo;
        </div>
        <div className="text-xs text-[var(--color-neutral-500)]">
          Drafted in 8 seconds → sent for signature → sealed with a tamper-evident certificate.
        </div>
      </div>
    ),
  },
  {
    id: "esign",
    kicker: "E-Signature",
    icon: IconESign,
    title: "Legally binding, sealed in seconds.",
    copy: "Route any document for signature with a full audit trail and a tamper-evident certificate. No separate e-sign subscription required.",
    replaces: "Replaces a standalone DocuSign or HelloSign subscription.",
    timeframe: "Sent and signed in the same session — no separate tool to switch to.",
    cta: "See how it works",
    ctaHref: "/how-it-works/signing",
    visual: (
      <VisualFrame>
        <div className="text-[9.5px] tracking-[.08em] uppercase text-[var(--color-neutral-500)]">MSA · Halcyon Ventures</div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#63c3b2" }} />
          <span className="text-[14px] font-medium" style={{ color: "#63c3b2" }}>Signed &amp; sealed</span>
        </div>
        <div className="text-[10.5px] font-mono text-[var(--color-neutral-500)]">Certificate OG-CERT-8F21</div>
        <div className="flex gap-1 mt-1">
          {[0, 1, 2].map((i) => (
            <span key={i} className="flex-1 h-1 rounded-full" style={{ background: "#63c3b2", opacity: 0.35 + i * 0.25 }} />
          ))}
        </div>
      </VisualFrame>
    ),
  },
  {
    id: "certificates",
    kicker: "Certificates",
    icon: IconShieldCheck,
    title: "Premium certificates, issued in your name.",
    copy: "AI-drafted, professionally designed certificates for achievements, completion, or recognition — 15 designs, fully editable, sealed with your own stamp.",
    replaces: "Replaces hiring a designer for one-off certificates, or a separate certificate-generator subscription.",
    timeframe: "Minutes from prompt to a printable, sealed certificate.",
    cta: "See how it works",
    ctaHref: "/certificates",
    visual: (
      <div
        className="rounded-xl p-5 flex flex-col justify-between h-full min-h-[160px]"
        style={{
          background: "linear-gradient(120deg, #1a2436 55%, #c9a227 220%)",
          border: "1px solid var(--color-divider)",
        }}
      >
        <div className="text-[10px] tracking-[.1em] uppercase" style={{ color: "#e8d9a0" }}>Certificate</div>
        <div>
          <div className="text-[18px] font-medium" style={{ color: "#fff" }}>Certificate of Achievement</div>
          <div className="text-[11px] mt-1" style={{ color: "#c8cede" }}>Presented to Amara Okafor</div>
        </div>
        <div className="text-[9.5px]" style={{ color: "#9aa3ba" }}>Issued by your business · sealed &amp; signed</div>
      </div>
    ),
  },
  {
    id: "payments",
    kicker: "Payments & Invoices",
    icon: IconPayments,
    title: "Get paid without the follow-up.",
    copy: "Branded invoices, recurring billing, and shareable payment links, with automatic reminders so you're not the one chasing overdue clients.",
    replaces: "Replaces separate invoicing software, plus the hours spent manually chasing late payments.",
    timeframe: "Reminders send themselves — reclaim the time you spent following up by hand.",
    cta: "See how it works",
    ctaHref: "/how-it-works/payments",
    visual: (
      <VisualFrame>
        <div className="flex items-center">
          <span className="text-[10.5px] tracking-[.08em] uppercase text-[var(--color-neutral-500)]">Invoice #INV-2038</span>
          <span className="tag tag-neutral ml-auto text-[9.5px]">Overdue</span>
        </div>
        <div className="flex flex-col gap-1.5 mt-1 text-[13px] text-[var(--color-neutral-400)]">
          <div className="flex justify-between"><span>Design retainer · July</span><span>$6,200.00</span></div>
          <div className="flex justify-between"><span>Hosting &amp; infra</span><span>$550.00</span></div>
        </div>
        <div className="flex justify-between text-[14px] font-medium pt-2 border-t border-[var(--color-divider)]">
          <span>Total due</span><span>$6,750.00</span>
        </div>
        <button className="btn btn-primary text-xs self-start mt-1">Send reminder</button>
      </VisualFrame>
    ),
  },
  {
    id: "crm",
    kicker: "CRM & Projects",
    icon: IconClients,
    title: "Every client, every deal, in view.",
    copy: "A pipeline built for services businesses (leads, proposals, signed deals), plus the project and task tracking to deliver on them.",
    replaces: "Replaces a separate CRM subscription and a separate project-tracking tool.",
    timeframe: "One pipeline to check instead of switching between two logins.",
    cta: "See how it works",
    ctaHref: "/how-it-works/crm",
    visual: (
      <VisualFrame>
        <div className="text-[10.5px] tracking-[.08em] uppercase text-[var(--color-neutral-500)]">Sales pipeline</div>
        <div className="grid grid-cols-3 gap-2 mt-1">
          {pipelineCols.map((col) => (
            <div key={col.label} className="flex flex-col gap-1.5">
              <div className="text-[10px] text-[var(--color-neutral-500)]">{col.label}</div>
              <div className="text-[15px] font-medium" style={{ color: col.color }}>{col.count}</div>
              <div className="h-1.5 rounded-full" style={{ background: col.color, opacity: 0.55 }} />
            </div>
          ))}
        </div>
      </VisualFrame>
    ),
  },
  {
    id: "payroll",
    kicker: "HR & Payroll",
    icon: IconEmployees,
    title: "Run payroll like it's nothing.",
    copy: "Directory, attendance, leave, and salary runs, paid directly from the business wallet, with payslips generated automatically.",
    replaces: "Replaces a dedicated payroll service and manual payslip spreadsheets.",
    timeframe: "One run, paid straight from the wallet — no separate transfer step.",
    cta: "See how it works",
    ctaHref: "/how-it-works/payroll",
    visual: (
      <VisualFrame>
        <div className="flex items-center">
          <span className="text-[10.5px] tracking-[.08em] uppercase text-[var(--color-neutral-500)]">Payroll · July run</span>
          <span className="tag tag-accent ml-auto text-[9.5px]">Complete</span>
        </div>
        <div className="text-[19px] font-medium">$41,200.00</div>
        <div className="text-[11.5px] text-[var(--color-neutral-500)]">14 employees · paid from Business Wallet</div>
      </VisualFrame>
    ),
  },
  {
    id: "analytics",
    kicker: "Analytics",
    icon: IconAnalytics,
    title: "Know where the business stands.",
    copy: "Cash flow, growth trends, and a business health score, with AI-written summaries so a five-minute check tells you everything you need.",
    replaces: "Replaces piecing a picture together by hand from wallet, invoicing and payroll exports.",
    timeframe: "A five-minute check instead of an afternoon in spreadsheets.",
    cta: "See how it works",
    ctaHref: "/how-it-works/analytics",
    visual: (
      <VisualFrame>
        <div className="flex items-baseline">
          <span className="text-[10.5px] tracking-[.08em] uppercase text-[var(--color-neutral-500)]">Revenue · 6 months</span>
          <span className="ml-auto text-[11px]" style={{ color: "var(--color-accent-300)" }}>▲ 18.4%</span>
        </div>
        <svg viewBox="0 0 260 60" className="w-full h-auto block mt-1" role="presentation">
          <polyline
            points="0,48 40,38 80,42 120,24 160,30 200,10 260,16"
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </VisualFrame>
    ),
  },
  {
    id: "whitelabel",
    kicker: "True white-label",
    icon: IconGlobe,
    title: "Your clients see your brand. Only yours.",
    copy: "Logo, colors, domain, emails, PDFs, portal: every client-facing surface carries your identity. Primue runs invisibly behind the scenes, with a Super Admin console for the platform owner.",
    replaces: "Replaces paying a dev agency to build and maintain your own client-facing portal.",
    timeframe: "Rebrand in minutes from Settings, not a multi-week dev project.",
    cta: "See how it works",
    ctaHref: "/how-it-works/whitelabel",
    visual: (
      <div className="grid gap-3 h-full" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
        {tenantBrands.map((t) => (
          <div key={t.name} className="border border-[var(--color-divider)] rounded-xl p-4 flex flex-col gap-2 bg-[var(--color-surface)]">
            <span
              className="w-6 h-6 rounded-[7px] grid place-items-center text-xs font-medium"
              style={
                t.color
                  ? { background: `color-mix(in srgb, ${t.color} 18%, transparent)`, color: t.color }
                  : { background: "var(--color-neutral-800)", color: "var(--color-neutral-300)" }
              }
            >
              {t.initial}
            </span>
            <div className="text-[13.5px] font-medium">{t.name}</div>
            <div className="text-[10.5px] font-mono text-[var(--color-neutral-500)]">{t.domain}</div>
          </div>
        ))}
      </div>
    ),
  },
];

export default function ProductStory() {
  const [active, setActive] = useState(0);
  const current = modules[active];

  return (
    <section className="max-w-[1160px] mx-auto px-6 pt-[64px] flex flex-col gap-[48px]">
      <ScrollReveal className="text-center max-w-[600px] mx-auto">
        <span className="card-kicker">Every module, one platform</span>
        <h2 className="text-[34px] mt-2.5 tracking-[-0.02em]">Everything Primue actually replaces.</h2>
        <p className="text-sm text-[var(--color-neutral-400)] leading-[1.65] mt-2.5">
          Not a slide deck. The real modules, the real interface, running under one brand — click through what each one does.
        </p>
      </ScrollReveal>

      <ScrollReveal>
        <div className="flex gap-2 flex-wrap justify-center" role="tablist">
          {modules.map((m, i) => (
            <button
              key={m.id}
              role="tab"
              aria-selected={i === active}
              onClick={() => setActive(i)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[13px] cursor-pointer transition-colors"
              style={
                i === active
                  ? { background: "var(--color-accent)", color: "var(--color-bg)", fontWeight: 600 }
                  : { background: "var(--color-surface)", color: "var(--color-neutral-400)", border: "1px solid var(--color-divider)" }
              }
            >
              <m.icon size={13} />
              {m.kicker}
            </button>
          ))}
        </div>
      </ScrollReveal>

      <div
        id={current.id}
        className="grid gap-12 items-center"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))" }}
      >
        <TiltCard maxTilt={6} scale={1.015} className="order-2">
          {current.visual}
        </TiltCard>
        <div className="order-1">
          <div className="flex items-center gap-2 mb-1">
            <current.icon size={14} className="text-[var(--color-accent)]" />
            <span className="card-kicker">{current.kicker}</span>
          </div>
          <h3 className="text-[27px] mt-1 tracking-[-0.015em]">{current.title}</h3>
          <p className="text-sm text-[var(--color-neutral-400)] leading-[1.65] mt-2.5 max-w-[460px]">{current.copy}</p>
          <div
            className="flex flex-col gap-1.5 mt-4 pl-3.5 max-w-[460px]"
            style={{ borderLeft: "2px solid var(--color-accent)" }}
          >
            <span className="text-[13px] text-[var(--color-text)] font-medium">{current.replaces}</span>
            <span className="text-[12.5px] text-[var(--color-neutral-500)]">{current.timeframe}</span>
          </div>
          <a href={current.ctaHref} className="btn btn-ghost text-[14px] mt-3.5">{current.cta} →</a>
        </div>
      </div>

      {/* One CTA covering the whole section, not one per module — the pitch
          is the consolidation itself, so the ask belongs at the level of
          "replace everything," not repeated eight times over. */}
      <ScrollReveal>
        <div className="relative rounded-2xl overflow-hidden" style={{ border: "1px solid var(--color-divider)" }}>
          <img
            src="/hero/team-banner.webp"
            alt=""
            aria-hidden
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: "center 30%" }}
          />
          {/* Dark gradient over the photo, not a flat scrim — keeps the
              text readable without hiding the photo entirely, same
              technique as the success banner above it. */}
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(0deg, var(--color-bg) 12%, color-mix(in srgb, var(--color-bg) 55%, transparent) 55%, color-mix(in srgb, var(--color-bg) 25%, transparent) 100%)" }}
          />
          <div className="relative p-10 md:p-14 flex flex-col items-center text-center gap-3">
            <h3 className="text-[26px] tracking-[-0.015em] m-0" style={{ color: "#fff" }}>Replace all of it. Keep just one login.</h3>
            <p className="text-sm max-w-[480px]" style={{ color: "rgba(255,255,255,0.75)" }}>
              Everything above, under your own brand, for less than most of these cost separately.
            </p>
            <a href="/signup" className="btn btn-primary text-sm px-[22px] py-[11px] mt-1">Start free →</a>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
