import { useEffect, useRef, useState } from "react";

/**
 * Direction-aware header visibility:
 *  - At top (< 80 px)    → logo header
 *  - Scrolling DOWN       → compact search header
 *  - Scrolling UP         → logo header
 *
 * Homepage bonus: IntersectionObserver on [data-hero-search] forces
 * the logo header back whenever the search bar re-enters the viewport.
 */
export function useScrollNav(isHome: boolean) {
  const [compact, setCompact] = useState(false);
  const lastY   = useRef(0);
  const prevIsHome = useRef(isHome);

  // Reset state when the route changes
  useEffect(() => {
    if (prevIsHome.current !== isHome) {
      setCompact(false);
      prevIsHome.current = isHome;
    }
  }, [isHome]);

  useEffect(() => {
    setCompact(false);
    lastY.current = window.scrollY;

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
          // Scrolling DOWN → show compact header
          setCompact(true);
        } else if (y < lastY.current) {
          // Scrolling UP → show logo header
          setCompact(false);
        }
        lastY.current = y;
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    // On homepage: also watch the hero search bar.
    // If it comes back into view while scrolling up, force logo header on.
    let observer: IntersectionObserver | null = null;
    if (isHome) {
      const attach = () => {
        const el = document.querySelector("[data-hero-search]");
        if (!el) return false;
        observer = new IntersectionObserver(
          ([entry]) => { if (entry.isIntersecting) setCompact(false); },
          { threshold: 0 }
        );
        observer.observe(el);
        return true;
      };
      if (!attach()) {
        const raf = requestAnimationFrame(attach);
        return () => {
          cancelAnimationFrame(raf);
          observer?.disconnect();
          window.removeEventListener("scroll", onScroll);
        };
      }
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer?.disconnect();
    };
  }, [isHome]);

  return {
    showHeroHeader:   !compact,
    showScrollHeader: compact,
  };
}
