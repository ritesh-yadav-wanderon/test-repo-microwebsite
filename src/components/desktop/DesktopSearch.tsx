import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DEST_REGIONS } from "../../data/destinations";
import calendarMonthIcon from "../../assets/search-bottom-sheet/calendar-month.svg";
import calendarCheckIcon from "../../assets/search-bottom-sheet/calendar-check.svg";
import "./DesktopSearch.css";

const BASE = "/figma/desktop";
const RECENTS_KEY = "wanderon:recent-destinations";
const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

/* Trending tiles (Figma 6589:31700) — monument art shared with DestinationStrip. */
const TRENDING = [
  { name: "Egypt",     img: "/figma/dest/egypt.png" },
  { name: "Bali",      img: "/figma/dest/bali.png" },
  { name: "Japan",     img: "/figma/dest/japan.png" },
  { name: "Thailand",  img: "/figma/dest/thailand.png" },
  { name: "Rajasthan", img: "/figma/dest/rajasthan.png", flip: true },
  { name: "Europe",    img: "/figma/dest/meghalaya.png" },
  { name: "Kerala",    img: "/figma/dest/kerala.png" },
  { name: "Vietnam",   img: "/figma/dest/vietnam.png" },
];

/* Destination illustrations for typed suggestions — same map as the mobile sheet. */
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

/* Flat, de-duplicated destination list used to match a typed query. */
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

/* ─── date helpers (mirrors the mobile SearchBottomSheet) ─── */
function toIso(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}
function fmtShort(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
}
function fmtMonth(key: string, short = false) {
  const [y, m] = key.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("en-GB", {
    month: short ? "short" : "long",
    year: "numeric",
  });
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

function LocationIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M8 8C8.36667 8 8.68067 7.86933 8.942 7.608C9.20333 7.34667 9.33378 7.03289 9.33333 6.66667C9.33333 6.3 9.20267 5.986 8.94133 5.72467C8.68 5.46333 8.36622 5.33289 8 5.33333C7.63333 5.33333 7.31933 5.464 7.058 5.72533C6.79667 5.98667 6.66622 6.30044 6.66667 6.66667C6.66667 7.03333 6.79733 7.34733 7.05867 7.60867C7.32 7.87 7.63378 8.00044 8 8ZM8 14.6667C6.21111 13.1444 4.87511 11.7307 3.992 10.4253C3.10889 9.12 2.66711 7.91156 2.66667 6.8C2.66667 5.13333 3.20289 3.80556 4.27533 2.81667C5.34778 1.82778 6.58933 1.33333 8 1.33333C9.41111 1.33333 10.6529 1.82778 11.7253 2.81667C12.7978 3.80556 13.3338 5.13333 13.3333 6.8C13.3333 7.91111 12.8916 9.11955 12.008 10.4253C11.1244 11.7311 9.78844 13.1449 8 14.6667Z" fill="currentColor"/>
    </svg>
  );
}

/* ─── Date-range calendar (Figma 6589:32122) ─── */
interface CalProps {
  from: string;
  to: string;
  onSelect: (from: string, to: string) => void;
}

function RangeCalendar({ from, to, onSelect }: CalProps) {
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
    <div className="dsx__cal">
      {months.map((mk) => {
        const [y, mo] = mk.split("-").map(Number);
        const firstDow = new Date(y, mo - 1, 1).getDay();
        const daysInMo = new Date(y, mo, 0).getDate();
        const cells: (null | string)[] = [
          ...Array<null>(firstDow).fill(null),
          ...Array.from({ length: daysInMo }, (_, d) => toIso(y, mo - 1, d + 1)),
        ];

        return (
          <div key={mk} className="dsx__cal-month">
            <p className="dsx__cal-name">{fmtMonth(mk)}</p>
            <div className="dsx__cal-grid">
              {cells.map((iso, ci) => {
                if (!iso) return <div key={ci} className="dsx__cell" />;
                const isPast  = iso < todayStr;
                const isStart = iso === from;
                const isEnd   = iso === to;
                const inRange = !!(from && to && iso > from && iso < to);
                const hasBand = !!(from && to);
                return (
                  <div
                    key={ci}
                    className={[
                      "dsx__cell",
                      inRange ? "dsx__cell--range" : "",
                      hasBand && isStart ? "dsx__cell--band-start" : "",
                      hasBand && isEnd   ? "dsx__cell--band-end"   : "",
                    ].filter(Boolean).join(" ")}
                  >
                    <button
                      type="button"
                      disabled={isPast}
                      onClick={() => handleDay(iso)}
                      className={[
                        "dsx__day",
                        isPast ? "dsx__day--past" : "",
                        isStart || isEnd ? "dsx__day--sel" : "",
                      ].filter(Boolean).join(" ")}
                    >
                      {parseInt(iso.split("-")[2], 10)}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

interface DesktopSearchProps {
  /** "hero" — glass pill over the dark hero art (default).
   *  "light" — white pill for the expanded header search strip. */
  variant?: "hero" | "light";
  /** Open the Where panel (with the input focused) as soon as the bar mounts.
   *  Used by the header search strip so it expands ready to type. */
  autoOpenWhere?: boolean;
  /** Called after a search navigates away, so hosts can collapse the bar. */
  onSearched?: () => void;
  /** When provided, the bar swaps the search fab for a "Find trips" primary
   *  button plus a secondary cross that calls this to close the search. */
  onClose?: () => void;
}

/* ─── Main component ───
 * Desktop search bar with anchored dropdown panels:
 *  • Where — trending destination tiles / typed suggestions (Figma 6589:31700)
 *  • When  — Months list (Figma 6589:32082) or date-range calendar (6589:32122)
 */
export default function DesktopSearch({
  variant = "hero",
  autoOpenWhere = false,
  onSearched,
  onClose,
}: DesktopSearchProps) {
  const navigate = useNavigate();
  const rootRef = useRef<HTMLDivElement>(null);

  const [panel, setPanel] = useState<"where" | "when" | null>(autoOpenWhere ? "where" : null);
  const [query, setQuery] = useState("");
  const [whenMode, setWhenMode] = useState<"months" | "dates">("months");
  const [selMonths, setSelMonths] = useState<string[]>([]);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  /* Close panels on outside click / Escape. */
  useEffect(() => {
    if (!panel) return;
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setPanel(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPanel(null);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [panel]);

  const destination = query.trim();
  const matches = useMemo(() => {
    const q = destination.toLowerCase();
    if (!q) return [];
    return MENU_DESTINATIONS.filter((d) => d.toLowerCase().includes(q)).slice(0, 8);
  }, [destination]);

  const hasWhen = whenMode === "months" ? selMonths.length > 0 : !!dateFrom;

  function whenLabel() {
    if (whenMode === "months" && selMonths.length) {
      if (selMonths.length === 1) return fmtMonth(selMonths[0], true);
      return `${selMonths.length} months`;
    }
    if (dateFrom && dateTo) return `${fmtShort(dateFrom)} – ${fmtShort(dateTo)}`;
    if (dateFrom) return fmtShort(dateFrom);
    return "When";
  }

  function pickDestination(name: string) {
    setQuery(name);
    setPanel("when");
  }

  function toggleMonth(mk: string) {
    setSelMonths((prev) =>
      prev.includes(mk) ? prev.filter((m) => m !== mk) : [...prev, mk]
    );
  }

  function handleSearch() {
    const params = new URLSearchParams();
    if (destination) {
      params.set("destination", destination);
      try {
        const raw = localStorage.getItem(RECENTS_KEY);
        const prev: string[] = raw ? JSON.parse(raw) : [];
        const next = [
          destination,
          ...prev.filter((d) => d.toLowerCase() !== destination.toLowerCase()),
        ].slice(0, 4);
        localStorage.setItem(RECENTS_KEY, JSON.stringify(next));
      } catch {
        /* ignore storage errors */
      }
    }
    if (whenMode === "months" && selMonths.length) {
      params.set("months", [...selMonths].sort().join(","));
    } else {
      if (dateFrom) params.set("from", dateFrom);
      if (dateTo)   params.set("to",   dateTo);
    }
    setPanel(null);
    const qs = params.toString();
    navigate(`/search${qs ? `?${qs}` : ""}`);
    onSearched?.();
  }

  /* Light bar uses the dark icon set (icon-distance.svg / icon-calendar.svg). */
  const iconSuffix = variant === "light" ? "" : "-white";

  return (
    <div ref={rootRef} className={`dsx${variant === "light" ? " dsx--light" : ""}`} role="search">
      {/* ── Search bar (glass pill from the hero design) ── */}
      <div className="dsx__bar">
        <div
          className={`dsx__field dsx__field--where${panel === "where" ? " dsx__field--active" : ""}`}
          onClick={() => setPanel("where")}
        >
          <img src={`${BASE}/icon-distance${iconSuffix}.svg`} alt="" className="dsx__pin" />
          <input
            className="dsx__input"
            type="text"
            placeholder="Where"
            value={query}
            autoFocus={autoOpenWhere}
            onChange={(e) => { setQuery(e.target.value); setPanel("where"); }}
            onFocus={() => setPanel("where")}
            onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
            aria-label="Where do you want to go?"
          />
        </div>
        <span className="dsx__divider" />
        <button
          type="button"
          className={`dsx__field dsx__field--when${panel === "when" ? " dsx__field--active" : ""}`}
          onClick={() => setPanel((p) => (p === "when" ? null : "when"))}
        >
          <img src={`${BASE}/icon-calendar${iconSuffix}.svg`} alt="" className="dsx__cal-ico" />
          <span className={hasWhen ? "dsx__when-val--set" : ""}>{whenLabel()}</span>
        </button>
        {onClose ? (
          <div className="dsx__actions">
            <button type="button" className="dsx__find" onClick={handleSearch}>
              Find trips
            </button>
            <button type="button" className="dsx__close" onClick={onClose} aria-label="Close search">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M2 2l12 12M14 2L2 14" stroke="#3d3d3d" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        ) : (
          <button type="button" className="dsx__fab" onClick={handleSearch} aria-label="Search trips">
            <img src={`${BASE}/search-fab.svg`} alt="" />
          </button>
        )}
      </div>

      {/* ── Where panel (Figma 6589:31700) ── */}
      {panel === "where" && (
        <div className="dsx__panel dsx__panel--where">
          {destination ? (
            matches.length ? (
              <>
                <p className="dsx__panel-title">Destinations</p>
                <ul className="dsx__sugg" role="listbox" aria-label="Matching destinations">
                  {matches.map((name) => {
                    const img = DEST_IMAGES[name.toLowerCase()];
                    return (
                      <li key={name}>
                        <button
                          type="button"
                          className="dsx__sugg-row"
                          role="option"
                          aria-selected={query === name}
                          onClick={() => pickDestination(name)}
                        >
                          {img
                            ? <img className="dsx__sugg-img" src={img} alt="" loading="lazy" />
                            : <span className="dsx__sugg-pin"><LocationIcon /></span>}
                          <span>{name}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </>
            ) : (
              <p className="dsx__noresults">No destinations found for “{destination}”</p>
            )
          ) : (
            <>
              <p className="dsx__panel-title">Trending Destinations</p>
              <div className="dsx__trending">
                {TRENDING.map((t) => (
                  <button
                    key={t.name}
                    type="button"
                    className="dsx__tile"
                    onClick={() => pickDestination(t.name)}
                  >
                    <span className="dsx__tile-art">
                      <img className="dsx__tile-ellipse" src="/figma/dest/ellipse-gray.svg" alt="" />
                      <img
                        className={`dsx__tile-img${t.flip ? " dsx__tile-img--flip" : ""}`}
                        src={t.img}
                        alt=""
                        loading="lazy"
                      />
                    </span>
                    <span className="dsx__tile-name">{t.name}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* ── When panel (Figma 6589:32082 / 6589:32122) ── */}
      {panel === "when" && (
        <div className="dsx__panel dsx__panel--when">
          <p className="dsx__panel-title dsx__panel-title--strong">When?</p>

          <div className="dsx__toggle">
            <button
              type="button"
              className={`dsx__toggle-opt${whenMode === "months" ? " dsx__toggle-opt--active" : ""}`}
              onClick={() => setWhenMode("months")}
            >Months</button>
            <button
              type="button"
              className={`dsx__toggle-opt${whenMode === "dates" ? " dsx__toggle-opt--active" : ""}`}
              onClick={() => setWhenMode("dates")}
            >Dates</button>
          </div>

          {whenMode === "months" ? (
            <ul className="dsx__months">
              {monthsFromNow(6).map((mk) => {
                const active = selMonths.includes(mk);
                return (
                  <li key={mk}>
                    <button
                      type="button"
                      className={`dsx__month${active ? " dsx__month--active" : ""}`}
                      onClick={() => toggleMonth(mk)}
                    >
                      <img src={active ? calendarCheckIcon : calendarMonthIcon} width={20} height={20} alt="" />
                      <span>{fmtMonth(mk, true)}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="dsx__dates">
              {!dateFrom && <p className="dsx__hint">*Select a date range!</p>}
              <div className="dsx__dow">
                {DAY_LABELS.map((l, i) => <span key={i}>{l}</span>)}
              </div>
              <div className="dsx__cal-scroll">
                <RangeCalendar
                  from={dateFrom}
                  to={dateTo}
                  onSelect={(f, t) => { setDateFrom(f); setDateTo(t); }}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
