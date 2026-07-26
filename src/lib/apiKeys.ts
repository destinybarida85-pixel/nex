async function sha256(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function generateApiKey(): Promise<{ plaintext: string; prefix: string; hash: string }> {
  const random = crypto.randomUUID().replace(/-/g, "") + crypto.randomUUID().replace(/-/g, "");
  const plaintext = `origin_sk_${random}`;
  const prefix = plaintext.slice(0, 14);
  const hash = await sha256(plaintext);
  return { plaintext, prefix, hash };
}

export async function hashApiKey(key: string): Promise<string> {
  return sha256(key);
}
