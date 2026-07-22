import { IconDocuments, IconDownload, IconESign, IconLogoMark } from "@/components/icons";

export type DocumentStep = { label: string; done: boolean };
export type DocumentData = {
  title: string;
  meta: string;
  status: string;
  statusTag: string;
  body: { heading: string; text: string }[];
  steps: DocumentStep[];
};

export default function DocumentPanel({ document }: { document: DocumentData }) {
  return (
    <div className="flex-1 min-w-0 flex flex-col">
      <div className="flex items-center gap-3 px-4 md:px-6 py-4 border-b border-[var(--color-divider)] flex-wrap">
        <IconDocuments size={16} className="text-[var(--color-accent)]" />
        <div>
          <div className="card-title text-[15px]">{document.title}</div>
          <div className="card-meta">{document.meta}</div>
        </div>
        <span className={`tag ${document.statusTag} ml-auto`}>{document.status}</span>
        <button className="btn btn-icon btn-secondary" aria-label="Print document" onClick={() => window.print()}>
          <IconDownload size={14} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6 flex flex-col md:flex-row gap-6">
        <div
          className="flex-1 min-w-0 max-w-[620px] rounded-xl p-5 md:p-8 flex flex-col gap-5 print-area"
          style={{ background: "var(--color-surface)", boxShadow: "var(--shadow-sm)" }}
        >
          <div className="flex items-center gap-2.5">
            <IconLogoMark size={26} />
            <div className="text-[11px] tracking-[.08em] uppercase text-[var(--color-neutral-500)]">Nex Inc. · Document</div>
          </div>
          <div className="text-center pt-1">
            <h3 className="text-[19px] m-0">{document.title}</h3>
            <div className="text-[12px] text-[var(--color-neutral-500)] mt-1">{document.meta}</div>
          </div>
          <div className="hr" />
          {document.body.map((section) => (
            <div key={section.heading}>
              <h5 className="text-[13px] tracking-[0.02em] mb-1.5" style={{ color: "var(--color-accent-300)" }}>
                {section.heading}
              </h5>
              <p className="text-[13px] leading-[1.7] text-[var(--color-neutral-300)] m-0">{section.text}</p>
            </div>
          ))}
          <div className="hr" />
          <div>
            <h5 className="text-[13px] tracking-[0.02em] mb-3" style={{ color: "var(--color-accent-300)" }}>
              Signatures
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {["Party A", "Party B"].map((party) => (
                <div key={party} className="flex flex-col gap-1">
                  <div className="h-8 border-b border-[var(--color-divider)]" />
                  <div className="text-[11px] text-[var(--color-neutral-500)]">{party} signature</div>
                  <div className="text-[10px] text-[var(--color-neutral-600)] mt-2">Date: ______________</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full md:w-[220px] flex-none flex flex-col gap-4">
          <div className="card elev-sm gap-2.5 p-4">
            <div className="card-title text-[13px]">Signing status</div>
            <div className="flex flex-col gap-2.5 mt-1">
              {document.steps.map((step, i) => (
                <div key={step.label} className="flex items-center gap-2.5 text-[12px]">
                  <span
                    className="w-[7px] h-[7px] rounded-full flex-none"
                    style={{ background: step.done ? "var(--color-accent)" : "var(--color-neutral-700)" }}
                  />
                  <span style={{ color: step.done ? "var(--color-text)" : "var(--color-neutral-500)" }}>{step.label}</span>
                  {i < document.steps.length - 1 && (
                    <span className="flex-1 h-px" style={{ background: "var(--color-divider)" }} />
                  )}
                </div>
              ))}
            </div>
          </div>
          <a href="/sign" className="btn btn-primary btn-block text-[12.5px]">
            <IconESign size={14} />
            Send for signature
          </a>
          <button className="btn btn-secondary btn-block text-[12.5px]">Edit document</button>
        </div>
      </div>
    </div>
  );
}
