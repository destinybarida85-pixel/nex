export default function MobileShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex justify-center bg-[var(--color-neutral-900)]">
      <div className="w-full max-w-[430px] min-h-screen flex flex-col bg-[var(--color-bg)] text-[var(--color-text)]">
        {children}
      </div>
    </div>
  );
}
