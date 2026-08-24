import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
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
import { getRelatedTrips, STATIC_DATA, TDP_FAQS } from "@/repositories";
import { DayCard, FaqItem, TiFitRow } from "@/components/TripItinerary";
import { itineraryTransfers, selectedTrip, type SelectedTrip } from "@/utils/tripItinerary";
import { TripCardItem, ViewMoreCard } from "@/components/UpcomingTrips/TripCardItem";
import { useIsDesktop } from "@/hooks/useIsDesktop";
import DesktopTripDetail from "@/components/desktop/DesktopTripDetail";
import ItineraryCustomiser from "@/components/ItineraryCustomiser";
import HeartIcon from "@/components/ui/HeartIcon";
import ToggleSwitch from "@/components/ui/ToggleSwitch";
import { getScrollTop, onAppScroll } from "@/utils/scroll";
import CtaButton from "@/components/ui/CtaButton";

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

type PackageType = "hotel" | "hostel";

const HL_ICON = "/figma/itin-highlights/";

/** Meals and activities per night on the full route, used to size those counts
 *  for a shorter selection. Everything else comes from the selection itself. */
const PER_NIGHT = {
  hotel:  { meals: 12 / 18, activities: 12 / 18 },
  hostel: { meals:  8 / 18, activities: 12 / 18 },
};

function packageServices(type: PackageType, trip: SelectedTrip) {
  const per = PER_NIGHT[type];
  const count = (rate: number) => Math.max(1, Math.round(rate * trip.nights));
  const stay = type === "hotel" ? "Hotel" : "Hostel";
  return [
    { icon: `${HL_ICON}icon-accommodation.svg`, label: `${trip.nights}N ${stay} Accommodation` },
    { icon: `${HL_ICON}icon-meals.svg`, label: `${count(per.meals)} Meals` },
    // Hotel packages pick you up and drop you off; hostel packages do not.
    ...(type === "hotel"
      ? [{ icon: `${HL_ICON}icon-transfers.svg`, label: "Airport Transfer" }]
      : []),
    { icon: `${HL_ICON}icon-transfers.svg`, label: `${trip.legs} Shared Transfers` },
    { icon: `${HL_ICON}icon-activities.svg`, label: `${count(per.activities)} Activities` },
    { icon: `${HL_ICON}icon-guides.svg`, label: "Trip Captains, Local Guides" },
  ];
}

// ── Main component ────────────────────────────────────────────────────────────
export default function TripDetail() {
  const data = STATIC_DATA;
  const isDesktop = useIsDesktop();
  const navigate = useNavigate();
  const location = useLocation();
  const { slug: routeSlug } = useParams();
  const stickyTitle = data.breadcrumbs?.[1] ? `${data.breadcrumbs[1]} Trip` : data.tripTypeLabel;
  const navState = location.state as
    | { from?: string; selectedBatch?: { dateRange: string; price: string } }
    | null;
  const [selectedBatch, setSelectedBatch] = useState<{ dateRange: string; price: string } | null>(
    navState?.from === "batches" ? navState.selectedBatch ?? null : null
  );
  // Itinerary customiser sheet (interactive train model). `tripSel` holds
  // the trip start/end chosen in the sheet; null = full mother itinerary.
  const [customiserOpen, setCustomiserOpen] = useState(false);
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
  const handleContinueBook = () => navigate("/booking", { state: buildBookingState() });
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
  const [activeDay, setActiveDay] = useState(0);
  const [openFaqs, setOpenFaqs] = useState<Set<number>>(new Set([0]));
  const [openDays, setOpenDays] = useState<Set<number>>(new Set([0]));
  const [showItineraryMap, setShowItineraryMap] = useState(false);
  const transfers = useMemo(() => itineraryTransfers(data), [data]);
  const [packageType, setPackageType] = useState<PackageType>("hotel");
  const [inclOpen, setInclOpen] = useState(false);
  const [exclOpen, setExclOpen] = useState(false);

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



  const tabs = ["Itinerary", "Inclusions", "Exclusions", "Reviews", "Trip Captains"];
  const TAB_SECTIONS = ["section-itin", "section-incl", "section-excl", "section-reviews", "section-captains"];

  function scrollToSection(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function scrollToDay(i: number) {
    setActiveDay(i);
    document.getElementById(`day-${i}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }


  // Related trips filtered by this product's destination (last breadcrumb).
  const productDest = data.breadcrumbs[data.breadcrumbs.length - 1] ?? "";
  const relatedTrips = getRelatedTrips(productDest, routeSlug).slice(0, 6);
  const moreVmA = relatedTrips[0]?.image ?? MORE_TRIP_A;
  const moreVmB = relatedTrips[1]?.image ?? MORE_TRIP_B;
  const moreHref = `/search?destination=${encodeURIComponent(productDest)}`;

  const faqs = TDP_FAQS;

  if (isDesktop) {
    return <DesktopTripDetail />;
  }

  return (
    <div className="tdp2-page">
      <SiteHeader2 destination={data.breadcrumbs[data.breadcrumbs.length - 1]} showBack onBack={() => navigate(-1)} />
      {/* ── Hero (Figma 4518:31778) ─────────────────────────────────────── */}
      <div className="tdp2-hero">
        {/* Background image + gradient */}
        <img
          src={data.heroImages[0] || "/figma/trip-hero/hero-bg.png"}
          alt={data.title}
          className="tdp2-hero-img"
          onClick={() => openGallery(HERO_GALLERY, 0)}
          style={{ cursor: "pointer" }}
        />
        <div className="tdp2-hero-gradient" aria-hidden />

        {/* Fanned gallery stack, above the action bar (Figma 7423:17721) */}
        <button
          className="tdp2-hero-thumb-stack"
          type="button"
          aria-label="Open gallery"
          onClick={() => openGallery(HERO_GALLERY, 1)}
        >
          {["thumb-1", "thumb-2", "thumb-3"].map((name, i) => (
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

        {/* Trip start/end card (Figma 7743:1620) — opens the itinerary customiser */}
        {data.motherItinerary.length > 0 && (() => {
          const routeName = data.breadcrumbs[data.breadcrumbs.length - 1];
          return (<>

          {/* Skeleton itinerary (Figma 7743:1652) — the selected route, arrow-separated */}
          <div
            className="tdp2-sk-route"
            role="button"
            tabIndex={0}
            onClick={() => setCustomiserOpen(true)}
            onKeyDown={e => { if (e.key === "Enter" || e.key === " ") setCustomiserOpen(true); }}
          >
            {trip.cities.map((city, i) => (
              <span key={city} className="tdp2-sk-item">
                {i > 0 && (
                  <img src="/figma/train/route-arrow.svg" alt="" aria-hidden className="tdp2-sk-arrow" loading="lazy" />
                )}
                <span className="tdp2-sk-city">{city}</span>
              </span>
            ))}
          </div>

          <div className="tdp2-se-wrap">
            <div className="tdp2-se-tag">
              This route cover {trip.stops} of {data.motherItinerary.length} stops on our {routeName} Route
            </div>
            <div
              className="tdp2-se-card"
              role="button"
              tabIndex={0}
              onClick={() => setCustomiserOpen(true)}
              onKeyDown={e => { if (e.key === "Enter" || e.key === " ") setCustomiserOpen(true); }}
            >
              <div className="tdp2-se-rail" aria-hidden>
                <img src="/figma/train/card-rail.png" alt="" className="tdp2-se-rail-img" loading="lazy" />
                <img src="/figma/train/card-train.png" alt="" className="tdp2-se-train-img" loading="lazy" />
              </div>
              <div className="tdp2-se-body">
                <div className="tdp2-se-points">
                  <div className="tdp2-se-point">
                    <span className="tdp2-se-label">Trip Start</span>
                    <span className="tdp2-se-value">{data.motherItinerary[trip.start]}</span>
                  </div>
                  <span className="tdp2-se-connector" aria-hidden />
                  <div className="tdp2-se-point">
                    <span className="tdp2-se-label">Trip End</span>
                    <span className="tdp2-se-value">{data.motherItinerary[trip.end]}</span>
                  </div>
                </div>
                <div className="tdp2-se-cta-col">
                  <span className="tdp2-se-cta">
                    <span className="tdp2-se-cta-tag">{trip.nights}N - {trip.days}D</span>
                    <img src="/figma/train/tap-finger.svg" alt="" className="tdp2-se-cta-icon" aria-hidden loading="lazy" />
                    Explore More Options
                  </span>
                </div>
              </div>
            </div>
          </div>
          </>);
        })()}

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
          {(["hotel", "hostel"] as PackageType[]).map(type => {
            const selected = packageType === type;
            return (
              <button
                key={type}
                type="button"
                className={`tdp2-package-type-btn${selected ? " active" : ""}`}
                aria-pressed={selected}
                onClick={() => setPackageType(type)}
              >
                {selected && (
                  <img
                    src="/figma/itin-highlights/package-type-check.svg"
                    alt=""
                    className="tdp2-package-type-check"
                    aria-hidden
                  />
                )}
                {type === "hotel" ? "Hotel" : "Hostel"}
              </button>
            );
          })}
        </div>
      </section>
      <div className="tdp2-separator"/>
      <div className="tdp2-services-strip" aria-live="polite">
        {packageServices(packageType, trip).map(service => (
          <div className="tdp2-inc-chip" key={service.label}>
            <img src={service.icon} alt="" className="tdp2-inc-chip-icon" aria-hidden loading="lazy" />
            <span className="tdp2-inc-chip-text">{service.label}</span>
          </div>
        ))}
      </div>

      {/* ── Tab Bar + Day Chips (Figma 4049:22964) ─────────────────── */}
      <div className="tdp2-separator"/>
      <div className="tdp2-tabs-wrap">
        <div className="tdp2-tabs">
          {tabs.map((t, i) => (
            <button
              key={t}
              className={`tdp2-tab${activeTab === i ? " active" : ""}`}
              onClick={() => { setActiveTab(i); scrollToSection(TAB_SECTIONS[i]); }}
            >
              {i === 0 && (
                <img src="/figma/itin-highlights/icon-overview-key.svg" alt="" className="tdp2-tab-icon" aria-hidden loading="lazy" />
              )}
              {t}
            </button>
          ))}
        </div>
        <div className="tdp2-day-strip">
          {data.itinerary.map((_day, i) => (
            <button
              key={i}
              className={`tdp2-day-chip-btn${activeDay === i ? " active" : ""}`}
              onClick={() => scrollToDay(i)}
            >
              {`Day-${i + 1}`}
            </button>
          ))}
        </div>
      </div>


      {/* ── Itinerary placeholder anchor ─────────────────────────────── */}
      <div className="tdp2-separator"/>
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

      {/* ── Download Itinerary (Figma 3014:13922) ───────────────── */}
      <div className="tdp2-dl-itin-wrap">
        <button className="tdp2-dl-itin-btn">
          <span className="tdp2-dl-itin-label">Download Itinerary</span>
          <img src="/figma/itin-section/download-icon.svg" alt="" className="tdp2-dl-itin-icon" aria-hidden loading="lazy" />
        </button>
      </div>

      {/* ── Inclusions (Figma 3268:10174) ───────────────────────────── */}
      <div className="tdp2-separator"/>
      <section id="section-incl" className="tdp2-incl-section">
        <button className="tdp2-incl-header" onClick={() => setInclOpen(o => !o)}>
          <img src="/figma/itin-highlights/icon-overview-key.svg" alt="" className="tdp2-incl-hd-icon" aria-hidden loading="lazy" />
          <span className="tdp2-incl-hd-label">Inclusions</span>
          <img
            src="/figma/itin-section/day-chevron-dropdown.svg"
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
        <button className="tdp2-incl-header" onClick={() => setExclOpen(o => !o)}>
          <img src="/figma/itin-highlights/icon-overview-key.svg" alt="" className="tdp2-incl-hd-icon" aria-hidden loading="lazy" />
          <span className="tdp2-incl-hd-label">Exclusions</span>
          <img
            src="/figma/itin-section/day-chevron-dropdown.svg"
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

      {/* ── Create Moments carousel (Figma 3014:14121) ─────────────── */}
      <div className="tdp2-separator"/>
      <section className="tdp2-moments-section">
        <p className="tdp2-moments-title">Create<br/>moments you<br/>wish existed</p>
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
            <img src="/figma/nav/whatsapp-btn.svg" alt="" aria-hidden className="tdp2-wa-fab-img" />
          </a>
        )}

        {/* Compare Trips bar — appears when this trip is added to compare */}
        {inCompare && (
          <button
            className="tdp2-compare-bar"
            type="button"
            onClick={() => navigate("/compare")}
          >
            <img
              src="/figma/nav2/icon-compare.svg"
              alt=""
              aria-hidden
              className="tdp2-compare-bar-icon"
            />
            <span>Compare Trips</span>
          </button>
        )}

        {selectedBatch && (
          <div className="tdp2-sticky-tag">
            <div className="tdp2-sticky-tag-left">
              <img
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
          <CtaButton
            className="tdp2-sticky-btn"
            onClick={selectedBatch ? handleContinueBook : () => setBatchesOpen(true)}
          >
            <span className="tdp2-sticky-btn-label">
              {selectedBatch ? "Continue to Book" : "View Batches"}
            </span>
          </CtaButton>
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