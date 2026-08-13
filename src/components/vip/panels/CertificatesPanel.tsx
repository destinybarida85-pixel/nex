"use client";

import { useEffect, useState } from "react";

type CertRow = { id: string; recipient_name: string; title: string; issued_at: string };

export default function CertificatesPanel() {
  const [certs, setCerts] = useState<CertRow[]>([]);
  const [credits, setCredits] = useState<number | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/certificates")
      .then((r) => r.json())
      .then((data) => {
        if (data.configured && !data.setupRequired) {
          setCerts(data.certificates ?? []);
          setCredits(data.credits ?? 0);
        }
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  return (
    <div className="flex flex-col gap-5 max-w-[720px]">
      <div>
        <h3 className="m-0 text-[22px]" style={{ color: "#fff" }}>Certificates</h3>
        <div className="text-[13.5px] mt-1.5" style={{ color: "#a8a8a8" }}>
          Real, verifiable certificates issued in your name.
          {credits !== null && ` ${credits} credit${credits === 1 ? "" : "s"} left.`}
        </div>
      </div>

      <a
        href="/certificates"
        className="btn text-[13.5px] self-start"
        style={{ background: "#fff", color: "#0a0a0a", border: "1px solid #fff" }}
      >
        Issue a certificate →
      </a>

      {loaded && certs.length === 0 && (
        <div className="text-[13.5px]" style={{ color: "#6b6b6b" }}>No certificates issued yet.</div>
      )}

      <div className="flex flex-col gap-2">
        {certs.map((c) => (
          <div key={c.id} className="card elev-sm gap-1.5 p-4" style={{ background: "#161616", border: "1px solid rgba(255,255,255,0.14)" }}>
            <div className="text-[13.5px]" style={{ color: "#f5f5f5" }}>{c.recipient_name} — {c.title}</div>
            <div className="text-[11px]" style={{ color: "#6b6b6b" }}>
              {new Date(c.issued_at).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
