"use client";

import { useMemo, useState } from "react";
import { IconSearch, IconX } from "@/components/icons";
import { documentTemplates, templateCategories, type DocumentTemplate } from "./templates";

export default function TemplatePicker({
  onPick,
  onClose,
}: {
  onPick: (template: DocumentTemplate) => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return documentTemplates.filter((t) => {
      const matchesCategory = category === "All" || t.category === category;
      const matchesQuery = !q || t.name.toLowerCase().includes(q) || t.category.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [query, category]);

  return (
    <div className="dialog-backdrop" onClick={onClose}>
      <div
        className="dialog"
        style={{ maxWidth: 720, width: "100%" }}
        onClick={(e) => e.stopPropagation()}
      >
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
              placeholder="Search 86 templates…"
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
                  onClick={() => onPick(t)}
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
