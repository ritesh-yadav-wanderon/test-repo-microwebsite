import { DESKTOP_QUERY, useViewportHint } from "@/context/ViewportContext";
import { useMediaQuery } from "./useMediaQuery";

/** True on viewports ≥1024px. Used to swap pages to their desktop layout
 *  without altering the mobile tree below the breakpoint.
 *
 *  SSR-safe: the server render and hydration use the server's viewport hint
 *  (cookie / user-agent, see app/_lib/viewportHint.ts), so a desktop reload
 *  renders desktop from the first paint; afterwards the real media query
 *  takes over. */
export function useIsDesktop(): boolean {
  return useMediaQuery(DESKTOP_QUERY, useViewportHint());
}
