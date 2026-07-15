import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LoginSheet from "../LoginSheet/LoginSheet";
import "./BatchesSheet.css";

const ASSETS = "/figma/batches/";

export interface BatchItem {
  startDate: string; // ISO YYYY-MM-DD
  endDate?: string;
  groupSize?: number;
  seatsLeft?: number | null; // null = sold out
  fillingFast?: boolean;
  interested?: number;
  price: string;
}

interface BatchesSheetProps {
  isOpen: boolean;
  onClose: () => void;
  tripTitle?: string;
  batches?: BatchItem[];
  nights?: number;
}

const WEEK_DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

/** Sample batches matching Figma 3044:23808 */
export const DEFAULT_BATCHES: BatchItem[] = [
  { startDate: "2026-07-09", groupSize: 50, seatsLeft: 4, interested: 12, price: "169990" },
  { startDate: "2026-07-12", groupSize: 50, seatsLeft: null, interested: 12, price: "169990" },
  { startDate: "2026-07-18", groupSize: 50, seatsLeft: 4, fillingFast: true, interested: 12, price: "169990" },
  { startDate: "2026-07-22", groupSize: 50, seatsLeft: 8, interested: 9, price: "169990" },
  { startDate: "2026-08-06", groupSize: 50, seatsLeft: 4, interested: 15, price: "174990" },
  { startDate: "2026-08-12", groupSize: 50, seatsLeft: null, interested: 20, price: "174990" },
  { startDate: "2026-08-18", groupSize: 50, seatsLeft: 2, fillingFast: true, interested: 18, price: "174990" },
  { startDate: "2026-09-06", groupSize: 50, seatsLeft: 12, interested: 7, price: "164990" },
  { startDate: "2026-09-12", groupSize: 50, seatsLeft: 6, interested: 11, price: "164990" },
  { startDate: "2026-10-06", groupSize: 50, seatsLeft: 10, interested: 5, price: "159990" },
  { startDate: "2026-11-09", groupSize: 50, seatsLeft: 14, interested: 4, price: "154990" },
  { startDate: "2026-12-12", groupSize: 50, seatsLeft: 8, interested: 8, price: "159990" },
];

function addDays(iso: string, days: number): Date {
  const d = new Date(iso + "T00:00:00");
  d.setDate(d.getDate() + days);
  return d;
}

function fmtFull(d: Date) {
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function monthKey(iso: string) {
  return iso.slice(0, 7);
}

function monthLabel(key: string) {
  const [y, m] = key.split("-").map(Number);
  const d = new Date(y, m - 1, 1);
  return (
    d.toLocaleDateString("en-GB", { month: "short" }) +
    "-" +
    String(y).slice(2)
  );
}

function formatPrice(price: string) {
  const n = Number(String(price).replace(/,/g, ""));
  if (Number.isNaN(n)) return price;
  return n.toLocaleString("en-IN");
}

type BatchStatus = "available" | "sold-out" | "filling";

function getStatus(batch: BatchItem): BatchStatus {
  if (batch.seatsLeft === null || batch.seatsLeft === 0) return "sold-out";
  if (batch.fillingFast) return "filling";
  return "available";
}

function BatchCard({
  batch,
  nights,
  onBook,
}: {
  batch: BatchItem;
  nights: number;
  onBook: (batch: BatchItem, startDate: Date, endDate: Date) => void;
}) {
  const startDate = new Date(batch.startDate + "T00:00:00");
  const endDate = batch.endDate
    ? new Date(batch.endDate + "T00:00:00")
    : addDays(batch.startDate, nights);
  const status = getStatus(batch);
  const isSoldOut = status === "sold-out";
  const groupSize = batch.groupSize ?? 50;
  const interested = batch.interested ?? 12;

  const badgeLabel = isSoldOut
    ? "Sold Out"
    : `${batch.seatsLeft} Seats Left`;

  return (
    <div className="bsh-card">
      <div className="bsh-card-dates">
        <div className="bsh-card-cal-icon" aria-hidden>
          <img
            src={`${ASSETS}icon-calendar.svg`}
            width={16}
            height={16}
            alt=""
          />
        </div>
        <div className="bsh-card-dates-inner">
          <div className="bsh-card-date-block">
            <span className="bsh-card-date-main">{fmtFull(startDate)}</span>
            <span className="bsh-card-date-day">
              {WEEK_DAYS[startDate.getDay()]}
            </span>
          </div>
          <div className="bsh-card-dash" aria-hidden>
            <img src={`${ASSETS}dash-line.svg`} alt="" />
          </div>
          <div className="bsh-card-date-block bsh-card-date-block--end">
            <span className="bsh-card-date-main">{fmtFull(endDate)}</span>
            <span className="bsh-card-date-day">
              {WEEK_DAYS[endDate.getDay()]}
            </span>
          </div>
        </div>
      </div>

      <div className="bsh-card-sep" aria-hidden>
        <img src={`${ASSETS}card-sep.svg`} alt="" />
      </div>

      <div className="bsh-card-group-row">
        <div className="bsh-card-group-left">
          <div className="bsh-card-groups-icon" aria-hidden>
            <img
              src={`${ASSETS}icon-groups.svg`}
              width={16}
              height={16}
              alt=""
            />
          </div>
          <span className="bsh-card-group-text">
            Group Size <span>{groupSize}</span>
          </span>
          <span className={`bsh-card-badge bsh-card-badge--${status}`}>
            {badgeLabel}
          </span>
        </div>
        {status === "filling" && (
          <span className="bsh-card-filling">Filling Fast</span>
        )}
      </div>

      <div className="bsh-card-people">
        <div className="bsh-card-avatars" aria-hidden>
          <div className="bsh-card-avatar">
            <img src={`${ASSETS}avatar-person.svg`} alt="" />
          </div>
          <div className="bsh-card-avatar">
            <img src={`${ASSETS}avatar-woman.svg`} alt="" />
          </div>
        </div>
        <span className="bsh-card-people-text">
          +{interested} people interested in this trip
        </span>
      </div>

      <div className="bsh-card-footer">
        <div className="bsh-card-price">
          <span className="bsh-card-price-label">Starting Price:</span>
          <span className="bsh-card-price-amount">
            &#8377; {formatPrice(batch.price)}/-
          </span>
        </div>
        <button
          type="button"
          className={`bsh-card-cta${isSoldOut ? " bsh-card-cta--sold" : ""}`}
          disabled={isSoldOut}
          onClick={() => onBook(batch, startDate, endDate)}
        >
          Book Trip
        </button>
      </div>
    </div>
  );
}

export default function BatchesSheet({
  isOpen,
  onClose,
  tripTitle = "Ladakh Trip",
  batches = DEFAULT_BATCHES,
  nights = 10,
}: BatchesSheetProps) {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [hasOpened, setHasOpened] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [loginOpen, setLoginOpen] = useState(false);
  const [pendingBooking, setPendingBooking] = useState<Record<string, unknown> | null>(null);

  const goToBooking = (state: Record<string, unknown>) => {
    navigate("/booking", { state });
  };

  const handleBook = (batch: BatchItem, startDate: Date, endDate: Date) => {
    const fmtShort = (d: Date) =>
      d.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    const bookingState = {
      tripTitle,
      tripName: tripTitle,
      dateRange: `${fmtShort(startDate)} - ${fmtShort(endDate)}`,
      durationLabel: `${nights}N/${nights + 1}D`,
      perPerson: formatPrice(batch.price),
      travelers: 2,
    };

    if (isLoggedIn) {
      onClose();
      goToBooking(bookingState);
      return;
    }

    // Not logged in: stash the booking, close this sheet, open login first.
    setPendingBooking(bookingState);
    onClose();
    setLoginOpen(true);
  };

  const handleLoginSuccess = () => {
    setLoginOpen(false);
    if (pendingBooking) {
      const state = pendingBooking;
      setPendingBooking(null);
      goToBooking(state);
    }
  };

  useEffect(() => {
    if (isOpen) setHasOpened(true);
  }, [isOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const months = useMemo(() => {
    const seen = new Set<string>();
    const result: string[] = [];
    batches.forEach((b) => {
      const k = monthKey(b.startDate);
      if (!seen.has(k)) {
        seen.add(k);
        result.push(k);
      }
    });
    return result;
  }, [batches]);

  const activeMonth = selectedMonth || months[0] || "";

  const filteredBatches = useMemo(
    () => batches.filter((b) => monthKey(b.startDate) === activeMonth),
    [batches, activeMonth]
  );

  if (!hasOpened) return null;

  return (
    <>
    <div
      className={`bsh-overlay${isOpen ? " bsh-overlay--open" : ""}`}
      aria-hidden={!isOpen}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`bsh-sheet${isOpen ? " bsh-sheet--open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Batches"
      >
        <div className="bsh-header">
          <div className="bsh-header-left">
            <button
              className="bsh-back"
              type="button"
              aria-label="Back"
              onClick={onClose}
            >
              <img
                src={`${ASSETS}icon-arrow-back.svg`}
                width={24}
                height={24}
                alt=""
                aria-hidden
              />
            </button>
            <span className="bsh-title">Batches</span>
          </div>
          <button
            className="bsh-close"
            type="button"
            aria-label="Close"
            onClick={onClose}
          >
            <img
              src={`${ASSETS}icon-close.svg`}
              width={30}
              height={30}
              alt=""
              aria-hidden
            />
          </button>
        </div>

        <div className="bsh-tag-bar">
          <div className="bsh-tag-icon" aria-hidden>
            <img
              src={`${ASSETS}icon-your-trips.svg`}
              width={14}
              height={14}
              alt=""
            />
          </div>
          <span className="bsh-tag-label">{tripTitle}</span>
        </div>

        {months.length > 0 && (
          <div className="bsh-months">
            {months.map((m) => {
              const isActive = m === activeMonth;
              return (
                <button
                  key={m}
                  className={`bsh-month-tab${isActive ? " bsh-month-tab--active" : ""}`}
                  type="button"
                  onClick={() => setSelectedMonth(m)}
                >
                  <span>{monthLabel(m)}</span>
                  {isActive && (
                    <span className="bsh-month-clear" aria-hidden>
                      <img
                        src={`${ASSETS}icon-close-chip.svg`}
                        width={16}
                        height={16}
                        alt=""
                      />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        <div className="bsh-cards">
          {filteredBatches.map((batch) => (
            <BatchCard
              key={batch.startDate}
              batch={batch}
              nights={nights}
              onBook={handleBook}
            />
          ))}
        </div>
      </div>
    </div>

    <LoginSheet
      isOpen={loginOpen}
      onClose={() => setLoginOpen(false)}
      onSuccess={handleLoginSuccess}
    />
    </>
  );
}
