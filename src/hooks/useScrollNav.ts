import { useEffect, useRef, useState } from "react";

/**
 * Homepage: purely IntersectionObserver-driven.
 *   - Hero search IN viewport  → logo header visible, compact nav hidden
 *   - Hero search OUT viewport → compact nav visible, logo header hidden
 *
 * Non-home pages: scroll-direction-driven.
 *   - At top (<80px) or scrolling UP  → logo header
 *   - Scrolling DOWN past threshold    → compact nav
 */
export function useScrollNav(isHome: boolean) {
  const [compact, setCompact] = useState(false);
  const lastY   = useRef(0);
  const prevIsHome = useRef(isHome);

  useEffect(() => {
    if (prevIsHome.current !== isHome) {
      setCompact(false);
      prevIsHome.current = isHome;
    }
  }, [isHome]);

  useEffect(() => {
    setCompact(false);
    lastY.current = window.scrollY;

    if (isHome) {
      // ── Homepage: IntersectionObserver only ──
      const attach = () => {
        const el = document.querySelector("[data-hero-search]");
        if (!el) return false;
        const observer = new IntersectionObserver(
          ([entry]) => { setCompact(!entry.isIntersecting); },
          { threshold: 0 }
        );
        observer.observe(el);
        return () => observer.disconnect();
      };

      let cleanup: (() => void) | undefined;
      const raf = requestAnimationFrame(() => {
        const result = attach();
        if (typeof result === "function") cleanup = result;
      });

      return () => {
        cancelAnimationFrame(raf);
        if (cleanup) cleanup();
      };
    } else {
      // ── Non-home pages: scroll-direction aware ──
      const THRESHOLD = 80;
      let ticking = false;

      const onScroll = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          const y = window.scrollY;
          if (y < THRESHOLD) {
            setCompact(false);
          } else if (y > lastY.current) {
            setCompact(true);
          } else if (y < lastY.current) {
            setCompact(false);
          }
          lastY.current = y;
          ticking = false;
        });
      };

      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }
  }, [isHome]);

  return {
    showHeroHeader:   !compact,
    showScrollHeader: compact,
  };
}
