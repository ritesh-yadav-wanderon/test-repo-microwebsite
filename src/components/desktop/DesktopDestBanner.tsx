import { useNavigate } from "react-router-dom";
import "./DesktopDestBanner.css";

const BASE = "/figma/desktop";

/** "VISIT RAJASTHAN" popular-destination banner (Figma Component 205, 3394:11859). */
export default function DesktopDestBanner() {
  const navigate = useNavigate();

  return (
    <section className="dbanner">
      <div
        className="dbanner__inner"
        style={{ backgroundImage: `url(${BASE}/banner-camels.png)` }}
      >
        <div className="dbanner__card">
          <p className="dbanner__eyebrow">Popular Destinations</p>
          <h2 className="dbanner__title">VISIT RAJASTHAN</h2>
          <p className="dbanner__desc">
            This 6-day Rajasthan tour takes you through the iconic cities of
            Jaipur, Jodhpur, and Jaisalmer, giving you a glimpse into the royal
            heritage, vibrant culture, and natural beauty of the state
          </p>
          <button className="dbanner__cta" onClick={() => navigate("/destination/rajasthan")}>
            Explore
            <svg width="16" height="9" viewBox="0 0 16 9" fill="none">
              <path d="M0 4.5h14m0 0L10.5 1M14 4.5 10.5 8" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        <div className="dbanner__bars">
          <span className="dbanner__bar dbanner__bar--active" />
          <span className="dbanner__bar" />
          <span className="dbanner__bar" />
        </div>
      </div>
    </section>
  );
}
