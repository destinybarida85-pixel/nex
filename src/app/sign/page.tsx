"use client";

import { useState } from "react";
import { IconLogoMark } from "@/components/icons";
import SignStepper from "@/components/sign/SignStepper";
import ReviewStep from "@/components/sign/ReviewStep";
import VerifyStep from "@/components/sign/VerifyStep";
import SignStep from "@/components/sign/SignStep";
import CompleteStep from "@/components/sign/CompleteStep";
import { demoDocument, canonicalDocumentText } from "@/components/sign/document";

export type SignatureProof = {
  certificateId: string;
  recordHash: string;
  documentHash: string;
  signedAt: string;
  persisted: boolean;
};

export default function SignPage() {
  const [step, setStep] = useState(1);
  const [signature, setSignature] = useState("");
  const [proof, setProof] = useState<SignatureProof | null>(null);
  const [sealing, setSealing] = useState(false);

  async function completeSigning(sig: string) {
    setSignature(sig);
    setStep(4);
    setSealing(true);
    try {
      const res = await fetch("/api/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentTitle: demoDocument.title,
          documentContent: canonicalDocumentText(),
          signerName: demoDocument.signerName,
          signerEmail: demoDocument.signerEmail,
          signatureData: sig,
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
    <div className="min-h-screen bg-[var(--color-neutral-900)] flex flex-col items-center py-12 px-4">
      <div className="flex items-center gap-2.5 mb-8">
        <IconLogoMark size={26} />
        <span className="font-medium text-[16px] text-[var(--color-text)]">Origin</span>
        <span className="text-[12px] text-[var(--color-neutral-500)] ml-1">e-signature</span>
      </div>

      <SignStepper current={step} />

      <div
        className="w-full max-w-[440px] mt-8 p-8 rounded-2xl bg-[var(--color-bg)] text-[var(--color-text)]"
        style={{ boxShadow: "var(--shadow-lg)" }}
      >
        {step === 1 && <ReviewStep onContinue={() => setStep(2)} />}
        {step === 2 && <VerifyStep onContinue={() => setStep(3)} onBack={() => setStep(1)} />}
        {step === 3 && <SignStep onContinue={completeSigning} onBack={() => setStep(2)} />}
        {step === 4 && <CompleteStep signature={signature} proof={proof} sealing={sealing} />}
      </div>

      <div className="text-[11px] text-[var(--color-neutral-600)] mt-6 flex items-center gap-2">
        Protected by two-factor authentication · Audit trail retained for 7 years
      </div>
    </div>
  );
}
