import { memo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import type { Trip } from "../../types";
import TripCard from "../TripCard";
import TripCardShimmer from "../TripCard/TripCardShimmer";
import FeaturesToggle from "../FeaturesToggle/FeaturesToggle";
import "./DesktopListingStrip.css";

interface Props {
  title: string;
  trips: Trip[];
  loading: boolean;
  /** Destination for the "See all" link. */
  seeAllHref: string;
  /** Opens the departures sheet for a trip. */
  onSeeAllDates: (trip: Trip) => void;
  /** Feature rows on the cards, toggled from the strip header. */
  showFeatures: boolean;
  onShowFeaturesChange: (next: boolean) => void;
}

/** Horizontal strip of listing trip cards — the desktop counterpart of the
 *  mobile destination page strips, which use the same TripCard. */
function DesktopListingStrip({
  title,
  trips,
  loading,
  seeAllHref,
  onSeeAllDates,
  showFeatures,
  onShowFeaturesChange,
}: Props) {
  const navigate = useNavigate();
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) =>
    trackRef.current?.scrollBy({ left: dir * (358 + 23) * 2, behavior: "smooth" });

  return (
    <section className="dls">
      <div className="dls__head">
        <h2 className="dls__title">{title}</h2>
        <div className="dls__head-right">
          <FeaturesToggle checked={showFeatures} onChange={onShowFeaturesChange} />
          <button className="dls__seeall" type="button" onClick={() => navigate(seeAllHref)}>
            See all
          </button>
        </div>
      </div>

      <div className="dls__track" ref={trackRef}>
        {loading
          ? Array.from({ length: 3 }, (_, i) => (
              <div className="dls__cell" key={i}>
                <TripCardShimmer />
              </div>
            ))
          : trips.map((trip, i) => (
              <div className="dls__cell" key={trip.slug}>
                <TripCard
                  trip={trip}
                  theme="teal"
                  eager={i < 2}
                  showFeatures={showFeatures}
                  onSeeAllDates={onSeeAllDates}
                />
              </div>
            ))}
      </div>

      <div className="dls__pager">
        <button className="dls__pager-btn" type="button" aria-label="Previous trips" onClick={() => scrollBy(-1)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M15 4 7 12l8 8" stroke="#3d3d3d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button className="dls__pager-btn" type="button" aria-label="Next trips" onClick={() => scrollBy(1)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="m9 4 8 8-8 8" stroke="#3d3d3d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </section>
  );
}

export default memo(DesktopListingStrip);
