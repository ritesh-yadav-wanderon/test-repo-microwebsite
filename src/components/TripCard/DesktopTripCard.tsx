import { memo } from "react";
import { useNavigate } from "react-router-dom";
import type { Trip } from "@/types";
import { useWishlist } from "@/context/WishlistContext";
import { IMAGE_WIDTHS, sizedImageUrl } from "@/repositories";
import HeartIcon from "@/components/ui/HeartIcon";

const T = "/figma/trips";

function fmtDate(raw: string): string {
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return raw;
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
}

export interface DesktopTripCardProps {
  trip: Trip;
  onMoreDates: (trip: Trip) => void;
}

/** Trip card used by the desktop carousels (Figma 3394:11786). */
const DesktopTripCard = memo(function DesktopTripCard({ trip, onMoreDates }: DesktopTripCardProps) {
  const navigate = useNavigate();
  const { isWishlisted, toggle: toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(trip.slug);
  const batches = trip.batches ?? [];
  const shown = batches.slice(0, 2).map(fmtDate).join(", ");
  const extra = Math.max(batches.length - 2, 0);

  const priceNum = trip.startingPrice
    ? Number(String(trip.startingPrice).replace(/[₹,\s/-]/g, ""))
    : 0;
  const price = priceNum ? priceNum.toLocaleString("en-IN") : String(trip.startingPrice ?? "");

  return (
    <article className="dtrips__card" onClick={() => navigate(`/trip/${trip.slug}`)}>
      <div className="dtrips__img">
        <img
          src={trip.image ? sizedImageUrl(trip.image, IMAGE_WIDTHS.carousel) : `${T}/trip-1.jpg`}
          alt={trip.title}
          loading="lazy"
        />
        <button
          className={`dtrips__wishlist${wishlisted ? " dtrips__wishlist--saved" : ""}`}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={wishlisted}
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist({
              slug: trip.slug,
              title: trip.title,
              image: trip.image || `${T}/trip-1.jpg`,
              price: String(trip.startingPrice ?? ""),
              duration: trip.duration ? `${trip.duration.nights}N/${trip.duration.days}D` : undefined,
              route: trip.pickDropPoint,
            });
          }}
        >
          <HeartIcon filled={wishlisted} />
        </button>
      </div>
      <h3 className="dtrips__card-title">{trip.title}</h3>
      {trip.duration && (
        <p className="dtrips__duration">
          <img src={`${T}/icon-calendar-clock.svg`} alt="" />
          {trip.duration.nights}N/{trip.duration.days}D
        </p>
      )}
      {shown && (
        <p className="dtrips__dates">
          <span className="dtrips__dates-list">
            {shown}
            {extra > 0 && "..."}
          </span>
          {extra > 0 && (
            <button
              className="dtrips__dates-more"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onMoreDates(trip);
              }}
            >
              +{extra} More
            </button>
          )}
        </p>
      )}
      <div className="dtrips__price-row">
        <span className="dtrips__price-now">₹{price}/-</span>
      </div>
      <p className="dtrips__price-sub">Onwards per person</p>
    </article>
  );
});

export default DesktopTripCard;
