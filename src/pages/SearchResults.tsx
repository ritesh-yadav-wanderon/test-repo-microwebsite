import { useState, useEffect, useRef, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import type { Trip } from "../types";
import { getListingTrips } from "../api";
import TripCard from "../components/TripCard";
import Footer from "../components/Footer";
import FooterMessage from "../components/FooterMessage/FooterMessage";
import BottomNav from "../components/BottomNav";
import SearchBottomSheet from "../components/SearchBottomSheet/SearchBottomSheet";
import FilterSheet from "../components/FilterSheet/FilterSheet";
import BurgerMenu from "../components/BurgerMenu/BurgerMenu";
import BatchesSheet from "../components/BatchesSheet/BatchesSheet";
import SiteHeader2 from "../components/SiteHeader2";
import { useIsDesktop } from "../hooks/useIsDesktop";
import DesktopSearchResults from "../components/desktop/DesktopSearchResults";
import {
  playTapSound,
  fmtDate,
  fmtMonthLabel,
  sortTrips,
  filterTrips,
  SORT_OPTIONS,
  type SortKey,
} from "./searchResults.helpers";
import "./SearchResults.css";

const PAGE_SIZE = 10;
const PRESET_CHIPS = ["Trips under 50K", "With Flights", "From Delhi", "From Mumbai"];

function TripCardShimmer() {
  return (
    <div className="sr-shimmer-card">
      <div className="sr-shimmer-img" />
      <div className="sr-shimmer-body">
        <div className="sr-shimmer-line" style={{ width: "85%", height: 14 }} />
        <div className="sr-shimmer-line" style={{ width: "60%" }} />
        <div className="sr-shimmer-line" style={{ width: "70%" }} />
        <div className="sr-shimmer-line" style={{ width: "45%", height: 18, marginTop: 8 }} />
      </div>
    </div>
  );
}

export default function SearchResults() {
  const isDesktop = useIsDesktop();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sentinelRef = useRef<HTMLDivElement>(null);

  const [allTrips, setAllTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const [searchOpen, setSearchOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterTab, setFilterTab] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [batchesTrip, setBatchesTrip] = useState<Trip | null>(null);
  const [sortOpen, setSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortKey | null>(null);
  const [showFeatures, setShowFeatures] = useState(false);

  // Fetch trips once on mount
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getListingTrips().then(trips => {
      if (!cancelled) { setAllTrips(trips); setLoading(false); }
    });
    return () => { cancelled = true; };
  }, []);

  // Reset pagination when filters or sort change
  useEffect(() => { setVisibleCount(PAGE_SIZE); }, [searchParams, sortBy]);

  const filteredTrips = useMemo(
    () => sortTrips(filterTrips(allTrips, searchParams), sortBy),
    [allTrips, searchParams, sortBy]
  );

  // IntersectionObserver for infinite scroll
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || loading || visibleCount >= filteredTrips.length) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisibleCount(c => Math.min(c + PAGE_SIZE, filteredTrips.length)); },
      { rootMargin: "300px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [visibleCount, filteredTrips.length, loading]);

  // Read active filter params
  const destination   = searchParams.get("destination") ?? "";
  const dateFrom      = searchParams.get("from") ?? "";
  const dateTo        = searchParams.get("to") ?? "";
  const monthsParam   = searchParams.get("months") ?? "";
  const selMonths     = monthsParam ? monthsParam.split(",") : [];
  const category      = searchParams.get("category") ?? "";
  const planningWith  = searchParams.get("planningWith") ?? "";
  const addons        = searchParams.get("addons") ?? "";
  const fromCity      = searchParams.get("fromCity") ?? "";
  const accommodation = searchParams.get("accommodation") ?? "";
  const bucketList    = searchParams.get("bucketList") ?? "";
  const selBucket     = bucketList ? bucketList.split(",").map(s => s.trim()).filter(Boolean) : [];

  const destinationLabel = destination || "Anywhere";
  const dateLabel = (() => {
    if (monthsParam) return selMonths.length === 1 ? fmtMonthLabel(selMonths[0]) : `${selMonths.length} months`;
    if (dateFrom && dateTo) return `${fmtDate(dateFrom)} – ${fmtDate(dateTo)}`;
    if (dateFrom) return fmtDate(dateFrom);
    if (dateTo) return `To ${fmtDate(dateTo)}`;
    return "Any Date";
  })();

  function removeParam(...keys: string[]) {
    const p = new URLSearchParams(searchParams);
    keys.forEach(k => p.delete(k));
    navigate(`/search?${p.toString()}`);
  }

  function removeOneFromParam(key: string, value: string) {
    const cur = searchParams.get(key) ?? "";
    const remaining = cur.split(",").filter(v => v.trim() !== value).join(",");
    const p = new URLSearchParams(searchParams);
    remaining ? p.set(key, remaining) : p.delete(key);
    navigate(`/search?${p.toString()}`);
  }

  const hasActiveFilters = !!(destination || monthsParam ||
    (!monthsParam && (dateFrom || dateTo)) || category ||
    planningWith || addons || fromCity || accommodation || bucketList);

  const visibleTrips = filteredTrips.slice(0, visibleCount);

  if (isDesktop) {
    return <DesktopSearchResults />;
  }

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

      <FilterSheet isOpen={filterOpen} onClose={() => setFilterOpen(false)} initialTab={filterTab} />

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
            d.toLocaleDateString("en-GB", { day: "numeric", month: "short", ...(withYear ? { year: "numeric" } : {}) });
          const price = Number(String(batch.price).replace(/,/g, "")).toLocaleString("en-IN");
          navigate(`/trip/${slug}`, {
            state: { from: "batches", selectedBatch: { dateRange: `${fmt(start, false)} - ${fmt(end, true)}`, price: `${price}/-` } },
          });
        }}
      />

      {/* Sort By sheet */}
      <div className={`sr-sort${sortOpen ? " sr-sort--open" : ""}`} aria-hidden={!sortOpen}>
        <div className="sr-sort-overlay" onClick={() => setSortOpen(false)} />
        <div className="sr-sort-panel" role="dialog" aria-modal="true" aria-label="Sort trips">
          <div className="sr-sort-head">
            <p className="sr-sort-title">Sort By</p>
            <button className="sr-sort-close" type="button" onClick={() => setSortOpen(false)} aria-label="Close">
              <img src="/figma/listing/close-icon.svg" alt="" width={20} height={20} />
            </button>
          </div>
          <div className="sr-sort-list">
            <button
              type="button"
              className={`sr-sort-opt${sortBy === null ? " sr-sort-opt--sel" : ""}`}
              onClick={() => { setSortBy(null); setSortOpen(false); }}
            >
              <span>Recommended</span>
              <span className="sr-sort-radio" aria-hidden />
            </button>
            {SORT_OPTIONS.map(opt => (
              <button
                key={opt.key}
                type="button"
                className={`sr-sort-opt${sortBy === opt.key ? " sr-sort-opt--sel" : ""}`}
                onClick={() => { setSortBy(opt.key); setSortOpen(false); }}
              >
                <span>{opt.label}</span>
                <span className="sr-sort-radio" aria-hidden />
              </button>
            ))}
          </div>
        </div>
      </div>

      <SiteHeader2 destination={destinationLabel} date={dateLabel} showBack onBack={() => navigate(-1)} />

      <main className="sr-main">

        {/* Sticky filter bar */}
        <div className="sr-filter-wrap">
          <div className="sr-fpills">
            <button className="sr-fpill sr-fpill--ctrl" type="button" onClick={() => setFilterOpen(true)}>
              <span>Filters</span>
              <img src="/figma/listing/filter-icon.svg" alt="" className="sr-fpill-ico" loading="lazy" />
            </button>
            <button className="sr-fpill sr-fpill--ctrl" type="button"
              onClick={() => { setFilterTab(7); setFilterOpen(true); }}>
              <img src="/figma/listing/list-alt-add.svg" alt="" className="sr-fpill-ico" loading="lazy" />
              <span>Bucket List</span>
            </button>
            <button
              className={`sr-fpill sr-fpill--ctrl${sortBy ? " sr-fpill--active" : ""}`}
              type="button"
              onClick={() => setSortOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={sortOpen}
            >
              <span>{sortBy ? SORT_OPTIONS.find(o => o.key === sortBy)?.label : "Sort By"}</span>
              {sortBy ? (
                <span
                  className="sr-fpill-clear"
                  role="button"
                  tabIndex={0}
                  aria-label="Clear sort"
                  onClick={(e) => { e.stopPropagation(); setSortBy(null); }}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.stopPropagation(); setSortBy(null); } }}
                >
                  <img src="/figma/listing/close-icon.svg" alt="" width={14} height={14} />
                </span>
              ) : (
                <img src="/figma/listing/sort-arrow.svg" alt="" className="sr-fpill-ico" loading="lazy" />
              )}
            </button>
            {PRESET_CHIPS.map(chip => (
              <button className="sr-fpill" key={chip} type="button"><span>{chip}</span></button>
            ))}
          </div>

          {hasActiveFilters && (
            <div className="sr-active-row">
              {destination && (
                <div className="sr-active-chip">
                  <span>{destination}</span>
                  <button className="sr-chip-x" aria-label={`Remove ${destination}`}
                    onClick={() => removeParam("destination")}>
                    <img src="/figma/listing/close-icon.svg" alt="" width={16} height={16} loading="lazy" />
                  </button>
                </div>
              )}
              {monthsParam && selMonths.map(ym => (
                <div className="sr-active-chip" key={ym}>
                  <span>{fmtMonthLabel(ym)}</span>
                  <button className="sr-chip-x" aria-label={`Remove ${fmtMonthLabel(ym)}`}
                    onClick={() => removeOneFromParam("months", ym)}>
                    <img src="/figma/listing/close-icon.svg" alt="" width={16} height={16} loading="lazy" />
                  </button>
                </div>
              ))}
              {!monthsParam && (dateFrom || dateTo) && (
                <div className="sr-active-chip">
                  <span>
                    {dateFrom && dateTo ? `${fmtDate(dateFrom)} – ${fmtDate(dateTo)}`
                      : dateFrom ? fmtDate(dateFrom) : fmtDate(dateTo)}
                  </span>
                  <button className="sr-chip-x" aria-label="Remove date filter"
                    onClick={() => removeParam("from", "to")}>
                    <img src="/figma/listing/close-icon.svg" alt="" width={16} height={16} loading="lazy" />
                  </button>
                </div>
              )}
              {category && category.split(",").map(cat => (
                <div className="sr-active-chip" key={cat}>
                  <span>{cat}</span>
                  <button className="sr-chip-x" aria-label={`Remove ${cat}`}
                    onClick={() => removeOneFromParam("category", cat)}>
                    <img src="/figma/listing/close-icon.svg" alt="" width={16} height={16} loading="lazy" />
                  </button>
                </div>
              ))}
              {planningWith && planningWith.split(",").map(pw => (
                <div className="sr-active-chip" key={pw}>
                  <span>{pw}</span>
                  <button className="sr-chip-x" aria-label={`Remove ${pw}`}
                    onClick={() => removeOneFromParam("planningWith", pw)}>
                    <img src="/figma/listing/close-icon.svg" alt="" width={16} height={16} loading="lazy" />
                  </button>
                </div>
              ))}
              {addons && addons.split(",").map(a => (
                <div className="sr-active-chip" key={a}>
                  <span>{a}</span>
                  <button className="sr-chip-x" aria-label={`Remove ${a}`}
                    onClick={() => removeOneFromParam("addons", a)}>
                    <img src="/figma/listing/close-icon.svg" alt="" width={16} height={16} loading="lazy" />
                  </button>
                </div>
              ))}
              {fromCity && fromCity.split(",").map(city => (
                <div className="sr-active-chip" key={city}>
                  <span>From {city}</span>
                  <button className="sr-chip-x" aria-label={`Remove ${city}`}
                    onClick={() => removeOneFromParam("fromCity", city)}>
                    <img src="/figma/listing/close-icon.svg" alt="" width={16} height={16} loading="lazy" />
                  </button>
                </div>
              ))}
              {accommodation && accommodation.split(",").map(acc => (
                <div className="sr-active-chip" key={acc}>
                  <span>{acc}</span>
                  <button className="sr-chip-x" aria-label={`Remove ${acc}`}
                    onClick={() => removeOneFromParam("accommodation", acc)}>
                    <img src="/figma/listing/close-icon.svg" alt="" width={16} height={16} loading="lazy" />
                  </button>
                </div>
              ))}
              {selBucket.map(entry => (
                <div className="sr-active-chip" key={entry}>
                  <span>{entry}</span>
                  <button className="sr-chip-x" aria-label={`Remove ${entry} from bucket list`}
                    onClick={() => removeOneFromParam("bucketList", entry)}>
                    <img src="/figma/listing/close-icon.svg" alt="" width={16} height={16} loading="lazy" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Results */}
        <div className="sr-content">
          {!loading && (
            <div className="sr-count-row">
              <p className="sr-count">
                {filteredTrips.length} Trip{filteredTrips.length !== 1 ? "s" : ""} Found
              </p>
              <button
                type="button"
                className="sr-features-toggle"
                role="switch"
                aria-checked={showFeatures}
                onClick={() => { playTapSound(); setShowFeatures((v) => !v); }}
              >
                <span className="sr-features-toggle-label">Show Features</span>
                <img
                  className="sr-features-toggle-switch"
                  src={`/figma/listing/toggle/toggle-${showFeatures ? "on" : "off"}.svg`}
                  alt=""
                  aria-hidden
                />
              </button>
            </div>
          )}

          <div className="sr-cards">
            {loading
              ? Array.from({ length: PAGE_SIZE }, (_, i) => <TripCardShimmer key={i} />)
              : visibleTrips.map((trip, i) => (
                  <TripCard
                    key={trip.slug}
                    trip={trip}
                    theme="teal"
                    fullWidth
                    eager={i === 0}
                    showFeatures={showFeatures}
                    onSeeAllDates={() => setBatchesTrip(trip)}
                  />
                ))
            }
          </div>

          {!loading && visibleCount < filteredTrips.length && (
            <div ref={sentinelRef} className="sr-sentinel" aria-hidden />
          )}

          {!loading && filteredTrips.length === 0 && allTrips.length > 0 && (
            <p className="sr-no-results">No trips match your filters. Try adjusting your search.</p>
          )}
        </div>

        <FooterMessage />
        <Footer />
      </main>

      <BottomNav />
    </div>
  );
}
