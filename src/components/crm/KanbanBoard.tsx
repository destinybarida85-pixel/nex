"use client";

import { stages, type Deal, type Stage } from "./deals";

const stageAccent: Record<Stage, boolean> = {
  Lead: false,
  Qualified: false,
  Proposal: false,
  Negotiation: false,
  Won: true,
};

function DealCard({ deal }: { deal: Deal }) {
  return (
    <div
      draggable
      onDragStart={(e) => e.dataTransfer.setData("text/plain", deal.id)}
      className="card elev-sm gap-2 p-3 cursor-grab active:cursor-grabbing"
    >
      <div className="text-[12.5px] font-medium">{deal.company}</div>
      <div className="text-[11.5px] text-[var(--color-neutral-400)]">{deal.title}</div>
      <div className="flex items-center justify-between mt-1">
        <span className="text-[13px] font-medium" style={{ color: "var(--color-accent-300)" }}>{deal.value}</span>
        <span className="text-[10.5px] text-[var(--color-neutral-500)]">{deal.contact}</span>
      </div>
      {deal.notes && (
        <div className="text-[10.5px] text-[var(--color-neutral-500)] line-clamp-2">{deal.notes}</div>
      )}
      {deal.days > 0 && (
        <span className="tag tag-neutral text-[9.5px] self-start">{deal.days}d in stage</span>
      )}
    </div>
  );
}

export default function KanbanBoard({
  deals,
  dragOverStage,
  onDragOver,
  onDragLeave,
  onDrop,
}: {
  deals: Deal[];
  dragOverStage: Stage | null;
  onDragOver: (stage: Stage) => void;
  onDragLeave: () => void;
  onDrop: (id: string, stage: Stage) => void;
}) {
  return (
    <div className="flex gap-3.5 overflow-x-auto pb-2">
      {stages.map((stage) => {
        const stageDeals = deals.filter((d) => d.stage === stage);
        const total = stageDeals.reduce((sum, d) => sum + Number(d.value.replace(/[^0-9.]/g, "")), 0);
        return (
          <div
            key={stage}
            onDragOver={(e) => {
              e.preventDefault();
              onDragOver(stage);
            }}
            onDragLeave={onDragLeave}
            onDrop={(e) => {
              e.preventDefault();
              const id = e.dataTransfer.getData("text/plain");
              onDrop(id, stage);
            }}
            className="w-[240px] flex-none flex flex-col gap-2.5 rounded-xl p-2.5"
            style={{
              background: dragOverStage === stage ? "color-mix(in srgb, var(--color-accent-900) 35%, transparent)" : "transparent",
              outline: dragOverStage === stage ? "1px dashed var(--color-accent)" : "1px solid transparent",
            }}
          >
            <div className="flex items-center gap-2 px-1">
              <span
                className="text-[12px] font-medium"
                style={stageAccent[stage] ? { color: "var(--color-accent-300)" } : undefined}
              >
                {stage}
              </span>
              <span className="tag tag-neutral text-[9.5px] ml-auto">{stageDeals.length}</span>
            </div>
            <div className="text-[10.5px] text-[var(--color-neutral-500)] px-1 -mt-1.5">
              ${total.toLocaleString()}
            </div>
            <div className="flex flex-col gap-2 min-h-[60px]">
              {stageDeals.map((deal) => (
                <DealCard key={deal.id} deal={deal} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
