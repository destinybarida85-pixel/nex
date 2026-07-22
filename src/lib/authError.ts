export function formatAuthError(error: unknown, fallback: string): string {
  if (error && typeof error === "object" && "message" in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === "string" && message.trim() && message.trim() !== "{}") {
      return message;
    }
  }
  return fallback;
}
