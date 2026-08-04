import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isMissingColumn } from "@/lib/schema";

const isConfigured = !!(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Stamp customization (type, shape, color, wording, position, custom image)
// only exists once CompleteStep is already showing the signed document — the
// signature itself was persisted by the earlier POST /api/sign. This updates
// that same row in place, so a stamp the signer edits after the fact is still
// there the next time the document is opened, instead of only ever having
// existed in that one browser tab's React state.
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isConfigured) return NextResponse.json({ configured: false }, { status: 200 });

  const { id } = await params;
  const body = (await request.json()) as {
    label?: string;
    sub?: string;
    shape?: string;
    color?: string;
    position?: string;
    x?: number;
    y?: number;
    imageUrl?: string | null;
  };

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("signatures")
    .update({
      stamp: {
        label: body.label ?? "",
        sub: body.sub ?? "",
        shape: body.shape ?? "round",
        color: body.color ?? "#c81e1e",
        position: body.position ?? "footer",
        x: body.x ?? 82,
        y: body.y ?? 90,
        imageUrl: body.imageUrl ?? null,
      },
    })
    .eq("id", id);

  if (isMissingColumn(error)) {
    // Migration 0018 hasn't been run yet — the signature itself is still
    // safely persisted, only the stamp's exact appearance can't be saved.
    return NextResponse.json({ configured: true, saved: false });
  }
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ configured: true, saved: true });
}
