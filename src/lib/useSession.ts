"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { isBackendConfigured } from "@/lib/backendStatus";

// True once we've checked whether a real, signed-in Supabase session exists.
// Components use this to decide whether to talk to the real backend or keep
// using local demo state (e.g. for anonymous visitors browsing the live demo).
export function useHasSession() {
  const [hasSession, setHasSession] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!isBackendConfigured) {
      setChecked(true);
      return;
    }
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      setHasSession(!!data.session);
      setChecked(true);
    });
  }, []);

  return { hasSession, checked };
}
