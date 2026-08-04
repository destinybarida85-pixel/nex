"use client";

import { use, useEffect, useState } from "react";
import { IconLogoMark, IconCheckCircle, IconDownload } from "@/components/icons";
import CertificatePaper, { type CertificateDesign, type CertificateStyle } from "@/components/certificates/CertificatePaper";

type Certificate = {
  id: string;
  design: CertificateDesign;
  recipientName: string;
  title: string;
  citation: string;
  issuerName: string;
  issuedAt: string;
  accentColor: string | null;
  style?: CertificateStyle;
};

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-[var(--color-neutral-900)] flex flex-col items-center py-12 px-4 overflow-hidden">
      <div className="nx-grid-bg absolute inset-0 pointer-events-none no-print" />
      <div className="relative flex items-center gap-2.5 mb-8 no-print">
        <IconLogoMark size={26} />
        <span className="font-medium text-[16px] text-[var(--color-text)]">Primue</span>
        <span className="text-[12px] text-[var(--color-neutral-500)] ml-1">certificate</span>
      </div>
      {children}
    </div>
  );
}

export default function PublicCertificatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [cert, setCert] = useState<Certificate | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/certificates/${id}/public`)
      .then((r) => r.json())
      .then((data) => {
        if (!data.configured || !data.certificate) {
          setNotFound(true);
          return;
        }
        setCert(data.certificate);
      })
      .catch(() => setNotFound(true));
  }, [id]);

  if (notFound) {
    return (
      <Shell>
        <div className="relative w-full max-w-[440px] mt-8 p-8 rounded-2xl bg-[var(--color-bg)] text-[var(--color-text)] text-center" style={{ boxShadow: "var(--shadow-lg)" }}>
          <div className="text-[16px] font-medium">This certificate isn&rsquo;t available.</div>
          <div className="text-[12.5px] text-[var(--color-neutral-500)] mt-1.5">It may have been removed, or the link is incomplete.</div>
        </div>
      </Shell>
    );
  }

  if (!cert) return <Shell><div /></Shell>;

  // The certificate canvas is landscape (~1.55:1). Printed on a default
  // portrait page, only my centering fix in globals.css moves it from
  // "pinned in a corner" to "small and centered" — it stays letterboxed,
  // since centering redistributes empty space rather than removing it.
  // Scoping @page { size: landscape } to just this click (via a temporary
  // style tag, cleaned up on the browser's own afterprint event) fills the
  // page properly without touching @page for the rest of the app, where
  // documents and invoices are genuinely portrait content.
  function printLandscape() {
    const style = document.createElement("style");
    style.id = "cert-landscape";
    style.textContent = "@page { size: landscape; margin: 0; }";
    document.head.appendChild(style);
    const cleanup = () => {
      style.remove();
      window.removeEventListener("afterprint", cleanup);
    };
    window.addEventListener("afterprint", cleanup);
    window.print();
  }

  return (
    <Shell>
      <div className="relative w-full max-w-[760px] flex flex-col gap-4 print-area">
        <CertificatePaper
          design={cert.design}
          recipientName={cert.recipientName}
          title={cert.title}
          citation={cert.citation}
          issuerName={cert.issuerName}
          issuedAt={cert.issuedAt}
          accentColor={cert.accentColor || undefined}
          style={cert.style}
        />

        <div
          className="no-print flex items-center justify-center gap-2 text-[12px] rounded-xl py-3"
          style={{ background: "var(--color-bg)", color: "#63c3b2", boxShadow: "var(--shadow-sm)" }}
        >
          <IconCheckCircle size={14} />
          Verified — this certificate record is held by {cert.issuerName || "the issuer"} on Primue.
        </div>

        <button className="btn btn-secondary text-[12.5px] no-print self-center" onClick={printLandscape}>
          <IconDownload size={13} />
          Print / Save as PDF
        </button>
      </div>
    </Shell>
  );
}
