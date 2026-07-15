import { useState, useEffect, useMemo } from "react";
import type { Trip } from "../../types";
import "./TripDatesSheet.css";

interface TripDatesSheetProps {
  isOpen: boolean;
  onClose: () => void;
  trip?: Trip | null;
}

const WEEK_DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

function addDays(iso: string, days: number): Date {
  const d = new Date(iso + "T00:00:00");
  d.setDate(d.getDate() + days);
  return d;
}

function fmtFull(d: Date) {
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
}

function monthKey(iso: string) {
  return iso.slice(0, 7); // "YYYY-MM"
}

function monthLabel(key: string) {
  const [y, m] = key.split("-").map(Number);
  const d = new Date(y, m - 1, 1);
  return d.toLocaleDateString("en-GB", { month: "short" }) + "-" + String(y).slice(2);
}

type Availability = "available" | "filling" | "sold-out";

function getAvailability(idx: number): { status: Availability; badge: string } {
  if (idx % 3 === 1) return { status: "sold-out",  badge: "Sold Out" };
  if (idx % 3 === 2) return { status: "filling",   badge: "4 Seats Left" };
  return               { status: "available", badge: "4 Seats Left" };
}

function DateCard({ batch, idx, nights, startingPrice, slug }: {
  batch: string;
  idx: number;
  nights: number;
  startingPrice: string;
  slug: string;
}) {
  const startDate = new Date(batch + "T00:00:00");
  const endDate   = addDays(batch, nights);
  const { status, badge } = getAvailability(idx);
  const isSoldOut = status === "sold-out";

  return (
    <div className="tds-card">
      {/* Date range row */}
      <div className="tds-card-dates">
        <img src="/figma/listing/calendar-month.svg" width={16} height={16} alt="" aria-hidden />
        <div className="tds-card-dates-inner">
          <div className="tds-card-date-block">
            <span className="tds-card-date-main">{fmtFull(startDate)}</span>
            <span className="tds-card-date-day">{WEEK_DAYS[startDate.getDay()]}</span>
          </div>
          <div className="tds-card-dash-line" aria-hidden />
          <div className="tds-card-date-block tds-card-date-block--end">
            <span className="tds-card-date-main">{fmtFull(endDate)}</span>
            <span className="tds-card-date-day">{WEEK_DAYS[endDate.getDay()]}</span>
          </div>
        </div>
      </div>

      <div className="tds-card-sep" />

      {/* Group size + badge */}
      <div className="tds-card-group-row">
        <div className="tds-card-group-left">
          <img src="/figma/menu/groups.svg" width={16} height={16} alt="" aria-hidden />
          <span className="tds-card-group-text">Group Size <strong>50</strong></span>
          <span className={`tds-card-badge tds-card-badge--${status}`}>{badge}</span>
        </div>
        {status === "filling" && (
          <span className="tds-card-filling">Filling Fast</span>
        )}
      </div>

      {/* People interested */}
      <div className="tds-card-people">
        <div className="tds-card-avatars">
          <div className="tds-card-avatar">&#x1F9D1;&#x200D;&#x1F9B0;</div>
          <div className="tds-card-avatar">&#x1F469;&#x200D;&#x1F9B0;</div>
        </div>
        <span className="tds-card-people-text">+12 people interested in this trip</span>
      </div>

      {/* Price + CTA */}
      <div className="tds-card-footer">
        <div className="tds-card-price">
          <span className="tds-card-price-label">Starting Price:</span>
          <span className="tds-card-price-amount">&#8377; {Number(startingPrice).toLocaleString("en-IN")}/-</span>
        </div>
        <a
          href={isSoldOut ? undefined : `/trip/${slug}`}
          className={`tds-card-cta${isSoldOut ? " tds-card-cta--sold" : ""}`}
          aria-disabled={isSoldOut}
        >
          View Trip
        </a>
      </div>
    </div>
  );
}

export default function TripDatesSheet({ isOpen, onClose, trip }: TripDatesSheetProps) {
  const [hasOpened, setHasOpened] = useState(false);
  useEffect(() => { if (isOpen) setHasOpened(true); }, [isOpen]);
  if (!hasOpened) return null;
  const batches = trip?.batches ?? [];
  const nights  = trip?.duration?.nights ?? 7;

  const months = useMemo(() => {
    const seen = new Set<string>();
    const result: string[] = [];
    batches.forEach((b) => {
      const k = monthKey(b);
      if (!seen.has(k)) { seen.add(k); result.push(k); }
    });
    return result;
  }, [batches]);

  const [selectedMonth, setSelectedMonth] = useState<string>("");

  const activeMonth = selectedMonth || months[0] || "";

  const filteredBatches = useMemo(
    () => batches.filter((b) => monthKey(b) === activeMonth),
    [batches, activeMonth]
  );

  return (
    <div
      className={`tds-overlay${isOpen ? " tds-overlay--open" : ""}`}
      aria-hidden={!isOpen}
    >
      <div
        className={`tds-sheet${isOpen ? " tds-sheet--open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Trip Dates"
      >
        {/* Header */}
        <div className="tds-header">
          <div className="tds-header-left">
            <button className="tds-back" type="button" aria-label="Back" onClick={onClose}>
              <img src="/figma/listing/back-arrow.svg" width={24} height={24} alt="" aria-hidden />
            </button>
            <span className="tds-title">Trip Dates</span>
          </div>
          <button className="tds-close" type="button" aria-label="Close" onClick={onClose}>
            <img src="/figma/listing/close-icon.svg" width={30} height={30} alt="" aria-hidden />
          </button>
        </div>

        {/* Trip tag */}
        {trip && (
          <div className="tds-tag-bar">
            <img src="/figma/menu/lock.svg" width={14} height={14} alt="" aria-hidden />
            <span className="tds-tag-label">{trip.title}</span>
          </div>
        )}

        {/* Month filter tabs */}
        {months.length > 0 && (
          <div className="tds-months">
            {months.map((m) => {
              const isActive = m === activeMonth;
              return (
                <button
                  key={m}
                  className={`tds-month-tab${isActive ? " tds-month-tab--active" : ""}`}
                  type="button"
                  onClick={() => setSelectedMonth(m)}
                >
                  <span>{monthLabel(m)}</span>
                  {isActive && (
                    <img src="/figma/listing/close-icon.svg" width={16} height={16} alt="" aria-hidden
                      style={{ filter: "invert(20%) sepia(80%) saturate(500%) hue-rotate(150deg)" }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Date cards */}
        <div className="tds-cards">
          {filteredBatches.map((batch, idx) => (
            <DateCard
              key={batch}
              batch={batch}
              idx={idx}
              nights={nights}
              startingPrice={trip?.startingPrice ?? "62999"}
              slug={trip?.slug ?? ""}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
