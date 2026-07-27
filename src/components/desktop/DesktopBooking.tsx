import { useState } from "react";
import { Link } from "react-router-dom";
import Voucher from "../Voucher/Voucher";
import DesktopReviewBooking from "./DesktopReviewBooking";
import { formatINR, type BookingForm } from "../../pages/useBookingForm";
import "./DesktopBooking.css";

const A = "/figma/booking/";
const TRIP_THUMB = "/figma/trip-hero/hero-bg.png";

interface DesktopBookingProps {
  /** Shared booking state/logic owned by the `Booking` page. */
  form: BookingForm;
}

/** Desktop booking details page — Figma 4380:8004. */
export default function DesktopBooking({ form }: DesktopBookingProps) {
  const {
    navigate,
    data,
    travelers,
    setTravelers,
    mixedGender,
    setMixedGender,
    privateRoom,
    setPrivateRoom,
    flexibleCancel,
    setFlexibleCancel,
    notesOpen,
    setNotesOpen,
    agreed,
    setAgreed,
    firstName,
    setFirstName,
    middleName,
    setMiddleName,
    lastName,
    setLastName,
    gender,
    setGender,
    dob,
    setDob,
    phone,
    setPhone,
    email,
    setEmail,
    panNumber,
    setPanNumber,
    panFile,
    setPanFile,
    passportNumber,
    setPassportNumber,
    passportValidUpto,
    setPassportValidUpto,
    passportFile,
    setPassportFile,
    femaleMin,
    maleMin,
    effectiveFemale,
    effectiveMale,
    setFemaleCount,
    setMaleCount,
    appliedVoucher,
    setAppliedVoucher,
    pricing,
  } = form;

  // "Book Now" advances to the review-booking step (Figma 6597:36834) instead
  // of opening the mobile payment bottom sheet.
  const [reviewOpen, setReviewOpen] = useState(false);

  if (reviewOpen) {
    return <DesktopReviewBooking form={form} onBack={() => setReviewOpen(false)} />;
  }

  return (
    <div className="dbk">
      {/* ── Header ─────────────────────────────────────────── */}
      <header className="dbk-header">
        <button
          className="dbk-header-back"
          type="button"
          aria-label="Back"
          onClick={() => navigate(-1)}
        >
          <img src={`${A}icon-arrow-back.svg`} width={24} height={24} alt="" aria-hidden />
        </button>
        <span className="dbk-header-title">Booking Details</span>
      </header>

      <div className="dbk-body">
        {/* ── Left column ──────────────────────────────────── */}
        <div className="dbk-main">
          {/* Card: trip package + personal details */}
          <section className="dbk-card">
            <div className="dbk-package">
              <img className="dbk-package-thumb" src={TRIP_THUMB} alt="" loading="lazy" />
              <div className="dbk-package-info">
                <p className="dbk-package-name">{data.tripTitle}</p>

                <div className="dbk-package-duration">
                  <div className="dbk-dur-label">
                    <img src={`${A}icon-calendar.svg`} width={16} height={16} alt="" aria-hidden />
                    <span>Trip Duration:</span>
                  </div>
                  <div className="dbk-dur-values">
                    <span>{data.dateRange}</span>
                    <span>{data.durationLabel}</span>
                  </div>
                </div>

                <div className="dbk-package-pd">
                  <div className="dbk-pd-col">
                    <div className="dbk-pd-label">
                      <img src={`${A}icon-location.svg`} width={11} height={12} alt="" aria-hidden />
                      <span>Pick Up</span>
                    </div>
                    <p className="dbk-pd-place">{data.pickUp}</p>
                  </div>
                  <div className="dbk-pd-col dbk-pd-col--right">
                    <div className="dbk-pd-label">
                      <img src={`${A}icon-location.svg`} width={11} height={12} alt="" aria-hidden />
                      <span>Drop</span>
                    </div>
                    <p className="dbk-pd-place">{data.drop}</p>
                  </div>
                </div>

                <div className="dbk-cities">
                  {data.cities.map((c, i) => (
                    <span className="dbk-city" key={i}>
                      {i > 0 && <span className="dbk-city-dot" aria-hidden />}
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="dbk-panel">
              <div className="dbk-subhead">
                <span className="dbk-section-icon">
                  <img src={`${A}icon-person2.svg`} width={16} height={16} alt="" aria-hidden />
                </span>
                <span className="dbk-section-title">Personal Details</span>
              </div>

              <div className="dbk-passport-tag">
                <img src={`${A}icon-passport.svg`} width={20} height={16} alt="" aria-hidden />
                <span>
                  Enter your full first and last name as stated in your ID or passport, including
                  any middle name(s) and/or initials.
                </span>
              </div>

              <div className="dbk-form">
                <div className="dbk-field">
                  <input
                    id="dbk-fn"
                    className="dbk-input"
                    placeholder=" "
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                  <label htmlFor="dbk-fn" className="dbk-flabel">First Name*</label>
                </div>

                <div className="dbk-field">
                  <input
                    id="dbk-mn"
                    className="dbk-input"
                    placeholder=" "
                    value={middleName}
                    onChange={(e) => setMiddleName(e.target.value)}
                  />
                  <label htmlFor="dbk-mn" className="dbk-flabel">Middle Name</label>
                </div>

                <div className="dbk-field">
                  <input
                    id="dbk-ln"
                    className="dbk-input"
                    placeholder=" "
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                  <label htmlFor="dbk-ln" className="dbk-flabel">Last Name*</label>
                </div>

                <div className="dbk-field">
                  <select
                    id="dbk-gender"
                    className={`dbk-input dbk-select${gender ? "" : " dbk-select--empty"}`}
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option value="" disabled hidden></option>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="other">Other</option>
                  </select>
                  <label htmlFor="dbk-gender" className="dbk-flabel">Gender*</label>
                  <span className="dbk-field-icon" aria-hidden>
                    <img src={`${A}icon-arrow-drop.svg`} width={24} height={24} alt="" />
                  </span>
                </div>

                <div className="dbk-field dbk-field--float">
                  <input
                    id="dbk-dob"
                    className="dbk-input"
                    placeholder="DD-MM-YYYY"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                  />
                  <label htmlFor="dbk-dob" className="dbk-flabel">Date Of Birth*</label>
                  <span className="dbk-field-icon" aria-hidden>
                    <img src={`${A}icon-calendar-field.svg`} width={16} height={16} alt="" />
                  </span>
                </div>

                <div className="dbk-phone">
                  <button className="dbk-phone-code" type="button">
                    <span>IN +91</span>
                    <img src={`${A}icon-chevron-down.svg`} width={8} height={6} alt="" aria-hidden />
                  </button>
                  <div className="dbk-field dbk-field--grow">
                    <input
                      id="dbk-phone"
                      className="dbk-input"
                      placeholder=" "
                      inputMode="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                    <label htmlFor="dbk-phone" className="dbk-flabel">WhatsApp Number*</label>
                  </div>
                </div>

                <div className="dbk-field">
                  <input
                    id="dbk-email"
                    className="dbk-input"
                    type="email"
                    placeholder=" "
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <label htmlFor="dbk-email" className="dbk-flabel">Email address*</label>
                </div>
              </div>
            </div>

            {/* Documents */}
            <div className="dbk-panel">
              <div className="dbk-subhead">
                <span className="dbk-section-icon">
                  <img src={`${A}icon-id-card.svg`} width={16} height={16} alt="" aria-hidden />
                </span>
                <span className="dbk-section-title">Documents</span>
              </div>

              <div className="dbk-form">
                <p className="dbk-doc-group">PAN Card</p>

                <div className="dbk-field">
                  <input
                    id="dbk-pan"
                    className="dbk-input"
                    placeholder=" "
                    value={panNumber}
                    onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                  />
                  <label htmlFor="dbk-pan" className="dbk-flabel">PAN Number*</label>
                </div>

                <label className={`dbk-upload${panFile ? " dbk-upload--filled" : ""}`}>
                  <span className="dbk-upload-label">
                    {panFile ? panFile.name : "Upload PAN Card Front Image*"}
                  </span>
                  <img src="/figma/my-booking/icon-upload.svg" width={20} height={20} alt="" aria-hidden />
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    className="dbk-upload-input"
                    onChange={(e) => setPanFile(e.target.files?.[0] ?? null)}
                  />
                </label>

                <p className="dbk-doc-group">Passport</p>

                <div className="dbk-doc-tag">
                  <img src={`${A}icon-info-yellow.svg`} width={16} height={16} alt="" aria-hidden />
                  <span>Minimum passport validity upto 3rd January 2027.</span>
                </div>

                <div className="dbk-doc-row">
                  <div className="dbk-field dbk-field--grow">
                    <input
                      id="dbk-passport"
                      className="dbk-input"
                      placeholder=" "
                      value={passportNumber}
                      onChange={(e) => setPassportNumber(e.target.value.toUpperCase())}
                    />
                    <label htmlFor="dbk-passport" className="dbk-flabel">Passport Number*</label>
                  </div>
                  <div className="dbk-field dbk-field--grow">
                    <input
                      id="dbk-passport-valid"
                      className="dbk-input"
                      placeholder=" "
                      value={passportValidUpto}
                      onChange={(e) => setPassportValidUpto(e.target.value)}
                    />
                    <label htmlFor="dbk-passport-valid" className="dbk-flabel">
                      Passport Valid Upto*
                    </label>
                    <span className="dbk-field-icon" aria-hidden>
                      <img src={`${A}icon-calendar-field.svg`} width={16} height={16} alt="" />
                    </span>
                  </div>
                </div>

                <label className={`dbk-upload${passportFile ? " dbk-upload--filled" : ""}`}>
                  <span className="dbk-upload-label">
                    {passportFile ? passportFile.name : "Upload Passport Front*"}
                  </span>
                  <img src="/figma/my-booking/icon-upload.svg" width={20} height={20} alt="" aria-hidden />
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    className="dbk-upload-input"
                    onChange={(e) => setPassportFile(e.target.files?.[0] ?? null)}
                  />
                </label>
              </div>
            </div>
          </section>

          {/* Card: accommodation + add-ons */}
          <section className="dbk-card dbk-card--accommodation">
            <div className="dbk-subhead">
              <span className="dbk-section-icon">
                <img src={`${A}icon-villa.svg`} width={16} height={16} alt="" aria-hidden />
              </span>
              <span className="dbk-section-title">Select Accommodation Type</span>
            </div>

            <div className="dbk-block">
              <div className="dbk-warn-tag">
                <img src={`${A}icon-info-yellow.svg`} width={14} height={14} alt="" aria-hidden />
                <span>Add total number of travelers</span>
              </div>

              <div className="dbk-room-row">
                <div className="dbk-room-info">
                  <p className="dbk-room-name">Hotel - (Double Sharing)</p>
                  <div className="dbk-room-price-line">
                    <span className="dbk-room-strike">
                      <img src={`${A}icon-rupee.svg`} width={10} height={10} alt="" aria-hidden />
                      {data.perPersonStrike}/-
                    </span>
                    <span className="dbk-room-price">&#8377; {data.perPerson}/-</span>
                    <span className="dbk-room-per">per person</span>
                  </div>
                </div>
                <div className="dbk-stepper">
                  <button
                    className="dbk-step-btn"
                    type="button"
                    aria-label="Decrease travelers"
                    onClick={() => setTravelers((v) => Math.max(1, v - 1))}
                  >
                    <img src={`${A}icon-minus.svg`} width={16} height={16} alt="" aria-hidden />
                  </button>
                  <span className="dbk-step-count">{travelers}</span>
                  <button
                    className="dbk-step-btn"
                    type="button"
                    aria-label="Increase travelers"
                    onClick={() => setTravelers((v) => v + 1)}
                  >
                    <img src={`${A}icon-plus.svg`} width={12} height={12} alt="" aria-hidden />
                  </button>
                </div>
              </div>
            </div>

            {travelers > 1 && (
              <div className="dbk-block">
                <div className="dbk-blockhead">
                  <span className="dbk-section-icon">
                    <img src={`${A}icon-groups.svg`} width={16} height={16} alt="" aria-hidden />
                  </span>
                  <span className="dbk-blockhead-title">Who are you booking for?</span>
                </div>

                <div className="dbk-bf-row">
                  <div className="dbk-bf-col">
                    <span className="dbk-bf-label">Female</span>
                    <div className="dbk-stepper">
                      <button
                        className="dbk-step-btn"
                        type="button"
                        aria-label="Decrease female travelers"
                        disabled={effectiveFemale <= femaleMin}
                        onClick={() => setFemaleCount(Math.max(femaleMin, effectiveFemale - 1))}
                      >
                        <img src={`${A}icon-minus.svg`} width={16} height={16} alt="" aria-hidden />
                      </button>
                      <span className="dbk-step-count">{effectiveFemale}</span>
                      <button
                        className="dbk-step-btn"
                        type="button"
                        aria-label="Increase female travelers"
                        onClick={() => setFemaleCount(effectiveFemale + 1)}
                      >
                        <img src={`${A}icon-plus.svg`} width={12} height={12} alt="" aria-hidden />
                      </button>
                    </div>
                  </div>

                  <div className="dbk-bf-divider" aria-hidden />

                  <div className="dbk-bf-col">
                    <span className="dbk-bf-label">Male</span>
                    <div className="dbk-stepper">
                      <button
                        className="dbk-step-btn"
                        type="button"
                        aria-label="Decrease male travelers"
                        disabled={effectiveMale <= maleMin}
                        onClick={() => setMaleCount(Math.max(maleMin, effectiveMale - 1))}
                      >
                        <img src={`${A}icon-minus.svg`} width={16} height={16} alt="" aria-hidden />
                      </button>
                      <span className="dbk-step-count">{effectiveMale}</span>
                      <button
                        className="dbk-step-btn"
                        type="button"
                        aria-label="Increase male travelers"
                        onClick={() => setMaleCount(effectiveMale + 1)}
                      >
                        <img src={`${A}icon-plus.svg`} width={12} height={12} alt="" aria-hidden />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="dbk-block">
              <label className="dbk-option">
                <span className="dbk-section-icon">
                  <img src={`${A}icon-hotel.svg`} width={16} height={16} alt="" aria-hidden />
                </span>
                <span className="dbk-option-label">I&#39;m OK with a mixed gender room</span>
                <input
                  type="checkbox"
                  className="dbk-checkbox"
                  checked={mixedGender}
                  onChange={(e) => setMixedGender(e.target.checked)}
                />
              </label>
              <p className="dbk-option-desc">
                In a mixed gender room, you might be sharing with other travellers of different
                genders, but don&#39;t worry: you each get your own single bed. The &quot;mixed&quot;
                part just means fellow Wanderers from your group, not random strangers!
              </p>
            </div>

            <div className="dbk-block">
              <label className="dbk-option">
                <span className="dbk-section-icon">
                  <img src={`${A}icon-door.svg`} width={16} height={16} alt="" aria-hidden />
                </span>
                <span className="dbk-option-label dbk-option-label--between">
                  <span>Private Room</span>
                  <span className="dbk-option-price">+ &#8377;0/-</span>
                </span>
                <input
                  type="checkbox"
                  className="dbk-checkbox"
                  checked={privateRoom}
                  onChange={(e) => setPrivateRoom(e.target.checked)}
                />
              </label>
              <p className="dbk-option-desc">
                You are eligible for a private room. Select if you want a private room just for you
                and the person you are travelling with.
              </p>
              <div className="dbk-note">
                <img src={`${A}icon-info-grey.svg`} width={16} height={16} alt="" aria-hidden />
                <span>
                  Private Room option is not available if you agree to be assigned to a mixed
                  gender room.
                </span>
              </div>
            </div>

            <div className="dbk-block">
              <label className="dbk-option">
                <span className="dbk-section-icon">
                  <img src={`${A}icon-bag-inactive.svg`} width={16} height={16} alt="" aria-hidden />
                </span>
                <span className="dbk-option-label dbk-option-label--between">
                  <span>Flexible Cancellation</span>
                  <span className="dbk-option-price dbk-option-price--dark">+ &#8377;5,999/-</span>
                </span>
                <input
                  type="checkbox"
                  className="dbk-checkbox"
                  checked={flexibleCancel}
                  onChange={(e) => setFlexibleCancel(e.target.checked)}
                />
              </label>
              <p className="dbk-option-desc">
                Want more flexibility with your booking? Purchase our Flexible Cancellation to
                cover your trip up to 1 day before departure.
              </p>
            </div>

            <div className="dbk-insurance">
              <p className="dbk-insurance-title">Medical and Baggage Insurance included</p>
              <p className="dbk-insurance-desc">
                The price includes Medical and Baggage Insurance which covers all services included
                in the WanderOn trip. International flights and any arrangements booked
                independently outside of the WanderOn trip are excluded. Any pre-existing medical
                condition is also excluded.
              </p>
            </div>

            <button
              className="dbk-notes"
              type="button"
              onClick={() => setNotesOpen((v) => !v)}
              aria-expanded={notesOpen}
            >
              <span className="dbk-notes-label">Notes</span>
              <span className={`dbk-caret${notesOpen ? " dbk-caret--open" : ""}`} aria-hidden>
                <img src={`${A}icon-arrow-drop.svg`} width={24} height={24} alt="" />
              </span>
            </button>
          </section>
        </div>

        {/* ── Right rail (sticky) ──────────────────────────── */}
        <aside className="dbk-rail">
          <div className="dbk-rail-card">
            <div className="dbk-rail-inner">
              <div className="dbk-bill">
                <div className="dbk-bill-pill">
                  <img src={`${A}icon-receipt.svg`} width={16} height={16} alt="" aria-hidden />
                  <span>Bill Summary</span>
                </div>

                <div className="dbk-bill-rows">
                  <div className="dbk-bill-row">
                    <span>Hotel - (Double Sharing)</span>
                    <span>&#8377;{formatINR(pricing.perPersonNum)}/- x {travelers}</span>
                  </div>
                  {privateRoom && (
                    <div className="dbk-bill-row">
                      <span>Private Room</span>
                      <span>+&#8377;0/-</span>
                    </div>
                  )}
                  {flexibleCancel && (
                    <div className="dbk-bill-row">
                      <span>Flexible Cancellation</span>
                      <span>+&#8377;{formatINR(pricing.flexTotal)}/-</span>
                    </div>
                  )}
                </div>

                <div className="dbk-bill-divider" />

                <div className="dbk-bill-total">
                  <span>Total Cost</span>
                  <span>&#8377;{formatINR(pricing.gross)}/-</span>
                </div>

                <div className="dbk-bill-divider" />

                <div className="dbk-bill-rows">
                  {pricing.voucherDiscount > 0 && appliedVoucher && (
                    <div className="dbk-bill-row dbk-bill-row--discount">
                      <span>Voucher - {appliedVoucher.code}</span>
                      <span>-&#8377;{formatINR(pricing.voucherDiscount)}/-</span>
                    </div>
                  )}
                  {pricing.wanderOnDiscount > 0 && (
                    <div className="dbk-bill-row dbk-bill-row--discount">
                      <span>WanderOn Discount - (Upto &#8377;500 Off)</span>
                      <span>-&#8377;{formatINR(pricing.wanderOnDiscount)}/-</span>
                    </div>
                  )}
                  <div className="dbk-bill-row">
                    <span>GST @ 5%</span>
                    <span>&#8377;{formatINR(pricing.gst)}/-</span>
                  </div>
                  <div className="dbk-bill-row">
                    <button className="dbk-bill-tcs" type="button">
                      <span>TCS @ 5%</span>
                      <img src={`${A}icon-info-sm.svg`} width={16} height={16} alt="" aria-hidden />
                    </button>
                    <span>&#8377;{formatINR(pricing.tcs)}/-</span>
                  </div>
                </div>

                <div className="dbk-bill-total">
                  <span>To Pay</span>
                  <span className="dbk-bill-topay">&#8377;{formatINR(pricing.toPay)}/-</span>
                </div>
              </div>

              <Voucher
                onApply={(v) => setAppliedVoucher(v)}
                onRemove={() => setAppliedVoucher(null)}
              />

              <div className="dbk-agree">
                <input
                  type="checkbox"
                  className="dbk-checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                />
                <p className="dbk-agree-text">
                  I agree to the <Link to="/legal">Payment Terms</Link>,{" "}
                  <Link to="/legal">Cancellation Policy</Link>, General{" "}
                  <Link to="/legal">Terms &amp; Conditions</Link>, and{" "}
                  <Link to="/legal">Privacy Policy</Link>.
                </p>
              </div>
            </div>

            <div className="dbk-rail-bottom">
              <div className="dbk-rail-tags">
                <img src={`${A}icon-your-trips.svg`} width={14} height={14} alt="" aria-hidden />
                <span className="dbk-rail-tag">Europe Trip</span>
                <span className="dbk-rail-dot" aria-hidden />
                <span className="dbk-rail-tag">{data.dateRange}</span>
                {travelers > 0 && (
                  <>
                    <span className="dbk-rail-dot" aria-hidden />
                    <span className="dbk-rail-tag">
                      {travelers} {travelers === 1 ? "Traveller" : "Travellers"}
                    </span>
                  </>
                )}
              </div>

              <div className="dbk-rail-cta">
                <div className="dbk-rail-price-col">
                  <span className="dbk-rail-price">&#8377;{formatINR(pricing.toPay)}/-</span>
                  <button className="dbk-rail-fee" type="button">
                    <span>+</span>
                    <img src={`${A}icon-info-sm.svg`} width={16} height={16} alt="" aria-hidden />
                    <span>Convenience fee</span>
                  </button>
                </div>
                <button
                  className="dbk-rail-btn"
                  type="button"
                  disabled={!agreed}
                  onClick={() => setReviewOpen(true)}
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="dbk-footer">
        <p>&copy; WANDERON EXPERIENCES PVT LTD, All rights reserved.</p>
      </footer>
    </div>
  );
}
