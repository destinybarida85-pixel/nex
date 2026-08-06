"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IconLock, IconLogoMark } from "@/components/icons";
import { createClient } from "@/lib/supabase/client";

export default function SuspendedPage() {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } finally {
      router.push("/signin");
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[var(--color-bg)] text-[var(--color-text)] p-8">
      <div className="w-full max-w-[440px] flex flex-col items-center text-center">
        <div className="flex items-center gap-3 mb-9">
          <IconLogoMark size={30} />
          <span style={{ fontSize: 19, fontWeight: 600 }}>Primue</span>
        </div>

        <div
          className="flex items-center justify-center rounded-full mb-6"
          style={{ width: 56, height: 56, background: "color-mix(in srgb, var(--color-accent) 16%, transparent)" }}
        >
          <IconLock size={24} className="text-[var(--color-accent-300)]" />
        </div>

        <h4 className="m-0" style={{ fontSize: 26, lineHeight: 1.2, fontWeight: 700 }}>
          This account has been suspended
        </h4>
        <p className="text-[15px] text-[var(--color-neutral-500)] mt-3.5 leading-relaxed">
          Access to your business&rsquo;s wallet, documents, and other data is on hold. Reach out to Primue support if
          you believe this is a mistake or want to resolve it.
        </p>

        <div className="flex items-center gap-3 mt-8">
          <a href="mailto:support@primue.com" className="btn btn-primary" style={{ minHeight: 48, fontSize: 15, fontWeight: 600 }}>
            Contact support
          </a>
          <button
            className="btn btn-secondary"
            style={{ minHeight: 48, fontSize: 15, fontWeight: 600 }}
            onClick={handleSignOut}
            disabled={signingOut}
          >
            {signingOut ? "Signing out…" : "Sign out"}
          </button>
        </div>
      </div>
    </div>
  );
}
