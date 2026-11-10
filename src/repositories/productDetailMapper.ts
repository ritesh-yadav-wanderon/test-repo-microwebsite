// Pure mapping from a raw product document (as returned by /api/product or a
// direct Mongo lookup) onto the trip-detail page's display model. No React/
// browser dependency — shared by the client hook (useProductData) and the
// Next.js server-side fetch (web-next/app/_lib/productDetailServer.ts), so
// there's exactly one place this mapping logic lives.

import { formatPrice, STATIC_DATA, type ProductDetail, type ProductData, type DayItinerary } from "@/repositories";
import { toGumletUrl } from "./core/images";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

/** Consecutive same-city days in dayWiseAccommodation, collapsed into
 *  {city, nights} — a real (not fabricated) per-city night breakdown. */
function deriveStays(accommodation: unknown): { city: string; nights: number }[] {
  if (!Array.isArray(accommodation)) return [];
  const stays: { city: string; nights: number }[] = [];
  for (const entry of accommodation) {
    if (!isRecord(entry) || typeof entry.city !== "string" || !entry.city) continue;
    const last = stays[stays.length - 1];
    if (last && last.city === entry.city) last.nights += 1;
    else stays.push({ city: entry.city, nights: 1 });
  }
  return stays;
}

function mapItinerary(doc: ProductDetail): DayItinerary[] {
  const accByDay = new Map<number, Record<string, unknown>>();
  for (const entry of Array.isArray(doc.dayWiseAccommodation) ? doc.dayWiseAccommodation : []) {
    if (isRecord(entry) && typeof entry.day === "number") accByDay.set(entry.day, entry);
  }
  const actByDay = new Map<number, Record<string, unknown>>();
  for (const entry of Array.isArray(doc.dayWiseActivities) ? doc.dayWiseActivities : []) {
    if (isRecord(entry) && typeof entry.day === "number") actByDay.set(entry.day, entry);
  }
  const days = [...new Set([...accByDay.keys(), ...actByDay.keys()])].sort((a, b) => a - b);

  return days.map((day) => {
    const acc = accByDay.get(day);
    const act = actByDay.get(day);
    const rawActivities = isRecord(act) && Array.isArray(act.activities) ? act.activities : [];
    const activities = rawActivities
      .filter(isRecord)
      .map((a) => ({
        title: typeof a.title === "string" ? a.title : "",
        photos: typeof a.image === "string" ? [toGumletUrl(a.image)] : undefined,
      }));

    return {
      days: `Day ${day}`,
      city: isRecord(acc) && typeof acc.city === "string" ? acc.city : "",
      photo: activities.find((a) => a.photos?.[0])?.photos?.[0] ?? "",
      items: activities.map((a) => a.title).filter(Boolean),
      stayName: isRecord(acc) && typeof acc.accommodationName === "string" ? acc.accommodationName : undefined,
      stayMeals: isRecord(acc) && Array.isArray(acc.meals) ? (acc.meals as string[]) : undefined,
      activities: activities.length ? activities : undefined,
    };
  });
}

/** Overlay real product fields onto the static Figma fixture wherever they
 *  map cleanly. Fields with no real equivalent (exclusions, effort,
 *  groupSize, bestMonths, womenBadge, map image, pickUp/drop) keep their
 *  static content — see the sanitization notes for why. */
export function mergeProductData(doc: ProductDetail): ProductData {
  const stays = deriveStays(doc.dayWiseAccommodation);
  const gallery = Array.isArray(doc.productImageGallery && (doc.productImageGallery as Record<string, unknown>).gallery)
    ? ((doc.productImageGallery as Record<string, unknown>).gallery as unknown[])
        .filter(isRecord)
        .map((g) => (typeof g.link === "string" ? toGumletUrl(g.link) : ""))
        .filter(Boolean)
    : [];

  const destination = isRecord(doc.destination) ? doc.destination : null;
  const vibe = Array.isArray(doc.productVibe) ? doc.productVibe : [];
  const captain = isRecord(doc.tripCaptainHost) ? doc.tripCaptainHost : null;
  const itinerary = mapItinerary(doc);
  const batches = Array.isArray(doc.batches) ? doc.batches : [];

  return {
    ...STATIC_DATA,
    title: typeof doc.title === "string" ? doc.title : STATIC_DATA.title,
    heroImages: gallery.length ? gallery : STATIC_DATA.heroImages,
    gallery: gallery.length ? gallery : STATIC_DATA.gallery,
    displayPrice:
      doc.startingPrice != null ? `${formatPrice(doc.startingPrice).replace("₹", "")}/-` : STATIC_DATA.displayPrice,
    breadcrumbs: destination && typeof destination.title === "string" ? [destination.title] : STATIC_DATA.breadcrumbs,
    totalBatches: batches.length ? `${batches.length} Batches` : STATIC_DATA.totalBatches,
    inclusions: Array.isArray(doc.inclusions) && doc.inclusions.length ? (doc.inclusions as string[]) : STATIC_DATA.inclusions,
    itinerary: itinerary.length ? itinerary : STATIC_DATA.itinerary,
    duration:
      typeof doc.durationNights === "number" && typeof doc.durationDays === "number"
        ? `${doc.durationNights}N · ${doc.durationDays}D`
        : STATIC_DATA.duration,
    cityStrip: stays.length ? stays.map((s) => `${s.nights}N ${s.city}`) : STATIC_DATA.cityStrip,
    motherItinerary: stays.length ? stays.map((s) => s.city) : STATIC_DATA.motherItinerary,
    motherNights: stays.length ? stays.map((s) => s.nights) : STATIC_DATA.motherNights,
    fitTags: vibe.length
      ? vibe.filter(isRecord).map((v) => ({ label: String(v.label ?? ""), rating: Number(v.rating ?? 0) }))
      : STATIC_DATA.fitTags,
    captain: captain
      ? {
          name: typeof captain.name === "string" ? captain.name : STATIC_DATA.captain.name,
          photo: STATIC_DATA.captain.photo, // no real captain photo exists
          reviews: typeof captain.reviews === "number" ? captain.reviews : STATIC_DATA.captain.reviews,
          years: typeof captain.years === "number" ? captain.years : STATIC_DATA.captain.years,
          rating: typeof captain.rating === "number" ? captain.rating : STATIC_DATA.captain.rating,
        }
      : STATIC_DATA.captain,
  };
}
