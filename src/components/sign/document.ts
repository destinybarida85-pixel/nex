export const demoDocument = {
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

export function canonicalDocumentText(): string {
  return [demoDocument.title, ...demoDocument.sections.map((s) => `${s.heading}: ${s.text}`)].join("\n");
}
