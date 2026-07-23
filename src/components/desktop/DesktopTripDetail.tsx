import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Trip, TripGroup } from "../../types";
import { useCompare } from "../../context/CompareContext";
import { SAMPLE_UPCOMING_TRIPS } from "../../api/sampleData";
import {
  STATIC_DATA,
  TDP_FAQS,
  DayCard,
  CityCard,
  SharedTransfer,
  TiFitRow,
  parseCityStrip,
} from "../../pages/TripDetail";
import "../../pages/TripDetail.css";
import GallerySheet from "../GallerySheet/GallerySheet";
import ShareSheet from "../ShareSheet/ShareSheet";
import BatchesSheet from "../BatchesSheet/BatchesSheet";
import DesktopWhyChooseUs from "./DesktopWhyChooseUs";
import DesktopTrips from "./DesktopTrips";
import DesktopQuery from "./DesktopQuery";
import DesktopFooterMsg from "./DesktopFooterMsg";
import "./DesktopTripDetail.css";

const TI = "/figma/trip-info/";
const HL = "/figma/itin-highlights/";
const BOOK = "/figma/desktop-trip/";
const MG = "/figma/itin-section/";

// Reused mobile captain assets — content identical to the mobile product page.
const CAP_AV = [`${MG}captain-av-a.jpg`, `${MG}captain-av-b.jpg`, `${MG}captain-av-c.jpg`];
const CAP_BULLETS = [
  {
    icon: `${MG}captain-icon-certified.svg`,
    title: "Certified",
    body: "Every captain is Wanderon-certified and first-aid trained before they ever lead a batch.",
  },
  {
    icon: `${MG}captain-icon-route.svg`,
    title: "Knows the route by heart",
    body: "Minimum 10 runs on a route before leading it solo. They know the shortcuts and the scams.",
  },
  {
    icon: `${MG}captain-icon-women.svg`,
    title: "Women captains on request",
    body: "Booking a Wander Women batch, or just prefer it? We'll assign a woman captain.",
  },
];

const SERVICES = [
  { icon: `${HL}icon-accommodation.svg`, label: "9N Accommodation" },
  { icon: `${HL}icon-meals.svg`, label: "12 Meals" },
  { icon: `${HL}icon-transfers.svg`, label: "10 Shared Transfers" },
  { icon: `${HL}icon-activities.svg`, label: "12 Activities" },
  { icon: `${HL}icon-guides.svg`, label: "Trip Captains, Local Guides" },
];

// Hero gallery grid images (Figma 5652:12023)
const HERO_GRID = [
  `${BOOK}hero-g1.png`,
  `${BOOK}hero-g2.png`,
  `${BOOK}hero-g3.png`,
  `${BOOK}hero-g4.png`,
];

const TABS = ["Itinerary", "Inclusions", "Exclusions", "Reviews", "Trip Captains"];
const TAB_SECTIONS = [
  "dtdp-section-itin",
  "dtdp-section-incl",
  "dtdp-section-excl",
  "dtdp-section-reviews",
  "dtdp-section-captains",
];

/** Desktop (≥1024px) product / trip-detail page — Figma frame 3999:11555.
 *  Content (title, itinerary, inclusions, captain, FAQs …) is reused verbatim
 *  from the mobile product page via the shared STATIC_DATA export. */
export default function DesktopTripDetail() {
  const data = STATIC_DATA;
  const navigate = useNavigate();

  const [wishlisted, setWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [activeDay, setActiveDay] = useState(0);
  const [openDays, setOpenDays] = useState<Set<number>>(new Set([0]));
  const [inclOpen, setInclOpen] = useState(false);
  const [exclOpen, setExclOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const [tabsStuck, setTabsStuck] = useState(false);
  const tabsSentinelRef = useRef<HTMLDivElement>(null);
  // Sticky booking card shows the trip title only after the product title leaves view.
  const [showBookTitle, setShowBookTitle] = useState(false);
  const ptitleRef = useRef<HTMLElement>(null);

  // Sheets
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [batchesOpen, setBatchesOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const compareSlug = "current-trip";
  const { isInCompare, toggle: toggleCompareTrip } = useCompare();
  const inCompare = isInCompare(compareSlug);
  const toggleCompare = () =>
    toggleCompareTrip({
      slug: compareSlug,
      title: data.title,
      image: data.heroImages[0],
      price: String(data.displayPrice ?? ""),
    });

  // Booking card: derive the struck-through "original" price from the -10% off.
  const priceNum = Number(String(data.displayPrice).replace(/[^\d]/g, ""));
  const strikePrice = priceNum
    ? `₹${Math.round(priceNum / 0.9).toLocaleString("en-IN")}/-`
    : "";

  const gallery = data.gallery.length ? data.gallery : data.heroImages;
  const openGallery = (idx = 0) => {
    setGalleryIndex(idx);
    setGalleryOpen(true);
  };

  function scrollToSection(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  function scrollToDay(i: number) {
    setActiveDay(i);
    document.getElementById(`day-${i}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const toggleDay = (gIdx: number) =>
    setOpenDays((prev) => {
      const s = new Set(prev);
      s.has(gIdx) ? s.delete(gIdx) : s.add(gIdx);
      return s;
    });

  // Full-bleed tab bar: mark "stuck" once its sentinel scrolls under the header.
  useEffect(() => {
    const el = tabsSentinelRef.current;
    if (!el) return;
    // Stuck only when the sentinel is scrolled ABOVE the header line — not when
    // it is still below the fold (both are "not intersecting").
    const obs = new IntersectionObserver(
      ([entry]) => setTabsStuck(entry.boundingClientRect.top <= 73),
      { rootMargin: "-73px 0px 0px 0px", threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Reveal the trip title inside the sticky booking card once the product title
  // scrolls up past the header (i.e. leaves the viewport).
  useEffect(() => {
    const el = ptitleRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setShowBookTitle(!entry.isIntersecting),
      { rootMargin: "-73px 0px 0px 0px", threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Track which day is centred in the viewport → highlight the Day Plan rail.
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) {
          const idx = Number((visible.target as HTMLElement).dataset.dayIdx);
          if (!Number.isNaN(idx)) setActiveDay(idx);
        }
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: [0, 0.25, 0.5] }
    );
    data.itinerary.forEach((_, i) => {
      const el = document.getElementById(`day-${i}`);
      if (el) {
        el.dataset.dayIdx = String(i);
        obs.observe(el);
      }
    });
    return () => obs.disconnect();
  }, [data.itinerary]);

  // ── Related "More Europe Trips" (same filter as mobile) ──────────────────
  const productDest = data.breadcrumbs[data.breadcrumbs.length - 1] ?? "";
  const relatedTrips = useMemo<Trip[]>(() => {
    const d = productDest.trim().toLowerCase();
    const pool = SAMPLE_UPCOMING_TRIPS.flatMap((g) => g.tripsArray);
    const matched = pool.filter(
      (t) =>
        t.slug.toLowerCase().includes(d) ||
        t.title.toLowerCase().includes(d) ||
        (t.skeletonItinerary ?? []).some((c) => c.toLowerCase().includes(d)) ||
        (t.destinations ?? []).some(
          (x) => x.title.toLowerCase().includes(d) || x.slug.toLowerCase().includes(d)
        )
    );
    return (matched.length ? matched : pool).slice(0, 8);
  }, [productDest]);
  const relatedGroups = useMemo<TripGroup[]>(
    () => [{ title: "", year: "", month: "", tripsArray: relatedTrips }],
    [relatedTrips]
  );
  const moreHref = `/search?destination=${encodeURIComponent(productDest)}`;

  // Itinerary body — city cards + day cards + shared transfers (mobile logic).
  const itineraryNodes = (() => {
    const nodes: React.ReactNode[] = [];
    const lastDayIdx = data.itinerary.length - 1;
    let dayOffset = 0;
    data.cityStrip.forEach((entry, i) => {
      const nightCount = parseInt(entry.match(/^(\d+)N/i)?.[1] ?? "1");
      const startDay = dayOffset;
      dayOffset += nightCount;
      const cityDays = data.itinerary.slice(startDay, startDay + nightCount);
      nodes.push(
        <CityCard key={`city-${i}`} entry={entry} photo={data.heroImages[i + 1] ?? data.heroImages[0]} />
      );
      nodes.push(
        <div key={`grp-${i}`} className="tdp2-itin-city-group">
          {cityDays.map((day, di) => {
            const gIdx = startDay + di;
            return (
              <React.Fragment key={gIdx}>
                <DayCard day={day} index={gIdx} isOpen={openDays.has(gIdx)} onToggle={() => toggleDay(gIdx)} />
                {gIdx !== lastDayIdx && <div className="tdp2-itin-day-divider" />}
              </React.Fragment>
            );
          })}
        </div>
      );
    });
    data.itinerary.slice(dayOffset).forEach((day, di) => {
      const gIdx = dayOffset + di;
      nodes.push(
        <DayCard key={`tail-${gIdx}`} day={day} index={gIdx} isOpen={openDays.has(gIdx)} onToggle={() => toggleDay(gIdx)} />
      );
      if (gIdx !== lastDayIdx) nodes.push(<div key={`tail-div-${gIdx}`} className="tdp2-itin-day-divider" />);
    });
    return nodes;
  })();

  return (
    <div className="dtdp">
      {/* ── Light sticky header (Figma 6184:24375 "default-header") ──────── */}
      <header className="dtdp-header">
        <button className="dtdp-header-logo" onClick={() => navigate("/")} aria-label="WanderOn home">
          <img src="/figma/nav2/logo.png" alt="WanderOn" />
        </button>
        <nav className="dtdp-header-right">
          <span className="dtdp-header-link">MICE</span>
          <button className="dtdp-header-link" onClick={() => navigate("/")}>
            Destinations
          </button>
          <button className="dtdp-header-search" aria-label="Search">
            <svg width="45" height="36" viewBox="0 0 45 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <rect x="0.45" y="0.45" width="44.1" height="35.1" rx="17.55" fill="black" />
              <rect x="0.45" y="0.45" width="44.1" height="35.1" rx="17.55" stroke="#4D4D4D" strokeWidth="0.9" />
              <path
                d="M22.602 14.3252C22.7819 14.1022 23.1113 14.0653 23.3054 14.276C23.4996 14.4869 23.6685 14.7209 23.8064 14.9738C24.0273 15.3788 24.1667 15.8235 24.2159 16.2823C24.265 16.741 24.2225 17.2053 24.0923 17.648C24.0111 17.9241 23.8966 18.189 23.7515 18.4361C23.6063 18.683 23.2756 18.7165 23.0526 18.5367C22.8296 18.3569 22.8008 18.0317 22.9302 17.7761C22.9984 17.6416 23.0545 17.5005 23.0972 17.3552C23.1889 17.0434 23.2175 16.7164 23.183 16.3932C23.1484 16.0699 23.0505 15.7556 22.8948 15.4702C22.8223 15.3374 22.7381 15.2118 22.6431 15.095C22.4624 14.8726 22.422 14.5483 22.602 14.3252Z"
                fill="white"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M20.7215 10.8C23.9559 10.8 26.5778 13.422 26.5778 16.6563C26.5778 17.8199 26.2365 18.9029 25.6514 19.8144L29.705 23.1211C30.2061 23.5301 30.2798 24.2682 29.8709 24.7693C29.4619 25.2703 28.7249 25.3451 28.2238 24.9363L24.0134 21.5003C23.0753 22.1391 21.9421 22.5126 20.7215 22.5126C17.4872 22.5126 14.8652 19.8907 14.8652 16.6563C14.8652 13.422 17.4872 10.8 20.7215 10.8ZM20.7215 11.9713C18.0102 11.9713 16.0365 13.945 16.0365 16.6563C16.0365 19.3677 18.0102 21.3413 20.7215 21.3413C23.4329 21.3413 25.4066 19.3677 25.4066 16.6563C25.4066 13.945 23.4329 11.9713 20.7215 11.9713Z"
                fill="white"
              />
            </svg>
          </button>
          <button className="dtdp-header-events" onClick={() => navigate("/events")}>
            Events
          </button>
          <button className="dtdp-header-profile" onClick={() => navigate("/profile")} aria-label="Profile">
            <img src={`${BOOK}hd-profile.svg`} alt="" aria-hidden />
          </button>
        </nav>
      </header>

      {/* ── Hero gallery (Figma 5652:12023) ─────────────────────────────── */}
      <section className="dtdp-gallery">
        <div className="dtdp-gallery-inner">
          <div className="dtdp-gallery-left">
            <div className="dtdp-gallery-img dtdp-gallery-img--main" onClick={() => openGallery(0)}>
              <img src={HERO_GRID[0]} alt={data.title} loading="eager" />
            </div>
            <div className="dtdp-gallery-img dtdp-gallery-img--mid" onClick={() => openGallery(1)}>
              <img src={HERO_GRID[1]} alt="" loading="lazy" />
            </div>
          </div>
          <div className="dtdp-gallery-right">
            <div className="dtdp-gallery-img dtdp-gallery-img--tr" onClick={() => openGallery(2)}>
              <img src={HERO_GRID[2]} alt="" loading="lazy" />
            </div>
            <div className="dtdp-gallery-img dtdp-gallery-img--more" onClick={() => openGallery(3)}>
              <img src={HERO_GRID[3]} alt="" loading="lazy" />
              <div className="dtdp-gallery-more-overlay" aria-hidden>
                <span className="dtdp-gallery-more-count">({gallery.length}+)</span>
                <span className="dtdp-gallery-more-label">View Gallery</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Product title + actions + services (Figma 5652:12023) ────────── */}
      <section className="dtdp-ptitle" ref={ptitleRef}>
        <div className="dtdp-title-row">
          <h1 className="dtdp-title">{data.title}</h1>
          <div className="dtdp-title-actions">
            <button className="dtdp-pill-action" type="button" aria-pressed={inCompare} onClick={toggleCompare}>
              {inCompare ? (
                <svg width={13} height={13} viewBox="0 0 14 14" fill="none" aria-hidden>
                  <path d="M3 3L11 11M11 3L3 11" stroke="#757575" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
              ) : (
                <img src="/figma/trip-hero/icon-compare.svg" alt="" width={13} height={13} aria-hidden />
              )}
              <span>{inCompare ? "Remove" : "Compare"}</span>
            </button>
            <button
              className={`dtdp-icon-btn${wishlisted ? " dtdp-icon-btn--saved" : ""}`}
              type="button"
              aria-label="Add to wishlist"
              aria-pressed={wishlisted}
              onClick={() => setWishlisted((w) => !w)}
            >
              {wishlisted ? (
                <svg viewBox="0 0 24 24" width={16} height={16} fill="none" aria-hidden>
                  <path
                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                    fill="#f2545b"
                  />
                </svg>
              ) : (
                <img src="/figma/trip-hero/icon-heart.svg" alt="" width={15} height={15} aria-hidden />
              )}
            </button>
            <button className="dtdp-icon-btn" type="button" aria-label="Share" onClick={() => setShareOpen(true)}>
              <img src="/figma/trip-hero/icon-share.svg" alt="" width={13} height={13} aria-hidden />
            </button>
          </div>
        </div>
        <div className="dtdp-meta-row">
          <span className="dtdp-meta-chip">{data.duration}</span>
          <span className="dtdp-meta-chip">{data.totalBatches}</span>
          <span className="dtdp-meta-chip">Group Size: {data.groupSize}</span>
        </div>
        <div className="dtdp-services">
          {SERVICES.map((s) => (
            <div className="dtdp-service" key={s.label}>
              <img src={s.icon} alt="" className="dtdp-service-icon" aria-hidden />
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Two-column: details/itinerary + sticky booking card ─────────── */}
      <div className="dtdp-body">
        <div className="dtdp-main">
          {/* Nights breakdown (Figma 6228:8489) — duration pill + per-city nights */}
          {data.cityStrip.length > 0 && (
            <div className="dtdp-nights">
              <span className="dtdp-nights-pill">{data.duration}</span>
              <div className="dtdp-nights-list">
                {data.cityStrip.map((entry, i) => {
                  const m = entry.match(/^(\d+)N\s+(.+)$/i);
                  const num = m?.[1] ?? "";
                  const city = m?.[2] ?? entry;
                  return (
                    <div className="dtdp-nights-item" key={i}>
                      <span className="dtdp-nights-sep" aria-hidden />
                      <div className="dtdp-nights-group">
                        <span className="dtdp-nights-num">{num}</span>
                        <span className="dtdp-nights-info">
                          <span className="dtdp-nights-label">nights in</span>
                          <span className="dtdp-nights-city">{city}</span>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Pick Up / Drop */}
          <div className="dtdp-pd">
            <div className="dtdp-pd-col">
              <div className="dtdp-pd-label">
                <img src={`${TI}location-icon.svg`} alt="" aria-hidden />
                <span>Pick Up</span>
              </div>
              <p className="dtdp-pd-city">{data.pickUp}</p>
            </div>
            <div className="dtdp-pd-line" aria-hidden />
            <div className="dtdp-pd-col dtdp-pd-col--right">
              <div className="dtdp-pd-label">
                <img src={`${TI}location-icon.svg`} alt="" aria-hidden />
                <span>Drop</span>
              </div>
              <p className="dtdp-pd-city">{data.drop}</p>
            </div>
          </div>

          {/* Vibes — "Is this trip for me?" footprints */}
          <div className="dtdp-vibes">
            {data.fitTags.map((tag) => (
              <TiFitRow key={tag.label} label={tag.label} rating={tag.rating} />
            ))}
          </div>

          {/* Tab bar — sits in-flow (parent width); goes full-bleed when it
              sticks below the header. The sentinel drives the "stuck" state. */}
          <div ref={tabsSentinelRef} className="dtdp-tabs-sentinel" aria-hidden />
          <div className={`dtdp-tabs-wrap${tabsStuck ? " stuck" : ""}`}>
            <div className="dtdp-tabs-bar">
              <div className="dtdp-tabs">
                {TABS.map((t, i) => (
                  <button
                    key={t}
                    className={`dtdp-tab${activeTab === i ? " active" : ""}`}
                    onClick={() => {
                      setActiveTab(i);
                      scrollToSection(TAB_SECTIONS[i]);
                    }}
                  >
                    {i === 0 && <img src={`${HL}icon-overview-key.svg`} alt="" aria-hidden />}
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Itinerary — Day Plan rail + day cards */}
          <section id="dtdp-section-itin" className="dtdp-itin">
            <aside className="dtdp-dayplan">
              <p className="dtdp-dayplan-title">Day Plan</p>
              <div className="dtdp-dayplan-list">
                {data.itinerary.map((_, i) => (
                  <button
                    key={i}
                    className={`dtdp-dayplan-item${activeDay === i ? " active" : ""}`}
                    onClick={() => scrollToDay(i)}
                  >
                    <span className="dtdp-dayplan-dot" aria-hidden />
                    {`Day-${i + 1}`}
                  </button>
                ))}
              </div>
            </aside>

            <div className="dtdp-itin-content">
              <div className="tdp2-itin-map-wrap">
                <img src="/figma/itin-section/route-map.png" alt="Trip route map" className="tdp2-itin-map" loading="lazy" />
              </div>
              {data.cityStrip.length > 0 && (
                <SharedTransfer from={data.pickUp || "Airport"} to={`${parseCityStrip(data.cityStrip[0]).city} Hotel`} />
              )}
              {itineraryNodes}
              <p className="tdp2-end-journey">End of the Journey</p>
            </div>
          </section>

          {/* Inclusions */}
          <section id="dtdp-section-incl" className="dtdp-accordion">
            <button className="dtdp-accordion-head" onClick={() => setInclOpen((o) => !o)}>
              <img src={`${HL}icon-overview-key.svg`} alt="" aria-hidden />
              <span>Inclusions</span>
              <span className={`dtdp-accordion-chev${inclOpen ? " open" : ""}`} aria-hidden>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M6 9l6 6 6-6" stroke="#3d3d3d" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </button>
            {inclOpen && (
              <div className="dtdp-accordion-body">
                <ul className="dtdp-incl-list">
                  {data.inclusions.map((inc, i) => (
                    <li key={i} className="dtdp-incl-item dtdp-incl-item--yes">
                      <img src="/figma/itin-section/incl-check.png" alt="" aria-hidden />
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
                <div className="dtdp-incl-insurance">
                  <p className="dtdp-incl-ins-title">Medical and Baggage Insurance included</p>
                  <p className="dtdp-incl-ins-body">
                    The price includes Medical and Baggage Insurance which covers all services included in the WanderOn
                    trip. International flights and any arrangements booked independently outside of the WeRoad trip are
                    excluded. Any pre-existing medical condition is also excluded.
                  </p>
                </div>
              </div>
            )}
          </section>

          {/* Exclusions */}
          <section id="dtdp-section-excl" className="dtdp-accordion">
            <button className="dtdp-accordion-head" onClick={() => setExclOpen((o) => !o)}>
              <img src={`${HL}icon-overview-key.svg`} alt="" aria-hidden />
              <span>Exclusions</span>
              <span className={`dtdp-accordion-chev${exclOpen ? " open" : ""}`} aria-hidden>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M6 9l6 6 6-6" stroke="#3d3d3d" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </button>
            {exclOpen && (
              <div className="dtdp-accordion-body">
                <ul className="dtdp-incl-list">
                  {data.exclusions.map((exc, i) => (
                    <li key={i} className="dtdp-incl-item dtdp-incl-item--no">
                      <img src="/figma/itin-section/excl-x.png" alt="" aria-hidden />
                      <span>{exc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        </div>

        {/* Sticky booking card (Figma 5788:7351) */}
        <aside className={`dtdp-book${tabsStuck ? " tabs-stuck" : ""}`}>
          <div className="dtdp-book-card">
            <div className={`dtdp-book-head${showBookTitle ? " show-title" : ""}`}>
              <p className="dtdp-book-title">{data.title}</p>
              <div className="dtdp-book-dur">
                <img src={`${BOOK}bc-calendar.svg`} alt="" aria-hidden />
                <span>{data.duration}</span>
              </div>
            </div>

            {showBookTitle && <div className="dtdp-book-divider" aria-hidden />}

            <div className="dtdp-book-price">
              <div className="dtdp-book-price-col">
                <span className="dtdp-book-disc">-10%</span>
                <span className="dtdp-book-strike">{strikePrice}</span>
              </div>
              <span className="dtdp-book-price-main">&#8377;{data.displayPrice}</span>
              <span className="dtdp-book-price-sub">Starting price per person</span>
            </div>

            <div className="dtdp-book-cta-wrap">
              <button className="dtdp-book-cta" type="button" onClick={() => setBatchesOpen(true)}>
                View Batches
              </button>
            </div>

            <div className="dtdp-book-women">
              <img src={`${BOOK}bc-women.svg`} alt="" aria-hidden />
              <span>{data.womenBadge}</span>
            </div>
          </div>
        </aside>
      </div>

      {/* ── Meet your trip captain (Figma 3999:11569) ───────────────────── */}
      <section id="dtdp-section-captains" className="dtdp-captain">
        <h2 className="dtdp-captain-title">Meet your trip captain</h2>
        <div className="dtdp-captain-cols">
          <div className="dtdp-captain-left">
            <div className="dtdp-captain-avstack">
              {CAP_AV.map((src, i) => (
                <span className="dtdp-captain-av" key={i}>
                  <img src={src} alt="" loading="lazy" />
                </span>
              ))}
            </div>
            <p className="dtdp-captain-desc">
              Our Group Leaders are chosen because they&rsquo;re people just like you: passionate travellers who share the
              experience authentically, while having the skills to take care of the organisation, and help you get the
              most out of every moment of the trip.
            </p>
          </div>
          <div className="dtdp-captain-right">
            {CAP_BULLETS.map((b) => (
              <div className="dtdp-captain-bullet" key={b.title}>
                <img src={b.icon} alt="" className="dtdp-captain-bullet-icon" aria-hidden />
                <div>
                  <p className="dtdp-captain-bullet-title">{b.title}</p>
                  <p className="dtdp-captain-bullet-body">{b.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Reviews / Why Choose Us (shared) ────────────────────────────── */}
      <div id="dtdp-section-reviews">
        <DesktopWhyChooseUs />
      </div>

      {/* ── More Europe Trips (shared carousel) ─────────────────────────── */}
      <DesktopTrips
        trips={relatedGroups}
        loading={false}
        title={`More ${productDest} Trips`}
        seeAllHref={moreHref}
      />

      {/* ── FAQs (Figma 3999:11813) ─────────────────────────────────────── */}
      <section className="dtdp-faq">
        <div className="dtdp-faq-head">
          <h2 className="dtdp-faq-title">Frequently Asked Questions</h2>
          <p className="dtdp-faq-sub">Your Questions, Answered!</p>
        </div>
        <div className="dtdp-faq-list">
          {TDP_FAQS.map((f, i) => {
            const open = openFaq === i;
            return (
              <div key={f.q} className={`dtdp-faq-row${open ? " open" : ""}`}>
                <button
                  type="button"
                  className="dtdp-faq-btn"
                  aria-expanded={open}
                  onClick={() => setOpenFaq(open ? -1 : i)}
                >
                  <span className="dtdp-faq-num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="dtdp-faq-q">{f.q}</span>
                  <span className="dtdp-faq-toggle" aria-hidden>
                    {open ? "\u2212" : "+"}
                  </span>
                </button>
                {open && <p className="dtdp-faq-a">{f.a}</p>}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Enquire CTA (Figma 5874:18789) ──────────────────────────────── */}
      <DesktopQuery title="Your next group is forming." sub="Tell us where. We'll find your people." />

      <DesktopFooterMsg />

      {/* ── Sheets ──────────────────────────────────────────────────────── */}
      <GallerySheet
        isOpen={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        images={gallery}
        startIndex={galleryIndex}
        title={data.title}
        tags={data.cityStrip.map((c) => parseCityStrip(c).city)}
      />
      <ShareSheet
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        title={data.title}
        image={data.heroImages[0]}
        duration={data.duration}
        price={data.displayPrice}
      />
      <BatchesSheet isOpen={batchesOpen} onClose={() => setBatchesOpen(false)} tripTitle={data.title} nights={7} />
    </div>
  );
}
