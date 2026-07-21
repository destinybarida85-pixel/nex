const links = [
  { href: "#product", label: "Product" },
  { href: "#wallet", label: "Wallet" },
  { href: "#whitelabel", label: "White-label" },
  { href: "#modules", label: "Modules" },
  { href: "#pricing", label: "Pricing" },
];

export default function Nav() {
  return (
    <header className="sticky top-0 z-20 bg-[color-mix(in_srgb,var(--color-bg)_82%,transparent)] backdrop-blur-md border-b border-[var(--color-divider)]">
      <div className="max-w-[1160px] mx-auto flex items-center gap-6 px-6 py-3.5 flex-wrap">
        <a
          href="#top"
          className="flex items-center gap-2 mr-auto no-underline text-[var(--color-text)]"
        >
          <span className="w-[26px] h-[26px] rounded-lg bg-[linear-gradient(135deg,var(--color-accent-500),var(--color-accent-800))] grid place-items-center text-[var(--color-accent-100)] font-semibold text-sm">
            N
          </span>
          <span className="font-medium text-[17px]">Nex</span>
        </a>
        {links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className="text-[13.5px] no-underline text-[var(--color-neutral-400)] hover:text-[var(--color-text)] transition-colors"
          >
            {l.label}
          </a>
        ))}
        <button className="btn btn-secondary text-[13px]">Sign in</button>
        <button className="btn btn-primary text-[13px]">Get started</button>
      </div>
    </header>
  );
}
