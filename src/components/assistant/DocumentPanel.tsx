"use client";

import { useEffect, useState } from "react";
import { IconDocuments, IconDownload, IconESign, IconLogoMark } from "@/components/icons";
import { SIGN_DOCUMENT_STORAGE_KEY } from "@/components/sign/document";

export type DocumentStep = { label: string; done: boolean };
export type DocumentData = {
  title: string;
  meta: string;
  status: string;
  statusTag: string;
  body: { heading: string; text: string }[];
  steps: DocumentStep[];
};

export default function DocumentPanel({
  document,
  onUpdate,
}: {
  document: DocumentData;
  onUpdate: (next: DocumentData) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<DocumentData>(document);

  useEffect(() => {
    if (!editing) setDraft(document);
  }, [document, editing]);

  function startEditing() {
    setDraft(document);
    setEditing(true);
  }

  function saveEditing() {
    onUpdate(draft);
    setEditing(false);
  }

  function cancelEditing() {
    setDraft(document);
    setEditing(false);
  }

  function updateSection(index: number, field: "heading" | "text", value: string) {
    setDraft((prev) => ({
      ...prev,
      body: prev.body.map((section, i) => (i === index ? { ...section, [field]: value } : section)),
    }));
  }

  function sendForSignature() {
    try {
      sessionStorage.setItem(
        SIGN_DOCUMENT_STORAGE_KEY,
        JSON.stringify({
          title: document.title,
          sentBy: "Origin AI draft",
          signerName: "Signer",
          signerEmail: "signer@example.com",
          sections: document.body,
        })
      );
    } catch {
      // sessionStorage unavailable — /sign falls back to its own demo document.
    }
  }

  const shown = editing ? draft : document;

  return (
    <div className="flex-1 min-w-0 flex flex-col">
      <div className="flex items-center gap-3 px-4 md:px-6 py-4 border-b border-[var(--color-divider)] flex-wrap">
        <IconDocuments size={16} className="text-[var(--color-accent)]" />
        <div className="card-title text-[14px]">Document</div>
        <span className={`tag ${shown.statusTag} ml-auto`}>{editing ? "Editing" : shown.status}</span>
        <button className="btn btn-icon btn-secondary" aria-label="Print document" onClick={() => window.print()}>
          <IconDownload size={14} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6 flex flex-col md:flex-row gap-6">
        <div
          className="flex-1 min-w-0 max-w-[620px] rounded-xl p-6 md:p-9 flex flex-col gap-5 print-area"
          style={{ background: "#f4f4f2", boxShadow: "var(--shadow-sm)" }}
        >
          <div className="flex items-center gap-2.5">
            <IconLogoMark size={26} />
            <div className="text-[11px] tracking-[.08em] uppercase" style={{ color: "#6b6b76" }}>Origin Inc. · Document</div>
          </div>
          <div className="text-center pt-1">
            {editing ? (
              <>
                <input
                  className="input text-[19px] text-center font-medium"
                  style={{ background: "transparent", border: "none", color: "#181818" }}
                  value={draft.title}
                  onChange={(e) => setDraft((prev) => ({ ...prev, title: e.target.value }))}
                />
                <input
                  className="input text-[12px] text-center mt-1"
                  style={{ background: "transparent", border: "none", color: "#5a5a63" }}
                  value={draft.meta}
                  onChange={(e) => setDraft((prev) => ({ ...prev, meta: e.target.value }))}
                />
              </>
            ) : (
              <>
                <h3 className="text-[19px] m-0" style={{ color: "#181818", overflowWrap: "break-word" }}>{shown.title}</h3>
                <div className="text-[12px] mt-1" style={{ color: "#5a5a63", overflowWrap: "break-word" }}>{shown.meta}</div>
              </>
            )}
          </div>
          <div className="hr" style={{ borderColor: "rgba(0,0,0,0.1)" }} />
          {shown.body.map((section, i) => (
            <div key={i} className="min-w-0">
              {editing ? (
                <>
                  <input
                    className="input text-[13px] mb-1.5 font-medium"
                    style={{ color: "#5b4fb8" }}
                    value={section.heading}
                    onChange={(e) => updateSection(i, "heading", e.target.value)}
                  />
                  <textarea
                    className="input text-[13px] leading-[1.7]"
                    style={{ minHeight: 90 }}
                    value={section.text}
                    onChange={(e) => updateSection(i, "text", e.target.value)}
                  />
                </>
              ) : (
                <>
                  <h5 className="text-[13px] tracking-[0.02em] mb-1.5" style={{ color: "#5b4fb8" }}>
                    {section.heading}
                  </h5>
                  <p className="text-[13px] leading-[1.7] m-0" style={{ color: "#33333a", overflowWrap: "break-word", wordBreak: "break-word" }}>
                    {section.text}
                  </p>
                </>
              )}
            </div>
          ))}
          <div className="hr" style={{ borderColor: "rgba(0,0,0,0.1)" }} />
          <div>
            <h5 className="text-[13px] tracking-[0.02em] mb-3" style={{ color: "#5b4fb8" }}>
              Signatures
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {["Party A", "Party B"].map((party) => (
                <div key={party} className="flex flex-col gap-1">
                  <div className="h-8" style={{ borderBottom: "1px solid rgba(0,0,0,0.15)" }} />
                  <div className="text-[11px]" style={{ color: "#6b6b76" }}>{party} signature</div>
                  <div className="text-[10px] mt-2" style={{ color: "#8a8a94" }}>Date: ______________</div>
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

          {editing ? (
            <>
              <button className="btn btn-primary btn-block text-[12.5px]" onClick={saveEditing}>
                Save changes
              </button>
              <button className="btn btn-secondary btn-block text-[12.5px]" onClick={cancelEditing}>
                Cancel
              </button>
            </>
          ) : (
            <>
              <a href="/sign" className="btn btn-primary btn-block text-[12.5px]" onClick={sendForSignature}>
                <IconESign size={14} />
                Send for signature
              </a>
              <button className="btn btn-secondary btn-block text-[12.5px]" onClick={startEditing}>
                Edit document
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
