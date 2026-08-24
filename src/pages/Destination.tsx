import { Fragment, useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  buildCustomiseTrips,
  getCachedListingTrips,
  getDestinationPage,
  getListingTrips,
  hasDestinationPage,
  tripMatchesDestination,
} from "@/repositories";
import type { Trip } from "@/types";
import TripCard from "@/components/TripCard";
import TripCardShimmer from "@/components/ui/TripCardShimmer";
import { ViewMoreCard } from "@/components/UpcomingTrips/TripCardItem";
import BatchesSheet from "@/components/BatchesSheet";
import FeaturesToggle from "@/components/FeaturesToggle";
import EndMark from "@/components/ui/EndMark";
import TribeStories from "@/components/TribeStories";
import QueryBanner from "@/components/QueryBanner";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import PlotBanner from "@/components/PlotBanner";
import PhotoStack from "@/components/PhotoStack";
import "./Destination.css";
import SiteHeader2 from "@/components/SiteHeader2";
import "../components/UpcomingTrips/UpcomingTrips.css";
import { useIsDesktop } from "@/hooks/useIsDesktop";
import DesktopDestination from "@/components/desktop/DesktopDestination";




/** Fixed anchor-bar cities matching the Figma hero (node 4518:26804). */
const HERO_CITIES = ["Paris", "Amsterdam", "Prague", "Vienna", "Portugal", "Spain", "Italy"];

export default function Destination() {
  const { slug = "Europe" } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const isDesktop = useIsDesktop();
  const data = getDestinationPage(slug);
  const heroTitle = hasDestinationPage(slug) ? data.heroTitle : `Group trips to ${slug}`;

  // Trips come from the same source as the listing page (real API, with a
  // built-in sample fallback) so destination pages and the listing agree.
  const cachedTrips = getCachedListingTrips();
  const [allTrips, setAllTrips] = useState<Trip[]>(() => cachedTrips ?? []);
  const [loading, setLoading] = useState(() => !cachedTrips);
  const [batchesTrip, setBatchesTrip] = useState<Trip | null>(null);
  const [showFeatures, setShowFeatures] = useState(true);
  useEffect(() => {
    if (cachedTrips) return;
    let cancelled = false;
    getListingTrips().then((trips) => {
      if (!cancelled) { setAllTrips(trips); setLoading(false); }
    });
    return () => { cancelled = true; };
  }, [cachedTrips]);

  const destTrips = useMemo(
    () => allTrips.filter((t) => tripMatchesDestination(t, slug)),
    [allTrips, slug]
  );
  // Destinations with no scheduled trips only show the "Customise" section.
  const hasUpcoming = destTrips.length > 0;
  const stripTrips = destTrips.slice(0, 6);
  // Customise strip: real destination trips when available, otherwise
  // destination-branded synthetic cards (never other destinations' trips).
  const moreHref = `/search?destination=${encodeURIComponent(slug)}`;
  const customiseTrips = useMemo(
    () => hasUpcoming ? destTrips.slice(0, 6) : buildCustomiseTrips(slug, data),
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
      <SiteHeader2 destination={slug} date={data.relatedDate} showBack onBack={() => navigate(-1)} />
      {/* ── Hero (Figma 4518:26793) ── */}
      <section className="dp-hero">
        <img src="/figma/destination/hero.jpg" alt={heroTitle} className="dp-hero-img" loading="lazy" />
        <div className="dp-hero-grad" />
        <div className="dp-hero-bottom">
          <div className="dp-hero-body">
            <h1 className="dp-hero-title">{heroTitle}</h1>
            <div className="dp-hero-line" />
          </div>
          {/* Scrollable city dots bar (Figma 4518:26804) */}
          <div className="dp-city-bar">
            <div className="dp-city-scroll">
              {HERO_CITIES.map((city, i) => (
                <Fragment key={city}>
                  {i > 0 && <span className="dp-city-dot" aria-hidden />}
                  <span className="dp-city-name">{city}</span>
                </Fragment>
              ))}
            </div>
          </div>
        </div>
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
          {/* ── Best Summer Deals — horizontal trip strip (Figma 4518:27539) ── */}
          <section className="up dp-trip-strip">
            <div className="up-header-row">
              <p className="up-title">Best Summer Deals</p>
              <button className="up-header-arrow" type="button" aria-label="View all trips">
                <img src="/figma/trips/arrow-right.svg" width={16} height={16} alt="" aria-hidden loading="lazy" />
              </button>
            </div>
            <div className="dp-features-row">
              <FeaturesToggle checked={showFeatures} onChange={setShowFeatures} />
            </div>
            <div className="up-cards">
              {stripTrips.map((trip) => (
                  <TripCard
                    key={trip.slug}
                    trip={trip}
                    showFeatures={showFeatures}
                    onSeeAllDates={setBatchesTrip}
                  />
                ))}
              <ViewMoreCard a={vmImgA} b={vmImgB} to={moreHref} />
            </div>
          </section>

          <div className="dp-section-div" aria-hidden />
          {/* ── Upcoming Group Trips ── */}
          <section className="up dp-trip-strip">
            <div className="up-header-row">
              <p className="up-title">Upcoming Group Trips</p>
              <button className="up-header-arrow" type="button" aria-label="View all trips">
                <img src="/figma/trips/arrow-right.svg" width={16} height={16} alt="" aria-hidden loading="lazy" />
              </button>
            </div>
            <div className="dp-features-row">
              <FeaturesToggle checked={showFeatures} onChange={setShowFeatures} />
            </div>
            <div className="up-cards">
              {stripTrips.map((trip) => (
                  <TripCard
                    key={trip.slug + "-upcoming"}
                    trip={trip}
                    showFeatures={showFeatures}
                    onSeeAllDates={setBatchesTrip}
                  />
                ))}
              <ViewMoreCard a={vmImgA} b={vmImgB} to={moreHref} />
            </div>
          </section>

          <div className="dp-section-div" aria-hidden />
        </>
      )}
      {/* ── Customise Europe Trips ── */}
      <section className="up dp-trip-strip">
        <div className="up-header-row">
          <p className="up-title">Customise {slug} Trips</p>
          <button className="up-header-arrow" type="button" aria-label="View all trips">
            <img src="/figma/trips/arrow-right.svg" width={16} height={16} alt="" aria-hidden loading="lazy" />
          </button>
        </div>
        <div className="dp-features-row">
          <FeaturesToggle checked={showFeatures} onChange={setShowFeatures} />
        </div>
        <div className="up-cards">
          {customiseTrips.map((trip, i) => (
            <TripCard
              key={trip.slug + "-custom-" + i}
              trip={trip}
              showFeatures={showFeatures}
              onSeeAllDates={setBatchesTrip}
            />
          ))}
          <ViewMoreCard a={vmImgA} b={vmImgB} to={moreHref} />
        </div>
      </section>
      </>
      )}

      <div className="dp-section-div" aria-hidden />
      <TribeStories />

      <div className="dp-section-div" aria-hidden />
      {/* ── Cultural and Local Voices (Figma 4518:29298) ── */}
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

      <PlotBanner />

      {/* ── Enquire Now (QueryBanner — same as homepage) ── */}
      <div className="dp-section-div" aria-hidden />
      <QueryBanner />

      <EndMark variant="mobile" />
      <Footer />
      <BatchesSheet
        isOpen={!!batchesTrip}
        onClose={() => setBatchesTrip(null)}
        tripTitle={batchesTrip?.title}
        nights={batchesTrip?.duration?.nights ?? 7}
        ctaLabel="View Trip"
        onSelectBatch={(batch, start, end) => {
          const tripSlug = batchesTrip?.slug;
          setBatchesTrip(null);
          if (!tripSlug) return;
          const fmt = (d: Date, withYear: boolean) =>
            d.toLocaleDateString("en-GB", { day: "numeric", month: "short", ...(withYear ? { year: "numeric" } : {}) });
          const price = Number(String(batch.price).replace(/,/g, "")).toLocaleString("en-IN");
          navigate(`/trip/${tripSlug}`, {
            state: { from: "batches", selectedBatch: { dateRange: `${fmt(start, false)} - ${fmt(end, true)}`, price: `${price}/-` } },
          });
        }}
      />
      <BottomNav />
    </div>
  );
}
