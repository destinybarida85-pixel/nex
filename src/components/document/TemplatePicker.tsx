"use client";

import { useMemo, useState } from "react";
import { IconSearch, IconX } from "@/components/icons";
import { documentTemplates, templateCategories, type DocumentTemplate } from "./templates";
import DocumentPaper from "./DocumentPaper";
import { documentAccents, documentLayouts, type DocumentLayout } from "./theme";

export type TemplateChoice = { template: DocumentTemplate; layout: DocumentLayout; accentColor: string };

export default function TemplatePicker({
  onPick,
  onClose,
}: {
  onPick: (choice: TemplateChoice) => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");

  // Picking a template used to apply its one built-in layout silently. A
  // document type and the way it looks are two separate decisions — the same
  // land agreement can be a formal serif deed or a plain modern one — so the
  // picker now asks for both.
  const [chosen, setChosen] = useState<DocumentTemplate | null>(null);
  const [layout, setLayout] = useState<DocumentLayout>("classic");
  const [accentColor, setAccentColor] = useState(documentAccents[0].color);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return documentTemplates.filter((t) => {
      const matchesCategory = category === "All" || t.category === category;
      const matchesQuery = !q || t.name.toLowerCase().includes(q) || t.category.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [query, category]);

  function choose(t: DocumentTemplate) {
    setChosen(t);
    // The template's own layout is the recommended starting point, not a lock.
    setLayout(t.layout);
  }

  if (chosen) {
    return (
      <div className="dialog-backdrop" onClick={onClose}>
        <div className="dialog" style={{ maxWidth: 780, width: "100%" }} onClick={(e) => e.stopPropagation()}>
          <div className="dialog-title flex items-center gap-2">
            <button className="btn btn-ghost text-[12px]" onClick={() => setChosen(null)}>
              ← Templates
            </button>
            <span className="text-[13px] text-[var(--color-neutral-400)] truncate">{chosen.name}</span>
            <button className="btn btn-icon btn-ghost ml-auto" aria-label="Close" onClick={onClose}>
              <IconX size={15} />
            </button>
          </div>

          <div className="dialog-body flex flex-col gap-4" style={{ maxHeight: "68vh", overflowY: "auto" }}>
            <div className="text-[12.5px] text-[var(--color-neutral-400)]">
              Now pick how it should look. Same words, different presentation — you can change this later too.
            </div>

            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex flex-col gap-3 lg:w-[280px] flex-none">
                <div className="flex flex-col gap-1.5">
                  {documentLayouts.map((l) => (
                    <button
                      key={l.id}
                      onClick={() => setLayout(l.id)}
                      className="text-left p-2.5 rounded-lg border cursor-pointer transition-colors"
                      style={{
                        borderColor: layout === l.id ? "var(--color-accent)" : "var(--color-divider)",
                        background: layout === l.id ? "color-mix(in srgb, var(--color-accent-900) 45%, transparent)" : "var(--color-bg)",
                      }}
                    >
                      <div className="text-[12.5px] font-medium text-[var(--color-text)] flex items-center gap-1.5">
                        {l.label}
                        {l.id === chosen.layout && (
                          <span className="tag tag-accent text-[9px]" style={{ padding: "1px 5px" }}>
                            suggested
                          </span>
                        )}
                      </div>
                      <div className="text-[10.5px] text-[var(--color-neutral-500)] mt-0.5">{l.why}</div>
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11.5px] text-[var(--color-neutral-500)]">Colour</span>
                  {documentAccents.map((a) => (
                    <button
                      key={a.id}
                      aria-label={a.label}
                      onClick={() => setAccentColor(a.color)}
                      className="w-[20px] h-[20px] rounded-md cursor-pointer"
                      style={{
                        background: a.color,
                        outline: accentColor === a.color ? "2px solid var(--color-text)" : "none",
                        outlineOffset: 2,
                      }}
                    />
                  ))}
                </div>

                <button
                  className="btn btn-primary text-[12.5px]"
                  onClick={() => onPick({ template: chosen, layout, accentColor })}
                >
                  Use this template
                </button>
              </div>

              <div className="flex-1 min-w-0 rounded-xl overflow-hidden" style={{ maxHeight: 420, overflowY: "auto" }}>
                <DocumentPaper
                  title={chosen.title}
                  meta={chosen.meta}
                  sections={chosen.sections}
                  accentColor={accentColor}
                  layout={layout}
                  big={false}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dialog-backdrop" onClick={onClose}>
      <div className="dialog" style={{ maxWidth: 720, width: "100%" }} onClick={(e) => e.stopPropagation()}>
        <div className="dialog-title flex items-center gap-2">
          Start from a template
          <button className="btn btn-icon btn-ghost ml-auto" aria-label="Close" onClick={onClose}>
            <IconX size={15} />
          </button>
        </div>

        <div className="dialog-body flex flex-col gap-3" style={{ maxHeight: "62vh", overflowY: "auto" }}>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: "var(--color-surface)" }}>
            <IconSearch size={14} className="text-[var(--color-neutral-500)] flex-none" />
            <input
              className="flex-1 bg-transparent border-none outline-none text-[13px] text-[var(--color-text)]"
              placeholder={`Search ${documentTemplates.length} templates…`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {["All", ...templateCategories].map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className="tag cursor-pointer transition-opacity hover:opacity-80"
                style={
                  category === c
                    ? { background: "var(--color-accent-800)", color: "var(--color-accent-100)" }
                    : { background: "var(--color-neutral-800)", color: "var(--color-neutral-300)" }
                }
              >
                {c}
              </button>
            ))}
          </div>

          {results.length === 0 ? (
            <div className="text-[12.5px] text-[var(--color-neutral-500)] text-center py-8">
              No templates match &ldquo;{query}&rdquo;.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {results.map((t) => (
                <button
                  key={t.id}
                  onClick={() => choose(t)}
                  className="text-left p-3 rounded-lg border cursor-pointer transition-colors hover:border-[var(--color-neutral-600)]"
                  style={{ borderColor: "var(--color-divider)", background: "var(--color-bg)" }}
                >
                  <div className="text-[13px] font-medium text-[var(--color-text)]">{t.name}</div>
                  <div className="text-[11px] text-[var(--color-neutral-500)] mt-0.5 flex items-center gap-1.5 flex-wrap">
                    {t.category}
                    <span className="opacity-40">·</span>
                    {t.layout}
                    {t.outlineOnly && (
                      <span className="tag tag-neutral text-[9px]" style={{ padding: "1px 5px" }}>
                        outline
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          <div className="text-[11px] text-[var(--color-neutral-500)] leading-[1.6] pt-1">
            Templates marked <strong>outline</strong> (posters, flyers, ID cards, decks) give you the written content
            structure — Origin produces text documents, not designed graphics, so you&rsquo;d take that copy into a
            design tool for the final artwork.
          </div>
        </div>
      </div>
    </div>
  );
}
