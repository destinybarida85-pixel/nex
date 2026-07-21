import { webhookEvents } from "./data";
import { IconActivity } from "@/components/icons";

export default function WebhookLog() {
  return (
    <div className="card elev-sm p-[16px_18px] gap-2.5">
      <div className="flex items-center gap-2">
        <IconActivity size={14} className="text-[var(--color-accent)]" />
        <div className="card-title text-sm">Webhook events</div>
      </div>
      <div className="flex flex-col">
        {webhookEvents.map((w) => (
          <div key={w.event + w.time} className="flex items-center gap-3 py-2 text-[12px]">
            <span className="font-mono" style={{ color: "var(--color-accent-300)" }}>{w.event}</span>
            <span className="text-[var(--color-neutral-500)] font-mono truncate flex-1 min-w-0">{w.endpoint}</span>
            <span
              className="tag text-[9.5px]"
              style={
                w.code >= 400
                  ? { border: "1px solid var(--color-accent)", color: "var(--color-accent)" }
                  : { background: "var(--color-neutral-800)", color: "var(--color-neutral-300)" }
              }
            >
              {w.code}
            </span>
            <span className="text-[var(--color-neutral-500)] font-mono text-[10.5px] flex-none">{w.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
