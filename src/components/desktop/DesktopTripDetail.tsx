import React, { useEffect, useMemo, useRef, useState } from "react";
import type { Trip, TripGroup } from "@/types";
import type { ProductData } from "@/repositories";
import { useAppNav } from "@/hooks/useAppNav";
import { useCompare } from "@/context/CompareContext";
import { TDP_FAQS } from "@/repositories";
import { useProductList } from "@/hooks/useProductList";
import { DayCard, FaqItem, TiFitRow, TripGlance } from "@/components/TripItinerary";
import { anchorForDay, cityAnchors, itineraryTransfers, tripGlance } from "@/utils/tripItinerary";
import "../../views/TripDetail.css";
import ShareSheet from "@/components/ShareSheet";
import HeartIcon from "@/components/ui/HeartIcon";
import ToggleSwitch from "@/components/ui/ToggleSwitch";
import DesktopNav from "./DesktopNav";
import DesktopBatchesSheet from "./DesktopBatchesSheet";
import DesktopWhyChooseUs from "./DesktopWhyChooseUs";
import DesktopTrips from "./DesktopTrips";
import DesktopQuery from "./DesktopQuery";
import DesktopStoriesGallery from "./DesktopStoriesGallery";
import EndMark from "@/components/ui/EndMark";
import DesktopFooter from "./DesktopFooter";
import "./DesktopTripDetail.css";
import CtaButton from "@/components/ui/CtaButton";
import ContactFormSheet from "@/components/ContactFormSheet";
import { useTripEnquiry } from "@/hooks/useTripEnquiry";
import AppLink from "@/components/ui/AppLink";
import { onAppScroll } from "@/utils/scroll";

const BOOK = "/figma/desktop-trip/";
const MG = "/figma/itin-section/";
const PDP = "/figma/desktop-pdp/";

// Meet your trip captain (Figma 10948:65821).
const CAP_AV = [`${PDP}captain-av-1.png`, `${PDP}captain-av-2.png`, `${PDP}captain-av-3.png`];
const CAP_BULLETS = [
  {
    icon: `${PDP}captain-icon-certified.svg`,
    title: "Certified",
    body: "Every captain is Wanderon-certified and first-aid trained before they ever lead a batch.",
  },
  {
    icon: `${PDP}captain-icon-route.svg`,
    title: "Knows the route by heart",
    body: "Minimum 10 runs on a route before leading it solo. They know the shortcuts and the scams.",
  },
  {
    icon: `${PDP}captain-icon-women.svg`,
    title: "Women captains on request",
    body: "Booking a Wander Women batch, or just prefer it? We'll assign a woman captain.",
  },
];

// Package Type selector (Figma 10703:19980) — SCHEMA_TODO.md #3.
type PackageTier = "budget" | "standard" | "premium";
const PACKAGE_TIERS: { key: PackageTier; label: string }[] = [
  { key: "budget", label: "Budget" },
  { key: "standard", label: "Standard" },
  { key: "premium", label: "Premium" },
];

// Hero gallery grid images (Figma 5652:12023)
const HERO_GRID = [
  `${BOOK}hero-g1.png`,
  `${BOOK}hero-g2.png`,
  `${BOOK}hero-g3.png`,
  `${BOOK}hero-g4.png`,
];

const TABS = ["Trip at a Glance", "Itinerary", "Inclusions", "Exclusions", "Reviews", "Trip Captains"];
const TAB_SECTIONS = [
  "dtdp-section-itin",
  "dtdp-section-itin",
  "dtdp-section-incl",
  "dtdp-section-excl",
  "dtdp-section-reviews",
  "dtdp-section-captains",
];

export interface DesktopTripDetailProps {
  /** Already-fetched by the parent TripDetailView's own useProductData()
   *  call — this component must NOT fetch it again itself. That duplicate
   *  fetch (both trees independently calling useProductData for the same
   *  id) was a real bug; receiving `data` as a prop is the fix. */
  data: ProductData;
  slug: string;
}

/** Desktop (≥1024px) product / trip-detail page — Figma frame 3999:11555.
 *  Content (title, itinerary, inclusions, captain, FAQs …) is reused verbatim
 *  from the mobile product page via the shared STATIC_DATA export. */
export default function DesktopTripDetail({ data, slug }: DesktopTripDetailProps) {
  const nav = useAppNav();

  const [wishlisted, setWishlisted] = useState(false);
  // Private (customised) trips: "Enquire Now" opens the contact form, then
  // the CTA stays disabled as "Enquiry Submitted".
  const [enquireOpen, setEnquireOpen] = useState(false);
  const enquiry = useTripEnquiry(slug);
  const [activeTab, setActiveTab] = useState(0);
  // "Trip at a Glance" (default) and "Itinerary" swap the same slot; the
  // other tabs scroll to their sections (Figma 10703:19844 / 3999:11555).
  const [itinView, setItinView] = useState<"glance" | "itinerary">("glance");
  const [activeAnchor, setActiveAnchor] = useState(0);
  const [openDays, setOpenDays] = useState<Set<number>>(new Set([0]));
  const [showItineraryMap, setShowItineraryMap] = useState(false);
  // Inclusions / Exclusions: both closed by default; opening one closes the other.
  const [openList, setOpenList] = useState<"incl" | "excl" | null>(null);
  const inclOpen = openList === "incl";
  const exclOpen = openList === "excl";
  const toggleList = (which: "incl" | "excl") => setOpenList((cur) => (cur === which ? null : which));
  const [packageTier, setPackageTier] = useState<PackageTier>("budget");
  const [openFaq, setOpenFaq] = useState(0);
  const [tabsStuck, setTabsStuck] = useState(false);
  const tabsSentinelRef = useRef<HTMLDivElement>(null);

  // Sheets
  const [batchesOpen, setBatchesOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const compareSlug = slug || "current-trip";
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
  /* Hero image / "View Gallery" clicks open the dedicated gallery page. */
  const openGallery = (idx = 0) => nav.push(`/trip/${slug}/gallery?i=${idx}`);

  function scrollToSection(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  function selectTab(i: number) {
    setActiveTab(i);
    if (i === 0) setItinView("glance");
    if (i === 1) setItinView("itinerary");
    requestAnimationFrame(() => scrollToSection(TAB_SECTIONS[i]));
  }

  const anchors = useMemo(() => cityAnchors(data.itinerary), [data.itinerary]);
  const glance = useMemo(() => tripGlance(data), [data]);
  // Day Plan city → first day in that city: expand it and scroll to it.
  const spyPaused = useRef(false);
  const spyTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  function scrollToAnchor(i: number) {
    const dayIndex = anchors[i]?.firstDay;
    if (dayIndex == null) return;
    setActiveAnchor(i);
    setOpenDays((prev) => (prev.has(dayIndex) ? prev : new Set(prev).add(dayIndex)));
    spyPaused.current = true;
    clearTimeout(spyTimer.current);
    spyTimer.current = setTimeout(() => { spyPaused.current = false; }, 900);
    requestAnimationFrame(() =>
      document.getElementById(`day-${dayIndex}`)?.scrollIntoView({ behavior: "smooth", block: "start" })
    );
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


  // Scroll-spy: highlight the Day Plan city for the day sitting under the
  // sticky tab bar (header 72 + tabs 44 + breathing room).
  useEffect(() => {
    if (itinView !== "itinerary" || !anchors.length) return;
    const onScroll = () => {
      if (spyPaused.current) return;
      let current = 0;
      for (let d = 0; d < data.itinerary.length; d++) {
        const el = document.getElementById(`day-${d}`);
        if (el && el.getBoundingClientRect().top <= 200) current = d;
      }
      setActiveAnchor(anchorForDay(anchors, current));
    };
    return onAppScroll(onScroll);
  }, [data.itinerary.length, itinView, anchors]);

  // ── Related "More Europe Trips" (same filter as mobile) ──────────────────
  // ── Similar Trips (Figma 10948:66117) — live trips for this destination ──
  const productDest = data.breadcrumbs[data.breadcrumbs.length - 1] ?? "";
  const { items: destTrips, loading: similarLoading } = useProductList({ destination: productDest });
  const relatedGroups = useMemo<TripGroup[]>(
    () => [{
      title: "", year: "", month: "",
      tripsArray: destTrips.filter((t: Trip) => t.slug !== slug).slice(0, 8),
    }],
    [destTrips, slug]
  );
  const moreHref = `/search?destination=${encodeURIComponent(productDest)}`;

  // Trip start / Trip End (Figma 10703:19899) — first and last itinerary
  // stop until products carry real pickup/drop points (SCHEMA_TODO.md #4).
  const tripStart = anchors[0]?.city ?? "";
  const tripEnd = anchors[anchors.length - 1]?.city ?? "";

  const transfers = useMemo(() => itineraryTransfers(data), [data]);
  const itineraryNodes = data.itinerary.map((day, index) => (
    <React.Fragment key={index}>
      <DayCard
        day={day}
        index={index}
        transfer={transfers[index]}
        isOpen={openDays.has(index)}
        onToggle={() => toggleDay(index)}
      />
      {index < data.itinerary.length - 1 && <div className="tdp2-itin-day-divider" />}
    </React.Fragment>
  ));

  return (
    <div className="dtdp">
      {/* ── Shared fixed header (always solid — no dark hero on this page) ─ */}
      <DesktopNav alwaysSolid />

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

      {/* ── Product title + breadcrumb (Figma 10948:66319) ─────────────── */}
      <section className="dtdp-ptitle">
        <h1 className="dtdp-title">{data.title}</h1>
        <nav className="dtdp-crumbs" aria-label="Breadcrumb">
          <AppLink to="/" className="dtdp-crumb-home" aria-label="Home">
            <img loading="lazy" src={`${PDP}icon-home.svg`} width={12} height={13} alt="" aria-hidden />
          </AppLink>
          {data.breadcrumbs.map((crumb) => (
            <React.Fragment key={crumb}>
              <span className="dtdp-crumb-sep" aria-hidden>&gt;</span>
              <AppLink to={`/search?destination=${encodeURIComponent(crumb)}`} className="dtdp-crumb">
                {crumb}
              </AppLink>
            </React.Fragment>
          ))}
        </nav>
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

          {/* Trip start / Trip End (Figma 10703:19899) */}
          {tripStart && (
            <div className="dtdp-ends">
              <div className="dtdp-end">
                <span className="dtdp-end-label">
                  <img loading="lazy" src={`${PDP}icon-location.svg`} width={10} height={12} alt="" aria-hidden />
                  Trip start
                </span>
                <span className="dtdp-end-place">{tripStart}</span>
              </div>
              <span className="dtdp-ends-line" aria-hidden />
              <div className="dtdp-end dtdp-end--right">
                <span className="dtdp-end-label">
                  <img loading="lazy" src={`${PDP}icon-location.svg`} width={10} height={12} alt="" aria-hidden />
                  Trip End
                </span>
                <span className="dtdp-end-place">{tripEnd}</span>
              </div>
            </div>
          )}

          {/* Vibes — "Is this trip for me?" footprints */}
          <div className="dtdp-vibes">
            {data.fitTags.map((tag) => (
              <TiFitRow key={tag.label} label={tag.label} rating={tag.rating} />
            ))}
          </div>

          {/* Package Type (Figma 10703:19980) */}
          <section className="dtdp-pkg" aria-labelledby="dtdp-pkg-title">
            <h2 id="dtdp-pkg-title" className="dtdp-pkg-title">Package Type</h2>
            <div className="dtdp-pkg-options">
              {PACKAGE_TIERS.map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  className={`dtdp-pkg-btn dtdp-pkg-btn--${key}${packageTier === key ? " active" : ""}`}
                  aria-pressed={packageTier === key}
                  onClick={() => setPackageTier(key)}
                >
                  {packageTier === key && (
                    <img loading="lazy" src={`${PDP}icon-check-box.svg`} className="dtdp-pkg-check" width={16} height={16} alt="" aria-hidden />
                  )}
                  {label}
                </button>
              ))}
            </div>
          </section>

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
                    aria-pressed={activeTab === i}
                    onClick={() => selectTab(i)}
                  >
                    {activeTab === i && <img loading="lazy" src="/figma/trip-glance/icon-overview-key.svg" alt="" aria-hidden />}
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {itinView === "glance" ? (
          /* Trip at a Glance (Figma 10703:20895) */
          <section id="dtdp-section-itin" className="dtdp-glance" aria-label="Trip at a Glance">
            <TripGlance glance={glance} captain={data.captain} premiumSelected={packageTier === "premium"} />
          </section>
          ) : (
          /* Itinerary — Show Map + Day Plan rail (Figma 4351:13236) + day cards */
          <section id="dtdp-section-itin" className="dtdp-itin">
            <aside className="dtdp-dayplan">
              <ToggleSwitch
                checked={showItineraryMap}
                onChange={setShowItineraryMap}
                label="Show Map"
                labelOutside
                className="tdp2-itin-map-toggle dtdp-dayplan-map"
                buttonClassName="tdp2-itin-switch"
                imgClassName="tdp2-itin-switch-img"
                ariaLabel={showItineraryMap ? "Hide trip map" : "Show trip map"}
              />
              {anchors.length > 0 && (
                <nav className="dtdp-dayplan-nav" aria-label="Day Plan">
                  <p className="dtdp-dayplan-title">Day Plan</p>
                  <div className="dtdp-dayplan-list">
                    {anchors.map((a, i) => (
                      <button
                        key={`${a.city}-${a.firstDay}`}
                        type="button"
                        className={`dtdp-dayplan-item${activeAnchor === i ? " active" : ""}${i < activeAnchor ? " passed" : ""}`}
                        aria-current={activeAnchor === i ? "true" : undefined}
                        onClick={() => scrollToAnchor(i)}
                      >
                        <img loading="lazy"
                          src={`/figma/trip-glance/${activeAnchor === i ? "dayplan-dot-active" : "dayplan-dot"}.svg`}
                          width={8}
                          height={8}
                          alt=""
                          aria-hidden
                        />
                        {`${a.city} ${a.nights}N`}
                      </button>
                    ))}
                  </div>
                </nav>
              )}
            </aside>

            <div className="dtdp-itin-content">
              {showItineraryMap && (
                <div className="tdp2-itin-map-wrap">
                  <img src={data.mapImage} alt="Trip route map" className="tdp2-itin-map" loading="lazy" />
                </div>
              )}
              <div className="tdp2-itin-days">{itineraryNodes}</div>
              <p className="tdp2-end-journey">End of the Journey</p>
            </div>
          </section>
          )}

          {/* Inclusions / Exclusions cards (Figma 10973:68720 / 10973:68782) */}
          {([
            { id: "dtdp-section-incl", label: "Inclusions", open: inclOpen, toggle: () => toggleList("incl"),
              items: data.inclusions, icon: `${MG}incl-check.png`, kind: "yes" },
            { id: "dtdp-section-excl", label: "Exclusions", open: exclOpen, toggle: () => toggleList("excl"),
              items: data.exclusions, icon: `${MG}excl-x.png`, kind: "no" },
          ] as const).map((c) => (
            <section key={c.id} id={c.id} className="dtdp-ie">
              <button className="dtdp-ie-head" type="button" aria-expanded={c.open} onClick={c.toggle}>
                <img loading="lazy" src={`${PDP}icon-overview-key.svg`} width={16} height={16} alt="" aria-hidden />
                <span className="dtdp-ie-title">{c.label}</span>
                <img loading="lazy"
                  src={`${PDP}icon-arrow-drop.svg`}
                  width={24}
                  height={24}
                  alt=""
                  aria-hidden
                  className={`dtdp-ie-chev${c.open ? " open" : ""}`}
                />
              </button>
              {c.open && (
                <div className="dtdp-ie-body">
                  <ul className="dtdp-ie-list">
                    {c.items.map((text, i) => (
                      <li key={i} className={`dtdp-ie-item dtdp-ie-item--${c.kind}`}>
                        <img loading="lazy" src={c.icon} width={16} height={16} alt="" aria-hidden />
                        <span>{text}</span>
                      </li>
                    ))}
                  </ul>
                  {c.kind === "yes" && (
                    <div className="dtdp-ie-insurance">
                      <p className="dtdp-ie-ins-title">Medical and Baggage Insurance included</p>
                      <p className="dtdp-ie-ins-body">
                        The price includes Medical and Baggage Insurance which covers all services included in the
                        WanderOn trip. International flights and any arrangements booked independently outside of the
                        WanderOn trip are excluded. Any pre-existing medical condition is also excluded.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </section>
          ))}
        </div>

        {/* Actions + sticky booking card (Figma 10703:20180) */}
        <aside className={`dtdp-book${tabsStuck ? " tabs-stuck" : ""}`}>
          <div className="dtdp-book-actions">
            <button
              className={`dtdp-wish${wishlisted ? " dtdp-wish--saved" : ""}`}
              type="button"
              aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
              aria-pressed={wishlisted}
              onClick={() => setWishlisted((w) => !w)}
            >
              {wishlisted ? <HeartIcon filled /> : <img loading="lazy" src={`${PDP}btn-wishlist.svg`} width={40} height={40} alt="" aria-hidden />}
            </button>
            <button className="dtdp-pill-action" type="button" aria-pressed={inCompare} onClick={toggleCompare}>
              <img loading="lazy" src="/figma/trip-hero/icon-compare.svg" className="dtdp-pill-icon--tint" alt="" width={14} height={14} aria-hidden />
              <span>{inCompare ? "Remove from Compare" : "Add to Compare"}</span>
            </button>
            <button className="dtdp-pill-action" type="button" onClick={() => setShareOpen(true)}>
              <img loading="lazy" src={`${PDP}icon-share.svg`} alt="" width={13} height={13} aria-hidden />
              <span>Share</span>
            </button>
          </div>

          <div className="dtdp-book-card">
            <div className="dtdp-book-head">
              <p className="dtdp-book-title">{data.title}</p>
              <div className="dtdp-book-dur">
                <img loading="lazy" src={`${PDP}icon-calendar.svg`} alt="" aria-hidden />
                <span>{data.duration}</span>
              </div>
            </div>

            <div className="dtdp-book-divider" aria-hidden />

            <div className="dtdp-book-price">
              <div className="dtdp-book-price-col">
                <span className="dtdp-book-disc">-10%</span>
                <span className="dtdp-book-strike">{strikePrice}</span>
              </div>
              <span className="dtdp-book-price-main">&#8377;{data.displayPrice}</span>
              <span className="dtdp-book-price-sub">Starting price per person</span>
            </div>

            <div className="dtdp-book-cta-wrap">
              {data.isCustomised ? (
                <CtaButton
                  className="dtdp-book-cta"
                  onClick={() => setEnquireOpen(true)}
                  disabled={enquiry.submitted}
                >
                  {enquiry.submitted ? "Enquiry Submitted" : "Enquire Now"}
                </CtaButton>
              ) : (
                <CtaButton className="dtdp-book-cta" onClick={() => setBatchesOpen(true)}>
                  View Batches
                </CtaButton>
              )}
            </div>

            <div className="dtdp-book-women">
              <img loading="lazy" src={`${PDP}icon-women.svg`} alt="" aria-hidden />
              <span>{data.womenBadge}</span>
            </div>
          </div>
        </aside>
      </div>

      {/* ── Reviews / Why Choose Us (Figma 10703:20234) ─────────────────── */}
      <div id="dtdp-section-reviews">
        <DesktopWhyChooseUs />
      </div>

      {/* ── Meet your trip captain (Figma 10948:65821) ──────────────────── */}
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
                <img loading="lazy" src={b.icon} alt="" className="dtdp-captain-bullet-icon" aria-hidden />
                <div>
                  <p className="dtdp-captain-bullet-title">{b.title}</p>
                  <p className="dtdp-captain-bullet-body">{b.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stories of our travellers (Figma 10947:38984) ──────────────── */}
      <DesktopStoriesGallery />

      {/* ── FAQs (Figma 10948:66341) ────────────────────────────────────── */}
      <section className="dtdp-faq">
        <div className="dtdp-faq-head">
          <h2 className="dtdp-faq-title">Frequently Asked Questions</h2>
          <p className="dtdp-faq-sub">Your Questions, Answered!</p>
        </div>
        <div className="tdp2-faq-list">
          {TDP_FAQS.map((f, i) => (
            <FaqItem
              key={f.q}
              index={i + 1}
              question={f.q}
              answer={f.a}
              isOpen={openFaq === i}
              onToggle={() => setOpenFaq(openFaq === i ? -1 : i)}
            />
          ))}
        </div>
      </section>

      {/* ── Similar Trips (Figma 10948:66117) ───────────────────────────── */}
      <DesktopTrips
        trips={relatedGroups}
        loading={similarLoading}
        title="Similar Trips"
        seeAllHref={moreHref}
      />

      {/* ── Have a query? (Figma 10703:20313) ───────────────────────────── */}
      <DesktopQuery />

      <EndMark variant="desktop" />
      <DesktopFooter />

      {/* ── Sheets ──────────────────────────────────────────────────────── */}
      <ShareSheet
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        title={data.title}
        image={data.heroImages[0]}
        duration={data.duration}
        price={data.displayPrice}
      />
      {data.isCustomised && (
        <ContactFormSheet
          isOpen={enquireOpen}
          onClose={() => setEnquireOpen(false)}
          onSubmitted={enquiry.markSubmitted}
          defaultDestination={data.breadcrumbs?.[0]}
        />
      )}

      <DesktopBatchesSheet
        isOpen={batchesOpen}
        onClose={() => setBatchesOpen(false)}
        tripTitle={data.title}
        duration={data.duration}
        nights={7}
      />

    </div>
  );
}
