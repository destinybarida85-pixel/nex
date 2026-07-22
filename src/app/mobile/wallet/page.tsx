import MobileShell from "@/components/mobile/MobileShell";
import BottomTabBar from "@/components/mobile/BottomTabBar";
import { IconDownload, IconQrCode, IconArrowUpCircle, IconArrowDownCircle, IconPerson, MobileLogoMark } from "@/components/icons";

const transactions = [
  { name: "Halcyon Ventures", meta: "ACH · Jul 21", amount: "+$18,500.00", credit: true, icon: IconArrowUpCircle, color: "#63c3b2" },
  { name: "AWS", meta: "Card · Jul 20", amount: "−$2,340.18", credit: false, icon: IconArrowDownCircle, color: "#d9a05b" },
  { name: "Payroll · July run", meta: "Internal · Jul 18", amount: "−$41,200.00", credit: false, icon: IconPerson, color: "#7fa3e8" },
  { name: "Northbeam Co.", meta: "Payment link · Jul 17", amount: "+$6,750.00", credit: true, icon: IconArrowUpCircle, color: "#63c3b2" },
];

export default function MobileWalletPage() {
  return (
    <MobileShell>
      <div className="flex items-center gap-2.5 pt-16 px-[18px] pb-1.5">
        <MobileLogoMark size={26} initial="M" />
        <div className="text-[16px] font-medium">Business Wallet</div>
        <div className="flex-1" />
        <button className="btn btn-icon btn-secondary w-8 h-8" aria-label="Statement">
          <IconDownload size={15} />
        </button>
      </div>

      <div className="flex-1 overflow-hidden px-[18px] pt-2.5 flex flex-col gap-3.5">
        <div className="text-center py-2 pb-0.5">
          <div className="text-[10.5px] tracking-[.08em] uppercase text-[var(--color-neutral-500)]">Available balance</div>
          <div className="font-medium text-[36px] tracking-[-0.015em] mt-1">$248,610.44</div>
          <div className="flex justify-center gap-2 mt-3">
            <button className="btn btn-primary text-[12.5px]">Transfer</button>
            <button className="btn btn-secondary text-[12.5px]">Deposit</button>
            <button className="btn btn-secondary btn-icon" aria-label="QR code">
              <IconQrCode size={15} />
            </button>
          </div>
        </div>

        <div className="card elev-sm p-[14px_16px] gap-2">
          <div className="flex items-center">
            <span className="text-[11px] tracking-[.08em] uppercase text-[var(--color-neutral-500)]">Virtual account</span>
            <span className="tag tag-accent ml-auto text-[9.5px]">Active</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[16px] tracking-[.04em]">0219 4417 8830</span>
            <button className="btn btn-ghost text-[11px] px-1.5 py-0.5">Copy</button>
          </div>
          <div className="card-meta">Meridian Studio Inc. · Column Bank N.A. · ACH + Wire</div>
          <div
            className="text-[11px] leading-[1.5] text-[var(--color-neutral-500)] border-t border-[var(--color-divider)] pt-2"
          >
            Funds are held by our licensed banking partner. Nex provides the business interface.
          </div>
        </div>

        <div className="flex flex-col gap-0.5">
          <div className="flex items-baseline py-0.5 pb-1.5">
            <span className="text-[13px] font-medium">Transactions</span>
            <a href="#" className="ml-auto text-[11.5px] no-underline" style={{ color: "var(--color-accent-300)" }}>
              Filter
            </a>
          </div>
          {transactions.map((t) => (
            <div key={t.name + t.meta} className="flex items-center gap-2.5 py-2">
              <span
                className="w-[34px] h-[34px] rounded-[10px] grid place-items-center flex-none"
                style={{
                  background: `color-mix(in srgb, ${t.color} 18%, transparent)`,
                  color: t.color,
                }}
              >
                <t.icon size={14} />
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-[13px]">{t.name}</div>
                <div className="text-[10.5px] text-[var(--color-neutral-500)]">{t.meta}</div>
              </div>
              <span className="text-[13px]" style={{ color: t.credit ? t.color : "var(--color-neutral-400)" }}>
                {t.amount}
              </span>
            </div>
          ))}
        </div>
      </div>

      <BottomTabBar active="wallet" />
    </MobileShell>
  );
}
