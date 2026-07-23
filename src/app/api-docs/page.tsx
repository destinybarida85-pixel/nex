import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";
import { IconApi, IconCheckCircle, IconArrowRight } from "@/components/icons";

const endpoints = [
  { method: "GET", path: "/api/wallet", body: "Returns your wallet accounts and recent transactions." },
  { method: "POST", path: "/api/wallet/transfer", body: "Records an outbound transfer and updates the balance." },
  { method: "POST", path: "/api/sign", body: "Hashes a document and signature, chains it to the previous signature, returns a certificate ID." },
  { method: "GET/POST", path: "/api/stripe/payment-links", body: "Lists or creates a real, live Stripe payment link on your connected account." },
  { method: "POST", path: "/api/stripe/webhook", body: "Receives Stripe events, verifies the signature, credits your wallet on a completed checkout." },
  { method: "GET/POST", path: "/api/documents", body: "Lists or saves a document tied to your tenant, for use in white-label mini sites." },
  { method: "POST", path: "/api/assistant", body: "Sends a prompt to Claude and returns a structured draft document." },
];

export default function ApiPage() {
  return (
    <>
      <Nav />
      <main className="max-w-[900px] mx-auto px-6 pt-[64px] pb-20">
        <span className="card-kicker">API</span>
        <h1 className="text-[34px] mt-2.5 tracking-[-0.02em]">The same API the product runs on.</h1>
        <p className="text-[15px] text-[var(--color-neutral-400)] mt-3 leading-[1.65] max-w-[640px]">
          Origin doesn&rsquo;t have a separate, external developer API with its own keys yet — what&rsquo;s below is
          the real internal API the app itself calls. Every route is session-authenticated and scoped to your
          tenant server-side, so a request can never read or write another tenant&rsquo;s data.
        </p>

        <div className="mt-9 rounded-xl overflow-hidden border" style={{ borderColor: "var(--color-divider)" }}>
          <table className="table text-[13px]">
            <thead>
              <tr>
                <th>Method</th>
                <th>Endpoint</th>
                <th>What it does</th>
              </tr>
            </thead>
            <tbody>
              {endpoints.map((e) => (
                <tr key={e.path}>
                  <td className="font-mono text-[11.5px]" style={{ color: "var(--color-accent-300)" }}>{e.method}</td>
                  <td className="font-mono text-[12px]">{e.path}</td>
                  <td className="text-[var(--color-neutral-400)]">{e.body}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-10">
          <h2 className="text-[19px] tracking-[-0.01em]">How authentication works</h2>
          <p className="text-[13.5px] text-[var(--color-neutral-400)] leading-[1.7] mt-3 max-w-[640px]">
            Requests carry a Supabase session cookie set at sign-in. Every route resolves the caller&rsquo;s tenant
            from that session server-side — a client can never pass a tenant ID and have it trusted. Webhook
            endpoints (like Stripe&rsquo;s) skip session auth entirely and instead verify a cryptographic signature
            on the payload before touching the database.
          </p>
        </div>

        <div className="mt-10">
          <h2 className="text-[19px] tracking-[-0.01em]">Public API keys — on the roadmap</h2>
          <p className="text-[13.5px] text-[var(--color-neutral-400)] leading-[1.7] mt-3 max-w-[640px]">
            A proper external API — scoped API keys, rate limits, published request/response schemas — isn&rsquo;t
            built yet. If programmatic access to your own data would unblock something you&rsquo;re building, tell
            us what you need.
          </p>
          <a href="/contact" className="btn btn-secondary text-[13px] mt-4 inline-flex">
            Talk to us about API access <IconArrowRight size={13} />
          </a>
        </div>

        <div className="nx-footer-panel mt-14 flex items-center gap-3">
          <IconApi size={22} className="text-[var(--color-accent)] flex-none" />
          <div className="text-[13.5px] text-[var(--color-neutral-300)] leading-[1.6] flex items-center gap-1.5">
            <IconCheckCircle size={14} className="text-[var(--color-accent)] flex-none" />
            Everything on this page reflects what&rsquo;s actually deployed right now, not a roadmap dressed up as
            shipped.
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
