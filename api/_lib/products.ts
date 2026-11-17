// Shared filtering, sorting, pagination and redaction logic for the product
// API routes. Kept framework-agnostic (no req/res) so it's easy to unit test
// and reused identically by /api/products and /api/product.

import type { Collection, Document } from "mongodb";

export const PAGE_SIZE = 6;

export type SortKey = "price-asc" | "price-desc" | "duration" | "recent";

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

/** "Sri-Lanka" / "sri lanka" -> "sri lanka" (lowercase, single-spaced words). */
function words(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

/** Destination-style fuzzy match. A needle matches a haystack entry when the
 *  entry contains the needle ("asia" ⊂ "Southeast Asia", hyphens/spaces
 *  ignored), or when the needle contains the entry as whole word(s)
 *  ("leh ladakh" ⊃ "Leh"). The whole-word rule matters: sub-destinations
 *  include fragments like "La" (from "Khardung La"), and a plain substring
 *  check made "thailand"/"sri-lanka" match every Ladakh trip. */
function closeMatch(needle: string, haystack: string[]): boolean {
  const n = words(needle);
  if (!n) return false;
  const nCompact = n.replace(/ /g, "");
  const nPadded = ` ${n} `;
  return haystack.some((raw) => {
    const h = words(raw);
    if (!h) return false;
    return h.replace(/ /g, "").includes(nCompact) || nPadded.includes(` ${h} `);
  });
}

function parseCsv(value: string | null | undefined): string[] {
  return value ? value.split(",").map((s) => s.trim()).filter(Boolean) : [];
}

/** Category values arrive both as FilterSheet labels ("Events and Festivals")
 *  and as URL slugs from the bottom nav / burger menu ("weekend-trips",
 *  "festivals", "romantic-escapes") — normalize both to one key. */
function categoryKey(raw: string): string {
  return raw.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

type CategoryMatcher = (doc: ProductDoc) => boolean;

function docThemes(doc: ProductDoc): string[] {
  return (doc.themeTags ?? []).map((t: string) => String(t).toLowerCase());
}
function docPrice(doc: ProductDoc): number {
  return typeof doc.startingPrice === "number" ? doc.startingPrice : (doc.priceRange?.min ?? 0);
}
function hasIntent(intent: string): CategoryMatcher {
  return (doc) => (Array.isArray(doc.intentTag) ? doc.intentTag : [doc.intentTag])
    .some((t: unknown) => typeof t === "string" && t.toLowerCase() === intent);
}

const adventure: CategoryMatcher = (doc) => {
  const themes = docThemes(doc);
  return themes.includes("adventure") || themes.includes("sports") || (doc.tripTypeTags ?? []).includes("Bike Trip");
};
const festivals: CategoryMatcher = (doc) => {
  const themes = docThemes(doc);
  return themes.includes("festival") || themes.includes("music festival") || doc.category === "Event Type Trip";
};
const weekend: CategoryMatcher = (doc) => (doc.tripTypeTags ?? []).includes("Weekend Trip");

const CATEGORY_MATCHERS: Record<string, CategoryMatcher> = {
  adventure,
  luxury: (doc) => docThemes(doc).includes("luxury") || docPrice(doc) > 100000,
  budgettrips: (doc) => docPrice(doc) > 0 && docPrice(doc) < 25000,
  eventsandfestivals: festivals,
  festivals,
  festival: festivals,
  wellness: (doc) => docThemes(doc).includes("wellness"),
  culture: (doc) => docThemes(doc).includes("culture"),
  weekend,
  weekendtrips: weekend,
  romanticescapes: hasIntent("couple"),
  couple: hasIntent("couple"),
  solo: hasIntent("solo"),
  friends: hasIntent("group of friends"),
};

/** Unknown categories (client-only markers like "private-trips", or menu
 *  entries with no backing data yet such as "family") return null so the
 *  caller can ignore them instead of filtering the list down to zero. */
function categoryMatcher(label: string): CategoryMatcher | null {
  return CATEGORY_MATCHERS[categoryKey(label)] ?? null;
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

/** Only what the listing needs: the card model (src/repositories/
 *  productRepository.ts `toTrip`) plus the fields the filters/sorts below
 *  read. Full documents carry day-wise itineraries, galleries and costing —
 *  ~28KB each — so a page of 6 shrank from ~167KB once projected. */
export const LIST_PROJECTION = {
  _id: 0,
  productId: 1, title: 1, slug: 1, packageType: 1,
  "productImageGallery.card": 1, "productImageGallery.cover": 1,
  startingPrice: 1, priceRange: 1, departureCityOptions: 1, recommendationTag: 1,
  durationNights: 1, durationDays: 1, subDestinations: 1, productUSP: 1,
  "batches.date": 1, themeTags: 1, tripTypeTags: 1, intentTag: 1, category: 1,
  destination: 1, region: 1, visibility: 1,
} as const;

const LIST_TTL_MS = 60_000;
let listCache: { at: number; docs: Promise<ProductDoc[]> } | null = null;

/** Every visible product, listing fields only, cached in memory for a minute
 *  so paging through the list (page 2, 3, …) doesn't re-read the collection
 *  on each request. A failed read isn't cached. */
export function listProducts(collection: Collection<Document>): Promise<ProductDoc[]> {
  const now = Date.now();
  if (listCache && now - listCache.at < LIST_TTL_MS) return listCache.docs;
  const docs = collection
    .find({ visibility: { $ne: false } }, { projection: LIST_PROJECTION })
    .toArray() as Promise<ProductDoc[]>;
  listCache = { at: now, docs };
  docs.catch(() => { if (listCache?.docs === docs) listCache = null; });
  return docs;
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
  /** "private" → customised trips only, "group" → fixed departures only,
   *  absent → both. */
  tripType?: string | null;
}

export interface ProductListResult {
  items: ProductDoc[];
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
}

/** Private trips are stored as `packageType: "Customised"`; group trips as
 *  "Fixed Departure". */
export function isCustomisedDoc(doc: ProductDoc): boolean {
  return typeof doc.packageType === "string" && /custom/i.test(doc.packageType);
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

  if (query.tripType === "private" || query.tripType === "group") {
    const wantPrivate = query.tripType === "private";
    filtered = filtered.filter((doc) => isCustomisedDoc(doc) === wantPrivate);
  }

  if (destinations.length) {
    filtered = filtered.filter((doc) => {
      const searchable = [
        doc.title,
        doc.destination?.title,
        doc.destination?.slug,
        // Region-level menu slugs ("india", "south-east-asia", "asia").
        doc.region,
        doc.destination?.isInternational === false ? "India" : null,
        ...(doc.subDestinations ?? []),
      ].filter((s): s is string => typeof s === "string");
      return destinations.some((d) => closeMatch(d, searchable));
    });
  }

  const categoryMatchers = categories.map(categoryMatcher).filter((m): m is CategoryMatcher => m !== null);
  if (categoryMatchers.length) {
    filtered = filtered.filter((doc) => categoryMatchers.some((m) => m(doc)));
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
