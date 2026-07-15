import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Trip } from "../../types";
import "./TripCard.css";

import calendarIcon from "../../assets/trip-card/calendar-clock.svg";
import arrowIcon from "../../assets/trip-card/arrow.svg";

function fmtDate(d: string): string {
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return d;
  return dt.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
}

export interface TripCardProps {
  trip: Trip;
  theme?: "default" | "teal";
  fullWidth?: boolean;
  accentColor?: string;
  cardPillBg?: string;
  onSeeAllDates?: () => void;
  eager?: boolean;
}

export default function TripCard({ trip, theme, fullWidth, accentColor: accentOverride, cardPillBg: pillBgOverride, onSeeAllDates, eager }: TripCardProps) {
  const navigate = useNavigate();
  const [wishlisted, setWishlisted] = useState(false);
  const {
    title,
    image,
    startingPrice,
    duration,
    skeletonItinerary = [],
    features = [],
    recommended,
    joinedCount,
    firstBatch,
    batches = [],
    womenOnly,
  } = trip;

  const durationLabel =
    duration?.nights && duration?.days
      ? `${duration.nights}N/${duration.days}D`
      : null;

  const extra = Math.max(batches.length - 6, 0);
  const batchList = batches.slice(0, 6).map(fmtDate).join(", ");

  const accentColor = accentOverride ?? (womenOnly ? "#704c83" : theme === "teal" ? "#287686" : "#846950");
  const pillBg     = pillBgOverride ?? (womenOnly ? "#faf1ff" : "#fefdfc");

  const priceNum = startingPrice
    ? String(startingPrice).replace(/[₹,\s]/g, "")
    : "";

  return (
    <article className={`tc${theme === "teal" ? " tc--teal" : ""}${fullWidth ? " tc--full" : ""}`}>

      {/* Recommended badge — left edge */}
      {recommended && (
        <span className="tc-recommended">
          <img className="tc-rec-avatar" src="/figma/listing/recommended.png" alt="" aria-hidden loading="lazy" />
          Recommended
        </span>
      )}

      {/* Image + meta pill */}
      <div className="tc-stack">
        <div className="tc-media">
          <img src={image} alt={title} loading={eager ? "eager" : "lazy"} />
          {fullWidth ? (
            <div className="tc-img-actions">
              <button
                className="tc-wishlist"
                type="button"
                aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                onClick={() => setWishlisted(w => !w)}
              >
                <img
                  src={wishlisted ? "/figma/trips/wishlist-saved.svg" : "/figma/trips/wishlist-default.svg"}
                  width={30} height={28} alt="" aria-hidden
                loading="lazy" />
              </button>
              <button className="tc-compare" type="button" aria-label="Add to Compare">
                Add to Compare
              </button>
            </div>
          ) : (
            <button className="tc-compare" type="button" aria-label="Add to Compare">
              Add to Compare
            </button>
          )}
        </div>

        {/* Floating meta pill */}
        <div
          className="tc-meta-pill"
          style={{ background: pillBg, borderBottomColor: accentColor, color: accentColor }}
        >
          {durationLabel && (
            <>
              <span className="tc-meta-grp">
                <img src={calendarIcon} alt="" className="tc-cal-ico" aria-hidden loading="lazy" />
                <span className="tc-meta-bold">{durationLabel}</span>
              </span>
              <span className="tc-meta-dot" style={{ background: accentColor }} />
            </>
          )}
          <span className="tc-meta-grp">
            {joinedCount && (
              <span className="tc-meta-bold">
                {joinedCount}{womenOnly ? " Women" : ""} have joined
              </span>
            )}
            {firstBatch && <span className="tc-meta-reg">&nbsp;{firstBatch}</span>}
          </span>
        </div>
      </div>

      {/* Card body */}
      <div className="tc-body">

        <div className="tc-details">
          <h3 className="tc-title">{title}</h3>

          {skeletonItinerary.length > 0 && (
            <div className="tc-itin">{skeletonItinerary.join(" → ")}</div>
          )}

          {features.length > 0 && (
            <ul className="tc-features">
              {features.slice(0, 3).map((f, i) => (
                <li key={i}>
                  <span className="tc-feat-dot" aria-hidden />
                  {f}
                </li>
              ))}
            </ul>
          )}

          {batches.length > 0 && (
            <p className="tc-batches">
              Batches: {batchList}
              {extra > 0 && <strong> +{extra} More</strong>}
              {fullWidth && (
                <button className="tc-see-all" type="button" onClick={onSeeAllDates}>See All Departures</button>
              )}
            </p>
          )}
        </div>

        {/* Price + CTA */}
        <div className="tc-foot">
          <div className="tc-price">
            <span className="tc-price-main">
              ₹{priceNum || startingPrice}/-
            </span>
            <span className="tc-price-sub">Onwards per person</span>
          </div>
          <button className="tc-cta" type="button" onClick={() => navigate(`/trip/${trip.slug}`)}>
            View Trip
            <img src={arrowIcon} width={16} height={8} alt="" className="tc-arrow-ico" aria-hidden loading="lazy" />
          </button>
        </div>

        <p className="tc-price-note">
          *This price is lower than the average price in June.
        </p>

      </div>
    </article>
  );
}
