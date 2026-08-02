export type DocumentAccent = { id: string; label: string; color: string };

export const documentAccents: DocumentAccent[] = [
  { id: "charcoal", label: "Charcoal", color: "#33333a" },
  { id: "navy", label: "Navy", color: "#2b3a55" },
  { id: "forest", label: "Forest", color: "#2f4a3d" },
  { id: "burgundy", label: "Burgundy", color: "#5c2a3a" },
];

export type DocumentLayout = "classic" | "modern" | "minimal" | "dossier" | "executive" | "letterhead" | "editorial";

export const documentLayouts: { id: DocumentLayout; label: string; why: string; premium?: boolean }[] = [
  // The first three are the premium tier: real letterhead furniture — a
  // full-bleed masthead, a printed contact block, a rule-and-numeral system —
  // rather than a title sitting on a blank page.
  { id: "executive", label: "Executive", why: "Full-bleed coloured masthead, wide margins, printed reference block — the one to send a client.", premium: true },
  { id: "letterhead", label: "Letterhead", why: "Corporate letterhead with a contact block, double rule and a printed footer bar.", premium: true },
  { id: "editorial", label: "Editorial", why: "Large display type, drop cap and numbered sections — for reports and proposals that need to impress.", premium: true },
  { id: "classic", label: "Classic", why: "Serif letterhead with a formal feel — best for contracts and legal agreements." },
  { id: "modern", label: "Modern", why: "Bold sans-serif with numbered sections — best for invoices, proposals, and reports." },
  { id: "minimal", label: "Minimal", why: "Quiet and typographic, almost no lines — best for letters and short notices." },
  { id: "dossier", label: "Dossier", why: "Monospace, two-column technical contract style — best for agreements and formal legal dossiers." },
];

// Font is deliberately separate from layout. A layout picks a sensible default
// (Classic is serif, Dossier is monospace), but the same contract may need to
// be set in a different face — so this overrides the layout's choice without
// changing anything else about it. "auto" means "whatever the layout picked".
export type DocumentFont = "auto" | "serif" | "sans" | "mono";

export const documentFonts: { id: DocumentFont; label: string; stack: string | null }[] = [
  { id: "auto", label: "Match the style", stack: null },
  { id: "serif", label: "Serif — formal", stack: "Georgia, 'Times New Roman', serif" },
  { id: "sans", label: "Sans — clean", stack: "system-ui, -apple-system, 'Segoe UI', sans-serif" },
  { id: "mono", label: "Mono — technical", stack: "'IBM Plex Mono', ui-monospace, 'SFMono-Regular', Menlo, Consolas, monospace" },
];

export function fontStack(font: DocumentFont | undefined) {
  return documentFonts.find((f) => f.id === font)?.stack ?? null;
}

export const paperBg = "#ffffff";
export const paperInk = "#22222a";
export const paperMuted = "#6b6b76";
export const paperRule = "rgba(0,0,0,0.09)";
export const monoStack = "'IBM Plex Mono', ui-monospace, 'SFMono-Regular', Menlo, Consolas, monospace";
