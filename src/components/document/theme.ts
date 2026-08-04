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

// The accent colour only ever tinted rules and headings — the page itself was
// always white. These are the page. Kept deliberately pale: a document is
// still meant to be read, and printed, so these are tints rather than colours.
export type DocumentPaperTone = "white" | "ivory" | "sand" | "mist" | "sage" | "blush" | "slate" | "charcoal";

export const documentPaperTones: { id: DocumentPaperTone; label: string; bg: string; ink?: string; muted?: string }[] = [
  { id: "white", label: "White", bg: "#ffffff" },
  { id: "ivory", label: "Ivory", bg: "#faf7f0" },
  { id: "sand", label: "Sand", bg: "#f6f1e7" },
  { id: "mist", label: "Mist", bg: "#f2f5f8" },
  { id: "sage", label: "Sage", bg: "#f1f5f1" },
  { id: "blush", label: "Blush", bg: "#fbf4f4" },
  // The two dark tones need their own ink, or the body text stays near-black
  // on a near-black page.
  { id: "slate", label: "Slate", bg: "#242833", ink: "#eef1f7", muted: "#9aa3b8" },
  { id: "charcoal", label: "Charcoal", bg: "#1b1b20", ink: "#eeeef2", muted: "#9a9aa6" },
];

export function paperTone(id: DocumentPaperTone | undefined) {
  return documentPaperTones.find((t) => t.id === id) ?? documentPaperTones[0];
}

export const paperBg = "#ffffff";
export const paperInk = "#22222a";
export const paperMuted = "#6b6b76";
export const paperRule = "rgba(0,0,0,0.09)";
export const monoStack = "'IBM Plex Mono', ui-monospace, 'SFMono-Regular', Menlo, Consolas, monospace";
