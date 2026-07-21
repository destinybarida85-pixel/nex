import { IconArrowUpCircle, IconArrowDownCircle, IconPerson } from "@/components/icons";

const rows = [
  { party: "Halcyon Ventures", meta: "Invoice · Jul 21", amount: "+$18,500.00", credit: true, icon: IconArrowUpCircle },
  { party: "AWS", meta: "Vendor · Jul 20", amount: "−$2,340.18", credit: false, icon: IconArrowDownCircle },
  { party: "Payroll · July", meta: "14 employees · Jul 18", amount: "−$41,200.00", credit: false, icon: IconPerson },
  { party: "Northbeam Co.", meta: "Payment link · Jul 17", amount: "+$6,750.00", credit: true, icon: IconArrowUpCircle },
];

export default function TransactionsCompact() {
  return (
    <div className="card elev-sm p-[16px_18px] gap-2.5">
      <div className="flex items-baseline">
        <div className="card-title text-sm">Recent transactions</div>
        <a href="#" className="btn btn-ghost text-[11.5px] ml-auto">View all</a>
      </div>
      <div className="flex flex-col">
        {rows.map((r) => (
          <div key={r.party + r.meta} className="flex items-center gap-2.5 py-2">
            <span
              className="w-7 h-7 rounded-[9px] grid place-items-center flex-none"
              style={
                r.credit
                  ? { background: "var(--color-accent-900)", color: "var(--color-accent-300)" }
                  : { background: "var(--color-neutral-900)", color: "var(--color-neutral-400)" }
              }
            >
              <r.icon size={13} />
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-[12.5px] truncate">{r.party}</div>
              <div className="text-[10.5px] text-[var(--color-neutral-500)]">{r.meta}</div>
            </div>
            <span className="text-[12px]" style={{ color: r.credit ? "var(--color-accent-300)" : "var(--color-neutral-400)" }}>
              {r.amount}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
