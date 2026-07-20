import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Trip } from "../../types";
import "./UpcomingTrips.css";
import "./TripCardItem.css";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export function formatDate(iso: string): string {
  const p = iso.split("-");
  if (p.length === 3) {
    return `${p[2]} ${MONTHS[parseInt(p[1], 10) - 1] ?? p[1]}`;
  }
  return iso;
}

export function formatBatches(batches?: string[]): string {
  if (!batches?.length) return "";
  const shown = batches.slice(0, 2).map(formatDate);
  const rest = batches.length - 2;
  return rest > 0 ? `${shown.join(", ")}, +${rest} More` : shown.join(", ");
}

function formatPrice(price?: string): string {
  const n = Number(String(price ?? "").replace(/[₹,\s/\-]/g, ""));
  return Number.isFinite(n) && n > 0 ? n.toLocaleString("en-IN") : String(price ?? "");
}

function CalendarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#287686" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <rect x="3" y="4" width="18" height="16" rx="2" /><line x1="3" y1="9" x2="21" y2="9" />
      <line x1="8" y1="2" x2="8" y2="6" /><line x1="16" y1="2" x2="16" y2="6" />
    </svg>
  );
}

function HeartIcon({ filled }: { filled?: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? "#fff" : "none"} stroke="#fff" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

/** Shared trip card — the "tdp2-more-card-v2" design used across all pages. */
export function TripCardItem({ trip, batchesText, href }: { trip: Trip; batchesText?: string; href?: string }) {
  const [wishlisted, setWishlisted] = useState(false);
  const dur = trip.duration ? `${trip.duration.nights}N/${trip.duration.days}D` : "";
  const batches = batchesText ?? formatBatches(trip.batches);

  return (
    <a className="tdp2-more-card-v2" href={href ?? `/trip/${trip.slug}`}>
      <div className="tdp2-more-cv2-img-wrap">
        {trip.image
          ? <img src={trip.image} alt={trip.title} className="tdp2-more-cv2-img" loading="lazy" />
          : <div className="tdp2-more-cv2-img" style={{ background: "#efefef" }} />
        }
        <button
          className="tdp2-more-cv2-wish"
          type="button"
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          onClick={e => { e.preventDefault(); setWishlisted(w => !w); }}
        >
          <HeartIcon filled={wishlisted} />
        </button>
      </div>
      <div className="tdp2-more-cv2-info">
        <p className="tdp2-more-cv2-title">{trip.title}</p>
        {dur && (
          <div className="tdp2-more-cv2-dur"><CalendarIcon /><span>{dur}</span></div>
        )}
        {batches && <p className="tdp2-more-cv2-batches">{batches}</p>}
        <p className="tdp2-more-cv2-price">&#8377;{formatPrice(trip.startingPrice)}/-</p>
        <p className="tdp2-more-cv2-per">Onwards per person</p>
      </div>
    </a>
  );
}

export function TripCardShimmer() {
  return (
    <div className="tdp2-more-card-v2">
      <div className="tdp2-more-cv2-img-wrap up-shimmer-block" />
      <div className="tdp2-more-cv2-info">
        <div className="up-shimmer-line" style={{ width: "90%", height: 13 }} />
        <div className="up-shimmer-line" style={{ width: "60%" }} />
        <div className="up-shimmer-line" style={{ width: "75%" }} />
        <div className="up-shimmer-line" style={{ width: "50%", height: 16, marginTop: 2 }} />
      </div>
    </div>
  );
}

export interface ViewMoreCardProps {
  a: string;
  b: string;
  /** Destination to navigate to (defaults to the listing page). */
  to?: string;
}

export function ViewMoreCard({ a, b, to = "/search" }: ViewMoreCardProps) {
  const navigate = useNavigate();
  return (
    <button className="tdp2-more-vm-card" type="button" onClick={() => navigate(to)}>
      <div className="tdp2-more-vm-imgs">
        <span className="tdp2-more-vm-img tdp2-more-vm-back">
          <img src={b || "/figma/trips/trip-2.jpg"} alt="" aria-hidden loading="lazy" />
        </span>
        <span className="tdp2-more-vm-img tdp2-more-vm-front">
          <img src={a || "/figma/trips/trip-1.jpg"} alt="" aria-hidden loading="lazy" />
        </span>
      </div>
      <p className="tdp2-more-vm-label">View More Trips</p>
    </button>
  );
}
