import { useEffect, useRef, useState } from "react";
import { useAppSearchParams } from "@/hooks/useAppSearchParams";
import { getProduct, STATIC_DATA, type ProductData } from "@/repositories";
import { mergeProductData } from "@/repositories/productDetailMapper";

/**
 * The product-detail page's data source. The URL is /trip/<slug>?id=<productId>
 * (see src/utils/tripUrl.ts): the product is fetched by `id` when present,
 * falling back to `slug` server-side, so a slug-only link still resolves.
 * Falls back to the static Figma fixture — whole cloth if nothing matches,
 * field-by-field for anything the real product doesn't carry — so the page
 * never breaks while real data is still loading or a field genuinely has no
 * source equivalent.
 *
 * `initialData` seeds the very first render with the product already
 * resolved — used by Next.js's page.tsx, which fetches it server-side (no
 * redundant client fetch on mount). Also how TripDetailView avoids the
 * double-fetch bug this hook used to have: only it calls this hook, and
 * passes `data` down to DesktopTripDetail as a prop instead of that
 * component calling the hook a second time for the same id.
 */
export function useProductData(
  slug: string,
  initialData?: ProductData
): { data: ProductData; loading: boolean } {
  const searchParams = useAppSearchParams();
  const id = searchParams.get("id");
  const [data, setData] = useState<ProductData>(initialData ?? STATIC_DATA);
  const [loading, setLoading] = useState(!initialData && Boolean(id || slug));
  const initialDataConsumed = useRef(false);

  useEffect(() => {
    if (initialData && !initialDataConsumed.current) {
      // First mount already has server-provided data for this exact id/slug.
      initialDataConsumed.current = true;
      return;
    }
    if (!id && !slug) {
      setData(STATIC_DATA);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    getProduct({ id, slug }).then((doc) => {
      if (cancelled) return;
      setData(doc ? mergeProductData(doc) : STATIC_DATA);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, slug]);

  return { data, loading };
}
