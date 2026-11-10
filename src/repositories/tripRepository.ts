// Trips: price/date formatting shared by the product mappers, and the
// sample-backed related-trips pool. Live trip data comes from the product
// API (productRepository.ts).

import type { Trip } from "@/types";
import { SAMPLE_UPCOMING_TRIPS } from "./fixtures/sampleData";

export function formatPrice(raw: unknown): string {
  const toRupee = (n: number) => "₹" + n.toLocaleString("en-IN");
  if (typeof raw === "number" && !isNaN(raw)) {
    // Values < 1000 are stored in thousands (e.g. 10 = ₹10,000)
    return toRupee(raw < 1000 ? raw * 1000 : raw);
  }
  if (typeof raw === "string" && raw.trim()) {
    const s = raw.trim();
    if (s.startsWith("₹")) return s;
    const n = Number(s.replace(/,/g, ""));
    if (!isNaN(n)) return toRupee(n < 1000 ? n * 1000 : n);
    return s;
  }
  return "";
}

/** Format a YYYY-MM-DD batch date as "09 May" style label. */
export function fmtBatchDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
}

/** Deduplicate trips by slug, keeping the first occurrence. */
function dedupeBySlug(trips: Trip[]): Trip[] {
  const seen = new Set<string>();
  return trips.filter((t) => {
    if (seen.has(t.slug)) return false;
    seen.add(t.slug);
    return true;
  });
}

/**
 * Deduplicated pool of trips used for "more trips like this" strips and the
 * compare picker. Sample-backed: those surfaces show a stable set rather than
 * whatever the listing happens to return.
 */
export function getSampleTripPool(): Trip[] {
  return dedupeBySlug(SAMPLE_UPCOMING_TRIPS.flatMap((g) => g.tripsArray ?? []));
}

/**
 * Whether a trip belongs to a destination — matched on slug, title, itinerary
 * cities or the destinations array.
 */
export function tripMatchesDestination(trip: Trip, destination: string): boolean {
  const d = destination.trim().toLowerCase();
  if (!d) return true;
  return (
    trip.slug.toLowerCase().includes(d) ||
    trip.title.toLowerCase().includes(d) ||
    (trip.skeletonItinerary ?? []).some((c) => c.toLowerCase().includes(d)) ||
    (trip.destinations ?? []).some(
      (x) => x.title.toLowerCase().includes(d) || x.slug.toLowerCase().includes(d)
    )
  );
}

/**
 * Trips to offer alongside a product: those matching `destination`, or the
 * whole pool when nothing matches, so the strip is never empty.
 */
export function getRelatedTrips(destination: string, excludeSlug?: string): Trip[] {
  const pool = getSampleTripPool().filter((t) => t.slug !== excludeSlug);
  if (!destination.trim()) return pool;

  const matched = pool.filter((t) => tripMatchesDestination(t, destination));
  return matched.length ? matched : pool;
}
