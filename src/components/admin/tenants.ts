// Matches the shape returned by GET /api/admin — see that route for how each
// field is actually computed. No more hand-written fake rows here: this file
// used to ship 5 invented organizations (fake user counts, fake MRR, a fake
// "recent activity" feed) that looked identical to real data with nothing
// marking any of it as a demo.
export type Tenant = {
  id: string;
  name: string;
  domain: string | null;
  brandColor: string | null;
  plan: string;
  subscriptionStatus: string;
  poweredByBadge: boolean;
  suspended: boolean;
  createdAt: string;
  ownerEmail: string | null;
  users: number;
  walletVolume30dCents: number;
  mrrCents: number;
};
