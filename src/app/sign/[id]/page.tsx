"use client";

import { use, useEffect, useState } from "react";
import { IconLogoMark, IconCheckCircle, IconDownload } from "@/components/icons";
import SignFlow from "@/components/sign/SignFlow";
import DocumentPaper from "@/components/document/DocumentPaper";
import SignatureBlock from "@/components/document/SignatureBlock";
import Stamp, { type StampShape } from "@/components/sign/Stamp";
import type { SignDocument } from "@/components/sign/document";
import { documentAccents, type DocumentLayout, type DocumentFont, type DocumentPaperTone } from "@/components/document/theme";

type StampRecord = {
  label: string;
  sub: string;
  shape: StampShape;
  color: string;
  position: "footer" | "header" | "custom";
  x: number;
  y: number;
  imageUrl: string | null;
};

type FetchedDoc = {
  title: string;
  text: string;
  sections: { heading: string; text: string }[] | null;
  layout: DocumentLayout | null;
  font: DocumentFont | null;
  tone: DocumentPaperTone | null;
  organisation: string | null;
  accentColor: string | null;
  logoUrl: string | null;
  watermarkUrl: string | null;
  status: string;
  createdAt: string;
  signersRequired: number;
  signedBy: { name: string; at: string; signatureImage: string | null; stamp: StampRecord | null }[];
  payment: { title: string; amountCents: number; currency: string; url: string } | null;
};

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-[var(--color-neutral-900)] flex flex-col items-center py-12 px-4 overflow-hidden">
      <div className="nx-grid-bg absolute inset-0 pointer-events-none no-print" />
      <div className="relative flex items-center gap-2.5 mb-8 no-print">
        <IconLogoMark size={26} />
        <span className="font-medium text-[16px] text-[var(--color-text)]">Primue</span>
        <span className="text-[13px] text-[var(--color-neutral-500)] ml-1">e-signature</span>
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
          <div className="text-[13.5px] text-[var(--color-neutral-500)] mt-1.5">
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
    watermarkUrl: doc.watermarkUrl,
    accentColor: doc.accentColor || documentAccents[0].color,
    layout: doc.layout || "classic",
    font: doc.font || "auto",
    tone: doc.tone || "white",
    organisation: doc.organisation,
    createdAt: doc.createdAt,
  };

  // Only a fully-signed document is closed. A two-party document that one side
  // has already signed stays open — that's the whole point of the second slot.
  const signedCount = doc.signedBy?.length ?? 0;
  const stillOpen = signedCount < (doc.signersRequired ?? 1);

  if (doc.status === "signed" || !stillOpen) {
    // The most recent signer is what's shown — the same one whose signing
    // session created this document's stamp. Older code rendered a plain,
    // unsigned DocumentPaper here with no signature or stamp at all: the
    // visual proof only ever lived in that signer's own browser tab
    // (CompleteStep's React state), so reopening this link later — or even
    // just reloading — showed a document that looked never signed, despite
    // genuinely being signed and sealed. See migration 0018: signature_image
    // and stamp are now saved server-side specifically so this view can
    // reconstruct them.
    const lastSigner = doc.signedBy[doc.signedBy.length - 1];
    const stamp = lastSigner?.stamp;
    const stampNode =
      stamp && stamp.label ? (
        <Stamp label={stamp.label} sub={stamp.sub} color={stamp.color} imageUrl={stamp.imageUrl} size={72} shape={stamp.shape} />
      ) : null;
    const signatureNode = lastSigner?.signatureImage ? (
      <SignatureBlock
        signature={lastSigner.signatureImage}
        signerName={lastSigner.name}
        dateLabel={new Date(lastSigner.at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
      />
    ) : null;
    const headerStamp = stamp?.position === "header" ? stampNode : null;
    const footerStamp = stamp?.position === "footer" || !stamp ? stampNode : null;
    const overlayStamp =
      stamp?.position === "custom" && stampNode ? (
        <div style={{ position: "absolute", left: `${stamp.x}%`, top: `${stamp.y}%`, transform: "translate(-50%, -50%)" }}>{stampNode}</div>
      ) : null;
    const footerSlot =
      signatureNode || footerStamp ? (
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>{signatureNode}</div>
          {footerStamp}
        </div>
      ) : undefined;

    return (
      <Shell>
        <div className="relative w-full max-w-[440px] mt-8 flex flex-col gap-5 items-center text-center">
          <span
            className="w-14 h-14 rounded-full grid place-items-center no-print"
            style={{ color: "var(--color-accent)", background: "color-mix(in srgb, var(--color-accent-900) 65%, transparent)" }}
          >
            <IconCheckCircle size={30} />
          </span>
          <div className="no-print">
            <h4 className="m-0 text-[18px] text-[var(--color-text)]">Already signed</h4>
            <div className="text-[13.5px] text-[var(--color-neutral-500)] mt-1.5 max-w-[320px]">
              This document has already been signed and sealed. It can&rsquo;t be signed again from this link.
            </div>
          </div>
          <div className="rounded-xl overflow-hidden w-full print-area">
            <DocumentPaper
              title={signDocument.title}
              sections={signDocument.sections}
              accentColor={signDocument.accentColor!}
              layout={signDocument.layout}
              font={signDocument.font}
              tone={signDocument.tone}
              organisation={signDocument.organisation ?? undefined}
              logoUrl={signDocument.logoUrl}
              watermarkUrl={signDocument.watermarkUrl}
              headerRight={headerStamp}
              footerSlot={footerSlot}
              overlay={overlayStamp}
            />
          </div>
          <button className="btn btn-primary btn-block no-print" onClick={() => window.print()}>
            <IconDownload size={14} />
            Print / Save as PDF
          </button>
        </div>
      </Shell>
    );
  }

  return (
    <SignFlow
      document={signDocument}
      documentId={id}
      signersRequired={doc.signersRequired ?? 1}
      alreadySigned={doc.signedBy ?? []}
      payment={doc.payment}
    />
  );
}
