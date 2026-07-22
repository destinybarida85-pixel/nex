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
        <div className="flex items-center gap-3 mb-11">
          <IconLogoMark size={34} />
          <span style={{ fontSize: 19, fontWeight: 600 }}>Origin</span>
        </div>
        <div className="mb-4">
          <h4 className="m-0" style={{ fontSize: 38, lineHeight: 1.1, fontWeight: 700 }}>Check your email</h4>
          <div className="text-[16px] text-[var(--color-neutral-500)] mt-3.5 leading-[1.6]">
            We sent a confirmation link to <strong className="text-[var(--color-text)]">{email}</strong>. Click it to
            activate your account, then come back and sign in.
          </div>
        </div>
        <a
          href="/signin"
          className="btn btn-secondary btn-block mt-7"
          style={{ minHeight: 56, fontSize: 16, fontWeight: 600 }}
        >
          Back to sign in
        </a>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <div className="flex items-center gap-3 mb-11">
        <IconLogoMark size={34} />
        <span style={{ fontSize: 19, fontWeight: 600 }}>Origin</span>
      </div>
      <div className="mb-9">
        <h4 className="m-0" style={{ fontSize: 42, lineHeight: 1.1, fontWeight: 700 }}>Create your account</h4>
        <div className="text-[16px] text-[var(--color-neutral-500)] mt-2.5">Start free. No card required.</div>
      </div>

      <button
        className="btn btn-secondary btn-block gap-3"
        style={{ marginTop: 0, minHeight: 56, fontSize: 16, fontWeight: 600 }}
        onClick={handleGoogle}
        disabled={!!loading}
      >
        <IconGoogle size={20} />
        {loading === "google" ? "Connecting to Google…" : "Continue with Google"}
      </button>

      <div className="flex items-center gap-3 text-[14px] text-[var(--color-neutral-600)] my-7">
        <span className="flex-1 h-px bg-[var(--color-divider)]" />
        or
        <span className="flex-1 h-px bg-[var(--color-divider)]" />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="field">
          <label style={{ fontSize: 15, fontWeight: 600 }}>Full name</label>
          <input
            className="input"
            style={{ minHeight: 56, fontSize: 16, padding: "12px 16px" }}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Amara Osei"
          />
        </div>
        <div className="field">
          <label style={{ fontSize: 15, fontWeight: 600 }}>Work email</label>
          <input
            className="input"
            style={{ minHeight: 56, fontSize: 16, padding: "12px 16px" }}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
          />
        </div>
        <div className="field">
          <label style={{ fontSize: 15, fontWeight: 600 }}>Password</label>
          <input
            className="input"
            style={{ minHeight: 56, fontSize: 16, padding: "12px 16px" }}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
          />
        </div>
        {error && <div className="text-[14px]" style={{ color: "var(--color-accent-300)" }}>{error}</div>}
        <button
          className="btn btn-primary btn-block"
          style={{ marginTop: 6, minHeight: 56, fontSize: 17, fontWeight: 700 }}
          disabled={!!loading}
        >
          {loading === "email" ? "Creating account…" : "Create account"}
        </button>
      </form>

      <div className="text-[13.5px] leading-[1.5] text-[var(--color-neutral-600)] text-center mt-6">
        By continuing, you agree to Origin&rsquo;s Terms of Service and Privacy Policy.
      </div>

      <div className="text-[15px] text-[var(--color-neutral-500)] text-center mt-6">
        Already have an account? <a href="/signin" style={{ color: "var(--color-accent-300)", fontWeight: 600 }}>Sign in</a>
      </div>
    </AuthShell>
  );
}
