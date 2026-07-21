import { IconLogoMark } from "@/components/icons";

export default function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-neutral-900)] px-4 py-12">
      <a href="/" className="flex items-center gap-2.5 mb-8 no-underline">
        <IconLogoMark size={30} />
        <span className="font-medium text-[19px] text-[var(--color-text)]">Nex</span>
      </a>

      <div
        className="w-full max-w-[380px] p-8 rounded-2xl bg-[var(--color-bg)] text-[var(--color-text)]"
        style={{ boxShadow: "var(--shadow-lg)" }}
      >
        {children}
      </div>

      <div className="text-[11px] text-[var(--color-neutral-600)] mt-6 text-center max-w-[320px]">
        No card required · Funds held by licensed banking partners
      </div>
    </div>
  );
}
