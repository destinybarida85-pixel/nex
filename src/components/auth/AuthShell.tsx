import { IconLogoMark } from "@/components/icons";
import AuthNicheScene from "./AuthNicheScene";

export default function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-[var(--color-neutral-900)]">
      <div className="w-full flex flex-col items-center gap-4" style={{ maxWidth: 940 }}>
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--color-divider)]"
          style={{ background: "var(--color-surface)" }}
        >
          <IconLogoMark size={20} />
          <span className="text-[12.5px] font-medium text-[var(--color-neutral-400)]">app.origin.io</span>
        </div>

        <div
          className="w-full rounded-[28px] overflow-hidden grid grid-cols-1 md:grid-cols-2 border border-[var(--color-divider)]"
          style={{ background: "var(--color-bg)", boxShadow: "var(--shadow-lg)", minHeight: 560 }}
        >
          <div className="hidden md:block relative">
            <AuthNicheScene />
          </div>

          <div className="flex flex-col justify-center p-8 sm:p-12 text-[var(--color-text)]">
            <div className="w-full max-w-[320px] mx-auto">{children}</div>
          </div>
        </div>

        <div className="text-[11px] text-center max-w-[320px] text-[var(--color-neutral-600)]">
          No card required · Funds held by licensed banking partners
        </div>
      </div>
    </div>
  );
}
