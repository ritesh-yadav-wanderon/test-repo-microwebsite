import { createContext, useContext } from "react";

/**
 * The current URL's query string, read-only — deliberately a SEPARATE,
 * narrowly-scoped context from useAppNav(). Only routes that genuinely need
 * it (search/filter UI, the trip gallery's `?i=`, the booking flow's `?orderId=`)
 * are wrapped in app/NextSearchParamsProvider.tsx directly; it must NOT be
 * provided globally in the root layout, because next/navigation's
 * useSearchParams() forces static prerendering to bail out for its entire
 * subtree unless wrapped in Suspense — doing that globally would turn every
 * otherwise-static page (Legal, Notifications, ...) into a client-rendered
 * shell. See NextNavProvider's comment and app/NextSearchParamsProvider.tsx.
 */
export const AppSearchParamsContext = createContext<URLSearchParams | null>(null);

export function useAppSearchParams(): URLSearchParams {
  const ctx = useContext(AppSearchParamsContext);
  if (!ctx) {
    throw new Error("useAppSearchParams() must be used within an AppSearchParamsContext.Provider");
  }
  return ctx;
}
