"use client";

import { useIsDesktop } from "../src/hooks/useIsDesktop";
import { HomeView } from "../src/views/Home";
import type { ApiSource, TripGroup } from "../src/types";

export interface HomePageClientProps {
  trips: TripGroup[];
  source: ApiSource | null;
}

/** Wrapper for the homepage. `trips` arrives already fetched by the Server
 *  Component (app/page.tsx) — no client-side loading state.
 *
 *  Header/OnScrollTopNav are SiteChrome's job (mounted globally in
 *  layout.tsx) — Home itself never renders them directly, so this wrapper
 *  only adds `trips`/`source`. */
export default function HomePageClient({ trips, source }: HomePageClientProps) {
  const isDesktop = useIsDesktop();

  return <HomeView trips={trips} loading={false} source={source} isDesktop={isDesktop} />;
}
