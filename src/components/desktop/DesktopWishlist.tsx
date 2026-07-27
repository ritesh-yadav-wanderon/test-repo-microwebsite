import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWishlist, type WishlistTrip } from "../../context/WishlistContext";
import { useCompare } from "../../context/CompareContext";
import DesktopFooter from "./DesktopFooter";
import "./DesktopWishlist.css";

const D = "/figma/compare/desktop/";
const W = "/figma/wishlist/";

const MONTHS = ["Jul-26", "Aug-26", "Sep-26", "Oct-26", "Nov-26", "Dec-26"];

function priceDisplay(raw: string): string {
  const num = Number(String(raw).replace(/[^\d]/g, ""));
  return num ? num.toLocaleString("en-IN") : String(raw);
}

function strikeDisplay(raw: string): string {
  const num = Number(String(raw).replace(/[^\d]/g, ""));
  return num ? Math.round(num * 1.15).toLocaleString("en-IN") : "";
}

/** Desktop wishlist trip card (Figma 6493:27974). */
function DesktopWishCard({ trip }: { trip: WishlistTrip }) {
  const navigate = useNavigate();
  const { remove } = useWishlist();
  const { isInCompare, toggle: toggleCompare } = useCompare();
  const inCompare = isInCompare(trip.slug);
  const strike = strikeDisplay(trip.price);

  return (
    <article className="dwl-card" onClick={() => navigate(`/trip/${trip.slug}`)}>
      <div className="dwl-card-img">
        <img src={trip.image} alt={trip.title} loading="lazy" />
        <div className="dwl-card-overlays">
          <button
            className="dwl-card-heart"
            type="button"
            aria-label="Remove from wishlist"
            onClick={(e) => {
              e.stopPropagation();
              remove(trip.slug);
            }}
          >
            <img src={`${W}heart.svg`} alt="" width={14} height={12} aria-hidden />
          </button>
          <button
            className={`dwl-card-compare${inCompare ? " dwl-card-compare--active" : ""}`}
            type="button"
            aria-pressed={inCompare}
            onClick={(e) => {
              e.stopPropagation();
              toggleCompare({
                slug: trip.slug,
                title: trip.title,
                image: trip.image,
                price: trip.price,
              });
            }}
          >
            <img src="/figma/trip-hero/icon-compare.svg" alt="" width={14} height={14} aria-hidden />
            {inCompare ? "Comparing" : "Add to Compare"}
          </button>
        </div>
      </div>

      <div className="dwl-card-body">
        <p className="dwl-card-title">{trip.title}</p>
        <div className="dwl-card-route">
          <img src={`${D}icon-location.svg`} alt="" width={16} height={16} aria-hidden />
          <span>{trip.route ?? "New Delhi - New Delhi"}</span>
        </div>
        <div className="dwl-card-dur">
          <img src={`${D}icon-calendar-clock.svg`} alt="" width={17} height={17} aria-hidden />
          <span>{trip.duration ?? "7N/8D"}</span>
        </div>
        <p className="dwl-card-dates">
          09 May, 12 May, <strong>+10 More...</strong>
        </p>
        <div className="dwl-card-price-row">
          {strike && <span className="dwl-card-strike">₹{strike}/-</span>}
          <span className="dwl-card-price">₹{priceDisplay(trip.price)}/-</span>
        </div>
        <p className="dwl-card-price-sub">Onwards per person</p>
      </div>
    </article>
  );
}

/** Desktop wishlist page (Figma 6487:26792). */
export default function DesktopWishlist() {
  const navigate = useNavigate();
  const { items, count } = useWishlist();
  const [activeMonth, setActiveMonth] = useState<string | null>(MONTHS[0]);

  return (
    <div className="dwl">
      {/* ── Slim page header (Figma 6588:31196) ── */}
      <header className="dwl-header">
        <button className="dwl-header-back" type="button" aria-label="Back" onClick={() => navigate(-1)}>
          <img src="/figma/compare/arrow-back.svg" alt="" width={24} height={24} aria-hidden />
        </button>
        <span className="dwl-header-title">Wishlist</span>
      </header>

      {/* ── Month filter pills ── */}
      <div className="dwl-months">
        {MONTHS.map((month) =>
          month === activeMonth ? (
            <button
              key={month}
              className="dwl-month dwl-month--active"
              type="button"
              onClick={() => setActiveMonth(null)}
            >
              {month}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M6 6l12 12M18 6 6 18" stroke="#015f74" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          ) : (
            <button
              key={month}
              className="dwl-month"
              type="button"
              onClick={() => setActiveMonth(month)}
            >
              {month}
            </button>
          )
        )}
      </div>

      {/* ── Title + grid ── */}
      <div className="dwl-content">
        <div className="dwl-title-row">
          <h1 className="dwl-title">
            {count} Wish-listed {count === 1 ? "trip" : "trips"}
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="dwl-empty">
            <p className="dwl-empty-title">No trips in your wishlist yet</p>
            <p className="dwl-empty-sub">Click the heart on any trip card to save it here.</p>
            <button className="dwl-empty-cta" type="button" onClick={() => navigate("/search")}>
              Explore trips
            </button>
          </div>
        ) : (
          <div className="dwl-grid">
            {items.map((trip) => (
              <DesktopWishCard key={trip.slug} trip={trip} />
            ))}
          </div>
        )}
      </div>

      <DesktopFooter />
    </div>
  );
}
