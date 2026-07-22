const BECH32_CHARS = "qpzry9x8gf2tvdw0s3jn54khce6mua7l";

export function generateBtcAddress(): string {
  const bytes = new Uint8Array(38);
  crypto.getRandomValues(bytes);
  const chars = Array.from(bytes).map((b) => BECH32_CHARS[b % BECH32_CHARS.length]).join("");
  return `bc1q${chars}`;
}

export function generateEthAddress(): string {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  const hex = Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
  return `0x${hex}`;
}

export function generateTxHash(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}
