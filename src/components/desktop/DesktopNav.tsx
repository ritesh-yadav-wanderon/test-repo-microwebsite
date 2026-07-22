import { useNavigate } from "react-router-dom";
import "./DesktopNav.css";

const BASE = "/figma/desktop";

/** Sticky top navigation overlaid on the desktop hero (Figma 5195:26835). */
export default function DesktopNav() {
  const navigate = useNavigate();

  return (
    <div className="dnav">
      <button className="dnav__logo" onClick={() => navigate("/")} aria-label="WanderOn home">
        <img src={`${BASE}/nav-logo.png`} alt="WanderOn" />
      </button>
      <div className="dnav__right">
        <button
          className="dnav__destinations"
          onClick={() =>
            document.querySelector(".ddest")?.scrollIntoView({ behavior: "smooth" })
          }
        >
          Destinations
          <img src={`${BASE}/nav-chevron.svg`} alt="" className="dnav__chevron" />
        </button>
        <button className="dnav__events" onClick={() => navigate("/events")}>
          <img src={`${BASE}/nav-mask.svg`} alt="" className="dnav__mask" />
          Try Events
        </button>
        <button className="dnav__profile" onClick={() => navigate("/profile")} aria-label="Profile">
          <img src={`${BASE}/nav-profile.svg`} alt="" />
        </button>
        <button className="dnav__burger" aria-label="Menu">
          <img src={`${BASE}/nav-burger.svg`} alt="" />
        </button>
      </div>
    </div>
  );
}
