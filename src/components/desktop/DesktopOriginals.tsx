import { useNavigate } from "react-router-dom";
import "./DesktopOriginals.css";

const BASE = "/figma/desktop";

/** "We don't do surface level" originals banner (Figma 5154:26012 / 2914:8636). */
export default function DesktopOriginals() {
  const navigate = useNavigate();

  return (
    <section className="dorig">
      <div className="dorig__card" onClick={() => navigate("/search")} role="button" tabIndex={0}>
        <div className="dorig__climber">
          <img src={`${BASE}/originals-climber.png`} alt="" loading="lazy" />
        </div>
        <div className="dorig__mountain">
          <img src={`${BASE}/originals-mountain.png`} alt="" loading="lazy" />
        </div>
        <img className="dorig__birds" src={`${BASE}/originals-birds.png`} alt="" loading="lazy" />
        <img className="dorig__flags" src={`${BASE}/originals-flags.png`} alt="" loading="lazy" />
        <div className="dorig__copy">
          <h2 className="dorig__title">We don't do surface level</h2>
          <p className="dorig__desc">
            A slow sail through the Andamans private chef, hidden coves, and
            long dinners that don't check the time.
          </p>
          <span className="dorig__cta">Explore</span>
        </div>
      </div>
    </section>
  );
}
