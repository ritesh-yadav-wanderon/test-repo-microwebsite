import "./HeroSection.css";

interface Props {
  onSearchClick: () => void;
  activeCategory: number;
  onCategoryChange: (idx: number) => void;
}

const CATEGORIES = [
  "All Trips",
  "Adventure",
  "Luxury",
  "Culture",
  "Festival",
  "Wellness",
  "Weekend",
];

function GoogleIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 48 48" aria-hidden>
      <path fill="#4285F4" d="M45.52 24.56c0-1.56-.14-3.06-.4-4.5H24v8.51h12.09c-.52 2.76-2.1 5.1-4.47 6.67v5.54h7.24c4.24-3.9 6.66-9.65 6.66-16.22z"/>
      <path fill="#34A853" d="M24 46c6.09 0 11.2-2.02 14.93-5.47l-7.24-5.54C29.75 36.48 27.02 37.3 24 37.3c-5.88 0-10.86-3.97-12.64-9.31H3.88v5.72C7.6 41.38 15.27 46 24 46z"/>
      <path fill="#FBBC05" d="M11.36 27.99A13.27 13.27 0 0 1 10.7 24c0-1.38.24-2.72.66-3.99v-5.72H3.88A22.01 22.01 0 0 0 2 24c0 3.55.85 6.91 2.35 9.9l7.01-5.91z"/>
      <path fill="#EA4335" d="M24 10.7c3.32 0 6.3 1.14 8.65 3.38l6.48-6.48C35.17 3.95 30.07 2 24 2 15.27 2 7.6 6.62 3.88 14.29l7.48 5.72C13.14 14.67 18.12 10.7 24 10.7z"/>
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#666"/>
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zM7 11h5v5H7z" fill="#666"/>
    </svg>
  );
}

export default function HeroSection({ onSearchClick, activeCategory, onCategoryChange }: Props) {
  return (
    <section className="hero" aria-label="Home hero">
      {/* Background image — text baked into photo */}
      <img
        className="hero-bg-img"
        src="/figma/hero-bg-v2.png"
        alt="Built for the ones who wander together"
        fetchPriority="high"
      />

      {/* Bottom content stack */}
      <div className="hero-body">
        {/* Rating badge */}
        <div className="hero-rating" aria-label="4.9 rating from 14,921 Google reviews">
          <GoogleIcon />
          <div className="hero-rating-wreath">
            <img className="hero-laurel hero-laurel--l" src="/figma/hero/laurel.png" alt="" aria-hidden />
            <span className="hero-rating-score">4.9</span>
            <img className="hero-laurel hero-laurel--r" src="/figma/hero/laurel.png" alt="" aria-hidden />
          </div>
          <span className="hero-rating-label">from 14,921 Reviews</span>
        </div>

        {/* Search bar */}
        <button
          className="hero-search"
          type="button"
          aria-label="Open trip search"
          data-hero-search
          onClick={onSearchClick}
        >
          <div className="hero-search-pane">
            <LocationIcon />
            <span className="hero-search-placeholder">Where to</span>
          </div>
          <div className="hero-search-sep" aria-hidden />
          <div className="hero-search-pane">
            <CalendarIcon />
            <span className="hero-search-placeholder">Any date</span>
          </div>
          {/* Figma asset: node 4492:14943 */}
          <img
            className="hero-search-btn-img"
            src="/figma/search-btn.svg"
            alt=""
            aria-hidden
          />
        </button>

        {/* Category tabs */}
        <nav className="hero-cats" aria-label="Trip categories">
          {CATEGORIES.map((cat, i) => (
            <>
              {i > 0 && <span key={`sep-${i}`} className="hero-cat-sep" aria-hidden />}
              <button
                key={cat}
                className={`hero-cat${i === activeCategory ? " hero-cat--active" : ""}`}
                type="button"
                onClick={() => onCategoryChange(i)}
              >
                {cat}
              </button>
            </>
          ))}
          <span className="hero-cat-sep" aria-hidden />
          <button className="hero-cat hero-cat--see-all" type="button">
            See all<br />categories
          </button>
        </nav>
      </div>
    </section>
  );
}
