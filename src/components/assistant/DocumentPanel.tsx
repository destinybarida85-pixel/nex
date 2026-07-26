"use client";

import { useEffect, useRef, useState } from "react";
import { IconDocuments, IconDownload, IconESign, IconCamera } from "@/components/icons";
import { SIGN_DOCUMENT_STORAGE_KEY } from "@/components/sign/document";
import DocumentPaper from "@/components/document/DocumentPaper";
import { documentAccents } from "@/components/document/theme";

export type DocumentStep = { label: string; done: boolean };
export type DocumentData = {
  title: string;
  meta: string;
  status: string;
  statusTag: string;
  body: { heading: string; text: string }[];
  steps: DocumentStep[];
};

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function DocumentPanel({
  document,
  onUpdate,
}: {
  document: DocumentData;
  onUpdate: (next: DocumentData) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<DocumentData>(document);
  const [accentColor, setAccentColor] = useState(documentAccents[0].color);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

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

  async function handleLogoFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    setLogoUrl(await readAsDataUrl(file));
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
        {editing ? (
          <div
            className="flex-1 min-w-0 max-w-[620px] rounded-xl p-6 md:p-9 flex flex-col gap-5"
            style={{ background: "#ffffff", boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 12px 32px -18px rgba(0,0,0,0.18)" }}
          >
            <div className="text-center pt-1">
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
            </div>
            <div className="hr" style={{ borderColor: "rgba(0,0,0,0.1)" }} />
            {draft.body.map((section, i) => (
              <div key={i} className="min-w-0">
                <input
                  className="input text-[13px] mb-1.5 font-medium"
                  style={{ color: accentColor }}
                  value={section.heading}
                  onChange={(e) => updateSection(i, "heading", e.target.value)}
                />
                <textarea
                  className="input text-[13px] leading-[1.7]"
                  style={{ minHeight: 90 }}
                  value={section.text}
                  onChange={(e) => updateSection(i, "text", e.target.value)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 min-w-0 max-w-[620px] print-area">
            <DocumentPaper title={shown.title} meta={shown.meta} sections={shown.body} accentColor={accentColor} logoUrl={logoUrl} />
          </div>
        )}

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

          <div className="card elev-sm gap-2.5 p-4 no-print">
            <div className="card-title text-[13px]">Document style</div>
            <div className="flex items-center gap-1.5">
              {documentAccents.map((a) => (
                <button
                  key={a.id}
                  aria-label={a.label}
                  onClick={() => setAccentColor(a.color)}
                  className="w-[18px] h-[18px] rounded-md cursor-pointer"
                  style={{ background: a.color, outline: accentColor === a.color ? "2px solid var(--color-text)" : "none", outlineOffset: 2 }}
                />
              ))}
            </div>
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[11px] text-[var(--color-neutral-500)] flex-1">{logoUrl ? "Logo added" : "No letterhead logo (optional)"}</span>
              <button className="btn btn-secondary text-[10.5px] flex-none" onClick={() => logoInputRef.current?.click()}>
                <IconCamera size={11} />
                {logoUrl ? "Replace" : "Add"}
              </button>
              <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoFile} />
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
