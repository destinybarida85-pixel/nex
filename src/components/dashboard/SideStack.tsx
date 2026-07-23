import { IconSparkle } from "@/components/icons";

const signatures = [
  { label: "MSA · Halcyon Ventures", status: "Viewed", tag: "tag-outline", dot: "var(--color-accent)" },
  { label: "NDA · Northbeam Co.", status: "Sent", tag: "tag-neutral", dot: "var(--color-neutral-600)" },
  { label: "Offer letter · D. Osei", status: "Draft", tag: "tag-neutral", dot: "var(--color-neutral-600)" },
];

const agenda = [
  { time: "10:30", label: "Payroll approval: July run closes at noon" },
  { time: "14:00", label: "Client review: Halcyon Q3 scope" },
  { time: "16:30", label: "Interview: Senior PM candidate" },
];

export default function SideStack() {
  return (
    <div className="flex flex-col gap-3.5">
      <div
        className="card elev-sm p-[16px_18px] gap-2.5 border"
        style={{ borderColor: "color-mix(in srgb, var(--color-accent) 35%, transparent)" }}
      >
        <div className="flex items-center gap-2">
          <IconSparkle size={15} className="text-[var(--color-accent)]" />
          <div className="card-title text-sm">Origin AI</div>
          <span className="card-meta ml-auto">2 suggestions</span>
        </div>
        <div
          className="text-[12.5px] leading-[1.5] text-[var(--color-neutral-300)] px-3 py-2.5 rounded-lg"
          style={{ background: "color-mix(in srgb, var(--color-accent-900) 45%, transparent)" }}
        >
          Invoice #INV-2038 is 6 days overdue. Draft a polite reminder to Figment Design?
        </div>
        <div
          className="text-[12.5px] leading-[1.5] text-[var(--color-neutral-300)] px-3 py-2.5 rounded-lg"
          style={{ background: "color-mix(in srgb, var(--color-accent-900) 45%, transparent)" }}
        >
          Software spend rose 22% this quarter. Generate a cost-review report?
        </div>
        <a href="/assistant" className="btn btn-primary btn-block text-[12.5px] mt-0.5">Ask Origin AI</a>
      </div>

      <div className="card elev-sm p-[16px_18px] gap-2.5">
        <div className="flex items-baseline">
          <div className="card-title text-sm">Pending signatures</div>
          <span className="card-meta ml-auto">3 open</span>
        </div>
        {signatures.map((s) => (
          <div key={s.label} className="flex items-center gap-2.5 text-[12.5px]">
            <span className="w-[7px] h-[7px] rounded-full flex-none" style={{ background: s.dot }} />
            <span className="flex-1">{s.label}</span>
            <span className={`tag ${s.tag} text-[10px]`}>{s.status}</span>
          </div>
        ))}
      </div>

      <div className="card elev-sm p-[16px_18px] gap-2.5">
        <div className="flex items-baseline">
          <div className="card-title text-sm">Today</div>
          <span className="card-meta ml-auto">Jul 21</span>
        </div>
        {agenda.map((a) => (
          <div key={a.time} className="flex gap-2.5 text-[12.5px]">
            <span className="font-mono text-[11px] text-[var(--color-accent-300)] flex-none pt-[1px]">{a.time}</span>
            <span>{a.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
