import DesktopSearch from "./DesktopSearch";
import "./DesktopHero.css";

const BASE = "/figma/desktop";

/** Desktop hero (Figma 3497:15873). The tagline, WANDER TOGETHER! headline and
 *  riders are a single baked artwork in the design (text interleaves behind the
 *  people), so it ships as one image; the rating strip and search bar are live. */
export default function DesktopHero() {
  return (
    <section className="dhero">
      <img
        className="dhero__art"
        src={`${BASE}/hero-art-v2.png`}
        alt="Built for the ones who wander together — travellers on a misty forest road"
      />
      <div className="dhero__rating">
        <img className="dhero__rating-google" src={`${BASE}/google-g.svg`} alt="Google" />
        <img className="dhero__laurel" src="/figma/reviews/laurel.png" alt="" />
        <span className="dhero__rating-score">4.9</span>
        <img className="dhero__laurel dhero__laurel--flip" src="/figma/reviews/laurel.png" alt="" />
        <span className="dhero__rating-count">from 14,921 Reviews</span>
      </div>
      <div className="dhero__search-slot">
        <DesktopSearch />
      </div>
    </section>
  );
}
