import { memo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import type { Trip } from "@/types";
import TripCard from "@/components/TripCard";
import TripCardShimmer from "@/components/ui/TripCardShimmer";
import FeaturesToggle from "@/components/FeaturesToggle";
import PagerButtons from "@/components/ui/PagerButtons";
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
              // Index-suffixed: the synthetic "Customise your X Trip" cards all
              // carry the destination slug, so the slug alone isn't unique.
              <div className="dls__cell" key={`${trip.slug}-${i}`}>
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

      <PagerButtons
        onPrev={() => scrollBy(-1)}
        onNext={() => scrollBy(1)}
        className="dls__pager"
        buttonClassName="dls__pager-btn"
        prevLabel="Previous trips"
        nextLabel="Next trips"
      />
    </section>
  );
}

export default memo(DesktopListingStrip);
