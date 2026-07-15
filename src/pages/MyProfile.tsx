import { useState } from "react";
import FooterMessage from "../components/FooterMessage/FooterMessage";
import { useNavigate } from "react-router-dom";
import "./MyProfile.css";

const MP = "/figma/my-profile/";
const P  = "/figma/profile/";

const INIT = {
  firstName: "Shivam",
  middleName: "",
  lastName: "Trivedi",
  gender: "Male",
  dob: "",
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

/* ── FloatField ── floating-label input */
function FloatField({
  label, value, onChange, type = "text", trailingIcon, trailingIconSize = 16, readOnly,
}: {
  label: string; value: string; onChange?: (v: string) => void;
  type?: string; trailingIcon?: string; trailingIconSize?: number; readOnly?: boolean;
}) {
  const filled = value.length > 0;
  return (
    <div className="mprf-field-wrap">
      <div className={`mprf-field-inner${filled ? " mprf-field-inner--filled" : ""}`}>
        <input
          className="mprf-input"
          type={type}
          value={value}
          placeholder={filled ? "" : label}
          readOnly={readOnly}
          onChange={e => onChange?.(e.target.value)}
        />
        {trailingIcon && (
          <img src={trailingIcon} width={trailingIconSize} height={trailingIconSize} alt="" aria-hidden className="mprf-input-icon" />
        )}
      </div>
      {filled && <span className="mprf-float-label">{label}</span>}
    </div>
  );
}

/* ── CountryPill ── "IN +91" prefix with chevron */
function CountryPill() {
  return (
    <div className="mprf-country-pill">
      <span className="mprf-country-text">IN +91</span>
      <img src={`${MP}icon-chevron.svg`} width={8} height={6} alt="" aria-hidden />
    </div>
  );
}

/* ── PhoneField ── country pill + number input */
function PhoneField({
  label, value, onChange, verified,
}: {
  label: string; value: string; onChange?: (v: string) => void; verified?: boolean;
}) {
  const filled = value.length > 0;
  return (
    <div className="mprf-phone-row">
      <CountryPill />
      <div className="mprf-field-wrap mprf-field-wrap--flex">
        <div className={`mprf-field-inner${filled ? " mprf-field-inner--filled" : ""}`}>
          <input
            className="mprf-input"
            type="tel"
            value={value}
            placeholder={filled ? "" : label}
            onChange={e => onChange?.(e.target.value)}
          />
          <div className="mprf-input-trailing">
            {verified && (
              <img src={`${MP}icon-verified.svg`} width={16} height={16} alt="Verified" className="mprf-input-icon" />
            )}
            <img src={`${MP}icon-dropdown.svg`} width={24} height={24} alt="" aria-hidden className="mprf-input-icon" />
          </div>
        </div>
        {filled && <span className="mprf-float-label">{label}</span>}
      </div>
    </div>
  );
}

/* ── SelectField ── value + dropdown icon */
function SelectField({ label, value }: { label: string; value: string }) {
  const filled = value.length > 0;
  return (
    <div className="mprf-field-wrap">
      <div className={`mprf-field-inner${filled ? " mprf-field-inner--filled" : ""}`}>
        <span className="mprf-input mprf-input--text">{filled ? value : <span className="mprf-placeholder">{label}</span>}</span>
        <img src={`${MP}icon-dropdown.svg`} width={24} height={24} alt="" aria-hidden className="mprf-input-icon" />
      </div>
      {filled && <span className="mprf-float-label">{label}</span>}
    </div>
  );
}

/* ── HalfField ── for Country/PinCode/City/State side-by-side */
function HalfField({ label, value }: { label: string; value: string }) {
  const filled = value.length > 0;
  return (
    <div className="mprf-field-wrap mprf-field-wrap--flex">
      <div className={`mprf-field-inner${filled ? " mprf-field-inner--filled" : ""}`}>
        <span className="mprf-input mprf-input--text">{filled ? value : <span className="mprf-placeholder">{label}</span>}</span>
      </div>
      {filled && <span className="mprf-float-label">{label}</span>}
    </div>
  );
}

/* ── Page ── */
export default function MyProfile() {
  const navigate = useNavigate();
  const [form, setForm] = useState(INIT);
  const [bannerVisible, setBannerVisible] = useState(true);

  const set = (key: keyof typeof INIT) => (v: string) => setForm(f => ({ ...f, [key]: v }));

  return (
    <div className="mprf-page">

      {/* Header */}
      <header className="mprf-header">
        <div className="mprf-header-left">
          <button className="mprf-header-back" type="button" onClick={() => navigate(-1)} aria-label="Go back">
            <img src={`${P}icon-arrow-back.svg`} width={24} height={24} alt="" aria-hidden />
          </button>
          <span className="mprf-header-title">My Profile</span>
        </div>
        <button className="mprf-header-bell" type="button" aria-label="Notifications">
          <img src={`${P}icon-bell.svg`} width={36} height={36} alt="" aria-hidden />
        </button>
      </header>

      {/* Scrollable content */}
      <div className="mprf-content">

        {/* Avatar + name */}
        <div className="mprf-user-section">
          <div className="mprf-avatar">
            <span className="mprf-avatar-initial">S</span>
          </div>
          <p className="mprf-name">
            <span className="mprf-name-hi">Hi! </span>
            <span className="mprf-name-user">Shivam Trivedi</span>
          </p>
        </div>

        {/* Email confirmation banner */}
        {bannerVisible && (
          <div className="mprf-email-banner">
            <div className="mprf-banner-row">
              <img src={`${MP}icon-email.svg`} width={20} height={20} alt="" aria-hidden className="mprf-banner-icon" />
              <div className="mprf-banner-text">
                <p className="mprf-banner-title">Confirm your email address</p>
                <p className="mprf-banner-sub">We'll send a code to your inbox.</p>
              </div>
              <button className="mprf-banner-close" type="button" onClick={() => setBannerVisible(false)} aria-label="Dismiss">
                <img src={`${MP}icon-close.svg`} width={18} height={18} alt="" aria-hidden />
              </button>
            </div>
            <button className="mprf-confirm-btn" type="button">Confirm email</button>
          </div>
        )}

        {/* Personal Information */}
        <div className="mprf-form-section">

          {/* Section header */}
          <div className="mprf-section-head">
            <div className="mprf-section-head-left">
              <img src={`${MP}icon-person.svg`} width={20} height={20} alt="" aria-hidden />
              <span className="mprf-section-title">Personal Information</span>
            </div>
            <button className="mprf-edit-btn" type="button" aria-label="Edit personal information">
              <img src={`${MP}icon-edit.svg`} width={24} height={24} alt="" aria-hidden />
            </button>
          </div>

          {/* Fields */}
          <div className="mprf-fields">
            <FloatField label="First Name*"  value={form.firstName}  onChange={set("firstName")} />
            <FloatField label="Middle Name"  value={form.middleName} onChange={set("middleName")} />
            <FloatField label="Last Name"    value={form.lastName}   onChange={set("lastName")} />
            <SelectField label="Gender*"     value={form.gender} />
            <FloatField
              label="Date Of Birth*" value={form.dob} onChange={set("dob")}
              trailingIcon={`${MP}icon-calendar.svg`} trailingIconSize={16}
            />
            <PhoneField label="WhatsApp Number*"       value={form.whatsapp} onChange={set("whatsapp")} verified />
            <PhoneField label="Alternate Number (optional)" value={form.altPhone} onChange={set("altPhone")} />
            <FloatField label="Email address*" value={form.email} onChange={set("email")} type="email" />

            {/* Address line 1 + info note */}
            <div className="mprf-addr-wrap">
              <div className="mprf-field-inner mprf-field-inner--filled">
                <span className="mprf-input mprf-input--text mprf-input--medium">{form.address1}</span>
              </div>
              <div className="mprf-addr-note">
                <img src={`${MP}icon-info.svg`} width={13} height={13} alt="" aria-hidden />
                <p className="mprf-addr-note-text">Address is required for invoice generation.</p>
              </div>
            </div>

            {/* Address line 2 */}
            <div className="mprf-field-inner mprf-field-inner--filled">
              <span className="mprf-input mprf-input--text mprf-input--medium">{form.address2}</span>
            </div>

            {/* Country + Pin Code */}
            <div className="mprf-row">
              <HalfField label="Country*"  value={form.country} />
              <HalfField label="Pin Code*" value={form.pinCode} />
            </div>

            {/* City + State */}
            <div className="mprf-row">
              <HalfField label="City*"  value={form.city} />
              <HalfField label="State*" value={form.state} />
            </div>
          </div>

        </div>

        {/* Save button */}
        <button className="mprf-save-btn" type="button">Save Details</button>

      <FooterMessage />
      </div>
    </div>
  );
}
