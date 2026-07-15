import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PaymentSheet from "../components/PaymentSheet/PaymentSheet";
import "./Booking.css";

const A = "/figma/booking/";
const TRIP_THUMB = "/figma/trip-hero/hero-bg.png";

interface BookingState {
  tripTitle?: string;
  tripName?: string;
  dateRange?: string;
  durationLabel?: string;
  pickUp?: string;
  drop?: string;
  cities?: string[];
  perPerson?: string;
  perPersonStrike?: string;
  travelers?: number;
}

const DEFAULTS: Required<BookingState> = {
  tripTitle:
    "11 Days European Pathways Community Trip - France, Netherlands, Germany, Czechia",
  tripName: "Europe Trip",
  dateRange: "23 July 2026 - 3 Aug 2026",
  durationLabel: "10N/11D",
  pickUp: "Paris Airport",
  drop: "Prague Airport",
  cities: ["3N Paris", "3N Amsterdam", "2N Berlin", "2N Prague"],
  perPerson: "1,79,990",
  perPersonStrike: "29,000",
  travelers: 2,
};

export default function Booking() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as BookingState) || {};
  const data = { ...DEFAULTS, ...state };

  const [accommodationOpen, setAccommodationOpen] = useState(true);
  const [travelers, setTravelers] = useState(data.travelers);
  const [mixedGender, setMixedGender] = useState(false);
  const [privateRoom, setPrivateRoom] = useState(true);
  const [flexibleCancel, setFlexibleCancel] = useState(false);
  const [couponOpen, setCouponOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);

  // Personal details
  const [firstName, setFirstName] = useState("Ruhani");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  // Who are you booking for
  const [femaleCount, setFemaleCount] = useState(2);
  const [maleCount, setMaleCount] = useState(0);

  return (
    <div className="bkg-page">
      {/* Fixed top header */}
      <header className="bkg-header">
        <div className="bkg-header-left">
          <button
            className="bkg-header-back"
            type="button"
            aria-label="Back"
            onClick={() => navigate(-1)}
          >
            <img src={`${A}icon-arrow-back.svg`} width={24} height={24} alt="" aria-hidden />
          </button>
          <span className="bkg-header-title">Booking Details</span>
        </div>
        <button
          className="bkg-header-close"
          type="button"
          aria-label="Close"
          onClick={() => navigate(-1)}
        >
          <img src={`${A}icon-close.svg`} width={30} height={30} alt="" aria-hidden />
        </button>
      </header>

      {/* Scrollable body */}
      <div className="bkg-body">
        {/* ── Your Trip ─────────────────────────────────────── */}
        <section className="bkg-section">
          <div className="bkg-package">
            <div className="bkg-package-top">
              <img className="bkg-package-thumb" src={TRIP_THUMB} alt="" loading="lazy" />
              <p className="bkg-package-name">{data.tripTitle}</p>
            </div>

            <div className="bkg-package-duration">
              <div className="bkg-dur-label">
                <img src={`${A}icon-calendar.svg`} width={16} height={16} alt="" aria-hidden />
                <span>Trip Duration:</span>
              </div>
              <div className="bkg-dur-values">
                <span>{data.dateRange}</span>
                <span>{data.durationLabel}</span>
              </div>
            </div>

            <div className="bkg-package-divider" />

            <div className="bkg-package-pd">
              <div className="bkg-pd-col">
                <div className="bkg-pd-label">
                  <img src={`${A}icon-location.svg`} width={11} height={12} alt="" aria-hidden />
                  <span>Pick Up</span>
                </div>
                <p className="bkg-pd-place">{data.pickUp}</p>
              </div>
              <div className="bkg-pd-col bkg-pd-col--right">
                <div className="bkg-pd-label">
                  <img src={`${A}icon-location.svg`} width={11} height={12} alt="" aria-hidden />
                  <span>Drop</span>
                </div>
                <p className="bkg-pd-place">{data.drop}</p>
              </div>
            </div>

            <div className="bkg-cities">
              {data.cities.map((c, i) => (
                <span className="bkg-city" key={i}>
                  {i > 0 && <span className="bkg-city-dot" aria-hidden />}
                  {c}
                </span>
              ))}
            </div>
          </div>
        </section>

        <div className="bkg-strip" />

        {/* ── Personal Details ──────────────────────────────── */}
        <section className="bkg-section bkg-section--gap">
          <div className="bkg-subhead">
            <span className="bkg-section-icon">
              <img src={`${A}icon-person2.svg`} width={16} height={16} alt="" aria-hidden />
            </span>
            <span className="bkg-section-title">Personal Details</span>
          </div>

          <div className="bkg-passport-tag">
            <img src={`${A}icon-passport.svg`} width={23} height={16} alt="" aria-hidden />
            <span>
              Enter your full first and last name as stated in your ID or passport, including any
              middle name(s) and/or initials.
            </span>
          </div>

          <div className="bkg-form">
            <div className="bkg-field">
              <input
                id="bkg-fn"
                className="bkg-input"
                placeholder=" "
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <label htmlFor="bkg-fn" className="bkg-flabel">First Name*</label>
            </div>

            <div className="bkg-field">
              <input
                id="bkg-mn"
                className="bkg-input"
                placeholder=" "
                value={middleName}
                onChange={(e) => setMiddleName(e.target.value)}
              />
              <label htmlFor="bkg-mn" className="bkg-flabel">Middle Name</label>
            </div>

            <div className="bkg-field">
              <input
                id="bkg-ln"
                className="bkg-input"
                placeholder=" "
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              <label htmlFor="bkg-ln" className="bkg-flabel">Last Name*</label>
            </div>

            <div className="bkg-field">
              <select
                id="bkg-gender"
                className={`bkg-input bkg-select${gender ? "" : " bkg-select--empty"}`}
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="" disabled hidden></option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </select>
              <label htmlFor="bkg-gender" className="bkg-flabel">Gender*</label>
              <span className="bkg-field-icon" aria-hidden>
                <img src={`${A}icon-arrow-drop.svg`} width={24} height={24} alt="" />
              </span>
            </div>

            <div className="bkg-field bkg-field--float">
              <input
                id="bkg-dob"
                className="bkg-input"
                placeholder="DD-MM-YYYY"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
              <label htmlFor="bkg-dob" className="bkg-flabel">Date Of Birth*</label>
              <span className="bkg-field-icon" aria-hidden>
                <img src={`${A}icon-calendar-field.svg`} width={16} height={16} alt="" />
              </span>
            </div>

            <div className="bkg-phone">
              <button className="bkg-phone-code" type="button">
                <span>IN +91</span>
                <img src={`${A}icon-chevron-down.svg`} width={8} height={6} alt="" aria-hidden />
              </button>
              <div className="bkg-field bkg-field--grow">
                <input
                  id="bkg-phone"
                  className="bkg-input"
                  placeholder=" "
                  inputMode="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <label htmlFor="bkg-phone" className="bkg-flabel">WhatsApp Number*</label>
              </div>
            </div>

            <div className="bkg-field">
              <input
                id="bkg-email"
                className="bkg-input"
                type="email"
                placeholder=" "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label htmlFor="bkg-email" className="bkg-flabel">Email address*</label>
            </div>
          </div>
        </section>

        <div className="bkg-strip" />

        {/* ── Select Accommodation Type ─────────────────────── */}
        <section className="bkg-section bkg-section--pad0">
          <button
            className="bkg-accordion-head"
            type="button"
            onClick={() => setAccommodationOpen((v) => !v)}
            aria-expanded={accommodationOpen}
          >
            <span className="bkg-section-icon">
              <img src={`${A}icon-villa.svg`} width={16} height={16} alt="" aria-hidden />
            </span>
            <span className="bkg-section-title">Select Accommodation Type</span>
            <span
              className={`bkg-caret${accommodationOpen ? " bkg-caret--open" : ""}`}
              aria-hidden
            >
              <img src={`${A}icon-arrow-drop.svg`} width={24} height={24} alt="" />
            </span>
          </button>

          {accommodationOpen && (
            <div className="bkg-accommodation">
              <div className="bkg-warn-tag">
                <img src={`${A}icon-info-yellow.svg`} width={14} height={14} alt="" aria-hidden />
                <span>Add total number of travelers</span>
              </div>

              <div className="bkg-room-row">
                <div className="bkg-room-info">
                  <p className="bkg-room-name">Hotel - (Double Sharing)</p>
                  <div className="bkg-room-price-line">
                    <span className="bkg-room-strike">
                      <img src={`${A}icon-rupee.svg`} width={10} height={10} alt="" aria-hidden />
                      {data.perPersonStrike}/-
                    </span>
                    <span className="bkg-room-price">&#8377; {data.perPerson}/-</span>
                    <span className="bkg-room-per">per person</span>
                  </div>
                </div>
                <div className="bkg-stepper">
                  <button
                    className="bkg-step-btn"
                    type="button"
                    aria-label="Decrease travelers"
                    onClick={() => setTravelers((v) => Math.max(1, v - 1))}
                  >
                    <img src={`${A}icon-minus.svg`} width={20} height={20} alt="" aria-hidden />
                  </button>
                  <span className="bkg-step-count">{travelers}</span>
                  <button
                    className="bkg-step-btn"
                    type="button"
                    aria-label="Increase travelers"
                    onClick={() => setTravelers((v) => v + 1)}
                  >
                    <img src={`${A}icon-plus.svg`} width={20} height={20} alt="" aria-hidden />
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>

        <div className="bkg-strip" />

        {/* ── Who are you booking for? ──────────────────────── */}
        <section className="bkg-section bkg-section--pad0">
          <div className="bkg-subhead bkg-subhead--pad">
            <span className="bkg-section-icon">
              <img src={`${A}icon-groups.svg`} width={16} height={16} alt="" aria-hidden />
            </span>
            <span className="bkg-section-title">Who are you booking for?</span>
          </div>

          <div className="bkg-bookingfor">
            <div className="bkg-bf-row">
              <div className="bkg-bf-col">
                <span className="bkg-bf-label">Female</span>
                <div className="bkg-stepper">
                  <button
                    className="bkg-step-btn"
                    type="button"
                    aria-label="Decrease female travelers"
                    onClick={() => setFemaleCount((v) => Math.max(0, v - 1))}
                  >
                    <img src={`${A}icon-minus.svg`} width={20} height={20} alt="" aria-hidden />
                  </button>
                  <span className="bkg-step-count">{femaleCount}</span>
                  <button
                    className="bkg-step-btn"
                    type="button"
                    aria-label="Increase female travelers"
                    onClick={() => setFemaleCount((v) => v + 1)}
                  >
                    <img src={`${A}icon-plus.svg`} width={20} height={20} alt="" aria-hidden />
                  </button>
                </div>
              </div>

              <div className="bkg-bf-divider" aria-hidden />

              <div className="bkg-bf-col">
                <span className="bkg-bf-label">Male</span>
                <div className="bkg-stepper">
                  <button
                    className="bkg-step-btn"
                    type="button"
                    aria-label="Decrease male travelers"
                    onClick={() => setMaleCount((v) => Math.max(0, v - 1))}
                  >
                    <img src={`${A}icon-minus.svg`} width={20} height={20} alt="" aria-hidden />
                  </button>
                  <span className="bkg-step-count">{maleCount}</span>
                  <button
                    className="bkg-step-btn"
                    type="button"
                    aria-label="Increase male travelers"
                    onClick={() => setMaleCount((v) => v + 1)}
                  >
                    <img src={`${A}icon-plus.svg`} width={20} height={20} alt="" aria-hidden />
                  </button>
                </div>
              </div>
            </div>

            <div className="bkg-note">
              <img src={`${A}icon-info-grey.svg`} width={13} height={13} alt="" aria-hidden />
              <span>If you book for 2, the private room is free of charge upto 2 people.</span>
            </div>
          </div>
        </section>

        <div className="bkg-strip" />

        {/* ── Mixed gender room ─────────────────────────────── */}
        <section className="bkg-section">
          <label className="bkg-option">
            <span className="bkg-option-icon">
              <img src={`${A}icon-hotel.svg`} width={16} height={16} alt="" aria-hidden />
            </span>
            <span className="bkg-option-label">I&#39;m OK with a mixed gender room</span>
            <input
              type="checkbox"
              className="bkg-checkbox"
              checked={mixedGender}
              onChange={(e) => setMixedGender(e.target.checked)}
            />
          </label>
          <p className="bkg-option-desc">
            In a mixed gender room, you might be sharing with other travellers of different
            genders, but don&#39;t worry: you each get your own single bed. The &quot;mixed&quot;
            part just means fellow Wanderers from your group, not random strangers!
          </p>
        </section>

        <div className="bkg-strip" />

        {/* ── Private Room ──────────────────────────────────── */}
        <section className="bkg-section">
          <label className="bkg-option">
            <span className="bkg-option-icon">
              <img src={`${A}icon-door.svg`} width={16} height={16} alt="" aria-hidden />
            </span>
            <span className="bkg-option-label bkg-option-label--between">
              <span>Private Room</span>
              <span className="bkg-option-price">+ &#8377;0/-</span>
            </span>
            <input
              type="checkbox"
              className="bkg-checkbox"
              checked={privateRoom}
              onChange={(e) => setPrivateRoom(e.target.checked)}
            />
          </label>
          <p className="bkg-option-desc">
            You are eligible for a private room. Select if you want a private room just for you and
            the person you are travelling with.
          </p>
          <div className="bkg-note">
            <img src={`${A}icon-info-grey.svg`} width={13} height={13} alt="" aria-hidden />
            <span>
              Private Room option is not available if you agree to be assigned to a mixed gender
              room.
            </span>
          </div>
        </section>

        <div className="bkg-strip" />

        {/* ── Flexible Cancellation ─────────────────────────── */}
        <section className="bkg-section">
          <label className="bkg-option">
            <span className="bkg-option-icon">
              <img src={`${A}icon-bag-inactive.svg`} width={16} height={16} alt="" aria-hidden />
            </span>
            <span className="bkg-option-label bkg-option-label--between">
              <span>Flexible Cancellation</span>
              <span className="bkg-option-price bkg-option-price--dark">+ &#8377;5,999/-</span>
            </span>
            <input
              type="checkbox"
              className="bkg-checkbox"
              checked={flexibleCancel}
              onChange={(e) => setFlexibleCancel(e.target.checked)}
            />
          </label>
          <p className="bkg-option-desc">
            Want more flexibility with your booking? Purchase our Flexible Cancellation to cover
            your trip up to 1 day before departure.
          </p>
        </section>

        <div className="bkg-strip" />

        {/* ── Insurance ─────────────────────────────────────── */}
        <section className="bkg-section">
          <div className="bkg-insurance">
            <p className="bkg-insurance-title">Medical and Baggage Insurance included</p>
            <p className="bkg-insurance-desc">
              The price includes Medical and Baggage Insurance which covers all services included in
              the WanderOn trip. International flights and any arrangements booked independently
              outside of the WeRoad trip are excluded. Any pre-existing medical condition is also
              excluded.
            </p>
          </div>
        </section>

        <div className="bkg-strip" />

        {/* ── Coupon + Bill Summary ─────────────────────────── */}
        <section className="bkg-section bkg-section--gap">
          <button
            className="bkg-coupon"
            type="button"
            onClick={() => setCouponOpen((v) => !v)}
            aria-expanded={couponOpen}
          >
            <span className="bkg-coupon-label">Add Coupon Code</span>
            <span className={`bkg-caret${couponOpen ? " bkg-caret--open" : ""}`} aria-hidden>
              <img src={`${A}icon-arrow-drop.svg`} width={24} height={24} alt="" />
            </span>
          </button>

          <div className="bkg-bill">
            <div className="bkg-bill-head">
              <img src={`${A}icon-receipt.svg`} width={16} height={16} alt="" aria-hidden />
              <span>Bill Summary</span>
            </div>

            <div className="bkg-bill-rows">
              <div className="bkg-bill-row">
                <span>Double Sharing</span>
                <span>&#8377;26,999/- x 2</span>
              </div>
              <div className="bkg-bill-row">
                <span>Hostel - (4/6 Bed Mixed Dorm)</span>
                <span>&#8377;24,999/- x 3</span>
              </div>
            </div>

            <div className="bkg-bill-divider" />

            <div className="bkg-bill-rows">
              <div className="bkg-bill-row">
                <span>Early Bird Voucher - 5K</span>
                <span>-&#8377;5,000/-</span>
              </div>
              <div className="bkg-bill-row">
                <span>Coupon Code</span>
                <span>-&#8377;8,000/-</span>
              </div>
              <div className="bkg-bill-row">
                <span>WanderOn Discount - (Upto &#8377;500 Off)</span>
                <span>-&#8377;500/-</span>
              </div>
              <div className="bkg-bill-row">
                <span className="bkg-bill-strong">GST @ 5%</span>
                <span>&#8377;5775/-</span>
              </div>
              <div className="bkg-bill-row">
                <button className="bkg-bill-tcs" type="button">
                  <span>TCS @ 5%</span>
                  <img src={`${A}icon-info-sm.svg`} width={16} height={16} alt="" aria-hidden />
                </button>
                <span>&#8377;5,486/-</span>
              </div>
            </div>

            <div className="bkg-bill-divider" />

            <div className="bkg-bill-total">
              <span>To Pay</span>
              <span>&#8377;1,09,720/-</span>
            </div>

            <div className="bkg-saved">
              <img src={`${A}icon-person.svg`} width={24} height={24} alt="" aria-hidden />
              <span className="bkg-saved-amt">&#8377;5000/-</span>
              <span className="bkg-saved-text">saved on this trip.</span>
            </div>
          </div>
        </section>

        <div className="bkg-strip" />

        {/* ── Notes ─────────────────────────────────────────── */}
        <section className="bkg-section">
          <button
            className="bkg-notes"
            type="button"
            onClick={() => setNotesOpen((v) => !v)}
            aria-expanded={notesOpen}
          >
            <span className="bkg-notes-label">Notes</span>
            <span className={`bkg-caret${notesOpen ? " bkg-caret--open" : ""}`} aria-hidden>
              <img src={`${A}icon-arrow-drop.svg`} width={24} height={24} alt="" />
            </span>
          </button>
        </section>

        {/* ── Agreement ─────────────────────────────────────── */}
        <section className="bkg-agree">
          <input
            type="checkbox"
            className="bkg-checkbox bkg-checkbox--round"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
          />
          <p className="bkg-agree-text">
            I agree to the <a href="/legal">Payment Terms</a>, <a href="/legal">Cancellation Policy</a>,
            General <a href="/legal">Terms &amp; Conditions</a>, and <a href="/legal">Privacy Policy</a>.
          </p>
        </section>
      </div>

      {/* Fixed bottom CTA */}
      <div className="bkg-cta">
        <div className="bkg-cta-tags">
          <img src={`${A}icon-your-trips.svg`} width={16} height={16} alt="" aria-hidden />
          <span className="bkg-cta-tag">{data.tripName}</span>
          <span className="bkg-cta-dot" aria-hidden />
          <span className="bkg-cta-tag">{data.dateRange}</span>
          <span className="bkg-cta-dot" aria-hidden />
          <span className="bkg-cta-tag">{travelers} Travellers</span>
        </div>
        <div className="bkg-cta-bar">
          <div className="bkg-cta-price-col">
            <span className="bkg-cta-price">&#8377; 1,09,720/-</span>
            <button className="bkg-cta-fee" type="button">
              <span>+</span>
              <img src={`${A}icon-info-sm.svg`} width={16} height={16} alt="" aria-hidden />
              <span>Convenience fee</span>
            </button>
          </div>
          <button
            className="bkg-cta-btn"
            type="button"
            disabled={!agreed}
            onClick={() => setPaymentOpen(true)}
          >
            <span>Continue to Book</span>
          </button>
        </div>
      </div>

      <PaymentSheet
        isOpen={paymentOpen}
        onClose={() => setPaymentOpen(false)}
      />
    </div>
  );
}
