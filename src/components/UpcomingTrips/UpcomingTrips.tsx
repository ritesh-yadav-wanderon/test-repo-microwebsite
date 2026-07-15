import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ApiSource, TripGroup, Trip } from "../../types";
import "./UpcomingTrips.css";

export interface UpcomingTripsProps {
  trips: TripGroup[];
  loading: boolean;
  source: ApiSource | null;
  activeCategory: number;
}

const CATEGORY_NAMES = ["All Trips","Adventure","Luxury","Culture","Festival","Wellness","Weekend"];

function formatDate(iso: string): string {
  const p = iso.split("-");
  if (p.length === 3) {
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return `${p[2]} ${months[parseInt(p[1], 10) - 1] ?? p[1]}`;
  }
  return iso;
}

function formatBatches(batches?: string[]): string {
  if (!batches?.length) return "";
  const shown = batches.slice(0, 2).map(formatDate);
  const rest = batches.length - 2;
  return rest > 0 ? `${shown.join(", ")}, +${rest} More Batches` : shown.join(", ");
}

function TripCardItem({ trip }: { trip: Trip }) {
  const [wishlisted, setWishlisted] = useState(false);
  const dur = trip.duration ? `${trip.duration.nights}N/${trip.duration.days}D` : "";
  const batches = formatBatches(trip.batches);

  return (
    <a className="up-card" href={`/trip/${trip.slug}`} style={{textDecoration:"none",color:"inherit"}}>
      <div className="up-card-img-wrap">
        {trip.image
          ? <img className="up-card-img" src={trip.image} alt={trip.title} loading="lazy" />
          : <div className="up-card-img-placeholder" />
        }
        <button
          className="up-card-wishlist"
          type="button"
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          onClick={e => { e.preventDefault(); setWishlisted(w => !w); }}
        >
          <img
            src={wishlisted ? "/figma/trips/wishlist-saved.svg" : "/figma/trips/wishlist-default.svg"}
            width={30} height={28} alt="" aria-hidden
          loading="lazy" />
        </button>
      </div>
      <div className="up-card-info">
        <p className="up-card-title">{trip.title}</p>
        {dur && (
          <div className="up-card-dur-row">
            <img src="/figma/trips/calendar-clock.svg" width={12} height={12} alt="" aria-hidden loading="lazy" />
            <span className="up-card-dur">{dur}</span>
          </div>
        )}
        {batches && <p className="up-card-batches">{batches}</p>}
        <p className="up-card-price">{trip.startingPrice}/-</p>
        <p className="up-card-per-person">Onwards per person</p>
      </div>
    </a>
  );
}

function TripCardShimmer() {
  return (
    <div className="up-card">
      <div className="up-card-img-wrap up-shimmer-block" />
      <div className="up-card-info">
        <div className="up-shimmer-line" style={{ width: "90%", height: 14 }} />
        <div className="up-shimmer-line" style={{ width: "70%" }} />
        <div className="up-shimmer-line" style={{ width: "65%" }} />
        <div className="up-shimmer-line" style={{ width: "55%", height: 16, marginTop: 2 }} />
      </div>
    </div>
  );
}

function ViewMoreCard({ a, b }: { a: string; b: string }) {
  const navigate = useNavigate();
  return (
    <div className="up-card up-view-more" onClick={() => navigate("/search")} role="button" tabIndex={0}>
      <div className="up-vm-img-wrap">
        <img className="up-vm-img up-vm-back" src={b || "/figma/trips/trip-2.jpg"} alt="" aria-hidden loading="lazy" />
        <img className="up-vm-img up-vm-front" src={a || "/figma/trips/trip-1.jpg"} alt="" aria-hidden loading="lazy" />
      </div>
      <p className="up-vm-label">View More Trips</p>
    </div>
  );
}

export default function UpcomingTrips({ trips, loading, source: _source, activeCategory }: UpcomingTripsProps) {
  const seen = new Set<string>();
  const allFlat = trips
    .flatMap(g => g.tripsArray || [])
    .filter(t => seen.has(t.slug) ? false : (seen.add(t.slug), true));

  const categoryName = CATEGORY_NAMES[activeCategory] ?? "All Trips";
  const flat = (activeCategory === 0
    ? allFlat
    : allFlat.filter(t => t.categories?.includes(categoryName))
  ).slice(0, 8);

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
          ? Array.from({ length: 3 }, (_, i) => <TripCardShimmer key={i} />)
          : flat.length > 0
            ? [
                ...flat.map(t => <TripCardItem key={t.slug} trip={t} />),
                <ViewMoreCard
                  key="view-more"
                  a={flat[0]?.image || "/figma/trips/trip-1.jpg"}
                  b={flat[1]?.image || "/figma/trips/trip-2.jpg"}
                />,
              ]
            : <p className="up-empty">No {categoryName} trips available right now.</p>
        }
      </div>

    </section>
  );
}
