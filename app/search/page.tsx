import { getProductListServer } from "../_lib/productListServer";
import SearchResultsPageClient from "./SearchResultsPageClient";

// Live, filter-dependent product data — must not be statically prerendered.
export const dynamic = "force-dynamic";

function firstValue(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

export default async function SearchResultsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  // "private-trips" is a client-only routing marker (the bottom nav's
  // Private trips tab) — the real product API's category taxonomy doesn't
  // recognize it, so forwarding it would always return zero results.
  // Private trips shows the full, unfiltered trip list instead. See
  // SearchResults.tsx's matching `apiCategory` normalization.
  const rawCategory = firstValue(sp.category) ?? null;
  const category = rawCategory === "private-trips" ? null : rawCategory;
  const initialData = await getProductListServer({
    destination: firstValue(sp.destination) ?? null,
    category,
    months: firstValue(sp.months) ?? null,
    from: firstValue(sp.from) ?? null,
    to: firstValue(sp.to) ?? null,
    bucketList: firstValue(sp.bucketList) ?? null,
  });

  return <SearchResultsPageClient initialData={initialData} />;
}
