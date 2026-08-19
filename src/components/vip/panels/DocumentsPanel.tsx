"use client";

import { useEffect, useState } from "react";
import { useVipTheme, type VipTokens } from "@/components/vip/theme";

type DocRow = { id: string; title: string; status: "draft" | "sent" | "signed" | "void"; created_at: string };

function statusColor(status: string, tokens: VipTokens) {
  if (status === "signed") return tokens.success;
  if (status === "sent") return tokens.info;
  if (status === "void") return tokens.textQuaternary;
  return tokens.textSecondary;
}

export default function DocumentsPanel() {
  const { tokens } = useVipTheme();
  const [docs, setDocs] = useState<DocRow[]>([]);
  const [loaded, setLoaded] = useState(false);

  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [created, setCreated] = useState(false);

  function load() {
    fetch("/api/documents")
      .then((r) => r.json())
      .then((data) => {
        if (data.configured && !data.error) setDocs(data.documents ?? []);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }

  useEffect(() => {
    load();
  }, []);

  async function createDocument() {
    if (!title.trim() || !text.trim()) return;
    setCreating(true);
    setCreateError("");
    setCreated(false);
    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), text: text.trim() }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Couldn't create that document.");
      setTitle("");
      setText("");
      setCreated(true);
      load();
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : "Couldn't reach the server.");
    } finally {
      setCreating(false);
    }
  }

  const signed = docs.filter((d) => d.status === "signed").length;
  const awaiting = docs.filter((d) => d.status === "sent").length;
  const drafts = docs.filter((d) => d.status === "draft").length;

  return (
    <div className="flex flex-col gap-4 max-w-[1080px]">
      <div>
        <h3 className="m-0 text-[22px]" style={{ color: tokens.text }}>Documents</h3>
        <div className="text-[13.5px] mt-1.5" style={{ color: tokens.textSecondary }}>
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
          <div key={s.label} className="card elev-sm gap-1.5 p-4" style={{ background: tokens.surface, border: `1px solid ${tokens.border}` }}>
            <span className="text-[11px] tracking-[.06em] uppercase" style={{ color: tokens.textQuaternary }}>{s.label}</span>
            <span className="text-[20px] font-medium" style={{ color: tokens.text }}>{s.value}</span>
          </div>
        ))}
      </div>

      <div className="grid gap-3.5" style={{ gridTemplateColumns: "1.6fr 1fr" }}>
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[13px] font-medium" style={{ color: tokens.textSecondary }}>All documents</span>
          </div>
          {loaded && docs.length === 0 && (
            <div className="text-[13.5px]" style={{ color: tokens.textQuaternary }}>No documents yet.</div>
          )}
          {docs.length > 0 && (
            <div className="overflow-x-auto rounded-lg" style={{ border: `1px solid ${tokens.border}` }}>
              <table className="w-full text-[12.5px]" style={{ borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${tokens.border}` }}>
                    {["Title", "Status", "Date"].map((h) => (
                      <th key={h} className="text-left p-2.5" style={{ color: tokens.textQuaternary, fontWeight: 500 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {docs.map((d) => (
                    <tr key={d.id} style={{ borderBottom: `1px solid ${tokens.tint3}` }}>
                      <td className="p-2.5 truncate" style={{ color: tokens.text, maxWidth: 260 }}>{d.title}</td>
                      <td className="p-2.5">
                        <span className="tag text-[9.5px]" style={{ border: `1px solid ${statusColor(d.status, tokens)}`, color: statusColor(d.status, tokens) }}>
                          {d.status}
                        </span>
                      </td>
                      <td className="p-2.5" style={{ color: tokens.textSecondary }}>
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
          <div className="card elev-sm gap-2.5 p-5" style={{ background: tokens.surface, border: `1px solid ${tokens.border}` }}>
            <div className="text-[13px] font-medium" style={{ color: tokens.text }}>New document</div>
            <input
              className="input text-[13.5px]"
              style={{ background: tokens.surfaceInset, color: tokens.text, border: `1px solid ${tokens.border}` }}
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              className="input text-[13px]"
              style={{ background: tokens.surfaceInset, color: tokens.text, border: `1px solid ${tokens.border}`, minHeight: 90 }}
              placeholder="Write the document content…"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            {createError && <div className="text-[12px]" style={{ color: tokens.danger }}>{createError}</div>}
            {created && !createError && <div className="text-[12px]" style={{ color: tokens.success }}>Created</div>}
            <button
              className="btn text-[13px] self-start"
              style={{ background: tokens.accentBg, color: tokens.accentText, border: `1px solid ${tokens.accentBg}` }}
              onClick={createDocument}
              disabled={creating || !title.trim() || !text.trim()}
            >
              {creating ? "Creating…" : "Create document"}
            </button>
            <a href="/assistant" className="text-[11px]" style={{ color: tokens.textQuaternary }}>
              Need AI drafting, styling or a signature flow? Open the full editor →
            </a>
          </div>
          <div className="card elev-sm gap-2 p-4" style={{ background: tokens.surface, border: `1px solid ${tokens.border}` }}>
            <div className="text-[12.5px] font-medium" style={{ color: tokens.text }}>Need a client reply drafted instead?</div>
            <div className="text-[11.5px]" style={{ color: tokens.textTertiary, lineHeight: 1.6 }}>
              Use Teni AI from the sidebar — say or type what you need and it comes back as a ready draft.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
