"use client";

import { use, useEffect, useState } from "react";
import { IconArrowRight, IconCheckCircle, IconShieldCheck, IconSparkle, IconDocuments } from "@/components/icons";

type SiteDoc = { id: string; title: string; text: string; status: string };
type Site = {
  name: string;
  brandColor: string;
  logoUrl: string | null;
  headerImageUrl: string | null;
  template: "clarity" | "ledger" | "atrium";
  poweredByBadge: boolean;
  documents: SiteDoc[];
  paymentLink: { title: string; amountCents: number; currency: string; url: string } | null;
};

const features = [
  { icon: IconShieldCheck, title: "Bank-grade security", copy: "Every account, card, and document is protected end-to-end." },
  { icon: IconSparkle, title: "AI-assisted workflows", copy: "Draft, review, and send documents in minutes, not days." },
  { icon: IconCheckCircle, title: "Built for your brand", copy: "Your clients only ever see your name, your colors, your domain." },
];

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
            <span className="text-[10.5px] uppercase tracking-[.06em]" style={{ color: "#6b6b76" }}>{d.status}</span>
          </button>
          {openId === d.id && (
            <p className="px-4 sm:px-5 pb-5 text-[13.5px] leading-[1.75] whitespace-pre-wrap m-0" style={{ color: "#c4c4cc" }}>
              {d.text}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

function ClaritySite({ site }: { site: Site }) {
  const initial = site.name.trim().charAt(0).toUpperCase() || "A";
  return (
    <div className="min-h-screen" style={{ background: "#0c0c10", color: "#f4f4f7" }}>
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ background: `radial-gradient(760px 460px at 50% -8%, color-mix(in srgb, ${site.brandColor} 14%, transparent), transparent)` }}
      />
      <header className="relative flex items-center gap-2.5 px-6 py-5 max-w-[1080px] mx-auto">
        {site.logoUrl ? (
          <img src={site.logoUrl} alt={site.name} className="w-8 h-8 rounded-[9px] object-cover" />
        ) : (
          <span className="w-8 h-8 rounded-[9px] grid place-items-center font-medium text-[15px]" style={{ background: `color-mix(in srgb, ${site.brandColor} 22%, transparent)`, color: site.brandColor }}>
            {initial}
          </span>
        )}
        <span className="text-[15px] font-medium">{site.name}</span>
        <div className="flex-1" />
        {site.paymentLink && (
          <a href={site.paymentLink.url} target="_blank" rel="noreferrer" className="text-[13px] px-4 py-2 rounded-lg no-underline font-medium" style={{ background: site.brandColor, color: "#0c0c10" }}>
            Pay now
          </a>
        )}
      </header>

      {site.headerImageUrl && (
        <div className="relative max-w-[1080px] mx-auto px-6">
          <img src={site.headerImageUrl} alt="" className="w-full h-[180px] sm:h-[240px] object-cover rounded-2xl" />
        </div>
      )}

      <section className="relative max-w-[760px] mx-auto text-center px-6 pt-14 pb-16 flex flex-col items-center gap-5">
        <span className="text-[11px] tracking-[.08em] uppercase px-3 py-1 rounded-full" style={{ background: `color-mix(in srgb, ${site.brandColor} 16%, transparent)`, color: site.brandColor }}>
          {site.name} client portal
        </span>
        <h1 className="text-[40px] sm:text-[52px] leading-[1.05] font-medium m-0 tracking-[-0.02em]">
          Everything {site.name} clients need, in one place.
        </h1>
        <p className="text-[16px] leading-[1.6] max-w-[520px]" style={{ color: "#a3a3ad" }}>
          Documents, payments, and support, all in a single branded portal built and hosted for you.
        </p>
      </section>

      <section className="relative max-w-[720px] mx-auto px-6 pb-10 flex flex-col gap-5">
        <DocumentsList site={site} />
        {site.paymentLink && <CheckoutCard site={site} />}
      </section>

      <section className="relative max-w-[1080px] mx-auto px-6 pb-20 grid gap-4 grid-cols-1 sm:grid-cols-3">
        {features.map((f) => (
          <div key={f.title} className="nx-stat-tile rounded-xl p-5 flex flex-col gap-2.5">
            <span className="w-8 h-8 rounded-[9px] grid place-items-center" style={{ background: `color-mix(in srgb, ${site.brandColor} 18%, transparent)`, color: site.brandColor }}>
              <f.icon size={16} />
            </span>
            <div className="text-[14px] font-medium">{f.title}</div>
            <div className="text-[13px] leading-[1.55]" style={{ color: "#9a9aa4" }}>{f.copy}</div>
          </div>
        ))}
      </section>

      <footer className="relative max-w-[1080px] mx-auto px-6 py-8 flex flex-wrap items-center gap-3 border-t" style={{ borderColor: "#1c1c22" }}>
        <span className="text-[12px]" style={{ color: "#6b6b76" }}>© {new Date().getFullYear()} {site.name}. All rights reserved.</span>
        <div className="flex-1" />
        {site.poweredByBadge && <span className="text-[11px]" style={{ color: "#6b6b76" }}>Powered by <span style={{ color: "#a3a3ad" }}>Origin</span></span>}
      </footer>
    </div>
  );
}

function LedgerSite({ site }: { site: Site }) {
  const initial = site.name.trim().charAt(0).toUpperCase() || "A";
  return (
    <div className="min-h-screen flex" style={{ background: "#0c0c10", color: "#f4f4f7" }}>
      <aside className="w-[220px] flex-none hidden md:flex flex-col gap-1 p-5 border-r" style={{ borderColor: "#1c1c22" }}>
        <div className="flex items-center gap-2.5 pb-6">
          {site.logoUrl ? (
            <img src={site.logoUrl} alt={site.name} className="w-7 h-7 rounded-[8px] object-cover" />
          ) : (
            <span className="w-7 h-7 rounded-[8px] grid place-items-center font-medium text-[13px]" style={{ background: `color-mix(in srgb, ${site.brandColor} 22%, transparent)`, color: site.brandColor }}>
              {initial}
            </span>
          )}
          <span className="text-[14px] font-medium">{site.name}</span>
        </div>
        <span className="px-2.5 py-[7px] rounded-lg text-[12.5px]" style={{ color: site.brandColor, background: `color-mix(in srgb, ${site.brandColor} 14%, transparent)` }}>Overview</span>
        <span className="px-2.5 py-[7px] rounded-lg text-[12.5px]" style={{ color: "#9a9aa4" }}>Documents</span>
        <span className="px-2.5 py-[7px] rounded-lg text-[12.5px]" style={{ color: "#9a9aa4" }}>Billing</span>
      </aside>
      <div className="flex-1 min-w-0">
        {site.headerImageUrl && <img src={site.headerImageUrl} alt="" className="w-full h-[160px] object-cover" />}
        <div className="max-w-[820px] mx-auto px-6 py-10 flex flex-col gap-6">
          <div>
            <div className="md:hidden flex items-center gap-2 mb-4">
              {site.logoUrl ? <img src={site.logoUrl} alt="" className="w-6 h-6 rounded-md object-cover" /> : <span className="w-6 h-6 rounded-md grid place-items-center text-[11px]" style={{ background: site.brandColor, color: "#0c0c10" }}>{initial}</span>}
              <span className="text-[13.5px] font-medium">{site.name}</span>
            </div>
            <h1 className="text-[30px] font-medium m-0 tracking-[-0.02em]">Welcome back.</h1>
            <p className="text-[14px] mt-1.5" style={{ color: "#9a9aa4" }}>Your documents and billing, all in one place.</p>
          </div>
          <DocumentsList site={site} />
          {site.paymentLink && <CheckoutCard site={site} />}
        </div>
      </div>
    </div>
  );
}

function AtriumSite({ site }: { site: Site }) {
  const initial = site.name.trim().charAt(0).toUpperCase() || "A";
  return (
    <div className="min-h-screen" style={{ background: "#0c0c10", color: "#f4f4f7" }}>
      <div className="relative">
        {site.headerImageUrl ? (
          <img src={site.headerImageUrl} alt="" className="w-full h-[320px] sm:h-[420px] object-cover" />
        ) : (
          <div className="w-full h-[280px] sm:h-[360px]" style={{ background: `linear-gradient(160deg, color-mix(in srgb, ${site.brandColor} 30%, transparent), transparent)` }} />
        )}
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 30%, #0c0c10 100%)" }} />
        <div className="absolute inset-0 flex flex-col justify-end px-6 pb-10 max-w-[1080px] mx-auto">
          <div className="flex items-center gap-2.5 mb-3">
            {site.logoUrl ? <img src={site.logoUrl} alt="" className="w-8 h-8 rounded-[9px] object-cover" /> : <span className="w-8 h-8 rounded-[9px] grid place-items-center text-[15px] font-medium" style={{ background: site.brandColor, color: "#0c0c10" }}>{initial}</span>}
            <span className="text-[15px] font-medium">{site.name}</span>
          </div>
          <h1 className="text-[36px] sm:text-[48px] leading-[1.05] font-medium m-0 tracking-[-0.02em] max-w-[640px]">
            {site.name}, all in one branded portal.
          </h1>
        </div>
      </div>
      <div className="max-w-[820px] mx-auto px-6 py-12 flex flex-col gap-6">
        <DocumentsList site={site} />
        {site.paymentLink && <CheckoutCard site={site} />}
      </div>
      <footer className="max-w-[1080px] mx-auto px-6 py-8 border-t flex items-center gap-3" style={{ borderColor: "#1c1c22" }}>
        <span className="text-[12px]" style={{ color: "#6b6b76" }}>© {new Date().getFullYear()} {site.name}</span>
        <div className="flex-1" />
        {site.poweredByBadge && <span className="text-[11px]" style={{ color: "#6b6b76" }}>Powered by <span style={{ color: "#a3a3ad" }}>Origin</span></span>}
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
  return <ClaritySite site={site} />;
}
