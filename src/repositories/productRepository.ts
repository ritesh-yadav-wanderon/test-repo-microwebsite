// Products: the Mongo-backed `new-trip-data` collection, read only through
// our own server-side API (/api/products, /api/product) — this is the only
// file that should know those endpoint shapes. Nothing here talks to Mongo
// directly; that lives in api/_lib/mongo.ts on the server.

import type { Trip, TripDestination } from "@/types";
import type { SortKey } from "@/utils/searchResults";
import { ENDPOINTS } from "./core/config";
import { cachedRequest } from "./core/cache";
import { getJSON, isRecord } from "./core/http";
import { IMAGE_WIDTHS, sizedImageUrl } from "./core/images";
import { fmtBatchDate, formatPrice } from "./tripRepository";

export interface ProductListParams {
  page?: number;
  destination?: string;
  category?: string;
  months?: string;
  from?: string;
  to?: string;
  bucketList?: string;
  sort?: SortKey;
}

export interface ProductListResult {
  items: Trip[];
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
}

/** Raw product document as returned by /api/product (internal fields already
 *  redacted server-side). Loosely typed — TripDetail reads the specific
 *  fields it maps into the page, everything else is passed through as-is. */
export type ProductDetail = Record<string, unknown>;

const THEME_TO_CATEGORY: Record<string, string> = {
  adventure: "Adventure",
  sports: "Adventure",
  luxury: "Luxury",
  culture: "Culture",
  festival: "Festival",
  "music festival": "Festival",
  wellness: "Wellness",
};

/** themeTags/tripTypeTags -> the capitalized labels the category pills use. */
function toCategories(doc: Record<string, unknown>): string[] {
  const set = new Set<string>();
  const themes = Array.isArray(doc.themeTags) ? (doc.themeTags as unknown[]) : [];
  for (const t of themes) {
    if (typeof t !== "string") continue;
    const label = THEME_TO_CATEGORY[t.toLowerCase()];
    if (label) set.add(label);
  }
  const tripTypes = Array.isArray(doc.tripTypeTags) ? (doc.tripTypeTags as unknown[]) : [];
  if (tripTypes.includes("Weekend Trip")) set.add("Weekend");
  return [...set];
}

function pickCardImage(doc: Record<string, unknown>): string {
  const gallery = doc.productImageGallery;
  if (isRecord(gallery)) {
    const card = gallery.card;
    if (isRecord(card) && typeof card.link === "string") return sizedImageUrl(card.link, IMAGE_WIDTHS.card);
    const cover = gallery.cover;
    if (isRecord(cover) && typeof cover.link === "string") return sizedImageUrl(cover.link, IMAGE_WIDTHS.card);
  }
  return "";
}

/** Map one raw product document (from /api/products or /api/product) onto
 *  the card model shared by TripCard, UpcomingTrips, etc. */
export function toTrip(doc: Record<string, unknown>): Trip {
  const batches: string[] = Array.isArray(doc.batches)
    ? (doc.batches as Record<string, unknown>[])
        .map((b) => (typeof b?.date === "string" ? b.date : null))
        .filter((d): d is string => Boolean(d))
    : [];

  const destination = isRecord(doc.destination) ? doc.destination : null;
  const destinations: TripDestination[] = destination && typeof destination.title === "string"
    ? [{
        title: destination.title,
        slug: typeof destination.slug === "string" ? destination.slug : "",
        isInternational: Boolean(destination.isInternational),
      }]
    : [];

  const nights = doc.durationNights;
  const days = doc.durationDays;
  const duration = typeof nights === "number" && typeof days === "number" ? { nights, days } : undefined;

  const departureCities = Array.isArray(doc.departureCityOptions) ? (doc.departureCityOptions as unknown[]) : [];

  const features = (Array.isArray(doc.productUSP) ? (doc.productUSP as unknown[]) : [])
    .filter((f): f is string => typeof f === "string")
    .slice(0, 3);

  return {
    slug: typeof doc.slug === "string" ? doc.slug : "",
    productId: typeof doc.productId === "string" ? doc.productId : undefined,
    title: typeof doc.title === "string" ? doc.title : "",
    type: typeof doc.packageType === "string" ? doc.packageType : undefined,
    image: pickCardImage(doc),
    startingPrice: formatPrice(doc.startingPrice),
    pickDropPoint: typeof departureCities[0] === "string" ? (departureCities[0] as string) : undefined,
    recommended: Boolean(doc.recommendationTag),
    duration,
    skeletonItinerary: Array.isArray(doc.subDestinations) ? (doc.subDestinations as string[]) : [],
    features,
    batches,
    categories: toCategories(doc),
    destinations,
    joinedCount: "20+",
    firstBatch: batches[0] ? fmtBatchDate(batches[0]) : undefined,
    womenOnly: false,
  };
}

function buildQuery(params: ProductListParams): string {
  const qs = new URLSearchParams();
  if (params.page) qs.set("page", String(params.page));
  if (params.destination) qs.set("destination", params.destination);
  if (params.category) qs.set("category", params.category);
  if (params.months) qs.set("months", params.months);
  if (params.from) qs.set("from", params.from);
  if (params.to) qs.set("to", params.to);
  if (params.bucketList) qs.set("bucketList", params.bucketList);
  if (params.sort) qs.set("sort", params.sort);
  return qs.toString();
}

/** One page (6 items) of the product-list service, filtered/sorted server-side.
 *  Never rejects: a network/API failure degrades to an empty page (and isn't
 *  cached, so the next call retries) instead of leaving callers
 *  (useProductList) stuck in a permanent loading state. */
export function getProductList(params: ProductListParams = {}): Promise<ProductListResult> {
  const query = buildQuery(params);
  const empty: ProductListResult = { items: [], page: 1, pageSize: 6, total: 0, hasMore: false };
  return cachedRequest(`products:${query}`, async () => {
    const raw = await getJSON(query ? `${ENDPOINTS.productList}?${query}` : ENDPOINTS.productList);
    if (!isRecord(raw) || !Array.isArray(raw.items)) {
      throw new Error("Malformed product list response");
    }
    return {
      items: (raw.items as Record<string, unknown>[]).map(toTrip),
      page: typeof raw.page === "number" ? raw.page : 1,
      pageSize: typeof raw.pageSize === "number" ? raw.pageSize : 6,
      total: typeof raw.total === "number" ? raw.total : 0,
      hasMore: Boolean(raw.hasMore),
    };
  }).catch((err) => {
    console.warn("[productRepository] getProductList failed:", err instanceof Error ? err.message : String(err));
    return empty;
  });
}

/** Full product document — by Mongo productId when given, falling back to
 *  the slug (server-side) — or null if not found/unreachable. Never rejects;
 *  failures aren't cached, so the next call retries. Read-only GET. */
export function getProduct({ id, slug }: { id?: string | null; slug?: string | null }): Promise<ProductDetail | null> {
  const qs = new URLSearchParams();
  if (id) qs.set("id", id);
  if (slug) qs.set("slug", slug);
  const query = qs.toString();
  if (!query) return Promise.resolve(null);
  return cachedRequest(`product:${query}`, async () => {
    const raw = await getJSON(`${ENDPOINTS.product}?${query}`);
    return isRecord(raw) ? raw : null;
  }).catch((err) => {
    console.warn("[productRepository] getProduct failed:", err instanceof Error ? err.message : String(err));
    return null;
  });
}
