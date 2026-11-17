import { getProductListServer } from "../_lib/productListServer";
import SearchResultsPageClient from "./SearchResultsPageClient";
import { getIsPrivateMode } from "../_lib/tripMode";

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
  // Private vs group trips follows the visitor's trip mode cookie (see
  // TripModeContext). A legacy "private-trips" category is ignored.
  const rawCategory = firstValue(sp.category) ?? null;
  const category = rawCategory === "private-trips" ? null : rawCategory;
  const initialData = await getProductListServer({
    destination: firstValue(sp.destination) ?? null,
    category,
    months: firstValue(sp.months) ?? null,
    from: firstValue(sp.from) ?? null,
    to: firstValue(sp.to) ?? null,
    bucketList: firstValue(sp.bucketList) ?? null,
    tripType: (await getIsPrivateMode()) ? "private" : "group",
  });

  return <SearchResultsPageClient initialData={initialData} />;
}
