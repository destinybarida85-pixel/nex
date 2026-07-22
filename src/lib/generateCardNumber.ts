export function generateCardNumber(): string {
  const bytes = new Uint8Array(14);
  crypto.getRandomValues(bytes);
  const body = "4" + Array.from(bytes).map((b) => b % 10).join("").slice(0, 14);

  let sum = 0;
  for (let i = 0; i < body.length; i++) {
    let d = Number(body[body.length - 1 - i]);
    if (i % 2 === 0) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
  }
  const check = (10 - (sum % 10)) % 10;
  const digits = body + check;
  return digits.match(/.{1,4}/g)!.join(" ");
}

export function generateExpiry(): string {
  const now = new Date();
  const month = 1 + Math.floor(Math.random() * 12);
  const year = now.getFullYear() + 3 + Math.floor(Math.random() * 2);
  return `${String(month).padStart(2, "0")}/${String(year).slice(2)}`;
}

export function generateCVC(): string {
  const bytes = new Uint8Array(1);
  crypto.getRandomValues(bytes);
  return String(100 + (bytes[0] % 900));
}
