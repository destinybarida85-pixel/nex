"use client";

import { useEffect, useState } from "react";
import { IconDownload } from "@/components/icons";
import { useHasSession } from "@/lib/useSession";
import { isBackendConfigured } from "@/lib/backendStatus";

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

export default function DashboardHeader() {
  const { hasSession, checked } = useHasSession();
  const [firstName, setFirstName] = useState("Amara");
  const [tenantName, setTenantName] = useState("Meridian Studio");

  useEffect(() => {
    if (!checked || !isBackendConfigured || !hasSession) return;
    fetch("/api/me")
      .then((r) => r.json())
      .then((data) => {
        if (!data.configured) return;
        if (data.fullName) setFirstName(data.fullName.split(" ")[0]);
        if (data.tenantName) setTenantName(data.tenantName);
      })
      .catch(() => {
        // Stay on the demo values on any failure.
      });
  }, [checked, hasSession]);

  return (
    <div className="flex items-end gap-3.5 flex-wrap">
      <div>
        <h3 className="m-0 text-[22px]">{greeting()}, {firstName}</h3>
        <div className="text-muted text-[12.5px] mt-[3px]">
          {today} · Here&rsquo;s where {tenantName} stands.
        </div>
      </div>
      <div className="flex-1 hidden sm:block" />
      <div className="seg">
        <label className="seg-opt">
          <input type="radio" name="range1a" defaultChecked />
          <span>30 days</span>
        </label>
        <label className="seg-opt">
          <input type="radio" name="range1a" />
          <span>Quarter</span>
        </label>
        <label className="seg-opt">
          <input type="radio" name="range1a" />
          <span>Year</span>
        </label>
      </div>
      <button className="btn btn-secondary text-[13px]">
        <IconDownload size={14} />
        Statement
      </button>
    </div>
  );
}
