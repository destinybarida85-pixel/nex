"use client";

import { useEffect, useRef, useState } from "react";
import DocumentPaper from "@/components/document/DocumentPaper";
import {
  IconLogoMark,
  IconDashboard,
  IconWallet,
  IconDocuments,
  IconESign,
  IconInvoices,
  IconClients,
  IconMail,
  IconCheckCircle,
} from "@/components/icons";

// A real product preview, not an illustration of one: the same icon set, the
// same card/tag classes and the same DocumentPaper component the app renders,
// composed into the three views worth showing on a homepage. Rendering it as
// live UI rather than a screenshot means it stays sharp at any size and can
// never drift out of date with the product.
//
// The stage is a fixed design size scaled to whatever width it is given, so the
// internal proportions never reflow into something that was never designed.
const DESIGN_W = 940;
const DESIGN_H = 540;
const VIEW_MS = 5000;

const NAV = [
  { icon: IconDashboard, label: "Dashboard" },
  { icon: IconWallet, label: "Wallet" },
  { icon: IconDocuments, label: "Documents" },
  { icon: IconESign, label: "E-Signatures" },
  { icon: IconInvoices, label: "Invoices" },
  { icon: IconClients, label: "Clients" },
];

const VIEWS = ["Dashboard", "Documents", "Invoices"] as const;
type View = (typeof VIEWS)[number];

const KPIS = [
  { label: "Balance", value: "$42,180.00", meta: "Across 2 accounts" },
  { label: "Received · 30d", value: "$33,590.18", meta: "▲ 9.4% vs last month" },
  { label: "Awaiting signature", value: "3", meta: "2 sent today" },
  { label: "Outstanding", value: "$14,000.00", meta: "2 invoices" },
];

const BARS = [38, 52, 44, 68, 59, 81, 74, 96];

const ACTIVITY = [
  { who: "Northbeam Co.", what: "signed Mutual NDA", when: "2m ago", tone: "#63c3b2" },
  { who: "Figment Design", what: "paid $4,200.00", when: "18m ago", tone: "#e0a35b" },
  { who: "Halcyon Ventures", what: "opened Consulting Agreement", when: "1h ago", tone: "#9184d9" },
];

const INVOICES = [
  { n: "INV-2041", who: "Halcyon Ventures", amt: "$18,500.00", status: "Paid", tag: "tag-neutral" },
  { n: "INV-2040", who: "Northbeam Co.", amt: "$6,750.00", status: "Paid", tag: "tag-neutral" },
  { n: "INV-2039", who: "Figment Design", amt: "$4,200.00", status: "Unpaid", tag: "tag-outline" },
];

const DOC_SECTIONS = [
  { heading: "1. Scope of Work", text: "The Consultant shall deliver a full brand identity system, including logotype, colour system and a written usage guide." },
  { heading: "2. Fees & Payment", text: "Total fee: $6,200.00. Fifty per cent is payable on signature, the balance on delivery." },
];

function Chrome({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="w-full h-full flex flex-col overflow-hidden"
      style={{
        background: "var(--color-bg)",
        border: "1px solid var(--color-divider)",
        borderRadius: 14,
      }}
    >
      <div
        className="flex items-center gap-2 px-3.5 flex-none"
        style={{ height: 38, borderBottom: "1px solid var(--color-divider)", background: "var(--color-surface)" }}
      >
        <span className="flex gap-1.5">
          {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
            <span key={c} style={{ width: 9, height: 9, borderRadius: 999, background: c, opacity: 0.75 }} />
          ))}
        </span>
        {/* The address bar is the white-label promise made visible: the client
            sees the tenant's own domain, not Primue's. */}
        <span
          className="mx-auto px-3 py-[3px] text-[10.5px] rounded-full"
          style={{ background: "var(--color-bg)", color: "var(--color-neutral-500)", border: "1px solid var(--color-divider)" }}
        >
          app.yourbrand.com
        </span>
      </div>
      <div className="flex-1 flex min-h-0">{children}</div>
    </div>
  );
}

function Rail({ active }: { active: View }) {
  return (
    <div
      className="flex-none flex flex-col gap-0.5 p-2.5"
      style={{ width: 158, borderRight: "1px solid var(--color-divider)" }}
    >
      <div className="flex items-center gap-2 px-1.5 pb-3">
        <IconLogoMark size={18} />
        <span className="text-[12.5px] font-medium text-[var(--color-text)]">Primue</span>
      </div>
      {NAV.map((item) => {
        const on =
          (active === "Dashboard" && item.label === "Dashboard") ||
          (active === "Documents" && item.label === "E-Signatures") ||
          (active === "Invoices" && item.label === "Invoices");
        return (
          <div
            key={item.label}
            className="flex items-center gap-2 px-2 py-[6px] rounded-md text-[11.5px] transition-colors duration-500"
            style={
              on
                ? { color: "var(--color-accent-300)", background: "color-mix(in srgb, var(--color-accent-900) 65%, transparent)" }
                : { color: "var(--color-neutral-500)" }
            }
          >
            <item.icon size={13} />
            {item.label}
          </div>
        );
      })}
    </div>
  );
}

function DashboardView() {
  return (
    <div className="flex-1 min-w-0 p-4 flex flex-col gap-3">
      <div className="grid grid-cols-4 gap-2.5">
        {KPIS.map((k) => (
          <div key={k.label} className="card elev-sm gap-0.5 p-[10px_12px]">
            <div className="text-[8.5px] tracking-[.08em] uppercase text-[var(--color-neutral-500)]">{k.label}</div>
            <div className="text-[15px] font-medium">{k.value}</div>
            <div className="text-[8.5px] text-[var(--color-neutral-600)]">{k.meta}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-2.5" style={{ gridTemplateColumns: "1.6fr 1fr" }}>
        <div className="card elev-sm p-[12px_14px] gap-2.5">
          <div className="card-title text-[11.5px]">Money in · last 8 weeks</div>
          <div className="flex items-end gap-2" style={{ height: 96 }}>
            {BARS.map((h, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: `${h}%`,
                  borderRadius: 3,
                  background:
                    i === BARS.length - 1
                      ? "var(--color-accent)"
                      : "color-mix(in srgb, var(--color-accent) 30%, transparent)",
                }}
              />
            ))}
          </div>
        </div>

        <div className="card elev-sm p-[12px_14px] gap-2">
          <div className="card-title text-[11.5px]">Activity</div>
          {ACTIVITY.map((a) => (
            <div key={a.who} className="flex items-start gap-2">
              <span style={{ width: 6, height: 6, borderRadius: 999, background: a.tone, marginTop: 5, flex: "none" }} />
              <div className="min-w-0">
                <div className="text-[10.5px] text-[var(--color-text)] truncate">{a.who}</div>
                <div className="text-[9.5px] text-[var(--color-neutral-500)] truncate">
                  {a.what} · {a.when}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DocumentsView() {
  return (
    <div className="flex-1 min-w-0 p-4 flex gap-3">
      <div className="flex-1 min-w-0" style={{ maxWidth: 400 }}>
        {/* The real component the product renders — not a mock of it. */}
        <DocumentPaper
          title="Consulting Services Agreement"
          meta="Between Atlas Chambers and Northbeam Co."
          sections={DOC_SECTIONS}
          accentColor="#2b3a55"
          layout="executive"
          organisation="Atlas Chambers · 12 Broad Street, Lagos"
          big={false}
        />
      </div>
      <div className="flex-none flex flex-col gap-2.5" style={{ width: 176 }}>
        <div className="card elev-sm p-[12px_14px] gap-2">
          <div className="card-title text-[11.5px]">Signing status</div>
          {[
            { label: "Drafted", done: true },
            { label: "Sent for signature", done: true },
            { label: "Signed & sealed", done: false },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-2 text-[10px]">
              <span
                style={{
                  width: 6, height: 6, borderRadius: 999, flex: "none",
                  background: s.done ? "var(--color-accent)" : "var(--color-neutral-700)",
                }}
              />
              <span style={{ color: s.done ? "var(--color-text)" : "var(--color-neutral-500)" }}>{s.label}</span>
            </div>
          ))}
        </div>
        <div className="card elev-sm p-[12px_14px] gap-1.5">
          <div className="card-title text-[11.5px]">Before you send</div>
          <div className="text-[9.5px] text-[var(--color-neutral-500)]">Who signs?</div>
          <div
            className="text-[10px] px-2 py-1.5 rounded-md"
            style={{ background: "var(--color-surface)", border: "1px solid var(--color-divider)" }}
          >
            Two people sign
          </div>
          <div className="text-[9.5px] text-[var(--color-neutral-500)] mt-0.5">Ask for payment?</div>
          <div
            className="text-[10px] px-2 py-1.5 rounded-md"
            style={{ background: "var(--color-surface)", border: "1px solid var(--color-divider)" }}
          >
            Deposit · $3,100.00
          </div>
        </div>
      </div>
    </div>
  );
}

function InvoicesView() {
  return (
    <div className="flex-1 min-w-0 p-4 flex flex-col gap-3">
      <div className="card elev-sm p-[12px_14px] gap-2.5">
        <div className="flex items-center gap-2">
          <IconMail size={12} className="text-[var(--color-accent)]" />
          <div className="card-title text-[11.5px]">Send an invoice</div>
        </div>
        <div
          className="flex items-center gap-2.5 p-2.5 rounded-lg flex-wrap"
          style={{ background: "var(--color-surface)" }}
        >
          <div className="min-w-0">
            <div className="text-[11px] text-[var(--color-text)]">Brand identity system — phase 1</div>
            <div className="text-[9px] font-mono text-[var(--color-neutral-500)]">INV-8F3B1C22</div>
          </div>
          <div className="flex-1" />
          <div className="text-[11.5px]">$6,200.00</div>
          <span className="tag tag-outline text-[9px]">Unpaid</span>
          <span className="btn btn-primary text-[9.5px] gap-1 px-2 py-1">
            <IconMail size={10} />
            Email this invoice
          </span>
        </div>
      </div>

      <div className="card elev-sm p-[12px_14px] gap-2">
        <div className="card-title text-[11.5px]">Payments received</div>
        <table className="table text-[10.5px]">
          <thead>
            <tr>
              <th>Invoice</th>
              <th>Client</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {INVOICES.map((inv) => (
              <tr key={inv.n}>
                <td className="font-mono text-[9.5px]">{inv.n}</td>
                <td>{inv.who}</td>
                <td>{inv.amt}</td>
                <td>
                  <span className={`tag ${inv.tag} text-[9px]`}>{inv.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center gap-1.5 text-[9px] text-[var(--color-neutral-600)]">
          <IconCheckCircle size={10} />
          Real Stripe checkout links — money settles to your own account.
        </div>
      </div>
    </div>
  );
}

export default function ProductFrame() {
  const outerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [index, setIndex] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const el = outerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setScale(Math.min(1, el.clientWidth / DESIGN_W)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    // Someone who asked their system not to animate gets the first view held
    // still — not a slower carousel, no carousel.
    if (reduced) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % VIEWS.length), VIEW_MS);
    return () => clearInterval(id);
  }, [reduced]);

  const active = VIEWS[index];

  return (
    <div ref={outerRef} className="w-full" style={{ height: DESIGN_H * scale }}>
      <div
        style={{
          width: DESIGN_W,
          height: DESIGN_H,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          position: "relative",
          borderRadius: 14,
          boxShadow:
            "0 50px 100px -60px color-mix(in srgb, var(--color-accent) 60%, transparent), 0 30px 70px -40px rgba(0,0,0,.7)",
        }}
      >
        <Chrome>
          <Rail active={active} />
          {/* overflow-hidden is required, not cosmetic: the stacked views are
              absolutely positioned and the document view is taller than the
              frame, so without clipping the inactive one bleeds out below the
              window chrome and is visible on the page. */}
          <div className="flex-1 min-w-0 relative overflow-hidden">
            {VIEWS.map((v, i) => (
              <div
                key={v}
                aria-hidden={i !== index}
                className="absolute inset-0"
                style={{
                  opacity: i === index ? 1 : 0,
                  transform: i === index ? "translateY(0)" : "translateY(6px)",
                  transition: reduced ? "none" : "opacity 700ms ease, transform 700ms ease",
                  pointerEvents: "none",
                }}
              >
                {v === "Dashboard" && <DashboardView />}
                {v === "Documents" && <DocumentsView />}
                {v === "Invoices" && <InvoicesView />}
              </div>
            ))}
          </div>
        </Chrome>
      </div>
    </div>
  );
}
