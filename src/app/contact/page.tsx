import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";
import ContactForm from "@/components/site/ContactForm";

const channels = [
  { label: "General & sales", value: "hello@origin.io" },
  { label: "Support", value: "support@origin.io" },
  { label: "Privacy & legal", value: "privacy@origin.io" },
];

export default function ContactPage() {
  return (
    <>
      <Nav />
      <main className="max-w-[960px] mx-auto px-6 pt-[64px] pb-20">
        <span className="card-kicker">Contact</span>
        <h1 className="text-[32px] mt-2.5 tracking-[-0.015em] max-w-[520px]">Talk to the Origin team.</h1>
        <p className="text-sm text-[var(--color-neutral-400)] leading-[1.65] mt-2.5 max-w-[460px]">
          Questions about pricing, white-label setup, or a specific module? Send a message and we&rsquo;ll get back to
          you within one business day.
        </p>

        <div className="grid gap-8 mt-9 items-start" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
          <ContactForm />

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2.5">
              {channels.map((c) => (
                <div key={c.label} className="card elev-sm p-4 gap-1">
                  <div className="text-[11px] tracking-[.06em] uppercase text-[var(--color-neutral-500)]">{c.label}</div>
                  <a href={`mailto:${c.value}`} className="text-[13.5px] no-underline text-[var(--color-text)]">
                    {c.value}
                  </a>
                </div>
              ))}
            </div>
            <div className="text-[12px] text-[var(--color-neutral-500)] leading-[1.6]">
              Origin Inc. is a software platform. Payments made through Origin are processed by Stripe, not by
              Origin directly.
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
