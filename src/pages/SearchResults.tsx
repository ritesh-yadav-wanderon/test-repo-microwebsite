import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import type { Trip } from "../types";
import TripCard from "../components/TripCard";
import Footer from "../components/Footer";
import BottomNav from "../components/BottomNav";
import SearchBottomSheet from "../components/SearchBottomSheet/SearchBottomSheet";
import "./SearchResults.css";

import arrowBackIcon from "../assets/search-results/arrow-back.svg";
import locationIcon from "../assets/search-results/location.svg";
import calendarIcon from "../assets/search-results/calendar.svg";
import filterIcon from "../assets/search-results/filter.svg";
import chevronDownIcon from "../assets/search-results/chevron-down.svg";
import topBannerImg from "../assets/search-results/top-banner.png";
import wanderonLogo from "../assets/search-results/wanderon-logo.svg";
import listAltAddIcon from "../assets/search-results/list-alt-add.svg";
import tripCastleImg from "../assets/search-results/trip-castle.jpg";
import tripBridgeImg from "../assets/search-results/trip-bridge.jpg";

const EXTRA_BATCHES = [
  "2026-06-18", "2026-06-22", "2026-07-06", "2026-07-12",
  "2026-07-18", "2026-07-22", "2026-08-06", "2026-08-12",
  "2026-08-18", "2026-08-22",
];
const BASE_BATCHES = [
  "2026-05-09", "2026-05-12", "2026-05-18",
  "2026-05-22", "2026-06-06", "2026-06-12",
  ...EXTRA_BATCHES,
];
const EUROPE_FEATURES = [
  "Disneyland Tour with Eiffel Tower Visit",
  "Cologne City Tour",
  "Lake Titisee",
];

const SAMPLE_TRIPS: Trip[] = [
  {
    slug: "europe-15d-paris-budapest",
    title: "15-Day Europe Group Trip 2026: Paris to Budapest",
    image: tripCastleImg,
    startingPrice: "62999",
    duration: { nights: 7, days: 8 },
    skeletonItinerary: ["3N Paris", "3N Amsterdam", "3N Prague", "2N Vienna", "3N Budapest"],
    features: EUROPE_FEATURES,
    recommended: true,
    optionsAvailable: 2,
    joinedCount: "20+",
    firstBatch: "09 May Batch",
    batches: BASE_BATCHES,
  },
  {
    slug: "europe-12d-paris-vienna-women",
    title: "12 Days Europe Group Tour: Paris to Vienna",
    image: tripBridgeImg,
    startingPrice: "62999",
    duration: { nights: 7, days: 8 },
    skeletonItinerary: ["3N Paris", "3N Amsterdam", "3N Prague", "2N Vienna"],
    features: EUROPE_FEATURES,
    joinedCount: "15+",
    firstBatch: "09 May Batch",
    batches: BASE_BATCHES,
    womenOnly: true,
  },
  {
    slug: "europe-15d-paris-budapest-2",
    title: "15-Day Europe Group Trip 2026: Paris to Budapest",
    image: tripCastleImg,
    startingPrice: "62999",
    duration: { nights: 7, days: 8 },
    skeletonItinerary: ["3N Paris", "3N Amsterdam", "3N Prague", "2N Vienna", "3N Budapest"],
    features: EUROPE_FEATURES,
    joinedCount: "20+",
    firstBatch: "09 May Batch",
    batches: BASE_BATCHES,
  },
];

const FILTER_DROPS = ["Group Trips", "Budget", "Departure City", "Add-Ons"];

function fmtDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
}

export default function SearchResults() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeView, setActiveView] = useState<"trips" | "dates">("trips");
  const [searchOpen, setSearchOpen] = useState(false);

  const destination = searchParams.get("destination") ?? "";
  const dateFrom    = searchParams.get("from") ?? "";
  const dateTo      = searchParams.get("to") ?? "";
  const monthsParam = searchParams.get("months") ?? "";
  const selMonths   = monthsParam ? monthsParam.split(",") : [];

  const destinationLabel = destination || "Anywhere";
  const dateLabel = (() => {
    if (monthsParam) {
      if (selMonths.length === 1) {
        const [y, m] = selMonths[0].split("-").map(Number);
        return new Date(y, m - 1, 1).toLocaleDateString("en-GB", { month: "short", year: "numeric" });
      }
      return `${selMonths.length} months`;
    }
    if (dateFrom && dateTo) return `${fmtDate(dateFrom)} – ${fmtDate(dateTo)}`;
    if (dateFrom) return fmtDate(dateFrom);
    if (dateTo) return `To ${fmtDate(dateTo)}`;
    return "Any Date";
  })();

  const hasFilters = !!(destination || dateFrom || dateTo || monthsParam);

  return (
    <div className="sr-page">

      <SearchBottomSheet
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        initialDestination={destination}
        initialFrom={dateFrom}
        initialTo={dateTo}
        initialMonths={selMonths}
      />

      {/* ── Fixed header ── */}
      <header className="sr-header">
        <div className="sr-hbar">
          <button
            className="sr-back"
            type="button"
            aria-label="Go back"
            onClick={() => navigate(-1)}
          >
            <img src={arrowBackIcon} alt="" />
          </button>

          <button
            className="sr-spill"
            role="search"
            onClick={() => setSearchOpen(true)}
            aria-label="Edit search"
          >
            <div className="sr-spill-pane">
              <img src={locationIcon} alt="" className="sr-spill-ico" />
              <span className={`sr-spill-text${destination ? " sr-spill-text--active" : ""}`}>
                {destinationLabel}
              </span>
            </div>
            <div className="sr-spill-divider" aria-hidden />
            <div className="sr-spill-pane">
              <img src={calendarIcon} alt="" className="sr-spill-ico" />
              <span className={`sr-spill-text${(dateFrom || dateTo) ? " sr-spill-text--active" : ""}`}>
                {dateLabel}
              </span>
            </div>
          </button>

          <button
            className="sr-list-btn"
            type="button"
            aria-label="Search options"
            onClick={() => setSearchOpen(true)}
          >
            <img src={listAltAddIcon} alt="" />
          </button>
        </div>
        <img src={topBannerImg} alt="" className="sr-banner" />
      </header>

      {/* ── Scrollable content ── */}
      <main className="sr-main">

        {/* Sticky filter bar */}
        <div className="sr-filter-wrap">
          <div className="sr-fpills">
            <button className="sr-fpill" type="button">
              <span>Filters</span>
              <img src={filterIcon} alt="" className="sr-fpill-ico" />
            </button>
            {FILTER_DROPS.map((label) => (
              <button className="sr-fpill" key={label} type="button">
                <span>{label}</span>
                <img src={chevronDownIcon} alt="" className="sr-fpill-ico" />
              </button>
            ))}
          </div>

          <div className="sr-viewby">
            <span className="sr-viewby-label">View By</span>
            <button
              className={`sr-viewby-tab${activeView === "trips" ? " sr-viewby-tab--active" : ""}`}
              type="button"
              onClick={() => setActiveView("trips")}
            >
              Trips
            </button>
            <button
              className={`sr-viewby-tab${activeView === "dates" ? " sr-viewby-tab--active" : ""}`}
              type="button"
              onClick={() => setActiveView("dates")}
            >
              Dates
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="sr-content">
          {hasFilters && (
            <div className="sr-active-filters">
              {destination && (
                <span className="sr-filter-chip">
                  {destination}
                  <button
                    className="sr-chip-x"
                    aria-label={`Remove ${destination} filter`}
                    onClick={() => {
                      const p = new URLSearchParams(searchParams);
                      p.delete("destination");
                      navigate(`/search?${p.toString()}`);
                    }}
                  >×</button>
                </span>
              )}
              {monthsParam && (
                <span className="sr-filter-chip">
                  {selMonths.length === 1
                    ? (() => { const [y,m] = selMonths[0].split("-").map(Number); return new Date(y,m-1,1).toLocaleDateString("en-GB",{month:"short",year:"numeric"}); })()
                    : `${selMonths.length} months`}
                  <button
                    className="sr-chip-x"
                    aria-label="Remove months filter"
                    onClick={() => {
                      const p = new URLSearchParams(searchParams);
                      p.delete("months");
                      navigate(`/search?${p.toString()}`);
                    }}
                  >×</button>
                </span>
              )}
              {!monthsParam && (dateFrom || dateTo) && (
                <span className="sr-filter-chip">
                  {dateFrom && dateTo
                    ? `${fmtDate(dateFrom)} – ${fmtDate(dateTo)}`
                    : dateFrom ? fmtDate(dateFrom) : fmtDate(dateTo)}
                  <button
                    className="sr-chip-x"
                    aria-label="Remove date filter"
                    onClick={() => {
                      const p = new URLSearchParams(searchParams);
                      p.delete("from");
                      p.delete("to");
                      navigate(`/search?${p.toString()}`);
                    }}
                  >×</button>
                </span>
              )}
            </div>
          )}

          <p className="sr-count">{SAMPLE_TRIPS.length} Trips Found</p>

          <div className="sr-cards">
            {SAMPLE_TRIPS.map((trip) => (
              <TripCard
                key={trip.slug}
                trip={trip}
                theme={trip.womenOnly ? "default" : "teal"}
                fullWidth
              />
            ))}
          </div>

          <button className="sr-view-more" type="button">
            View More Trips
          </button>
        </div>

        {/* Quote */}
        <section className="sr-quote">
          <img src={wanderonLogo} alt="WanderOn" className="sr-quote-logo" />
          <div className="sr-quote-text">
            <p>Life's a Trip,</p>
            <p>Let's Make Yours Epic!</p>
          </div>
        </section>

        <Footer />
      </main>

      <BottomNav />
    </div>
  );
}
