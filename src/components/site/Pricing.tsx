"use client";

import { useState } from "react";
import ScrollReveal from "@/components/site/ScrollReveal";

export default function Pricing() {
  const [annual, setAnnual] = useState(false);
  const starterPrice = annual ? "$20" : "$25";
  const growthPrice = annual ? "$28" : "$35";

  return (
    <section id="pricing" className="max-w-[1160px] mx-auto px-6 pt-[80px]">
      <ScrollReveal className="flex items-end gap-4 flex-wrap">
        <div>
          <span className="card-kicker">Pricing</span>
          <h3 className="text-[27px] mt-2.5 tracking-[-0.015em]">Simple pricing. Scale when you do.</h3>
        </div>
        <div className="flex-1" />
        <div className="seg">
          <label className="seg-opt">
            <input type="radio" name="billing" checked={!annual} onChange={() => setAnnual(false)} />
            <span>Monthly</span>
          </label>
          <label className="seg-opt">
            <input type="radio" name="billing" checked={annual} onChange={() => setAnnual(true)} />
            <span>Annual · save 20%</span>
          </label>
        </div>
      </ScrollReveal>

      <div className="grid gap-3.5 mt-6 items-stretch" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
        <div className="card elev-sm p-[22px] gap-2.5 nx-price-card">
          <div className="card-title">Starter</div>
          <div className="font-medium text-[34px]">
            {starterPrice}
            <span className="text-[14px] text-[var(--color-neutral-500)]"> / user / mo</span>
          </div>
          <div className="card-body text-[14px]">For a founder getting set up.</div>
          <div className="flex flex-col gap-[7px] text-[13.5px] text-[var(--color-neutral-300)] mt-1">
            <span>· Business wallet + 3 users</span>
            <span>· Unlimited AI documents</span>
            <span>· E-signatures included</span>
            <span>· 1 premium certificate credit (one-time)</span>
            <span className="text-[var(--color-neutral-600)]">· No digital stamps</span>
            <span>· Core dashboard &amp; invoicing</span>
          </div>
          <a href="/signup" className="btn btn-secondary btn-block text-[14px] mt-auto">Start 7-day trial</a>
        </div>

        <div
          className="card elev-md p-[22px] gap-2.5 border nx-price-card nx-price-card-highlight"
          style={{ borderColor: "color-mix(in srgb, var(--color-accent) 45%, transparent)" }}
        >
          <div className="flex items-center">
            <div className="card-title">Growth</div>
            <span className="tag tag-accent ml-auto text-[9.5px]">Most popular</span>
          </div>
          <div className="font-medium text-[34px]">
            {growthPrice}
            <span className="text-[14px] text-[var(--color-neutral-500)]"> / user / mo</span>
          </div>
          <div className="card-body text-[14px]">For teams running the whole business on Primue.</div>
          <div className="flex flex-col gap-[7px] text-[13.5px] text-[var(--color-neutral-300)] mt-1">
            <span>· Unlimited AI documents &amp; e-signatures</span>
            <span>· E-signatures + official digital stamps</span>
            <span>· 10 premium certificate credits, plus buy more anytime</span>
            <span>· Payroll, CRM, projects, analytics</span>
            <span>· White-label branding + custom domain</span>
            <span>· API access &amp; webhooks</span>
          </div>
          <a href="/signup" className="btn btn-primary btn-block text-[14px] mt-auto">Start 7-day trial</a>
        </div>

        <div className="card elev-sm p-[22px] gap-2.5 nx-price-card">
          <div className="card-title">Enterprise</div>
          <div className="font-medium text-[34px]">Custom</div>
          <div className="card-body text-[14px]">For institutions, NGOs and government.</div>
          <div className="flex flex-col gap-[7px] text-[13.5px] text-[var(--color-neutral-300)] mt-1">
            <span>· Multi-tenant Super Admin console</span>
            <span>· SSO, RBAC, audit &amp; residency controls</span>
            <span>· Dedicated banking partner setup</span>
            <span>· SLA 99.99% + priority support</span>
          </div>
          <a href="/contact?topic=Sales" className="btn btn-secondary btn-block text-[14px] mt-auto">Talk to sales</a>
        </div>

        <div
          className="card elev-md p-[22px] gap-2.5 nx-price-card"
          style={{ background: "#0a0a0a", border: "1px solid #fff", color: "#f5f5f5" }}
        >
          <div className="flex items-center">
            <div className="card-title" style={{ color: "#fff" }}>VIP</div>
            <span className="tag ml-auto text-[9.5px]" style={{ border: "1px solid #fff", color: "#fff" }}>Done for you</span>
          </div>
          <div className="font-medium text-[34px]" style={{ color: "#fff" }}>
            $249
            <span className="text-[14px]" style={{ color: "#8a8a8a" }}> / mo</span>
          </div>
          <div className="text-[14px]" style={{ color: "#a8a8a8" }}>You send the word — Teni AI drafts the work.</div>
          <div className="flex flex-col gap-[7px] text-[13.5px] mt-1" style={{ color: "#c8c8c8" }}>
            <span>· Everything in Growth</span>
            <span>· Text or voice — say what you need, any time</span>
            <span>· Teni AI drafts replies, invoices, follow-ups, task lists</span>
            <span>· You review and send — nothing goes out on its own</span>
          </div>
          <a href="/vip" className="btn btn-block text-[14px] mt-auto" style={{ background: "#fff", color: "#0a0a0a", border: "1px solid #fff" }}>
            Go VIP
          </a>
        </div>
      </div>
    </section>
  );
}
