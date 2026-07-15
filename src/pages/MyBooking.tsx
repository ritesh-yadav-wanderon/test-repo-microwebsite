import { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import FooterMessage from "../components/FooterMessage/FooterMessage";
import CoTravellerSheet, {
  type CoTravellerData,
} from "../components/CoTravellerSheet/CoTravellerSheet";
import CancelBookingSheet from "../components/CancelBookingSheet/CancelBookingSheet";
import PaymentSheet from "../components/PaymentSheet/PaymentSheet";
import { useBooking } from "../context/BookingContext";
import { BILL_ITEMS, TOTAL_TRIP_COST } from "../data/bookingBill";
import "./MyBooking.css";

const A = "/figma/booking/";
const M = "/figma/my-booking/";
const PROF = "/figma/my-profile/";
const ITIN = "/figma/itin-section/";
const CT = "/figma/co-travellers/";
const PAY = "/figma/payments/";
const TRIP_THUMB = "/figma/trip-hero/hero-bg.png";

/** Recorded transactions for this booking. */
const TRANSACTIONS: { ref: string; amount: string; date: string }[] = [
  { ref: "50100200913470", amount: "\u20B9 4,00,000", date: "1 APR 2025" },
  { ref: "50100200913470", amount: "\u20B9 4,00,000", date: "1 APR 2025" },
];

type TabKey = "kyc" | "co" | "payments";

interface BookingView {
  ref?: string;
  travellerName?: string;
  amountPaid?: string;
  paidAt?: string;
  paymentMethod?: string;
  tripTitle?: string;
  tripName?: string;
  startDate?: string;
  durationLabel?: string;
  travelers?: number;
  dueBalance?: string;
  pickUp?: string;
  drop?: string;
  pickUpDate?: string;
  dropDate?: string;
  /** Play the payment-confirmation animation (set only when arriving from checkout). */
  justPaid?: boolean;
  /** Where the user came from: "list" (My Bookings) drives back-button target. */
  from?: "list" | "checkout";
  /** Initial tab to show (e.g. "payments" after clearing a due balance). */
  initialTab?: TabKey;
}

const DEFAULTS: Required<Omit<BookingView, "justPaid" | "from" | "initialTab">> = {
  ref: "WON457896",
  travellerName: "Ruhani",
  amountPaid: "4,78,535",
  paidAt: "10 Jun, 11:10 am",
  paymentMethod: "UPI",
  tripTitle:
    "11 Days Wanderon Backpacking Trip to Europe - France, Netherlands, Germany, Czechia",
  tripName: "Europe Trip",
  startDate: "23 July",
  durationLabel: "10N/11D",
  travelers: 4,
  dueBalance: "7,95,116",
  pickUp: "Paris Airport",
  drop: "Prague Airport",
  pickUpDate: "23 July 2026",
  dropDate: "3 Aug 2026",
};

/** Required KYC fields validated on save. */
const REQUIRED_FIELDS = [
  "firstName",
  "gender",
  "dob",
  "whatsapp",
  "email",
  "addr1",
  "country",
  "pincode",
  "city",
  "stateName",
  "aadhaar",
  "passportNo",
] as const;

export default function MyBooking() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const state = (location.state as BookingView) || {};
  const data = { ...DEFAULTS, ...state };
  const ref = state.ref || params.ref || DEFAULTS.ref;
  // Only show the "Pay Due Balance" bar when something is actually due.
  const hasDue = Number(String(data.dueBalance).replace(/[^\d.]/g, "")) > 0;

  const [tab, setTab] = useState<TabKey>(state.initialTab ?? "kyc");

  // Pay-due-balance sheet.
  const [payOpen, setPayOpen] = useState(false);

  // Prefilled KYC values (editable).
  const [firstName, setFirstName] = useState(data.travellerName);
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("male");
  const [dob, setDob] = useState("");
  const [whatsapp, setWhatsapp] = useState("9401269681");
  const [altNumber, setAltNumber] = useState("");
  const [email, setEmail] = useState("shivam.trivedi@wanderon.in");
  const [addr1, setAddr1] = useState("Building No. - 436");
  const [addr2, setAddr2] = useState("Phase- 4, Sector- 18");
  const [country, setCountry] = useState("India");
  const [pincode, setPincode] = useState("122017");
  const [city, setCity] = useState("Gurugram");
  const [stateName, setStateName] = useState("Haryana");
  const [aadhaar, setAadhaar] = useState("");
  const [passportNo, setPassportNo] = useState("");
  const [passportValid, setPassportValid] = useState("");

  // Saved (read-only) state + validation errors.
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState<Set<string>>(new Set());

  // Co-travellers list + add sheet.
  const [coTravellers, setCoTravellers] = useState<CoTravellerData[]>([]);
  const [coSheetOpen, setCoSheetOpen] = useState(false);
  const coPending = Math.max(0, data.travelers - 1 - coTravellers.length);

  // Cancel-booking confirmation sheet + persisted booking status.
  const [cancelOpen, setCancelOpen] = useState(false);
  const { statusOf, requestCancellation } = useBooking();
  const bookingStatus = statusOf(ref);

  // Back behaviour depends on how we got here. From the My Bookings list we let
  // natural history work (back -> list -> profile). Arriving straight from
  // checkout, history points at the payment flow, so we trap it to the homepage.
  const fromList = state.from === "list";
  const goBack = () => (fromList ? navigate(-1) : navigate("/", { replace: true }));

  useEffect(() => {
    if (fromList) return; // natural back (to the list) is already correct
    window.history.pushState(null, "", window.location.href);
    const onPopState = () => navigate("/", { replace: true });
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [fromList, navigate]);

  // Snapshot of this booking passed to the Cancellation screen.
  const cancellationState = {
    tripTitle: data.tripTitle,
    tripDuration: `${data.pickUpDate} - ${data.dropDate} | ${data.durationLabel}`,
    pickUp: data.pickUp,
    pickUpDate: data.pickUpDate,
    drop: data.drop,
    dropDate: data.dropDate,
    travelers: data.travelers,
    amountPaid: data.amountPaid,
    dueBalance: data.dueBalance,
    primaryContact: {
      name: `${gender === "female" ? "Ms" : "Mr"} ${[firstName, lastName]
        .filter(Boolean)
        .join(" ")}`.trim(),
      phone: `+91-${whatsapp}`,
      email,
    },
    coTravellers,
  };

  const goToCancellation = () =>
    navigate(`/bookings/${ref}/cancellation`, { state: cancellationState });

  const values: Record<string, string> = {
    firstName,
    gender,
    dob,
    whatsapp,
    email,
    addr1,
    country,
    pincode,
    city,
    stateName,
    aadhaar,
    passportNo,
  };

  const handleSave = () => {
    const missing = new Set(
      REQUIRED_FIELDS.filter((k) => !values[k] || !values[k].trim())
    );
    setErrors(missing);
    if (missing.size > 0) {
      // Focus the first invalid field so the error is visible.
      const first = REQUIRED_FIELDS.find((k) => missing.has(k));
      if (first) document.getElementById(`mb-${first}`)?.focus();
      return;
    }
    setSaved(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const errCls = (key: string) => (errors.has(key) ? " mb-input--error" : "");

  // Read-only summary values.
  const title = gender === "female" ? "Ms." : "Mr.";
  const fullName = [title, firstName, middleName, lastName]
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
  const maskAadhaar = aadhaar
    ? `${aadhaar.replace(/\s/g, "").slice(0, 4)} XXXX XXXX`
    : "-";
  const maskPassport = passportNo ? `${passportNo.slice(0, 2)}XXXXXXX` : "-";

  // Booking-confirmation checklist: KYC saved, all co-travellers added, and no
  // pending due amount. The info tag reflects whatever is still outstanding.
  const pendingItems: string[] = [];
  if (!saved) pendingItems.push("KYC");
  if (coPending > 0) pendingItems.push("Co-Traveller Details");
  if (hasDue) pendingItems.push("the remaining due amount");

  const joinItems = (items: string[]) =>
    items.length <= 1
      ? items.join("")
      : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;

  const allComplete = pendingItems.length === 0;

  return (
    <div className={`mb-page${hasDue ? "" : " mb-page--no-due"}`}>
      {/* ── Top nav ── */}
      <header className="mb-nav">
        <div className="mb-nav-left">
          <button
            className="mb-nav-back"
            type="button"
            aria-label="Back"
            onClick={goBack}
          >
            <img src={`${A}icon-arrow-back.svg`} width={24} height={24} alt="" aria-hidden />
          </button>
          <div className="mb-nav-crumb">
            <span className="mb-nav-crumb-root">My Bookings</span>
            <span className="mb-nav-crumb-sep">/</span>
            <span className="mb-nav-crumb-id">{ref}</span>
          </div>
        </div>
        <button
          className="mb-nav-close"
          type="button"
          aria-label="Close"
          onClick={() => navigate("/profile")}
        >
          <img src={`${A}icon-close.svg`} width={30} height={30} alt="" aria-hidden />
        </button>
      </header>

      {/* ── Tabs ── */}
      <nav className="mb-tabs">
        {([
          { key: "kyc", label: "KYC Details" },
          { key: "co", label: "Co-Travellers" },
          { key: "payments", label: "Payments Details" },
        ] as { key: TabKey; label: string }[]).map((t) => (
          <button
            key={t.key}
            type="button"
            className={`mb-tab${tab === t.key ? " mb-tab--active" : ""}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <div className="mb-body">
        {/* ── Info tag (hidden once KYC / co-travellers / due balance are all done) ── */}
        {!allComplete && (
          <div className="mb-info-tag">
            <img src={`${A}icon-info-yellow.svg`} width={16} height={16} alt="" aria-hidden />
            <p>Complete {joinItems(pendingItems)} to confirm your booking.</p>
          </div>
        )}

        {tab === "kyc" && !saved && (
          <div className="mb-kyc">
            <p className="mb-kyc-title">KYC Details</p>
            <div className="mb-kyc-rule" aria-hidden />

            {/* Personal Information */}
            <div className="mb-subhead">
              <img src={`${A}icon-person2.svg`} width={20} height={20} alt="" aria-hidden />
              <span>Personal Information</span>
            </div>

            <div className="mb-form">
              <div className="mb-field">
                <input id="mb-firstName" className={`mb-input${errCls("firstName")}`} placeholder=" " value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                <label htmlFor="mb-firstName" className="mb-label">First Name*</label>
              </div>
              <div className="mb-field">
                <input id="mb-middleName" className="mb-input" placeholder=" " value={middleName} onChange={(e) => setMiddleName(e.target.value)} />
                <label htmlFor="mb-middleName" className="mb-label">Middle Name</label>
              </div>
              <div className="mb-field">
                <input id="mb-lastName" className="mb-input" placeholder=" " value={lastName} onChange={(e) => setLastName(e.target.value)} />
                <label htmlFor="mb-lastName" className="mb-label">Last Name</label>
              </div>

              <div className="mb-field">
                <select id="mb-gender" className={`mb-input mb-select${errCls("gender")}`} value={gender} onChange={(e) => setGender(e.target.value)}>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                </select>
                <label htmlFor="mb-gender" className="mb-label">Gender*</label>
                <span className="mb-field-icon" aria-hidden>
                  <img src={`${A}icon-arrow-drop.svg`} width={24} height={24} alt="" />
                </span>
              </div>

              <div className="mb-field">
                <input id="mb-dob" className={`mb-input${errCls("dob")}`} placeholder="DD-MM-YYYY" value={dob} onChange={(e) => setDob(e.target.value)} />
                <label htmlFor="mb-dob" className="mb-label">Date Of Birth*</label>
                <span className="mb-field-icon" aria-hidden>
                  <img src={`${A}icon-calendar-field.svg`} width={16} height={16} alt="" />
                </span>
              </div>

              {/* WhatsApp number */}
              <div className="mb-phone">
                <button className="mb-phone-code" type="button">
                  <span>IN +91</span>
                  <img src={`${A}icon-chevron-down.svg`} width={8} height={6} alt="" aria-hidden />
                </button>
                <div className="mb-field mb-field--grow">
                  <input id="mb-whatsapp" className={`mb-input${errCls("whatsapp")}`} inputMode="tel" placeholder=" " value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
                  <label htmlFor="mb-whatsapp" className="mb-label">WhatsApp Number*</label>
                  <span className="mb-field-icon" aria-hidden>
                    <img src={`${M}icon-whatsapp-check.svg`} width={16} height={16} alt="" />
                  </span>
                </div>
              </div>

              {/* Alternate number */}
              <div className="mb-phone">
                <button className="mb-phone-code" type="button">
                  <span>IN +91</span>
                  <img src={`${A}icon-chevron-down.svg`} width={8} height={6} alt="" aria-hidden />
                </button>
                <div className="mb-field mb-field--grow">
                  <input id="mb-altNumber" className="mb-input" inputMode="tel" placeholder=" " value={altNumber} onChange={(e) => setAltNumber(e.target.value)} />
                  <label htmlFor="mb-altNumber" className="mb-label">Alternate Number (optional)</label>
                </div>
              </div>

              <div className="mb-field">
                <input id="mb-email" className={`mb-input${errCls("email")}`} type="email" placeholder=" " value={email} onChange={(e) => setEmail(e.target.value)} />
                <label htmlFor="mb-email" className="mb-label">Email address*</label>
              </div>

              <div className="mb-field-group">
                <div className="mb-field">
                  <input id="mb-addr1" className={`mb-input${errCls("addr1")}`} placeholder=" " value={addr1} onChange={(e) => setAddr1(e.target.value)} />
                  <label htmlFor="mb-addr1" className="mb-label">Address Line 1</label>
                </div>
                <div className="mb-hint">
                  <img src={`${A}icon-info-grey.svg`} width={13} height={13} alt="" aria-hidden />
                  <span>Address is required for invoice generation.</span>
                </div>
              </div>

              <div className="mb-field">
                <input id="mb-addr2" className="mb-input" placeholder=" " value={addr2} onChange={(e) => setAddr2(e.target.value)} />
                <label htmlFor="mb-addr2" className="mb-label">Address Line 2</label>
              </div>

              <div className="mb-row2">
                <div className="mb-field">
                  <input id="mb-country" className={`mb-input${errCls("country")}`} placeholder=" " value={country} onChange={(e) => setCountry(e.target.value)} />
                  <label htmlFor="mb-country" className="mb-label">Country*</label>
                </div>
                <div className="mb-field">
                  <input id="mb-pincode" className={`mb-input${errCls("pincode")}`} placeholder=" " value={pincode} onChange={(e) => setPincode(e.target.value)} />
                  <label htmlFor="mb-pincode" className="mb-label">Pin Code*</label>
                </div>
              </div>

              <div className="mb-row2">
                <div className="mb-field">
                  <input id="mb-city" className={`mb-input${errCls("city")}`} placeholder=" " value={city} onChange={(e) => setCity(e.target.value)} />
                  <label htmlFor="mb-city" className="mb-label">City*</label>
                </div>
                <div className="mb-field">
                  <input id="mb-stateName" className={`mb-input${errCls("stateName")}`} placeholder=" " value={stateName} onChange={(e) => setStateName(e.target.value)} />
                  <label htmlFor="mb-stateName" className="mb-label">State*</label>
                </div>
              </div>
            </div>

            <div className="mb-kyc-strip" aria-hidden />

            {/* Aadhaar */}
            <div className="mb-doc-block">
              <p className="mb-doc-title">Aadhaar Card</p>
              <div className="mb-field">
                <input id="mb-aadhaar" className={`mb-input${errCls("aadhaar")}`} placeholder="Aadhaar Number*" value={aadhaar} onChange={(e) => setAadhaar(e.target.value)} />
              </div>
              <div className="mb-row2">
                <button className="mb-upload" type="button">
                  <span>Upload Aadhaar Front*</span>
                  <img src={`${M}icon-upload.svg`} width={20} height={20} alt="" aria-hidden />
                </button>
                <button className="mb-upload" type="button">
                  <span>Upload Aadhaar Back*</span>
                  <img src={`${M}icon-upload.svg`} width={20} height={20} alt="" aria-hidden />
                </button>
              </div>
            </div>

            {/* Passport */}
            <div className="mb-doc-block">
              <p className="mb-doc-title">Passport</p>
              <div className="mb-info-tag mb-info-tag--full">
                <img src={`${A}icon-info-yellow.svg`} width={16} height={16} alt="" aria-hidden />
                <p>Minimum passport validity upto 3rd January 2027.</p>
              </div>
              <div className="mb-row2">
                <div className="mb-field">
                  <input id="mb-passportNo" className={`mb-input${errCls("passportNo")}`} placeholder="Passport Number*" value={passportNo} onChange={(e) => setPassportNo(e.target.value)} />
                </div>
                <div className="mb-field">
                  <input id="mb-passportValid" className="mb-input" placeholder="Passport Valid Upto*" value={passportValid} onChange={(e) => setPassportValid(e.target.value)} />
                  <span className="mb-field-icon" aria-hidden>
                    <img src={`${A}icon-calendar-field.svg`} width={16} height={16} alt="" />
                  </span>
                </div>
              </div>
              <button className="mb-upload mb-upload--full" type="button">
                <span>Upload Passport Front*</span>
                <img src={`${M}icon-upload.svg`} width={20} height={20} alt="" aria-hidden />
              </button>
            </div>

            {errors.size > 0 && (
              <p className="mb-save-error" role="alert">
                Please fill the highlighted required fields.
              </p>
            )}
            <button className="mb-save" type="button" onClick={handleSave}>Save Details</button>
          </div>
        )}

        {tab === "kyc" && saved && (
          <div className="mb-kyc mb-saved">
            {/* Trip summary card */}
            <div className="mb-trip">
              <div className="mb-trip-banner">
                <img src={TRIP_THUMB} alt="" loading="lazy" />
              </div>
              <p className="mb-trip-title">{data.tripTitle}</p>

              <div className="mb-trip-route">
                <span className="mb-trip-loc">
                  <img src={`${A}icon-location.svg`} width={11} height={12} alt="" aria-hidden />
                  Pick Up
                </span>
                <span className="mb-trip-line" aria-hidden />
                <span className="mb-trip-dur">{data.durationLabel}</span>
                <span className="mb-trip-loc mb-trip-loc--right">
                  <img src={`${A}icon-location.svg`} width={11} height={12} alt="" aria-hidden />
                  Drop
                </span>
              </div>

              <div className="mb-trip-places">
                <div className="mb-trip-place">
                  <p className="mb-trip-place-name">{data.pickUp}</p>
                  <p className="mb-trip-place-date">{data.pickUpDate}</p>
                </div>
                <div className="mb-trip-place mb-trip-place--right">
                  <p className="mb-trip-place-name">{data.drop}</p>
                  <p className="mb-trip-place-date">{data.dropDate}</p>
                </div>
              </div>

              <button className="mb-download" type="button">
                <img src={`${ITIN}download-icon.svg`} width={16} height={16} alt="" aria-hidden />
                <span>Download Itinerary</span>
              </button>
            </div>

            <div className="mb-kyc-strip" aria-hidden />

            {/* Primary Traveller (read-only) */}
            <div className="mb-primary">
              <div className="mb-primary-head">
                <span className="mb-primary-title">Primary Traveller</span>
                <button
                  className="mb-primary-edit"
                  type="button"
                  aria-label="Edit KYC details"
                  onClick={() => setSaved(false)}
                >
                  <img src={`${PROF}icon-edit.svg`} width={24} height={24} alt="" aria-hidden />
                </button>
              </div>

              <div className="mb-detail-rows">
                <div className="mb-detail-row">
                  <span className="mb-detail-label">Name</span>
                  <span className="mb-detail-value">{fullName}</span>
                </div>
                <div className="mb-detail-row">
                  <span className="mb-detail-label">Gender</span>
                  <span className="mb-detail-value">
                    {gender.charAt(0).toUpperCase() + gender.slice(1)}
                  </span>
                </div>
                <div className="mb-detail-row">
                  <span className="mb-detail-label">WhatsApp Number</span>
                  <span className="mb-detail-value">+91-{whatsapp}</span>
                </div>
                <div className="mb-detail-row">
                  <span className="mb-detail-label">Alternate Number</span>
                  <span className="mb-detail-value">{altNumber || "-"}</span>
                </div>
                <div className="mb-detail-row">
                  <span className="mb-detail-label">Email ID</span>
                  <span className="mb-detail-value">{email}</span>
                </div>
                <div className="mb-detail-row mb-detail-row--start">
                  <span className="mb-detail-label">Address</span>
                  <span className="mb-detail-value mb-detail-value--multiline">
                    <span>{[addr1, addr2].filter(Boolean).join(", ")}</span>
                    <span>{[city, stateName, pincode].filter(Boolean).join(", ")}</span>
                  </span>
                </div>
                <div className="mb-detail-row">
                  <span className="mb-detail-label">Aadhaar Number</span>
                  <span className="mb-detail-value">{maskAadhaar}</span>
                </div>
                <div className="mb-detail-row">
                  <span className="mb-detail-label">Passport Number</span>
                  <span className="mb-detail-value">{maskPassport}</span>
                </div>
                <div className="mb-detail-row">
                  <span className="mb-detail-label">Passport Valid upto</span>
                  <span className="mb-detail-value">{passportValid || "-"}</span>
                </div>
              </div>
            </div>

            <div className="mb-kyc-strip" aria-hidden />

            {/* Actions */}
            <div className="mb-actions">
              <div className="mb-action-row">
                <button className="mb-action-btn" type="button">Things to Carry</button>
                <button className="mb-action-btn" type="button">FAQ</button>
              </div>
              {bookingStatus === "cancellation_requested" ? (
                <button
                  className="mb-action-btn mb-action-btn--full mb-action-btn--pending"
                  type="button"
                  onClick={goToCancellation}
                >
                  <span>View Cancellation Request</span>
                </button>
              ) : (
                <button
                  className="mb-action-btn mb-action-btn--full"
                  type="button"
                  onClick={() => setCancelOpen(true)}
                >
                  <img src={`${A}icon-bag-inactive.svg`} width={16} height={16} alt="" aria-hidden />
                  <span>Cancel Booking</span>
                </button>
              )}
            </div>
          </div>
        )}

        {tab === "co" && (
          <div className="mb-co">
            <div className="mb-co-head">
              <span className="mb-co-chip">Co-Travellers</span>
              <span className="mb-co-pending">{coPending} pending</span>
            </div>

            {coTravellers.map((c, i) => (
              <div className="mb-co-card" key={i}>
                <span className="mb-co-card-name">
                  {[c.firstName, c.middleName, c.lastName].filter(Boolean).join(" ")}
                </span>
                <img src={`${CT}icon-view.svg`} width={20} height={20} alt="" aria-hidden />
              </div>
            ))}

            <button
              className="mb-co-add"
              type="button"
              onClick={() => setCoSheetOpen(true)}
            >
              <img src={`${CT}icon-plus.svg`} width={20} height={20} alt="" aria-hidden />
              <span>Add Co-Traveller</span>
            </button>

            <div className="mb-co-empty">
              <div className="mb-co-empty-text">
                <p>Get your squad ready!</p>
                <p>Invite your co-travelers to onboard.</p>
              </div>
              <div className="mb-co-share">
                <span className="mb-co-share-label">Get Your Co-Travelers Onboard!</span>
                <button className="mb-co-share-btn" type="button">
                  <img src={`${CT}icon-people-add.svg`} width={20} height={20} alt="" aria-hidden />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {tab === "payments" && (
          <div className="mb-pay">
            {/* Bill summary */}
            <div className="mb-pay-billhead">
              <img src={`${PAY}icon-receipt.svg`} width={16} height={16} alt="" aria-hidden />
              <span>Bill Summary</span>
              <span className="mb-pay-billhead-sep" aria-hidden />
              <span>Travellers: {data.travelers}</span>
            </div>

            <div className="mb-pay-items">
              {BILL_ITEMS.map((it, i) => (
                <div className="mb-pay-item" key={i}>
                  <span className="mb-pay-item-label">{it.label}</span>
                  <span className="mb-pay-item-value">{it.value}</span>
                </div>
              ))}
            </div>

            <div className="mb-pay-item mb-pay-item--total">
              <span className="mb-pay-item-label">Total Trip Cost</span>
              <span className="mb-pay-item-value">&#8377;{TOTAL_TRIP_COST}/-</span>
            </div>

            <div className="mb-pay-rule" aria-hidden />

            <div className="mb-pay-totals">
              <div className="mb-pay-total-row">
                <span>Amount Paid:</span>
                <span>&#8377;{data.amountPaid}/-</span>
              </div>
              <div className="mb-pay-total-row">
                <span>Balance Due:</span>
                <span>&#8377;{data.dueBalance}/-</span>
              </div>
            </div>

            <div className="mb-kyc-strip" aria-hidden />

            {/* Transactions */}
            <div className="mb-pay-section">
              <div className="mb-pay-section-head">
                <img src={`${PAY}icon-account-balance.svg`} width={16} height={16} alt="" aria-hidden />
                <span>Transactions</span>
              </div>
              <div className="mb-pay-txns">
                {TRANSACTIONS.map((t, i) => (
                  <button className="mb-pay-txn" type="button" key={i}>
                    <div className="mb-pay-txn-top">
                      <span className="mb-pay-txn-ref">Reference No. {t.ref}</span>
                      <span className="mb-pay-txn-amount">
                        {t.amount}
                        <img src={`${A}icon-arrow-drop.svg`} width={24} height={14} alt="" aria-hidden />
                      </span>
                    </div>
                    <span className="mb-pay-txn-date">{t.date}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-kyc-strip" aria-hidden />

            {/* GST details */}
            <div className="mb-pay-section">
              <div className="mb-pay-section-head mb-pay-section-head--plain">
                <span>GST Details</span>
              </div>
              <div className="mb-pay-gst">
                <div className="mb-pay-gst-row">
                  <span className="mb-pay-gst-label">GST Number</span>
                  <span className="mb-pay-gst-value">01236363569</span>
                </div>
                <div className="mb-pay-gst-row">
                  <span className="mb-pay-gst-label">Business Name</span>
                  <span className="mb-pay-gst-value">WanderOn Experiences Pvt. ltd.</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <FooterMessage />
      </div>

      {/* ── Add Co-Traveller bottom sheet ── */}
      <CoTravellerSheet
        isOpen={coSheetOpen}
        index={coTravellers.length + 1}
        onClose={() => setCoSheetOpen(false)}
        onSave={(traveller) => {
          setCoTravellers((list) => [...list, traveller]);
          setCoSheetOpen(false);
        }}
      />

      {/* ── Cancel-booking confirmation sheet ── */}
      <CancelBookingSheet
        isOpen={cancelOpen}
        onClose={() => setCancelOpen(false)}
        onRequestCancellation={() => {
          requestCancellation(ref);
          goToCancellation();
        }}
        onContactSupport={() => {
          setCancelOpen(false);
          window.dispatchEvent(new Event("wanderon:open-enquire"));
        }}
      />

      {/* ── Bottom due bar (only when a balance is due) ── */}
      {hasDue && (
        <div className="mb-due-bar">
          <div className="mb-due-info">
            <span className="mb-due-label">Due Balance</span>
            <span className="mb-due-amount">&#8377;{data.dueBalance}/-</span>
          </div>
          <button
            className="mb-due-btn"
            type="button"
            onClick={() => setPayOpen(true)}
          >
            Pay Due Balance
          </button>
        </div>
      )}

      {/* ── Pay due balance: payment options + Razorpay ── */}
      <PaymentSheet
        isOpen={payOpen}
        onClose={() => setPayOpen(false)}
        mode="due"
        dueAmount={data.dueBalance}
        totalAmount={data.dueBalance}
        savedAmount="0"
        bookingReferenceId={ref}
        description={data.tripName}
        prefill={{
          name: [firstName, middleName, lastName].filter(Boolean).join(" ").trim(),
          email,
          contact: whatsapp,
        }}
        onPaymentSuccess={(result) => {
          setPayOpen(false);
          const r = (result || {}) as {
            amountPaid?: string;
            dueBalance?: string;
            paymentMethod?: string;
          };
          const now = new Date();
          const paidAt =
            now.toLocaleDateString("en-GB", { day: "numeric", month: "short" }) +
            ", " +
            now.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            });
          // Show the buttonless confirmation, then land on the Payments tab.
          // `replace` keeps the history clean so back still returns to the list.
          navigate(`/bookings/${ref}/success`, {
            replace: true,
            state: {
              ref,
              travellerName: firstName || "Traveller",
              amountPaid: r.amountPaid ?? data.dueBalance,
              dueBalance: r.dueBalance ?? "0",
              paymentMethod: r.paymentMethod ?? "UPI",
              paidAt,
              tripTitle: data.tripTitle,
              startDate: data.pickUpDate,
              durationLabel: data.durationLabel,
              travelers: data.travelers,
              showCta: false,
              nextPath: `/bookings/${ref}`,
              nextState: {
                ...data,
                ref,
                dueBalance: r.dueBalance ?? "0",
                initialTab: "payments",
                from: state.from,
              },
            },
          });
        }}
      />
    </div>
  );
}
