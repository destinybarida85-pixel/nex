"use client";

import { use, useEffect, useState } from "react";
import { IconArrowRight, IconCheckCircle, IconShieldCheck, IconSparkle, IconDocuments } from "@/components/icons";

export type SiteDoc = {
  id: string;
  title: string;
  text: string;
  status: string;
  paymentLink: { title: string; amountCents: number; currency: string; url: string } | null;
};
export type Site = {
  name: string;
  brandColor: string;
  logoUrl: string | null;
  headerImageUrl: string | null;
  template: "clarity" | "ledger" | "atrium" | "portfolio" | "landing";
  poweredByBadge: boolean;
  documents: SiteDoc[];
  paymentLink: { title: string; amountCents: number; currency: string; url: string } | null;
};

const features = [
  { icon: IconShieldCheck, title: "Bank-grade security", copy: "Every account, card, and document is protected end-to-end." },
  { icon: IconSparkle, title: "AI-assisted workflows", copy: "Draft, review, and send documents in minutes, not days." },
  { icon: IconCheckCircle, title: "Built for your brand", copy: "Your clients only ever see your name, your colors, your domain." },
];

// A simple, original one-stroke illustration (no stock photography or real
// likeness involved) — a figure reviewing and signing a document, echoing the
// hand-drawn line-art hero style requested, in the tenant's own brand color.
function HeroIllustration({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 260 260" fill="none" className="w-full h-auto">
      <circle cx="130" cy="130" r="128" fill={color} opacity="0.12" />
      <g stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="130" cy="76" r="26" />
        <path d="M78 210c4-38 26-60 52-60s48 22 52 60" />
        <rect x="150" y="140" width="60" height="76" rx="6" />
        <path d="M164 158h32M164 174h32M164 190h20" />
        <path d="M212 150l14-10M226 140l-6 14 14-2z" />
      </g>
    </svg>
  );
}

// Original one-stroke marks for the other templates, each a distinct
// composition (not a Portfolio reskin) in the tenant's brand color.
function ClarityMark({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" className="w-full h-auto">
      <circle cx="100" cy="100" r="96" fill={color} opacity="0.1" />
      <g stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <rect x="58" y="38" width="84" height="112" rx="8" />
        <path d="M76 64h48M76 82h48M76 100h30" />
        <circle cx="128" cy="140" r="26" fill="#0c0c10" />
        <path d="M116 140l9 9 17-19" />
      </g>
    </svg>
  );
}

function LedgerMark({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 200 140" fill="none" className="w-full h-auto">
      <g stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 108V32" opacity="0.3" />
        <path d="M20 108h160" opacity="0.3" />
        <path d="M20 96l40-32 30 20 50-44 38 22" />
      </g>
      <circle cx="178" cy="62" r="6" fill={color} />
    </svg>
  );
}

function AtriumMark({ color }: { color: string }) {
  const lines = [0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
    const rad = (deg * Math.PI) / 180;
    return {
      deg,
      x1: 100 + 44 * Math.cos(rad),
      y1: 100 + 44 * Math.sin(rad),
      x2: 100 + 90 * Math.cos(rad),
      y2: 100 + 90 * Math.sin(rad),
    };
  });
  return (
    <svg viewBox="0 0 200 200" fill="none" className="w-full h-auto">
      <circle cx="100" cy="100" r="34" stroke={color} strokeWidth="3" />
      {lines.map((l) => (
        <line key={l.deg} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke={color} strokeWidth="3" strokeLinecap="round" />
      ))}
    </svg>
  );
}

function LandingMark({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" className="w-full h-auto">
      <circle cx="100" cy="100" r="70" stroke={color} strokeWidth="3" opacity="0.25" />
      <circle cx="100" cy="100" r="46" stroke={color} strokeWidth="3" opacity="0.55" />
      <circle cx="100" cy="100" r="18" fill={color} />
    </svg>
  );
}

function CheckoutCard({ site }: { site: Site }) {
  const { paymentLink: link, brandColor: color } = site;
  const priceLabel = link ? (link.amountCents / 100).toLocaleString(undefined, { style: "currency", currency: link.currency.toUpperCase() }) : "";
  return (
    <div
      className="rounded-xl p-6 sm:p-8 flex flex-col items-center text-center gap-3"
      style={{ background: "#141418", border: "1px solid #232329", boxShadow: `0 30px 60px -30px color-mix(in srgb, ${color} 30%, transparent)` }}
    >
      {link ? (
        <>
          <div className="text-[11px] tracking-[.08em] uppercase" style={{ color: "#9a9aa4" }}>{link.title}</div>
          <div className="text-[34px] font-medium" style={{ color }}>{priceLabel}</div>
          <a
            href={link.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-[14px] font-medium px-5 py-3 rounded-lg no-underline mt-1"
            style={{ background: color, color: "#0c0c10" }}
          >
            Pay {priceLabel} now
            <IconArrowRight size={15} />
          </a>
          <div className="text-[11px]" style={{ color: "#6b6b76" }}>Secured by Stripe</div>
        </>
      ) : (
        <div className="text-[13px]" style={{ color: "#9a9aa4" }}>No payment set up yet.</div>
      )}
    </div>
  );
}

function DocumentsList({ site }: { site: Site }) {
  const [openId, setOpenId] = useState<string | null>(null);
  if (site.documents.length === 0) return null;
  return (
    <div className="flex flex-col gap-3">
      {site.documents.map((d) => (
        <div key={d.id} className="rounded-xl overflow-hidden" style={{ background: "#141418", border: "1px solid #232329" }}>
          <button
            className="w-full flex items-center gap-2.5 p-4 sm:p-5 text-left cursor-pointer"
            style={{ background: "transparent", border: "none", color: "inherit" }}
            onClick={() => setOpenId(openId === d.id ? null : d.id)}
          >
            <span style={{ color: site.brandColor }} className="flex-none"><IconDocuments size={15} /></span>
            <span className="text-[14px] font-medium flex-1">{d.title}</span>
            {d.paymentLink && (
              <span className="text-[11.5px] font-medium" style={{ color: site.brandColor }}>
                {(d.paymentLink.amountCents / 100).toLocaleString(undefined, { style: "currency", currency: d.paymentLink.currency.toUpperCase() })}
              </span>
            )}
            <span className="text-[10.5px] uppercase tracking-[.06em]" style={{ color: "#6b6b76" }}>{d.status}</span>
          </button>
          {openId === d.id && (
            <div className="px-4 sm:px-5 pb-5 flex flex-col gap-4">
              <p className="text-[13.5px] leading-[1.75] whitespace-pre-wrap m-0" style={{ color: "#c4c4cc" }}>
                {d.text}
              </p>
              {d.paymentLink && (
                <a
                  href={d.paymentLink.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 self-start text-[13px] font-medium px-4 py-2.5 rounded-lg no-underline"
                  style={{ background: site.brandColor, color: "#0c0c10" }}
                >
                  Pay {(d.paymentLink.amountCents / 100).toLocaleString(undefined, { style: "currency", currency: d.paymentLink.currency.toUpperCase() })} for {d.paymentLink.title}
                  <IconArrowRight size={14} />
                </a>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export function ClaritySite({ site }: { site: Site }) {
  const initial = site.name.trim().charAt(0).toUpperCase() || "A";
  return (
    <div className="min-h-screen" style={{ background: "#0c0c10", color: "#f4f4f7" }}>
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ background: `radial-gradient(760px 460px at 50% -8%, color-mix(in srgb, ${site.brandColor} 14%, transparent), transparent)` }}
      />
      <header className="relative flex items-center gap-8 px-6 sm:px-10 py-7 max-w-[1080px] mx-auto">
        <div className="flex items-center gap-2.5">
          {site.logoUrl ? (
            <img src={site.logoUrl} alt={site.name} className="w-8 h-8 rounded-[9px] object-cover" />
          ) : (
            <span className="w-8 h-8 rounded-[9px] grid place-items-center font-medium text-[15px]" style={{ background: `color-mix(in srgb, ${site.brandColor} 22%, transparent)`, color: site.brandColor }}>
              {initial}
            </span>
          )}
          <span className="text-[15px] font-medium">{site.name}</span>
        </div>
        <nav className="hidden sm:flex items-center gap-6 text-[13px]" style={{ color: "#9a9aa4" }}>
          <span>Documents</span>
          <span>Payments</span>
          <span>Contact</span>
        </nav>
        <div className="flex-1" />
        {site.paymentLink && (
          <a href={site.paymentLink.url} target="_blank" rel="noreferrer" className="text-[13px] px-5 py-2.5 rounded-full no-underline font-medium" style={{ background: site.brandColor, color: "#0c0c10" }}>
            Pay now
          </a>
        )}
      </header>

      {site.headerImageUrl && (
        <div className="relative max-w-[1080px] mx-auto px-6 sm:px-10">
          <img src={site.headerImageUrl} alt="" className="w-full h-[180px] sm:h-[240px] object-cover rounded-2xl" />
        </div>
      )}

      <section className="relative max-w-[720px] mx-auto text-center px-6 pt-16 sm:pt-20 pb-20 flex flex-col items-center gap-6">
        <div className="w-16 h-16 rounded-full grid place-items-center p-3.5" style={{ background: `color-mix(in srgb, ${site.brandColor} 14%, transparent)` }}>
          <ClarityMark color={site.brandColor} />
        </div>
        <span className="text-[11px] tracking-[.1em] uppercase font-medium" style={{ color: site.brandColor }}>
          {site.name} client portal
        </span>
        <h1 className="text-[44px] sm:text-[64px] leading-[1.02] font-semibold m-0 tracking-[-0.03em]">
          Everything, in one calm place.
        </h1>
        <p className="text-[16px] leading-[1.7] max-w-[480px]" style={{ color: "#a3a3ad" }}>
          Documents, payments, and support from {site.name} — a single branded portal, built and hosted for you.
        </p>
      </section>

      <section className="relative max-w-[720px] mx-auto px-6 pb-14 flex flex-col gap-5">
        {site.documents.length > 0 && (
          <div className="text-[11px] tracking-[.1em] uppercase font-medium text-center mb-1" style={{ color: "#6b6b76" }}>Documents</div>
        )}
        <DocumentsList site={site} />
        {site.paymentLink && <CheckoutCard site={site} />}
      </section>

      <section className="relative max-w-[1080px] mx-auto px-6 sm:px-10 pb-24 grid gap-5 grid-cols-1 sm:grid-cols-3">
        {features.map((f) => (
          <div key={f.title} className="nx-stat-tile rounded-2xl p-6 flex flex-col gap-3">
            <span className="w-10 h-10 rounded-[10px] grid place-items-center" style={{ background: `color-mix(in srgb, ${site.brandColor} 18%, transparent)`, color: site.brandColor }}>
              <f.icon size={17} />
            </span>
            <div className="text-[14.5px] font-medium">{f.title}</div>
            <div className="text-[13px] leading-[1.6]" style={{ color: "#9a9aa4" }}>{f.copy}</div>
          </div>
        ))}
      </section>

      <footer className="relative max-w-[1080px] mx-auto px-6 sm:px-10 py-8 flex flex-wrap items-center gap-3 border-t" style={{ borderColor: "#1c1c22" }}>
        <span className="text-[12px]" style={{ color: "#6b6b76" }}>© {new Date().getFullYear()} {site.name}. All rights reserved.</span>
        <div className="flex-1" />
        {site.poweredByBadge && <span className="text-[11px]" style={{ color: "#6b6b76" }}>Powered by <span style={{ color: "#a3a3ad" }}>Primue</span></span>}
      </footer>
    </div>
  );
}

export function LedgerSite({ site }: { site: Site }) {
  const initial = site.name.trim().charAt(0).toUpperCase() || "A";
  return (
    <div className="min-h-screen flex" style={{ background: "#0c0c10", color: "#f4f4f7" }}>
      <aside className="w-[240px] flex-none hidden md:flex flex-col gap-1 p-6 border-r" style={{ borderColor: "#1c1c22" }}>
        <div className="flex items-center gap-2.5 pb-7">
          {site.logoUrl ? (
            <img src={site.logoUrl} alt={site.name} className="w-7 h-7 rounded-[8px] object-cover" />
          ) : (
            <span className="w-7 h-7 rounded-[8px] grid place-items-center font-medium text-[13px]" style={{ background: `color-mix(in srgb, ${site.brandColor} 22%, transparent)`, color: site.brandColor }}>
              {initial}
            </span>
          )}
          <span className="text-[14px] font-medium">{site.name}</span>
        </div>
        <span className="px-3 py-[9px] rounded-lg text-[12.5px] font-medium" style={{ color: site.brandColor, background: `color-mix(in srgb, ${site.brandColor} 14%, transparent)` }}>Overview</span>
        <span className="px-3 py-[9px] rounded-lg text-[12.5px]" style={{ color: "#9a9aa4" }}>Documents</span>
        <span className="px-3 py-[9px] rounded-lg text-[12.5px]" style={{ color: "#9a9aa4" }}>Billing</span>
        <div className="flex-1" />
        <div className="rounded-xl p-4" style={{ background: "#141418", border: "1px solid #1c1c22" }}>
          <div className="w-full max-w-[120px] mx-auto opacity-90"><LedgerMark color={site.brandColor} /></div>
          <div className="text-[11px] text-center mt-2" style={{ color: "#6b6b76" }}>
            {site.documents.length > 0 ? `${site.documents.length} document${site.documents.length === 1 ? "" : "s"} shared` : "Nothing shared yet"}
          </div>
        </div>
      </aside>
      <div className="flex-1 min-w-0">
        {site.headerImageUrl && <img src={site.headerImageUrl} alt="" className="w-full h-[160px] object-cover" />}
        <div className="max-w-[860px] mx-auto px-6 sm:px-10 py-12 sm:py-16 flex flex-col gap-8">
          <div className="md:hidden flex items-center gap-2 mb-1">
            {site.logoUrl ? <img src={site.logoUrl} alt="" className="w-6 h-6 rounded-md object-cover" /> : <span className="w-6 h-6 rounded-md grid place-items-center text-[11px]" style={{ background: site.brandColor, color: "#0c0c10" }}>{initial}</span>}
            <span className="text-[13.5px] font-medium">{site.name}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-[1.3fr_1fr] gap-8 items-center">
            <div>
              <span className="text-[11px] tracking-[.1em] uppercase font-medium" style={{ color: site.brandColor }}>Client portal</span>
              <h1 className="text-[38px] sm:text-[50px] font-semibold m-0 mt-2 tracking-[-0.02em] leading-[1.04]">Welcome back.</h1>
              <p className="text-[14.5px] mt-3 leading-[1.6]" style={{ color: "#9a9aa4" }}>Your documents and billing with {site.name}, all in one place.</p>
            </div>
            <div className="hidden md:block max-w-[220px] justify-self-end opacity-90"><LedgerMark color={site.brandColor} /></div>
          </div>
          <DocumentsList site={site} />
          {site.paymentLink && <CheckoutCard site={site} />}
        </div>
      </div>
    </div>
  );
}

export function AtriumSite({ site }: { site: Site }) {
  const initial = site.name.trim().charAt(0).toUpperCase() || "A";
  return (
    <div className="min-h-screen" style={{ background: "#0c0c10", color: "#f4f4f7" }}>
      <div className="relative">
        {site.headerImageUrl ? (
          <img src={site.headerImageUrl} alt="" className="w-full h-[380px] sm:h-[480px] object-cover" />
        ) : (
          <div className="w-full h-[380px] sm:h-[460px] relative overflow-hidden" style={{ background: `radial-gradient(120% 100% at 82% 20%, color-mix(in srgb, ${site.brandColor} 34%, transparent), transparent), linear-gradient(160deg, color-mix(in srgb, ${site.brandColor} 16%, transparent), transparent)` }}>
            <div className="hidden sm:block absolute right-6 lg:right-16 top-1/2 -translate-y-1/2 w-[260px] opacity-[0.45]"><AtriumMark color={site.brandColor} /></div>
          </div>
        )}
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(12,12,16,.55) 0%, transparent 32%, #0c0c10 100%)" }} />
        <nav className="absolute top-0 inset-x-0 flex items-center gap-8 px-6 sm:px-10 py-7 max-w-[1080px] mx-auto">
          <div className="flex items-center gap-2.5">
            {site.logoUrl ? <img src={site.logoUrl} alt="" className="w-8 h-8 rounded-[9px] object-cover" /> : <span className="w-8 h-8 rounded-[9px] grid place-items-center text-[15px] font-medium" style={{ background: site.brandColor, color: "#0c0c10" }}>{initial}</span>}
            <span className="text-[15px] font-medium">{site.name}</span>
          </div>
          <div className="hidden sm:flex items-center gap-6 text-[13px]" style={{ color: "#e4e4e8" }}>
            <span>Work</span>
            <span>Documents</span>
          </div>
          <div className="flex-1" />
          {site.paymentLink && (
            <a href={site.paymentLink.url} target="_blank" rel="noreferrer" className="text-[13px] px-5 py-2.5 rounded-full no-underline font-medium border" style={{ borderColor: "#e4e4e8", color: "#f4f4f7" }}>
              Pay now
            </a>
          )}
        </nav>
        <div className="absolute inset-0 flex flex-col justify-end px-6 sm:px-10 pb-14 max-w-[1080px] mx-auto">
          <span className="text-[11px] tracking-[.1em] uppercase font-medium mb-3" style={{ color: site.brandColor }}>Studio portal</span>
          <h1 className="text-[42px] sm:text-[60px] leading-[1.0] font-semibold m-0 tracking-[-0.03em] max-w-[680px]">
            {site.name}, all in one branded portal.
          </h1>
          <p className="text-[15px] mt-4 max-w-[440px] leading-[1.6]" style={{ color: "#c4c4cc" }}>
            Your documents, agreements, and payments with {site.name} — all in one place, built and hosted for you.
          </p>
        </div>
      </div>
      <div className="max-w-[860px] mx-auto px-6 sm:px-10 py-16 flex flex-col gap-6">
        {site.documents.length > 0 && (
          <div className="text-[11px] tracking-[.1em] uppercase font-medium" style={{ color: "#6b6b76" }}>Documents</div>
        )}
        <DocumentsList site={site} />
        {site.paymentLink && <CheckoutCard site={site} />}
        {site.documents.length === 0 && !site.paymentLink && (
          <div className="rounded-2xl p-8 text-center" style={{ background: "#141418", border: "1px dashed #232329" }}>
            <div className="text-[13.5px]" style={{ color: "#9a9aa4" }}>
              Documents and payment links will show up here as soon as {site.name} adds them.
            </div>
          </div>
        )}
      </div>
      <footer className="max-w-[1080px] mx-auto px-6 sm:px-10 py-8 border-t flex items-center gap-3" style={{ borderColor: "#1c1c22" }}>
        <span className="text-[12px]" style={{ color: "#6b6b76" }}>© {new Date().getFullYear()} {site.name}</span>
        <div className="flex-1" />
        {site.poweredByBadge && <span className="text-[11px]" style={{ color: "#6b6b76" }}>Powered by <span style={{ color: "#a3a3ad" }}>Primue</span></span>}
      </footer>
    </div>
  );
}

export function PortfolioSite({ site }: { site: Site }) {
  const initial = site.name.trim().charAt(0).toUpperCase() || "A";
  return (
    <div className="min-h-screen" style={{ background: "#f4f4f2", color: "#141414" }}>
      <header className="flex items-center gap-8 px-6 sm:px-10 py-6 max-w-[1120px] mx-auto">
        <div className="flex items-center gap-2.5">
          {site.logoUrl ? (
            <img src={site.logoUrl} alt={site.name} className="w-8 h-8 rounded-full object-cover" />
          ) : (
            <span className="w-8 h-8 rounded-full grid place-items-center font-medium text-[14px]" style={{ background: "#141414", color: "#fff" }}>
              {initial}
            </span>
          )}
          <span className="text-[14.5px] font-semibold tracking-[-0.01em]">{site.name}</span>
        </div>
        <nav className="hidden sm:flex items-center gap-6 text-[13px]" style={{ color: "#6b6b76" }}>
          <span>Work</span>
          <span>Documents</span>
          <span>Contact</span>
        </nav>
        <div className="flex-1" />
        {site.paymentLink && (
          <a href={site.paymentLink.url} target="_blank" rel="noreferrer" className="text-[13px] px-4 py-2 rounded-full no-underline font-medium border" style={{ borderColor: "#141414", color: "#141414" }}>
            Pay now ↗
          </a>
        )}
      </header>

      <section className="max-w-[1120px] mx-auto px-6 sm:px-10 pt-8 sm:pt-16 pb-20 grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-10 items-center">
        <div className="flex flex-col gap-5">
          <span className="text-[11px] tracking-[.1em] uppercase font-medium" style={{ color: site.brandColor }}>Client portal</span>
          <h1 className="text-[52px] sm:text-[72px] leading-[0.95] font-bold m-0 tracking-[-0.03em]">
            Hello.
          </h1>
          <p className="text-[16px] leading-[1.6] max-w-[420px]" style={{ color: "#5a5a63" }}>
            It&rsquo;s {site.name} — your documents, your agreements, and your payments, all handled here in one real,
            branded place.
          </p>
          {site.paymentLink && (
            <a
              href={site.paymentLink.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 self-start text-[14px] font-medium px-6 py-3.5 rounded-full no-underline mt-2"
              style={{ background: "#141414", color: "#fff" }}
            >
              Pay {(site.paymentLink.amountCents / 100).toLocaleString(undefined, { style: "currency", currency: site.paymentLink.currency.toUpperCase() })} now
              <IconArrowRight size={15} />
            </a>
          )}
        </div>
        <div className="max-w-[300px] mx-auto md:max-w-none">
          <HeroIllustration color={site.brandColor} />
        </div>
      </section>

      <section className="max-w-[900px] mx-auto px-6 sm:px-10 pb-20 flex flex-col gap-4">
        {site.documents.length > 0 && (
          <div className="text-[11px] tracking-[.1em] uppercase font-medium mb-1" style={{ color: "#9a9aa4" }}>Documents</div>
        )}
        {site.documents.map((d) => (
          <div key={d.id} className="rounded-2xl p-7" style={{ background: "#fff", border: "1px solid #e4e4e0" }}>
            <div className="flex items-start justify-between gap-3">
              <div className="text-[10.5px] uppercase tracking-[.08em]" style={{ color: "#9a9aa4" }}>Document</div>
              {d.paymentLink && (
                <div className="text-[13px] font-semibold" style={{ color: site.brandColor }}>
                  {(d.paymentLink.amountCents / 100).toLocaleString(undefined, { style: "currency", currency: d.paymentLink.currency.toUpperCase() })}
                </div>
              )}
            </div>
            <h2 className="text-[21px] font-semibold mt-1 mb-3 tracking-[-0.01em]" style={{ color: "#141414" }}>{d.title}</h2>
            <p className="text-[13.5px] leading-[1.75] whitespace-pre-wrap m-0" style={{ color: "#45454e" }}>{d.text}</p>
            {d.paymentLink && (
              <a
                href={d.paymentLink.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 mt-4 text-[13px] font-medium px-5 py-2.5 rounded-full no-underline"
                style={{ background: "#141414", color: "#fff" }}
              >
                Pay for {d.paymentLink.title}
                <IconArrowRight size={14} />
              </a>
            )}
          </div>
        ))}
        {site.paymentLink && (
          <div className="rounded-2xl p-9 flex flex-col items-center text-center gap-3 mt-2" style={{ background: "#141414", color: "#fff" }}>
            <div className="text-[11px] uppercase tracking-[.08em]" style={{ color: "#9a9aa4" }}>{site.paymentLink.title}</div>
            <div className="text-[36px] font-bold">
              {(site.paymentLink.amountCents / 100).toLocaleString(undefined, { style: "currency", currency: site.paymentLink.currency.toUpperCase() })}
            </div>
            <a href={site.paymentLink.url} target="_blank" rel="noreferrer" className="px-6 py-3 rounded-full no-underline text-[13.5px] font-medium" style={{ background: "#fff", color: "#141414" }}>
              Pay now
            </a>
          </div>
        )}
      </section>

      <footer className="max-w-[1120px] mx-auto px-6 sm:px-10 py-8 border-t flex items-center gap-3" style={{ borderColor: "#e4e4e0" }}>
        <span className="text-[11.5px]" style={{ color: "#9a9aa4" }}>© {new Date().getFullYear()} {site.name}</span>
        <div className="flex-1" />
        {site.poweredByBadge && <span className="text-[11px]" style={{ color: "#9a9aa4" }}>Powered by Primue</span>}
      </footer>
    </div>
  );
}

export function LandingSite({ site }: { site: Site }) {
  const priceLabel = site.paymentLink
    ? (site.paymentLink.amountCents / 100).toLocaleString(undefined, { style: "currency", currency: site.paymentLink.currency.toUpperCase() })
    : "";
  const initial = site.name.trim().charAt(0).toUpperCase() || "A";
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#0c0c10", color: "#f4f4f7" }}>
      <header className="flex items-center gap-2.5 px-6 sm:px-10 py-7 max-w-[1080px] mx-auto w-full">
        {site.logoUrl ? (
          <img src={site.logoUrl} alt={site.name} className="w-8 h-8 rounded-[9px] object-cover" />
        ) : (
          <span className="w-8 h-8 rounded-[9px] grid place-items-center font-medium text-[15px]" style={{ background: `color-mix(in srgb, ${site.brandColor} 22%, transparent)`, color: site.brandColor }}>
            {initial}
          </span>
        )}
        <span className="text-[15px] font-medium">{site.name}</span>
      </header>

      <section className="flex-1 max-w-[1080px] mx-auto px-6 sm:px-10 pt-6 sm:pt-14 pb-16 w-full grid grid-cols-1 lg:grid-cols-[1.1fr_0.85fr] gap-12 items-start">
        <div className="flex flex-col gap-6">
          <span className="text-[11px] tracking-[.1em] uppercase font-medium" style={{ color: site.brandColor }}>Secure payment</span>
          <h1 className="text-[36px] sm:text-[52px] leading-[1.05] font-semibold m-0 tracking-[-0.03em]">
            {site.paymentLink ? site.paymentLink.title : `Pay ${site.name}`}
          </h1>
          <p className="text-[15px] leading-[1.7] max-w-[440px]" style={{ color: "#a3a3ad" }}>
            A one-time secure payment to {site.name}, processed by Stripe. No account or sign-up needed — just pay and you&rsquo;re done.
          </p>

          {site.documents.length > 0 && (
            <div className="flex flex-col gap-2.5 mt-2">
              <span className="text-[11px] tracking-[.1em] uppercase font-medium" style={{ color: "#6b6b76" }}>Included</span>
              {site.documents.map((d) => (
                <div key={d.id} className="flex items-center gap-2.5 text-[13.5px]" style={{ color: "#c4c4cc" }}>
                  <span className="flex-none" style={{ color: site.brandColor }}><IconCheckCircle size={15} /></span>
                  {d.title}
                </div>
              ))}
            </div>
          )}

          <div className="hidden lg:block w-[190px] mt-4 opacity-[0.28]"><LandingMark color={site.brandColor} /></div>
        </div>

        <div className="lg:sticky lg:top-14">
          {site.paymentLink ? (
            <div
              className="rounded-2xl p-7 sm:p-8 flex flex-col gap-4"
              style={{ background: "#141418", border: "1px solid #232329", boxShadow: `0 30px 60px -30px color-mix(in srgb, ${site.brandColor} 30%, transparent)` }}
            >
              <div className="text-[11px] tracking-[.08em] uppercase" style={{ color: "#9a9aa4" }}>{site.paymentLink.title}</div>
              <div className="text-[44px] sm:text-[52px] font-semibold leading-none tracking-[-0.02em]" style={{ color: site.brandColor }}>{priceLabel}</div>
              <a
                href={site.paymentLink.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full px-6 py-4 rounded-full no-underline text-[15px] font-medium mt-2"
                style={{ background: site.brandColor, color: "#0c0c10" }}
              >
                Pay {priceLabel} now
                <IconArrowRight size={16} />
              </a>
              <div className="text-[11px] text-center" style={{ color: "#6b6b76" }}>Secured by Stripe · one click, no account needed</div>
            </div>
          ) : (
            <div className="rounded-2xl p-7 sm:p-8 text-center flex flex-col gap-1.5" style={{ background: "#141418", border: "1px dashed #232329" }}>
              <div className="text-[13.5px] font-medium">No payment set up yet</div>
              <div className="text-[12.5px]" style={{ color: "#9a9aa4" }}>{site.name} hasn&rsquo;t attached a payment link to this page.</div>
            </div>
          )}
        </div>
      </section>

      <footer className="max-w-[1080px] mx-auto px-6 sm:px-10 py-8 border-t flex items-center gap-3 w-full" style={{ borderColor: "#1c1c22" }}>
        <span className="text-[12px]" style={{ color: "#6b6b76" }}>© {new Date().getFullYear()} {site.name}</span>
        <div className="flex-1" />
        {site.poweredByBadge && <span className="text-[11px]" style={{ color: "#6b6b76" }}>Powered by <span style={{ color: "#a3a3ad" }}>Primue</span></span>}
      </footer>
    </div>
  );
}

export default function PublicSitePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [site, setSite] = useState<Site | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/site/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.configured && data.site) setSite(data.site);
        else setNotFound(true);
      })
      .catch(() => setNotFound(true));
  }, [slug]);

  if (notFound) {
    return (
      <div className="min-h-screen grid place-items-center" style={{ background: "#0c0c10", color: "#f4f4f7" }}>
        <div className="text-center">
          <div className="text-[20px] font-medium">This site isn&rsquo;t available.</div>
          <div className="text-[13px] mt-1.5" style={{ color: "#9a9aa4" }}>It may not be published yet.</div>
        </div>
      </div>
    );
  }

  if (!site) return <div className="min-h-screen" style={{ background: "#0c0c10" }} />;

  if (site.template === "ledger") return <LedgerSite site={site} />;
  if (site.template === "atrium") return <AtriumSite site={site} />;
  if (site.template === "portfolio") return <PortfolioSite site={site} />;
  if (site.template === "landing") return <LandingSite site={site} />;
  return <ClaritySite site={site} />;
}
