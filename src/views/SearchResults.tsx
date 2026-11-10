import { useState, useEffect, useRef } from "react";
import type { Trip } from "@/types";
import type { ProductListResult } from "@/repositories";
import { useProductList } from "@/hooks/useProductList";
import { useAppNav } from "@/hooks/useAppNav";
import { useAppSearchParams } from "@/hooks/useAppSearchParams";
import { useSearchFilters } from "@/hooks/useSearchFilters";
import { tripHref } from "@/utils/tripUrl";
import TripCard from "@/components/TripCard";
import Footer from "@/components/Footer";
import EndMark from "@/components/ui/EndMark";
import BottomNav from "@/components/BottomNav";
import SearchBottomSheet from "@/components/SearchBottomSheet";
import FilterSheet from "@/components/FilterSheet";
import BurgerMenu from "@/components/BurgerMenu";
import BatchesSheet from "@/components/BatchesSheet";
import SiteHeader2 from "@/components/SiteHeader2";
import Sheet from "@/components/ui/Sheet";
import TripCardShimmer from "@/components/ui/TripCardShimmer";
import ToggleSwitch from "@/components/ui/ToggleSwitch";
import { useIsDesktop } from "@/hooks/useIsDesktop";
import DesktopSearchResults from "@/components/desktop/DesktopSearchResults";
import { SORT_OPTIONS, type SortKey } from "@/utils/searchResults";
import "./SearchResults.css";

const PAGE_SIZE = 6;
const PRESET_CHIPS = ["Trips under 50K", "With Flights", "From Delhi", "From Mumbai"];

export interface SearchResultsViewProps {
  /** Page 1, pre-fetched server-side (Next.js) from the request's own
   *  searchParams. Vite's wrapper never has one — its useProductList call
   *  below just does its normal client fetch on mount. */
  initialData?: ProductListResult;
}

/** Pure presentational shell — no react-router import, data-fetching is
 *  the only framework-crossing concern (via useProductList's initialData
 *  seed) — so it's shared as-is with Next.js. */
export function SearchResultsView({ initialData }: SearchResultsViewProps) {
  const isDesktop = useIsDesktop();
  const nav = useAppNav();
  const searchParams = useAppSearchParams();
  const sentinelRef = useRef<HTMLDivElement>(null);

  const [searchOpen, setSearchOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterTab, setFilterTab] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [batchesTrip, setBatchesTrip] = useState<Trip | null>(null);
  const [sortOpen, setSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortKey | null>(null);
  const [showFeatures, setShowFeatures] = useState(true);

  // Server-paginated, server-filtered product list (6/page). DesktopSearchResults
  // owns its own fetch, so this hook only needs to run for the mobile view —
  // "private-trips" is a client-only routing marker (the bottom nav's
  // Private trips tab) — the real product API's category taxonomy doesn't
  // recognize it, so forwarding it would always return zero results.
  // Private trips shows the full, unfiltered trip list instead.
  const rawCategory = searchParams.get("category") ?? undefined;
  const apiCategory = rawCategory === "private-trips" ? undefined : rawCategory;

  // but calling it unconditionally keeps hook order stable across renders.
  const { items: visibleTrips, loading, hasMore, total, loadMore } = useProductList(
    {
      destination: searchParams.get("destination") ?? undefined,
      category: apiCategory,
      months: searchParams.get("months") ?? undefined,
      from: searchParams.get("from") ?? undefined,
      to: searchParams.get("to") ?? undefined,
      bucketList: searchParams.get("bucketList") ?? undefined,
      sort: sortBy ?? undefined,
    },
    !isDesktop,
    initialData
  );

  // IntersectionObserver for infinite scroll
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || loading || !hasMore) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) loadMore(); },
      { rootMargin: "300px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hasMore, loading, loadMore]);

  const {
    destination, dateFrom, dateTo, selMonths,
    destinationLabel, dateLabel, hasActiveFilters, chips,
  } = useSearchFilters();


  if (isDesktop) {
    return <DesktopSearchResults initialData={initialData} />;
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

      <FilterSheet
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
        initialTab={filterTab}
        searchParams={searchParams}
      />

      <BurgerMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

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

      {/* Sort By sheet */}
      <Sheet
        isOpen={sortOpen}
        onClose={() => setSortOpen(false)}
        wrapperClassName="sr-sort"
        overlayClassName="sr-sort-overlay"
        overlayAsSibling
        panelClassName="sr-sort-panel"
        openModifier=""
        ariaLabel="Sort trips"
        mountClosed
      >
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
      </Sheet>

      <SiteHeader2 destination={destinationLabel} date={dateLabel} showBack onBack={() => nav.back()} />

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
              {chips.map((chip) => (
                <div className="sr-active-chip" key={chip.key}>
                  <span>{chip.label}</span>
                  <button className="sr-chip-x" aria-label={`Remove ${chip.label}`} onClick={chip.onRemove}>
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
                {total} Trip{total !== 1 ? "s" : ""} Found
              </p>
              <ToggleSwitch
                checked={showFeatures}
                onChange={setShowFeatures}
                label="Show Features"
                className="sr-features-toggle"
                labelClassName="sr-features-toggle-label"
                imgClassName="sr-features-toggle-switch"
                tapSound
              />
            </div>
          )}

          <div className="sr-cards">
            {loading
              ? Array.from({ length: PAGE_SIZE }, (_, i) => <TripCardShimmer key={i} variant="search" />)
              : visibleTrips.map((trip, i) => (
                  <TripCard
                    key={trip.slug}
                    trip={trip}
                    theme="teal"
                    fullWidth
                    eager={i === 0}
                    showFeatures={showFeatures}
                    onSeeAllDates={setBatchesTrip}
                  />
                ))
            }
          </div>

          {!loading && hasMore && (
            <div ref={sentinelRef} className="sr-sentinel" aria-hidden />
          )}

          {!loading && total === 0 && (
            <p className="sr-no-results">No trips match your filters. Try adjusting your search.</p>
          )}
        </div>

        <EndMark variant="mobile" />
        <Footer />
      </main>

      <BottomNav />
    </div>
  );
}
