import React, { useEffect, useMemo, useRef, useState } from "react";
import { useAppNav } from "@/hooks/useAppNav";
import { useCompare } from "@/context/CompareContext";
import "./TripDetail.css";
import SiteHeader2 from "@/components/SiteHeader2";
import TribeStories from "@/components/TribeStories";
import QueryBanner from "@/components/QueryBanner";
import GallerySheet from "@/components/GallerySheet";
import ShareSheet from "@/components/ShareSheet";
import BatchesSheet from "@/components/BatchesSheet";
import EndMark from "@/components/ui/EndMark";
import Footer from "@/components/Footer";
import { TDP_FAQS, type ProductData } from "@/repositories";
import { useProductList } from "@/hooks/useProductList";
import { useProductData } from "@/hooks/useProductData";
import { DayCard, FaqItem, TiFitRow, TripGlance } from "@/components/TripItinerary";
import { anchorForDay, cityAnchors, itineraryTransfers, selectedTrip, tripGlance } from "@/utils/tripItinerary";
import { TripCardItem, ViewMoreCard } from "@/components/UpcomingTrips/TripCardItem";
import { useIsDesktop } from "@/hooks/useIsDesktop";
import DesktopTripDetail from "@/components/desktop/DesktopTripDetail";
import ItineraryCustomiser from "@/components/ItineraryCustomiser";
import HeartIcon from "@/components/ui/HeartIcon";
import ToggleSwitch from "@/components/ui/ToggleSwitch";
import { getScrollTop, onAppScroll } from "@/utils/scroll";
import CtaButton from "@/components/ui/CtaButton";
import ContactFormSheet from "@/components/ContactFormSheet";
import { useTripEnquiry } from "@/hooks/useTripEnquiry";

// ── Figma-downloaded assets ──────────────────────────────────────────────────
/* Same on/off switch art the listing page uses for its "Show Features" toggle. */


// moments gallery carousel
const MG = "/figma/itin-section/";
const MOMENTS_SLOTS = [
  { img: `${MG}moments-g2.jpg`, w: 159, h: 205 },
  { img: `${MG}moments-g3.jpg`, w: 159, h: 132 },
  { img: `${MG}moments-g4.jpg`, w: 159, h: 205 },
  { img: `${MG}moments-g5.jpg`, w: 213, h: 166 },
  { img: `${MG}moments-g6.jpg`, w: 159, h: 205 },
  { img: `${MG}moments-g7.jpg`, w: 159, h: 142 },
  { img: `${MG}moments-g8.jpg`, w: 180, h: 179 },
  { img: `${MG}moments-g9.jpg`, w: 159, h: 205 },
  { img: `${MG}moments-g10.jpg`, w: 159, h: 134 },
] as const;

// gallery image sets
const HERO_GALLERY = [
  "/figma/trip-hero/hero-bg.png",
  "/figma/trip-hero/thumb-1.png",
  "/figma/trip-hero/thumb-2.png",
  "/figma/trip-hero/thumb-3.png",
  "/figma/trip-hero/thumb-4.png",
  "/figma/trip-hero/thumb-5.png",
];
const MOMENTS_IMGS = MOMENTS_SLOTS.map(s => s.img);

// more trips images (fallback thumbnails for the View More card)
const MORE_TRIP_A = `${MG}more-trip-a.jpg`;
const MORE_TRIP_B = `${MG}more-trip-b.jpg`;

// captain assets
const CAP_AV_A = `${MG}captain-av-a.jpg`;
const CAP_AV_B = `${MG}captain-av-b.jpg`;
const CAP_AV_C = `${MG}captain-av-c.jpg`;
const CAP_ICO_CERT  = `${MG}captain-icon-certified.svg`;
const CAP_ICO_ROUTE = `${MG}captain-icon-route.svg`;
const CAP_ICO_WOMEN = `${MG}captain-icon-women.svg`;





const TI = "/figma/trip-info/";

// Package Type selector (Figma 8173:11469 / 8794:10882) — SCHEMA_TODO.md #3.
type PackageType = "budget" | "standard" | "premium";
const PACKAGE_TIERS: { key: PackageType; label: string }[] = [
  { key: "budget", label: "Budget" },
  { key: "standard", label: "Standard" },
  { key: "premium", label: "Premium" },
];

export interface TripDetailViewProps {
  /** Route slug — a prop (not react-router's useParams()) so this view is
   *  shared as-is with Next.js, which reads its own [slug] route param
   *  server-side instead. */
  slug: string;
  /** Already-fetched by Next.js's page.tsx server-side (by `?id=`, falling
   *  back to the slug); when absent, useProductData() fetches client-side. */
  initialData?: ProductData;
  /** React Router history state carrying a batch picked upstream (e.g. from
   *  Home/Destination's BatchesSheet) — has no Next.js equivalent yet, so
   *  it's undefined there until the sending page threads it through too. */
  navState?: { from?: string; selectedBatch?: { dateRange: string; price: string } } | null;
}

// ── Main component ────────────────────────────────────────────────────────────
export function TripDetailView({ slug: routeSlug, initialData, navState }: TripDetailViewProps) {
  const { data } = useProductData(routeSlug, initialData);
  const isDesktop = useIsDesktop();
  const nav = useAppNav();
  const stickyTitle = data.breadcrumbs?.[1] ? `${data.breadcrumbs[1]} Trip` : data.tripTypeLabel;
  const [selectedBatch, setSelectedBatch] = useState<{ dateRange: string; price: string } | null>(
    navState?.from === "batches" ? navState.selectedBatch ?? null : null
  );
  // Itinerary customiser sheet (interactive train model). `tripSel` holds
  // the trip start/end chosen in the sheet; null = full mother itinerary.
  const [customiserOpen, setCustomiserOpen] = useState(false);
  // Private (customised) trips have no batches: the CTA is "Enquire Now",
  // and turns into a disabled "Enquiry Submitted" once the form is sent.
  const [enquireOpen, setEnquireOpen] = useState(false);
  const enquiry = useTripEnquiry(routeSlug);
  const [tripSel, setTripSel] = useState<{ start: number; end: number } | null>(null);

  // Everything the page quotes — price, duration, service counts — describes
  // the applied selection, priced off the chosen batch when there is one.
  const basePrice = Number(String(selectedBatch?.price ?? data.displayPrice).replace(/[^\d]/g, ""));
  const trip = useMemo(() => selectedTrip(data, tripSel, basePrice), [data, tripSel, basePrice]);

  const buildBookingState = () => ({
    tripTitle: stickyTitle,
    tripName: stickyTitle,
    dateRange: selectedBatch?.dateRange ?? "",
    durationLabel: `${trip.nights}N/${trip.days}D`,
    perPerson: trip.priceLabel.replace("/-", ""),
    travelers: 2,
  });
  const handleContinueBook = () => {
    const bookingState = buildBookingState();
    // Carried as query params too (in addition to `state`, Vite's fast
    // same-tab path) — Next.js's AppNav drops `state` (no equivalent across
    // a hard navigation), so /booking reads these instead. Also makes a
    // refresh on /booking itself survive under Vite, which state never did.
    const qs = new URLSearchParams({
      tripTitle: bookingState.tripTitle,
      dateRange: bookingState.dateRange,
      duration: bookingState.durationLabel,
      perPerson: bookingState.perPerson,
      travelers: String(bookingState.travelers),
    });
    nav.push(`/booking?${qs.toString()}`, { state: bookingState });
  };
  const compareSlug = routeSlug ?? "current-trip";
  const { isInCompare, toggle: toggleCompareTrip } = useCompare();
  const inCompare = isInCompare(compareSlug);
  const toggleCompare = () =>
    toggleCompareTrip({
      slug: compareSlug,
      title: data.title,
      image: data.heroImages[0],
      price: trip.priceLabel,
    });

  const [wishlisted, setWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  // "Trip at a Glance" (default) and "Itinerary" are two views of the same
  // slot; the remaining tabs are scroll anchors into the sections below.
  const [itinView, setItinView] = useState<"glance" | "itinerary">("glance");
  const [activeAnchor, setActiveAnchor] = useState(0);
  const [openFaqs, setOpenFaqs] = useState<Set<number>>(new Set([0]));
  const [openDays, setOpenDays] = useState<Set<number>>(new Set([0]));
  const [showItineraryMap, setShowItineraryMap] = useState(false);
  const transfers = useMemo(() => itineraryTransfers(data), [data]);
  const anchors = useMemo(() => cityAnchors(data.itinerary), [data]);
  const glance = useMemo(() => tripGlance(data), [data]);
  const [packageType, setPackageType] = useState<PackageType>("budget");
  // Inclusions / Exclusions: both closed by default; opening one closes the other.
  const [openList, setOpenList] = useState<"incl" | "excl" | null>(null);
  const inclOpen = openList === "incl";
  const exclOpen = openList === "excl";
  const toggleList = (which: "incl" | "excl") => setOpenList(cur => (cur === which ? null : which));

  // Gallery sheet
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [galleryIndex, setGalleryIndex] = useState(0);

  // Batches sheet
  const [batchesOpen, setBatchesOpen] = useState(false);

  // Share sheet
  const [shareOpen, setShareOpen] = useState(false);

  // WhatsApp FAB — appears once the user scrolls past the first fold (hero).
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowWhatsApp(getScrollTop() > 420);
    onScroll();
    return onAppScroll(onScroll);
  }, []);

  const openGallery = (imgs: string[], idx = 0) => {
    setGalleryImages(imgs);
    setGalleryIndex(idx);
    setGalleryOpen(true);
  };



  const tabs = ["Trip at a Glance", "Itinerary", "Inclusions", "Exclusions", "Reviews", "Trip Captains"];
  const TAB_SECTIONS = ["section-itin", "section-itin", "section-incl", "section-excl", "section-reviews", "section-captains"];

  function scrollToSection(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function selectTab(i: number) {
    setActiveTab(i);
    if (i === 0) setItinView("glance");
    if (i === 1) setItinView("itinerary");
    // Switching views re-renders the slot — scroll once the new content is laid out.
    requestAnimationFrame(() => scrollToSection(TAB_SECTIONS[i]));
  }

  // City anchor → first day in that city: expand it and bring it into view.
  const spyPaused = useRef(false);
  const spyTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  function scrollToAnchor(i: number) {
    const dayIndex = anchors[i]?.firstDay;
    if (dayIndex == null) return;
    setActiveAnchor(i);
    setOpenDays(prev => (prev.has(dayIndex) ? prev : new Set(prev).add(dayIndex)));
    // Keep the scroll-spy from fighting the smooth scroll it just triggered.
    spyPaused.current = true;
    clearTimeout(spyTimer.current);
    spyTimer.current = setTimeout(() => { spyPaused.current = false; }, 900);
    requestAnimationFrame(() =>
      document.getElementById(`day-${dayIndex}`)?.scrollIntoView({ behavior: "smooth", block: "start" })
    );
  }

  // Scroll-spy: highlight the anchor for whichever day sits under the sticky tab bar.
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
  }, [itinView, anchors, data.itinerary.length]);

  // Keep the active anchor chip visible inside its horizontally-scrolling strip.
  const anchorStripRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const strip = anchorStripRef.current;
    const chip = strip?.children[activeAnchor] as HTMLElement | undefined;
    if (!strip || !chip) return;
    const left = chip.offsetLeft - 16;
    if (left < strip.scrollLeft || chip.offsetLeft + chip.offsetWidth > strip.scrollLeft + strip.clientWidth) {
      strip.scrollTo({ left, behavior: "smooth" });
    }
  }, [activeAnchor]);


  // Related trips filtered by this product's destination (last breadcrumb).
  const productDest = data.breadcrumbs[data.breadcrumbs.length - 1] ?? "";
  const { items: destTrips } = useProductList({ destination: productDest });
  const relatedTrips = destTrips.filter(t => t.slug !== routeSlug).slice(0, 6);
  const moreVmA = relatedTrips[0]?.image ?? MORE_TRIP_A;
  const moreVmB = relatedTrips[1]?.image ?? MORE_TRIP_B;
  const moreHref = `/search?destination=${encodeURIComponent(productDest)}`;

  const faqs = TDP_FAQS;

  if (isDesktop) {
    return <DesktopTripDetail data={data} slug={routeSlug} />;
  }

  return (
    <div className="tdp2-page">
      <SiteHeader2 destination={data.breadcrumbs[data.breadcrumbs.length - 1]} showBack onBack={() => nav.back()} />
      {/* ── Hero (Figma 4518:31778) ─────────────────────────────────────── */}
      <div className="tdp2-hero">
        {/* Background image + gradient */}
        <img loading="lazy"
          src={data.heroImages[0] || "/figma/trip-hero/hero-bg.png"}
          alt={data.title}
          className="tdp2-hero-img"
          onClick={() => openGallery(HERO_GALLERY, 0)}
          style={{ cursor: "pointer" }}
        />
        <div className="tdp2-hero-gradient" aria-hidden />

        {/* Fanned gallery stack, above the action bar (Figma 10426:6565) */}
        <button
          className="tdp2-hero-thumb-stack"
          type="button"
          aria-label="Open gallery"
          onClick={() => openGallery(HERO_GALLERY, 1)}
        >
          {["thumb-3", "thumb-4", "thumb-5"].map((name, i) => (
            <span key={name} className={`tdp2-hero-thumb tdp2-hero-thumb--${i + 1}`}>
              <img src={`/figma/trip-hero/${name}.png`} alt="" className="tdp2-hero-thumb-img" loading="lazy" />
              {i === 2 && (
                <>
                  <span className="tdp2-hero-thumb-overlay" aria-hidden />
                  <span className="tdp2-hero-thumb-count">(10+)</span>
                </>
              )}
            </span>
          ))}
        </button>

        {/* Bottom action bar (Figma 4518:31828) */}
        <div className="tdp2-hero-bar">
          <button
            className={`tdp2-hero-btn-wish${wishlisted ? " tdp2-hero-btn-wish--saved" : ""}`}
            type="button"
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            aria-pressed={wishlisted}
            onClick={() => setWishlisted((w) => !w)}
          >
            <HeartIcon filled={wishlisted} />
          </button>
          <button
            className="tdp2-hero-btn-pill"
            type="button"
            aria-pressed={inCompare}
            onClick={toggleCompare}
          >
            {inCompare ? (
              <svg width={14} height={14} viewBox="0 0 14 14" fill="none" aria-hidden>
                <path d="M3 3L11 11M11 3L3 11" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            ) : (
              <img src="/figma/trip-hero/icon-compare.svg" alt="" width={14} height={14} aria-hidden loading="lazy" />
            )}
            {inCompare ? "Remove from Compare" : "Add to Compare"}
          </button>
          <button className="tdp2-hero-btn-pill" type="button" onClick={() => setShareOpen(true)}>
            <img src="/figma/trip-hero/icon-share.svg" alt="" width={14} height={14} loading="lazy" />
            Share
          </button>
        </div>
      </div>

      {/* ── Trip Info Section (Figma 4931:7397) ─────────────────────────── */}
      <div className="tdp2-trip-info">

        {/* Breadcrumb + title + meta chips */}
        <div className="tdp2-ti-card">
          <div className="tdp2-ti-crumb">
            <img src={`${TI}home-icon.svg`} alt="" className="tdp2-ti-home" aria-hidden loading="lazy" />
            <span className="tdp2-ti-sep">{">"}</span>
            {data.breadcrumbs.map((crumb, i) => (
              <span key={i} className="tdp2-ti-crumb-link">
                {crumb}
                {i < data.breadcrumbs.length - 1 && <span className="tdp2-ti-sep"> {">"} </span>}
              </span>
            ))}
          </div>
          <h1 className="tdp2-ti-title">{data.title}</h1>
        </div>

        {/* Skeleton itinerary (Figma 7743:1652) — the selected route,
            arrow-separated; opens the itinerary customiser */}
        {data.motherItinerary.length > 0 && (
          <div
            className="tdp2-sk-route"
            role="button"
            tabIndex={0}
            onClick={() => setCustomiserOpen(true)}
            onKeyDown={e => { if (e.key === "Enter" || e.key === " ") setCustomiserOpen(true); }}
          >
            {/* "2N Leh → 2N Nubra Valley → …" (Figma 8173:11477) */}
            {anchors.map((a, i) => (
              <span key={`${a.city}-${a.firstDay}`} className="tdp2-sk-item">
                {i > 0 && (
                  <img src="/figma/train/route-arrow.svg" alt="" aria-hidden className="tdp2-sk-arrow" loading="lazy" />
                )}
                <span className="tdp2-sk-city">{`${a.nights}N ${a.city}`}</span>
              </span>
            ))}
          </div>
        )}

        {/* Trip Start / Trip End (Figma 9462:24999) — first/last itinerary
            stop until products carry pickup/drop points (SCHEMA_TODO.md #4). */}
        {anchors.length > 0 && (
          <div className="tdp2-ends">
            <div className="tdp2-end">
              <span className="tdp2-end-label">Trip Start</span>
              <span className="tdp2-end-place">{anchors[0].city}</span>
            </div>
            <div className="tdp2-end">
              <span className="tdp2-end-label">Trip End</span>
              <span className="tdp2-end-place">{anchors[anchors.length - 1].city}</span>
            </div>
            <img src="/figma/trip-glance/icon-trip-ends.svg" className="tdp2-ends-icon" width={30} height={30} alt="" aria-hidden />
          </div>
        )}

        {/* Women tag */}
        <div className="tdp2-ti-women">
          <img src={`${TI}women-icon.svg`} alt="" className="tdp2-ti-women-icon" aria-hidden loading="lazy" />
          <span className="tdp2-ti-women-text">{data.womenBadge}</span>
        </div>

        {/* Is this trip for me? */}
        <div className="tdp2-ti-fit">
          <p className="tdp2-ti-fit-title">Is this trip for me?</p>
          <div className="tdp2-ti-fit-rows">
            {data.fitTags.map(tag => <TiFitRow key={tag.label} label={tag.label} rating={tag.rating} />)}
          </div>
        </div>

      </div>

      {/* ── Itinerary highlights (Figma 4077:8358) ─────────────────── */}
      <div className="tdp2-separator"/>
      <section className="tdp2-package-type" aria-labelledby="tdp2-package-type-title">
        <h2 id="tdp2-package-type-title" className="tdp2-package-type-title">Package Type</h2>
        <div className="tdp2-package-type-options">
          {PACKAGE_TIERS.map(({ key: type, label }) => {
            const selected = packageType === type;
            return (
              <button
                key={type}
                type="button"
                className={`tdp2-package-type-btn tdp2-package-type-btn--${type}${selected ? " active" : ""}`}
                aria-pressed={selected}
                onClick={() => setPackageType(type)}
              >
                {selected && (
                  <img loading="lazy"
                    src="/figma/itin-highlights/package-type-check.svg"
                    alt=""
                    className="tdp2-package-type-check"
                    aria-hidden
                  />
                )}
                {label}
              </button>
            );
          })}
        </div>
      </section>
      {/* ── Tab Bar + Day Chips (Figma 4049:22964) ─────────────────── */}
      <div className="tdp2-separator"/>
      <div className="tdp2-tabs-wrap">
        <div className="tdp2-tabs">
          {tabs.map((t, i) => (
            <button
              key={t}
              className={`tdp2-tab${activeTab === i ? " active" : ""}`}
              aria-pressed={activeTab === i}
              onClick={() => selectTab(i)}
            >
              {activeTab === i && (
                <img src="/figma/trip-glance/icon-overview-key.svg" alt="" className="tdp2-tab-icon" aria-hidden loading="lazy" />
              )}
              {t}
            </button>
          ))}
        </div>
        {itinView === "itinerary" && anchors.length > 0 && (
          <div className="tdp2-day-strip" ref={anchorStripRef} aria-label="Jump to city">
            {anchors.map((a, i) => (
              <button
                key={`${a.city}-${a.firstDay}`}
                type="button"
                className={`tdp2-day-chip-btn${activeAnchor === i ? " active" : ""}`}
                aria-current={activeAnchor === i ? "true" : undefined}
                onClick={() => scrollToAnchor(i)}
              >
                {`${a.city} ${a.nights}N`}
              </button>
            ))}
          </div>
        )}
      </div>


      {/* ── Itinerary placeholder anchor ─────────────────────────────── */}
      <div className="tdp2-separator"/>
      {itinView === "glance" ? (
      <section id="section-itin" className="tdp2-itin-section tdp2-glance-section" aria-label="Trip at a Glance">
        <TripGlance glance={glance} captain={data.captain} premiumSelected={packageType === "premium"} />
      </section>
      ) : (
      <section id="section-itin" className="tdp2-itin-section">
        <ToggleSwitch
          checked={showItineraryMap}
          onChange={setShowItineraryMap}
          label="Show Map"
          labelOutside
          className="tdp2-itin-map-toggle"
          buttonClassName="tdp2-itin-switch"
          imgClassName="tdp2-itin-switch-img"
          ariaLabel={showItineraryMap ? "Hide trip map" : "Show trip map"}
        />
        {showItineraryMap && (
          <div className="tdp2-itin-map-wrap">
            <img
              src={data.mapImage}
              alt="Trip route map"
              className="tdp2-itin-map"
              loading="lazy"
            />
          </div>
        )}
        <div className="tdp2-itin-days">
          {data.itinerary.map((day, index) => (
            <React.Fragment key={index}>
              <DayCard
                day={day}
                index={index}
                transfer={transfers[index]}
                isOpen={openDays.has(index)}
                onToggle={() => setOpenDays(prev => {
                  const next = new Set(prev);
                  next.has(index) ? next.delete(index) : next.add(index);
                  return next;
                })}
              />
              {index < data.itinerary.length - 1 && <div className="tdp2-itin-day-divider" />}
            </React.Fragment>
          ))}
        </div>

        <p className="tdp2-end-journey">End of the Journey</p>
      </section>
      )}

      {/* ── Inclusions (Figma 3268:10174) ───────────────────────────── */}
      <div className="tdp2-separator"/>
      <section id="section-incl" className="tdp2-incl-section">
        <button className="tdp2-incl-header" aria-expanded={inclOpen} onClick={() => toggleList("incl")}>
          <img src="/figma/itin-highlights/icon-overview-key.svg" alt="" className="tdp2-incl-hd-icon" aria-hidden loading="lazy" />
          <span className="tdp2-incl-hd-label">Inclusions</span>
          <img
            src="/figma/desktop-pdp/icon-arrow-drop.svg"
            alt=""
            className={`tdp2-incl-hd-chevron${inclOpen ? " open" : ""}`}
            aria-hidden
          loading="lazy" />
        </button>
        {inclOpen && (
          <>
            <div className="tdp2-incl-inner-divider" />
            <div className="tdp2-incl-body">
              <ul className="tdp2-incl-list">
                {data.inclusions.map((inc, i) => (
                  <li key={i} className="tdp2-incl-item">
                    <div className="tdp2-incl-item-icon-wrap">
                      <img src="/figma/itin-section/incl-check.png" alt="" className="tdp2-incl-item-icon" aria-hidden loading="lazy" />
                    </div>
                    <span>{inc}</span>
                  </li>
                ))}
              </ul>
              <div className="tdp2-incl-insurance">
                <p className="tdp2-incl-ins-title">Medical and Baggage Insurance included</p>
                <p className="tdp2-incl-ins-body">The price includes Medical and Baggage Insurance which covers all services included in the WanderOn trip. International flights and any arrangements booked independently outside of the WeRoad trip are excluded. Any pre-existing medical condition is also excluded.</p>
              </div>
            </div>
          </>
        )}
        <div className="tdp2-incl-divider" />
      </section>


      {/* ── Exclusions (Figma 3268:10067 / 3268:10077) ─────────────── */}
      <div className="tdp2-separator"/>
      <section id="section-excl" className="tdp2-excl-section">
        <button className="tdp2-incl-header" aria-expanded={exclOpen} onClick={() => toggleList("excl")}>
          <img src="/figma/itin-highlights/icon-overview-key.svg" alt="" className="tdp2-incl-hd-icon" aria-hidden loading="lazy" />
          <span className="tdp2-incl-hd-label">Exclusions</span>
          <img
            src="/figma/desktop-pdp/icon-arrow-drop.svg"
            alt=""
            className={`tdp2-incl-hd-chevron${exclOpen ? " open" : ""}`}
            aria-hidden
          loading="lazy" />
        </button>
        {exclOpen && (
          <>
            <div className="tdp2-incl-inner-divider" />
            <div className="tdp2-excl-body">
              <ul className="tdp2-incl-list">
                {data.exclusions.map((exc, i) => (
                  <li key={i} className="tdp2-incl-item">
                    <div className="tdp2-incl-item-icon-wrap">
                      <img src="/figma/itin-section/excl-x.png" alt="" className="tdp2-incl-item-icon" aria-hidden loading="lazy" />
                    </div>
                    <span>{exc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
        <div className="tdp2-incl-divider" />
      </section>

      {/* ── Reviews (TribeStories — same as homepage) ─────────────── */}
      <div className="tdp2-separator"/>
      <div id="section-reviews">
        <TribeStories />
      </div>

      {/* ── Meet The Captains (Figma 3724:9265) ──────────────────────── */}
      <div className="tdp2-separator"/>
      <section id="section-captains" className="tdp2-captain-section">
        <p className="tdp2-captain-title">Meet The Captains</p>
        <div className="tdp2-captain-avstack">
          <div className="tdp2-captain-av">
            <div className="tdp2-captain-av-inner">
              <img src={CAP_AV_A} alt="" loading="lazy"/>
            </div>
          </div>
          <div className="tdp2-captain-av tdp2-captain-av--2">
            <div className="tdp2-captain-av-inner">
              <img src={CAP_AV_B} alt="" loading="lazy"/>
            </div>
          </div>
          <div className="tdp2-captain-av tdp2-captain-av--3">
            <div className="tdp2-captain-av-inner">
              <img src={CAP_AV_C} alt="" loading="lazy"/>
            </div>
          </div>
        </div>
        <p className="tdp2-captain-desc">Our Group Leaders are chosen because they&#39;re people just like you: passionate travellers who share the experience authentically, while having the skills to take care of the organisation, and help you get the most out of every moment of the trip.</p>
        <div className="tdp2-captain-bullets">
          <div className="tdp2-captain-bullet">
            <img src={CAP_ICO_CERT} alt="" className="tdp2-captain-bullet-icon" aria-hidden="true" loading="lazy" />
            <div className="tdp2-captain-bullet-text">
              <p className="tdp2-captain-bullet-title">Certified</p>
              <p className="tdp2-captain-bullet-body">Every captain is Wanderon-certified and first-aid trained before they ever lead a batch.</p>
            </div>
          </div>
          <div className="tdp2-captain-bullet">
            <img src={CAP_ICO_ROUTE} alt="" className="tdp2-captain-bullet-icon" aria-hidden="true" loading="lazy" />
            <div className="tdp2-captain-bullet-text">
              <p className="tdp2-captain-bullet-title">Knows the route by heart</p>
              <p className="tdp2-captain-bullet-body">Minimum 10 runs on a route before leading it solo. They know the shortcuts and the scams.</p>
            </div>
          </div>
          <div className="tdp2-captain-bullet">
            <img src={CAP_ICO_WOMEN} alt="" className="tdp2-captain-bullet-icon" aria-hidden="true" loading="lazy" />
            <div className="tdp2-captain-bullet-text">
              <p className="tdp2-captain-bullet-title">Women captains on request</p>
              <p className="tdp2-captain-bullet-body">Booking a Wander Women batch, or just prefer it? We&#39;ll assign a woman captain.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Postcards from 11,000 feet (Figma 8173:11096) ──────────── */}
      <div className="tdp2-separator"/>
      <section className="tdp2-moments-section">
        <p className="tdp2-moments-title">Postcards from 11,000 feet</p>
        <div className="tdp2-moments-track-wrap">
          <div className="tdp2-moments-track">
            {([0, 1] as number[]).flatMap((_, rep) =>
              MOMENTS_SLOTS.map((slot, i) => (
                <div
                  key={`${rep}-${i}`}
                  className="tdp2-moments-slot"
                  style={{ width: slot.w, height: slot.h, cursor: "pointer" }}
                  onClick={() => openGallery(MOMENTS_IMGS, i)}
                  role="button"
                  tabIndex={rep === 0 ? 0 : -1}
                >
                  <img src={slot.img} alt="" loading="lazy"/>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ── FAQs (Figma 4518:7651) ────────────────────────────────────── */}
      <div className="tdp2-separator"/>
      <section className="tdp2-faq-section">
        <p className="tdp2-faq-title">Frequently Asked Questions</p>
        <div className="tdp2-faq-list">
          {faqs.map((faq, i) => (
            <FaqItem key={i} index={i+1} question={faq.q} answer={faq.a} isOpen={openFaqs.has(i)} onToggle={() => {
              setOpenFaqs(prev => prev.has(i) ? new Set<number>() : new Set<number>([i]));
            }}/>
          ))}
        </div>
      </section>

      {/* ── More Trips (Figma 3014:14166) ────────────────────────────── */}
      <div className="tdp2-separator"/>
      <section className="tdp2-more-section">
        <p className="tdp2-more-label">More {productDest} Trips</p>
        <div className="tdp2-more-scroll">
          {relatedTrips.map((t) => (
            <TripCardItem key={t.slug} trip={t} />
          ))}
          <ViewMoreCard a={moreVmA} b={moreVmB} to={moreHref} />
        </div>
      </section>

      {/* ── Enquire Now (QueryBanner — same as homepage) ───────────── */}
      <div className="tdp2-separator"/>
      <QueryBanner />

      <EndMark variant="mobile" />
      <Footer />

      {/* ── Sticky Bottom Nav (Figma 4518:15125 / 5406:15308) ───────── */}
      <div className="tdp2-sticky-nav">
        {/* WhatsApp FAB — floats above the nav, appears past the first fold */}
        {showWhatsApp && (
          <a
            className="tdp2-wa-fab"
            href="https://api.whatsapp.com/send?phone=918130288566&text=Hi+WanderOn%2C+I+have+a+query%21"
            target="_blank"
            rel="noreferrer"
            aria-label="Chat on WhatsApp"
          >
            <img loading="lazy" src="/figma/nav/whatsapp-btn.svg" alt="" aria-hidden className="tdp2-wa-fab-img" />
          </a>
        )}

        {/* Compare Trips bar — appears when this trip is added to compare */}
        {inCompare && (
          <button
            className="tdp2-compare-bar"
            type="button"
            onClick={() => nav.push("/compare")}
          >
            <img loading="lazy"
              src="/figma/nav2/icon-compare.svg"
              alt=""
              aria-hidden
              className="tdp2-compare-bar-icon"
            />
            <span>Compare Trips</span>
          </button>
        )}

        {selectedBatch && !data.isCustomised && (
          <div className="tdp2-sticky-tag">
            <div className="tdp2-sticky-tag-left">
              <img loading="lazy"
                className="tdp2-sticky-tag-icon"
                src="/figma/batches/icon-your-trips.svg"
                alt=""
                aria-hidden
              />
              <span className="tdp2-sticky-tag-title">{stickyTitle}</span>
              <span className="tdp2-sticky-tag-dot" aria-hidden />
              <span className="tdp2-sticky-tag-date">{selectedBatch.dateRange}</span>
            </div>
            <button
              className="tdp2-sticky-tag-change"
              type="button"
              onClick={() => setBatchesOpen(true)}
            >
              Change Batch
            </button>
          </div>
        )}
        <div className="tdp2-sticky-main">
          <div className="tdp2-sticky-price-col">
            <div className="tdp2-sticky-top-row">
              <span className="tdp2-sticky-amount">
                &#8377;{trip.priceLabel}
              </span>
              <div className="tdp2-sticky-discount">-10%</div>
            </div>
            <span className="tdp2-sticky-label">Starting price per person</span>
          </div>
          {data.isCustomised ? (
            <CtaButton
              className="tdp2-sticky-btn"
              onClick={() => setEnquireOpen(true)}
              disabled={enquiry.submitted}
            >
              <span className="tdp2-sticky-btn-label">
                {enquiry.submitted ? "Enquiry Submitted" : "Enquire Now"}
              </span>
            </CtaButton>
          ) : (
            <CtaButton
              className="tdp2-sticky-btn"
              onClick={selectedBatch ? handleContinueBook : () => setBatchesOpen(true)}
            >
              <span className="tdp2-sticky-btn-label">
                {selectedBatch ? "Continue to Book" : "View Batches"}
              </span>
            </CtaButton>
          )}
        </div>
      </div>

      <GallerySheet
        isOpen={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        images={galleryImages}
        startIndex={galleryIndex}
        title="Europe: Paris to Berlin, between cities, canals & culture"
        tags={["Bali", "Ubud", "Kintamani Waterfalls", "Nusa Penida", "Kuta", "Uluwatu Temple"]}
      />

      <ShareSheet
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        title={data.title}
        image={data.heroImages[0]}
        duration={trip.durationLabel}
        price={trip.priceLabel}
      />

      <ItineraryCustomiser
        isOpen={customiserOpen}
        onClose={() => setCustomiserOpen(false)}
        title={data.title}
        thumb={data.heroImages[0]}
        stations={data.motherItinerary}
        nights={data.motherNights}
        basePrice={basePrice}
        initialSelection={tripSel}
        onSelectionChange={(start, end) => setTripSel({ start, end })}
      />

      {data.isCustomised && (
        <ContactFormSheet
          isOpen={enquireOpen}
          onClose={() => setEnquireOpen(false)}
          onSubmitted={enquiry.markSubmitted}
          defaultDestination={data.breadcrumbs?.[0]}
        />
      )}

      <BatchesSheet
        isOpen={batchesOpen}
        onClose={() => setBatchesOpen(false)}
        tripTitle={data.title}
        nights={7}
        ctaLabel={selectedBatch ? "Select Batch" : "Book Trip"}
        onSelectBatch={
          selectedBatch
            ? (batch, start, end) => {
                const fmt = (d: Date, withYear: boolean) =>
                  d.toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    ...(withYear ? { year: "numeric" } : {}),
                  });
                const price = Number(String(batch.price).replace(/,/g, "")).toLocaleString("en-IN");
                setSelectedBatch({
                  dateRange: `${fmt(start, false)} - ${fmt(end, true)}`,
                  price: `${price}/-`,
                });
                setBatchesOpen(false);
              }
            : undefined
        }
      />

    </div>
  );
}
