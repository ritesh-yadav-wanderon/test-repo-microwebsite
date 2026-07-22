import { useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import type { Trip, TripGroup } from "../../types";
import "./DesktopTrips.css";

const BASE = "/figma/desktop";

function fmtDate(raw: string): string {
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return raw;
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
}

interface Props {
  trips: TripGroup[];
  loading: boolean;
}

/** "Upcoming Group trips" card carousel (Figma 3394:11786). */
export default function DesktopTrips({ trips, loading }: Props) {
  const navigate = useNavigate();
  const trackRef = useRef<HTMLDivElement>(null);

  const flat: Trip[] = useMemo(
    () => trips.flatMap((g) => g.tripsArray).slice(0, 12),
    [trips]
  );

  const scrollBy = (dir: 1 | -1) =>
    trackRef.current?.scrollBy({ left: dir * (198 + 30) * 2, behavior: "smooth" });

  return (
    <section className="dtrips">
      <div className="dtrips__head">
        <h2 className="dtrips__title">Upcoming Group trips</h2>
        <button
          className="dtrips__head-arrow"
          aria-label="See all trips"
          onClick={() => navigate("/search")}
        >
          <svg width="25" height="25" viewBox="0 0 24 24" fill="none">
            <path d="M4 12h15m0 0-5.5-5.5M19 12l-5.5 5.5" stroke="#3d3d3d" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
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
          : flat.map((trip) => <DesktopTripCard key={trip.slug} trip={trip} />)}

        {!loading && (
          <button className="dtrips__more" onClick={() => navigate("/search")}>
            <span className="dtrips__more-stack">
              <span className="dtrips__more-mini dtrips__more-mini--left">
                <img src={flat[0]?.image || `${BASE}/trip-demo.png`} alt="" />
              </span>
              <span className="dtrips__more-mini dtrips__more-mini--right">
                <img src={flat[1]?.image || `${BASE}/trip-demo.png`} alt="" />
              </span>
            </span>
            View More Trips
          </button>
        )}
      </div>

      <div className="dtrips__pager">
        <button className="dtrips__pager-btn" aria-label="Previous trips" onClick={() => scrollBy(-1)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M15 4 7 12l8 8" stroke="#3d3d3d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button className="dtrips__pager-btn" aria-label="Next trips" onClick={() => scrollBy(1)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="m9 4 8 8-8 8" stroke="#3d3d3d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </section>
  );
}

function DesktopTripCard({ trip }: { trip: Trip }) {
  const navigate = useNavigate();
  const batches = trip.batches ?? [];
  const shown = batches.slice(0, 2).map(fmtDate).join(", ");
  const extra = Math.max(batches.length - 2, 0);

  const priceNum = trip.startingPrice
    ? Number(String(trip.startingPrice).replace(/[₹,\s/-]/g, ""))
    : 0;
  const price = priceNum ? priceNum.toLocaleString("en-IN") : String(trip.startingPrice ?? "");
  const strike = priceNum ? Math.round(priceNum * 1.15).toLocaleString("en-IN") : "";

  return (
    <article className="dtrips__card" onClick={() => navigate(`/trip/${trip.slug}`)}>
      <div className="dtrips__img">
        <img src={trip.image || `${BASE}/trip-demo.png`} alt={trip.title} loading="lazy" />
        <button
          className="dtrips__wishlist"
          aria-label="Add to wishlist"
          onClick={(e) => {
            e.stopPropagation();
            window.dispatchEvent(new CustomEvent("wanderon:open-wishlist"));
          }}
        >
          <img src={`${BASE}/wishlist-btn.svg`} alt="" />
        </button>
      </div>
      <h3 className="dtrips__card-title">{trip.title}</h3>
      <p className="dtrips__route">
        <img src={`${BASE}/icon-location.svg`} alt="" />
        {trip.pickDropPoint || "New Delhi - New Delhi"}
      </p>
      {trip.duration && (
        <p className="dtrips__duration">
          <img src={`${BASE}/icon-calendar-clock.svg`} alt="" />
          {trip.duration.nights}N/{trip.duration.days}D
        </p>
      )}
      {shown && (
        <p className="dtrips__dates">
          {shown}
          {extra > 0 && <strong>, +{extra} More...</strong>}
        </p>
      )}
      <div className="dtrips__price-row">
        {strike && <span className="dtrips__price-old">₹{strike}/-</span>}
        <span className="dtrips__price-now">₹{price}/-</span>
      </div>
      <p className="dtrips__price-sub">Onwards per person</p>
    </article>
  );
}
