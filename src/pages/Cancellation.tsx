import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useBooking } from "../context/BookingContext";
import { BILL_ITEMS, TOTAL_TRIP_COST } from "../data/bookingBill";
import type { CoTravellerData } from "../components/CoTravellerSheet/CoTravellerSheet";
import "./Cancellation.css";

const A = "/figma/booking/";
const PAY = "/figma/payments/";
const C = "/figma/cancel/";
const TRIP_THUMB = "/figma/trip-hero/hero-bg.png";

interface Contact {
  name: string;
  phone: string;
  email: string;
}

interface CancellationState {
  tripTitle?: string;
  tripDuration?: string;
  pickUp?: string;
  pickUpDate?: string;
  drop?: string;
  dropDate?: string;
  travelers?: number;
  amountPaid?: string;
  dueBalance?: string;
  primaryContact?: Contact;
  coTravellers?: CoTravellerData[];
}

const DEFAULTS: Required<Omit<CancellationState, "coTravellers">> & {
  coTravellers: CoTravellerData[];
} = {
  tripTitle:
    "11 Days Wanderon Backpacking Trip to Europe - France, Netherlands, Germany, Czechia",
  tripDuration: "23 July 2026 - 3 Aug 2026 | 10N/11D",
  pickUp: "Paris Airport",
  pickUpDate: "23 July 2026",
  drop: "Prague Airport",
  dropDate: "3 Aug 2026",
  travelers: 4,
  amountPaid: "8,00,000",
  dueBalance: "7,95,116",
  primaryContact: {
    name: "Mr Badal Ranjan",
    phone: "+91-8696381684",
    email: "badal@wanderon.in",
  },
  coTravellers: [],
};

/** Sample co-travellers shown when the booking has none captured yet. */
const SAMPLE_COTRAVELLERS: Contact[] = [
  { name: "Mr Ritesh Yadav - 28(M)", phone: "+91-8696381684", email: "ritesh.yadav@wanderon.in" },
  { name: "Mr Rajnikant Kori - 26(M)", phone: "+91-9562458965", email: "rajnikant@wanderon.in" },
  { name: "Ms Isha Sharma - 22(F)", phone: "+91-8569745687", email: "isha@wanderon.in" },
];

function ageFromDob(dob: string): number | null {
  // Expects DD-MM-YYYY.
  const m = dob.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (!m) return null;
  const birth = new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]));
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const md = now.getMonth() - birth.getMonth();
  if (md < 0 || (md === 0 && now.getDate() < birth.getDate())) age--;
  return age >= 0 ? age : null;
}

function toContacts(list: CoTravellerData[]): Contact[] {
  return list.map((c) => {
    const title = c.gender === "female" ? "Ms" : "Mr";
    const genderInitial =
      c.gender === "female" ? "F" : c.gender === "other" ? "O" : "M";
    const age = ageFromDob(c.dob);
    const namePart = [c.firstName, c.middleName, c.lastName].filter(Boolean).join(" ");
    const suffix = age != null ? ` - ${age}(${genderInitial})` : ` (${genderInitial})`;
    return {
      name: `${title} ${namePart}${suffix}`.trim(),
      phone: c.whatsapp ? `+91-${c.whatsapp}` : "-",
      email: c.email || "-",
    };
  });
}

export default function Cancellation() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const { withdrawCancellation } = useBooking();

  const state = (location.state as CancellationState) || {};
  const data = { ...DEFAULTS, ...state };
  const ref = params.ref || "WON457896";

  const coTravellers: Contact[] =
    state.coTravellers && state.coTravellers.length > 0
      ? toContacts(state.coTravellers)
      : SAMPLE_COTRAVELLERS;

  const handleWithdraw = () => {
    withdrawCancellation(ref);
    navigate(`/bookings/${ref}`, { replace: true });
  };

  return (
    <div className="cx-page">
      {/* Top nav */}
      <header className="cx-nav">
        <div className="cx-nav-left">
          <button className="cx-nav-back" type="button" aria-label="Back" onClick={() => navigate(-1)}>
            <img src={`${A}icon-arrow-back.svg`} width={24} height={24} alt="" aria-hidden />
          </button>
          <div className="cx-nav-crumb">
            <span className="cx-nav-crumb-root">Cancellation</span>
            <span className="cx-nav-crumb-sep">/</span>
            <span className="cx-nav-crumb-id">{ref}</span>
          </div>
        </div>
        <button className="cx-nav-close" type="button" aria-label="Close" onClick={() => navigate(`/bookings/${ref}`)}>
          <img src={`${A}icon-close.svg`} width={30} height={30} alt="" aria-hidden />
        </button>
      </header>

      <div className="cx-body">
        {/* Trip banner */}
        <div className="cx-banner">
          <img src={TRIP_THUMB} alt="" loading="lazy" />
        </div>

        {/* Trip summary */}
        <div className="cx-trip">
          <p className="cx-trip-title">{data.tripTitle}</p>
          <p className="cx-trip-duration">
            <span className="cx-trip-duration-label">Trip Duration:</span>{" "}
            <span className="cx-trip-duration-value">{data.tripDuration}</span>
          </p>
          <div className="cx-trip-route">
            <div className="cx-trip-place">
              <p className="cx-trip-place-name">{data.pickUp}</p>
              <p className="cx-trip-place-date">{data.pickUpDate}</p>
              <p className="cx-trip-place-tag">Pick Up</p>
            </div>
            <div className="cx-trip-place cx-trip-place--right">
              <p className="cx-trip-place-name">{data.drop}</p>
              <p className="cx-trip-place-date">{data.dropDate}</p>
              <p className="cx-trip-place-tag">Drop</p>
            </div>
          </div>
        </div>

        <div className="cx-strip" aria-hidden />

        {/* Primary contact */}
        <div className="cx-section">
          <p className="cx-section-title">Primary Contact:</p>
          <p className="cx-contact-name">{data.primaryContact.name}</p>
          <div className="cx-contact-row">
            <span>{data.primaryContact.phone}</span>
            <span>{data.primaryContact.email}</span>
          </div>
        </div>

        <div className="cx-strip" aria-hidden />

        {/* Co-travellers */}
        <div className="cx-section">
          <p className="cx-section-title cx-section-title--inline">
            Co-Travelers: <span>{coTravellers.length}</span>
          </p>
          <div className="cx-cotravellers">
            {coTravellers.map((c, i) => (
              <div className="cx-cotraveller" key={i}>
                {i > 0 && <div className="cx-cotraveller-rule" aria-hidden />}
                <p className="cx-cotraveller-name">{c.name}</p>
                <div className="cx-contact-row">
                  <span>{c.phone}</span>
                  <span>{c.email}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="cx-strip" aria-hidden />

        {/* Bill summary */}
        <div className="cx-section">
          <div className="cx-billhead">
            <img src={`${PAY}icon-receipt.svg`} width={16} height={16} alt="" aria-hidden />
            <span>Bill Summary</span>
            <span className="cx-billhead-sep" aria-hidden />
            <span>Travellers: {data.travelers}</span>
          </div>

          <div className="cx-items">
            {BILL_ITEMS.map((it, i) => (
              <div className="cx-item" key={i}>
                <span className="cx-item-label">{it.label}</span>
                <span className="cx-item-value">{it.value}</span>
              </div>
            ))}
          </div>

          <div className="cx-item cx-item--total">
            <span className="cx-item-label">Total Trip Cost</span>
            <span className="cx-item-value">&#8377;{TOTAL_TRIP_COST}/-</span>
          </div>

          <div className="cx-rule" aria-hidden />

          <div className="cx-totals">
            <div className="cx-total-row">
              <span>Amount Paid:</span>
              <span>&#8377;{data.amountPaid}/-</span>
            </div>
            <div className="cx-total-row">
              <span>Balance Due:</span>
              <span>&#8377;{data.dueBalance}/-</span>
            </div>
          </div>
        </div>

        {/* Help card */}
        <div className="cx-help">
          <span className="cx-help-label">Need help with you booking?</span>
          <div className="cx-help-actions">
            <button className="cx-help-btn cx-help-btn--call" type="button" aria-label="Call support">
              <img src={`${C}icon-call.svg`} width={18} height={18} alt="" aria-hidden />
            </button>
            <button className="cx-help-btn cx-help-btn--wa" type="button" aria-label="WhatsApp support">
              <img src={`${C}icon-whatsapp.svg`} width={18} height={18} alt="" aria-hidden />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="cx-cta-bar">
        <button className="cx-cta" type="button" onClick={handleWithdraw}>
          Withdraw Cancellation Request
        </button>
      </div>
    </div>
  );
}
