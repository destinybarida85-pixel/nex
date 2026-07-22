const modules = [
  {
    title: "Business Wallet",
    body: "Virtual accounts, transfers, QR & payment links, statements.",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <path d="M16 13h3" />
      </svg>
    ),
  },
  {
    title: "AI Assistant",
    body: "Contracts, proposals, reports, insights and workflows on demand.",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round">
        <path d="M12 3l2.2 6.8L21 12l-6.8 2.2L12 21l-2.2-6.8L3 12l6.8-2.2z" />
      </svg>
    ),
  },
  {
    title: "Documents & E-sign",
    body: "Versioned, permissioned, legally signed with audit trails.",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 3H6v18h12V8z" />
        <path d="M13 3v5h5" />
      </svg>
    ),
  },
  {
    title: "Payments & Invoices",
    body: "Recurring billing, subscriptions, refunds, webhooks.",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="6" width="18" height="13" rx="2" />
        <path d="M3 10.5h18" />
      </svg>
    ),
  },
  {
    title: "HR & Payroll",
    body: "Directory, attendance, leave, salary runs and payslips.",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="8" r="3.2" />
        <path d="M3.5 20c.6-3.4 2.8-5 5.5-5s4.9 1.6 5.5 5" />
        <path d="M17 8h4M17 12h4" />
      </svg>
    ),
  },
  {
    title: "CRM & Projects",
    body: "Pipeline, deals, tasks, kanban boards and client history.",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="3.2" />
        <path d="M5 20c.8-3.6 3.6-5.4 7-5.4s6.2 1.8 7 5.4" />
      </svg>
    ),
  },
  {
    title: "Analytics",
    body: "Cash flow, growth, business health score, AI insights.",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
        <path d="M5 20V12M12 20V5M19 20v-5" />
      </svg>
    ),
  },
  {
    title: "API & Security",
    body: "OAuth, webhooks, sandbox, 2FA, RBAC, audit logs.",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 7l-5 5 5 5M16 7l5 5-5 5" />
      </svg>
    ),
  },
];

export default function ModulesGrid() {
  return (
    <section id="modules" className="max-w-[1160px] mx-auto px-6 pt-[72px]">
      <span className="card-kicker">Every module included</span>
      <h3 className="text-[27px] mt-2.5 tracking-[-0.015em]">One platform. Eight modules.</h3>
      <div className="grid gap-3 mt-6" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
        {modules.map((m) => (
          <div key={m.title} className="card elev-sm gap-1.5 nx-module-card">
            <div style={{ color: "var(--color-accent)" }}>{m.icon}</div>
            <div className="card-title text-[14.5px]">{m.title}</div>
            <div className="card-body">{m.body}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
