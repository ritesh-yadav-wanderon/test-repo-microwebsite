"use client";

import { useMemo } from "react";
import { useIsDesktop } from "../src/hooks/useIsDesktop";
import { useProductList } from "../src/hooks/useProductList";
import { useTripTypeParam } from "../src/context/TripModeContext";
import { HomeView } from "../src/views/Home";
import type { ProductListResult } from "../src/repositories";
import type { ApiSource, TripGroup } from "../src/types";

export interface HomePageClientProps {
  /** Page 1 for the trip mode the server rendered (cookie), so the first
   *  paint needs no client fetch. */
  initialData: ProductListResult;
}

/** Wrapper for the homepage. Page 1 arrives server-fetched (app/page.tsx);
 *  switching trip mode (Private ↔ Group trips) refetches client-side.
 *
 *  Header/OnScrollTopNav are SiteChrome's job (mounted globally in
 *  layout.tsx) — Home itself never renders them directly. */
export default function HomePageClient({ initialData }: HomePageClientProps) {
  const isDesktop = useIsDesktop();
  const tripType = useTripTypeParam();
  const { items, loading } = useProductList({ tripType }, true, initialData);
  const trips: TripGroup[] = useMemo(
    () => (items.length ? [{ title: "Upcoming", year: "", month: "", tripsArray: items }] : []),
    [items]
  );
  const source: ApiSource | null = loading ? null : items.length ? "live" : "sample";

  return <HomeView trips={trips} loading={loading} source={source} isDesktop={isDesktop} />;
}
