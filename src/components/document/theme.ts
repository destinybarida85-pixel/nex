export type DocumentAccent = { id: string; label: string; color: string };

export const documentAccents: DocumentAccent[] = [
  { id: "charcoal", label: "Charcoal", color: "#33333a" },
  { id: "navy", label: "Navy", color: "#2b3a55" },
  { id: "forest", label: "Forest", color: "#2f4a3d" },
  { id: "burgundy", label: "Burgundy", color: "#5c2a3a" },
];

export type DocumentLayout = "classic" | "modern" | "minimal" | "dossier";

export const documentLayouts: { id: DocumentLayout; label: string; why: string }[] = [
  { id: "classic", label: "Classic", why: "Serif letterhead with a formal feel — best for contracts and legal agreements." },
  { id: "modern", label: "Modern", why: "Bold sans-serif with numbered sections — best for invoices, proposals, and reports." },
  { id: "minimal", label: "Minimal", why: "Quiet and typographic, almost no lines — best for letters and short notices." },
  { id: "dossier", label: "Dossier", why: "Monospace, two-column technical contract style — best for agreements and formal legal dossiers." },
];

export const paperBg = "#ffffff";
export const paperInk = "#22222a";
export const paperMuted = "#6b6b76";
export const paperRule = "rgba(0,0,0,0.09)";
export const monoStack = "'IBM Plex Mono', ui-monospace, 'SFMono-Regular', Menlo, Consolas, monospace";
