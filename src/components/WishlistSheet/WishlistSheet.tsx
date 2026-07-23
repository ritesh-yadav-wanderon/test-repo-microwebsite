import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import "./WishlistSheet.css";

interface WishlistTrip {
  slug: string;
  title: string;
  image: string;
  nights: number;
  days: number;
  batches: string[];
  price: string;
}

const WISHLIST_TRIPS: WishlistTrip[] = [
  {
    slug: "europe-15d-paris-budapest",
    title: "15-Day Europe Group Trip 2026: Paris to Budapest",
    image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=600&q=80&auto=format&fit=crop",
    nights: 14,
    days: 15,
    batches: ["2026-07-09", "2026-07-12", "2026-07-18", "2026-07-22", "2026-08-06", "2026-08-12", "2026-08-18", "2026-08-22", "2026-09-06", "2026-09-12", "2026-09-18", "2026-09-22"],
    price: "62,999",
  },
  {
    slug: "europe-12d-paris-vienna-women",
    title: "12 Days Europe Group Tour: Paris to Vienna (Women Only)",
    image: "https://images.unsplash.com/photo-1541417904950-b855846fe074?w=600&q=80&auto=format&fit=crop",
    nights: 11,
    days: 12,
    batches: ["2026-07-06", "2026-07-22", "2026-08-18", "2026-09-06", "2026-09-22", "2026-10-12"],
    price: "58,999",
  },
  {
    slug: "europe-18d-grand-tour",
    title: "18-Day Grand Europe Tour 2026",
    image: "https://images.unsplash.com/photo-1520939817895-060bdaf4fe1b?w=600&q=80&auto=format&fit=crop",
    nights: 17,
    days: 18,
    batches: ["2026-07-18", "2026-08-06", "2026-08-22", "2026-09-18", "2026-10-06"],
    price: "74,999",
  },
  {
    slug: "europe-8d-paris-amsterdam",
    title: "8-Day Europe Trip: Paris & Amsterdam Explorer",
    image: "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=600&q=80&auto=format&fit=crop",
    nights: 7,
    days: 8,
    batches: ["2026-09-22", "2026-10-06", "2026-10-18", "2026-11-06"],
    price: "44,999",
  },
];

function monthKey(iso: string) { return iso.slice(0, 7); }

function monthLabel(key: string) {
  const [y, m] = key.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("en-GB", { month: "short" }) + "-" + String(y).slice(2);
}

function fmtBatch(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="18" height="16" viewBox="0 0 24 22" fill={filled ? "#ff4d6d" : "none"} stroke="#fff" strokeWidth="2">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  );
}

function WishCard({ trip, inCompare, onToggleCompare, onNavigate }: {
  trip: WishlistTrip;
  inCompare: boolean;
  onToggleCompare: () => void;
  onNavigate: () => void;
}) {
  const [wishlisted, setWishlisted] = useState(true);

  const visibleBatches = trip.batches.slice(0, 2);
  const extraBatches = trip.batches.length - 2;
  const batchText = visibleBatches.map(fmtBatch).join(", ");

  return (
    <Link className="wl-card" to={`/trip/${trip.slug}`} onClick={onNavigate}>
      {/* Square image */}
      <div className="wl-card-img-wrap">
        <img className="wl-card-img" src={trip.image} alt={trip.title} loading="lazy" />
        {/* Overlays — top right */}
        <div className="wl-card-overlays">
          <button
            className="wl-card-heart"
            type="button"
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            onClick={(e) => { e.preventDefault(); setWishlisted((v) => !v); }}
          >
            <HeartIcon filled={wishlisted} />
          </button>
          <button
            className={`wl-card-compare-pill${inCompare ? " wl-card-compare-pill--active" : ""}`}
            type="button"
            onClick={(e) => { e.preventDefault(); onToggleCompare(); }}
          >
            <img src="/figma/nav/compare-mask.svg" width={14} height={14} alt="" aria-hidden loading="lazy" />
            <span>{inCompare ? "Comparing" : "Add to Compare"}</span>
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="wl-card-info">
        <p className="wl-card-title">{trip.title}</p>
        <div className="wl-card-meta-col">
          <div className="wl-card-duration-row">
            <img src="/figma/listing/calendar-month.svg" width={12} height={12} alt="" aria-hidden loading="lazy" />
            <span className="wl-card-duration">{trip.nights}N/{trip.days}D</span>
          </div>
          <p className="wl-card-batches">
            {batchText},{" "}
            <span className="wl-card-batches-more">+{extraBatches} More Batches</span>
          </p>
        </div>
        <div className="wl-card-price-block">
          <span className="wl-card-price">₹{trip.price}/-</span>
          <span className="wl-card-price-sub">Onwards per person</span>
        </div>
      </div>
    </Link>
  );
}

interface WishlistSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WishlistSheet({ isOpen, onClose }: WishlistSheetProps) {
  const [hasOpened, setHasOpened] = useState(false);
  useEffect(() => { if (isOpen) setHasOpened(true); }, [isOpen]);
  if (!hasOpened) return null;
  const months = useMemo(() => {
    const seen = new Set<string>();
    const result: string[] = [];
    WISHLIST_TRIPS.forEach((t) => {
      t.batches.forEach((b) => {
        const k = monthKey(b);
        if (!seen.has(k)) { seen.add(k); result.push(k); }
      });
    });
    return result;
  }, []);

  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [compareSet, setCompareSet] = useState<Set<string>>(new Set());

  const activeMonth = selectedMonth || months[0] || "";

  const filteredTrips = useMemo(
    () => WISHLIST_TRIPS.filter((t) => t.batches.some((b) => monthKey(b) === activeMonth)),
    [activeMonth]
  );

  function toggleCompare(slug: string) {
    setCompareSet((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug); else next.add(slug);
      return next;
    });
  }

  return (
    <div
      className={`wl-overlay${isOpen ? " wl-overlay--open" : ""}`}
      aria-hidden={!isOpen}
    >
      <div
        className={`wl-sheet${isOpen ? " wl-sheet--open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Wishlist"
      >
        {/* Header */}
        <div className="wl-header">
          <div className="wl-header-left">
            <button className="wl-back" type="button" aria-label="Close" onClick={onClose}>
              <img src="/figma/listing/back-arrow.svg" width={24} height={24} alt="" aria-hidden loading="lazy" />
            </button>
            <span className="wl-title">Wishlist</span>
          </div>
          <button className="wl-close" type="button" aria-label="Close" onClick={onClose}>
            <img src="/figma/listing/close-icon.svg" width={30} height={30} alt="" aria-hidden loading="lazy" />
          </button>
        </div>

        {/* Month tabs */}
        <div className="wl-months-wrap">
          <div className="wl-months">
            {months.map((m) => {
              const isActive = m === activeMonth;
              return (
                <button
                  key={m}
                  className={`wl-month-tab${isActive ? " wl-month-tab--active" : ""}`}
                  type="button"
                  onClick={() => setSelectedMonth(isActive ? "" : m)}
                >
                  <span>{monthLabel(m)}</span>
                  {isActive && (
                    <img
                      src="/figma/listing/close-icon.svg"
                      width={16} height={16}
                      alt="" aria-hidden
                      className="wl-month-x"
                    loading="lazy" />
                  )}
                </button>
              );
            })}
          </div>
          <div className="wl-months-line" aria-hidden />
        </div>

        {/* 2-column grid */}
        <div className="wl-grid">
          {filteredTrips.map((trip) => (
            <WishCard
              key={trip.slug}
              trip={trip}
              inCompare={compareSet.has(trip.slug)}
              onToggleCompare={() => toggleCompare(trip.slug)}
              onNavigate={onClose}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="wl-footer">
          <button className="wl-compare-btn" type="button">
            Compare Trips
          </button>
        </div>
      </div>
    </div>
  );
}
