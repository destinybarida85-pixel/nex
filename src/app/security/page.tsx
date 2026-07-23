import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";
import { IconShieldCheck, IconLock, IconESign, IconCheckCircle, IconGlobe, IconWallet } from "@/components/icons";

const pillars = [
  {
    icon: IconLock,
    title: "Tenant isolation, enforced by the database",
    body: "Every table is scoped with Postgres Row Level Security, not just application-layer checks. A query for another tenant's data is rejected by the database itself, before it ever reaches your code.",
  },
  {
    icon: IconESign,
    title: "Tamper-evident signatures",
    body: "Each signature is chained: its record hash is computed from the document hash, the signer's details, and the previous signature's hash. Edit any earlier record and every hash after it stops matching — the tampering is mathematically detectable, not just logged.",
  },
  {
    icon: IconWallet,
    title: "Payments through Stripe",
    body: "Origin never sees or stores card numbers. Payments run through Stripe's hosted checkout, which is PCI-DSS compliant. Origin only ever stores the resulting transaction record — never card data.",
  },
  {
    icon: IconGlobe,
    title: "Real authentication",
    body: "Sign-in runs on Supabase Auth (email/password and Google OAuth), with session cookies and server-side verification on every request — not a client-side flag that can be spoofed.",
  },
];

const practices = [
  "TLS encryption in transit for every request.",
  "Encryption at rest for the underlying Postgres database.",
  "Secrets (API keys, service credentials) live in environment variables, never in source control.",
  "Every API route re-verifies the caller's session and tenant on the server — a client can't just claim a tenant ID.",
  "Webhook payloads (e.g. from Stripe) are signature-verified before anything is written to the database.",
];

export default function SecurityPage() {
  return (
    <>
      <Nav />
      <main className="max-w-[900px] mx-auto px-6 pt-[64px] pb-20">
        <span className="card-kicker">Security</span>
        <h1 className="text-[34px] mt-2.5 tracking-[-0.02em]">How Origin actually protects your data.</h1>
        <p className="text-[15px] text-[var(--color-neutral-400)] mt-3 leading-[1.65] max-w-[620px]">
          Not a checklist of buzzwords — this page describes the real mechanisms behind the product, in plain
          language, so you know exactly what&rsquo;s protecting your business data.
        </p>

        <div className="grid gap-4 mt-10 grid-cols-1 sm:grid-cols-2">
          {pillars.map((p) => (
            <div key={p.title} className="card elev-sm p-5 gap-2">
              <p.icon size={18} className="text-[var(--color-accent)]" />
              <div className="card-title text-[14.5px] mt-1">{p.title}</div>
              <div className="card-body text-[13px] leading-[1.65]">{p.body}</div>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <h2 className="text-[19px] tracking-[-0.01em]">Baseline practices</h2>
          <div className="flex flex-col gap-2.5 mt-4">
            {practices.map((item) => (
              <div key={item} className="flex items-start gap-2.5 text-[13.5px] text-[var(--color-neutral-300)]">
                <IconCheckCircle size={15} className="text-[var(--color-accent)] flex-none mt-0.5" />
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-[19px] tracking-[-0.01em]">Roadmap — being upfront</h2>
          <p className="text-[13.5px] text-[var(--color-neutral-400)] leading-[1.7] mt-3 max-w-[620px]">
            Two-factor authentication, a dedicated audit-log viewer, and formal SOC 2 certification are not live yet.
            We&rsquo;d rather tell you what&rsquo;s actually built today than list features that don&rsquo;t exist.
            If a specific control matters for your compliance requirements, ask — <a href="/contact" className="text-[var(--color-accent-300)] no-underline">contact us</a> directly.
          </p>
        </div>

        <div className="nx-footer-panel mt-14 flex items-center gap-3">
          <IconShieldCheck size={22} className="text-[var(--color-accent)] flex-none" />
          <div className="text-[13.5px] text-[var(--color-neutral-300)] leading-[1.6]">
            Found a security issue? We want to know before anyone else does.{" "}
            <a href="/contact" className="text-[var(--color-accent-300)] no-underline">Report it here</a> — we take
            every report seriously.
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
