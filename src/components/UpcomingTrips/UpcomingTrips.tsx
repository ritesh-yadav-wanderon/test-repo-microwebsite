import { memo, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ApiSource, Trip, TripGroup } from "@/types";
import BatchesSheet from "@/components/BatchesSheet";
import { TripCardItem, ViewMoreCard } from "./TripCardItem";
import TripCardShimmer from "@/components/ui/TripCardShimmer";
import "./UpcomingTrips.css";

export interface UpcomingTripsProps {
  trips: TripGroup[];
  loading: boolean;
  source: ApiSource | null;
  activeCategory: number;
}

const CATEGORY_NAMES = ["All Trips","Adventure","Luxury","Culture","Festival","Wellness","Weekend"];

function UpcomingTrips({ trips, loading, source: _source, activeCategory }: UpcomingTripsProps) {
  const navigate = useNavigate();
  const [batchesTrip, setBatchesTrip] = useState<Trip | null>(null);

  const categoryName = CATEGORY_NAMES[activeCategory] ?? "All Trips";
  const flat = useMemo(() => {
    const seen = new Set<string>();
    const allFlat = trips
      .flatMap(g => g.tripsArray || [])
      .filter(t => seen.has(t.slug) ? false : (seen.add(t.slug), true));
    return (activeCategory === 0
      ? allFlat
      : allFlat.filter(t => t.categories?.includes(categoryName))
    ).slice(0, 8);
  }, [activeCategory, categoryName, trips]);

  return (
    <section className="up">
      <div className="up-header">
        <div className="up-header-row">
          <p className="up-title">Upcoming Group trips</p>
          <button className="up-header-arrow" type="button" aria-label="View all upcoming trips">
            <img src="/figma/trips/arrow-right.svg" width={16} height={16} alt="" aria-hidden loading="lazy" />
          </button>
        </div>
        <div className="up-filters">
          <button
            className="up-filter-pill"
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent("wanderon:open-filter"))}
          >
            <img src="/figma/trips/filter-icon.svg" width={16} height={16} alt="" aria-hidden loading="lazy" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      <div className="up-cards" aria-busy={loading}>
        {loading
          ? Array.from({ length: 3 }, (_, i) => <TripCardShimmer key={i} variant="compact" />)
          : flat.length > 0
            ? [
                ...flat.map(t => (
                  <TripCardItem
                    key={t.slug}
                    trip={t}
                    onMoreDates={setBatchesTrip}
                  />
                )),
                <ViewMoreCard
                  key="view-more"
                  a={flat[0]?.image || "/figma/trips/trip-1.jpg"}
                  b={flat[1]?.image || "/figma/trips/trip-2.jpg"}
                />,
              ]
            : <p className="up-empty">No {categoryName} trips available right now.</p>
        }
      </div>

      {/* Departure dates, as on the listing page. */}
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
    </section>
  );
}

export default memo(UpcomingTrips);
