import { memo } from "react";
import { useNavigate } from "react-router-dom";
import type { Trip } from "@/types";
import { useCompare } from "@/context/CompareContext";
import { useWishlist } from "@/context/WishlistContext";
import HeartIcon from "@/components/ui/HeartIcon";
import "./TripCard.css";
import CtaButton from "@/components/ui/CtaButton";

function fmtDate(d: string): string {
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return d;
  return dt.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
}

/* ────────────────────────────────────────────────────────────
 * Static fallbacks — the trip API does not yet return these new
 * fields, so per design we always render them with static values
 * (identical across every trip) when the trip has no real data.
 * ──────────────────────────────────────────────────────────── */
const STATIC_ROUTE =
  "3N Paris → 3N Amsterdam → 3N Prague → 2N Vienna → 3N Budapest";
const STATIC_FEATURES = [
  "Disneyland Tour with Eiffel Tower Visit",
  "Cologne City Tour",
  "Lake Titisee",
];
const STATIC_STRIKE = "29,000";
const STATIC_DURATION = "7N/8D";
const STATIC_DATES = "09 May, 12 May, 18 May...";

/* ── Inline icons (currentColor so they inherit the surrounding color) ── */
function CalendarIcon() {
  return (
    <svg viewBox="0 0 12 12" fill="none" aria-hidden>
      <path
        d="M2.4997 4.40388H9.4997V3.15388C9.4997 3.11538 9.48366 3.08013 9.45158 3.04813C9.41958 3.01605 9.38433 3.00001 9.34583 3.00001H2.65357C2.61507 3.00001 2.57982 3.01605 2.54782 3.04813C2.51574 3.08013 2.4997 3.11538 2.4997 3.15388V4.40388ZM2.65357 10.75C2.40099 10.75 2.1872 10.6625 2.0122 10.4875C1.8372 10.3125 1.7497 10.0987 1.7497 9.84613V3.15388C1.7497 2.9013 1.8372 2.68751 2.0122 2.51251C2.1872 2.33751 2.40099 2.25001 2.65357 2.25001H3.34582V1.57688C3.34582 1.4673 3.38253 1.3758 3.45595 1.30238C3.52937 1.22905 3.62087 1.19238 3.73045 1.19238C3.84012 1.19238 3.93162 1.22905 4.00495 1.30238C4.07837 1.3758 4.11508 1.4673 4.11508 1.57688V2.25001H7.90358V1.56738C7.90358 1.46097 7.93945 1.37184 8.0112 1.30001C8.08303 1.22826 8.17216 1.19238 8.27858 1.19238C8.38499 1.19238 8.47408 1.22826 8.54583 1.30001C8.61766 1.37184 8.65358 1.46097 8.65358 1.56738V2.25001H9.34583C9.59841 2.25001 9.8122 2.33751 9.9872 2.51251C10.1622 2.68751 10.2497 2.9013 10.2497 3.15388V5.51063C10.2497 5.61705 10.2138 5.70613 10.142 5.77788C10.0702 5.84972 9.98112 5.88563 9.8747 5.88563C9.76828 5.88563 9.6792 5.84972 9.60745 5.77788C9.53562 5.70613 9.4997 5.61705 9.4997 5.51063V5.15388H2.4997V9.84613C2.4997 9.88463 2.51574 9.91988 2.54782 9.95188C2.57982 9.98397 2.61507 10 2.65357 10H5.7122C5.81862 10 5.90774 10.0359 5.97958 10.1078C6.05133 10.1795 6.0872 10.2686 6.0872 10.375C6.0872 10.4814 6.05133 10.5705 5.97958 10.6423C5.90774 10.7141 5.81862 10.75 5.7122 10.75H2.65357ZM7.50258 10.5933C7.06474 10.1554 6.84583 9.62434 6.84583 9.00001C6.84583 8.37567 7.06474 7.84459 7.50258 7.40676C7.94041 6.96892 8.47149 6.75001 9.09583 6.75001C9.72024 6.75001 10.2513 6.96892 10.6891 7.40676C11.1269 7.84459 11.3458 8.37567 11.3458 9.00001C11.3458 9.62434 11.1269 10.1554 10.6891 10.5933C10.2513 11.0311 9.72024 11.25 9.09583 11.25C8.47149 11.25 7.94041 11.0311 7.50258 10.5933ZM9.31708 8.90963V7.75001C9.31708 7.68976 9.29524 7.63784 9.25158 7.59426C9.20799 7.55067 9.15608 7.52888 9.09583 7.52888C9.03558 7.52888 8.98366 7.55067 8.94008 7.59426C8.89649 7.63784 8.8747 7.68976 8.8747 7.75001V8.90188C8.8747 8.96213 8.88562 9.01951 8.90745 9.07401C8.9292 9.12851 8.96349 9.17917 9.01033 9.22601L9.77283 9.98851C9.81641 10.0321 9.86753 10.0547 9.9262 10.0563C9.98478 10.0578 10.0375 10.0353 10.0843 9.98851C10.1312 9.94167 10.1546 9.88976 10.1546 9.83276C10.1546 9.77567 10.1312 9.72372 10.0843 9.67688L9.31708 8.90963Z"
        fill="currentColor"
      />
    </svg>
  );
}

export interface TripCardProps {
  trip: Trip;
  theme?: "default" | "teal";
  fullWidth?: boolean;
  accentColor?: string;
  cardPillBg?: string;
  onSeeAllDates?: (trip: Trip) => void;
  eager?: boolean;
  /** Show the highlight features list. Defaults to true. */
  showFeatures?: boolean;
}

function TripCard({ trip, onSeeAllDates, eager, showFeatures = true }: TripCardProps) {
  const navigate = useNavigate();
  const { isInCompare, toggle } = useCompare();
  const { isWishlisted, toggle: toggleWishlist } = useWishlist();
  const {
    title,
    image,
    startingPrice,
    duration,
    skeletonItinerary = [],
    recommended,
    batches = [],
  } = trip;

  const wishlisted = isWishlisted(trip.slug);
  const toggleWish = () =>
    toggleWishlist({
      slug: trip.slug,
      title,
      image,
      price: String(startingPrice ?? ""),
      duration:
        duration?.nights && duration?.days
          ? `${duration.nights}N/${duration.days}D`
          : STATIC_DURATION,
      route: trip.pickDropPoint,
    });

  const inCompare = isInCompare(trip.slug);
  const toggleCompare = () =>
    toggle({
      slug: trip.slug,
      title,
      image,
      price: String(startingPrice ?? ""),
      route: (skeletonItinerary.length ? skeletonItinerary.join(" → ") : STATIC_ROUTE),
    });

  // ── Bindings (fall back to static Figma values when API omits them) ──
  const durationLabel =
    duration?.nights && duration?.days
      ? `${duration.nights}N/${duration.days}D`
      : STATIC_DURATION;

  // Static skeleton itinerary from the design — same across all cards.
  const route = STATIC_ROUTE;

  // Static feature highlights from the design — same across all cards.
  const featureList = STATIC_FEATURES;

  const batchesFmt = batches.map(fmtDate);
  const datesLine = batchesFmt.length
    ? batchesFmt.slice(0, 3).join(", ") + (batchesFmt.length > 3 ? "..." : "")
    : STATIC_DATES;

  const priceNum = startingPrice
    ? Number(String(startingPrice).replace(/[₹,\s/-]/g, ""))
    : 0;
  const priceDisplay = priceNum ? priceNum.toLocaleString("en-IN") : String(startingPrice ?? "");
  // Strike price is not part of the API response yet — static per design.
  const strikeDisplay = STATIC_STRIKE;

  const goToTrip = () => navigate(`/trip/${trip.slug}`);

  return (
    <article className={`tc${recommended ? " tc--recommended" : ""}`}>
      {/* ── Media ── */}
      <div className="tc-media">
        <img className="tc-img" src={image} alt={title} loading={eager ? "eager" : "lazy"} />

        <div className="tc-media-top">
          <button
            className={`tc-wish${wishlisted ? " tc-wish--saved" : ""}`}
            type="button"
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            aria-pressed={wishlisted}
            onClick={toggleWish}
          >
            <HeartIcon filled={wishlisted} />
          </button>
          <button
            className="tc-compare"
            type="button"
            aria-pressed={inCompare}
            aria-label={inCompare ? "Remove from Compare" : "Add to Compare"}
            onClick={toggleCompare}
          >
            {inCompare ? (
              <svg className="tc-compare-ico" viewBox="0 0 14 14" fill="none" aria-hidden>
                <path d="M3 3L11 11M11 3L3 11" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            ) : (
              <img src="/figma/trip-hero/icon-compare.svg" alt="" className="tc-compare-ico" aria-hidden loading="lazy" />
            )}
            {inCompare ? "Remove from Compare" : "Add to Compare"}
          </button>
        </div>
      </div>

      {recommended && (
        <div className="tc-ribbon">
          <img src="/figma/listing/recommended.png" alt="" aria-hidden loading="lazy" />
          <span>Recommended</span>
        </div>
      )}

      {/* ── Body ── */}
      <div className="tc-body">
        <div className="tc-info">
          <p className="tc-title">{title}</p>

          <div className="tc-meta-row">
            <div className="tc-meta-left">
              <span className="tc-meta-cal">
                <CalendarIcon />
              </span>
              <span className="tc-meta-dur">{durationLabel}</span>
              <span className="tc-meta-dot" aria-hidden />
              <button className="tc-meta-dates" type="button" onClick={() => onSeeAllDates?.(trip)}>
                {datesLine}
              </button>
            </div>
            <button className="tc-see-all" type="button" onClick={() => onSeeAllDates?.(trip)}>
              See All Departures
            </button>
          </div>

          <div className="tc-route">{route}</div>

          {showFeatures && (
            <ul className="tc-features">
              {featureList.map((f, i) => (
                <li key={i}>
                  <span className="tc-feat-dot" aria-hidden />
                  {f}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Price + CTA */}
        <div className="tc-foot">
          <div className="tc-price-col">
            <div className="tc-price-row">
              <span className="tc-price-old">₹{strikeDisplay}/-</span>
              <span className="tc-price-now">₹{priceDisplay}/-</span>
            </div>
            <span className="tc-price-sub">Onwards per person</span>
          </div>
          <CtaButton className="tc-cta" onClick={goToTrip}>
            View Trip
          </CtaButton>
        </div>
      </div>
    </article>
  );
}

export default memo(TripCard);
