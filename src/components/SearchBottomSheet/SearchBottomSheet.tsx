import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DEST_REGIONS } from "../../data/destinations";
import { setAppScrollLocked } from "../../utils/scroll";
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
  { label: ["All", "Trips"], img: null },
  { label: ["Adventure"],       img: catAdventureImg },
  { label: ["Luxury"],          img: catLuxuryImg },
  { label: ["Culture"],         img: catCultureImg },
  { label: ["Festival"],        img: catFestivalImg },
  { label: ["Wellness"],        img: catWellnessImg },
  { label: ["Weekend"],         img: catWeekendImg },
];

const SUGGESTIONS = ["Bali", "Vietnam", "Europe", "Ladakh", "Meghalaya"];
const DAY_LABELS  = ["S", "M", "T", "W", "T", "F", "S"];

const RECENTS_KEY = "wanderon:recent-destinations";

/* Flat, de-duplicated list of every destination in the burger-menu destination group
   (region names + their items) — used to match a typed query. */
const MENU_DESTINATIONS: string[] = (() => {
  const byLower = new Map<string, string>();
  for (const region of DEST_REGIONS) {
    byLower.set(region.label.toLowerCase(), region.label);
    for (const item of region.items) {
      byLower.set(item.label.toLowerCase(), item.label);
    }
  }
  return Array.from(byLower.values());
})();

/* Destination illustrations — same assets used by DestinationStrip's dest-item-icon. */
const DEST_IMAGES: Record<string, string> = {
  kerala:    "/figma/dest/kerala.png",
  rajasthan: "/figma/dest/rajasthan.png",
  spiti:     "/figma/dest/spiti.png",
  meghalaya: "/figma/dest/meghalaya.png",
  kashmir:   "/figma/dest/kashmir.png",
  ladakh:    "/figma/dest/ladakh.png",
  egypt:     "/figma/dest/egypt.png",
  bali:      "/figma/dest/bali.png",
  japan:     "/figma/dest/japan.png",
  thailand:  "/figma/dest/thailand.png",
  europe:    "/figma/dest/meghalaya.png",
  dubai:     "/figma/dest/dubai.png",
  vietnam:   "/figma/dest/vietnam.png",
};

/* Location pin — same glyph as the homepage destination section (material-symbols:location-on),
   rendered with currentColor so it reads on the white suggestion list. */
function LocationIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M8 8C8.36667 8 8.68067 7.86933 8.942 7.608C9.20333 7.34667 9.33378 7.03289 9.33333 6.66667C9.33333 6.3 9.20267 5.986 8.94133 5.72467C8.68 5.46333 8.36622 5.33289 8 5.33333C7.63333 5.33333 7.31933 5.464 7.058 5.72533C6.79667 5.98667 6.66622 6.30044 6.66667 6.66667C6.66667 7.03333 6.79733 7.34733 7.05867 7.60867C7.32 7.87 7.63378 8.00044 8 8ZM8 14.6667C6.21111 13.1444 4.87511 11.7307 3.992 10.4253C3.10889 9.12 2.66711 7.91156 2.66667 6.8C2.66667 5.13333 3.20289 3.80556 4.27533 2.81667C5.34778 1.82778 6.58933 1.33333 8 1.33333C9.41111 1.33333 10.6529 1.82778 11.7253 2.81667C12.7978 3.80556 13.3338 5.13333 13.3333 6.8C13.3333 7.91111 12.8916 9.11955 12.008 10.4253C11.1244 11.7311 9.78844 13.1449 8 14.6667Z" fill="currentColor"/>
    </svg>
  );
}

/* Suggestion leading visual — destination illustration when available, else a location pin. */
function SuggestionIcon({ name }: { name: string }) {
  const img = DEST_IMAGES[name.trim().toLowerCase()];
  if (img) {
    return <img className="sbs-suggestion-img" src={img} alt="" loading="lazy" />;
  }
  return <span className="sbs-suggestion-ico"><LocationIcon /></span>;
}

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
  focusMonth?: string;
}

function CalendarPicker({ from, to, onSelect, focusMonth }: CalProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = toIso(today.getFullYear(), today.getMonth(), today.getDate());

  const months = monthsFromNow(12);

  const monthRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const headerRef = useRef<HTMLDivElement>(null);

  /* Carry forward the month chosen in the Months tab: scroll it into view. */
  useEffect(() => {
    if (!focusMonth) return;
    const raf = requestAnimationFrame(() => {
      const monthEl = monthRefs.current[focusMonth];
      const container = monthEl?.closest(".sbs-cal-wrap") as HTMLElement | null;
      if (!monthEl || !container) return;
      const headerH = headerRef.current?.offsetHeight ?? 0;
      const delta =
        monthEl.getBoundingClientRect().top - container.getBoundingClientRect().top - headerH;
      container.scrollTop += delta;
    });
    return () => cancelAnimationFrame(raf);
  }, [focusMonth]);

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
      <div className="cal-day-headers" ref={headerRef}>
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
          <div
            key={mk}
            className="cal-month"
            ref={(el) => { monthRefs.current[mk] = el; }}
          >
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

  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(RECENTS_KEY);
      return raw ? (JSON.parse(raw) as string[]).slice(0, 4) : [];
    } catch {
      return [];
    }
  });

  /* Horizontal scroll indicator for the category strip */
  const catsRef = useRef<HTMLDivElement>(null);
  const TRACK_W = 120;
  const [thumb, setThumb] = useState({ width: TRACK_W, left: 0 });

  useEffect(() => {
    const el = catsRef.current;
    if (!el) return;

    const update = () => {
      const { scrollWidth, clientWidth, scrollLeft } = el;
      if (scrollWidth <= clientWidth) {
        setThumb({ width: TRACK_W, left: 0 });
        return;
      }
      const width = Math.max((clientWidth / scrollWidth) * TRACK_W, 20);
      const left = (scrollLeft / (scrollWidth - clientWidth)) * (TRACK_W - width);
      setThumb({ width, left });
    };

    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [isOpen]);

  /* Lock background page scroll while the overlay is open */
  useEffect(() => {
    if (!isOpen) return;
    setAppScrollLocked(true);
    return () => setAppScrollLocked(false);
  }, [isOpen]);

  if (!isOpen) return null;

  const destination = query.trim();

  /* Two suggestion groups: recent searches + suggested destinations (each capped at 4) */
  const recentDestinations = recentSearches.slice(0, 4);
  const suggestedDestinations = SUGGESTIONS.filter(
    (s) => !recentDestinations.some((r) => r.toLowerCase() === s.toLowerCase())
  ).slice(0, 4);

  /* When the typed query isn't already in recent/suggested, surface matching
     destinations from the burger-menu destination group. */
  const q = destination.toLowerCase();
  const alreadyShown = new Set(
    [...recentDestinations, ...suggestedDestinations].map((d) => d.toLowerCase())
  );
  const menuMatches = q
    ? MENU_DESTINATIONS.filter(
        (d) => d.toLowerCase().includes(q) && !alreadyShown.has(d.toLowerCase())
      ).slice(0, 6)
    : [];

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
    if (destination) {
      params.set("destination", destination);
      const next = [
        destination,
        ...recentSearches.filter((d) => d.toLowerCase() !== destination.toLowerCase()),
      ].slice(0, 4);
      setRecentSearches(next);
      try {
        localStorage.setItem(RECENTS_KEY, JSON.stringify(next));
      } catch {
        /* ignore write errors (e.g. storage disabled) */
      }
    }
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

  /* Pick a destination and move the user straight to the When step. */
  function pickDestination(name: string) {
    setQuery(name);
    setStep("when");
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

        {/* Content area */}
        <div className="sbs-content">

          {/* Category strip */}
          <div className="sbs-cats" ref={catsRef}>
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

          {/* Scroll indicator for category strip */}
          <div className="sbs-scroll-indicator" data-name="trip-scroll-indicator">
            <div className="sbs-scroll-track">
              <div
                className="sbs-scroll-thumb"
                style={{ width: `${thumb.width}px`, transform: `translateX(${thumb.left}px)` }}
              />
            </div>
          </div>

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
                <img src="/figma/search/search-icon.svg" width={18} height={18} alt="" />
              </div>
              <div className="sbs-suggestions">
                {menuMatches.length > 0 && (
                  <div className="sbs-sugg-group">
                    <p className="sbs-sugg-heading">Destinations</p>
                    <ul className="sbs-sugg-list" role="listbox" aria-label="Matching destinations">
                      {menuMatches.map((s) => (
                        <li
                          key={s}
                          role="option"
                          aria-selected={query === s}
                          className={`sbs-suggestion${query === s ? " sbs-suggestion--active" : ""}`}
                          onClick={() => pickDestination(s)}
                        >
                          <SuggestionIcon name={s} />
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {recentDestinations.length > 0 && (
                  <div className="sbs-sugg-group">
                    <p className="sbs-sugg-heading">Recent searches</p>
                    <ul className="sbs-sugg-list" role="listbox" aria-label="Recent searches">
                      {recentDestinations.map((s) => (
                        <li
                          key={s}
                          role="option"
                          aria-selected={query === s}
                          className={`sbs-suggestion${query === s ? " sbs-suggestion--active" : ""}`}
                          onClick={() => setQuery(s)}
                        >
                          <SuggestionIcon name={s} />
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {suggestedDestinations.length > 0 && (
                  <div className="sbs-sugg-group">
                    <p className="sbs-sugg-heading">Suggested destinations</p>
                    <ul className="sbs-sugg-list" role="listbox" aria-label="Suggested destinations">
                      {suggestedDestinations.map((s) => (
                        <li
                          key={s}
                          role="option"
                          aria-selected={query === s}
                          className={`sbs-suggestion${query === s ? " sbs-suggestion--active" : ""}`}
                          onClick={() => setQuery(s)}
                        >
                          <SuggestionIcon name={s} />
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
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
                    focusMonth={selMonths.length ? [...selMonths].sort()[0] : undefined}
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
