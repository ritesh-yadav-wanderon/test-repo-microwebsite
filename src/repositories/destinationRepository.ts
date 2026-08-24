// Destinations: the LF list endpoint, the region tree used by menus/search,
// the per-destination landing page content, and the monument carousel entries.

import type { ApiResult, Destination, Trip } from "@/types";
import { ENDPOINTS } from "./core/config";
import { cachedRequest, peekCache } from "./core/cache";
import { getJSON, isRecord } from "./core/http";
import { readJSON, STORAGE_KEYS, writeJSON } from "./core/storage";
import {
  SAMPLE_DOMESTIC_DESTINATIONS,
  SAMPLE_INTERNATIONAL_DESTINATIONS,
} from "./fixtures/sampleData";
import { DEST_REGIONS } from "./fixtures/destinationRegions";
import { DESTINATION_PAGES, DEFAULT_DESTINATION_PAGE, type DestinationPage } from "./fixtures/destinationPages";

export { DEST_REGIONS };
export type { DestItem, DestRegion } from "./fixtures/destinationRegions";
export type { DestinationPage };

const DESTINATIONS_KEY = "destinations:list";

/** Names the LF feed returns that are not real destinations. */
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

/** Destination list from the LF api. Real shape: `{ data: [{ name }, ...] }`. */
export function getDestinations(): Promise<ApiResult<Destination[]>> {
  return cachedRequest(DESTINATIONS_KEY, async () => {
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
      return { data: cleaned, source: "live" } satisfies ApiResult<Destination[]>;
    } catch (err) {
      console.warn(
        "[destinationRepository] destinations unavailable, using sample data:",
        err instanceof Error ? err.message : String(err)
      );
      return {
        data: [...SAMPLE_DOMESTIC_DESTINATIONS, ...SAMPLE_INTERNATIONAL_DESTINATIONS],
        source: "sample",
      } satisfies ApiResult<Destination[]>;
    }
  });
}

export function getCachedDestinations(): ApiResult<Destination[]> | undefined {
  return peekCache(DESTINATIONS_KEY);
}

export function getSampleDomestic(): Destination[] {
  return SAMPLE_DOMESTIC_DESTINATIONS;
}

export function getSampleInternational(): Destination[] {
  return SAMPLE_INTERNATIONAL_DESTINATIONS;
}

/** Landing page content for a destination slug, with a generic fallback. */
export function getDestinationPage(slug: string): DestinationPage {
  return DESTINATION_PAGES[slug] ?? DEFAULT_DESTINATION_PAGE;
}

/** Whether the slug has bespoke landing content (vs the generic fallback). */
export function hasDestinationPage(slug: string): boolean {
  return slug in DESTINATION_PAGES;
}

/**
 * Destination-branded "customise" cards for destinations with no scheduled
 * trips, so those pages never fall back to another destination's trips.
 */
export function buildCustomiseTrips(slug: string, page: DestinationPage): Trip[] {
  const cities = page.cities ?? [];
  const durations = [
    { nights: 4, days: 5 },
    { nights: 5, days: 6 },
    { nights: 6, days: 7 },
  ];
  return durations.map((duration, i) => ({
    slug,
    title: cities[i]
      ? `Customise your ${slug} Trip: ${cities[i]} & more`
      : `Customise your ${slug} Trip`,
    image: page.heroImage,
    startingPrice: page.startingPrice,
    duration,
    batches: [],
  }));
}

// ── Monument carousels (home page) ──────────────────────────────────────
export interface MonumentDestination {
  name: string;
  /** Mobile cutout art. */
  img: string;
  /** Desktop-specific monument art, where it exists. */
  desktopImg?: string;
  ellipse: "color" | "gray";
  flip?: boolean;
}

const MOBILE_ART = "/figma/dest";
const DESKTOP_ART = "/figma/desktop";

const DOMESTIC_MONUMENTS: MonumentDestination[] = [
  { name: "Kerala", img: `${MOBILE_ART}/kerala.png`, desktopImg: `${DESKTOP_ART}/monument-kerala.png`, ellipse: "color" },
  { name: "Rajasthan", img: `${MOBILE_ART}/rajasthan.png`, ellipse: "gray", flip: true },
  { name: "Spiti", img: `${MOBILE_ART}/spiti.png`, ellipse: "gray" },
  { name: "Meghalaya", img: `${MOBILE_ART}/meghalaya.png`, ellipse: "gray" },
  { name: "Kashmir", img: `${MOBILE_ART}/kashmir.png`, ellipse: "gray" },
  { name: "Ladakh", img: `${MOBILE_ART}/ladakh.png`, ellipse: "gray", flip: true },
];

const INTERNATIONAL_MONUMENTS: MonumentDestination[] = [
  { name: "Egypt", img: `${MOBILE_ART}/egypt.png`, desktopImg: `${DESKTOP_ART}/monument-egypt.png`, ellipse: "color" },
  { name: "Bali", img: `${MOBILE_ART}/bali.png`, ellipse: "color" },
  { name: "Japan", img: `${MOBILE_ART}/japan.png`, ellipse: "color" },
  { name: "Thailand", img: `${MOBILE_ART}/thailand.png`, ellipse: "color" },
  { name: "Europe", img: `${MOBILE_ART}/meghalaya.png`, ellipse: "color" },
  { name: "Dubai", img: `${MOBILE_ART}/dubai.png`, ellipse: "color" },
  { name: "Vietnam", img: `${MOBILE_ART}/vietnam.png`, ellipse: "color" },
];

/** Monuments strip entries. Desktop swaps in its own art where available. */
export function getMonuments(
  region: "domestic" | "international",
  surface: "mobile" | "desktop" = "mobile"
): MonumentDestination[] {
  const list = region === "domestic" ? DOMESTIC_MONUMENTS : INTERNATIONAL_MONUMENTS;
  if (surface === "mobile") return list;
  return list.map((d) => (d.desktopImg ? { ...d, img: d.desktopImg } : d));
}

// ── Recent searches ────────────────────────────────────────────────────
const RECENTS_LIMIT = 4;

/** Destinations the traveller searched for most recently, newest first. */
export function getRecentDestinations(): string[] {
  return readJSON<string[]>(STORAGE_KEYS.recentDestinations, []).slice(0, RECENTS_LIMIT);
}

/** Record a search and return the updated list (deduplicated, newest first). */
export function addRecentDestination(name: string): string[] {
  const next = [
    name,
    ...getRecentDestinations().filter((d) => d.toLowerCase() !== name.toLowerCase()),
  ].slice(0, RECENTS_LIMIT);
  writeJSON(STORAGE_KEYS.recentDestinations, next);
  return next;
}

/** Trip category tabs above the monuments strip. */
export const DESTINATION_CATEGORIES = [
  "Adventure",
  "Luxury",
  "Culture",
  "Festival",
  "Wellness",
  "Weekend",
];
