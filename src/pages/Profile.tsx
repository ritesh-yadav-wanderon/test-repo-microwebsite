import { useEffect } from "react";
import FooterMessage from "../components/FooterMessage/FooterMessage";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Profile.css";

const P = "/figma/profile/";

const GROUP1 = [
  { label: "My Profile",    icon: `${P}icon-my-profile.svg`, size: 20, to: "/my-profile" },
  { label: "My bookings",   icon: `${P}icon-bookings.svg`,   size: 20, to: "/bookings" },
  { label: "Your feedback", icon: `${P}icon-feedback.svg`,   size: 16, to: "/feedback" },
];

const GROUP2 = [
  { label: "Legal", icon: `${P}icon-legal.svg`, size: 16, to: "/legal" },
];

export default function Profile() {
  const { isLoggedIn, authReady, user, logout } = useAuth();
  const navigate = useNavigate();

  // Gate: once auth is verified, if not logged in, open login sheet and go back
  useEffect(() => {
    if (!authReady) return;
    if (!isLoggedIn) {
      window.dispatchEvent(
        new CustomEvent("wanderon:open-login", { detail: { redirectTo: "/profile" } })
      );
      navigate("/", { replace: true });
    }
  }, [authReady, isLoggedIn, navigate]);

  if (!authReady || !isLoggedIn) return null;

  const phone = user?.phone ?? "";
  const countryCode = user?.countryCode ?? "+91";
  const name = user?.name;
  const initial = name ? name.charAt(0).toUpperCase() : null;

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <div className="prf-page">
      <header className="prf-header">
        <div className="prf-header-left">
          <button className="prf-header-back" type="button" onClick={() => navigate(-1)} aria-label="Go back">
            <img src={`${P}icon-arrow-back.svg`} width={24} height={24} alt="" aria-hidden />
          </button>
          <span className="prf-header-title">Profile</span>
        </div>
        <button className="prf-header-bell" type="button" aria-label="Notifications">
          <img src={`${P}icon-bell.svg`} width={36} height={36} alt="" aria-hidden />
        </button>
      </header>

      <div className="prf-content">

        {/* Avatar + name/phone */}
        <div className="prf-user-section">
          <div className="prf-avatar">
            {initial ? (
              <span className="prf-avatar-initial">{initial}</span>
            ) : (
              <img src={`${P}icon-my-profile.svg`} width={28} height={28} alt="" aria-hidden className="prf-avatar-icon" />
            )}
          </div>
          <p className="prf-name">
            <span className="prf-name-hi">Hi! </span>
            <span className="prf-name-user">{name ?? `${countryCode} ${phone}`}</span>
          </p>
        </div>

        {/* Wallet + Coupons */}
        <div className="prf-stats">
          <div className="prf-stat-card">
            <div className="prf-stat-img-wrap">
              <img src={`${P}icon-wallet.png`} className="prf-wallet-img" alt="" aria-hidden loading="lazy" />
            </div>
            <p className="prf-stat-value">₹0</p>
            <p className="prf-stat-label">WanderOn wallet</p>
          </div>
          <div className="prf-stat-card">
            <div className="prf-stat-img-wrap">
              <img src={`${P}icon-coupon.png`} className="prf-coupon-img" alt="" aria-hidden loading="lazy" />
            </div>
            <p className="prf-stat-value">2 new</p>
            <p className="prf-stat-label">Your coupons</p>
          </div>
        </div>

        {/* Menu + referral + support */}
        <div className="prf-main-section">
          <div className="prf-menu-section">

            {/* Group 1 */}
            <div className="prf-menu-group">
              {GROUP1.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  className="prf-menu-row"
                  onClick={() => navigate(item.to)}
                >
                  <div className="prf-menu-left">
                    <img src={item.icon} width={item.size} height={item.size} alt="" aria-hidden className="prf-menu-icon" loading="lazy" />
                    <span className="prf-menu-label">{item.label}</span>
                  </div>
                  <img src={`${P}icon-arrow.svg`} width={16} height={16} alt="" aria-hidden loading="lazy" />
                </button>
              ))}
            </div>

            <div className="prf-divider" aria-hidden>
              <img src={`${P}divider.svg`} className="prf-divider-img" alt="" loading="lazy" />
            </div>

            {/* Group 2 */}
            <div className="prf-menu-group">
              {GROUP2.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  className="prf-menu-row"
                  onClick={() => navigate(item.to)}
                >
                  <div className="prf-menu-left">
                    <img src={item.icon} width={item.size} height={item.size} alt="" aria-hidden className="prf-menu-icon" loading="lazy" />
                    <span className="prf-menu-label">{item.label}</span>
                  </div>
                  <img src={`${P}icon-arrow.svg`} width={16} height={16} alt="" aria-hidden loading="lazy" />
                </button>
              ))}
              {/* Log out */}
              <button type="button" className="prf-menu-row" onClick={handleLogout}>
                <div className="prf-menu-left">
                  <img src={`${P}icon-logout.svg`} width={16} height={16} alt="" aria-hidden className="prf-menu-icon" loading="lazy" />
                  <span className="prf-menu-label">Log out</span>
                </div>
                <img src={`${P}icon-arrow.svg`} width={16} height={16} alt="" aria-hidden loading="lazy" />
              </button>
            </div>

            {/* Referral banner */}
            <div className="prf-referral">
              <img src={`${P}icon-refer.svg`} width={16} height={16} alt="" aria-hidden className="prf-referral-icon" loading="lazy" />
              <p className="prf-referral-text">
                Get ₹500 OFF every time your invitee does their first booking.
              </p>
            </div>

          </div>

          {/* Support card */}
          <div className="prf-support-card">
            <span className="prf-support-label">Support</span>
          </div>

        </div>
      </div>
      <FooterMessage />
    </div>
  );
}
