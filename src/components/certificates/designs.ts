import type { StampShape } from "@/components/sign/Stamp";

// A certificate design is data, not a bespoke component. Fifteen hand-written
// layouts would be fifteen places to fix the same bug, so each one is instead a
// combination of: a frame treatment, a header arrangement, a palette, and type.
// Adding a sixteenth is a row in this file.

export type FrameKind =
  | "masthead"      // solid colour band across the top, angled cut
  | "double-border" // two concentric rules inset from the edge
  | "side-ribbon"   // vertical colour sweep down one edge
  | "corner-flare"  // diagonal wedges in opposing corners
  | "plain"         // no frame furniture; type does the work
  | "full-border"   // a single heavy rule tracing the whole page
  | "art-deco";     // stepped corner brackets

export type HeaderKind = "left" | "centre" | "right";

export type CertificateDesignSpec = {
  id: string;
  label: string;
  why: string;
  frame: FrameKind;
  header: HeaderKind;
  /** Page background. */
  paper: string;
  /** Ink for the main text. */
  ink: string;
  /** Muted ink for labels and secondary lines. */
  muted: string;
  /** Default accent — always overridable per certificate. */
  accent: string;
  /** Secondary accent used by frames that need two tones. */
  accent2?: string;
  /** Serif for ceremonial designs, sans for contemporary ones. */
  titleFont: "serif" | "sans";
  /** Recipient name in italic script-ish serif, or upright. */
  nameStyle: "italic" | "upright";
  /** Fine engraved line pattern behind the content. */
  guilloche?: boolean;
  stamp: StampShape;
};

const SERIF = "serif" as const;
const SANS = "sans" as const;

export const certificateDesigns: CertificateDesignSpec[] = [
  {
    id: "ribbon", label: "Ribbon", why: "Navy masthead with a gold sweep — the classic certificate of achievement.",
    frame: "masthead", header: "left", paper: "#faf9f6", ink: "#22222a", muted: "#6b6355",
    accent: "#c9a227", accent2: "#142238", titleFont: SERIF, nameStyle: "italic", stamp: "badge",
  },
  {
    id: "ornate", label: "Ornate", why: "Double gold border over fine engraved linework — formal and ceremonial.",
    frame: "double-border", header: "centre", paper: "#faf7f0", ink: "#2a241a", muted: "#8a7a4a",
    accent: "#c9a227", titleFont: SERIF, nameStyle: "italic", guilloche: true, stamp: "badge",
  },
  {
    id: "regal", label: "Regal", why: "A gold ribbon down the left edge over a soft marble ground.",
    frame: "side-ribbon", header: "left", paper: "linear-gradient(135deg, #f4f3f0, #eae7e0)", ink: "#22222a", muted: "#6b6355",
    accent: "#c9a227", accent2: "#2b3a55", titleFont: SERIF, nameStyle: "italic", stamp: "wax",
  },
  {
    id: "obsidian", label: "Obsidian", why: "Near-black paper with gold type — for awards that should feel rare.",
    frame: "double-border", header: "centre", paper: "#14141a", ink: "#f2efe6", muted: "#9a8f72",
    accent: "#c9a227", titleFont: SERIF, nameStyle: "italic", stamp: "wax",
  },
  {
    id: "laurel", label: "Laurel", why: "Deep green and gold, centred — academic and traditional.",
    frame: "double-border", header: "centre", paper: "#f7f8f4", ink: "#1e2b22", muted: "#5d6b5f",
    accent: "#2f6b4a", accent2: "#c9a227", titleFont: SERIF, nameStyle: "italic", guilloche: true, stamp: "badge",
  },
  {
    id: "crimson", label: "Crimson", why: "Bold red masthead — recognition that wants to be noticed.",
    frame: "masthead", header: "left", paper: "#fbf7f6", ink: "#241a1a", muted: "#6b5555",
    accent: "#a8202a", accent2: "#6d1218", titleFont: SERIF, nameStyle: "italic", stamp: "badge",
  },
  {
    id: "azure", label: "Azure", why: "Clean blue corner flares — corporate training and compliance.",
    frame: "corner-flare", header: "left", paper: "#f6f9fc", ink: "#1a2530", muted: "#5b6b7a",
    accent: "#2b6ca8", accent2: "#7fb2e0", titleFont: SANS, nameStyle: "upright", stamp: "round",
  },
  {
    id: "slate", label: "Slate", why: "Quiet grey with a single rule — understated, modern, professional.",
    frame: "plain", header: "left", paper: "#f7f7f8", ink: "#22222a", muted: "#75798c",
    accent: "#4a5568", titleFont: SANS, nameStyle: "upright", stamp: "round",
  },
  {
    id: "minimal", label: "Minimal", why: "Almost nothing but type — for brands that don't need decoration.",
    frame: "plain", header: "centre", paper: "#ffffff", ink: "#141418", muted: "#8a8a94",
    accent: "#141418", titleFont: SANS, nameStyle: "upright", stamp: "round",
  },
  {
    id: "deco", label: "Deco", why: "Stepped art-deco brackets — vintage, geometric, distinctive.",
    frame: "art-deco", header: "centre", paper: "#f9f6ef", ink: "#1f1a12", muted: "#7a6a4a",
    accent: "#b8912f", accent2: "#1f1a12", titleFont: SERIF, nameStyle: "upright", stamp: "badge",
  },
  {
    id: "violet", label: "Violet", why: "Your brand's own accent, front and centre.",
    frame: "masthead", header: "left", paper: "#faf9fd", ink: "#221f2e", muted: "#6b6580",
    accent: "#9184d9", accent2: "#3a2f66", titleFont: SANS, nameStyle: "italic", stamp: "badge",
  },
  {
    id: "parchment", label: "Parchment", why: "Warm aged paper with a full border — diplomas and honours.",
    frame: "full-border", header: "centre", paper: "#f6efdf", ink: "#3a2f1c", muted: "#8a7550",
    accent: "#8a6a2f", titleFont: SERIF, nameStyle: "italic", guilloche: true, stamp: "wax",
  },
  {
    id: "monochrome", label: "Monochrome", why: "Black on white, heavy rules — editorial and confident.",
    frame: "full-border", header: "left", paper: "#ffffff", ink: "#0c0c0c", muted: "#6b6b70",
    accent: "#0c0c0c", titleFont: SANS, nameStyle: "upright", stamp: "rectangle",
  },
  {
    id: "teal", label: "Teal", why: "Fresh teal side ribbon — workshops, bootcamps, short courses.",
    frame: "side-ribbon", header: "left", paper: "#f4faf8", ink: "#122a26", muted: "#4f6f68",
    accent: "#2f8f7a", accent2: "#155447", titleFont: SANS, nameStyle: "upright", stamp: "round",
  },
  {
    id: "midnight", label: "Midnight", why: "Dark navy with silver type — premium, corporate, restrained.",
    frame: "side-ribbon", header: "left", paper: "#141a26", ink: "#e8ecf5", muted: "#8e9ab5",
    accent: "#9fb4d9", accent2: "#2b3a55", titleFont: SANS, nameStyle: "upright", stamp: "round",
  },
];

export function findDesign(id: string | undefined): CertificateDesignSpec {
  return certificateDesigns.find((d) => d.id === id) ?? certificateDesigns[0];
}

/** The app owns the list of valid designs now that the DB CHECK is gone. */
export function isValidDesign(id: string | undefined): boolean {
  return !!id && certificateDesigns.some((d) => d.id === id);
}

export type CertificateStyle = {
  accentColor?: string;
  font?: "serif" | "sans";
  showStamp?: boolean;
  stampShape?: StampShape;
  stampLabel?: string;
  stampSub?: string;
  /** Seal colour, independent of accentColor. Unset means "match the
   *  certificate's accent" — but once set, it stays put even if the design or
   *  accent changes later, instead of silently following them. */
  sealColor?: string;
  /** Large, faint copy of the issuer's logo behind the certificate art. */
  watermarkUrl?: string | null;
};
