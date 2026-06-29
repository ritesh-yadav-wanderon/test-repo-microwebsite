import type { ApiSource, Destination, TripGroup } from "../types";
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
export async function getUpcomingTrips(): Promise<ApiResult<TripGroup[]>> {
  try {
    const data = await getJSON(ENDPOINTS.upcomingTrips);
    const groups = Array.isArray(data) ? data : isRecord(data) && Array.isArray(data.data) ? data.data : [];
    if (!groups.length) throw new Error("empty upcomingTrips");
    return { data: groups as TripGroup[], source: "live" };
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
