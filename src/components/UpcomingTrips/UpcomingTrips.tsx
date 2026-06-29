import type { ApiSource, TripGroup } from "../../types";
import TripCard from "../TripCard";
import TripCardShimmer from "../TripCard/TripCardShimmer";
import { CATEGORY_THEMES } from "../../categoryThemes";
import "./UpcomingTrips.css";

const SHIMMER_COUNT = 2;

function FilterIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden>
      <path d="M3 5h18M6 10h12M10 15h4" stroke="#3d3d3d" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ChevronDown() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden>
      <path d="M6 9l6 6 6-6" stroke="#3d3d3d" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export interface UpcomingTripsProps {
  trips: TripGroup[];
  loading: boolean;
  source: ApiSource | null;
  activeCategory: number;
}

export default function UpcomingTrips({ trips, loading, source, activeCategory }: UpcomingTripsProps) {
  const theme = CATEGORY_THEMES[activeCategory] ?? CATEGORY_THEMES[0];
  const categoryName = theme.name;

  const seen = new Set<string>();
  const allFlat = trips
    .flatMap((g) => g.tripsArray || [])
    .filter((t) => (seen.has(t.slug) ? false : seen.add(t.slug) || true));

  const flat = activeCategory === 0
    ? allFlat
    : allFlat.filter((t) => t.categories?.includes(categoryName));

  return (
    <section
      className="up"
      style={{
        background: theme.sectionGradient,
        "--up-pill-bg": theme.pillBg,
        "--up-pill-border": theme.pillBorder,
        "--up-tab-active": theme.tabActive,
        "--up-progress-fill": theme.progressFill,
      } as React.CSSProperties}
    >
      <div className="up-header">
        <div className="up-header-row">
          <p className="up-title">Upcoming Group Trips</p>
          {source === "sample" && <span className="up-flag">demo data</span>}
        </div>

        <div className="up-filters">
          <button className="up-filter" type="button">
            <span>Filters</span>
            <FilterIcon />
          </button>
          <div className="up-filter" role="button" tabIndex={0}>
            <span>Destination</span>
            <ChevronDown />
          </div>
          <div className="up-filter-split">
            <button className="up-filter-split-l" type="button">Add Your Dates</button>
            <button className="up-filter-split-r" type="button" aria-label="Pick dates">
              <ChevronDown />
            </button>
          </div>
        </div>

      </div>

      <div className="up-cards" aria-busy={loading}>
        {loading
          ? Array.from({ length: SHIMMER_COUNT }, (_, i) => <TripCardShimmer key={`shimmer-${i}`} />)
          : flat.length > 0
            ? flat.map((trip) => (
                <TripCard
                  key={trip.slug}
                  trip={trip}
                  accentColor={theme.cardAccent}
                  cardPillBg={theme.cardPillBg}
                />
              ))
            : (
              <p className="up-empty">No {categoryName} trips available right now.</p>
            )}
      </div>

      {!loading && flat.length > 0 && (
        <div className="up-progress">
          <div className="up-progress-track">
            <div className="up-progress-fill" />
          </div>
        </div>
      )}
    </section>
  );
}
