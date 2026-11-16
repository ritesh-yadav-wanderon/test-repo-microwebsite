// ─────────────────────────────────────────────────────────────────────────────
// PLACEHOLDER DATA — made-up values for fields the product schema does not
// have yet. Every fabricated value on the product page comes from this file,
// so it can be deleted wholesale once the schema lands.
// Tracked in SCHEMA_TODO.md at the repo root; each export names its task.
// ─────────────────────────────────────────────────────────────────────────────

/** Stable 32-bit hash so the same hotel/city always gets the same made-up
 *  value (no flicker between server and client renders, or between visits). */
function hash(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** SCHEMA_TODO #1 — `dayWiseAccommodation[].rating`.
 *  Made-up hotel rating between 4.2 and 4.9, deterministic per hotel name. */
export function placeholderHotelRating(hotelName: string): number {
  return Math.round((4.2 + (hash(hotelName.trim().toLowerCase()) % 8) / 10) * 10) / 10;
}

const PREMIUM_TEMPLATES = [
  (city: string) => `Private sunset experience in ${city}`,
  (city: string) => `Guided heritage walk through ${city}`,
];

/** SCHEMA_TODO #2 — premium-tier activities (`packageTier` on activities).
 *  Two made-up "Available for Premium Package" activities built from the
 *  trip's own cities, reusing the trip's activity photos. */
export function placeholderPremiumActivities(
  cities: string[],
  photos: (string | undefined)[]
): { title: string; photo?: string }[] {
  const unique = [...new Set(cities.filter(Boolean))];
  if (!unique.length) return [];
  const usable = photos.filter((p): p is string => Boolean(p));
  return PREMIUM_TEMPLATES.map((make, i) => ({
    title: make(unique[(unique.length - 1 - i + unique.length) % unique.length]),
    photo: usable.length ? usable[(usable.length - 1 - i + usable.length) % usable.length] : undefined,
  }));
}
