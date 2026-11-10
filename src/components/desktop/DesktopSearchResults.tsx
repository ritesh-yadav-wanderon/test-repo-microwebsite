// Desktop product listing. List helpers are shared with the mobile listing via
// `@/utils/searchResults` and `@/hooks/useSearchFilters`.
import { useState } from "react";
import type { Trip } from "@/types";
import type { ProductListResult } from "@/repositories";
import { useProductList } from "@/hooks/useProductList";
import { useAppNav } from "@/hooks/useAppNav";
import { useAppSearchParams } from "@/hooks/useAppSearchParams";
import { useSearchFilters } from "@/hooks/useSearchFilters";
import { tripHref } from "@/utils/tripUrl";
import TripCard from "@/components/TripCard";
import DesktopFilterSheet from "./DesktopFilterSheet";
import DesktopBatchesSheet from "./DesktopBatchesSheet";
import DesktopFooter from "./DesktopFooter";
import DesktopNav from "./DesktopNav";
import ToggleSwitch from "@/components/ui/ToggleSwitch";
import TripCardShimmer from "@/components/ui/TripCardShimmer";
import "./DesktopSearchResults.css";

const PAGE_SIZE = 6; // two rows of three cards
const LI = "/figma/listing/";
const AS = "/figma/desktop-listing/";

export interface DesktopSearchResultsProps {
  /** Page 1, pre-fetched server-side (Next.js). See SearchResultsView's
   *  matching prop for the full explanation. */
  initialData?: ProductListResult;
}

/** Desktop product listing page (Figma 5854:24702 "Listing"). Reuses the mobile
 *  TripCard and the shared listing filter/sort helpers. */
export default function DesktopSearchResults({ initialData }: DesktopSearchResultsProps) {
  const nav = useAppNav();
  const searchParams = useAppSearchParams();

  const [filterOpen, setFilterOpen] = useState(false);
  const [filterTab, setFilterTab] = useState(0);
  const [batchesTrip, setBatchesTrip] = useState<Trip | null>(null);
  const [showFeatures, setShowFeatures] = useState(true);

  // "private-trips" is a client-only routing marker (the bottom nav's
  // Private trips tab) — the real product API's category taxonomy doesn't
  // recognize it, so forwarding it would always return zero results.
  // Private trips shows the full, unfiltered trip list instead.
  const rawCategory = searchParams.get("category") ?? undefined;
  const apiCategory = rawCategory === "private-trips" ? undefined : rawCategory;

  const { items: visibleTrips, loading, hasMore, total, loadMore } = useProductList(
    {
      destination: searchParams.get("destination") ?? undefined,
      category: apiCategory,
      months: searchParams.get("months") ?? undefined,
      from: searchParams.get("from") ?? undefined,
      to: searchParams.get("to") ?? undefined,
      bucketList: searchParams.get("bucketList") ?? undefined,
    },
    true,
    initialData
  );

  const { chips } = useSearchFilters();


  // Toggles the anchored filters popover; clicking the same pill again closes it.
  const openFilter = (e: React.MouseEvent, tab: number) => {
    e.stopPropagation();
    if (filterOpen && filterTab === tab) {
      setFilterOpen(false);
      return;
    }
    setFilterTab(tab);
    setFilterOpen(true);
  };

  return (
    <div className="dsr">
      <DesktopBatchesSheet
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

      {/* ── Shared global header (always solid — no dark hero here) ────── */}
      <DesktopNav alwaysSolid alwaysShowSearch />

      {/* ── Filter bar ─────────────────────────────────────────────────── */}
      <div className="dsr-filterbar">
        <div className="dsr-fpills">
          <button className="dsr-fpill" type="button" onClick={(e) => openFilter(e, 0)}>
            <span>Filters</span>
            <img src={`${LI}filter-icon.svg`} alt="" className="dsr-fpill-ico" />
          </button>
          <button className="dsr-fpill" type="button" onClick={(e) => openFilter(e, 7)}>
            <span>Bucket List</span>
            <img src={`${LI}list-alt-add.svg`} alt="" className="dsr-fpill-ico" />
          </button>
          <button className="dsr-fpill" type="button" onClick={(e) => openFilter(e, 3)}>
            <span>Budget</span>
            <img src={`${AS}arrow-down.svg`} alt="" className="dsr-fpill-caret" />
          </button>
          <button className="dsr-fpill" type="button" onClick={(e) => openFilter(e, 2)}>
            <span>Months</span>
            <img src={`${AS}arrow-down.svg`} alt="" className="dsr-fpill-caret" />
          </button>
          <button className="dsr-fpill" type="button" onClick={(e) => openFilter(e, 3)}>
            <span>Categories</span>
            <img src={`${AS}arrow-down.svg`} alt="" className="dsr-fpill-caret" />
          </button>
          <button className="dsr-fpill" type="button" onClick={(e) => openFilter(e, 2)}>
            <span>Duration</span>
            <img src={`${AS}arrow-down.svg`} alt="" className="dsr-fpill-caret" />
          </button>

          {/* Anchored filters popover — opens alongside the filter pills */}
          <DesktopFilterSheet
            isOpen={filterOpen}
            onClose={() => setFilterOpen(false)}
            initialTab={filterTab}
            searchParams={searchParams}
          />
        </div>
      </div>

      {/* ── Results ────────────────────────────────────────────────────── */}
      <main className="dsr-main">
        {chips.length > 0 && (
          <div className="dsr-chips">
            {chips.map((chip) => (
              <div className="dsr-chip" key={chip.key}>
                <span>{chip.label}</span>
                <button className="dsr-chip-x" aria-label={`Remove ${chip.label}`} onClick={chip.onRemove}>
                  <img src={`${LI}close-icon.svg`} alt="" width={16} height={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        {!loading && (
          <div className="dsr-count-row">
            <p className="dsr-count">
              {total} Trip{total !== 1 ? "s" : ""} Found
            </p>
            <ToggleSwitch
              checked={showFeatures}
              onChange={setShowFeatures}
              label="Show Features"
              className="dsr-features-toggle"
              labelClassName="dsr-features-toggle-label"
              imgClassName="dsr-features-toggle-switch"
              tapSound
            />
          </div>
        )}

        <div className="dsr-grid">
          {loading
            ? Array.from({ length: PAGE_SIZE }, (_, i) => <TripCardShimmer key={i} variant="search-desktop" />)
            : visibleTrips.map((trip, i) => (
                <div className="dsr-cell" key={trip.slug}>
                  <TripCard
                    trip={trip}
                    theme="teal"
                    eager={i < 3}
                    showFeatures={showFeatures}
                    onSeeAllDates={setBatchesTrip}
                  />
                </div>
              ))}
        </div>

        {!loading && total === 0 && (
          <p className="dsr-no-results">No trips match your filters. Try adjusting your search.</p>
        )}

        {!loading && hasMore && (
          <div className="dsr-viewmore-wrap">
            <button type="button" className="dsr-viewmore" onClick={loadMore}>
              View more trips
            </button>
          </div>
        )}
      </main>

      <DesktopFooter />
    </div>
  );
}
