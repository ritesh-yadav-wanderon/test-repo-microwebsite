import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCompare } from "../../context/CompareContext";
import "./BottomNav.css";

interface BottomNavProps {
  /** "dark" renders the dark pill used on the Events page (Figma 4601:5455). */
  variant?: "light" | "dark";
}

const WHATSAPP_URL =
  "https://api.whatsapp.com/send?phone=918130288566&text=Hi+WanderOn%2C+I+have+a+query%21";

export default function BottomNav({ variant = "light" }: BottomNavProps) {
  const { isLoggedIn, authReady } = useAuth();
  const { count: compareCount } = useCompare();
  const navigate = useNavigate();
  const location = useLocation();
  const dark = variant === "dark";
  const P = dark ? "/figma/nav2/events/" : "/figma/nav2/";

  function handleAccount() {
    // Wait until auth status is verified so the login sheet never flashes.
    if (!authReady) return;
    if (isLoggedIn) {
      navigate("/profile");
    } else {
      window.dispatchEvent(
        new CustomEvent("wanderon:open-login", { detail: { redirectTo: "/profile" } })
      );
    }
  }

  return (
    <nav className={`bottom-nav${dark ? " bottom-nav--dark" : ""}`} aria-label="Primary">
      <div className={`bn-pill${dark ? " bn-pill--dark" : ""}`}>

        {/* First tab — Trips (dark/Events page) or Events (default) */}
        {dark ? (
          <NavLink
            to="/"
            end
            className={({ isActive }) => `bn-item${isActive ? " bn-item--active" : ""}`}
            aria-label="Trips"
          >
            <span className="bn-ico">
              <img src={`${P}trips.svg`} width={20} height={20} alt="" aria-hidden loading="eager" fetchPriority="high" />
            </span>
            <span className="bn-label">Trips</span>
          </NavLink>
        ) : (
          <NavLink
            to="/events"
            className={({ isActive }) => `bn-item${isActive ? " bn-item--active" : ""}`}
            aria-label="Events"
          >
            <span className="bn-ico">
              <img src={`${P}icon-events.svg`} width={20} height={20} alt="" aria-hidden loading="eager" fetchPriority="high" />
            </span>
            <span className="bn-label">Events</span>
          </NavLink>
        )}

        {/* Compare (Figma 5396:14828) */}
        <NavLink
          to="/compare"
          className={({ isActive }) => `bn-item${isActive ? " bn-item--active" : ""}`}
          aria-label="Compare"
        >
          <span className="bn-ico">
            <img src={`${P}${dark ? "compare.svg" : "icon-compare.svg"}`} width={20} height={20} alt="" aria-hidden loading="eager" fetchPriority="high" />
          </span>
          <span className="bn-label">Compare</span>
          {compareCount > 0 && (
            <span className="bn-badge" aria-label={`${compareCount} items`}>{compareCount}</span>
          )}
        </NavLink>

        {/* Logo — home */}
        <NavLink
          to="/"
          end
          className={({ isActive }) => `bn-item bn-item--logo${isActive ? " bn-item--active" : ""}`}
          aria-label="Home"
        >
          <span className="bn-ico bn-ico--logo">
            <img src={`${P}logo.png`} width={40} height={40} alt="WanderOn" loading="eager" fetchPriority="high" />
          </span>
        </NavLink>

        {/* Account — gated */}
        <button
          type="button"
          className={`bn-item${isLoggedIn && location.pathname === "/profile" ? " bn-item--active" : ""}`}
          aria-label="Account"
          onClick={handleAccount}
        >
          <span className="bn-ico">
            <img src={`${P}${dark ? "account.svg" : "icon-account.svg"}`} width={20} height={20} alt="" aria-hidden loading="eager" fetchPriority="high" />
          </span>
          <span className="bn-label">Account</span>
        </button>

        {/* Chat — opens WhatsApp */}
        <button
          type="button"
          className="bn-item"
          aria-label="Chat on WhatsApp"
          onClick={() => window.open(WHATSAPP_URL, "_blank", "noopener,noreferrer")}
        >
          <span className="bn-ico">
            <img src={`${P}${dark ? "chat.svg" : "icon-chat.svg"}`} width={20} height={20} alt="" aria-hidden loading="eager" fetchPriority="high" />
          </span>
          <span className="bn-label">Chat</span>
        </button>

      </div>
    </nav>
  );
}
