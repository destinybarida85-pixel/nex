"use client";

import { useEffect, useState } from "react";

type DocRow = { id: string; title: string; status: "draft" | "sent" | "signed" | "void"; created_at: string };

const STATUS_COLOR: Record<string, string> = {
  draft: "#a8a8a8",
  sent: "#d2cefd",
  signed: "#8fd6a8",
  void: "#6b6b6b",
};

export default function DocumentsPanel() {
  const [docs, setDocs] = useState<DocRow[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/documents")
      .then((r) => r.json())
      .then((data) => {
        if (data.configured && !data.error) setDocs(data.documents ?? []);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  return (
    <div className="flex flex-col gap-5 max-w-[720px]">
      <div>
        <h3 className="m-0 text-[22px]" style={{ color: "#fff" }}>Documents</h3>
        <div className="text-[13.5px] mt-1.5" style={{ color: "#a8a8a8" }}>
          Every document Primue AI has drafted or sent for your business. Open the full editor on the main
          dashboard to draft a new one.
        </div>
      </div>

      <a
        href="/assistant"
        className="btn text-[13.5px] self-start"
        style={{ background: "#fff", color: "#0a0a0a", border: "1px solid #fff" }}
      >
        Draft a new document →
      </a>

      {loaded && docs.length === 0 && (
        <div className="text-[13.5px]" style={{ color: "#6b6b6b" }}>No documents yet.</div>
      )}

      <div className="flex flex-col gap-2">
        {docs.map((d) => (
          <div key={d.id} className="card elev-sm gap-1.5 p-4" style={{ background: "#161616", border: "1px solid rgba(255,255,255,0.14)" }}>
            <div className="flex items-center gap-2">
              <span className="text-[13.5px] flex-1 truncate" style={{ color: "#f5f5f5" }}>{d.title}</span>
              <span className="tag text-[9.5px]" style={{ border: `1px solid ${STATUS_COLOR[d.status]}`, color: STATUS_COLOR[d.status] }}>
                {d.status}
              </span>
            </div>
            <div className="text-[11px]" style={{ color: "#6b6b6b" }}>
              {new Date(d.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
