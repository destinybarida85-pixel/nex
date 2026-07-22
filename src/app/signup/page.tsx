"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthShell from "@/components/auth/AuthShell";
import { IconGoogle, IconLogoMark } from "@/components/icons";
import { createClient } from "@/lib/supabase/client";
import { isBackendConfigured } from "@/lib/backendStatus";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState<"google" | "email" | null>(null);
  const [checkEmail, setCheckEmail] = useState(false);

  async function handleGoogle() {
    if (!isBackendConfigured) {
      setError("Backend isn't connected yet, so Google sign-in isn't live. Ask your developer to add Supabase credentials.");
      return;
    }
    setLoading("google");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
    if (error) {
      setError(error.message);
      setLoading(null);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Fill in your name, email and password.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (!isBackendConfigured) {
      setError("Backend isn't connected yet, so accounts can't be created for real. Ask your developer to add Supabase credentials.");
      return;
    }
    setError("");
    setLoading("email");
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name, company_name: `${name}'s Business` } },
    });
    if (error) {
      setError(error.message);
      setLoading(null);
      return;
    }
    if (data.session) {
      router.push("/dashboard");
    } else {
      // Email confirmation is on by default for new Supabase projects.
      setCheckEmail(true);
      setLoading(null);
    }
  }

  if (checkEmail) {
    return (
      <AuthShell>
        <div className="flex items-center gap-2.5 mb-10">
          <IconLogoMark size={30} />
          <span className="text-[17px] font-medium">Origin</span>
        </div>
        <div className="mb-3">
          <h4 className="m-0" style={{ fontSize: 30, lineHeight: 1.15 }}>Check your email</h4>
          <div className="text-[15px] text-[var(--color-neutral-500)] mt-3 leading-[1.6]">
            We sent a confirmation link to <strong className="text-[var(--color-text)]">{email}</strong>. Click it to
            activate your account, then come back and sign in.
          </div>
        </div>
        <a href="/signin" className="btn btn-secondary btn-block mt-6" style={{ minHeight: 52, fontSize: 15 }}>
          Back to sign in
        </a>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <div className="flex items-center gap-2.5 mb-10">
        <IconLogoMark size={30} />
        <span className="text-[17px] font-medium">Origin</span>
      </div>
      <div className="mb-8">
        <h4 className="m-0" style={{ fontSize: 34, lineHeight: 1.15 }}>Create your account</h4>
        <div className="text-[15px] text-[var(--color-neutral-500)] mt-2">Start free. No card required.</div>
      </div>

      <button
        className="btn btn-secondary btn-block gap-3"
        style={{ marginTop: 0, minHeight: 52, fontSize: 15 }}
        onClick={handleGoogle}
        disabled={!!loading}
      >
        <IconGoogle size={19} />
        {loading === "google" ? "Connecting to Google…" : "Continue with Google"}
      </button>

      <div className="flex items-center gap-3 text-[13px] text-[var(--color-neutral-600)] my-6">
        <span className="flex-1 h-px bg-[var(--color-divider)]" />
        or
        <span className="flex-1 h-px bg-[var(--color-divider)]" />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="field">
          <label style={{ fontSize: 14 }}>Full name</label>
          <input
            className="input"
            style={{ minHeight: 52, fontSize: 15, padding: "10px 14px" }}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Amara Osei"
          />
        </div>
        <div className="field">
          <label style={{ fontSize: 14 }}>Work email</label>
          <input
            className="input"
            style={{ minHeight: 52, fontSize: 15, padding: "10px 14px" }}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
          />
        </div>
        <div className="field">
          <label style={{ fontSize: 14 }}>Password</label>
          <input
            className="input"
            style={{ minHeight: 52, fontSize: 15, padding: "10px 14px" }}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
          />
        </div>
        {error && <div className="text-[13px]" style={{ color: "var(--color-accent-300)" }}>{error}</div>}
        <button
          className="btn btn-primary btn-block"
          style={{ marginTop: 6, minHeight: 52, fontSize: 15.5 }}
          disabled={!!loading}
        >
          {loading === "email" ? "Creating account…" : "Create account"}
        </button>
      </form>

      <div className="text-[12.5px] leading-[1.5] text-[var(--color-neutral-600)] text-center mt-5">
        By continuing, you agree to Origin&rsquo;s Terms of Service and Privacy Policy.
      </div>

      <div className="text-[14px] text-[var(--color-neutral-500)] text-center mt-5">
        Already have an account? <a href="/signin" style={{ color: "var(--color-accent-300)" }}>Sign in</a>
      </div>
    </AuthShell>
  );
}
