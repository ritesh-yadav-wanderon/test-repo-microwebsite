import type { ApiSource, Destination, Trip, TripDestination, TripGroup } from "../types";
import { ENDPOINTS } from "./config";
import {
  SAMPLE_UPCOMING_TRIPS,
  SAMPLE_DOMESTIC_DESTINATIONS,
  SAMPLE_INTERNATIONAL_DESTINATIONS,
} from "./sampleData";

const AVOID_DESTINATIONS = [
  "tnpl",
  "international",
  "upcoming",
  "backpacking trips",
  "luxury packages",
  "unknown",
  "mice",
  "early bird offer",
];

interface FetchOptions {
  timeout?: number;
}

interface ApiResult<T> {
  data: T;
  source: ApiSource;
}

async function getJSON(url: string, { timeout = 9000 }: FetchOptions = {}): Promise<unknown> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeout);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    return await res.json();
  } finally {
    clearTimeout(t);
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

/**
 * Upcoming group trips, grouped by month.
 * Real shape: [{ title, year, month, tripsArray: [trip, ...] }]
 * Falls back to bundled sample data if the API is unreachable.
 */
function resolveImage(trip: Record<string, unknown>): string {
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

export async function getUpcomingTrips(): Promise<ApiResult<TripGroup[]>> {
  try {
    const data = await getJSON(ENDPOINTS.upcomingTrips);
    const groups = Array.isArray(data) ? data : isRecord(data) && Array.isArray(data.data) ? data.data : [];
    if (!groups.length) throw new Error("empty upcomingTrips");
    return { data: normalizeTripGroups(groups), source: "live" };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn("[getUpcomingTrips] using sample data:", message);
    return { data: SAMPLE_UPCOMING_TRIPS, source: "sample" };
  }
}

/**
 * Destinations list from the LF api (misc/destinations).
 * Real shape: { data: [{ name }, ...] }
 */
export async function getDestinations(): Promise<ApiResult<Destination[]>> {
  try {
    const result = await getJSON(ENDPOINTS.destinations);
    const list =
      isRecord(result) && Array.isArray(result.data)
        ? (result.data as Array<{ name?: string }>)
        : [];
    const cleaned: Destination[] = list
      .filter((d) => d?.name && !AVOID_DESTINATIONS.includes(d.name.toLowerCase()))
      .map((d) => ({
        name: d.name!.replace(/\b\w/g, (c) => c.toUpperCase()),
        slug: d.name!.replace(/\b\w/g, (c) => c.toUpperCase()),
        kind: "arch" as const,
      }));
    if (!cleaned.length) throw new Error("empty destinations");
    return { data: cleaned, source: "live" };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn("[getDestinations] using sample data:", message);
    return {
      data: [...SAMPLE_DOMESTIC_DESTINATIONS, ...SAMPLE_INTERNATIONAL_DESTINATIONS],
      source: "sample",
    };
  }
}

export function getSampleDomestic(): Destination[] {
  return SAMPLE_DOMESTIC_DESTINATIONS;
}

export function getSampleInternational(): Destination[] {
  return SAMPLE_INTERNATIONAL_DESTINATIONS;
}

/** Single trip by slug (for the future Product page). Read-only GET. */
export async function getTripBySlug(slug: string): Promise<unknown> {
  return getJSON(ENDPOINTS.tripBySlug(slug));
}

/** Format a YYYY-MM-DD batch date as "09 May" style label. */
function fmtBatchDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
}

/**
 * Flat list of trips for the Search Results / Listing page.
 * Fetches upcomingTrips, deduplicates by slug, normalises to Trip[].
 * Falls back to sample data if the API is unreachable.
 */
export async function getListingTrips(): Promise<Trip[]> {
  try {
    const data = await getJSON(ENDPOINTS.upcomingTrips);
    const groups = Array.isArray(data) ? data
      : (isRecord(data) && Array.isArray(data.data)) ? data.data as unknown[]
      : [];

    const seen = new Set<string>();
    const trips: Trip[] = [];

    for (const group of groups) {
      if (!isRecord(group)) continue;
      const arr = group.tripsArray;
      if (!Array.isArray(arr)) continue;

      for (const raw of arr) {
        if (!isRecord(raw)) continue;
        const slug = typeof raw.slug === "string" ? raw.slug : "";
        if (!slug || seen.has(slug)) continue;
        seen.add(slug);

        const priceRaw = typeof raw.startingPrice === "number" ? raw.startingPrice : 0;
        if (priceRaw < 1000) continue; // filter out test entries

        const image = resolveImage(raw);
        if (!image) continue; // skip trips with no card image

        const title = typeof raw.title === "string" ? raw.title.trim() : "";
        if (!title) continue;

        const batches: string[] = Array.isArray(raw.batches)
          ? (raw.batches as unknown[]).filter((b): b is string => typeof b === "string")
          : [];

        const destinations: TripDestination[] = Array.isArray(raw.destinations)
          ? (raw.destinations as unknown[])
              .filter(isRecord)
              .map(d => ({
                title: typeof d.title === "string" ? d.title : "",
                slug: typeof d.slug === "string" ? d.slug : "",
                isInternational: Boolean(d.isInternational),
              }))
              .filter(d => d.title)
          : [];

        const dur = isRecord(raw.duration) ? raw.duration : null;
        const duration = (dur && typeof dur.nights === "number" && typeof dur.days === "number")
          ? { nights: dur.nights, days: dur.days }
          : undefined;

        const features: string[] = Array.isArray(raw.features)
          ? (raw.features as unknown[]).filter((f): f is string => typeof f === "string")
          : [];

        const categories: string[] = Array.isArray(raw.categories)
          ? (raw.categories as unknown[]).filter((c): c is string => typeof c === "string")
          : [];

        trips.push({
          slug,
          title,
          image,
          startingPrice: formatPrice(raw.startingPrice),
          duration,
          skeletonItinerary: destinations.map(d => d.title),
          features,
          batches,
          categories,
          destinations,
          joinedCount: "20+",
          firstBatch: batches[0] ? fmtBatchDate(batches[0]) : undefined,
          recommended: Boolean(raw.isPromoted),
          womenOnly: Boolean(raw.womenOnly),
        });
      }
    }

    if (!trips.length) throw new Error("no valid listing trips");
    // Show the recommended card variant on a few trips regardless of API flag.
    trips.forEach((t, i) => { t.recommended = i < 3; });
    return trips;
  } catch (err) {
    console.warn("[getListingTrips] using sample data:", err instanceof Error ? err.message : String(err));
    // Flatten sample data as fallback
    const seen = new Set<string>();
    return SAMPLE_UPCOMING_TRIPS.flatMap(g => g.tripsArray ?? []).filter(t => {
      if (seen.has(t.slug)) return false;
      seen.add(t.slug);
      return true;
    });
  }
}
