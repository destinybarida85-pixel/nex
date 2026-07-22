import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";

export default function LegalLayout({
  kicker,
  title,
  updated,
  children,
}: {
  kicker: string;
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <Nav />
      <main className="max-w-[760px] mx-auto px-6 pt-[64px] pb-20">
        <span className="card-kicker">{kicker}</span>
        <h1 className="text-[32px] mt-2.5 tracking-[-0.015em]">{title}</h1>
        <div className="text-[12px] text-[var(--color-neutral-500)] mt-2">Last updated {updated}</div>
        <div className="mt-9 flex flex-col gap-7 text-[14px] leading-[1.7] text-[var(--color-neutral-300)]">
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
}
