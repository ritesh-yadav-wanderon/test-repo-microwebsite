import { useMediaQuery } from "./useMediaQuery";

const QUERY = "(min-width: 1024px)";

/** True on viewports ≥1024px. Used to swap the homepage to its desktop layout
 *  without altering the mobile tree below the breakpoint.
 *
 *  SSR-safe: assumes mobile until the real viewport is known (matches this
 *  app's mobile-first `--app-width` shell), so a server render and the first
 *  client paint agree — see useMediaQuery for why that matters. */
export function useIsDesktop(): boolean {
  return useMediaQuery(QUERY, false);
}
