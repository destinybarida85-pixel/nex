import { IconCheckCircle } from "@/components/icons";

const steps = ["Review", "Verify", "Sign", "Complete"];

export default function SignStepper({ current, skippedSigning }: { current: number; skippedSigning?: boolean }) {
  return (
    <div className="flex items-center gap-2 max-w-[420px] mx-auto w-full">
      {steps.map((label, i) => {
        const index = i + 1;
        const skipped = skippedSigning && (index === 2 || index === 3);
        const done = index < current && !skipped;
        const active = index === current;
        return (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5 flex-none">
              <span
                className="w-6 h-6 rounded-full grid place-items-center flex-none"
                style={
                  skipped
                    ? { border: "1.5px dashed var(--color-divider)", color: "var(--color-neutral-700)" }
                    : done
                    ? { color: "var(--color-accent)" }
                    : active
                    ? { border: "1.5px solid var(--color-accent)", color: "var(--color-accent-300)" }
                    : { border: "1.5px solid var(--color-divider)", color: "var(--color-neutral-600)" }
                }
              >
                {done ? <IconCheckCircle size={16} /> : <span className="text-[11px]">{index}</span>}
              </span>
              <span
                className="text-[10.5px]"
                style={{ color: skipped ? "var(--color-neutral-700)" : active || done ? "var(--color-text)" : "var(--color-neutral-600)" }}
              >
                {skipped ? "Skipped" : label}
              </span>
            </div>
            {index < steps.length && (
              <span
                className="h-px flex-1 mx-1 mb-[18px]"
                style={{ background: done ? "var(--color-accent)" : "var(--color-divider)" }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
