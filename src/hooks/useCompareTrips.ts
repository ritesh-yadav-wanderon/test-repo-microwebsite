import { useEffect, useMemo, useState } from "react";
import { useCompare, type CompareTrip } from "@/context/CompareContext";
import { getComparableTrips, getProduct, type ProductDetail } from "@/repositories";
import { mergeProductData } from "@/repositories/productDetailMapper";
import { IMAGE_WIDTHS, sizedImageUrl } from "@/repositories/core/images";
import { placeholderHotelRating } from "@/utils/placeholders";

/** One column of the Compare page (mobile Figma 3032:20964 / desktop 6509:30416). */
export interface CompareColumnData {
  slug: string;
  href: string;
  image: string;
  title: string;
  price: string;
  duration: string;
  places: string;
  itinerary: { day: number; place: string }[];
  stay: { name: string; rating: number } | null;
  transfers: string[];
  experiences: { img?: string; label: string }[];
  /** Demo columns (nothing added to compare yet) can't be removed. */
  removable: boolean;
}

/** Fields the "Highlights Differences" toggle compares across columns. */
export const DIFF_FIELDS = ["price", "duration", "places", "stay", "transfers"] as const;
export type DiffField = (typeof DIFF_FIELDS)[number];

function diffValue(c: CompareColumnData, f: DiffField): string {
  if (f === "stay") return c.stay?.name ?? "";
  if (f === "transfers") return c.transfers.join("|");
  return c[f];
}

/** "Rs.98,990/- Per Person" — the design's price wording. */
function priceLabel(raw: unknown): string {
  const n = Number(String(raw ?? "").replace(/[^\d]/g, ""));
  return n ? `Rs.${n.toLocaleString("en-IN")}/- Per Person` : "";
}

function toColumn(item: CompareTrip, doc: ProductDetail | null): CompareColumnData {
  const href = `/trip/${encodeURIComponent(item.slug)}`;
  const base = { slug: item.slug, removable: true, title: item.title, image: item.image };
  if (!doc) {
    return {
      ...base, href, price: priceLabel(item.price), duration: "", places: "",
      itinerary: [], stay: null, transfers: [], experiences: [],
    };
  }
  const data = mergeProductData(doc);
  const nights = typeof doc.durationNights === "number" ? doc.durationNights : null;
  const days = typeof doc.durationDays === "number" ? doc.durationDays : null;
  const sub = Array.isArray(doc.subDestinations) ? (doc.subDestinations as unknown[]).filter((s): s is string => typeof s === "string") : [];
  const firstStay = data.itinerary.find((d) => d.stayName && !d.stayName.startsWith("Same Accommodation"))?.stayName;
  const productId = typeof doc.productId === "string" ? doc.productId : "";
  return {
    ...base,
    href: productId ? `${href}?id=${encodeURIComponent(productId)}` : href,
    title: typeof doc.title === "string" ? doc.title : item.title,
    image: data.heroImages[0] ? sizedImageUrl(data.heroImages[0], IMAGE_WIDTHS.carousel) : item.image,
    price: priceLabel(doc.startingPrice ?? item.price),
    duration: nights != null && days != null ? `${nights} Nights / ${days} Days` : data.duration,
    places: (sub.length ? sub : data.motherItinerary).join(", "),
    itinerary: data.itinerary.map((d, i) => ({ day: i + 1, place: d.city })).filter((d) => d.place),
    stay: firstStay ? { name: firstStay, rating: placeholderHotelRating(firstStay) } : null,
    transfers: [...new Set((data.transferLegs ?? []).map((l) => l.mode))],
    experiences: data.itinerary.flatMap((d) =>
      (d.activities ?? []).filter((a) => a.title && !a.isLeisure).map((a) => ({ img: a.photos?.[0], label: a.title }))
    ),
  };
}

/** Shown until the traveller adds trips to compare, so the page isn't blank. */
function demoColumns(): CompareColumnData[] {
  return getComparableTrips().map((t) => ({
    slug: `demo-${t.id}`,
    href: "/search",
    image: t.image,
    title: t.title,
    price: t.price,
    duration: t.days,
    places: t.places,
    itinerary: t.itinerary,
    stay: { name: "The Bodhi Tree - Hotel", rating: 4.8 },
    transfers: ["Luxury Seat-in-Coach", "Standard Seat-in-Coach"],
    experiences: t.experiences,
    removable: false,
  }));
}

/** Compared trips (from CompareContext), each enriched with its full
 *  product document; falls back to demo columns when nothing is added. */
export function useCompareTrips() {
  const { items } = useCompare();
  const [docs, setDocs] = useState<Record<string, ProductDetail | null>>({});
  const slugsKey = items.map((i) => i.slug).join("|");

  useEffect(() => {
    let cancelled = false;
    const missing = items.filter((i) => !(i.slug in docs));
    if (!missing.length) return;
    Promise.all(missing.map((i) => getProduct({ slug: i.slug }).then((doc) => [i.slug, doc] as const))).then((pairs) => {
      if (!cancelled) setDocs((prev) => ({ ...prev, ...Object.fromEntries(pairs) }));
    });
    return () => { cancelled = true; };
    // `docs` deliberately omitted: it only grows, and re-running on it would loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slugsKey]);

  const loading = items.some((i) => !(i.slug in docs));
  const columns = useMemo(
    () => (items.length ? items.map((i) => toColumn(i, docs[i.slug] ?? null)) : demoColumns()),
    [items, docs]
  );
  const differing = useMemo(
    () => new Set<DiffField>(DIFF_FIELDS.filter((f) => new Set(columns.map((c) => diffValue(c, f))).size > 1)),
    [columns]
  );

  return { columns, differing, loading, isDemo: items.length === 0 };
}
