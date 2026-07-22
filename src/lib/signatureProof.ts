async function sha256(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function hashDocument(content: string): Promise<string> {
  return sha256(content);
}

export async function hashSignature(signatureData: string): Promise<string> {
  return sha256(signatureData);
}

// Chains this signature to whatever came before it on the same document, so that
// editing any earlier field (document text, signer identity, prior signature) changes
// every record_hash computed after it. That's what makes the chain tamper-evident.
export async function computeRecordHash(input: {
  documentHash: string;
  signerName: string;
  signerEmail: string;
  signatureHash: string;
  previousHash: string | null;
  signedAt: string;
}): Promise<string> {
  const material = [
    input.documentHash,
    input.signerName,
    input.signerEmail,
    input.signatureHash,
    input.previousHash ?? "genesis",
    input.signedAt,
  ].join("|");
  return sha256(material);
}

export function formatCertificateId(recordHash: string): string {
  return `OG-CERT-${recordHash.slice(0, 8).toUpperCase()}-${recordHash.slice(8, 12).toUpperCase()}`;
}
