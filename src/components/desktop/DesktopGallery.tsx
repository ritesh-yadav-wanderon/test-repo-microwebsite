import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { STATIC_DATA } from "../../pages/TripDetail";
import "./DesktopGallery.css";

const TABS = ["Destination", "Activities", "Accommodation", "Transfer"];

/* Same image sets the mobile gallery uses: the trip-hero set (hero section)
   followed by the moments carousel shots (gallery section). */
const HERO_IMAGES = [
  "/figma/trip-hero/hero-bg.png",
  "/figma/trip-hero/thumb-1.png",
  "/figma/trip-hero/thumb-2.png",
  "/figma/trip-hero/thumb-3.png",
  "/figma/trip-hero/thumb-4.png",
  "/figma/trip-hero/thumb-5.png",
];
const MOMENTS_IMAGES = Array.from({ length: 9 }, (_, i) => `/figma/itin-section/moments-g${i + 2}.jpg`);
const IMAGES = [...HERO_IMAGES, ...MOMENTS_IMAGES];

/* Same info block content the mobile GallerySheet shows. */
const INFO_TITLE = "Europe: Paris to Berlin, between cities, canals & culture";
const INFO_TAGS = ["Bali", "Ubud", "Kintamani Waterfalls", "Nusa Penida", "Kuta", "Uluwatu Temple"];

const STEP = 300 + 16; // card width + gap

/** Desktop trip image gallery page (Figma 6584:30629). */
export default function DesktopGallery() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(0);
  const [activeIdx, setActiveIdx] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  /* Jump to the image the user clicked (?i=N). */
  useEffect(() => {
    const start = Number(searchParams.get("i") ?? 0);
    if (!Number.isFinite(start) || start <= 0) return;
    const idx = Math.min(Math.max(0, start), IMAGES.length - 1);
    setActiveIdx(idx);
    if (trackRef.current) trackRef.current.scrollLeft = idx * STEP;
  }, [searchParams]);

  const onScroll = useCallback(() => {
    if (!trackRef.current) return;
    const idx = Math.round(trackRef.current.scrollLeft / STEP);
    setActiveIdx(Math.max(0, Math.min(idx, IMAGES.length - 1)));
  }, []);

  const step = (dir: 1 | -1) => {
    const idx = Math.max(0, Math.min(IMAGES.length - 1, activeIdx + dir));
    trackRef.current?.scrollTo({ left: idx * STEP, behavior: "smooth" });
    setActiveIdx(idx);
  };

  return (
    <div className="dgal">
      {/* ── Slim page header ── */}
      <header className="dgal-header">
        <button className="dgal-back" type="button" aria-label="Back" onClick={() => navigate(-1)}>
          <img src="/figma/compare/arrow-back.svg" alt="" width={24} height={24} aria-hidden />
        </button>
        <span className="dgal-header-title">Gallery</span>
      </header>

      {/* ── Trip name strip ── */}
      <div className="dgal-strip">
        <img src="/figma/compare/desktop/your-trips.svg" alt="" width={14} height={14} aria-hidden />
        <span>{STATIC_DATA.title}</span>
      </div>

      <div className="dgal-content">
        {/* ── Info block ── */}
        <div className="dgal-info">
          <p className="dgal-info-title">{INFO_TITLE}</p>
          <div className="dgal-info-tags">
            {INFO_TAGS.map((tag) => (
              <span key={tag} className="dgal-info-tag">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* ── Category tabs ── */}
        <div className="dgal-tabs">
          {TABS.map((tab, i) => (
            <button
              key={tab}
              type="button"
              className={`dgal-tab${i === activeTab ? " dgal-tab--active" : ""}`}
              onClick={() => setActiveTab(i)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ── Photo carousel ── */}
        <div className="dgal-track" ref={trackRef} onScroll={onScroll}>
          {IMAGES.map((src, i) => (
            <img key={i} className="dgal-photo" src={src} alt={`Photo ${i + 1}`} loading={i < 5 ? "eager" : "lazy"} />
          ))}
        </div>

        {/* ── Arrows ── */}
        <div className="dgal-arrows">
          <button
            className="dgal-arrow"
            type="button"
            aria-label="Previous photo"
            disabled={activeIdx === 0}
            onClick={() => step(-1)}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M15 4 7 12l8 8" stroke="#3d3d3d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            className="dgal-arrow"
            type="button"
            aria-label="Next photo"
            disabled={activeIdx >= IMAGES.length - 1}
            onClick={() => step(1)}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="m9 4 8 8-8 8" stroke="#3d3d3d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
