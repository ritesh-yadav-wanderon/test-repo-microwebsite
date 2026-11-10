import { useSyncExternalStore } from "react";

function subscribe(query: string) {
  return (onChange: () => void) => {
    if (typeof window === "undefined") return () => {};
    const list = window.matchMedia(query);
    list.addEventListener("change", onChange);
    return () => list.removeEventListener("change", onChange);
  };
}

/**
 * SSR-safe media query hook. Built on `useSyncExternalStore` so the server
 * render and React's first client render pass agree (both use
 * `serverSnapshot`) — no hydration-mismatch warning, and no crash from
 * touching `window` during a server render (unlike a plain
 * `useState(() => window.matchMedia(...).matches)` initializer, which runs
 * at render time on the server too).
 *
 * `serverSnapshot` also doubles as the "default before we know better" value
 * for the very first client paint, so pick whichever branch this app should
 * assume when it can't yet tell — mobile-first for viewport queries.
 */
export function useMediaQuery(query: string, serverSnapshot: boolean): boolean {
  return useSyncExternalStore(
    subscribe(query),
    () => (typeof window === "undefined" ? serverSnapshot : window.matchMedia(query).matches),
    () => serverSnapshot
  );
}
