function SparkleIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.7" strokeLinejoin="round">
      <path d="M12 3l2.2 6.8L21 12l-6.8 2.2L12 21l-2.2-6.8L3 12l6.8-2.2z" />
    </svg>
  );
}

const tenantBrands = [
  { initial: "A", color: "#63c3b2", name: "Atlas Chambers", domain: "portal.atlaschambers.com" },
  { initial: "B", color: "#d9a05b", name: "Brightfield Academy", domain: "brightfield.nex.app" },
  { initial: "C", color: "#7fa3e8", name: "Cascade Relief", domain: "give.cascaderelief.org" },
  { initial: "H", color: null, name: "Harbor City Council", domain: "services.harborcity.gov" },
];

export default function FeatureRows() {
  return (
    <section id="wallet" className="max-w-[1160px] mx-auto px-6 pt-[72px] flex flex-col gap-16">
      {/* Business Wallet */}
      <div className="grid gap-12 items-center" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))" }}>
        <div>
          <span className="card-kicker">Business Wallet</span>
          <h3 className="text-[27px] mt-2.5 tracking-[-0.015em]">A real business account, inside your OS.</h3>
          <p className="text-sm text-[var(--color-neutral-400)] leading-[1.65] mt-2.5 max-w-[460px]">
            Virtual accounts backed by licensed banking partners. Receive, transfer, run payroll and pay vendors — funds stay with the bank, the interface stays yours.
          </p>
          <a href="#pricing" className="btn btn-ghost text-[13px] mt-2.5">Explore the wallet →</a>
        </div>
        <div className="border border-[var(--color-divider)] rounded-xl p-5 bg-[var(--color-surface)] flex flex-col gap-2.5">
          <div className="flex items-center">
            <span className="text-[10.5px] tracking-[.08em] uppercase text-[var(--color-neutral-500)]">Virtual account</span>
            <span className="tag tag-accent ml-auto text-[9.5px]">Active</span>
          </div>
          <div className="font-mono text-[19px] tracking-[.05em]">0219 4417 8830</div>
          <div className="text-[11.5px] text-[var(--color-neutral-500)]">Column Bank N.A. · ACH + Wire</div>
          <div className="flex gap-2 mt-1 flex-wrap">
            <button className="btn btn-primary text-xs">Receive</button>
            <button className="btn btn-secondary text-xs">Transfer</button>
            <button className="btn btn-secondary text-xs">Payment link</button>
          </div>
        </div>
      </div>

      {/* AI + Documents */}
      <div className="grid gap-12 items-center" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))" }}>
        <div
          className="rounded-xl p-5 flex flex-col gap-2.5 border"
          style={{ borderColor: "color-mix(in srgb, var(--color-accent) 30%, transparent)" }}
        >
          <div className="flex items-center gap-2">
            <SparkleIcon />
            <span className="text-[13px] font-medium">Nex AI</span>
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
        <div>
          <span className="card-kicker">AI + Documents + E-signature</span>
          <h3 className="text-[27px] mt-2.5 tracking-[-0.015em]">From prompt to signed contract.</h3>
          <p className="text-sm text-[var(--color-neutral-400)] leading-[1.65] mt-2.5 max-w-[460px]">
            Generate contracts, invoices, HR letters and reports; route them for legally valid e-signature with OTP identity checks, audit trails and version control.
          </p>
          <a href="#modules" className="btn btn-ghost text-[13px] mt-2.5">See the document center →</a>
        </div>
      </div>

      {/* White-label */}
      <div id="whitelabel" className="grid gap-12 items-center" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))" }}>
        <div>
          <span className="card-kicker">True white-label</span>
          <h3 className="text-[27px] mt-2.5 tracking-[-0.015em]">Your clients see your brand. Only yours.</h3>
          <p className="text-sm text-[var(--color-neutral-400)] leading-[1.65] mt-2.5 max-w-[460px]">
            Logo, colors, domain, emails, PDFs, portal — every client-facing surface carries your identity. Nex runs invisibly behind the scenes, with a Super Admin console for the platform owner.
          </p>
          <a href="#pricing" className="btn btn-ghost text-[13px] mt-2.5">How white-label works →</a>
        </div>
        <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))" }}>
          {tenantBrands.map((t) => (
            <div key={t.name} className="border border-[var(--color-divider)] rounded-xl p-4 flex flex-col gap-2">
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
      </div>
    </section>
  );
}
