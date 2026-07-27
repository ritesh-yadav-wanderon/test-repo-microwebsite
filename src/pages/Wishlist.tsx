import { useNavigate } from "react-router-dom";
import { useWishlist, type WishlistTrip } from "../context/WishlistContext";
import { useCompare } from "../context/CompareContext";
import { useIsDesktop } from "../hooks/useIsDesktop";
import DesktopWishlist from "../components/desktop/DesktopWishlist";
import "./Wishlist.css";

const W = "/figma/wishlist/";

function priceDisplay(raw: string): string {
  const num = Number(String(raw).replace(/[^\d]/g, ""));
  return num ? num.toLocaleString("en-IN") : String(raw);
}

/** Mobile wishlist trip card (Figma 5621:14864). */
function WishCard({ trip }: { trip: WishlistTrip }) {
  const navigate = useNavigate();
  const { remove } = useWishlist();
  const { isInCompare, toggle: toggleCompare } = useCompare();
  const inCompare = isInCompare(trip.slug);

  return (
    <article className="wlp-card" onClick={() => navigate(`/trip/${trip.slug}`)}>
      <div className="wlp-card-img">
        <img src={trip.image} alt={trip.title} loading="lazy" />
        <div className="wlp-card-overlays">
          <button
            className="wlp-card-heart"
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
            className={`wlp-card-compare${inCompare ? " wlp-card-compare--active" : ""}`}
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
      <div className="wlp-card-body">
        <p className="wlp-card-title">{trip.title}</p>
        <div className="wlp-card-dur">
          <img src={`${W}calendar-clock.svg`} alt="" width={12} height={12} aria-hidden />
          <span>{trip.duration ?? "7N/8D"}</span>
        </div>
        <div className="wlp-card-price-block">
          <span className="wlp-card-price">₹{priceDisplay(trip.price)}/-</span>
          <span className="wlp-card-price-sub">Onwards per person</span>
        </div>
      </div>
    </article>
  );
}

/** Wishlist page — mobile layout (Figma 5621:14864); desktop renders
 *  DesktopWishlist (Figma 6487:26792). */
export default function Wishlist() {
  const navigate = useNavigate();
  const { items } = useWishlist();
  const isDesktop = useIsDesktop();

  if (isDesktop) return <DesktopWishlist />;

  return (
    <div className="wlp">
      <header className="wlp-header">
        <button className="wlp-back" type="button" aria-label="Go back" onClick={() => navigate(-1)}>
          <img src="/figma/compare/arrow-back.svg" alt="" width={24} height={24} />
        </button>
        <span className="wlp-header-title">Wishlist</span>
      </header>

      {items.length === 0 ? (
        <div className="wlp-empty">
          <p className="wlp-empty-title">No trips in your wishlist yet</p>
          <p className="wlp-empty-sub">Tap the heart on any trip card to save it here.</p>
          <button className="wlp-empty-cta" type="button" onClick={() => navigate("/search")}>
            Explore trips
          </button>
        </div>
      ) : (
        <div className="wlp-grid">
          {items.map((trip) => (
            <WishCard key={trip.slug} trip={trip} />
          ))}
        </div>
      )}
    </div>
  );
}
