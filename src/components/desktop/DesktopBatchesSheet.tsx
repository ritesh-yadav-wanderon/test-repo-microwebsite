import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LoginSheet from "../LoginSheet/LoginSheet";
import { DEFAULT_BATCHES, type BatchItem } from "../BatchesSheet/BatchesSheet";
import { setAppScrollLocked } from "../../utils/scroll";
import "./DesktopBatchesSheet.css";

/**
 * Desktop "View Trip / all departures" page — Figma 4375:7360.
 * Same booking/login logic as the mobile BatchesSheet; assets are reused from
 * the mobile /figma/batches design. Only the layout + styling come from Figma.
 */

const ASSETS = "/figma/batches/";

const WEEK_DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  tripTitle?: string;
  duration?: string;
  batches?: BatchItem[];
  nights?: number;
  ctaLabel?: string;
  onSelectBatch?: (batch: BatchItem, startDate: Date, endDate: Date) => void;
}

function addDays(iso: string, days: number): Date {
  const d = new Date(iso + "T00:00:00");
  d.setDate(d.getDate() + days);
  return d;
}
function fmtFull(d: Date) {
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
}
function monthKey(iso: string) {
  return iso.slice(0, 7);
}
function monthLabel(key: string) {
  const [y, m] = key.split("-").map(Number);
  const d = new Date(y, m - 1, 1);
  return d.toLocaleDateString("en-GB", { month: "short" }) + "-" + String(y).slice(2);
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

function DBatchCard({
  batch,
  nights,
  onBook,
  ctaLabel,
}: {
  batch: BatchItem;
  nights: number;
  onBook: (batch: BatchItem, startDate: Date, endDate: Date) => void;
  ctaLabel: string;
}) {
  const startDate = new Date(batch.startDate + "T00:00:00");
  const endDate = batch.endDate
    ? new Date(batch.endDate + "T00:00:00")
    : addDays(batch.startDate, nights);
  const status = getStatus(batch);
  const isSoldOut = status === "sold-out";
  const groupSize = batch.groupSize ?? 50;
  const interested = batch.interested ?? 12;
  const dayNum = String(startDate.getDate()).padStart(2, "0");
  const monthAbbr = startDate.toLocaleDateString("en-GB", { month: "short" }).toUpperCase();
  const priceNum = Number(String(batch.price).replace(/,/g, ""));
  const strike = priceNum ? `₹${Math.round(priceNum / 0.9).toLocaleString("en-IN")}/-` : "";
  const badgeLabel = isSoldOut ? "Sold Out" : `${batch.seatsLeft} Seats Left`;

  return (
    <div className="dbat-card">
      <div className="dbat-card-left">
        <div className="dbat-date-row">
          <div className="dbat-day">
            <span className="dbat-day-num">{dayNum}</span>
            <span className="dbat-day-mon">{monthAbbr}</span>
          </div>
          <span className="dbat-day-div" aria-hidden />
          <div className="dbat-range">
            <div className="dbat-range-block">
              <span className="dbat-range-date">{fmtFull(startDate)}</span>
              <span className="dbat-range-day">{WEEK_DAYS[startDate.getDay()]}</span>
            </div>
            <span className="dbat-range-line" aria-hidden>
              <svg
                preserveAspectRatio="none"
                width="100%"
                height="20"
                viewBox="0 0 157.333 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0 10C0 11.4728 1.19391 12.6667 2.66667 12.6667C4.13943 12.6667 5.33333 11.4728 5.33333 10C5.33333 8.52724 4.13943 7.33333 2.66667 7.33333C1.19391 7.33333 0 8.52724 0 10ZM152 10C152 11.4728 153.194 12.6667 154.667 12.6667C156.139 12.6667 157.333 11.4728 157.333 10C157.333 8.52724 156.139 7.33333 154.667 7.33333C153.194 7.33333 152 8.52724 152 10ZM2.66667 10V10.5H5.58974V10V9.5H2.66667V10ZM11.4359 10V10.5H17.2821V10V9.5H11.4359V10ZM23.1282 10V10.5H28.9744V10V9.5H23.1282V10ZM34.8205 10V10.5H40.6667V10V9.5H34.8205V10ZM46.5128 10V10.5H52.359V10V9.5H46.5128V10ZM58.2051 10V10.5H64.0513V10V9.5H58.2051V10ZM69.8974 10V10.5H75.7436V10V9.5H69.8974V10ZM81.5897 10V10.5H87.4359V10V9.5H81.5897V10ZM93.282 10V10.5H99.1282V10V9.5H93.282V10ZM104.974 10V10.5H110.821V10V9.5H104.974V10ZM116.667 10V10.5H122.513V10V9.5H116.667V10ZM128.359 10V10.5H134.205V10V9.5H128.359V10ZM140.051 10V10.5H145.897V10V9.5H140.051V10ZM151.744 10V10.5H154.667V10V9.5H151.744V10Z"
                  fill="#586474"
                />
              </svg>
            </span>
            <div className="dbat-range-block dbat-range-block--end">
              <span className="dbat-range-date">{fmtFull(endDate)}</span>
              <span className="dbat-range-day">{WEEK_DAYS[endDate.getDay()]}</span>
            </div>
          </div>
        </div>

        <div className="dbat-group-row">
          <img className="dbat-group-icon" src={`${ASSETS}icon-groups.svg`} alt="" aria-hidden />
          <span className="dbat-group-text">
            Group Size <span>{groupSize}</span>
          </span>
          <span className={`dbat-badge dbat-badge--${status}`}>{badgeLabel}</span>
        </div>

        <div className="dbat-people">
          <span className="dbat-avatars" aria-hidden>
            <span className="dbat-avatar">
              <img src={`${ASSETS}avatar-person.svg`} alt="" />
            </span>
            <span className="dbat-avatar">
              <img src={`${ASSETS}avatar-woman.svg`} alt="" />
            </span>
          </span>
          <span className="dbat-people-text">+{interested} people interested in this trip</span>
        </div>
      </div>

      <div className="dbat-card-right">
        <div className="dbat-price">
          <div className="dbat-price-top">
            <span className="dbat-disc">-10%</span>
            <span className="dbat-strike">{strike}</span>
          </div>
          <div className="dbat-price-bottom">
            <span className="dbat-price-main">&#8377;{formatPrice(batch.price)}/-</span>
            <span className="dbat-price-sub">Starting price per person</span>
          </div>
        </div>
        <button
          type="button"
          className={`dbat-cta${isSoldOut ? " dbat-cta--sold" : ""}`}
          disabled={isSoldOut}
          onClick={() => onBook(batch, startDate, endDate)}
        >
          {isSoldOut ? "Sold Out" : ctaLabel}
        </button>
      </div>
    </div>
  );
}

export default function DesktopBatchesSheet({
  isOpen,
  onClose,
  tripTitle = "Trip",
  duration = "",
  batches = DEFAULT_BATCHES,
  nights = 10,
  ctaLabel = "Book Trip",
  onSelectBatch,
}: Props) {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState("");
  const [loginOpen, setLoginOpen] = useState(false);
  const [pendingBooking, setPendingBooking] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    setAppScrollLocked(isOpen);
    return () => setAppScrollLocked(false);
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

  const goToBooking = (state: Record<string, unknown>) => navigate("/booking", { state });

  const handleBook = (batch: BatchItem, startDate: Date, endDate: Date) => {
    if (onSelectBatch) {
      onSelectBatch(batch, startDate, endDate);
      return;
    }
    const fmtShort = (d: Date) =>
      d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
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

  return (
    <>
      {isOpen && (
        <div className="dbat" role="dialog" aria-modal="true" aria-label="All departures">
          <header className="dbat-header">
            <button className="dbat-back" type="button" aria-label="Back" onClick={onClose}>
              <img src={`${ASSETS}icon-arrow-back.svg`} width={24} height={24} alt="" aria-hidden />
            </button>
            <div className="dbat-head-info">
              <h1 className="dbat-head-title">{tripTitle}</h1>
              {duration && (
                <div className="dbat-head-dur">
                  <img src={`${ASSETS}icon-calendar.svg`} width={16} height={16} alt="" aria-hidden />
                  <span>{duration}</span>
                </div>
              )}
            </div>
          </header>

          <div className="dbat-body">
            {months.length > 0 && (
              <div className="dbat-months">
                {months.map((m) => {
                  const active = m === activeMonth;
                  return (
                    <button
                      key={m}
                      type="button"
                      className={`dbat-month${active ? " dbat-month--active" : ""}`}
                      onClick={() => setSelectedMonth(m)}
                    >
                      {monthLabel(m)}
                    </button>
                  );
                })}
              </div>
            )}

            <div className="dbat-cards">
              {filteredBatches.map((batch) => (
                <DBatchCard
                  key={batch.startDate}
                  batch={batch}
                  nights={nights}
                  onBook={handleBook}
                  ctaLabel={ctaLabel}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <LoginSheet isOpen={loginOpen} onClose={() => setLoginOpen(false)} onSuccess={handleLoginSuccess} />
    </>
  );
}
