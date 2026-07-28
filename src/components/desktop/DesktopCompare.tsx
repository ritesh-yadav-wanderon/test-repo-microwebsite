import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Trip } from "../../types";
import { useCompare } from "../../context/CompareContext";
import { SAMPLE_UPCOMING_TRIPS } from "../../api/sampleData";
import DesktopFooter from "./DesktopFooter";
import "./DesktopCompare.css";

const P = "/figma/compare/";
const D = "/figma/compare/desktop/";

/* ── Static demo detail — the trip API does not return these fields yet, so
      every column shares them (same approach as the mobile Compare page). ── */
const SERVICES = [
  { icon: `${P}icon-concierge.svg`, label: "9N Accommodation" },
  { icon: `${P}icon-meal.svg`, label: "12 Meals" },
  { icon: `${P}icon-taxi.svg`, label: "10 Shared Transfers" },
  { icon: `${P}icon-hiking.svg`, label: "12 Activities" },
  { icon: `${P}icon-guide.svg`, label: "Trip Captains, Local Guides" },
];

const ITINERARY = [
  { day: 1, place: "London" },
  { day: 2, place: "Paris" },
  { day: 3, place: "Paris" },
  { day: 4, place: "Swiss Alps" },
  { day: 5, place: "Beaujolais Wine Region" },
  { day: 6, place: "Barcelona" },
  { day: 7, place: "French Riviera" },
  { day: 8, place: "Florence" },
];

const EXPERIENCES = [
  { img: `${P}exp-1.png`, label: "Paris City Sightseeing Tour - Paris City Tour On A Shared Basis" },
  { img: `${P}exp-2.png`, label: "Eiffel Tower Guided Tour With Summit Access" },
  { img: `${P}exp-3.png`, label: "Palace of Versailles" },
  { img: `${P}exp-4.png`, label: "1 Hour Seine River Cruise" },
  { img: `${P}exp-4.png`, label: "Paris Night Tour On A Shared Basis" },
];

const STATIC_DAYS = "15 Days";
const STATIC_PLACES = "Paris, Amsterdam, Prague, Vienna, Budapest";
const STATIC_GROUP = "50 people";

interface Column {
  slug: string;
  image: string;
  title: string;
  price: string;
  days: string;
  places: string;
  groupSize: string;
}

/* Fallback columns shown when the compare tray is empty (demo data). */
const DEMO_COLUMNS: Column[] = [1, 2].map((i) => ({
  slug: `demo-${i}`,
  image: `${P}trip-hero.jpg`,
  title:
    i === 1
      ? "15-Day Europe Group Trip 2026: Paris to Budapest"
      : "12-Day European Discovery 2026: Paris to Budapest",
  price: i === 1 ? "Rs.98,990/- Per Person" : "Rs.1,20,000/- Per Person",
  days: STATIC_DAYS,
  places: STATIC_PLACES,
  groupSize: STATIC_GROUP,
}));

function fmtPrice(raw: string): string {
  const num = Number(raw.replace(/[^\d]/g, ""));
  return num ? `Rs.${num.toLocaleString("en-IN")}/- Per Person` : raw;
}

const DIFF_FIELDS = ["price", "days", "places", "groupSize"] as const;
type DiffField = (typeof DIFF_FIELDS)[number];

/** Mini trip card in the add-another-trip column. */
function SuggestionCard({ trip }: { trip: Trip }) {
  const { toggle } = useCompare();
  const price = Number(String(trip.startingPrice ?? "").replace(/[^\d]/g, "")).toLocaleString("en-IN");

  return (
    <div className="dcmp-sug">
      <div className="dcmp-sug-img">
        <img src={trip.image} alt={trip.title} loading="lazy" />
        <button
          className="dcmp-sug-add"
          type="button"
          onClick={() =>
            toggle({
              slug: trip.slug,
              title: trip.title,
              image: trip.image,
              price: String(trip.startingPrice ?? ""),
            })
          }
        >
          <img src="/figma/trip-hero/icon-compare.svg" alt="" width={14} height={14} aria-hidden />
          Add to Compare
        </button>
      </div>
      <div className="dcmp-sug-body">
        <p className="dcmp-sug-title">{trip.title}</p>
        <div className="dcmp-sug-loc">
          <img src={`${D}icon-location.svg`} alt="" width={16} height={16} aria-hidden />
          <span>{trip.pickDropPoint || "New Delhi - Kenya"}</span>
        </div>
        <div className="dcmp-sug-dur">
          <img src={`${D}icon-calendar-clock.svg`} alt="" width={17} height={17} aria-hidden />
          <span>
            {trip.duration?.nights && trip.duration?.days
              ? `${trip.duration.nights}N/${trip.duration.days}D`
              : "7N/8D"}
          </span>
        </div>
        <p className="dcmp-sug-dates">
          09 May, 12 May, <strong>+10 More...</strong>
        </p>
        <div className="dcmp-sug-price-row">
          <span className="dcmp-sug-strike">₹{price}/-</span>
          <span className="dcmp-sug-price">₹{price}/-</span>
        </div>
        <p className="dcmp-sug-sub">Onwards per person</p>
      </div>
    </div>
  );
}

/** Desktop compare page (Figma 6509:30416). */
export default function DesktopCompare() {
  const navigate = useNavigate();
  const { items, isInCompare, remove } = useCompare();
  const [showDiff, setShowDiff] = useState(false);
  const [query, setQuery] = useState("");

  const columns = useMemo<Column[]>(() => {
    if (!items.length) return DEMO_COLUMNS;
    return items.map((t) => ({
      slug: t.slug,
      image: t.image,
      title: t.title,
      price: fmtPrice(t.price),
      days: STATIC_DAYS,
      places: STATIC_PLACES,
      groupSize: STATIC_GROUP,
    }));
  }, [items]);

  const differing = useMemo(
    () =>
      new Set<DiffField>(
        DIFF_FIELDS.filter((f) => new Set(columns.map((c) => c[f])).size > 1)
      ),
    [columns]
  );
  const diffClass = (field: DiffField) =>
    showDiff && differing.has(field) ? " dcmp-diff" : "";

  /* Pool of addable trips: deduped by slug, minus what's already in the tray. */
  const pool = useMemo<Trip[]>(() => {
    const seen = new Set<string>();
    return SAMPLE_UPCOMING_TRIPS.flatMap((g) => g.tripsArray).filter((t) => {
      if (seen.has(t.slug) || isInCompare(t.slug)) return false;
      seen.add(t.slug);
      return true;
    });
  }, [isInCompare]);

  /* Empty query → one suggested trip; otherwise filter the pool in place. */
  const trimmed = query.trim().toLowerCase();
  const results = useMemo<Trip[]>(() => {
    if (!trimmed) return pool.slice(0, 1);
    return pool
      .filter(
        (t) =>
          t.title.toLowerCase().includes(trimmed) ||
          (t.pickDropPoint ?? "").toLowerCase().includes(trimmed)
      )
      .slice(0, 4);
  }, [pool, trimmed]);

  return (
    <div className="dcmp">
      {/* ── Slim page header (Figma 6674:26125) ── */}
      <header className="dcmp-header">
        <button className="dcmp-back" type="button" aria-label="Go back" onClick={() => navigate(-1)}>
          <img src={`${P}arrow-back.svg`} alt="" width={24} height={24} />
        </button>
        <h1 className="dcmp-header-title">Compare Trips</h1>
      </header>

      <div className="dcmp-body">
        {/* ── Left section rail ── */}
        <aside className="dcmp-rail">
          <div className="dcmp-rail-card">
            <div className="dcmp-rail-head">Basic Info</div>
            <div className="dcmp-rail-items">
              {["No. of Days", "No. of Places", "Group Size", "Inclusions"].map((label) => (
                <div key={label} className="dcmp-rail-item">
                  {label}
                </div>
              ))}
            </div>
          </div>
          <div className="dcmp-rail-card">
            <div className="dcmp-rail-head">Trip Details</div>
            <div className="dcmp-rail-items">
              {/* Tall row spans the itinerary block so "Experiences" lines up
                  with the experiences section in the columns (Figma 6581:15021). */}
              <div className="dcmp-rail-item dcmp-rail-item--itin">Itinerary</div>
              <div className="dcmp-rail-item">Experiences</div>
            </div>
          </div>
        </aside>

        {/* ── Main column ── */}
        <div className="dcmp-main">
          {/* AI trip comparison banner */}
          <div className="dcmp-ai">
            <div className="dcmp-ai-label">
              <span>Trip Comparison</span>
              <img src={`${P}wand-shine.svg`} alt="" width={16} height={16} aria-hidden />
            </div>
            <p className="dcmp-ai-text">
              <strong>Italy: Trekking through the Dolomites </strong>
              offers alpine hikes and Prosecco, a cool mountain escape unlike our tropical routes,
              perfect for those craving crisp air. Egypt 360°: From the Giza Pyramids to the Red Sea
              explores ancient wonders and desert history, contrasting with our nature-heavy trips,
              ideal for those wanting to channel their inner Indiana Jones.{" "}
              <strong>Indonesia 360°: Java, Bali and the Gili islands blends</strong> volcano
              trekking and surfing for a high-energy tropical fix unlike our historical routes,
              perfect for those seeking pure island vibes.
            </p>
          </div>

          {/* Highlights Differences toggle */}
          <div className="dcmp-diff-row">
            <button
              type="button"
              role="switch"
              aria-checked={showDiff}
              className="dcmp-diff-toggle"
              onClick={() => setShowDiff((v) => !v)}
            >
              <span>Highlights Differences</span>
              <img
                src={`/figma/listing/toggle/toggle-${showDiff ? "on" : "off"}.svg`}
                alt=""
                aria-hidden
              />
            </button>
          </div>

          {/* Comparison grid */}
          <div className="dcmp-grid">
            {columns.map((trip, idx) => (
              <div key={trip.slug} className="dcmp-col-wrap">
                {idx > 0 && <div className="dcmp-vline" aria-hidden />}
                <div className="dcmp-col">
                  <div className="dcmp-col-img">
                    <img src={trip.image} alt={trip.title} loading="lazy" />
                    {items.length > 0 && (
                      <button
                        className="dcmp-col-bin"
                        type="button"
                        aria-label={`Remove ${trip.title} from comparison`}
                        onClick={() => remove(trip.slug)}
                      >
                        <img src={`${P}bin.svg`} alt="" width={12} height={12} />
                      </button>
                    )}
                  </div>

                  <div className="dcmp-col-info">
                    <p className="dcmp-col-title">{trip.title}</p>
                    <div className="dcmp-col-price-row">
                      <span className="dcmp-col-price-label">
                        <img src={`${P}icon-discount.svg`} alt="" width={14} height={14} aria-hidden />
                        Starting Price:
                      </span>
                      <span className={`dcmp-col-price${diffClass("price")}`}>{trip.price}</span>
                    </div>
                  </div>

                  {/* Basic info rows — heights match the left rail */}
                  <div className="dcmp-col-basics">
                    <div className="dcmp-col-row">
                      <img src={`${D}icon-days.svg`} alt="" width={14} height={14} aria-hidden />
                      <span className={diffClass("days")}>{trip.days}</span>
                    </div>
                    <div className="dcmp-col-row dcmp-col-row--top">
                      <img src={`${D}icon-places.svg`} alt="" width={14} height={14} aria-hidden />
                      <span className={diffClass("places")}>{trip.places}</span>
                    </div>
                    <div className="dcmp-col-row">
                      <img src={`${D}icon-group.svg`} alt="" width={14} height={14} aria-hidden />
                      <span className={diffClass("groupSize")}>{trip.groupSize}</span>
                    </div>
                    <div className="dcmp-col-services">
                      {SERVICES.map((s) => (
                        <span key={s.label} className="dcmp-service">
                          <img src={s.icon} alt="" width={12} height={12} aria-hidden />
                          {s.label}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Itinerary */}
                  <div className="dcmp-col-itin">
                    {ITINERARY.map((d) => (
                      <div key={d.day} className="dcmp-itin-row">
                        <span>Day {d.day}:</span>
                        <span>{d.place}</span>
                      </div>
                    ))}
                    <button className="dcmp-show-more" type="button">
                      Show More
                    </button>
                  </div>

                  {/* Experiences */}
                  <div className="dcmp-col-exps">
                    {EXPERIENCES.map((exp) => (
                      <div key={exp.label} className="dcmp-exp-row">
                        <img src={exp.img} alt="" loading="lazy" />
                        <p>{exp.label}</p>
                      </div>
                    ))}
                    <button className="dcmp-show-more" type="button">
                      Show More
                    </button>
                  </div>

                  <button className="dcmp-book" type="button" onClick={() => navigate("/booking")}>
                    Book Trip
                  </button>
                </div>
              </div>
            ))}

            {/* ── Add-another-trip column ── */}
            <aside className="dcmp-add">
              <div className="dcmp-add-search-wrap">
                <label className="dcmp-add-search">
                  <img src={`${D}icon-search.svg`} alt="" width={16} height={15} aria-hidden />
                  <input
                    type="search"
                    placeholder="Search trips"
                    aria-label="Search trips to add to comparison"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </label>
                <p className="dcmp-add-hint">
                  To add another trip, you can use the search to find what you are interested in!
                </p>
              </div>

              {results.length > 0 && (
                <p className="dcmp-add-label">{trimmed ? "Search Results" : "Suggested Trips"}</p>
              )}
              {results.map((trip) => (
                <SuggestionCard key={trip.slug} trip={trip} />
              ))}
              {trimmed && results.length === 0 && (
                <p className="dcmp-add-noresults">No trips found for “{query.trim()}”.</p>
              )}
            </aside>
          </div>
        </div>
      </div>

      <DesktopFooter />
    </div>
  );
}
