import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ProfileWatermark from "./ProfileWatermark";
import { getLastMainPage } from "../../utils/lastMainPage";
import "./DesktopProfile.css";

const DP = "/figma/desktop-profile/";
const MP = "/figma/my-profile/";
const P = "/figma/profile/";

const INIT = {
  firstName: "Shivam",
  middleName: "",
  lastName: "Trivedi",
  gender: "Male",
  dob: "",
  mealPreferences: "",
  whatsapp: "9401269681",
  altPhone: "",
  email: "shivam.trivedi@wanderon.in",
  address1: "Building No. - 436",
  address2: "Phase- 4, Sector- 18",
  country: "India",
  pinCode: "122017",
  city: "Gurugram",
  state: "Haryana",
};

interface MenuItem {
  label: string;
  icon: string;
  onClick?: () => void;
}

/** Header shared by the desktop account pages. Back steps up to /profile
 *  (or exits from /profile itself); the cross always returns to the last
 *  visited main-site page (home / listing / destination / trip details). */
export function ProfileHeader() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const exit = () => navigate(getLastMainPage());
  const back = () => (pathname === "/profile" ? exit() : navigate("/profile"));

  return (
    <header className="dpr-header">
      <button className="dpr-header-back" type="button" aria-label="Back" onClick={back}>
        <img src={`${P}v2-icon-arrow-back.svg`} width={24} height={24} alt="" aria-hidden />
      </button>
      <span className="dpr-header-title">Profile</span>
      <button
        className="dpr-header-close"
        type="button"
        aria-label="Back to website"
        onClick={exit}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M6 6l12 12M18 6 6 18" stroke="#3d3d3d" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </button>
    </header>
  );
}

/** Left rail (avatar + menu + referral tag + logout) shared by the desktop
 *  Profile and My Bookings pages — Figma 3996:11227 / 3996:12266. */
export function ProfileRail() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Warm the allied account-page chunks so rail navigation renders instantly
  // instead of suspending into the loading skeleton.
  useEffect(() => {
    import("../../pages/Profile");
    import("../../pages/MyProfile");
    import("../../pages/MyBookings");
    import("../../pages/MyBooking");
    import("../../pages/Support");
  }, []);

  const name = user?.name ?? "Shivam Trivedi";
  const initial = name.charAt(0).toUpperCase();

  const menu: MenuItem[] = [
    { label: "My Profile", icon: `${DP}icon-profile.svg`, onClick: () => navigate("/my-profile") },
    { label: "My bookings", icon: `${DP}icon-bookings.svg`, onClick: () => navigate("/bookings") },
    { label: "Your feedback", icon: `${DP}icon-feedback.svg`, onClick: () => navigate("/feedback") },
    { label: "Payments", icon: `${DP}icon-payments.svg` },
    { label: "Referrals", icon: `${DP}icon-referrals.svg` },
    { label: "Add Friends & Family", icon: `${DP}icon-friends.svg` },
    { label: "Notifications", icon: `${DP}icon-notifications.svg` },
    { label: "My Preferences", icon: `${DP}icon-preferences.svg` },
    {
      label: "Help  & Support",
      icon: `${DP}icon-help.svg`,
      onClick: () => navigate("/support"),
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <aside className="dpr-rail">
      <div className="dpr-user">
        <div className="dpr-avatar">
          <span>{initial}</span>
        </div>
        <p className="dpr-name">Hi! {name}</p>
      </div>

      <nav className="dpr-menu">
        {menu.map((item) => (
          <button
            key={item.label}
            type="button"
            className="dpr-menu-row"
            onClick={item.onClick}
          >
            <span className="dpr-menu-left">
              <img src={item.icon} width={20} height={20} alt="" aria-hidden loading="lazy" />
              <span className="dpr-menu-label">{item.label}</span>
            </span>
            <img
              className="dpr-menu-chevron"
              src={`${P}v2-icon-chevron.svg`}
              width={16}
              height={16}
              alt=""
              aria-hidden
            />
          </button>
        ))}
      </nav>

      <div className="dpr-referral">
        <img src={`${DP}icon-refer.svg`} width={16} height={16} alt="" aria-hidden />
        <p>Get &#8377;500 OFF every time your invitee does their first booking.</p>
      </div>

      <button className="dpr-logout" type="button" onClick={handleLogout}>
        Log Out
      </button>
    </aside>
  );
}

/** Desktop Profile ("Account") page — Figma 3996:11227. Combines the mobile
 *  profile menu and the personal-information form into a two-column layout. */
export default function DesktopProfile() {
  const [form, setForm] = useState(INIT);

  const set = (key: keyof typeof INIT) => (v: string) =>
    setForm((f) => ({ ...f, [key]: v }));

  return (
    <div className="dpr">
      <ProfileHeader />

      <div className="dpr-body">
        <ProfileRail />

        {/* ── Personal information ─────────────────────────── */}
        <div className="dpr-main">
          <section className="dpr-card">
            <div className="dpr-card-head">
              <img src={`${DP}icon-person.svg`} width={20} height={20} alt="" aria-hidden />
              <span>Personal Information</span>
            </div>

            <div className="dpr-form">
              <div className="dpr-row">
                <div className="dpr-field">
                  <input
                    id="dpr-fn"
                    className="dpr-input"
                    placeholder=" "
                    value={form.firstName}
                    onChange={(e) => set("firstName")(e.target.value)}
                  />
                  <label htmlFor="dpr-fn" className="dpr-flabel">First Name*</label>
                </div>
                <div className="dpr-field">
                  <input
                    id="dpr-mn"
                    className="dpr-input"
                    placeholder=" "
                    value={form.middleName}
                    onChange={(e) => set("middleName")(e.target.value)}
                  />
                  <label htmlFor="dpr-mn" className="dpr-flabel">Middle Name</label>
                </div>
              </div>

              <div className="dpr-field">
                <input
                  id="dpr-ln"
                  className="dpr-input"
                  placeholder=" "
                  value={form.lastName}
                  onChange={(e) => set("lastName")(e.target.value)}
                />
                <label htmlFor="dpr-ln" className="dpr-flabel">Last Name</label>
              </div>

              <div className="dpr-row">
                <div className="dpr-field">
                  <select
                    id="dpr-gender"
                    className={`dpr-input dpr-select${form.gender ? "" : " dpr-select--empty"}`}
                    value={form.gender}
                    onChange={(e) => set("gender")(e.target.value)}
                  >
                    <option value="" disabled hidden></option>
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                  <label htmlFor="dpr-gender" className="dpr-flabel">Gender*</label>
                  <span className="dpr-field-icon" aria-hidden>
                    <img src={`${MP}icon-dropdown.svg`} width={24} height={24} alt="" />
                  </span>
                </div>
                <div className="dpr-field dpr-field--float">
                  <input
                    id="dpr-dob"
                    className="dpr-input"
                    placeholder="DD-MM-YYYY"
                    value={form.dob}
                    onChange={(e) => set("dob")(e.target.value)}
                  />
                  <label htmlFor="dpr-dob" className="dpr-flabel">Date Of Birth*</label>
                  <span className="dpr-field-icon" aria-hidden>
                    <img src={`${MP}icon-calendar.svg`} width={16} height={16} alt="" />
                  </span>
                </div>
              </div>

              <div className="dpr-field dpr-field--float">
                <input
                  id="dpr-meal"
                  className="dpr-input"
                  placeholder=" "
                  value={form.mealPreferences}
                  onChange={(e) => set("mealPreferences")(e.target.value)}
                />
                <label htmlFor="dpr-meal" className="dpr-flabel">Meal Preferences</label>
              </div>

              <div className="dpr-phone">
                <button className="dpr-phone-code" type="button">
                  <span>IN +91</span>
                  <img src={`${MP}icon-chevron.svg`} width={8} height={6} alt="" aria-hidden />
                </button>
                <div className="dpr-field dpr-field--grow">
                  <input
                    id="dpr-whatsapp"
                    className="dpr-input dpr-input--trail2"
                    placeholder=" "
                    inputMode="tel"
                    value={form.whatsapp}
                    onChange={(e) => set("whatsapp")(e.target.value)}
                  />
                  <label htmlFor="dpr-whatsapp" className="dpr-flabel">WhatsApp Number*</label>
                  <span className="dpr-field-icon" aria-hidden>
                    <img src={`${MP}icon-verified.svg`} width={16} height={16} alt="" />
                    <img src={`${MP}icon-dropdown.svg`} width={24} height={24} alt="" />
                  </span>
                </div>
              </div>

              <div className="dpr-phone">
                <button className="dpr-phone-code" type="button">
                  <span>IN +91</span>
                  <img src={`${MP}icon-chevron.svg`} width={8} height={6} alt="" aria-hidden />
                </button>
                <div className="dpr-field dpr-field--grow">
                  <input
                    id="dpr-alt"
                    className="dpr-input"
                    placeholder=" "
                    inputMode="tel"
                    value={form.altPhone}
                    onChange={(e) => set("altPhone")(e.target.value)}
                  />
                  <label htmlFor="dpr-alt" className="dpr-flabel">Alternate Number (optional)</label>
                </div>
              </div>

              <div className="dpr-field">
                <input
                  id="dpr-email"
                  className="dpr-input"
                  type="email"
                  placeholder=" "
                  value={form.email}
                  onChange={(e) => set("email")(e.target.value)}
                />
                <label htmlFor="dpr-email" className="dpr-flabel">Email address*</label>
              </div>

              <div className="dpr-addr">
                <div className="dpr-field">
                  <input
                    id="dpr-addr1"
                    className="dpr-input dpr-input--medium"
                    placeholder=" "
                    value={form.address1}
                    onChange={(e) => set("address1")(e.target.value)}
                  />
                </div>
                <div className="dpr-addr-note">
                  <img src={`${MP}icon-info.svg`} width={13} height={13} alt="" aria-hidden />
                  <p>Address is required for invoice generation.</p>
                </div>
              </div>

              <div className="dpr-field">
                <input
                  id="dpr-addr2"
                  className="dpr-input dpr-input--medium"
                  placeholder=" "
                  value={form.address2}
                  onChange={(e) => set("address2")(e.target.value)}
                />
              </div>

              <div className="dpr-row">
                <div className="dpr-field">
                  <input
                    id="dpr-country"
                    className="dpr-input"
                    placeholder=" "
                    value={form.country}
                    onChange={(e) => set("country")(e.target.value)}
                  />
                  <label htmlFor="dpr-country" className="dpr-flabel">Country*</label>
                </div>
                <div className="dpr-field">
                  <input
                    id="dpr-pin"
                    className="dpr-input"
                    placeholder=" "
                    inputMode="numeric"
                    value={form.pinCode}
                    onChange={(e) => set("pinCode")(e.target.value)}
                  />
                  <label htmlFor="dpr-pin" className="dpr-flabel">Pin Code*</label>
                </div>
              </div>

              <div className="dpr-row">
                <div className="dpr-field">
                  <input
                    id="dpr-city"
                    className="dpr-input"
                    placeholder=" "
                    value={form.city}
                    onChange={(e) => set("city")(e.target.value)}
                  />
                  <label htmlFor="dpr-city" className="dpr-flabel">City*</label>
                </div>
                <div className="dpr-field">
                  <input
                    id="dpr-state"
                    className="dpr-input"
                    placeholder=" "
                    value={form.state}
                    onChange={(e) => set("state")(e.target.value)}
                  />
                  <label htmlFor="dpr-state" className="dpr-flabel">State*</label>
                </div>
              </div>
            </div>
          </section>

          <button className="dpr-save" type="button">Save Details</button>
        </div>
      </div>

      {/* Grey sign-off — page level, aligned with the content gutter */}
      <ProfileWatermark />

      {/* Same minimal footer as the desktop booking page */}
      <footer className="dpr-footer">
        <p>&copy; WANDERON EXPERIENCES PVT LTD, All rights reserved.</p>
      </footer>
    </div>
  );
}
