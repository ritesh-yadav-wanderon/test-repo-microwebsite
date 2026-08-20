import { memo } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { Trip } from "../../types";
import { useWishlist } from "../../context/WishlistContext";
import HeartIcon from "../HeartIcon/HeartIcon";
import "./UpcomingTrips.css";
import "./TripCardItem.css";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const T = "/figma/trips/";

export function formatDate(iso: string): string {
  const p = iso.split("-");
  if (p.length === 3) {
    return `${p[2]} ${MONTHS[parseInt(p[1], 10) - 1] ?? p[1]}`;
  }
  return iso;
}

export function formatBatches(batches?: string[]): string {
  const { dates, more } = formatBatchesParts(batches);
  return more ? `${dates} ${more}` : dates;
}

function formatBatchesParts(batches?: string[]): { dates: string; more?: string } {
  if (!batches?.length) return { dates: "" };
  const shown = batches.slice(0, 2).map(formatDate);
  const rest = batches.length - 2;
  return rest > 0
    ? { dates: `${shown.join(", ")}...`, more: `+${rest} More` }
    : { dates: shown.join(", ") };
}

function formatPrice(price?: string): string {
  const n = Number(String(price ?? "").replace(/[₹,\s/\-]/g, ""));
  return Number.isFinite(n) && n > 0 ? n.toLocaleString("en-IN") : String(price ?? "");
}

export const TripCardItem = memo(function TripCardItem({ trip, batchesText, href, onMoreDates }: {
  trip: Trip;
  batchesText?: string;
  href?: string;
  onMoreDates?: (trip: Trip) => void;
}) {
  const { isWishlisted, toggle: toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(trip.slug);
  const dur = trip.duration ? `${trip.duration.nights}N/${trip.duration.days}D` : "";
  const parts = batchesText
    ? { dates: batchesText, more: undefined as string | undefined }
    : formatBatchesParts(trip.batches);

  return (
    <Link className="tdp2-more-card-v2" to={href ?? `/trip/${trip.slug}`}>
      <div className="tdp2-more-cv2-img-wrap">
        {trip.image
          ? <img src={trip.image} alt={trip.title} className="tdp2-more-cv2-img" loading="lazy" />
          : <div className="tdp2-more-cv2-img" style={{ background: "#d6d6d6" }} />
        }
        <button
          className={`tdp2-more-cv2-wish${wishlisted ? " tdp2-more-cv2-wish--on" : ""}`}
          type="button"
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          onClick={e => {
            e.preventDefault();
            toggleWishlist({
              slug: trip.slug,
              title: trip.title,
              image: trip.image || `${T}trip-1.jpg`,
              price: String(trip.startingPrice ?? ""),
              duration: dur || undefined,
              route: trip.pickDropPoint,
            });
          }}
        >
          <HeartIcon filled={wishlisted} />
        </button>
      </div>
      <div className="tdp2-more-cv2-info">
        <p className="tdp2-more-cv2-title">{trip.title}</p>
        {dur && (
          <div className="tdp2-more-cv2-dur">
            <img src={`${T}icon-calendar-clock.svg`} width={12} height={12} alt="" aria-hidden />
            <span>{dur}</span>
          </div>
        )}
        {parts.dates && (
          <div className="tdp2-more-cv2-batches">
            <span className="tdp2-more-cv2-dates">{parts.dates}</span>
            {parts.more && (
              onMoreDates ? (
                <button
                  className="tdp2-more-cv2-more"
                  type="button"
                  onClick={e => {
                    e.preventDefault();
                    onMoreDates(trip);
                  }}
                >
                  {parts.more}
                </button>
              ) : (
                <span className="tdp2-more-cv2-more">{parts.more}</span>
              )
            )}
          </div>
        )}
        <div className="tdp2-more-cv2-price-wrap">
          <p className="tdp2-more-cv2-price">&#8377;{formatPrice(trip.startingPrice)}/-</p>
          <p className="tdp2-more-cv2-per">Onwards per person</p>
        </div>
      </div>
    </Link>
  );
});

export const TripCardShimmer = memo(function TripCardShimmer() {
  return (
    <div className="tdp2-more-card-v2" aria-hidden>
      {/* The shimmer sits inside the media frame — the frame's own background
          would otherwise paint over it. */}
      <div className="tdp2-more-cv2-img-wrap">
        <div className="tdp2-more-cv2-sk-img up-shimmer-block" />
      </div>
      <div className="tdp2-more-cv2-info">
        <div className="up-shimmer-line" style={{ width: "90%", height: 21 }} />
        <div className="up-shimmer-line" style={{ width: "40%", height: 14 }} />
        <div className="up-shimmer-line" style={{ width: "100%", height: 14 }} />
        <div className="up-shimmer-line" style={{ width: "55%", height: 24 }} />
      </div>
    </div>
  );
});

export interface ViewMoreCardProps {
  a: string;
  b: string;
  /** Destination to navigate to (defaults to the listing page). */
  to?: string;
}

export const ViewMoreCard = memo(function ViewMoreCard({ a, b, to = "/search" }: ViewMoreCardProps) {
  const navigate = useNavigate();
  return (
    <button className="tdp2-more-vm-card" type="button" onClick={() => navigate(to)}>
      <div className="tdp2-more-vm-imgs">
        <span className="tdp2-more-vm-img tdp2-more-vm-back">
          <img src={b || `${T}trip-2.jpg`} alt="" aria-hidden loading="lazy" />
        </span>
        <span className="tdp2-more-vm-img tdp2-more-vm-front">
          <img src={a || `${T}trip-1.jpg`} alt="" aria-hidden loading="lazy" />
        </span>
      </div>
      <p className="tdp2-more-vm-label">View More Trips</p>
    </button>
  );
});
