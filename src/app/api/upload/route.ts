import { NextResponse } from "next/server";
import { requireTenant } from "@/lib/requireTenant";
import { createAdminClient } from "@/lib/supabase/admin";
import { isBackendConfigured } from "@/lib/backendStatus";

const ALLOWED_TYPES = new Set(["image/png", "image/jpeg", "image/webp", "image/svg+xml", "image/gif"]);
const MAX_BYTES = 5 * 1024 * 1024;

function extensionFor(type: string) {
  if (type === "image/png") return "png";
  if (type === "image/jpeg") return "jpg";
  if (type === "image/webp") return "webp";
  if (type === "image/svg+xml") return "svg";
  if (type === "image/gif") return "gif";
  return "bin";
}

// Real file storage for tenant branding assets (logo, header image) — replaces
// the earlier approach of inlining the whole file as a base64 data URI directly
// into the tenants table, which bloated every API response that included
// tenant branding (the public site, the whitelabel page, template previews).
export async function POST(request: Request) {
  if (!isBackendConfigured) return NextResponse.json({ error: "Backend isn't connected yet." }, { status: 200 });

  const { error, status, tenantId } = await requireTenant();
  if (error) return NextResponse.json({ error }, { status });

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json({ error: "Unsupported image type. Use PNG, JPEG, WebP, GIF, or SVG." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Image is too large (max 5MB)." }, { status: 400 });
  }

  const admin = createAdminClient();
  const path = `${tenantId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extensionFor(file.type)}`;
  const bytes = new Uint8Array(await file.arrayBuffer());

  const { error: uploadError } = await admin.storage.from("tenant-assets").upload(path, bytes, {
    contentType: file.type,
    upsert: false,
  });
  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });

  const { data: publicUrl } = admin.storage.from("tenant-assets").getPublicUrl(path);
  return NextResponse.json({ url: publicUrl.publicUrl });
}
