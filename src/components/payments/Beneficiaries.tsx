import { beneficiaries } from "./data";
import { IconPlus } from "@/components/icons";

export default function Beneficiaries() {
  return (
    <div className="card elev-sm p-[16px_18px] gap-2.5">
      <div className="flex items-baseline">
        <div className="card-title text-sm">Beneficiaries</div>
        <button className="btn btn-ghost text-[11.5px] ml-auto">
          <IconPlus size={12} />
          Add
        </button>
      </div>
      <div className="flex flex-col">
        {beneficiaries.map((b) => (
          <div key={b.name} className="flex items-center gap-2.5 py-2">
            <span
              className="w-7 h-7 rounded-[9px] grid place-items-center text-[11px] font-medium flex-none"
              style={{ background: "var(--color-neutral-800)", color: "var(--color-neutral-300)" }}
            >
              {b.name.charAt(0)}
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-[12.5px] truncate">{b.name}</div>
              <div className="text-[10.5px] text-[var(--color-neutral-500)]">{b.bank}</div>
            </div>
            <span className="font-mono text-[11px] text-[var(--color-neutral-500)]">{b.account}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
