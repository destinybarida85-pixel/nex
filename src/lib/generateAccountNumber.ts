export function generateAccountNumber(): string {
  const bytes = new Uint32Array(3);
  crypto.getRandomValues(bytes);
  const digits = Array.from(bytes)
    .map((n) => String(n % 10000).padStart(4, "0"))
    .join("");
  return `${digits.slice(0, 4)} ${digits.slice(4, 8)} ${digits.slice(8, 12)}`;
}

export function generateRoutingNumber(): string {
  const bytes = new Uint32Array(1);
  crypto.getRandomValues(bytes);
  return String(100000000 + (bytes[0] % 900000000));
}
