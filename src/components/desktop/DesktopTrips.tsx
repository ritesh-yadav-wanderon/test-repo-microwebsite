import { memo, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Trip, TripGroup } from "@/types";
import { IMAGE_WIDTHS, sizedImageUrl } from "@/repositories";
import DesktopBatchesSheet from "./DesktopBatchesSheet";
import DesktopTripCard from "@/components/TripCard/DesktopTripCard";
import PagerButtons from "@/components/ui/PagerButtons";
import "./DesktopTrips.css";

/** Decorative 40px thumbnails behind the "View More Trips" button. */
function miniThumb(image?: string): string {
  return image ? sizedImageUrl(image, IMAGE_WIDTHS.mini) : "/figma/trips/trip-1.jpg";
}

interface Props {
  trips: TripGroup[];
  loading: boolean;
  /** Section heading — defaults to the homepage copy. */
  title?: string;
  /** Destination for the "See all"/"View more" links. */
  seeAllHref?: string;
}

/** "Upcoming Group trips" card carousel (Figma 3394:11786). */
function DesktopTrips({
  trips,
  loading,
  title = "Upcoming Group trips",
  seeAllHref = "/search",
}: Props) {
  const navigate = useNavigate();
  const trackRef = useRef<HTMLDivElement>(null);
  const [batchesTrip, setBatchesTrip] = useState<Trip | null>(null);

  const flat: Trip[] = useMemo(
    () => trips.flatMap((g) => g.tripsArray).slice(0, 12),
    [trips]
  );

  const scrollBy = (dir: 1 | -1) =>
    trackRef.current?.scrollBy({ left: dir * (198 + 30) * 2, behavior: "smooth" });

  return (
    <section className="dtrips">
      <div className="dtrips__head">
        <h2 className="dtrips__title">{title}</h2>
        <button className="dtrips__seeall" onClick={() => navigate(seeAllHref)}>
          See all
        </button>
      </div>

      <div className="dtrips__track" ref={trackRef}>
        {loading
          ? Array.from({ length: 5 }, (_, i) => (
              <div className="dtrips__card" key={i} aria-hidden>
                <div className="dtrips__img sk" />
                <div className="sk sk-line" style={{ width: "90%" }} />
                <div className="sk sk-line" style={{ width: "60%" }} />
                <div className="sk sk-line" style={{ width: "70%" }} />
              </div>
            ))
          : flat.map((trip) => (
              <DesktopTripCard key={trip.slug} trip={trip} onMoreDates={setBatchesTrip} />
            ))}

        {!loading && (
          <button className="dtrips__more" onClick={() => navigate(seeAllHref)}>
            <span className="dtrips__more-stack">
              <span className="dtrips__more-mini dtrips__more-mini--left">
                <img src={miniThumb(flat[0]?.image)} alt="" />
              </span>
              <span className="dtrips__more-mini dtrips__more-mini--right">
                <img src={miniThumb(flat[1]?.image)} alt="" />
              </span>
            </span>
            View More Trips
          </button>
        )}
      </div>

      <PagerButtons
        onPrev={() => scrollBy(-1)}
        onNext={() => scrollBy(1)}
        className="dtrips__pager"
        buttonClassName="dtrips__pager-btn"
        prevLabel="Previous trips"
        nextLabel="Next trips"
      />

      <DesktopBatchesSheet
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

export default memo(DesktopTrips);
