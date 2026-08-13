"use client";

import { useEffect, useState } from "react";

export default function IntegrationsPanel() {
  const [url, setUrl] = useState("");
  const [saved, setSaved] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/tenant")
      .then((r) => r.json())
      .then((data) => {
        if (data.configured && data.tenant) {
          const existing = data.tenant.external_website_url ?? null;
          setSaved(existing);
          setUrl(existing ?? "");
        }
      })
      .catch(() => {});
  }, []);

  async function save() {
    setSaving(true);
    setError("");
    try {
      const trimmed = url.trim();
      if (trimmed && !/^https?:\/\/.+\..+/.test(trimmed)) {
        throw new Error("Enter a full URL, including https://");
      }
      const res = await fetch("/api/tenant", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ externalWebsiteUrl: trimmed || null }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Couldn't save that.");
      setSaved(trimmed || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't reach the server.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-5 max-w-[600px]">
      <div>
        <h3 className="m-0 text-[22px]" style={{ color: "#fff" }}>Integrations</h3>
        <div className="text-[13.5px] mt-1.5" style={{ color: "#a8a8a8" }}>
          Already have a website? Link it here instead of using Primue&rsquo;s own white-label site builder — your
          own domain stays exactly what your clients see.
        </div>
      </div>

      <div className="card elev-sm gap-3 p-5" style={{ background: "#161616", border: "1px solid rgba(255,255,255,0.14)" }}>
        <div className="field">
          <label style={{ fontSize: 12, fontWeight: 600, color: "#8a8a8a" }}>Your website</label>
          <input
            className="input text-[14px]"
            style={{ background: "#0a0a0a", color: "#f5f5f5", border: "1px solid rgba(255,255,255,0.14)" }}
            placeholder="https://yourbusiness.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
        {error && <div className="text-[12px]" style={{ color: "#ff8a8a" }}>{error}</div>}
        {saved && !error && (
          <div className="text-[12px]" style={{ color: "#8fd6a8" }}>
            Linked — {saved}
          </div>
        )}
        <button
          className="btn text-[13.5px] self-start"
          style={{ background: "#fff", color: "#0a0a0a", border: "1px solid #fff" }}
          onClick={save}
          disabled={saving}
        >
          {saving ? "Saving…" : "Save"}
        </button>
      </div>

      <div className="text-[12px]" style={{ color: "#6b6b6b" }}>
        This just tells Primue where your real site lives — it doesn&rsquo;t change or take over anything on it.
        Want a Primue-built white-label site instead? That&rsquo;s under{" "}
        <a href="/whitelabel" style={{ color: "#fff" }}>White-label</a> on the main dashboard.
      </div>
    </div>
  );
}
