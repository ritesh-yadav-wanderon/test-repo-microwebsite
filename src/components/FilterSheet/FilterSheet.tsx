import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./FilterSheet.css";

/* ── Static data ── */

const TABS = [
  "Destinations",
  "Planning With",
  "Date & Duration",
  "Category",
  "Add-Ons",
  "Departure City",
  "Accommodation Type",
  "Bucket List",
];

type DestItem = { label: string; slug: string; trending?: boolean };
type IntlRegion = { label: string; slug: string; items: DestItem[] };

const INDIA_DESTS: DestItem[] = [
  { label: "All trips in India", slug: "india" },
  { label: "Ladakh", slug: "ladakh", trending: true },
  { label: "Spiti", slug: "spiti", trending: true },
  { label: "Meghalaya", slug: "meghalaya" },
  { label: "Kashmir", slug: "kashmir" },
  { label: "Sikkim", slug: "sikkim" },
  { label: "Himachal Pradesh", slug: "himachal-pradesh" },
  { label: "Uttarakhand", slug: "uttarakhand" },
  { label: "Arunachal Pradesh", slug: "arunachal-pradesh" },
  { label: "Andaman", slug: "andaman" },
  { label: "Rajasthan", slug: "rajasthan" },
  { label: "Kerala", slug: "kerala" },
  { label: "Nagaland", slug: "nagaland" },
];

const INTL_REGIONS: IntlRegion[] = [
  {
    label: "Europe", slug: "europe", items: [
      { label: "Iceland", slug: "iceland", trending: true },
      { label: "Spain", slug: "spain", trending: true },
      { label: "France", slug: "france" },
      { label: "Switzerland", slug: "switzerland" },
      { label: "Georgia", slug: "georgia" },
    ],
  },
  {
    label: "Asia", slug: "asia", items: [
      { label: "Japan", slug: "japan", trending: true },
      { label: "Bhutan", slug: "bhutan", trending: true },
      { label: "Sri Lanka", slug: "sri-lanka" },
      { label: "Kazakhstan", slug: "kazakhstan" },
      { label: "Maldives", slug: "maldives" },
      { label: "Malaysia", slug: "malaysia" },
      { label: "Mauritius", slug: "mauritius" },
    ],
  },
  {
    label: "South East Asia", slug: "south-east-asia", items: [
      { label: "Bali", slug: "bali", trending: true },
      { label: "Thailand", slug: "thailand", trending: true },
      { label: "Vietnam", slug: "vietnam", trending: true },
      { label: "Philippines", slug: "philippines" },
    ],
  },
  {
    label: "Middle East", slug: "middle-east", items: [
      { label: "Turkey", slug: "turkey", trending: true },
      { label: "Dubai", slug: "dubai", trending: true },
    ],
  },
  {
    label: "Africa", slug: "africa", items: [
      { label: "Kenya", slug: "kenya", trending: true },
      { label: "South Africa", slug: "south-africa", trending: true },
    ],
  },
  {
    label: "Oceania", slug: "oceania", items: [
      { label: "Australia", slug: "australia", trending: true },
      { label: "New Zealand", slug: "new-zealand", trending: true },
    ],
  },
];

type FilterOption = { label: string; price: string; packages: string };

const PLANNING_WITH: FilterOption[] = [
  { label: "Group", price: "Rs.21,999 Onwards", packages: "50+ packages" },
  { label: "Friends(Your Group)", price: "Rs.21,999 Onwards", packages: "50+ packages" },
  { label: "Family", price: "Rs.21,999 Onwards", packages: "50+ packages" },
  { label: "Romantic Escapes", price: "Rs.21,999 Onwards", packages: "50+ packages" },
];

const CATEGORIES: FilterOption[] = [
  { label: "Adventure", price: "Rs.21,999 Onwards", packages: "50+ packages" },
  { label: "Luxury", price: "Rs.21,999 Onwards", packages: "50+ packages" },
  { label: "Budget Trips", price: "Rs.21,999 Onwards", packages: "50+ packages" },
  { label: "Events and Festivals", price: "Rs.21,999 Onwards", packages: "50+ packages" },
  { label: "Wellness", price: "Rs.21,999 Onwards", packages: "50+ packages" },
];

const ADDONS: FilterOption[] = [
  { label: "With Flights", price: "Rs.21,999 Onwards", packages: "50+ packages" },
  { label: "Visa", price: "Rs.21,999 Onwards", packages: "50+ packages" },
];

const DEPARTURE_CITIES: FilterOption[] = [
  { label: "Ex-Delhi", price: "Rs.21,999 Onwards", packages: "50+ packages" },
  { label: "Ex-Mumbai", price: "Rs.21,999 Onwards", packages: "50+ packages" },
  { label: "Ex-Chennai", price: "Rs.21,999 Onwards", packages: "50+ packages" },
];

const ACCOMMODATION_TYPES: FilterOption[] = [
  { label: "Double Sharing Room", price: "Rs.21,999 Onwards", packages: "50+ packages" },
  { label: "Single Sharing Room", price: "Rs.21,999 Onwards", packages: "50+ packages" },
  { label: "Triple Sharing Room", price: "Rs.21,999 Onwards", packages: "50+ packages" },
  { label: "Hostel- Mixed Dorm", price: "Rs.21,999 Onwards", packages: "50+ packages" },
];

/* ── Month helpers ── */
function getUpcomingMonths(count = 12) {
  const now = new Date();
  const result: Array<{ key: string; label: string }> = [];
  for (let i = 0; i < count; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleDateString("en-GB", { month: "short", year: "numeric" });
    result.push({ key, label });
  }
  return result;
}
const UPCOMING_MONTHS = getUpcomingMonths();

/* ── Checkbox SVG ── */
const CheckIcon = () => (
  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
    <path d="M1 4L3.5 6.5L9 1" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ── Destination check row (48px, 14px, trending badge inline) ── */
function DestCheckRow({ label, trending, checked, onToggle }: {
  label: string; trending?: boolean; checked: boolean; onToggle: () => void;
}) {
  return (
    <button type="button" className="fs-dest-row" onClick={onToggle}>
      <div className="fs-dest-row-left">
        <span className="fs-dest-label">{label}</span>
        {trending && (
          <div className="fs-trending-badge">
            <img src="/figma/menu/trending-sparkle-left.png" width={12} height={8} alt="" aria-hidden />
            <span className="fs-trending-text">Trending</span>
            <img src="/figma/menu/trending-sparkle-right.png" width={12} height={8} alt="" aria-hidden />
          </div>
        )}
      </div>
      <div className={`fs-checkbox${checked ? " fs-checkbox--checked" : ""}`} aria-hidden>
        {checked && <CheckIcon />}
      </div>
    </button>
  );
}

/* ── Filter check row (12px name + 10px price | packages) ── */
function FilterCheckRow({ label, price, packages, checked, onToggle }: {
  label: string; price: string; packages: string; checked: boolean; onToggle: () => void;
}) {
  return (
    <button type="button" className="fs-filter-row" onClick={onToggle}>
      <div className="fs-filter-info">
        <span className="fs-filter-label">{label}</span>
        <div className="fs-filter-sub">
          <span>{price}</span>
          <span>{packages}</span>
        </div>
      </div>
      <div className={`fs-checkbox${checked ? " fs-checkbox--checked" : ""}`} aria-hidden>
        {checked && <CheckIcon />}
      </div>
    </button>
  );
}

/* ── Destinations panel ── */
function DestinationsPanel({ sel, onToggle }: { sel: Set<string>; onToggle: (v: string) => void }) {
  const [expandedGroup, setExpandedGroup] = useState<string>("india");
  const [showAll, setShowAll] = useState(false);

  function toggleGroup(slug: string) {
    setExpandedGroup(prev => prev === slug ? "" : slug);
  }

  const indiaOpen = expandedGroup === "india";
  const visibleIndia = showAll ? INDIA_DESTS : INDIA_DESTS.slice(0, 7);

  return (
    <div className="fs-panel">
      {/* India — collapsible like other regions */}
      <button
        type="button"
        className="fs-region-row"
        onClick={() => toggleGroup("india")}
      >
        <span className="fs-region-name">India</span>
        <img
          src="/figma/menu/icon-arrow-forward.svg"
          alt=""
          width={16}
          height={16}
          className={`fs-region-arrow${indiaOpen ? " fs-region-arrow--open" : ""}`}
        />
      </button>
      {indiaOpen && (
        <>
          {visibleIndia.map((d) => (
            <DestCheckRow
              key={d.slug}
              label={d.label}
              trending={d.trending}
              checked={sel.has(d.slug)}
              onToggle={() => onToggle(d.slug)}
            />
          ))}
          {!showAll && (
            <button className="fs-see-more" type="button" onClick={() => setShowAll(true)}>
              see more destinations
            </button>
          )}
        </>
      )}
      {INTL_REGIONS.map((region) => (
        <div key={region.slug}>
          <div className="fs-dest-sep" />
          <button
            type="button"
            className="fs-region-row"
            onClick={() => toggleGroup(region.slug)}
          >
            <span className="fs-region-name">{region.label}</span>
            <img
              src="/figma/menu/icon-arrow-forward.svg"
              alt=""
              width={16}
              height={16}
              className={`fs-region-arrow${expandedGroup === region.slug ? " fs-region-arrow--open" : ""}`}
            />
          </button>
          {expandedGroup === region.slug && region.items.map((item) => (
            <DestCheckRow
              key={item.slug}
              label={item.label}
              trending={item.trending}
              checked={sel.has(item.slug)}
              onToggle={() => onToggle(item.slug)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

/* ── Generic filter list panel ── */
function FilterListPanel({ items, sel, onToggle }: {
  items: FilterOption[]; sel: Set<string>; onToggle: (v: string) => void;
}) {
  return (
    <div className="fs-panel">
      {items.map((item) => (
        <FilterCheckRow
          key={item.label}
          label={item.label}
          price={item.price}
          packages={item.packages}
          checked={sel.has(item.label)}
          onToggle={() => onToggle(item.label)}
        />
      ))}
    </div>
  );
}

/* ── Calendar helpers ── */
function toYMD(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function CalendarMonth({ year, month, fromDate, toDate, today, onDayClick }: {
  year: number; month: number; fromDate: Date | null; toDate: Date | null;
  today: Date; onDayClick: (ymd: string) => void;
}) {
  const firstDow = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const cells: Array<number | null> = [
    ...Array(firstDow).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks: Array<Array<number | null>> = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  return (
    <>
      {weeks.map((week, wi) => {
        let startCol = -1, endCol = -1, hasRange = false;
        if (fromDate && toDate) {
          week.forEach((day, col) => {
            if (!day) return;
            const d = new Date(year, month, day);
            if (toYMD(d) === toYMD(fromDate)) startCol = col;
            if (toYMD(d) === toYMD(toDate)) endCol = col;
            if (d > fromDate && d < toDate) hasRange = true;
          });
          const firstValid = week.find(d => d != null);
          const lastValid = [...week].reverse().find(d => d != null);
          if (firstValid && lastValid) {
            const wStart = new Date(year, month, firstValid);
            const wEnd = new Date(year, month, lastValid);
            if (wStart > fromDate && wEnd < toDate) hasRange = true;
          }
        }
        const showStrip = startCol >= 0 || endCol >= 0 || hasRange;
        const stripLeft = startCol >= 0 ? `${(startCol + 0.5) / 7 * 100}%` : "0%";
        const stripRight = endCol >= 0 ? `${(6 - endCol + 0.5) / 7 * 100}%` : "0%";
        const stripRadius = startCol >= 0 && endCol >= 0 ? "30px"
          : startCol >= 0 ? "30px 0 0 30px"
          : endCol >= 0 ? "0 30px 30px 0"
          : "0";
        return (
          <div key={wi} className="fs-cal-week">
            {showStrip && (
              <div className="fs-cal-strip" style={{ left: stripLeft, right: stripRight, borderRadius: stripRadius }} />
            )}
            {week.map((day, col) => {
              if (!day) return <div key={col} className="fs-cal-cell" />;
              const d = new Date(year, month, day);
              const ymd = toYMD(d);
              const isPast = d < today;
              const isSelected = (fromDate && toYMD(fromDate) === ymd) || (toDate && toYMD(toDate) === ymd);
              return (
                <div key={col} className="fs-cal-cell">
                  <button
                    type="button"
                    className={`fs-cal-circle${isSelected ? " fs-cal-circle--selected" : ""}`}
                    disabled={isPast}
                    onClick={() => !isPast && onDayClick(ymd)}
                  >
                    <span className={`fs-cal-day${isPast ? " fs-cal-day--past" : ""}`}>{day}</span>
                  </button>
                </div>
              );
            })}
          </div>
        );
      })}
    </>
  );
}

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];
const DOW_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

function DateDurationPanel({ sel, onToggle }: { sel: Set<string>; onToggle: (v: string) => void }) {
  const [mode, setMode] = useState<"months" | "dates">("months");
  const fromStr = [...sel].find(v => v.startsWith("from:"))?.slice(5) ?? null;
  const toStr = [...sel].find(v => v.startsWith("to:"))?.slice(3) ?? null;
  const fromDate = fromStr ? new Date(fromStr + "T00:00:00") : null;
  const toDate = toStr ? new Date(toStr + "T00:00:00") : null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  function handleDayClick(ymd: string) {
    const clicked = new Date(ymd + "T00:00:00");
    if (!fromDate || toDate || clicked < fromDate) {
      const oldFrom = [...sel].find(v => v.startsWith("from:"));
      const oldTo = [...sel].find(v => v.startsWith("to:"));
      if (oldFrom) onToggle(oldFrom);
      if (oldTo) onToggle(oldTo);
      onToggle(`from:${ymd}`);
    } else {
      const oldTo = [...sel].find(v => v.startsWith("to:"));
      if (oldTo) onToggle(oldTo);
      onToggle(`to:${ymd}`);
    }
  }

  const fmtDate = (s: string) =>
    new Date(s + "T00:00:00").toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  const rangeLabel = fromStr && toStr
    ? `${fmtDate(fromStr)} – ${fmtDate(toStr)}`
    : fromStr ? `From ${fmtDate(fromStr)} – select end date` : null;

  return (
    <div className="fs-panel fs-panel--date">
      <div className="fs-date-toggle">
        <button
          type="button"
          className={`fs-date-toggle-btn${mode === "months" ? " fs-date-toggle-btn--active" : ""}`}
          onClick={() => setMode("months")}
        >
          Months
        </button>
        <button
          type="button"
          className={`fs-date-toggle-btn${mode === "dates" ? " fs-date-toggle-btn--active" : ""}`}
          onClick={() => setMode("dates")}
        >
          Dates
        </button>
      </div>

      {mode === "months" ? (
        <div className="fs-month-list">
          {UPCOMING_MONTHS.map(({ key, label }) => {
            const selected = sel.has(key);
            return (
              <button
                key={key}
                type="button"
                className={`fs-month-row${selected ? " fs-month-row--selected" : ""}`}
                onClick={() => onToggle(key)}
              >
                <img
                  src={selected ? "/figma/listing/calendar-check.svg" : "/figma/listing/calendar-month-sm.svg"}
                  alt=""
                  width={20}
                  height={20}
                  aria-hidden
                />
                <span className="fs-month-row-label">{label}</span>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="fs-cal-wrap">
          <p className="fs-cal-hint">{rangeLabel ?? "*Select a date range!"}</p>
          <div className="fs-cal-dow">
            {DOW_LABELS.map((d, i) => (
              <div key={i} className="fs-cal-dow-cell">{d}</div>
            ))}
          </div>
          <div className="fs-cal-months">
            {UPCOMING_MONTHS.map(({ key }) => {
              const [y, m] = key.split("-").map(Number);
              const monthStart = new Date(y, m - 1, 1);
              const monthEnd = new Date(y, m, 0);
              const isActive =
                (fromDate && fromDate >= monthStart && fromDate <= monthEnd) ||
                (toDate && toDate >= monthStart && toDate <= monthEnd) ||
                (fromDate && toDate && fromDate < monthStart && toDate > monthEnd);
              return (
                <div key={key} className={`fs-cal-month${isActive ? " fs-cal-month--active" : ""}`}>
                  <div className="fs-cal-month-label">{MONTH_NAMES[m - 1]} {y}</div>
                  <CalendarMonth
                    year={y}
                    month={m - 1}
                    fromDate={fromDate}
                    toDate={toDate}
                    today={today}
                    onDayClick={handleDayClick}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── URL param builder ── */
function buildSearchParams(selections: Record<string, Set<string>>): string {
  const p = new URLSearchParams();
  const dest = [...(selections["Destinations"] ?? [])];
  if (dest.length) p.set("destination", dest.join(","));
  const cats = [...(selections["Category"] ?? [])];
  if (cats.length) p.set("category", cats.join(","));
  const dateSel = [...(selections["Date & Duration"] ?? [])];
  const months = dateSel.filter(v => /^\d{4}-\d{2}$/.test(v));
  if (months.length) p.set("months", months.join(","));
  const fromDate = dateSel.find(v => v.startsWith("from:"))?.replace("from:", "");
  const toDate = dateSel.find(v => v.startsWith("to:"))?.replace("to:", "");
  if (fromDate) p.set("from", fromDate);
  if (toDate) p.set("to", toDate);
  const addons = [...(selections["Add-Ons"] ?? [])];
  if (addons.length) p.set("addons", addons.join(","));
  const cities = [...(selections["Departure City"] ?? [])];
  if (cities.length) p.set("fromCity", cities.join(","));
  const acc = [...(selections["Accommodation Type"] ?? [])];
  if (acc.length) p.set("accommodation", acc.join(","));
  const plan = [...(selections["Planning With"] ?? [])];
  if (plan.length) p.set("planningWith", plan.join(","));
  const bucket = [...(selections["Bucket List"] ?? [])];
  if (bucket.length) p.set("bucketList", bucket.join(","));
  return p.toString();
}


/* ── BucketListPanel ── */
function BucketListPanel({ sel, onAdd, onRemove }: {
  sel: Set<string>;
  onAdd: (v: string) => void;
  onRemove: (v: string) => void;
}) {
  const [input, setInput] = useState("");

  function addFromInput(raw: string) {
    raw.split(",").map(s => s.trim()).filter(s => s && !sel.has(s)).forEach(onAdd);
    setInput("");
  }

  function handleKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") addFromInput(input);
  }

  function handleAdd() { addFromInput(input); }

  return (
    <div className="fs-bucket">
      <p className="fs-bucket-hint">
        Add places from your bucket list. We'll match trips that cover these destinations in their itinerary.
      </p>
      <div className="fs-bucket-input-row">
        <input
          className="fs-bucket-input"
          type="text"
          placeholder="e.g. Leh, Bir, Spiti…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          aria-label="Add a destination to your bucket list"
        />
        <button
          className="fs-bucket-add"
          type="button"
          onClick={handleAdd}
          disabled={!input.trim()}
          aria-label="Add destination"
        >
          Add
        </button>
      </div>
      {sel.size > 0 && (
        <div className="fs-bucket-chips">
          {[...sel].map((place) => (
            <span key={place} className="fs-bucket-chip">
              {place}
              <button
                type="button"
                className="fs-bucket-chip-remove"
                onClick={() => onRemove(place)}
                aria-label={`Remove ${place}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── FilterSheet ── */
export default function FilterSheet({ isOpen, onClose, initialTab = 0 }: { isOpen: boolean; onClose: () => void; initialTab?: number }) {
  const [hasOpened, setHasOpened] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [selections, setSelections] = useState<Record<string, Set<string>>>(() =>
    Object.fromEntries(TABS.map((t) => [t, new Set<string>()]))
  );
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  function seedFromParams(params: URLSearchParams): Record<string, Set<string>> {
    const s: Record<string, Set<string>> = Object.fromEntries(TABS.map(t => [t, new Set<string>()]));
    params.get("destination")?.split(",").filter(Boolean).forEach(v => s["Destinations"].add(v));
    params.get("months")?.split(",").filter(Boolean).forEach(v => s["Date & Duration"].add(v));
    const from = params.get("from");
    if (from) s["Date & Duration"].add(`from:${from}`);
    const to = params.get("to");
    if (to) s["Date & Duration"].add(`to:${to}`);
    params.get("category")?.split(",").filter(Boolean).forEach(v => s["Category"].add(v));
    params.get("planningWith")?.split(",").filter(Boolean).forEach(v => s["Planning With"].add(v));
    params.get("addons")?.split(",").filter(Boolean).forEach(v => s["Add-Ons"].add(v));
    params.get("fromCity")?.split(",").filter(Boolean).forEach(v => s["Departure City"].add(v));
    params.get("accommodation")?.split(",").filter(Boolean).forEach(v => s["Accommodation Type"].add(v));
    params.get("bucketList")?.split(",").map(x => x.trim()).filter(Boolean).forEach(v => s["Bucket List"].add(v));
    return s;
  }

  useEffect(() => { if (isOpen) setHasOpened(true); }, [isOpen]);
  useEffect(() => {
    if (!isOpen) return;
    setActiveTab(initialTab);
    setSelections(seedFromParams(searchParams));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialTab]);

  if (!hasOpened) return null;

  function toggle(tab: string, value: string) {
    setSelections((prev) => {
      const set = new Set(prev[tab] ?? []);
      set.has(value) ? set.delete(value) : set.add(value);
      return { ...prev, [tab]: set };
    });
  }

  function clearTab() {
    setSelections((prev) => ({ ...prev, [TABS[activeTab]]: new Set<string>() }));
  }

  function handleShowResults() {
    const qs = buildSearchParams(selections);
    onClose();
    navigate(`/search${qs ? `?${qs}` : ""}`);
  }

  const activeTabName = TABS[activeTab];
  const activeSel = selections[activeTabName] ?? new Set<string>();

  function renderPanel() {
    switch (activeTabName) {
      case "Destinations":       return <DestinationsPanel sel={activeSel} onToggle={(v) => toggle(activeTabName, v)} />;
      case "Planning With":      return <FilterListPanel items={PLANNING_WITH} sel={activeSel} onToggle={(v) => toggle(activeTabName, v)} />;
      case "Date & Duration":    return <DateDurationPanel sel={activeSel} onToggle={(v) => toggle(activeTabName, v)} />;
      case "Category":           return <FilterListPanel items={CATEGORIES} sel={activeSel} onToggle={(v) => toggle(activeTabName, v)} />;
      case "Add-Ons":            return <FilterListPanel items={ADDONS} sel={activeSel} onToggle={(v) => toggle(activeTabName, v)} />;
      case "Departure City":     return <FilterListPanel items={DEPARTURE_CITIES} sel={activeSel} onToggle={(v) => toggle(activeTabName, v)} />;
      case "Accommodation Type": return <FilterListPanel items={ACCOMMODATION_TYPES} sel={activeSel} onToggle={(v) => toggle(activeTabName, v)} />;
      case "Bucket List":        return <BucketListPanel sel={activeSel} onAdd={(v) => toggle(activeTabName, v)} onRemove={(v) => toggle(activeTabName, v)} />;
      default: return null;
    }
  }

  return (
    <div
      className={`fs-overlay${isOpen ? " fs-overlay--open" : ""}`}
      onClick={onClose}
      aria-hidden={!isOpen}
    >
      <div
        className={`fs-sheet${isOpen ? " fs-sheet--open" : ""}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Filters"
      >
        <button className="fs-close" type="button" aria-label="Close filters" onClick={onClose}>
          <img src="/figma/filter/icon-close.svg" alt="" width={33} height={33} />
        </button>
        <div className="fs-header">
          <span className="fs-title">Filters</span>
        </div>
        <div className="fs-card">
          <nav className="fs-tabs" aria-label="Filter categories">
            {TABS.map((tab, i) => {
              const count = selections[tab]?.size ?? 0;
              return (
                <button
                  key={tab}
                  type="button"
                  className={`fs-tab${activeTab === i ? " fs-tab--active" : ""}`}
                  onClick={() => setActiveTab(i)}
                  aria-selected={activeTab === i}
                >
                  <span className="fs-tab-label">{tab}</span>
                  {count > 0 && <span className="fs-tab-count">{count}</span>}
                </button>
              );
            })}
          </nav>
          <div className="fs-content">{renderPanel()}</div>
        </div>
        <div className="fs-footer">
          <button className="fs-btn-clear" type="button" onClick={clearTab}>Clear selection</button>
          <button className="fs-btn-show" type="button" onClick={handleShowResults}>Show Results</button>
        </div>
      </div>
    </div>
  );
}
