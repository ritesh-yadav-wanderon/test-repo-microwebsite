import "./DesktopHero.css";

const BASE = "/figma/desktop";

/** Desktop hero (Figma 3497:15873). The tagline, WANDER TOGETHER! headline and
 *  riders are a single baked artwork in the design (text interleaves behind the
 *  people), so it ships as one image; the rating strip and search bar are live. */
export default function DesktopHero() {
  const openSearch = () => window.dispatchEvent(new CustomEvent("wanderon:open-search"));

  return (
    <section className="dhero">
      <img
        className="dhero__art"
        src={`${BASE}/hero-art.jpg`}
        alt="Built for the ones who wander together — travellers on a misty forest road"
      />
      <div className="dhero__rating">
        <img className="dhero__rating-google" src={`${BASE}/google-g.svg`} alt="Google" />
        <img className="dhero__laurel" src={`${BASE}/laurel.png`} alt="" />
        <span className="dhero__rating-score">4.9</span>
        <img className="dhero__laurel dhero__laurel--flip" src={`${BASE}/laurel.png`} alt="" />
        <span className="dhero__rating-count">from 14,921 Reviews</span>
      </div>
      <div className="dhero__search" role="search">
        <button className="dhero__search-field" onClick={openSearch}>
          <img src={`${BASE}/icon-distance.svg`} alt="" className="dhero__search-pin" />
          <span>Where</span>
        </button>
        <span className="dhero__search-divider" />
        <button className="dhero__search-field" onClick={openSearch}>
          <img src={`${BASE}/icon-calendar.svg`} alt="" className="dhero__search-cal" />
          <span>When</span>
        </button>
        <button className="dhero__search-btn" onClick={openSearch} aria-label="Search trips">
          <img src={`${BASE}/icon-search.svg`} alt="" />
        </button>
      </div>
    </section>
  );
}
