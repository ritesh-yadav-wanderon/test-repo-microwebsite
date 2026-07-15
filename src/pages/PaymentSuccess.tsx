import { useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import PaymentConfirmation from "../components/PaymentConfirmation/PaymentConfirmation";
import "./PaymentSuccess.css";

const M = "/figma/my-booking/";
const TRIP_THUMB = "/figma/trip-hero/hero-bg.png";

/** How long the confirmation stays up before moving to the booking. */
const REDIRECT_MS = 5000;

interface SuccessState {
  ref?: string;
  travellerName?: string;
  amountPaid?: string;
  paidAt?: string;
  paymentMethod?: string;
  tripTitle?: string;
  startDate?: string;
  durationLabel?: string;
  travelers?: number;
  /** Show the "Complete KYC" CTA (defaults to true). */
  showCta?: boolean;
  /** Where to go after the delay (defaults to the booking detail). */
  nextPath?: string;
  /** State forwarded to nextPath. */
  nextState?: Record<string, unknown>;
  [key: string]: unknown;
}

const DEFAULTS = {
  ref: "WON457896",
  travellerName: "Ruhani",
  amountPaid: "4,78,535",
  paidAt: "10 Jun, 11:10 am",
  paymentMethod: "UPI",
  tripTitle:
    "11 Days Wanderon Backpacking Trip to Europe - France, Netherlands, Germany, Czechia",
  startDate: "23 July",
  durationLabel: "10N/11D",
  travelers: 4,
};

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  const state = (location.state as SuccessState) || {};
  const data = { ...DEFAULTS, ...state };
  const ref = state.ref || params.ref || DEFAULTS.ref;

  const showCta = state.showCta !== false;
  const nextPath = state.nextPath || `/bookings/${ref}`;
  const nextState = state.nextState || { ...state, ref };

  // After the confirmation delay, hand off to the next view. The booking
  // snapshot is forwarded so the destination renders with the paid values.
  useEffect(() => {
    const goNext = () =>
      navigate(nextPath, { replace: true, state: nextState });
    const timer = window.setTimeout(goNext, REDIRECT_MS);
    return () => window.clearTimeout(timer);
  }, [navigate, nextPath, nextState]);

  const handleContinue = () =>
    navigate(nextPath, { replace: true, state: nextState });

  return (
    <div className="ps-page">
      <div className="ps-inner">
        <div className="ps-header">
          <div className="ps-avatars">
            <span className="ps-avatar ps-avatar--check">
              <span className="ps-avatar-inner">
                <img src={`${M}check-circle.svg`} width={20} height={20} alt="" aria-hidden />
              </span>
            </span>
            <span className="ps-avatar">
              <span className="ps-avatar-inner">
                <img src={`${M}avatar.png`} alt="" aria-hidden />
              </span>
            </span>
          </div>

          <p className="ps-name">{data.travellerName.toUpperCase()}</p>
          <p className="ps-amount">&#8377;{data.amountPaid}/-</p>
          <p className="ps-meta">
            <span className="ps-time">{data.paidAt} </span>
            <span className="ps-method">| {data.paymentMethod}</span>
          </p>
        </div>

        <PaymentConfirmation
          reference={ref}
          travelers={data.travelers}
          tripTitle={data.tripTitle}
          tripDate={`${data.startDate} | ${data.durationLabel}`}
          thumb={TRIP_THUMB}
          animate
        />
      </div>

      {showCta && (
        <div className="ps-cta-bar">
          <button className="ps-cta" type="button" onClick={handleContinue}>
            Complete KYC
          </button>
        </div>
      )}
    </div>
  );
}
