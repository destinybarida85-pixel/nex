"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import { IconCheckCircle, IconArrowRight } from "@/components/icons";

type PlanKey = "starter" | "growth";

const plans: { key: PlanKey; name: string; price: string; features: string[] }[] = [
  {
    key: "starter",
    name: "Starter",
    price: "$25/mo",
    features: ["Business wallet + 3 users", "Unlimited AI documents", "E-signatures included", "Core dashboard & invoicing"],
  },
  {
    key: "growth",
    name: "Growth",
    price: "$35/mo",
    features: ["Everything in Starter", "E-signatures + official digital stamps", "Payroll, CRM, projects, analytics", "White-label branding + custom domain"],
  },
];

export default function BillingPage() {
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState("none");
  const [status, setStatus] = useState("none");
  const [working, setWorking] = useState<PlanKey | "portal" | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/billing")
      .then((r) => r.json())
      .then((data) => {
        if (data.configured && data.plan) {
          setPlan(data.plan);
          setStatus(data.status);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function subscribe(planKey: PlanKey) {
    setWorking(planKey);
    setError("");
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planKey }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      setError(data.error || "Couldn't start checkout.");
    } catch {
      setError("Couldn't reach the server.");
    }
    setWorking(null);
  }

  async function openPortal() {
    setWorking("portal");
    setError("");
    try {
      const res = await fetch("/api/billing/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      setError(data.error || "Couldn't open billing management.");
    } catch {
      setError("Couldn't reach the server.");
    }
    setWorking(null);
  }

  const isActive = plan !== "none" && status !== "none" && status !== "canceled";

  return (
    <div className="flex min-h-screen bg-[var(--color-bg)]">
      <Sidebar active="Billing" />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <main className="p-4 pt-16 sm:p-[24px_28px_28px] flex flex-col gap-5 min-w-0 max-w-[900px]">
          <div>
            <h3 className="m-0 text-[22px]">Billing</h3>
            <div className="text-muted text-[12.5px] mt-[3px]">Manage your Origin subscription.</div>
          </div>

          {loading ? (
            <div className="text-[12.5px] text-[var(--color-neutral-500)]">Loading…</div>
          ) : isActive ? (
            <div className="card elev-sm p-5 gap-3">
              <div className="flex items-center gap-2">
                <IconCheckCircle size={16} className="text-[var(--color-accent)]" />
                <div className="card-title text-[14.5px]">
                  You&rsquo;re on the {plan === "growth" ? "Growth" : "Starter"} plan
                </div>
                <span className="tag tag-accent text-[9.5px] ml-auto">{status}</span>
              </div>
              <button className="btn btn-secondary text-[12.5px]" style={{ width: "fit-content" }} onClick={openPortal} disabled={working === "portal"}>
                {working === "portal" ? "Loading…" : "Manage billing"}
              </button>
              {error && <div className="text-[12px]" style={{ color: "var(--color-accent-300)" }}>{error}</div>}
            </div>
          ) : (
            <>
              <div className="grid gap-3.5 grid-cols-1 sm:grid-cols-2">
                {plans.map((p) => (
                  <div key={p.key} className="card elev-sm p-5 gap-2.5">
                    <div className="card-title text-[15px]">{p.name}</div>
                    <div className="font-medium text-[26px]">{p.price}</div>
                    <div className="flex flex-col gap-1.5 text-[12.5px] text-[var(--color-neutral-300)] mt-1">
                      {p.features.map((f) => (
                        <span key={f}>· {f}</span>
                      ))}
                    </div>
                    <button
                      className="btn btn-primary text-[12.5px] mt-2"
                      onClick={() => subscribe(p.key)}
                      disabled={working === p.key}
                    >
                      {working === p.key ? "Starting checkout…" : "Start 7-day trial"}
                      <IconArrowRight size={13} />
                    </button>
                  </div>
                ))}
              </div>
              {error && <div className="text-[12px]" style={{ color: "var(--color-accent-300)" }}>{error}</div>}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
