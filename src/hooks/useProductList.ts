import { useEffect, useRef, useState } from "react";
import { getProductList, type ProductListParams, type ProductListResult } from "@/repositories";
import type { Trip } from "@/types";

/**
 * Server-paginated product list (6/page via /api/products). Refetches page 1
 * whenever the filter params change (compared by value), and appends
 * subsequent pages on `loadMore()` — the shape infinite-scroll and "load
 * more" button UIs both want.
 *
 * `initialData` seeds the very first render with page 1 already resolved —
 * used by Next.js pages that fetch it server-side (no client refetch of the
 * same page on mount). Ignored after the first mount: if `params` later
 * change (a filter/sort change), the normal client refetch takes over, same
 * as every other page.
 */
export function useProductList(params: ProductListParams, enabled = true, initialData?: ProductListResult) {
  const paramsKey = JSON.stringify(params);
  const [items, setItems] = useState<Trip[]>(initialData?.items ?? []);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(initialData?.total ?? 0);
  const [hasMore, setHasMore] = useState(initialData?.hasMore ?? false);
  const [loading, setLoading] = useState(!initialData);
  const requestId = useRef(0);
  const initialDataConsumed = useRef(false);

  useEffect(() => {
    if (!enabled) return;
    if (initialData && !initialDataConsumed.current) {
      // First mount already has server-provided page 1 for these exact
      // params — skip the redundant client refetch.
      initialDataConsumed.current = true;
      return;
    }
    const id = ++requestId.current;
    setLoading(true);
    getProductList({ ...params, page: 1 }).then((res) => {
      if (requestId.current !== id) return; // a newer filter change superseded this
      setItems(res.items);
      setPage(1);
      setTotal(res.total);
      setHasMore(res.hasMore);
      setLoading(false);
    });
    // `params` is intentionally represented by `paramsKey` — see below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsKey, enabled]);

  function loadMore() {
    if (loading || !hasMore) return;
    const id = ++requestId.current;
    const nextPage = page + 1;
    setLoading(true);
    getProductList({ ...params, page: nextPage }).then((res) => {
      if (requestId.current !== id) return;
      setItems((prev) => [...prev, ...res.items]);
      setPage(nextPage);
      setTotal(res.total);
      setHasMore(res.hasMore);
      setLoading(false);
    });
  }

  return { items, loading, hasMore, total, loadMore };
}
