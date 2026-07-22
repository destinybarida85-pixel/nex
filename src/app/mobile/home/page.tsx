"use client";

import { useState } from "react";
import MobileShell from "@/components/mobile/MobileShell";
import BottomTabBar from "@/components/mobile/BottomTabBar";
import TransferModal from "@/components/wallet/TransferModal";
import ReceiveModal from "@/components/wallet/ReceiveModal";
import {
  IconBell,
  IconSend,
  IconReceive,
  IconDocuments,
  IconSparkle,
  IconArrowUpCircle,
  IconArrowDownCircle,
  IconPerson,
  MobileLogoMark,
} from "@/components/icons";

type ActivityItem = {
  name: string;
  meta: string;
  amount: string;
  credit: boolean;
  icon: typeof IconArrowUpCircle;
  color: string;
};

const initialActivity: ActivityItem[] = [
  { name: "Halcyon Ventures", meta: "Invoice · Jul 21", amount: "+$18,500", credit: true, icon: IconArrowUpCircle, color: "#63c3b2" },
  { name: "AWS", meta: "Vendor · Jul 20", amount: "−$2,340", credit: false, icon: IconArrowDownCircle, color: "#d9a05b" },
  { name: "Payroll · July", meta: "14 employees · Jul 18", amount: "−$41,200", credit: false, icon: IconPerson, color: "#7fa3e8" },
];

export default function MobileHomePage() {
  const [balance, setBalance] = useState(248610.44);
  const [activity, setActivity] = useState<ActivityItem[]>(initialActivity);
  const [showTransfer, setShowTransfer] = useState(false);
  const [showReceive, setShowReceive] = useState(false);

  function handleSend(party: string, amount: number) {
    setBalance((prev) => prev - amount);
    setActivity((prev) => [
      { name: party, meta: "Transfer · just now", amount: `-$${amount.toLocaleString()}`, credit: false, icon: IconArrowDownCircle, color: "#d9a05b" },
      ...prev,
    ]);
    setShowTransfer(false);
  }

  const quickActions = [
    { label: "Send", icon: IconSend, bg: "#9184d9", onClick: () => setShowTransfer(true) },
    { label: "Receive", icon: IconReceive, bg: "#63c3b2", onClick: () => setShowReceive(true) },
    { label: "Document", icon: IconDocuments, bg: "#d9a05b", href: "/assistant" },
    { label: "Ask AI", icon: IconSparkle, bg: "#7fa3e8", href: "/assistant" },
  ];

  return (
    <MobileShell>
      <div className="flex items-center gap-2.5 pt-16 px-[18px] pb-1.5">
        <MobileLogoMark size={28} initial="M" />
        <div>
          <div className="text-[13.5px] font-medium">Meridian Studio</div>
          <div className="text-[10.5px] text-[var(--color-neutral-500)]">Business account</div>
        </div>
        <div className="flex-1" />
        <button className="btn btn-icon btn-secondary w-8 h-8 relative" aria-label="Notifications">
          <IconBell size={15} />
          <span className="absolute top-1.5 right-[7px] w-1.5 h-1.5 rounded-full" style={{ background: "var(--color-accent)" }} />
        </button>
      </div>

      <div className="flex-1 overflow-hidden px-[18px] pt-2.5 flex flex-col gap-3.5">
        <div
          className="rounded-2xl p-[18px] flex flex-col gap-1"
          style={{
            background: "linear-gradient(150deg, var(--color-surface), color-mix(in srgb, var(--color-accent-900) 60%, var(--color-surface)))",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div className="text-[10.5px] tracking-[.08em] uppercase text-[var(--color-neutral-500)]">Wallet balance</div>
          <div className="font-medium text-[30px] tracking-[-0.01em]">
            ${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-[var(--color-neutral-500)]">•• 4417 · Column Bank N.A.</div>
        </div>

        <div className="grid grid-cols-4 gap-2 text-center">
          {quickActions.map((a) => {
            const content = (
              <button
                className="btn btn-icon"
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 14,
                  background: `color-mix(in srgb, ${a.bg} 20%, transparent)`,
                  border: `1px solid color-mix(in srgb, ${a.bg} 45%, transparent)`,
                  color: a.bg,
                }}
                aria-label={a.label}
                onClick={a.onClick}
              >
                <a.icon size={17} />
              </button>
            );
            return (
              <div key={a.label} className="flex flex-col gap-1.5 items-center">
                {a.href ? <a href={a.href}>{content}</a> : content}
                <span className="text-[10.5px] text-[var(--color-neutral-400)]">{a.label}</span>
              </div>
            );
          })}
        </div>

        <div
          className="rounded-xl p-[12px_14px] flex gap-2.5 items-start"
          style={{ background: "color-mix(in srgb, var(--color-accent-900) 45%, transparent)" }}
        >
          <IconSparkle size={14} className="text-[var(--color-accent)] flex-none mt-0.5" />
          <div className="text-xs leading-[1.5] text-[var(--color-neutral-300)]">
            Invoice #INV-2038 is overdue. <a href="#" style={{ color: "var(--color-accent-300)" }}>Send a reminder</a>
          </div>
        </div>

        <div className="flex flex-col gap-0.5">
          <div className="flex items-baseline py-0.5 pb-2">
            <span className="text-[13px] font-medium">Recent activity</span>
            <a href="#" className="ml-auto text-[11.5px] no-underline" style={{ color: "var(--color-accent-300)" }}>
              See all
            </a>
          </div>
          {activity.map((item, i) => (
            <div key={item.name + i} className="flex items-center gap-2.5 py-2.5">
              <span
                className="w-[34px] h-[34px] rounded-[10px] grid place-items-center flex-none"
                style={{
                  background: `color-mix(in srgb, ${item.color} 18%, transparent)`,
                  color: item.color,
                }}
              >
                <item.icon size={14} />
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-[13px]">{item.name}</div>
                <div className="text-[10.5px] text-[var(--color-neutral-500)]">{item.meta}</div>
              </div>
              <span className="text-[13px]" style={{ color: item.credit ? item.color : "var(--color-neutral-400)" }}>
                {item.amount}
              </span>
            </div>
          ))}
        </div>

        <div className="card elev-sm p-[14px_16px] gap-2">
          <div className="flex items-baseline">
            <span className="text-[13px] font-medium">Revenue · 6 months</span>
            <span className="card-meta ml-auto" style={{ color: "var(--color-accent-300)" }}>▲ 12.4%</span>
          </div>
          <svg viewBox="0 0 320 64" className="w-full h-auto block" role="img" aria-label="Revenue rising over six months">
            <rect x="10" y="34" width="30" height="30" rx="4" fill="#423a6a" />
            <rect x="64" y="26" width="30" height="38" rx="4" fill="#423a6a" />
            <rect x="118" y="38" width="30" height="26" rx="4" fill="#423a6a" />
            <rect x="172" y="18" width="30" height="46" rx="4" fill="#5d5294" />
            <rect x="226" y="22" width="30" height="42" rx="4" fill="#5d5294" />
            <rect x="280" y="6" width="30" height="58" rx="4" fill="#968ae0" />
          </svg>
        </div>
      </div>

      <BottomTabBar active="home" />

      {showTransfer && <TransferModal onClose={() => setShowTransfer(false)} onSend={handleSend} />}
      {showReceive && <ReceiveModal onClose={() => setShowReceive(false)} />}
    </MobileShell>
  );
}
