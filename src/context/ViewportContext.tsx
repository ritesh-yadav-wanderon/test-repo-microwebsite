"use client";

import { createContext, useContext, useEffect } from "react";

import { VIEWPORT_COOKIE } from "@/utils/cookies";

export const DESKTOP_QUERY = "(min-width: 1024px)";

const ViewportHintContext = createContext(false);

/** The server's best guess of `useIsDesktop()` for this request (cookie,
 *  else user-agent). It is the value used for the server render and for
 *  hydration, so a desktop reload paints the desktop layout straight away
 *  instead of mobile first. */
export function useViewportHint(): boolean {
  return useContext(ViewportHintContext);
}

export function ViewportProvider({ isDesktop, children }: { isDesktop: boolean; children: React.ReactNode }) {
  // Keep the cookie in sync with the real viewport (first visit, resizes).
  useEffect(() => {
    const list = window.matchMedia(DESKTOP_QUERY);
    const write = () => {
      document.cookie = `${VIEWPORT_COOKIE}=${list.matches ? "d" : "m"}; path=/; max-age=31536000; samesite=lax`;
    };
    write();
    list.addEventListener("change", write);
    return () => list.removeEventListener("change", write);
  }, []);

  return <ViewportHintContext.Provider value={isDesktop}>{children}</ViewportHintContext.Provider>;
}
