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

  const signed = docs.filter((d) => d.status === "signed").length;
  const awaiting = docs.filter((d) => d.status === "sent").length;
  const drafts = docs.filter((d) => d.status === "draft").length;

  return (
    <div className="flex flex-col gap-4 max-w-[1080px]">
      <div>
        <h3 className="m-0 text-[22px]" style={{ color: "#fff" }}>Documents</h3>
        <div className="text-[13.5px] mt-1.5" style={{ color: "#a8a8a8" }}>
          Every document drafted or sent for your business — nothing here is estimated.
        </div>
      </div>

      <div className="grid gap-3.5" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
        {[
          { label: "Total documents", value: docs.length },
          { label: "Signed", value: signed },
          { label: "Awaiting signature", value: awaiting },
          { label: "Drafts", value: drafts },
        ].map((s) => (
          <div key={s.label} className="card elev-sm gap-1.5 p-4" style={{ background: "#161616", border: "1px solid rgba(255,255,255,0.14)" }}>
            <span className="text-[11px] tracking-[.06em] uppercase" style={{ color: "#6b6b6b" }}>{s.label}</span>
            <span className="text-[20px] font-medium" style={{ color: "#fff" }}>{s.value}</span>
          </div>
        ))}
      </div>

      <div className="grid gap-3.5" style={{ gridTemplateColumns: "1.6fr 1fr" }}>
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[13px] font-medium" style={{ color: "#a8a8a8" }}>All documents</span>
          </div>
          {loaded && docs.length === 0 && (
            <div className="text-[13.5px]" style={{ color: "#6b6b6b" }}>No documents yet.</div>
          )}
          {docs.length > 0 && (
            <div className="overflow-x-auto rounded-lg" style={{ border: "1px solid rgba(255,255,255,0.14)" }}>
              <table className="w-full text-[12.5px]" style={{ borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.14)" }}>
                    {["Title", "Status", "Date"].map((h) => (
                      <th key={h} className="text-left p-2.5" style={{ color: "#6b6b6b", fontWeight: 500 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {docs.map((d) => (
                    <tr key={d.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                      <td className="p-2.5 truncate" style={{ color: "#f5f5f5", maxWidth: 260 }}>{d.title}</td>
                      <td className="p-2.5">
                        <span className="tag text-[9.5px]" style={{ border: `1px solid ${STATUS_COLOR[d.status]}`, color: STATUS_COLOR[d.status] }}>
                          {d.status}
                        </span>
                      </td>
                      <td className="p-2.5" style={{ color: "#a8a8a8" }}>
                        {new Date(d.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3.5">
          <div className="card elev-sm gap-2 p-5" style={{ background: "#fff", color: "#0a0a0a" }}>
            <div className="text-[12px] font-medium">Draft a new document</div>
            <div className="text-[11px]" style={{ color: "#4a4a4a" }}>Open the full editor on the main dashboard to write, style and send a new one.</div>
            <a href="/assistant" className="btn text-[11.5px] self-start mt-1" style={{ background: "#0a0a0a", color: "#fff", border: "1px solid #0a0a0a" }}>
              Open →
            </a>
          </div>
          <div className="card elev-sm gap-2 p-4" style={{ background: "#161616", border: "1px dashed rgba(255,255,255,0.2)" }}>
            <div className="text-[12.5px] font-medium" style={{ color: "#fff" }}>Need a client reply drafted instead?</div>
            <div className="text-[11.5px]" style={{ color: "#8a8a8a", lineHeight: 1.6 }}>
              Use Teni AI from the sidebar — say or type what you need and it comes back as a ready draft.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
