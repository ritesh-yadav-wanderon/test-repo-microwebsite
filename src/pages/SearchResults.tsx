import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import type { Trip } from "../types";
import TripCard from "../components/TripCard";
import Footer from "../components/Footer";
import FooterMessage from "../components/FooterMessage/FooterMessage";
import BottomNav from "../components/BottomNav";
import SearchBottomSheet from "../components/SearchBottomSheet/SearchBottomSheet";
import FilterSheet from "../components/FilterSheet/FilterSheet";
import BurgerMenu from "../components/BurgerMenu/BurgerMenu";
import BatchesSheet from "../components/BatchesSheet/BatchesSheet";
import SiteHeader2 from "../components/SiteHeader2";
import "./SearchResults.css";

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

const PAGE_SIZE = 6;

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
  {
    slug: "europe-10d-amsterdam-prague",
    title: "10-Day Europe Group Tour: Amsterdam to Prague",
    image: tripBridgeImg,
    startingPrice: "54999",
    duration: { nights: 9, days: 10 },
    skeletonItinerary: ["3N Amsterdam", "2N Cologne", "2N Frankfurt", "2N Prague"],
    features: EUROPE_FEATURES,
    joinedCount: "12+",
    firstBatch: "12 May Batch",
    batches: BASE_BATCHES,
  },
  {
    slug: "europe-18d-grand-tour",
    title: "18-Day Grand Europe Tour 2026",
    image: tripCastleImg,
    startingPrice: "74999",
    duration: { nights: 17, days: 18 },
    skeletonItinerary: ["3N Paris", "2N Brussels", "3N Amsterdam", "2N Cologne", "3N Prague", "2N Vienna", "2N Budapest"],
    features: EUROPE_FEATURES,
    recommended: true,
    optionsAvailable: 3,
    joinedCount: "25+",
    firstBatch: "18 May Batch",
    batches: BASE_BATCHES,
  },
  {
    slug: "europe-8d-paris-amsterdam",
    title: "8-Day Europe Trip: Paris & Amsterdam",
    image: tripBridgeImg,
    startingPrice: "44999",
    duration: { nights: 7, days: 8 },
    skeletonItinerary: ["3N Paris", "4N Amsterdam"],
    features: EUROPE_FEATURES,
    joinedCount: "18+",
    firstBatch: "22 May Batch",
    batches: BASE_BATCHES,
  },
  {
    slug: "europe-12d-eastern-women",
    title: "12-Day Eastern Europe Women Only Tour",
    image: tripCastleImg,
    startingPrice: "58999",
    duration: { nights: 11, days: 12 },
    skeletonItinerary: ["3N Prague", "2N Vienna", "3N Budapest", "3N Krakow"],
    features: EUROPE_FEATURES,
    joinedCount: "10+",
    firstBatch: "06 Jun Batch",
    batches: EXTRA_BATCHES,
    womenOnly: true,
  },
  {
    slug: "europe-14d-western-highlights",
    title: "14-Day Western Europe Highlights 2026",
    image: tripBridgeImg,
    startingPrice: "68999",
    duration: { nights: 13, days: 14 },
    skeletonItinerary: ["3N Paris", "2N Nice", "3N Barcelona", "2N Madrid", "2N Lisbon"],
    features: EUROPE_FEATURES,
    optionsAvailable: 2,
    joinedCount: "22+",
    firstBatch: "12 Jun Batch",
    batches: EXTRA_BATCHES,
  },
  {
    slug: "europe-9d-switzerland-austria",
    title: "9-Day Switzerland & Austria Group Tour",
    image: tripCastleImg,
    startingPrice: "71999",
    duration: { nights: 8, days: 9 },
    skeletonItinerary: ["2N Zurich", "2N Interlaken", "2N Lucerne", "2N Innsbruck"],
    features: EUROPE_FEATURES,
    joinedCount: "16+",
    firstBatch: "18 Jun Batch",
    batches: EXTRA_BATCHES,
  },
];

const PRESET_CHIPS = ["Trips under 50K", "With Flights", "From Delhi", "From Mumbai"];

function fmtDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
}

export default function SearchResults() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [batchesTrip, setBatchesTrip] = useState<Trip | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || visibleCount >= SAMPLE_TRIPS.length) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleCount(c => Math.min(c + PAGE_SIZE, SAMPLE_TRIPS.length));
        }
      },
      { rootMargin: "300px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [visibleCount]);

  const destination = searchParams.get("destination") ?? "";
  const dateFrom    = searchParams.get("from") ?? "";
  const dateTo      = searchParams.get("to") ?? "";
  const monthsParam = searchParams.get("months") ?? "";
  const selMonths   = monthsParam ? monthsParam.split(",") : [];
  const category    = searchParams.get("category") ?? "";

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

      <FilterSheet isOpen={filterOpen} onClose={() => setFilterOpen(false)} />

      <BurgerMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      <BatchesSheet
        isOpen={!!batchesTrip}
        onClose={() => setBatchesTrip(null)}
        tripTitle={batchesTrip?.title}
        nights={batchesTrip?.duration?.nights ?? 7}
        ctaLabel="View Trip"
        onSelectBatch={(batch, start, end) => {
          const slug = batchesTrip?.slug;
          setBatchesTrip(null);
          if (!slug) return;
          const fmt = (d: Date, withYear: boolean) =>
            d.toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              ...(withYear ? { year: "numeric" } : {}),
            });
          const price = Number(String(batch.price).replace(/,/g, "")).toLocaleString("en-IN");
          navigate(`/trip/${slug}`, {
            state: {
              from: "batches",
              selectedBatch: {
                dateRange: `${fmt(start, false)} - ${fmt(end, true)}`,
                price: `${price}/-`,
              },
            },
          });
        }}
      />

      <SiteHeader2 destination={destinationLabel} date={dateLabel} showBack onBack={() => navigate(-1)} />

      {/* Scrollable content */}
      <main className="sr-main">

        {/* Sticky filter bar */}
        <div className="sr-filter-wrap">

          {/* Row 1 — scrollable control pills + preset chips */}
          <div className="sr-fpills">
            <button className="sr-fpill sr-fpill--ctrl" type="button" onClick={() => setFilterOpen(true)}>
              <span>Filters</span>
              <img src="/figma/listing/filter-icon.svg" alt="" className="sr-fpill-ico" loading="lazy" />
            </button>
            <button className="sr-fpill sr-fpill--ctrl" type="button">
              <img src="/figma/listing/list-alt-add.svg" alt="" className="sr-fpill-ico" loading="lazy" />
              <span>Bucket List</span>
            </button>
            <button className="sr-fpill sr-fpill--ctrl" type="button">
              <span>Sort By</span>
              <img src="/figma/listing/sort-arrow.svg" alt="" className="sr-fpill-ico" loading="lazy" />
            </button>
            {PRESET_CHIPS.map((chip) => (
              <button className="sr-fpill" key={chip} type="button">
                <span>{chip}</span>
              </button>
            ))}
          </div>

          {/* Row 2 — active filter chips, separate non-scrolling row */}
          {(destination || monthsParam || (dateFrom && !monthsParam) || (dateTo && !monthsParam) || category) && (
            <div className="sr-active-row">
              {destination && (
                <div className="sr-active-chip">
                  <span>{destination}</span>
                  <button
                    className="sr-chip-x"
                    aria-label={`Remove ${destination} filter`}
                    onClick={() => {
                      const p = new URLSearchParams(searchParams);
                      p.delete("destination");
                      navigate(`/search?${p.toString()}`);
                    }}
                  >
                    <img src="/figma/listing/close-icon.svg" alt="" width={16} height={16} loading="lazy" />
                  </button>
                </div>
              )}
              {monthsParam && (
                <div className="sr-active-chip">
                  <span>
                    {selMonths.length === 1
                      ? (() => { const [y,m] = selMonths[0].split("-").map(Number); return new Date(y,m-1,1).toLocaleDateString("en-GB",{month:"short",year:"numeric"}); })()
                      : `${selMonths.length} months`}
                  </span>
                  <button
                    className="sr-chip-x"
                    aria-label="Remove months filter"
                    onClick={() => {
                      const p = new URLSearchParams(searchParams);
                      p.delete("months");
                      navigate(`/search?${p.toString()}`);
                    }}
                  >
                    <img src="/figma/listing/close-icon.svg" alt="" width={16} height={16} loading="lazy" />
                  </button>
                </div>
              )}
              {!monthsParam && (dateFrom || dateTo) && (
                <div className="sr-active-chip">
                  <span>
                    {dateFrom && dateTo
                      ? `${fmtDate(dateFrom)} – ${fmtDate(dateTo)}`
                      : dateFrom ? fmtDate(dateFrom) : fmtDate(dateTo)}
                  </span>
                  <button
                    className="sr-chip-x"
                    aria-label="Remove date filter"
                    onClick={() => {
                      const p = new URLSearchParams(searchParams);
                      p.delete("from"); p.delete("to");
                      navigate(`/search?${p.toString()}`);
                    }}
                  >
                    <img src="/figma/listing/close-icon.svg" alt="" width={16} height={16} loading="lazy" />
                  </button>
                </div>
              )}
              {category && (
                <div className="sr-active-chip">
                  <span>{category.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}</span>
                  <button
                    className="sr-chip-x"
                    aria-label={`Remove ${category} filter`}
                    onClick={() => {
                      const p = new URLSearchParams(searchParams);
                      p.delete("category");
                      navigate(`/search?${p.toString()}`);
                    }}
                  >
                    <img src="/figma/listing/close-icon.svg" alt="" width={16} height={16} loading="lazy" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Results */}
        <div className="sr-content">
          <p className="sr-count">{SAMPLE_TRIPS.length} Trips Found</p>

          <div className="sr-cards">
            {SAMPLE_TRIPS.slice(0, visibleCount).map((trip, i) => (
              <TripCard
                key={trip.slug}
                trip={trip}
                theme="teal"
                fullWidth
                eager={i === 0}
                onSeeAllDates={() => setBatchesTrip(trip)}
              />
            ))}
          </div>

          {visibleCount < SAMPLE_TRIPS.length && (
            <div ref={sentinelRef} className="sr-sentinel" aria-hidden />
          )}
        </div>

        <FooterMessage />
        <Footer />
      </main>

      <BottomNav />
    </div>
  );
}
