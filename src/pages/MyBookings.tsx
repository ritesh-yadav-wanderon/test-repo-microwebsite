import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FooterMessage from "../components/FooterMessage/FooterMessage";
import { useBooking } from "../context/BookingContext";
import "./MyBookings.css";

const A = "/figma/booking/";
const M = "/figma/my-booking/";
const TRIP_THUMB = "/figma/trip-hero/hero-bg.png";

type TabKey = "upcoming" | "completed" | "cancelled";

interface BookingSummary {
  ref: string;
  tripTitle: string;
  travelers: number;
  dateRange: string;
  durationLabel: string;
  pickUp: string;
  drop: string;
  paymentStatus: string;
  amountPaid: string;
  dueBalance: string;
  /** Base bucket before any cancellation status is applied. */
  category: "upcoming" | "completed";
}

const SAMPLE_BOOKINGS: BookingSummary[] = [
  {
    ref: "WON457896",
    tripTitle:
      "11 Days Wanderon Backpacking Trip to Europe - France, Netherlands, Germany, Czechia",
    travelers: 4,
    dateRange: "23 July 2026 - 3 Aug 2026",
    durationLabel: "10N/11D",
    pickUp: "Paris Airport",
    drop: "Prague Airport",
    paymentStatus: "Partially Paid",
    amountPaid: "8,00,000",
    dueBalance: "7,95,116",
    category: "upcoming",
  },
  {
    ref: "WON451288",
    tripTitle:
      "7 Days Wanderon Bali Escape - Ubud, Seminyak & Nusa Penida",
    travelers: 2,
    dateRange: "12 Sep 2026 - 18 Sep 2026",
    durationLabel: "6N/7D",
    pickUp: "Denpasar Airport",
    drop: "Denpasar Airport",
    paymentStatus: "Partially Paid",
    amountPaid: "1,20,000",
    dueBalance: "1,45,000",
    category: "upcoming",
  },
];

const TABS: { key: TabKey; label: string }[] = [
  { key: "upcoming", label: "Upcoming" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

export default function MyBookings() {
  const navigate = useNavigate();
  const { statusOf } = useBooking();
  const [tab, setTab] = useState<TabKey>("upcoming");

  const effectiveTab = (b: BookingSummary): TabKey =>
    statusOf(b.ref) === "cancelled" ? "cancelled" : b.category;

  const visible = SAMPLE_BOOKINGS.filter((b) => effectiveTab(b) === tab);
  const cancellationRequests = SAMPLE_BOOKINGS.filter(
    (b) => statusOf(b.ref) === "cancellation_requested"
  );

  const openBooking = (b: BookingSummary) => {
    const [pickUpDate, dropDate] = b.dateRange.split(" - ").map((s) => s.trim());
    navigate(`/bookings/${b.ref}`, {
      state: {
        from: "list",
        ref: b.ref,
        tripTitle: b.tripTitle,
        tripName: b.tripTitle,
        travelers: b.travelers,
        startDate: b.dateRange,
        durationLabel: b.durationLabel,
        pickUp: b.pickUp,
        drop: b.drop,
        pickUpDate: pickUpDate || b.dateRange,
        dropDate: dropDate || "",
        amountPaid: b.amountPaid,
        dueBalance: b.dueBalance,
      },
    });
  };

  const openCancellation = (ref: string) =>
    navigate(`/bookings/${ref}/cancellation`, { state: { ref } });

  return (
    <div className="mbl-page">
      {/* Top nav */}
      <header className="mbl-nav">
        <div className="mbl-nav-left">
          <button className="mbl-nav-back" type="button" aria-label="Back" onClick={() => navigate(-1)}>
            <img src={`${A}icon-arrow-back.svg`} width={24} height={24} alt="" aria-hidden />
          </button>
          <p className="mbl-nav-title">My Bookings</p>
        </div>
        <button className="mbl-nav-close" type="button" aria-label="Close" onClick={() => navigate("/profile")}>
          <img src={`${A}icon-close.svg`} width={30} height={30} alt="" aria-hidden />
        </button>
      </header>

      {/* Tabs */}
      <nav className="mbl-tabs">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            className={`mbl-tab${tab === t.key ? " mbl-tab--active" : ""}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <div className="mbl-body">
        {visible.length === 0 ? (
          <p className="mbl-empty">No {tab} bookings yet.</p>
        ) : (
          visible.map((b) => {
            const status = statusOf(b.ref);
            const pendingCancel = status === "cancellation_requested";
            return (
              <button
                className="mbl-card"
                type="button"
                key={b.ref + b.dateRange}
                onClick={() => openBooking(b)}
              >
                <div className="mbl-card-head">
                  <span className="mbl-card-id">Booking ID: {b.ref}</span>
                  <span className="mbl-card-travellers">Travellers: {b.travelers}</span>
                </div>
                <div className="mbl-card-rule" aria-hidden />

                <div className="mbl-card-trip">
                  <div className="mbl-card-thumb">
                    <img src={TRIP_THUMB} alt="" loading="lazy" />
                  </div>
                  <p className="mbl-card-title">{b.tripTitle}</p>
                </div>
                <div className="mbl-card-rule" aria-hidden />

                <div className="mbl-card-dates">
                  <span className="mbl-card-duration">
                    <img src={`${M}icon-luggage.svg`} width={8} height={12} alt="" aria-hidden />
                    {b.dateRange}
                  </span>
                  <span className="mbl-card-nights">{b.durationLabel}</span>
                </div>

                <div className="mbl-card-route">
                  <div className="mbl-card-place">
                    <span className="mbl-card-place-tag">
                      <img src={`${A}icon-location.svg`} width={8} height={10} alt="" aria-hidden />
                      Pick Up
                    </span>
                    <span className="mbl-card-place-name">{b.pickUp}</span>
                  </div>
                  <div className="mbl-card-place mbl-card-place--right">
                    <span className="mbl-card-place-tag">
                      <img src={`${A}icon-location.svg`} width={8} height={10} alt="" aria-hidden />
                      Drop
                    </span>
                    <span className="mbl-card-place-name">{b.drop}</span>
                  </div>
                </div>

                <span className="mbl-status">{b.paymentStatus}</span>

                {pendingCancel ? (
                  <div className="mbl-cancel-note">Cancel request is in progress</div>
                ) : (
                  <div className="mbl-info-tag">
                    <img src={`${A}icon-info-yellow.svg`} width={16} height={16} alt="" aria-hidden />
                    <p>Complete KYC, Co-Traveller Details and the remaining due amount to confirm your booking.</p>
                  </div>
                )}
              </button>
            );
          })
        )}

        {cancellationRequests.length > 0 && (
          <button
            className="mbl-cancel-btn"
            type="button"
            onClick={() => openCancellation(cancellationRequests[0].ref)}
          >
            <img src={`${A}icon-bag-inactive.svg`} width={16} height={16} alt="" aria-hidden />
            <span>View Cancellation Request ({cancellationRequests.length})</span>
          </button>
        )}

        <FooterMessage />
      </div>
    </div>
  );
}
