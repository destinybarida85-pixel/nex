import { IconLogoMark } from "@/components/icons";
import LiveAntScene from "@/components/vip/LiveAntScene";

const vipVars = {
  "--color-bg": "#0a0a0a",
  "--color-surface": "#141414",
  "--color-text": "#f5f5f5",
  "--color-accent": "#ffffff",
  "--color-divider": "rgba(255,255,255,0.14)",
  "--color-neutral-400": "#a8a8a8",
  "--color-neutral-500": "#8a8a8a",
  "--color-neutral-600": "#6b6b6b",
} as React.CSSProperties;

export const metadata = {
  title: "Primue VIP — Your private control center",
  description: "Send a request by text or voice. Teni AI drafts the real work — replies, invoices, follow-ups — ready for you to review and send.",
};

export default function VipHomePage() {
  return (
    <div style={{ ...vipVars, background: "var(--color-bg)", color: "var(--color-text)" }} className="min-h-screen w-full">
      {/* The ants ARE the homepage background, not a boxed-off demo of
          themselves — this layer sits behind the header and hero, not in its
          own section further down the page. structureAnchor pushes the
          actual building down toward the CTA row so it never sits directly
          behind the headline text. */}
      <div className="relative overflow-hidden">
        <LiveAntScene className="absolute inset-0" structureAnchor={0.82} />
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse 70% 55% at 50% 30%, transparent, var(--color-bg) 85%)" }}
        />

        <header className="relative max-w-[1160px] mx-auto px-6 py-6 flex items-center gap-3">
          <IconLogoMark size={28} />
          <span style={{ fontSize: 16, fontWeight: 600 }}>Primue</span>
          <span className="tag text-[10px]" style={{ border: "1px solid #fff", color: "#fff" }}>VIP</span>
          <div className="flex-1" />
          <a href="/vip/login" className="btn text-[13.5px]" style={{ border: "1px solid var(--color-divider)", color: "#fff" }}>
            Login
          </a>
          <a href="/vip/signup" className="btn text-[13.5px]" style={{ background: "#fff", color: "#0a0a0a", border: "1px solid #fff" }}>
            Sign up
          </a>
        </header>

        <section className="relative max-w-[1160px] mx-auto px-6 pt-[40px] pb-[64px] text-center flex flex-col items-center">
          <span className="text-[11px] tracking-[.14em] uppercase" style={{ color: "var(--color-neutral-500)" }}>
            A private, AI-run control center
          </span>
          <h1 className="mt-4 tracking-[-0.03em] leading-[1.05]" style={{ fontSize: "clamp(36px,5vw,58px)", fontWeight: 700 }}>
            You run the business.
            <br />
            Teni AI runs the rest.
          </h1>
          <p className="mt-5 max-w-[560px] text-[16px] leading-[1.6]" style={{ color: "var(--color-neutral-400)" }}>
            Send a request by text or voice, any time. Teni AI drafts the real work — client replies, invoice
            follow-ups, task lists — and it lands in your queue, ready to review and send. Nothing goes out without you.
          </p>
          <div className="flex gap-3 mt-7">
            <a href="/vip/signup" className="btn text-[14.5px] px-6 py-3" style={{ background: "#fff", color: "#0a0a0a", border: "1px solid #fff" }}>
              Get VIP access
            </a>
            <a href="/vip/login" className="btn text-[14.5px] px-6 py-3" style={{ border: "1px solid var(--color-divider)", color: "#fff" }}>
              Login
            </a>
          </div>
          <div className="mt-[280px] text-[11px]" style={{ color: "var(--color-neutral-600)" }}>
            Small actions, continuously, building something bigger — together — the same way Teni AI works in the background.
          </div>
        </section>
      </div>

      <section className="max-w-[1160px] mx-auto px-6 pt-[16px] pb-[100px]">
        <div className="grid gap-3.5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
          {[
            {
              title: "Say it, don't type it",
              body: "A real, in-browser voice note or a few typed words — either way, Teni AI understands the request.",
              icon: (
                <>
                  <path d="M14 18a6 6 0 0 1 6-6h20a6 6 0 0 1 6 6v14a6 6 0 0 1-6 6H28l-7 6v-6h-1a6 6 0 0 1-6-6V18Z" stroke="#9184d9" strokeWidth="2" />
                  <g stroke="#9184d9" strokeWidth="2" strokeLinecap="round">
                    <path d="M22 28v-2" />
                    <path d="M27 28v-6" />
                    <path d="M32 28v-9" />
                    <path d="M37 28v-5" />
                    <path d="M42 28v-2" />
                  </g>
                </>
              ),
            },
            {
              title: "Drafted, not decided",
              body: "Every reply, invoice or follow-up comes back as a ready draft. You always review and send it yourself.",
              icon: (
                <>
                  <path d="M18 12h14l8 8v22a2 2 0 0 1-2 2H18a2 2 0 0 1-2-2V14a2 2 0 0 1 2-2Z" stroke="#9184d9" strokeWidth="2" />
                  <path d="M32 12v8h8" stroke="#9184d9" strokeWidth="2" />
                  <g stroke="#9184d9" strokeWidth="1.6" strokeLinecap="round" opacity="0.55">
                    <path d="M22 30h12" />
                    <path d="M22 35h16" />
                    <path d="M22 40h10" />
                  </g>
                  <circle cx="41" cy="41" r="8" fill="#0a0a0a" stroke="#9184d9" strokeWidth="2" />
                  <path d="M38.3 43.7l1-3.4 5.2-5.2a1.5 1.5 0 0 1 2.1 2.1l-5.2 5.2-3.1 1.3Z" stroke="#9184d9" strokeWidth="1.3" fill="none" strokeLinejoin="round" />
                </>
              ),
            },
            {
              title: "One queue, everything in it",
              body: "Requests, drafts and decisions live in one place — not scattered across a dozen open tabs.",
              icon: (
                <>
                  <path d="M13 30l6-16h22l6 16" stroke="#9184d9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M13 30v10a2 2 0 0 0 2 2h30a2 2 0 0 0 2-2V30" stroke="#9184d9" strokeWidth="2" strokeLinejoin="round" />
                  <path d="M13 30h9a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4h9" stroke="#9184d9" strokeWidth="2" strokeLinejoin="round" />
                </>
              ),
            },
          ].map((f) => (
            <div key={f.title} className="rounded-xl p-6" style={{ background: "var(--color-surface)", border: "1px solid var(--color-divider)" }}>
              <div
                className="rounded-lg mb-4 grid place-items-center"
                style={{
                  width: 52,
                  height: 52,
                  background: "radial-gradient(circle, color-mix(in srgb, #9184d9 16%, transparent), transparent 72%)",
                }}
              >
                <svg width="40" height="40" viewBox="0 0 56 56" fill="none">
                  {f.icon}
                </svg>
              </div>
              <div className="text-[15px] font-medium mb-2">{f.title}</div>
              <div className="text-[13.5px] leading-[1.7]" style={{ color: "var(--color-neutral-400)" }}>{f.body}</div>
            </div>
          ))}
        </div>
      </section>

      <footer className="max-w-[1160px] mx-auto px-6 pb-10 flex items-center justify-between text-[12px]" style={{ color: "var(--color-neutral-600)" }}>
        <span>Primue VIP</span>
        <a href="/" style={{ color: "var(--color-neutral-600)" }}>← Back to primue.com</a>
      </footer>
    </div>
  );
}
