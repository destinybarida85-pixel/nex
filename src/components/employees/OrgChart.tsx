import { departments } from "./directory";

export default function OrgChart() {
  return (
    <div className="card elev-sm p-[24px_20px] flex flex-col items-center gap-0">
      <div className="card-title text-[13px] self-start mb-5">Organization chart</div>

      <div
        className="flex items-center gap-2.5 rounded-xl px-4 py-2.5"
        style={{ background: "var(--color-accent-900)", boxShadow: "var(--shadow-sm)" }}
      >
        <span
          className="w-7 h-7 rounded-full grid place-items-center text-[11px] font-semibold flex-none"
          style={{ background: "var(--color-accent-500)", color: "var(--color-accent-100)" }}
        >
          A
        </span>
        <div>
          <div className="text-[12.5px] font-medium">Amara Osei</div>
          <div className="text-[10.5px] text-[var(--color-neutral-400)]">CEO &amp; Founder</div>
        </div>
      </div>

      <div className="w-px h-6" style={{ background: "var(--color-divider)" }} />

      <div className="relative w-full">
        <div
          className="absolute top-0 left-[12.5%] right-[12.5%] h-px"
          style={{ background: "var(--color-divider)" }}
        />
        <div className="flex justify-center gap-6 pt-6 flex-wrap">
          {departments.map((d) => (
            <div key={d.name} className="flex flex-col items-center gap-0 w-[130px]">
              <div className="w-px h-4" style={{ background: "var(--color-divider)" }} />
              <div className="card elev-sm gap-1.5 p-3 w-full items-center text-center">
                <span
                  className="w-7 h-7 rounded-full grid place-items-center text-[11px] font-medium"
                  style={{ background: "var(--color-neutral-800)", color: "var(--color-neutral-300)" }}
                >
                  {d.initial}
                </span>
                <div className="text-[12px] font-medium">{d.name}</div>
                <div className="text-[10px] text-[var(--color-neutral-500)]">{d.head}</div>
                <span className="tag tag-neutral text-[9px]">{d.count} reports</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
