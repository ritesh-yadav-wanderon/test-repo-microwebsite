import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./BottomNav.css";

const P = "/figma/nav2/";

export default function BottomNav() {
  const { isLoggedIn, authReady } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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
    <nav className="bottom-nav" aria-label="Primary">
      <div className="bn-pill">

        {/* Events */}
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

        {/* Compare */}
        <NavLink
          to="/compare"
          className={({ isActive }) => `bn-item${isActive ? " bn-item--active" : ""}`}
          aria-label="Compare"
        >
          <span className="bn-ico">
            <img src={`${P}icon-compare.svg`} width={20} height={20} alt="" aria-hidden loading="eager" fetchPriority="high" />
          </span>
          <span className="bn-label">Compare</span>
          <span className="bn-badge" aria-label="2 items">2</span>
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
            <img src={`${P}icon-account.svg`} width={20} height={20} alt="" aria-hidden loading="eager" fetchPriority="high" />
          </span>
          <span className="bn-label">Account</span>
        </button>

        {/* Chat */}
        <button type="button" className="bn-item" aria-label="Chat">
          <span className="bn-ico">
            <img src={`${P}icon-chat.svg`} width={20} height={20} alt="" aria-hidden loading="eager" fetchPriority="high" />
          </span>
          <span className="bn-label">Chat</span>
        </button>

      </div>
    </nav>
  );
}
