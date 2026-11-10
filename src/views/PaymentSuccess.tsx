import { useEffect } from "react";
import PaymentConfirmation from "@/components/PaymentConfirmation";
import { useIsDesktop } from "@/hooks/useIsDesktop";
import { useAppNav } from "@/hooks/useAppNav";
import { useBookingDraftData, draftToBookingView } from "@/hooks/useBookingDraftData";
import type { BookingDraft } from "@/repositories";
import "./PaymentSuccess.css";
import CtaButton from "@/components/ui/CtaButton";

const M = "/figma/my-booking/";
const A = "/figma/booking/";
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

export interface PaymentSuccessViewProps {
  /** Route :ref param — a prop (not react-router's useParams()) so this
   *  view is shared as-is with Next.js. */
  refParam: string;
  /** React Router history state from the same-tab checkout hand-off — the
   *  fast path, no fetch needed. Undefined on a refresh/direct link (or
   *  always under Next.js, which fetches server-side instead). */
  navState?: SuccessState | null;
  /** Already-fetched by Next.js's page.tsx server-side. */
  initialData?: BookingDraft | null;
}

/** Pure presentational shell — no react-router import — shared as-is with
 *  Next.js. Navigation goes through useAppNav() directly. */
export function PaymentSuccessView({ refParam, navState, initialData }: PaymentSuccessViewProps) {
  const isDesktop = useIsDesktop();
  const nav = useAppNav();

  const state = navState || {};
  const ref = state.ref || refParam || DEFAULTS.ref;
  // Refresh/direct-link fix: only fetch when there's no faster source
  // (same-tab nav state) already telling us what to show.
  const { draft } = useBookingDraftData(ref, !!navState, initialData);
  const data = { ...DEFAULTS, ...draftToBookingView(draft), ...state };

  const showCta = state.showCta !== false;
  const nextPath = state.nextPath || `/bookings/${ref}`;
  const nextState = state.nextState || { ...state, ref };

  // After the confirmation delay, hand off to the next view. The booking
  // snapshot is forwarded so the destination renders with the paid values.
  useEffect(() => {
    const goNext = () => nav.replace(nextPath, { state: nextState });
    const timer = window.setTimeout(goNext, REDIRECT_MS);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nextPath, nextState]);

  const handleContinue = () => nav.replace(nextPath, { state: nextState });

  return (
    <div className={`ps-page${isDesktop ? " ps-page--desktop" : ""}`}>
      {/* Desktop-only header bar (Figma 6600:37853) */}
      {isDesktop && (
        <header className="ps-dheader">
          <button
            className="ps-dheader-back"
            type="button"
            aria-label="Back"
            onClick={handleContinue}
          >
            <img src={`${A}icon-arrow-back.svg`} width={24} height={24} alt="" aria-hidden />
          </button>
          <span className="ps-dheader-title">Payment Confirmations</span>
        </header>
      )}

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
          <CtaButton className="ps-cta" onClick={handleContinue}>
            Complete KYC
          </CtaButton>
        </div>
      )}
    </div>
  );
}
