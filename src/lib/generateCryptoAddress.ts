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

// USDT here specifically means USDT on Ethereum (ERC-20) — same address
// format as any other ERC-20 token, which is why this is identical to
// generateEthAddress rather than a distinct format.
export function generateUsdtAddress(): string {
  return generateEthAddress();
}

const BASE58_CHARS = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

export function generateBnbAddress(): string {
  const bytes = new Uint8Array(38);
  crypto.getRandomValues(bytes);
  const chars = Array.from(bytes).map((b) => BECH32_CHARS[b % BECH32_CHARS.length]).join("");
  return `bnb1${chars}`;
}

export function generateSolAddress(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map((b) => BASE58_CHARS[b % BASE58_CHARS.length]).join("");
}

export function generateTxHash(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}
