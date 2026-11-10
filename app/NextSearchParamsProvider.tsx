"use client";

import { useSearchParams } from "next/navigation";
import { AppSearchParamsContext } from "../src/hooks/useAppSearchParams";

/** Next.js's AppSearchParams implementation. Shared by every route that
 *  needs it (currently /search, /trip/[slug], /trip/[slug]/gallery, /booking,
 *  /booking/personal-details) — each wraps its own page tree with this
 *  directly, never the root layout: see NextNavProvider's comment for why
 *  (useSearchParams() forces static prerendering to bail out for its whole
 *  subtree unless wrapped in Suspense, which would turn every otherwise-
 *  static page into a client-rendered shell). Every route using this must
 *  itself be `export const dynamic = "force-dynamic"`, so next/navigation's
 *  useSearchParams() here needs no Suspense boundary — that requirement only
 *  applies to otherwise-static pages. */
export default function NextSearchParamsProvider({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  return (
    <AppSearchParamsContext.Provider value={searchParams as unknown as URLSearchParams}>
      {children}
    </AppSearchParamsContext.Provider>
  );
}
