import type { DocumentLayout, DocumentFont, DocumentPaperTone } from "@/components/document/theme";

export type SignSection = { heading: string; text: string };
export type SignDocument = {
  title: string;
  sentBy: string;
  signerName: string;
  signerEmail: string;
  sections: SignSection[];
  logoUrl?: string | null;
  watermarkUrl?: string | null;
  accentColor?: string;
  layout?: DocumentLayout;
  font?: DocumentFont;
  tone?: DocumentPaperTone;
  organisation?: string | null;
  /** Real timestamp the document row was created — only present for a real
   *  persisted document (the /sign/[id] shareable-link flow), never
   *  fabricated for the demo/session-storage flow. Powers the one real
   *  "Drafted" audit trail entry we can actually back with data. */
  createdAt?: string;
};

export const demoDocument: SignDocument = {
  title: "Master Services Agreement · Halcyon Ventures",
  sentBy: "Meridian Studio",
  signerName: "Jordan Ashby",
  signerEmail: "jordan@halcyonventures.com",
  sections: [
    { heading: "1. Parties", text: "This Master Services Agreement (“Agreement”) is entered into between Meridian Studio (“Provider”) and Halcyon Ventures (“Client”)." },
    { heading: "2. Scope of Services", text: "Provider shall deliver brand strategy, product design, and quarterly design-ops support as detailed in the attached Statement of Work." },
    { heading: "3. Fees & Payment", text: "Client agrees to pay $18,500 per milestone, net 15, via the connected business wallet or wire transfer." },
    { heading: "4. Term & Termination", text: "This Agreement is effective upon signature and continues for 12 months, renewable by mutual written consent." },
  ],
};

export function canonicalDocumentText(doc: SignDocument = demoDocument): string {
  return [doc.title, ...doc.sections.map((s) => `${s.heading}: ${s.text}`)].join("\n");
}

export const SIGN_DOCUMENT_STORAGE_KEY = "origin-sign-document";
