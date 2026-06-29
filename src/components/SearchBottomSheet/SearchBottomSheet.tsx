import { useState } from "react";
import { useNavigate } from "react-router-dom";
import distanceIcon     from "../../assets/search-bottom-sheet/distance.svg";
import calendarMonthIcon from "../../assets/search-bottom-sheet/calendar-month.svg";
import calendarCheckIcon from "../../assets/search-bottom-sheet/calendar-check.svg";
import catAdventureImg   from "../../assets/search-bottom-sheet/cat-adventure.png";
import catLuxuryImg      from "../../assets/search-bottom-sheet/cat-luxury.png";
import catCultureImg     from "../../assets/search-bottom-sheet/cat-culture.png";
import catFestivalImg    from "../../assets/search-bottom-sheet/cat-festival.png";
import catWellnessImg    from "../../assets/search-bottom-sheet/cat-wellness.png";
import catWeekendImg     from "../../assets/search-bottom-sheet/cat-weekend.png";
import "./SearchBottomSheet.css";

/* ─── constants ─────────────────────────────────── */
const CATEGORIES = [
  { label: ["All", "Packages"], img: null },
  { label: ["Adventure"],       img: catAdventureImg },
  { label: ["Luxury"],          img: catLuxuryImg },
  { label: ["Culture"],         img: catCultureImg },
  { label: ["Festival"],        img: catFestivalImg },
  { label: ["Wellness"],        img: catWellnessImg },
  { label: ["Weekend"],         img: catWeekendImg },
];

const SUGGESTIONS = ["Bali", "Vietnam", "Indonesia", "Ladakh", "Europe", "Meghalaya"];
const DAY_LABELS  = ["S", "M", "T", "W", "T", "F", "S"];

/* ─── helpers ────────────────────────────────────── */
function toIso(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}
function fmtShort(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
}
function fmtMonth(key: string) {
  const [y, m] = key.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}
function monthKey(y: number, m: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}`;
}
function monthsFromNow(n: number) {
  const today = new Date();
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(today.getFullYear(), today.getMonth() + i, 1);
    return monthKey(d.getFullYear(), d.getMonth());
  });
}

/* ─── Calendar component ─────────────────────────── */
interface CalProps {
  from: string;
  to: string;
  onSelect: (from: string, to: string) => void;
}

function CalendarPicker({ from, to, onSelect }: CalProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = toIso(today.getFullYear(), today.getMonth(), today.getDate());

  const months = monthsFromNow(12);

  function handleDay(iso: string) {
    if (iso < todayStr) return;
    if (!from || (from && to)) {
      onSelect(iso, "");
    } else if (iso < from) {
      onSelect(iso, from);
    } else if (iso === from) {
      onSelect("", "");
    } else {
      onSelect(from, iso);
    }
  }

  return (
    <div className="cal-wrap">
      {/* Day headers — rendered once, sticky feel via padding */}
      <div className="cal-day-headers">
        {DAY_LABELS.map((l, i) => (
          <span key={i} className="cal-dh">{l}</span>
        ))}
      </div>

      {months.map((mk) => {
        const [y, mo] = mk.split("-").map(Number);
        const firstDow  = new Date(y, mo - 1, 1).getDay();
        const daysInMo  = new Date(y, mo, 0).getDate();
        const cells: (null | string)[] = [
          ...Array<null>(firstDow).fill(null),
          ...Array.from({ length: daysInMo }, (_, d) => toIso(y, mo - 1, d + 1)),
        ];

        return (
          <div key={mk} className="cal-month">
            <p className="cal-month-name">
              {new Date(y, mo - 1, 1).toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
            </p>
            <div className="cal-grid">
              {cells.map((iso, ci) => {
                if (!iso) return <div key={ci} className="cal-cell cal-cell--empty" />;
                const isPast     = iso < todayStr;
                const isStart    = iso === from;
                const isEnd      = iso === to;
                const inRange    = !!(from && to && iso > from && iso < to);
                const isRangeEdge = isStart || isEnd;
                return (
                  <button
                    key={ci}
                    type="button"
                    disabled={isPast}
                    onClick={() => handleDay(iso)}
                    className={[
                      "cal-cell",
                      isPast      ? "cal-cell--past"  : "",
                      inRange     ? "cal-cell--range"  : "",
                      isRangeEdge ? "cal-cell--sel"    : "",
                      isStart && to ? "cal-cell--sel-start" : "",
                      isEnd        ? "cal-cell--sel-end"   : "",
                    ].filter(Boolean).join(" ")}
                  >
                    <span className="cal-day-num">{parseInt(iso.split("-")[2], 10)}</span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Main component ─────────────────────────────── */
interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialDestination?: string;
  initialFrom?: string;
  initialTo?: string;
  initialMonths?: string[];
}

export default function SearchBottomSheet({
  isOpen,
  onClose,
  initialDestination = "",
  initialFrom        = "",
  initialTo          = "",
  initialMonths      = [],
}: Props) {
  const navigate = useNavigate();

  const [step,     setStep]     = useState<"where" | "when">(initialDestination ? "when" : "where");
  const [query,    setQuery]    = useState(initialDestination);
  const [activeCat, setActiveCat] = useState(0);
  const [whenMode, setWhenMode] = useState<"months" | "dates">("months");
  const [selMonths, setSelMonths] = useState<string[]>(initialMonths);
  const [dateFrom, setDateFrom] = useState(initialFrom);
  const [dateTo,   setDateTo]   = useState(initialTo);

  if (!isOpen) return null;

  const destination = query.trim();

  /* date range label for collapsed When row */
  function dateLabel() {
    if (whenMode === "months" && selMonths.length) {
      if (selMonths.length === 1) return fmtMonth(selMonths[0]);
      return `${selMonths.length} months`;
    }
    if (dateFrom && dateTo) return `${fmtShort(dateFrom)} – ${fmtShort(dateTo)}`;
    if (dateFrom) return fmtShort(dateFrom);
    return "Select dates";
  }

  const hasWhen = whenMode === "months" ? selMonths.length > 0
    : !!(dateFrom);

  function toggleMonth(mk: string) {
    setSelMonths((prev) =>
      prev.includes(mk) ? prev.filter((m) => m !== mk) : [...prev, mk]
    );
  }

  function handleFindTrip() {
    const params = new URLSearchParams();
    if (destination) params.set("destination", destination);
    if (whenMode === "months" && selMonths.length) {
      params.set("months", selMonths.sort().join(","));
    } else {
      if (dateFrom) params.set("from", dateFrom);
      if (dateTo)   params.set("to",   dateTo);
    }
    const qs = params.toString();
    onClose();
    navigate(`/search${qs ? `?${qs}` : ""}`);
  }

  function handleClear() {
    setQuery("");
    setSelMonths([]);
    setDateFrom("");
    setDateTo("");
    setStep("where");
  }

  /* ── render ── */
  return (
    <div className="sbs-overlay" onClick={onClose} role="dialog" aria-modal>
      <div className="sbs-sheet" onClick={(e) => e.stopPropagation()}>

        {/* Close */}
        <button className="sbs-close" onClick={onClose} aria-label="Close search">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#333" strokeWidth="2.2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Category strip */}
        <div className="sbs-cats">
          {CATEGORIES.map((cat, i) => (
            <button
              key={i}
              className={`sbs-cat${i === activeCat ? " sbs-cat--active" : ""}`}
              onClick={() => setActiveCat(i)}
            >
              {cat.img
                ? <img src={cat.img} className="sbs-cat-ico" alt="" />
                : <div className="sbs-cat-ico-placeholder" />}
              <span className="sbs-cat-label">
                {cat.label[0]}{cat.label[1] ? <><br />{cat.label[1]}</> : null}
              </span>
              {i === activeCat && <div className="sbs-cat-bar" />}
            </button>
          ))}
        </div>

        {/* Content area */}
        <div className="sbs-content">

          {/* ── Step 1: Where expanded / Step 2: Where collapsed ── */}
          {step === "where" ? (
            <div className="sbs-card">
              <p className="sbs-card-title">Where?</p>
              <div className="sbs-search-wrap">
                <input
                  className="sbs-search-input"
                  type="text"
                  placeholder="Where do you want to go?"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  autoFocus
                />
                <img src={distanceIcon} width={18} height={18} alt="" />
              </div>
              <ul className="sbs-suggestions" role="listbox">
                {SUGGESTIONS.map((s) => (
                  <li
                    key={s}
                    role="option"
                    aria-selected={query === s}
                    className={`sbs-suggestion${query === s ? " sbs-suggestion--active" : ""}`}
                    onClick={() => setQuery(s)}
                  >
                    <img src={distanceIcon} width={10} height={15} alt="" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            /* Where — collapsed */
            <button
              className="sbs-card sbs-row-card"
              onClick={() => setStep("where")}
            >
              <span className="sbs-row-label">Where</span>
              <span className="sbs-row-value">
                <img src={distanceIcon} width={10} height={15} alt="" />
                <span>{destination || "Anywhere"}</span>
              </span>
            </button>
          )}

          {/* ── Step 1: When collapsed / Step 2: When expanded ── */}
          {step === "when" ? (
            <div className="sbs-card sbs-when-card">
              <p className="sbs-card-title">When?</p>

              {/* Mode toggle */}
              <div className="sbs-toggle">
                <button
                  className={`sbs-toggle-opt${whenMode === "months" ? " sbs-toggle-opt--active" : ""}`}
                  onClick={() => setWhenMode("months")}
                  type="button"
                >Months</button>
                <button
                  className={`sbs-toggle-opt${whenMode === "dates" ? " sbs-toggle-opt--active" : ""}`}
                  onClick={() => setWhenMode("dates")}
                  type="button"
                >Dates</button>
              </div>

              {/* Months list */}
              {whenMode === "months" && (
                <ul className="sbs-months">
                  {monthsFromNow(8).map((mk) => {
                    const active = selMonths.includes(mk);
                    return (
                      <li key={mk}>
                        <button
                          className={`sbs-month-item${active ? " sbs-month-item--active" : ""}`}
                          onClick={() => toggleMonth(mk)}
                          type="button"
                        >
                          <img
                            src={active ? calendarCheckIcon : calendarMonthIcon}
                            width={20} height={20} alt=""
                          />
                          <span>{fmtMonth(mk)}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}

              {/* Calendar */}
              {whenMode === "dates" && (
                <div className="sbs-cal-wrap">
                  {(!dateFrom) && (
                    <p className="sbs-cal-hint">*Select a date range!</p>
                  )}
                  <CalendarPicker
                    from={dateFrom}
                    to={dateTo}
                    onSelect={(f, t) => { setDateFrom(f); setDateTo(t); }}
                  />
                </div>
              )}
            </div>
          ) : (
            /* When — collapsed */
            <button
              className="sbs-card sbs-row-card"
              onClick={() => setStep("when")}
            >
              <span className="sbs-row-label">When</span>
              <span className={`sbs-row-value${hasWhen ? " sbs-row-value--set" : ""}`}>
                <img src={calendarMonthIcon} width={13} height={15} alt="" />
                <span>{dateLabel()}</span>
              </span>
            </button>
          )}

          {/* Actions */}
          <div className="sbs-actions">
            <button className="sbs-clear" onClick={handleClear}>Clear all</button>
            <button className="sbs-find"  onClick={handleFindTrip}>Find Trip</button>
          </div>

        </div>
      </div>
    </div>
  );
}
