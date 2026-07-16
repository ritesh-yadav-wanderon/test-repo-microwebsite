import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Profile.css";

const P = "/figma/profile/";

interface MenuItem {
  label: string;
  icon: string;
  onClick: () => void;
}

export default function Profile() {
  const { isLoggedIn, authReady, user, logout } = useAuth();
  const navigate = useNavigate();

  // Gate: once auth is verified, if not logged in, open login and go home.
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
  const displayName = name ?? `${countryCode} ${phone}`.trim();
  const initial = (name ?? "S").charAt(0).toUpperCase();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const group1: MenuItem[] = [
    { label: "My Profile", icon: `${P}v2-icon-profile.svg`, onClick: () => navigate("/my-profile") },
    { label: "My bookings", icon: `${P}v2-icon-bookings.svg`, onClick: () => navigate("/bookings") },
    { label: "Your feedback", icon: `${P}v2-icon-feedback.svg`, onClick: () => navigate("/feedback") },
  ];

  const group2: MenuItem[] = [
    { label: "Legal", icon: `${P}v2-icon-legal.svg`, onClick: () => navigate("/legal") },
    { label: "Log out", icon: `${P}v2-icon-logout.svg`, onClick: handleLogout },
  ];

  const renderRow = (item: MenuItem) => (
    <button key={item.label} type="button" className="prf-row" onClick={item.onClick}>
      <span className="prf-row-left">
        <img src={item.icon} width={20} height={20} alt="" aria-hidden loading="lazy" />
        <span className="prf-row-label">{item.label}</span>
      </span>
      <img className="prf-row-chevron" src={`${P}v2-icon-chevron.svg`} width={16} height={16} alt="" aria-hidden loading="lazy" />
    </button>
  );

  return (
    <div className="prf-page">
      {/* ── Header ── */}
      <header className="prf-header">
        <div className="prf-header-left">
          <button className="prf-header-back" type="button" onClick={() => navigate(-1)} aria-label="Go back">
            <img src={`${P}v2-icon-arrow-back.svg`} width={24} height={24} alt="" aria-hidden />
          </button>
          <span className="prf-header-title">Profile</span>
        </div>
        <button className="prf-header-bell" type="button" aria-label="Notifications">
          <img src={`${P}v2-icon-bell.svg`} width={36} height={36} alt="" aria-hidden />
        </button>
      </header>

      <div className="prf-content">
        {/* ── Greeting ── */}
        <div className="prf-greeting">
          <div className="prf-avatar">
            <span className="prf-avatar-initial">{initial}</span>
          </div>
          <p className="prf-name">Hi! {displayName}</p>
        </div>

        {/* ── Wallet + Coupons ── */}
        <div className="prf-stats">
          <div className="prf-stat">
            <div className="prf-stat-img">
              <img src={`${P}v2-wallet.png`} alt="" aria-hidden loading="lazy" />
            </div>
            <p className="prf-stat-value">&#8377;0</p>
            <p className="prf-stat-label">WanderOn wallet</p>
          </div>
          <div className="prf-stat">
            <div className="prf-stat-img">
              <img className="prf-stat-img--gift" src={`${P}v2-gift.png`} alt="" aria-hidden loading="lazy" />
            </div>
            <p className="prf-stat-value">2 new</p>
            <p className="prf-stat-label">Your coupons</p>
          </div>
        </div>

        {/* ── Menu + referral + support ── */}
        <div className="prf-main">
          <div className="prf-menu">
            <div className="prf-menu-group">{group1.map(renderRow)}</div>

            <div className="prf-menu-divider" aria-hidden>
              <img src={`${P}v2-divider.svg`} alt="" />
            </div>

            <div className="prf-menu-group">{group2.map(renderRow)}</div>

            {/* Referral banner */}
            <div className="prf-referral">
              <img src={`${P}v2-icon-refer.svg`} width={16} height={16} alt="" aria-hidden loading="lazy" />
              <p className="prf-referral-text">
                Get &#8377;500 OFF every time your invitee does their first booking.
              </p>
            </div>
          </div>

          {/* Support */}
          <button
            className="prf-support"
            type="button"
            onClick={() => window.dispatchEvent(new Event("wanderon:open-enquire"))}
          >
            Support
          </button>
        </div>
      </div>
    </div>
  );
}
