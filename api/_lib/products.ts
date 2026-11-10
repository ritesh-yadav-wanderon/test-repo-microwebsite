// Shared filtering, sorting, pagination and redaction logic for the product
// API routes. Kept framework-agnostic (no req/res) so it's easy to unit test
// and reused identically by /api/products and /api/product.

import type { Collection, Document } from "mongodb";

export const PAGE_SIZE = 6;

export type SortKey = "price-asc" | "price-desc" | "duration" | "recent";

// Mirrors the category labels the client's category pills/filter chips send
// (see src/utils/searchResults.ts `matchesCategory` and
// src/components/UpcomingTrips CATEGORY_NAMES) — kept in sync deliberately.
const CATEGORY_LABELS = ["Adventure", "Luxury", "Budget Trips", "Events and Festivals", "Wellness"] as const;
export type CategoryLabel = (typeof CATEGORY_LABELS)[number];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ProductDoc = Record<string, any>;

/** Strip internal-only fields (our cost basis) before anything leaves the server. */
export function redactProduct(doc: ProductDoc): ProductDoc {
  const stripCostToUs = (prices: unknown) =>
    Array.isArray(prices)
      ? prices.map((p) => {
          if (p && typeof p === "object") {
            const { costToUs: _costToUs, ...rest } = p as Record<string, unknown>;
            return rest;
          }
          return p;
        })
      : prices;

  const costing = doc.costing && typeof doc.costing === "object"
    ? { ...doc.costing, prices: stripCostToUs(doc.costing.prices) }
    : doc.costing;

  const batches = Array.isArray(doc.batches)
    ? doc.batches.map((b: ProductDoc) => ({
        ...b,
        costing: b?.costing && typeof b.costing === "object"
          ? { ...b.costing, prices: stripCostToUs(b.costing.prices) }
          : b?.costing,
      }))
    : doc.batches;

  const { _id, ...rest } = doc;
  return { ...rest, costing, batches };
}

function closeMatch(needle: string, haystack: string[]): boolean {
  const n = needle.toLowerCase();
  return haystack.some((h) => h.toLowerCase().includes(n) || n.includes(h.toLowerCase()));
}

function parseCsv(value: string | null | undefined): string[] {
  return value ? value.split(",").map((s) => s.trim()).filter(Boolean) : [];
}

function matchesCategory(label: string, doc: ProductDoc): boolean {
  const themes: string[] = (doc.themeTags ?? []).map((t: string) => t.toLowerCase());
  const tripTypes: string[] = doc.tripTypeTags ?? [];
  const price: number = typeof doc.startingPrice === "number" ? doc.startingPrice : (doc.priceRange?.min ?? 0);
  switch (label as CategoryLabel) {
    case "Adventure":
      return themes.includes("adventure") || themes.includes("sports") || tripTypes.includes("Bike Trip");
    case "Luxury":
      return themes.includes("luxury") || price > 100000;
    case "Budget Trips":
      return price > 0 && price < 25000;
    case "Events and Festivals":
      return themes.includes("festival") || themes.includes("music festival") || doc.category === "Event Type Trip";
    case "Wellness":
      return themes.includes("wellness");
    default:
      return false;
  }
}

/** Nearest upcoming batch timestamp; trips with no batches sort last. */
function nearestBatchTime(doc: ProductDoc): number {
  const dates: string[] = (doc.batches ?? []).map((b: ProductDoc) => b?.date).filter(Boolean);
  if (!dates.length) return Infinity;
  const now = Date.now();
  const times = dates.map((d) => new Date(`${d}T00:00:00`).getTime()).filter((t) => !Number.isNaN(t));
  if (!times.length) return Infinity;
  const upcoming = times.filter((t) => t >= now);
  return upcoming.length ? Math.min(...upcoming) : Math.min(...times);
}

export interface ProductListQuery {
  page?: string | null;
  destination?: string | null;
  category?: string | null;
  months?: string | null;
  from?: string | null;
  to?: string | null;
  bucketList?: string | null;
  sort?: string | null;
}

export interface ProductListResult {
  items: ProductDoc[];
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
}

/** Apply the listing page's filters, sort, and 6-per-page pagination in memory. */
export function filterSortPaginate(all: ProductDoc[], query: ProductListQuery): ProductListResult {
  const destinations = parseCsv(query.destination);
  const categories = parseCsv(query.category);
  const months = parseCsv(query.months);
  const bucketList = parseCsv(query.bucketList);
  const { from, to } = query;
  const sort = (query.sort ?? null) as SortKey | null;
  const page = Math.max(1, Number(query.page) || 1);

  let filtered = all.filter((doc) => doc.visibility !== false);

  if (destinations.length) {
    filtered = filtered.filter((doc) => {
      const searchable = [
        doc.title,
        doc.destination?.title,
        doc.destination?.slug,
        ...(doc.subDestinations ?? []),
      ].filter((s): s is string => typeof s === "string");
      return destinations.some((d) => closeMatch(d, searchable));
    });
  }

  if (categories.length) {
    filtered = filtered.filter((doc) => categories.some((c) => matchesCategory(c, doc)));
  }

  if (months.length) {
    filtered = filtered.filter((doc) => {
      const dates: string[] = (doc.batches ?? []).map((b: ProductDoc) => b?.date).filter(Boolean);
      return months.some((ym) => dates.some((d) => d.startsWith(ym)));
    });
  }

  if (from || to) {
    const fromT = from ? new Date(`${from}T00:00:00`).getTime() : -Infinity;
    const toT = to ? new Date(`${to}T00:00:00`).getTime() : Infinity;
    filtered = filtered.filter((doc) => {
      const dates: string[] = (doc.batches ?? []).map((b: ProductDoc) => b?.date).filter(Boolean);
      return dates.some((d) => {
        const t = new Date(`${d}T00:00:00`).getTime();
        return t >= fromT && t <= toT;
      });
    });
  }

  if (bucketList.length) {
    filtered = filtered.filter((doc) => {
      const searchable = [doc.title, doc.destination?.title, ...(doc.subDestinations ?? [])].filter(
        (s): s is string => typeof s === "string"
      );
      return bucketList.some((entry) => closeMatch(entry, searchable));
    });
  }

  if (sort) {
    filtered = [...filtered];
    switch (sort) {
      case "price-asc":
        filtered.sort((a, b) => (a.startingPrice ?? 0) - (b.startingPrice ?? 0));
        break;
      case "price-desc":
        filtered.sort((a, b) => (b.startingPrice ?? 0) - (a.startingPrice ?? 0));
        break;
      case "duration":
        filtered.sort((a, b) => (a.durationNights ?? Infinity) - (b.durationNights ?? Infinity));
        break;
      case "recent":
        filtered.sort((a, b) => nearestBatchTime(a) - nearestBatchTime(b));
        break;
    }
  }

  const total = filtered.length;
  const start = (page - 1) * PAGE_SIZE;
  const items = filtered.slice(start, start + PAGE_SIZE).map(redactProduct);

  return { items, page, pageSize: PAGE_SIZE, total, hasMore: start + PAGE_SIZE < total };
}

/** Visible product by Mongo `productId` first, then by `slug` — the trip page
 *  URL is /trip/<slug>?id=<productId>, and a link that only carries the slug
 *  (wishlist, shared/old links) must still resolve. Returns the raw document;
 *  callers redact before it leaves the server. */
export async function findProduct(
  collection: Collection<Document>,
  { id, slug }: { id?: string | null; slug?: string | null }
): Promise<ProductDoc | null> {
  if (id) {
    const byId = await collection.findOne({ productId: id, visibility: { $ne: false } });
    if (byId) return byId;
  }
  if (slug) {
    return collection.findOne({ slug, visibility: { $ne: false } });
  }
  return null;
}
