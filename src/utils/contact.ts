// A user is identified by their mobile number + email, so every order (a
// booking and the payments against it) must carry both. Shared by the
// browser (block checkout early) and the API (reject the write) so the two
// can never disagree on what counts as valid.

/** Digits only, keeping the last 10 (drops a +91 / 0 prefix). */
export function normalizePhone(raw: unknown): string {
  if (typeof raw !== "string") return "";
  const digits = raw.replace(/\D/g, "");
  return digits.length > 10 ? digits.slice(-10) : digits;
}

export function normalizeEmail(raw: unknown): string {
  return typeof raw === "string" ? raw.trim().toLowerCase() : "";
}

export function isValidPhone(phone: string): boolean {
  return /^\d{10}$/.test(phone);
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Normalized `{ phone, email }`, or null if either is missing/invalid. */
export function toUserContact(phone: unknown, email: unknown): { phone: string; email: string } | null {
  const p = normalizePhone(phone);
  const e = normalizeEmail(email);
  return isValidPhone(p) && isValidEmail(e) ? { phone: p, email: e } : null;
}
