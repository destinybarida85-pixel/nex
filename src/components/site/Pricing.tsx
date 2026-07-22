"use client";

import { useState } from "react";
import ScrollReveal from "@/components/site/ScrollReveal";

export default function Pricing() {
  const [annual, setAnnual] = useState(false);
  const growthPrice = annual ? "$39" : "$49";

  return (
    <section id="pricing" className="max-w-[1160px] mx-auto px-6 pt-[80px]">
      <ScrollReveal className="flex items-end gap-4 flex-wrap">
        <div>
          <span className="card-kicker">Pricing</span>
          <h3 className="text-[27px] mt-2.5 tracking-[-0.015em]">Start free. Scale when you do.</h3>
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
            $0<span className="text-[13px] text-[var(--color-neutral-500)]"> forever</span>
          </div>
          <div className="card-body text-[13px]">For a founder getting set up.</div>
          <div className="flex flex-col gap-[7px] text-[12.5px] text-[var(--color-neutral-300)] mt-1">
            <span>· Business wallet + 3 users</span>
            <span>· 20 AI documents / month</span>
            <span>· 5 e-signatures / month</span>
            <span>· Core dashboard &amp; invoicing</span>
          </div>
          <a href="/signup" className="btn btn-secondary btn-block text-[13px] mt-auto">Start free</a>
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
            <span className="text-[13px] text-[var(--color-neutral-500)]"> / user / mo</span>
          </div>
          <div className="card-body text-[13px]">For teams running the whole business on Origin.</div>
          <div className="flex flex-col gap-[7px] text-[12.5px] text-[var(--color-neutral-300)] mt-1">
            <span>· Unlimited AI documents &amp; e-signatures</span>
            <span>· Payroll, CRM, projects, analytics</span>
            <span>· White-label branding + custom domain</span>
            <span>· API access &amp; webhooks</span>
          </div>
          <a href="/signup" className="btn btn-primary btn-block text-[13px] mt-auto">Start 14-day trial</a>
        </div>

        <div className="card elev-sm p-[22px] gap-2.5 nx-price-card">
          <div className="card-title">Enterprise</div>
          <div className="font-medium text-[34px]">Custom</div>
          <div className="card-body text-[13px]">For institutions, NGOs and government.</div>
          <div className="flex flex-col gap-[7px] text-[12.5px] text-[var(--color-neutral-300)] mt-1">
            <span>· Multi-tenant Super Admin console</span>
            <span>· SSO, RBAC, audit &amp; residency controls</span>
            <span>· Dedicated banking partner setup</span>
            <span>· SLA 99.99% + priority support</span>
          </div>
          <button className="btn btn-secondary btn-block text-[13px] mt-auto">Talk to sales</button>
        </div>
      </div>
    </section>
  );
}
