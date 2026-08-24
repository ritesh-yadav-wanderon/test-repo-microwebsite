import { useMemo, useState } from "react";
import Sheet from "@/components/ui/Sheet";
import { useNavigate } from "react-router-dom";
import { DEFAULT_BATCHES, getBatchStatus, type BatchItem } from "@/repositories";
import "./BatchesSheet.css";
import CtaButton from "@/components/ui/CtaButton";

const ASSETS = "/figma/batches/";

export type { BatchItem };

interface BatchesSheetProps {
  isOpen: boolean;
  onClose: () => void;
  tripTitle?: string;
  batches?: BatchItem[];
  nights?: number;
  /** Label for the per-batch CTA button (default "Book Trip"). */
  ctaLabel?: string;
  /**
   * When provided, selecting a batch calls this instead of the internal
   * login/booking flow. Used to carry the chosen batch to another screen
   * (e.g. "View Trip" from the listing) or to update a selected date.
   */
  onSelectBatch?: (batch: BatchItem, startDate: Date, endDate: Date) => void;
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

function BatchCard({
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
  const status = getBatchStatus(batch);
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
            <svg className="bsh-card-dash-dot" viewBox="0 0 6 6" width="6" height="6" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="3" cy="3" r="2.667" fill="#A8B1BD" />
            </svg>
            <span className="bsh-card-dash-line" />
            <svg className="bsh-card-dash-dot" viewBox="0 0 6 6" width="6" height="6" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="3" cy="3" r="2.667" fill="#A8B1BD" />
            </svg>
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
        <CtaButton
          className="bsh-card-cta"
          disabled={isSoldOut}
          onClick={() => onBook(batch, startDate, endDate)}
        >
          {isSoldOut ? "Sold Out" : ctaLabel}
        </CtaButton>
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
  ctaLabel = "Book Trip",
  onSelectBatch,
}: BatchesSheetProps) {
  const navigate = useNavigate();
  const [selectedMonth, setSelectedMonth] = useState("");

  const goToBooking = (state: Record<string, unknown>) => {
    navigate("/booking", { state });
  };

  const handleBook = (batch: BatchItem, startDate: Date, endDate: Date) => {
    // Custom flow (e.g. "View Trip" from listing, or "modify date"): let the
    // caller decide what to do with the chosen batch.
    if (onSelectBatch) {
      onSelectBatch(batch, startDate, endDate);
      return;
    }
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

    onClose();
    goToBooking(bookingState);
  };

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

  return (
    <Sheet
      isOpen={isOpen}
      onClose={onClose}
      overlayClassName="bsh-overlay"
      panelClassName="bsh-sheet"
      ariaLabel="Batches"
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
            ctaLabel={ctaLabel}
          />
        ))}
      </div>
    </Sheet>
  );
}
