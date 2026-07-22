import { useEffect, useState } from "react";

const QUERY = "(min-width: 1024px)";

/** True on viewports ≥1024px. Used to swap the homepage to its desktop layout
 *  without altering the mobile tree below the breakpoint. */
export function useIsDesktop(): boolean {
  const [isDesktop, setIsDesktop] = useState(() => window.matchMedia(QUERY).matches);

  useEffect(() => {
    const mql = window.matchMedia(QUERY);
    const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return isDesktop;
}
