"use client";

import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import ChatPanel, { type ChatMessage } from "@/components/assistant/ChatPanel";
import DocumentPanel, { type DocumentData } from "@/components/assistant/DocumentPanel";

const documents: Record<string, DocumentData> = {
  nda: {
    title: "Mutual Non-Disclosure Agreement",
    meta: "Between Nex Inc. and Northbeam Co. · Drafted just now · v1",
    status: "Draft",
    statusTag: "tag-outline",
    body: [
      { heading: "1. Purpose", text: "The parties wish to explore a potential business relationship and, in connection with this opportunity, may disclose certain confidential information to one another." },
      { heading: "2. Confidential Information", text: "Confidential Information includes all non-public business, technical, and financial information disclosed by either party, whether oral or written, that is designated as confidential." },
      { heading: "3. Term", text: "This Agreement shall remain in effect for a period of two (2) years from the Effective Date, at which point the confidentiality obligations herein shall survive termination." },
      { heading: "4. Governing Law", text: "This Agreement shall be governed by and construed in accordance with the laws of the state in which Nex Inc. is incorporated, without regard to conflict of law principles." },
    ],
    steps: [
      { label: "Drafted", done: true },
      { label: "Sent for signature", done: false },
      { label: "Signed & sealed", done: false },
    ],
  },
  invoice: {
    title: "Invoice — INV-2042",
    meta: "Billed to Figment Design · Drafted just now · Net 15",
    status: "Draft",
    statusTag: "tag-outline",
    body: [
      { heading: "Bill to", text: "Figment Design, 118 Harbor St, Suite 4B. Payment due within 15 days of the invoice date via wire, ACH, or payment link." },
      { heading: "Line items", text: "Brand identity system — $6,200.00 · Design ops consulting (8 hrs) — $1,600.00 · Rush delivery fee — $400.00. Subtotal: $8,200.00. Tax (0%): $0.00." },
      { heading: "Total due", text: "$8,200.00, payable to Nex Inc.'s connected business wallet. A payment link and PDF copy will be attached automatically once sent." },
    ],
    steps: [
      { label: "Drafted", done: true },
      { label: "Sent to client", done: false },
      { label: "Paid", done: false },
    ],
  },
  offer: {
    title: "Offer Letter — Senior Product Manager",
    meta: "Candidate: D. Osei · Drafted just now · Confidential",
    status: "Draft",
    statusTag: "tag-outline",
    body: [
      { heading: "Position", text: "We are pleased to offer you the position of Senior Product Manager, reporting to the VP of Product, with an anticipated start date to be confirmed." },
      { heading: "Compensation", text: "Base salary of $148,000 annually, paid on a semi-monthly basis, plus eligibility for the company's annual performance bonus and equity refresh program." },
      { heading: "Benefits", text: "Full medical, dental, and vision coverage, 401(k) with 4% match, unlimited PTO, and a $1,500 annual learning & development stipend." },
    ],
    steps: [
      { label: "Drafted", done: true },
      { label: "Sent for signature", done: false },
      { label: "Signed & sealed", done: false },
    ],
  },
  report: {
    title: "Cost Review — Q3 Software Spend",
    meta: "Generated for Meridian Studio · Drafted just now",
    status: "Ready",
    statusTag: "tag-accent",
    body: [
      { heading: "Summary", text: "Software spend rose 22% quarter-over-quarter, driven primarily by seat expansion on design and analytics tooling rather than new vendor additions." },
      { heading: "Top drivers", text: "Design suite (+$1,240/mo), analytics platform (+$680/mo), and a new AI writing tool (+$320/mo) account for the majority of the increase." },
      { heading: "Recommendation", text: "Consolidate two overlapping analytics tools to recover an estimated $410/mo, and move five inactive design seats to a lower tier." },
    ],
    steps: [
      { label: "Drafted", done: true },
      { label: "Reviewed", done: false },
      { label: "Shared with team", done: false },
    ],
  },
};

function pickDocument(prompt: string): { key: string; aiReply: string } {
  const p = prompt.toLowerCase();
  if (p.includes("invoice")) {
    return { key: "invoice", aiReply: "Drafted invoice INV-2042 for Figment Design, net 15 terms. Review it on the right, then send it whenever you're ready." };
  }
  if (p.includes("offer")) {
    return { key: "offer", aiReply: "Drafted an offer letter for D. Osei — Senior Product Manager, $148,000 base. Take a look on the right." };
  }
  if (p.includes("report") || p.includes("summar") || p.includes("cost")) {
    return { key: "report", aiReply: "Here's the cost-review summary — software spend is up 22% this quarter, mostly from seat expansion. Full breakdown on the right." };
  }
  return { key: "nda", aiReply: "Drafted a mutual NDA for Northbeam Co. with a 2-year survival clause. Review it on the right, then send it for signature whenever you're ready." };
}

const initialMessages: ChatMessage[] = [
  { role: "user", text: "Draft an NDA for Northbeam Co., standard mutual terms, 2-year survival." },
  { role: "ai", text: "Done — I've drafted a mutual NDA for Northbeam Co. with a 2-year survival clause. Review it on the right, then send it for signature whenever you're ready." },
];

export default function AssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [docKey, setDocKey] = useState("nda");
  const [thinking, setThinking] = useState(false);

  function handleSend(text: string) {
    setMessages((prev) => [...prev, { role: "user", text }]);
    setThinking(true);
    const { key, aiReply } = pickDocument(text);
    setTimeout(() => {
      setDocKey(key);
      setMessages((prev) => [...prev, { role: "ai", text: aiReply }]);
      setThinking(false);
    }, 700);
  }

  return (
    <div className="flex h-screen bg-[var(--color-bg)] overflow-hidden">
      <Sidebar active="AI Assistant" />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <div className="flex-1 flex min-h-0">
          <ChatPanel messages={messages} thinking={thinking} onSend={handleSend} />
          <DocumentPanel document={documents[docKey]} />
        </div>
      </div>
    </div>
  );
}
