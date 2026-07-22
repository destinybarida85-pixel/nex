import { IconCheckCircle, IconLock, IconDownload } from "@/components/icons";
import Stamp from "./Stamp";

const audit = [
  { label: "Drafted", meta: "Jul 18, 2026 · 09:14" },
  { label: "Sent to signer", meta: "Jul 18, 2026 · 09:16" },
  { label: "Viewed by Halcyon Ventures", meta: "Jul 21, 2026 · 08:42" },
  { label: "Identity verified · OTP", meta: "Jul 21, 2026 · 08:44" },
  { label: "Signed & sealed", meta: "Jul 21, 2026 · 08:45" },
];

export default function CompleteStep({ signature }: { signature: string }) {
  return (
    <div className="flex flex-col items-center gap-5 text-center">
      <span
        className="w-14 h-14 rounded-full grid place-items-center"
        style={{ color: "var(--color-accent)", background: "color-mix(in srgb, var(--color-accent-900) 65%, transparent)" }}
      >
        <IconCheckCircle size={30} />
      </span>
      <div>
        <h4 className="m-0 text-[19px]">Document signed and sealed</h4>
        <div className="text-[12.5px] text-[var(--color-neutral-500)] mt-1.5 max-w-[320px]">
          MSA — Halcyon Ventures has been signed by all parties and sealed with a tamper-evident certificate.
        </div>
      </div>

      <div className="print-area w-full flex flex-col gap-5 items-center text-center" style={{ padding: 4 }}>
        <div className="card elev-sm w-full text-left gap-2.5 p-4 relative overflow-visible">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col gap-2.5 flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <IconLock size={13} className="text-[var(--color-accent)]" />
                <span className="text-[12px] font-mono text-[var(--color-neutral-400)]">
                  Certificate ID: NX-CERT-8F21-40A9
                </span>
              </div>
              {signature.startsWith("data:") ? (
                <img src={signature} alt="Signature" className="h-10 self-start" />
              ) : (
                <span style={{ fontFamily: "cursive", fontSize: 22 }}>{signature}</span>
              )}
            </div>
            <div className="flex-none -mt-2 -mr-1">
              <Stamp label="SEALED" sub="NEX E-SIGN" />
            </div>
          </div>
        </div>

        <div className="card elev-sm w-full text-left gap-2.5 p-4">
          <div className="card-title text-[13px]">Audit trail</div>
          <div className="flex flex-col gap-2.5 mt-1">
            {audit.map((a) => (
              <div key={a.label} className="flex items-center gap-2.5 text-[12px]">
                <span className="w-[7px] h-[7px] rounded-full flex-none" style={{ background: "var(--color-accent)" }} />
                <span className="flex-1">{a.label}</span>
                <span className="text-[var(--color-neutral-500)] font-mono text-[10.5px]">{a.meta}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button className="btn btn-primary btn-block" onClick={() => window.print()}>
        <IconDownload size={14} />
        Print / Save as PDF
      </button>
      <a href="/dashboard" className="btn btn-secondary btn-block" style={{ marginTop: 0 }}>
        Back to dashboard
      </a>
    </div>
  );
}
