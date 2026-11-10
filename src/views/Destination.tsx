import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useAppNav } from "@/hooks/useAppNav";
import {
  buildCustomiseTrips,
  getDestinationPage,
  hasDestinationPage,
} from "@/repositories";
import { tripHref } from "@/utils/tripUrl";
import type { Trip } from "@/types";
import TripCard from "@/components/TripCard";
import TripCardShimmer from "@/components/ui/TripCardShimmer";
import { ViewMoreCard } from "@/components/UpcomingTrips/TripCardItem";
import BatchesSheet from "@/components/BatchesSheet";
import FeaturesToggle from "@/components/FeaturesToggle";
import EndMark from "@/components/ui/EndMark";
import TribeStories from "@/components/TribeStories";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import PlotBanner from "@/components/PlotBanner";
import PhotoStack from "@/components/PhotoStack";
import "./Destination.css";
import SiteHeader2 from "@/components/SiteHeader2";
import "../components/UpcomingTrips/UpcomingTrips.css";
import { useIsDesktop } from "@/hooks/useIsDesktop";
import DesktopDestination from "@/components/desktop/DesktopDestination";

/** Horizontal trip strip (Figma 10554:18691): title + optional "See all"
 *  pill, Filters + "Show Highlights" row, the cards, and a scroll indicator
 *  that tracks the strip's horizontal position. */
function TripStrip({
  title,
  seeAllHref,
  showFilters = true,
  showFeatures,
  onShowFeaturesChange,
  children,
}: {
  title: string;
  seeAllHref?: string;
  showFilters?: boolean;
  showFeatures: boolean;
  onShowFeaturesChange: (next: boolean) => void;
  children: ReactNode;
}) {
  const nav = useAppNav();
  const cardsRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = cardsRef.current;
    if (!el) return;
    const onScroll = () => {
      const max = el.scrollWidth - el.clientWidth;
      setProgress(max > 0 ? el.scrollLeft / max : 0);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="up dp-trip-strip">
      <div className="dp-strip-head">
        <div className="up-header-row">
          <p className="up-title">{title}</p>
          {seeAllHref && (
            <button className="dp-see-all" type="button" onClick={() => nav.push(seeAllHref)}>
              See all
              <img src="/figma/destination/icon-arrow-right-alt.svg" width={25} height={25} alt="" aria-hidden />
            </button>
          )}
        </div>
        <div className="dp-strip-filters">
          {/* Kept in the layout (invisible) where the design hides it, so the
              toggle stays right-aligned at the same height. */}
          <button
            className={`up-filter-pill${showFilters ? "" : " dp-strip-filters-hidden"}`}
            type="button"
            tabIndex={showFilters ? undefined : -1}
            aria-hidden={showFilters ? undefined : true}
            onClick={() => window.dispatchEvent(new CustomEvent("wanderon:open-filter"))}
          >
            <span>Filters</span>
            <img src="/figma/trips/filter-icon.svg" width={16} height={16} alt="" aria-hidden />
          </button>
          <FeaturesToggle checked={showFeatures} onChange={onShowFeaturesChange} label="Show Highlights" />
        </div>
      </div>
      <div className="up-cards" ref={cardsRef}>
        {children}
      </div>
      <div className="dp-strip-progress" aria-hidden>
        <div className="dp-strip-track">
          <div className="dp-strip-fill" style={{ left: `${progress * (120 - 33)}px` }} />
        </div>
      </div>
    </section>
  );
}

export interface DestinationViewProps {
  slug: string;
  /** One page (6 items) from the product-list service, filtered by
   *  destination — same source/filter semantics as the listing page. Fetched
   *  server-side by Next.js's page.tsx (getProductListServer). */
  destTrips: Trip[];
  loading: boolean;
}

/** Pure presentational shell — takes `slug`/`destTrips`/`loading` as props. */
export function DestinationView({ slug, destTrips, loading }: DestinationViewProps) {
  const nav = useAppNav();
  const isDesktop = useIsDesktop();
  const data = getDestinationPage(slug);
  const heroTitle = hasDestinationPage(slug) ? data.heroTitle : `Group trips to ${slug}`;
  const destLabel = slug.charAt(0).toUpperCase() + slug.slice(1);

  // Destinations with no scheduled trips only show the "Customise" section.
  const [batchesTrip, setBatchesTrip] = useState<Trip | null>(null);
  const [showFeatures, setShowFeatures] = useState(true);
  const hasUpcoming = destTrips.length > 0;
  const stripTrips = destTrips;
  // Customise strip: real destination trips when available, otherwise
  // destination-branded synthetic cards (never other destinations' trips).
  const moreHref = `/search?destination=${encodeURIComponent(slug)}`;
  const customiseTrips = useMemo(
    () => hasUpcoming ? destTrips : buildCustomiseTrips(slug, data),
    [data, destTrips, hasUpcoming, slug]
  );
  const vmSource = hasUpcoming ? stripTrips : customiseTrips;
  const vmImgA = vmSource[0]?.image ?? "/figma/trips/trip-1.jpg";
  const vmImgB = vmSource[1]?.image ?? "/figma/trips/trip-2.jpg";

  if (isDesktop) {
    return (
      <DesktopDestination
        destination={slug}
        startingPrice={data.startingPrice}
        vibes={data.tags}
        trips={hasUpcoming ? destTrips : customiseTrips}
        loading={loading}
      />
    );
  }

  return (
    <div className="dp-page">
      <SiteHeader2 destination={destLabel} date={data.relatedDate} showBack onBack={() => nav.back()} />
      {/* ── Hero (Figma 10554:18634) ── */}
      <section className="dp-hero">
        <h1 className="dp-hero-sr">{heroTitle}</h1>
        <img src="/figma/destination/hero.jpg" alt="" className="dp-hero-img" />
      </section>

      {/* ── Dates-Costing-General (Figma 4620:23656) ── */}
      <section className="dp-info">
        {/* Breadcrumb */}
        <div className="dp-breadcrumb">
          <img src="/figma/destination/icon-home.svg" alt="" className="dp-bc-home" aria-hidden />
          <span className="dp-bc-sep">{">"}</span>
          <span className="dp-bc-dest">{slug}</span>
        </div>

        {/* Info card + women strip */}
        <div className="dp-info-card-wrap">
          <div className="dp-info-card">
            <p className="dp-tags-text">{data.tags.join(" | ")}</p>
            <div className="dp-bestmonth-row">
              <img src="/figma/destination/icon-bestmonth.svg" alt="" className="dp-info-ico" aria-hidden />
              <span className="dp-bestmonth-text">Best month to travel: {data.bestMonth}</span>
            </div>
            <div className="dp-price-row">
              <div className="dp-price-left">
                <img src="/figma/destination/icon-price.svg" alt="" className="dp-info-ico" aria-hidden />
                <span className="dp-discount-text">Starting Price (per person):</span>
              </div>
              <span className="dp-info-price">{data.startingPrice}</span>
            </div>
          </div>
          <div className="dp-women-strip">
            <img src="/figma/destination/icon-women.svg" alt="" className="dp-women-ico" aria-hidden />
            <span className="dp-women-text">{data.womenPct} Women travellers have joined!</span>
          </div>
        </div>
      </section>

      {/* Section divider */}
      <div className="dp-section-div" aria-hidden />

      {loading ? (
        <section className="up dp-trip-strip">
          <div className="up-header-row">
            <p className="up-title">Upcoming Group Trips</p>
          </div>
          <div className="up-cards">
            {[0, 1, 2].map((i) => <TripCardShimmer key={i} />)}
          </div>
        </section>
      ) : (
      <>
      {hasUpcoming && (
        <>
          {/* ── Best Summer Deals (Figma 10554:18691) ── */}
          <TripStrip
            title="Best Summer Deals"
            seeAllHref={moreHref}
            showFeatures={showFeatures}
            onShowFeaturesChange={setShowFeatures}
          >
            {stripTrips.map((trip) => (
              <TripCard
                key={trip.slug}
                trip={trip}
                showFeatures={showFeatures}
                onSeeAllDates={setBatchesTrip}
              />
            ))}
            <ViewMoreCard a={vmImgA} b={vmImgB} to={moreHref} />
          </TripStrip>

          <div className="dp-section-div" aria-hidden />
          {/* ── Upcoming Group Trips (Figma 10554:18727) ── */}
          <TripStrip
            title="Upcoming Group Trips"
            seeAllHref={moreHref}
            showFeatures={showFeatures}
            onShowFeaturesChange={setShowFeatures}
          >
            {stripTrips.map((trip) => (
              <TripCard
                key={trip.slug + "-upcoming"}
                trip={trip}
                showFeatures={showFeatures}
                onSeeAllDates={setBatchesTrip}
              />
            ))}
            <ViewMoreCard a={vmImgA} b={vmImgB} to={moreHref} />
          </TripStrip>

          <div className="dp-section-div" aria-hidden />
        </>
      )}
      {/* ── Customise Your Trips (Figma 10554:18763) — no "See all", Filters hidden ── */}
      <TripStrip
        title="Customise Your Trips"
        showFilters={false}
        showFeatures={showFeatures}
        onShowFeaturesChange={setShowFeatures}
      >
        {customiseTrips.map((trip, i) => (
          <TripCard
            key={trip.slug + "-custom-" + i}
            trip={trip}
            showFeatures={showFeatures}
            onSeeAllDates={setBatchesTrip}
          />
        ))}
        <ViewMoreCard a={vmImgA} b={vmImgB} to={moreHref} />
      </TripStrip>
      </>
      )}

      <div className="dp-section-div" aria-hidden />
      <TribeStories />

      <div className="dp-section-div" aria-hidden />
      {/* ── Cultural and Local Voices (Figma 10554:18888) ── */}
      <section className="dp-culture">
        <div className="dp-culture-head">
          <h2 className="dp-culture-title">Cultural and Local Voices</h2>
          <p className="dp-culture-sub">Every city a new rhythm, every night a new reason to celebrate.</p>
        </div>

        {/* Collage: main Paris polaroid (with stamp) over side Seville polaroid */}
        <div className="dp-cult-collage">
          <figure className="dp-cult-pol dp-cult-pol--main">
            <img
              className="dp-cult-pol-photo"
              src="/figma/desktop-dest/cult-photo-paris.png"
              alt="Eiffel Tower over the Seine, Paris"
              loading="lazy"
            />
            <img className="dp-cult-pol-frame" src="/figma/desktop-dest/cult-frame.png" alt="" aria-hidden />
            <figcaption className="dp-cult-pol-caption">
              From Paris cafés to Roman backstreets, travellers arrive chasing
              the postcard and leave with the version no postcard shows.
            </figcaption>
            <img
              className="dp-cult-stamp"
              src="/figma/desktop-dest/cult-stamp.png"
              alt="WanderOn approved"
              loading="lazy"
            />
          </figure>

          <figure className="dp-cult-pol dp-cult-pol--side">
            <img
              className="dp-cult-pol-photo"
              src="/figma/desktop-dest/cult-photo-flamenco.png"
              alt="Flamenco dancers in Plaza de España, Seville"
              loading="lazy"
            />
            <img className="dp-cult-pol-frame" src="/figma/desktop-dest/cult-frame.png" alt="" aria-hidden />
            <figcaption className="dp-cult-pol-caption">
              For many, Europe is the first great trip: the continent that
              turns a traveller into a storyteller
            </figcaption>
          </figure>
        </div>

        {/* Violin cutout + quote (Figma 6550:26539) */}
        <div className="dp-cult-quote-row">
          <div className="dp-cult-violin" aria-hidden>
            <img className="dp-cult-violin-blur" src="/figma/desktop-dest/cult-violin.png" alt="" loading="lazy" />
            <img className="dp-cult-violin-img" src="/figma/desktop-dest/cult-violin.png" alt="" loading="lazy" />
          </div>
          <p className="dp-culture-quote">Europe isn&apos;t meant to be watched from the sidelines. From Munich&apos;s beer halls to Amsterdam&apos;s canals to a tomato-soaked street in Buñol, this is a continent best lived out loud.</p>
        </div>

        {/* Interactive photo stack (kept — Figma 4518:26092) */}
        <div className="dp-culture-stack">
          <PhotoStack />
        </div>
      </section>

      <div className="dp-section-div" aria-hidden />
      <PlotBanner />

      <EndMark variant="mobile" />
      <Footer />
      <BatchesSheet
        isOpen={!!batchesTrip}
        onClose={() => setBatchesTrip(null)}
        tripTitle={batchesTrip?.title}
        nights={batchesTrip?.duration?.nights ?? 7}
        ctaLabel="View Trip"
        onSelectBatch={(batch, start, end) => {
          const trip = batchesTrip;
          setBatchesTrip(null);
          if (!trip) return;
          const fmt = (d: Date, withYear: boolean) =>
            d.toLocaleDateString("en-GB", { day: "numeric", month: "short", ...(withYear ? { year: "numeric" } : {}) });
          const price = Number(String(batch.price).replace(/,/g, "")).toLocaleString("en-IN");
          nav.push(tripHref(trip), {
            state: { from: "batches", selectedBatch: { dateRange: `${fmt(start, false)} - ${fmt(end, true)}`, price: `${price}/-` } },
          });
        }}
      />
      <BottomNav />
    </div>
  );
}
