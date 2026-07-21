export default function Footer() {
  return (
    <section className="max-w-[1160px] mx-auto px-6 pt-20 pb-16">
      <div className="border-t border-[var(--color-divider)] pt-14 flex flex-wrap gap-8 items-end">
        <div className="max-w-[560px]">
          <h2 className="text-[clamp(28px,4vw,36px)] tracking-[-0.02em] m-0">Run everything. From one place.</h2>
          <p className="text-sm text-[var(--color-neutral-400)] mt-2.5">
            Startups, schools, NGOs, agencies and government — one platform, your brand.
          </p>
          <div className="flex gap-2.5 mt-5 max-w-[440px]">
            <input className="input flex-1" placeholder="you@company.com" />
            <a href="/signup" className="btn btn-primary text-[13.5px] flex-none">Get started</a>
          </div>
        </div>
      </div>
      <div className="flex gap-[22px] mt-14 text-[11.5px] text-[var(--color-neutral-600)] flex-wrap">
        <span className="mr-auto">© 2026 Nex Inc.</span>
        <a href="#top" className="text-inherit no-underline">Security</a>
        <a href="#top" className="text-inherit no-underline">API</a>
        <a href="#pricing" className="text-inherit no-underline">Pricing</a>
        <a href="#top" className="text-inherit no-underline">Privacy</a>
        <a href="#top" className="text-inherit no-underline">Terms</a>
      </div>
    </section>
  );
}
