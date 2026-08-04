"use client";

import { useState } from "react";
import { IconLogoMark } from "@/components/icons";
import SignStepper from "./SignStepper";
import ReviewStep from "./ReviewStep";
import SignStep from "./SignStep";
import CompleteStep from "./CompleteStep";
import { canonicalDocumentText, type SignDocument } from "./document";
import { documentAccents, type DocumentLayout } from "@/components/document/theme";

export type SignatureProof = {
  certificateId: string;
  recordHash: string;
  documentHash: string;
  signedAt: string;
  persisted: boolean;
  stampApplied: boolean;
  stampCreditsRemaining: number | null;
  signersRequired?: number;
  signaturesSoFar?: number;
  complete?: boolean;
  signatureRecordId?: string | null;
};

export type SignPayment = { title: string; amountCents: number; currency: string; url: string };

// The real, shareable signing flow. Used both by the generic /sign route
// (a same-tab demo/preview against sessionStorage, no real document behind
// it) and /sign/[id] (a real persisted document anyone with the link can
// open). documentId is what tells /api/sign to update that exact row
// instead of falling back to matching by title+content.
export default function SignFlow({
  document,
  documentId,
  signersRequired = 1,
  alreadySigned = [],
  payment = null,
}: {
  document: SignDocument;
  documentId?: string;
  signersRequired?: number;
  alreadySigned?: { name: string; at: string }[];
  payment?: SignPayment | null;
}) {
  const [step, setStep] = useState(1);
  const [signature, setSignature] = useState("");
  const [signerFullName, setSignerFullName] = useState("");
  const [proof, setProof] = useState<SignatureProof | null>(null);
  const [sealing, setSealing] = useState(false);
  const [requireSignature, setRequireSignature] = useState(true);
  const [applyStamp, setApplyStamp] = useState(true);
  const [accentColor, setAccentColor] = useState(document.accentColor || documentAccents[0].color);
  const [layout, setLayout] = useState<DocumentLayout>(document.layout || "classic");

  function skipToComplete() {
    setSignature("");
    setProof(null);
    setStep(3);
  }

  async function completeSigning(sig: string, fullName: string) {
    setSignature(sig);
    setSignerFullName(fullName);
    setStep(3);
    setSealing(true);
    try {
      const res = await fetch("/api/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentId,
          documentTitle: document.title,
          documentContent: canonicalDocumentText(document),
          signerName: fullName || document.signerName,
          signerEmail: document.signerEmail,
          signatureData: sig,
          skipStamp: !applyStamp,
        }),
      });
      const data = await res.json();
      if (res.ok) setProof(data);
    } catch {
      // Network/API failure: CompleteStep falls back to showing the signature
      // itself without a certificate, rather than a broken or fake one.
    } finally {
      setSealing(false);
    }
  }

  return (
    <div className="relative min-h-screen bg-[var(--color-neutral-900)] flex flex-col items-center py-12 px-4 overflow-hidden">
      <div className="nx-grid-bg absolute inset-0 pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(720px 420px at 50% -8%, color-mix(in srgb, var(--color-accent) 16%, transparent), transparent)" }}
      />

      <div className="relative flex items-center gap-2.5 mb-8">
        <IconLogoMark size={26} />
        <span className="font-medium text-[16px] text-[var(--color-text)]">Primue</span>
        <span className="text-[13px] text-[var(--color-neutral-500)] ml-1">e-signature</span>
        <a href="/signatures" className="text-[13px] ml-3 no-underline" style={{ color: "var(--color-accent-300)" }}>
          View history →
        </a>
      </div>

      <div className="relative">
        <SignStepper current={step} skippedSigning={!requireSignature} />
      </div>

      {signersRequired > 1 && (
        <div
          className="relative w-full max-w-[440px] mt-6 px-4 py-3 rounded-xl text-[13px] flex flex-col gap-1"
          style={{ background: "var(--color-surface)", border: "1px solid var(--color-divider)" }}
        >
          <div className="font-medium text-[var(--color-text)]">
            This document needs {signersRequired} signatures.
          </div>
          {alreadySigned.length === 0 ? (
            <div style={{ color: "var(--color-neutral-500)" }}>
              You&rsquo;re the first to sign. The other party signs from this same link afterwards.
            </div>
          ) : (
            <div style={{ color: "var(--color-neutral-500)" }}>
              Already signed by {alreadySigned.map((s) => s.name).join(", ")}. Yours is signature{" "}
              {alreadySigned.length + 1} of {signersRequired}.
            </div>
          )}
        </div>
      )}

      <div
        className="relative w-full max-w-[440px] mt-8 p-8 rounded-2xl bg-[var(--color-bg)] text-[var(--color-text)]"
        style={{ boxShadow: "var(--shadow-lg), 0 40px 80px -30px color-mix(in srgb, var(--color-accent) 25%, transparent)" }}
      >
        {step === 1 && (
          <ReviewStep
            document={document}
            requireSignature={requireSignature}
            onRequireSignatureChange={setRequireSignature}
            applyStamp={applyStamp}
            onApplyStampChange={setApplyStamp}
            accentColor={accentColor}
            onAccentColorChange={setAccentColor}
            layout={layout}
            onLayoutChange={setLayout}
            onContinue={() => (requireSignature ? setStep(2) : skipToComplete())}
          />
        )}
        {step === 2 && <SignStep documentTitle={document.title} onContinue={completeSigning} onBack={() => setStep(1)} />}
        {step === 3 && (
          <CompleteStep
            document={document}
            signature={signature}
            signerName={signerFullName || document.signerName}
            proof={proof}
            sealing={sealing}
            signed={requireSignature}
            applyStamp={applyStamp}
            accentColor={accentColor}
            layout={layout}
          />
        )}
      </div>

      {payment && step === 3 && (
        <div
          className="relative w-full max-w-[440px] mt-5 p-5 rounded-2xl flex flex-col gap-3"
          style={{ background: "var(--color-bg)", boxShadow: "var(--shadow-lg)" }}
        >
          <div>
            <div className="text-[14px] font-medium text-[var(--color-text)]">Payment due</div>
            <div className="text-[13px] mt-0.5" style={{ color: "var(--color-neutral-500)" }}>
              {payment.title}
            </div>
          </div>
          <div className="text-[24px] font-medium text-[var(--color-text)]">
            {new Intl.NumberFormat("en-US", { style: "currency", currency: payment.currency.toUpperCase() }).format(
              payment.amountCents / 100
            )}
          </div>
          <a href={payment.url} className="btn btn-primary btn-block text-[14px]">
            Pay securely
          </a>
          <div className="text-[10.5px] text-center" style={{ color: "var(--color-neutral-600)" }}>
            Processed by Stripe. Your card details are never shared with the sender.
          </div>
        </div>
      )}

      <div className="relative text-[11px] text-[var(--color-neutral-600)] mt-6 flex items-center gap-2">
        Protected by tamper-evident hash-chained signatures · Audit trail retained for 7 years
      </div>
    </div>
  );
}
