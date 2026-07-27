import { useEffect, useRef, useState } from "react";
import "./DesktopCategoryTabs.css";

/** Fixed DesktopNav height the tabs pin beneath. */
const NAV_H = 72;

const CATEGORIES = [
  "All Trips",
  "Adventure",
  "Luxury",
  "Music Fest",
  "Wellness",
  "Culture",
  "Weekend",
  "Romantic Escape",
];

interface Props {
  active: number;
  onChange: (index: number) => void;
}

/** Category tab strip below the hero (Figma 4674:17113). Pins below the fixed
 *  header once scrolled past, and releases as soon as its original position
 *  scrolls back into view (same behavior as the mobile dest-cats bar). */
export default function DesktopCategoryTabs({ active, onChange }: Props) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const [stuck, setStuck] = useState(false);
  const [navH, setNavH] = useState(0);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    // Stuck only once the sentinel scrolls ABOVE the header line; when
    // scrolling back up, the sentinel re-entering the viewport releases it.
    const observer = new IntersectionObserver(
      ([entry]) =>
        setStuck(!entry.isIntersecting && entry.boundingClientRect.top <= NAV_H),
      { rootMargin: `-${NAV_H}px 0px 0px 0px`, threshold: 0 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  // Measure the bar so its space is reserved while it floats.
  useEffect(() => {
    const measure = () => setNavH(navRef.current?.offsetHeight ?? 0);
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <>
      <div ref={sentinelRef} className="dtabs__sentinel" aria-hidden />
      <nav
        ref={navRef}
        className={`dtabs${stuck ? " dtabs--stuck" : ""}`}
        aria-label="Trip categories"
      >
        {CATEGORIES.map((label, i) => (
          <button
            key={label}
            className={`dtabs__tab${i === active ? " dtabs__tab--active" : ""}`}
            onClick={() => onChange(i)}
          >
            {label}
          </button>
        ))}
      </nav>
      {stuck && <div style={{ height: navH }} aria-hidden />}
    </>
  );
}
