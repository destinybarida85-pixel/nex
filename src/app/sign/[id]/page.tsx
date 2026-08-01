"use client";

import { use, useEffect, useState } from "react";
import { IconLogoMark, IconCheckCircle } from "@/components/icons";
import SignFlow from "@/components/sign/SignFlow";
import DocumentPaper from "@/components/document/DocumentPaper";
import type { SignDocument } from "@/components/sign/document";
import { documentAccents, type DocumentLayout } from "@/components/document/theme";

type FetchedDoc = {
  title: string;
  text: string;
  sections: { heading: string; text: string }[] | null;
  layout: DocumentLayout | null;
  accentColor: string | null;
  logoUrl: string | null;
  status: string;
};

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-[var(--color-neutral-900)] flex flex-col items-center py-12 px-4 overflow-hidden">
      <div className="nx-grid-bg absolute inset-0 pointer-events-none" />
      <div className="relative flex items-center gap-2.5 mb-8">
        <IconLogoMark size={26} />
        <span className="font-medium text-[16px] text-[var(--color-text)]">Origin</span>
        <span className="text-[12px] text-[var(--color-neutral-500)] ml-1">e-signature</span>
      </div>
      {children}
    </div>
  );
}

export default function SignByIdPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [doc, setDoc] = useState<FetchedDoc | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/documents/${id}/public`)
      .then((r) => r.json())
      .then((data) => {
        if (!data.configured || !data.document) {
          setNotFound(true);
          return;
        }
        setDoc(data.document);
      })
      .catch(() => setNotFound(true));
  }, [id]);

  if (notFound) {
    return (
      <Shell>
        <div className="relative w-full max-w-[440px] mt-8 p-8 rounded-2xl bg-[var(--color-bg)] text-[var(--color-text)] text-center" style={{ boxShadow: "var(--shadow-lg)" }}>
          <div className="text-[16px] font-medium">This link isn&rsquo;t available.</div>
          <div className="text-[12.5px] text-[var(--color-neutral-500)] mt-1.5">
            The document may have been removed, or the link is incomplete.
          </div>
        </div>
      </Shell>
    );
  }

  if (!doc) {
    return <Shell><div /></Shell>;
  }

  const signDocument: SignDocument = {
    title: doc.title,
    sentBy: "",
    signerName: "",
    signerEmail: "",
    sections: doc.sections && doc.sections.length > 0 ? doc.sections : [{ heading: "", text: doc.text }],
    logoUrl: doc.logoUrl,
    accentColor: doc.accentColor || documentAccents[0].color,
    layout: doc.layout || "classic",
  };

  if (doc.status === "signed") {
    return (
      <Shell>
        <div className="relative w-full max-w-[440px] mt-8 flex flex-col gap-5 items-center text-center">
          <span
            className="w-14 h-14 rounded-full grid place-items-center"
            style={{ color: "var(--color-accent)", background: "color-mix(in srgb, var(--color-accent-900) 65%, transparent)" }}
          >
            <IconCheckCircle size={30} />
          </span>
          <div>
            <h4 className="m-0 text-[18px] text-[var(--color-text)]">Already signed</h4>
            <div className="text-[12.5px] text-[var(--color-neutral-500)] mt-1.5 max-w-[320px]">
              This document has already been signed and sealed. It can&rsquo;t be signed again from this link.
            </div>
          </div>
          <div className="rounded-xl overflow-hidden w-full">
            <DocumentPaper
              title={signDocument.title}
              sections={signDocument.sections}
              accentColor={signDocument.accentColor!}
              layout={signDocument.layout}
              logoUrl={signDocument.logoUrl}
            />
          </div>
        </div>
      </Shell>
    );
  }

  return <SignFlow document={signDocument} documentId={id} />;
}
