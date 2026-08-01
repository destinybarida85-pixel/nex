"use client";

import { useEffect, useState } from "react";
import SignFlow from "@/components/sign/SignFlow";
import { demoDocument, SIGN_DOCUMENT_STORAGE_KEY, type SignDocument } from "@/components/sign/document";

// The demo/preview path: loads whatever the AI Assistant last staged in this
// same browser tab's sessionStorage (or the built-in demo document if
// nothing's staged). Not a real shareable document — for a real link anyone
// can open, see /sign/[id].
export default function SignPage() {
  const [signDocument, setSignDocument] = useState<SignDocument>(demoDocument);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(SIGN_DOCUMENT_STORAGE_KEY);
      if (stored) setSignDocument(JSON.parse(stored));
    } catch {
      // Malformed/missing storage — stay on the demo document.
    }
  }, []);

  return <SignFlow document={signDocument} />;
}
