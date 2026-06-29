import { NavLink } from "react-router-dom";
import homeIcon from "../../assets/bottom-nav/home.svg";
import compareIcon from "../../assets/bottom-nav/compare.svg";
import findTripIcon from "../../assets/bottom-nav/find-a-trip.svg";
import eventsIcon from "../../assets/bottom-nav/events.svg";
import phoneCallbackIcon from "../../assets/bottom-nav/phone-callback.svg";
import whatsappIcon from "../../assets/bottom-nav/whatsapp.svg";
import "./BottomNav.css";

const NAV_ITEMS = [
  { label: "Home",        icon: homeIcon,     size: 16, to: "/"        },
  { label: "Compare",     icon: compareIcon,  size: 16, to: "/compare" },
  { label: "Find a Trip", icon: findTripIcon, size: 16, to: "/search"  },
  { label: "Events",      icon: eventsIcon,   size: 20, to: "/events"  },
] as const;

export default function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Primary">
      {/* Left pill */}
      <div className="bn-main">
        <div className="bn-main-bg" aria-hidden />
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              `bn-item${isActive ? " bn-item--active" : ""}`
            }
            aria-label={item.label}
          >
            <span className="bn-ico" aria-hidden>
              <img src={item.icon} width={item.size} height={item.size} alt="" />
            </span>
            <span className="bn-label">{item.label}</span>
          </NavLink>
        ))}
      </div>

      {/* Right pill — call + WhatsApp */}
      <div className="bn-actions">
        <div className="bn-actions-bg" aria-hidden />
        <a
          className="bn-call"
          href="tel:+919319939306"
          aria-label="Call us"
        >
          <img src={phoneCallbackIcon} width={16} height={16} alt="" aria-hidden />
        </a>
        <a
          className="bn-whatsapp"
          href="https://wa.me/919319939306"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp"
        >
          <img src={whatsappIcon} width={36} height={36} alt="" aria-hidden />
        </a>
      </div>
    </nav>
  );
}
