// Trips: upcoming groups (home), the flat listing model (search/destination),
// single products, and the related-trips pool.
//
// The CMS exposes one endpoint for all of it, so the raw document is fetched
// and cached once and both projections are derived from that single copy.

import type { ApiResult, Trip, TripDestination, TripGroup } from "@/types";
import { ENDPOINTS } from "./core/config";
import { cachedRequest, peekCache } from "./core/cache";
import { getJSON, isRecord } from "./core/http";
import { IMAGE_WIDTHS, sizedImageUrl } from "./core/images";
import { SAMPLE_UPCOMING_TRIPS } from "./fixtures/sampleData";

const RAW_KEY = "cms:upcoming-trips";
const UPCOMING_KEY = "trips:upcoming";
const LISTING_KEY = "trips:listing";

/**
 * Card image: `images2.card` wins, then `images2.cover`, then a plain URL.
 * Sized for the widest card that shows it; narrower surfaces can re-size with
 * `sizedImageUrl`.
 */
function resolveImage(trip: Record<string, unknown>): string {
  const raw = pickImageUrl(trip);
  return raw ? sizedImageUrl(raw, IMAGE_WIDTHS.card) : "";
}

function pickImageUrl(trip: Record<string, unknown>): string {
  const images2 = trip.images2;
  if (isRecord(images2)) {
    const card = images2.card;
    if (isRecord(card) && typeof card.link === "string" && card.link.startsWith("http")) return card.link;
    const cover = images2.cover;
    if (isRecord(cover) && typeof cover.link === "string" && cover.link.startsWith("http")) return cover.link;
  }
  const img = trip.image;
  if (typeof img === "string" && img.startsWith("http")) return img;
  return "";
}

function formatPrice(raw: unknown): string {
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
function fmtBatchDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
}

function normalizeTripGroups(groups: unknown[]): TripGroup[] {
  return groups.map((g) => {
    if (!isRecord(g)) return g as TripGroup;
    const tripsArray = Array.isArray(g.tripsArray)
      ? g.tripsArray.map((t: unknown) => {
          if (!isRecord(t)) return t;
          return { ...t, image: resolveImage(t), startingPrice: formatPrice(t.startingPrice) };
        })
      : [];
    return { ...g, tripsArray } as TripGroup;
  });
}

/** Map one raw CMS trip onto the listing card model, or null if unusable. */
function toListingTrip(raw: Record<string, unknown>): Trip | null {
  const slug = typeof raw.slug === "string" ? raw.slug : "";
  if (!slug) return null;

  const priceRaw = typeof raw.startingPrice === "number" ? raw.startingPrice : 0;
  if (priceRaw < 1000) return null; // filter out test entries

  const image = resolveImage(raw);
  if (!image) return null; // skip trips with no card image

  const title = typeof raw.title === "string" ? raw.title.trim() : "";
  if (!title) return null;

  const batches: string[] = Array.isArray(raw.batches)
    ? (raw.batches as unknown[]).filter((b): b is string => typeof b === "string")
    : [];

  const destinations: TripDestination[] = Array.isArray(raw.destinations)
    ? (raw.destinations as unknown[])
        .filter(isRecord)
        .map((d) => ({
          title: typeof d.title === "string" ? d.title : "",
          slug: typeof d.slug === "string" ? d.slug : "",
          isInternational: Boolean(d.isInternational),
        }))
        .filter((d) => d.title)
    : [];

  const dur = isRecord(raw.duration) ? raw.duration : null;
  const duration =
    dur && typeof dur.nights === "number" && typeof dur.days === "number"
      ? { nights: dur.nights, days: dur.days }
      : undefined;

  const features: string[] = Array.isArray(raw.features)
    ? (raw.features as unknown[]).filter((f): f is string => typeof f === "string")
    : [];

  const categories: string[] = Array.isArray(raw.categories)
    ? (raw.categories as unknown[]).filter((c): c is string => typeof c === "string")
    : [];

  return {
    slug,
    title,
    image,
    startingPrice: formatPrice(raw.startingPrice),
    duration,
    skeletonItinerary: destinations.map((d) => d.title),
    features,
    batches,
    categories,
    destinations,
    joinedCount: "20+",
    firstBatch: batches[0] ? fmtBatchDate(batches[0]) : undefined,
    recommended: Boolean(raw.isPromoted),
    womenOnly: Boolean(raw.womenOnly),
  };
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
 * Raw month groups straight off the CMS, cached so the upcoming and listing
 * projections share one network round-trip. `groups` is empty when the request
 * failed or came back with nothing usable.
 */
function loadRawGroups(): Promise<unknown[]> {
  return cachedRequest(RAW_KEY, async () => {
    try {
      const data = await getJSON(ENDPOINTS.upcomingTrips);
      const groups = Array.isArray(data)
        ? data
        : isRecord(data) && Array.isArray(data.data)
        ? (data.data as unknown[])
        : [];
      if (!groups.length) throw new Error("empty upcomingTrips");
      return groups;
    } catch (err) {
      console.warn(
        "[tripRepository] upcomingTrips unavailable, using sample data:",
        err instanceof Error ? err.message : String(err)
      );
      return [];
    }
  });
}

/** Upcoming group trips by month, as rendered on the home page. */
export function getUpcomingTrips(): Promise<ApiResult<TripGroup[]>> {
  return cachedRequest(UPCOMING_KEY, async () => {
    const groups = await loadRawGroups();
    if (!groups.length) {
      return { data: SAMPLE_UPCOMING_TRIPS, source: "sample" } satisfies ApiResult<TripGroup[]>;
    }
    return { data: normalizeTripGroups(groups), source: "live" } satisfies ApiResult<TripGroup[]>;
  });
}

export function getCachedUpcomingTrips(): ApiResult<TripGroup[]> | undefined {
  return peekCache(UPCOMING_KEY);
}

/** Flat, deduplicated trip list for the listing and destination pages. */
export function getListingTrips(): Promise<Trip[]> {
  return cachedRequest(LISTING_KEY, async () => {
    const groups = await loadRawGroups();
    const mapped: Trip[] = [];

    for (const group of groups) {
      if (!isRecord(group)) continue;
      const arr = group.tripsArray;
      if (!Array.isArray(arr)) continue;
      for (const raw of arr) {
        if (!isRecord(raw)) continue;
        const trip = toListingTrip(raw);
        if (trip) mapped.push(trip);
      }
    }

    const trips = dedupeBySlug(mapped);
    if (!trips.length) return getSampleTripPool();

    // Show the recommended card variant on a few trips regardless of API flag.
    trips.forEach((t, i) => {
      t.recommended = i < 3;
    });
    return trips;
  });
}

export function getCachedListingTrips(): Trip[] | undefined {
  return peekCache(LISTING_KEY);
}

/** Single trip document by slug. Read-only GET. */
export function getTripBySlug(slug: string): Promise<unknown> {
  return cachedRequest(`trip:${slug}`, () => getJSON(ENDPOINTS.tripBySlug(slug)));
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
