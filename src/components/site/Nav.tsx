import { IconLogoMark } from "@/components/icons";

export default function Nav() {
  return (
    <header className="sticky top-0 z-20 bg-[color-mix(in_srgb,var(--color-bg)_82%,transparent)] backdrop-blur-md border-b border-[var(--color-divider)]">
      <div className="max-w-[1160px] mx-auto flex items-center gap-6 px-6 py-3.5">
        <a
          href="/"
          className="flex items-center gap-2 mr-auto no-underline text-[var(--color-text)]"
        >
          <IconLogoMark size={26} />
          <span className="font-medium text-[17px]">Primue</span>
        </a>

        <div className="flex items-center gap-2.5 sm:gap-6">
          <a href="/signin" className="btn btn-secondary text-[13px] sm:text-[14px]">Sign in</a>
          <a href="/signup" className="btn btn-primary text-[13px] sm:text-[14px]">Get started</a>
        </div>
      </div>
    </header>
  );
}
