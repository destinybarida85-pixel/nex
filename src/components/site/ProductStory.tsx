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
} from "@/components/icons";

function Row({
  id,
  kicker,
  icon: Icon,
  title,
  copy,
  cta,
  ctaHref,
  reverse,
  tilt = 5,
  visual,
}: {
  id?: string;
  kicker: string;
  icon: typeof IconWallet;
  title: string;
  copy: string;
  cta: string;
  ctaHref: string;
  reverse?: boolean;
  tilt?: number;
  visual: React.ReactNode;
}) {
  return (
    <div
      id={id}
      className="grid gap-12 items-center"
      style={{ gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))" }}
    >
      <ScrollReveal className={reverse ? "order-2 md:order-1" : "order-2"} delay={0.08}>
        <TiltCard maxTilt={tilt} scale={1.015}>
          {visual}
        </TiltCard>
      </ScrollReveal>
      <ScrollReveal className={reverse ? "order-1 md:order-2" : "order-1"}>
        <div className="flex items-center gap-2 mb-1">
          <Icon size={14} className="text-[var(--color-accent)]" />
          <span className="card-kicker">{kicker}</span>
        </div>
        <h3 className="text-[27px] mt-1 tracking-[-0.015em]">{title}</h3>
        <p className="text-sm text-[var(--color-neutral-400)] leading-[1.65] mt-2.5 max-w-[460px]">{copy}</p>
        <a href={ctaHref} className="btn btn-ghost text-[13px] mt-2.5">{cta} →</a>
      </ScrollReveal>
    </div>
  );
}

function VisualFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="border border-[var(--color-divider)] rounded-xl p-5 bg-[var(--color-surface)] flex flex-col gap-2.5">
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

export default function ProductStory() {
  return (
    <section className="max-w-[1160px] mx-auto px-6 pt-[64px] flex flex-col gap-[104px]">
      <ScrollReveal className="text-center max-w-[600px] mx-auto">
        <span className="card-kicker">Every module, one platform</span>
        <h2 className="text-[34px] mt-2.5 tracking-[-0.02em]">Scroll through what Origin actually does.</h2>
        <p className="text-sm text-[var(--color-neutral-400)] leading-[1.65] mt-2.5">
          Not a slide deck. The real modules, the real interface, running under one brand.
        </p>
      </ScrollReveal>

      <Row
        id="wallet"
        kicker="Business Wallet"
        icon={IconWallet}
        title="A real business balance, inside your OS."
        copy="Track your balance and transactions in one place, and get paid through real, live Stripe payment links, not a fake account number. Receive, transfer, run payroll and pay vendors, all from one dashboard."
        cta="See how it works"
        ctaHref="/how-it-works/wallet"
        visual={
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
        }
      />

      <Row
        reverse
        kicker="AI Assistant"
        icon={IconSparkle}
        title="From prompt to finished document."
        copy="Draft contracts, invoices, HR letters and reports in seconds. Origin AI understands your business context (clients, terms, prior documents), so drafts arrive nearly done."
        cta="See how it works"
        ctaHref="/how-it-works/ai-assistant"
        visual={
          <div
            className="rounded-xl p-5 flex flex-col gap-2.5 border"
            style={{ borderColor: "color-mix(in srgb, var(--color-accent) 30%, transparent)", background: "var(--color-surface)" }}
          >
            <div className="flex items-center gap-2">
              <IconSparkle size={15} className="text-[var(--color-accent)]" />
              <span className="text-[13px] font-medium">Origin AI</span>
            </div>
            <div
              className="text-[13px] leading-[1.55] text-[var(--color-neutral-300)] px-3.5 py-3 rounded-lg"
              style={{ background: "color-mix(in srgb, var(--color-accent-900) 45%, transparent)" }}
            >
              &ldquo;Draft an NDA for Northbeam Co., standard mutual terms, 2-year survival.&rdquo;
            </div>
            <div className="text-xs text-[var(--color-neutral-500)]">
              Drafted in 8 seconds → sent for signature → sealed with a tamper-evident certificate.
            </div>
          </div>
        }
      />

      <Row
        kicker="E-Signature"
        icon={IconESign}
        title="Legally binding, sealed in seconds."
        copy="Route any document for signature with OTP identity checks, a full audit trail, and a tamper-evident certificate. No separate e-sign subscription required."
        cta="See how it works"
        ctaHref="/how-it-works/signing"
        visual={
          <VisualFrame>
            <div className="text-[9.5px] tracking-[.08em] uppercase text-[var(--color-neutral-500)]">MSA · Halcyon Ventures</div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#63c3b2" }} />
              <span className="text-[13px] font-medium" style={{ color: "#63c3b2" }}>Signed &amp; sealed</span>
            </div>
            <div className="text-[10.5px] font-mono text-[var(--color-neutral-500)]">Certificate OG-CERT-8F21</div>
            <div className="flex gap-1 mt-1">
              {[0, 1, 2].map((i) => (
                <span key={i} className="flex-1 h-1 rounded-full" style={{ background: "#63c3b2", opacity: 0.35 + i * 0.25 }} />
              ))}
            </div>
          </VisualFrame>
        }
      />

      <Row
        reverse
        kicker="Payments &amp; Invoices"
        icon={IconPayments}
        title="Get paid without the follow-up."
        copy="Branded invoices, recurring billing, and shareable payment links, with automatic reminders so you're not the one chasing overdue clients."
        cta="See how it works"
        ctaHref="/how-it-works/payments"
        visual={
          <VisualFrame>
            <div className="flex items-center">
              <span className="text-[10.5px] tracking-[.08em] uppercase text-[var(--color-neutral-500)]">Invoice #INV-2038</span>
              <span className="tag tag-neutral ml-auto text-[9.5px]">Overdue</span>
            </div>
            <div className="flex flex-col gap-1.5 mt-1 text-[12px] text-[var(--color-neutral-400)]">
              <div className="flex justify-between"><span>Design retainer · July</span><span>$6,200.00</span></div>
              <div className="flex justify-between"><span>Hosting &amp; infra</span><span>$550.00</span></div>
            </div>
            <div className="flex justify-between text-[13px] font-medium pt-2 border-t border-[var(--color-divider)]">
              <span>Total due</span><span>$6,750.00</span>
            </div>
            <button className="btn btn-primary text-xs self-start mt-1">Send reminder</button>
          </VisualFrame>
        }
      />

      <Row
        kicker="CRM &amp; Projects"
        icon={IconClients}
        title="Every client, every deal, in view."
        copy="A pipeline built for services businesses (leads, proposals, signed deals), plus the project and task tracking to deliver on them."
        cta="See how it works"
        ctaHref="/how-it-works/crm"
        visual={
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
        }
      />

      <Row
        reverse
        kicker="HR &amp; Payroll"
        icon={IconEmployees}
        title="Run payroll like it's nothing."
        copy="Directory, attendance, leave, and salary runs, paid directly from the business wallet, with payslips generated automatically."
        cta="See how it works"
        ctaHref="/how-it-works/payroll"
        visual={
          <VisualFrame>
            <div className="flex items-center">
              <span className="text-[10.5px] tracking-[.08em] uppercase text-[var(--color-neutral-500)]">Payroll · July run</span>
              <span className="tag tag-accent ml-auto text-[9.5px]">Complete</span>
            </div>
            <div className="text-[19px] font-medium">$41,200.00</div>
            <div className="text-[11.5px] text-[var(--color-neutral-500)]">14 employees · paid from Business Wallet</div>
          </VisualFrame>
        }
      />

      <Row
        kicker="Analytics"
        icon={IconAnalytics}
        title="Know where the business stands."
        copy="Cash flow, growth trends, and a business health score, with AI-written summaries so a five-minute check tells you everything you need."
        cta="See how it works"
        ctaHref="/how-it-works/analytics"
        visual={
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
        }
      />

      <Row
        id="whitelabel"
        reverse
        kicker="True white-label"
        icon={IconGlobe}
        title="Your clients see your brand. Only yours."
        copy="Logo, colors, domain, emails, PDFs, portal: every client-facing surface carries your identity. Origin runs invisibly behind the scenes, with a Super Admin console for the platform owner."
        cta="See how it works"
        ctaHref="/how-it-works/whitelabel"
        tilt={7}
        visual={
          <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
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
                <div className="text-[12.5px] font-medium">{t.name}</div>
                <div className="text-[10.5px] font-mono text-[var(--color-neutral-500)]">{t.domain}</div>
              </div>
            ))}
          </div>
        }
      />
    </section>
  );
}
