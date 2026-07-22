export type Tenant = {
  org: string;
  initial: string;
  brand: string;
  brandLabel: string;
  plan: string;
  planTag: string;
  users: number;
  volume: string;
  domain: string;
  status: string;
  statusTag: string;
  mrr: string;
  joined: string;
  contact: string;
  poweredBy: boolean;
  activity: { label: string; meta: string }[];
};

export const tenants: Tenant[] = [
  {
    org: "Atlas Chambers",
    initial: "A",
    brand: "#63c3b2",
    brandLabel: "Custom",
    plan: "Enterprise",
    planTag: "tag-accent",
    users: 84,
    volume: "$1.2M",
    domain: "portal.atlaschambers.com",
    status: "Active",
    statusTag: "tag-neutral",
    mrr: "$4,200/mo",
    joined: "Feb 3, 2025",
    contact: "counsel@atlaschambers.com",
    poweredBy: false,
    activity: [
      { label: "Plan upgraded to Enterprise", meta: "Jun 12, 2026" },
      { label: "Custom domain verified", meta: "Mar 18, 2025" },
      { label: "Tenant created", meta: "Feb 3, 2025" },
    ],
  },
  {
    org: "Meridian Studio",
    initial: "M",
    brand: "var(--color-accent)",
    brandLabel: "Custom",
    plan: "Growth",
    planTag: "tag-accent",
    users: 14,
    volume: "$248k",
    domain: "meridian.app.co",
    status: "Active",
    statusTag: "tag-neutral",
    mrr: "$686/mo",
    joined: "Nov 20, 2025",
    contact: "amara@meridian.app.co",
    poweredBy: true,
    activity: [
      { label: "Wallet volume crossed $250k", meta: "Jul 18, 2026" },
      { label: "Upgraded from Starter", meta: "Jan 9, 2026" },
      { label: "Tenant created", meta: "Nov 20, 2025" },
    ],
  },
  {
    org: "Brightfield Academy",
    initial: "B",
    brand: "#d9a05b",
    brandLabel: "Custom",
    plan: "Standard",
    planTag: "tag-neutral",
    users: 203,
    volume: "$96k",
    domain: "brightfield.origin.io",
    status: "Active",
    statusTag: "tag-neutral",
    mrr: "$1,015/mo",
    joined: "Aug 14, 2025",
    contact: "admin@brightfield.edu",
    poweredBy: true,
    activity: [
      { label: "203rd user added", meta: "Jul 15, 2026" },
      { label: "Feature flag: payroll enabled", meta: "May 2, 2026" },
      { label: "Tenant created", meta: "Aug 14, 2025" },
    ],
  },
  {
    org: "Cascade Relief (NGO)",
    initial: "C",
    brand: "#7fa3e8",
    brandLabel: "Custom",
    plan: "Standard",
    planTag: "tag-neutral",
    users: 37,
    volume: "$310k",
    domain: "give.cascaderelief.org",
    status: "Trial",
    statusTag: "tag-outline",
    mrr: "Trial · ends Aug 4",
    joined: "Jul 5, 2026",
    contact: "ops@cascaderelief.org",
    poweredBy: true,
    activity: [
      { label: "Trial started", meta: "Jul 5, 2026" },
      { label: "Tenant created", meta: "Jul 5, 2026" },
    ],
  },
  {
    org: "Harbor City Council",
    initial: "H",
    brand: "var(--color-neutral-600)",
    brandLabel: "Default",
    plan: "Enterprise",
    planTag: "tag-accent",
    users: 512,
    volume: "$4.7M",
    domain: "services.harborcity.gov",
    status: "Onboarding",
    statusTag: "tag-outline",
    mrr: "$18,400/mo",
    joined: "Jul 14, 2026",
    contact: "it@harborcity.gov",
    poweredBy: false,
    activity: [
      { label: "Dedicated banking partner setup started", meta: "Jul 16, 2026" },
      { label: "SSO configured", meta: "Jul 15, 2026" },
      { label: "Tenant created", meta: "Jul 14, 2026" },
    ],
  },
];
