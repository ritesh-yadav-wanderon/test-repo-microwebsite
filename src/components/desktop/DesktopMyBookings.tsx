import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBooking } from "../../context/BookingContext";
import { ProfileRail, ProfileHeader } from "./DesktopProfile";
import ProfileWatermark from "./ProfileWatermark";
import {
  SAMPLE_BOOKINGS,
  type BookingSummary,
  type BookingsTabKey,
} from "../../data/myBookings";
import "./DesktopProfile.css";
import "./DesktopMyBookings.css";

const A = "/figma/booking/";
const M = "/figma/my-booking/";
const TRIP_THUMB = "/figma/my-booking/trip-thumb.png";

/** Desktop tab bar adds an "Ongoing" bucket between Upcoming and Completed. */
type PanelTab = BookingsTabKey | "ongoing";

const PANEL_TABS: { key: PanelTab; label: string }[] = [
  { key: "upcoming", label: "Upcoming" },
  { key: "ongoing", label: "Ongoing" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

/** Desktop "My Bookings" — profile shell (header + left menu rail) with a
 *  bookings panel of ticket-style cards on the right. Figma 3996:12266. */
export default function DesktopMyBookings() {
  const navigate = useNavigate();
  const { statusOf } = useBooking();
  const [tab, setTab] = useState<PanelTab>("upcoming");

  const effectiveTab = (b: BookingSummary): BookingsTabKey =>
    statusOf(b.ref) === "cancelled" ? "cancelled" : b.category;

  const visible =
    tab === "ongoing" ? [] : SAMPLE_BOOKINGS.filter((b) => effectiveTab(b) === tab);
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
    <div className="dpr dmbl">
      {/* ── Header (same as the desktop profile page) ────────── */}
      <ProfileHeader />

      <div className="dpr-body">
        <ProfileRail />

        {/* ── Bookings panel ─────────────────────────────────── */}
        <div className="dmbl-panel">
          <nav className="dmbl-tabs" aria-label="Booking status">
            {PANEL_TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                className={`dmbl-tab${tab === t.key ? " dmbl-tab--active" : ""}`}
                onClick={() => setTab(t.key)}
              >
                {t.label}
              </button>
            ))}
          </nav>

          {visible.length === 0 ? (
            <p className="dmbl-empty">No {tab} bookings yet.</p>
          ) : (
            <div className="dmbl-grid">
              {visible.map((b) => {
                const pendingCancel = statusOf(b.ref) === "cancellation_requested";
                return (
                  <div className="dmbl-card-wrap" key={b.ref + b.dateRange}>
                    <button className="dmbl-card" type="button" onClick={() => openBooking(b)}>
                      <div className="dmbl-card-head">
                        <span>Booking ID: {b.ref}</span>
                        <span>Travellers: {b.travelers}</span>
                      </div>
                      <div className="dmbl-card-rule" aria-hidden />

                      <div className="dmbl-card-trip">
                        <img className="dmbl-card-thumb" src={TRIP_THUMB} alt="" loading="lazy" />
                        <p className="dmbl-card-title">{b.tripTitle}</p>
                      </div>
                      <div className="dmbl-card-rule" aria-hidden />

                      <div className="dmbl-card-dates">
                        <span className="dmbl-card-duration">
                          <img src={`${M}icon-luggage.svg`} width={8} height={12} alt="" aria-hidden />
                          {b.dateRange}
                        </span>
                        <span className="dmbl-card-nights">{b.durationLabel}</span>
                      </div>

                      <div className="dmbl-card-route">
                        <div className="dmbl-card-place">
                          <span className="dmbl-card-place-tag">
                            <img src={`${A}icon-location.svg`} width={8} height={10} alt="" aria-hidden />
                            Pick Up
                          </span>
                          <span className="dmbl-card-place-name">{b.pickUp}</span>
                        </div>
                        <div className="dmbl-card-place dmbl-card-place--right">
                          <span className="dmbl-card-place-tag">
                            <img src={`${A}icon-location.svg`} width={8} height={10} alt="" aria-hidden />
                            Drop
                          </span>
                          <span className="dmbl-card-place-name">{b.drop}</span>
                        </div>
                      </div>

                      <span className="dmbl-status">{b.paymentStatus}</span>

                      {pendingCancel ? (
                        <div className="dmbl-cancel-note">Cancel request is in progress</div>
                      ) : (
                        <div className="dmbl-info-tag">
                          <img src={`${A}icon-info-yellow.svg`} width={16} height={16} alt="" aria-hidden />
                          <p>
                            Complete KYC, Co-Traveller Details and the remaining due amount to
                            confirm your booking.
                          </p>
                        </div>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {cancellationRequests.length > 0 && (
            <button
              className="dmbl-cancel-btn"
              type="button"
              onClick={() => openCancellation(cancellationRequests[0].ref)}
            >
              <img src={`${A}icon-bag-inactive.svg`} width={16} height={16} alt="" aria-hidden />
              <span>View Cancellation Request ({cancellationRequests.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Grey sign-off — page level, aligned with the content gutter */}
      <ProfileWatermark />

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer className="dpr-footer">
        <p>&copy; WANDERON EXPERIENCES PVT LTD, All rights reserved.</p>
      </footer>
    </div>
  );
}
