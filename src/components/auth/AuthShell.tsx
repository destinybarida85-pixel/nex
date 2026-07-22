import AuthNicheScene from "./AuthNicheScene";

export default function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full grid grid-cols-1 md:grid-cols-2 bg-[var(--color-bg)]">
      <div className="hidden md:block relative">
        <AuthNicheScene />
      </div>

      <div className="flex flex-col justify-center items-center p-8 sm:p-12 text-[var(--color-text)] min-h-screen">
        <div className="w-full max-w-[360px]">{children}</div>
        <div className="text-[11px] text-center max-w-[320px] text-[var(--color-neutral-600)] mt-8">
          No card required · Funds held by licensed banking partners
        </div>
      </div>
    </div>
  );
}
