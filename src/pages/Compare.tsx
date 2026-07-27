import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useIsDesktop } from "../hooks/useIsDesktop";
import DesktopCompare from "../components/desktop/DesktopCompare";
import "./Compare.css";

const P = "/figma/compare/";

interface InclusionPill {
  icon: string;
  label: string;
}

interface ItineraryDay {
  day: number;
  place: string;
}

interface Experience {
  img: string;
  label: string;
}

interface CompareTrip {
  id: number;
  image: string;
  title: string;
  price: string;
  days: string;
  places: string;
  groupSize: string;
  inclusions: InclusionPill[];
  itinerary: ItineraryDay[];
  experiences: Experience[];
}

const INCLUSIONS: InclusionPill[] = [
  { icon: `${P}icon-concierge.svg`, label: "9N Accommodation" },
  { icon: `${P}icon-meal.svg`, label: "12 Meals" },
  { icon: `${P}icon-taxi.svg`, label: "10 Shared Transfers" },
  { icon: `${P}icon-hiking.svg`, label: "12 Activities" },
  { icon: `${P}icon-guide.svg`, label: "Trip Captains, Local Guides" },
];

const ITINERARY: ItineraryDay[] = [
  { day: 1, place: "London" },
  { day: 2, place: "Paris" },
  { day: 3, place: "Paris" },
  { day: 4, place: "Swiss Alps" },
  { day: 5, place: "Beaujolais Wine Region" },
  { day: 6, place: "Barcelona" },
  { day: 7, place: "French Riviera" },
  { day: 8, place: "Florence" },
];

const EXPERIENCES: Experience[] = [
  { img: `${P}exp-1.png`, label: "Paris City Sightseeing Tour - Paris City Tour On A Shared Basis" },
  { img: `${P}exp-2.png`, label: "Eiffel Tower Guided Tour With Summit Access" },
  { img: `${P}exp-3.png`, label: "Palace of Versailles" },
  { img: `${P}exp-4.png`, label: "1 Hour Seine River Cruise" },
  { img: `${P}exp-4.png`, label: "Paris Night Tour On A Shared Basis" },
];

const TRIPS: CompareTrip[] = [
  {
    id: 1,
    image: `${P}trip-hero.jpg`,
    title: "8-Day Europe Group Trip 2026: Paris to Budapest",
    price: "Rs.98,990/- Per Person",
    days: "7 Nights / 8 Days",
    places: "Paris, Amsterdam, Prague, Vienna, Budapest",
    groupSize: "50 People",
    inclusions: INCLUSIONS,
    itinerary: ITINERARY,
    experiences: EXPERIENCES,
  },
  {
    id: 2,
    image: `${P}trip-hero.jpg`,
    title: "12-Day European Discovery 2026: Paris to Budapest",
    price: "Rs.1,20,000/- Per Person",
    days: "11 Nights / 12 Days",
    places: "England, France, Netherlands, Germany, Italy, Switzerland",
    groupSize: "50 People",
    inclusions: INCLUSIONS,
    itinerary: ITINERARY,
    experiences: EXPERIENCES,
  },
];

/* Fields the "Highlights Differences" toggle can flag */
const DIFF_FIELDS = ["price", "days", "places", "groupSize"] as const;
type DiffField = (typeof DIFF_FIELDS)[number];

const DIFFERING_FIELDS = new Set<DiffField>(
  DIFF_FIELDS.filter((f) => new Set(TRIPS.map((t) => t[f])).size > 1)
);

function SectionHead({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="cpt-section-hd">
      <img src={icon} alt="" width={16} height={16} loading="lazy" />
      <span>{label}</span>
    </div>
  );
}

export default function Compare() {
  const navigate = useNavigate();
  const isDesktop = useIsDesktop();
  const [showDiff, setShowDiff] = useState(false);

  if (isDesktop) return <DesktopCompare />;

  const diffClass = (field: DiffField) =>
    showDiff && DIFFERING_FIELDS.has(field) ? " cpt-val--diff" : "";

  return (
    <div className="cpt-page">
      {/* Header */}
      <div className="cpt-header">
        <div className="cpt-header-left">
          <button className="cpt-icon-btn" type="button" onClick={() => navigate(-1)} aria-label="Go back">
            <img src={`${P}arrow-back.svg`} alt="" width={24} height={24} loading="lazy" />
          </button>
          <span className="cpt-header-title">Compare trips</span>
        </div>
        <button className="cpt-icon-btn" type="button" onClick={() => navigate(-1)} aria-label="Close">
          <img src={`${P}icon-close.svg`} alt="" width={30} height={30} loading="lazy" />
        </button>
      </div>

      {/* AI comparison banner */}
      <div className="cpt-ai-banner">
        <div className="cpt-ai-label">
          <span>Trip Comparison</span>
          <img src={`${P}wand-shine.svg`} alt="" width={16} height={16} loading="lazy" />
        </div>
        <p className="cpt-ai-text">
          <strong>Italy: Trekking through the Dolomites </strong>
          offers alpine hikes and Prosecco, a cool mountain escape unlike our tropical routes,
          perfect for those craving crisp air. Egypt 360°: From the Giza Pyramids to the Red Sea
          explores ancient wonders and desert history, contrasting with our nature-heavy trips,
          ideal for those wanting to channel their inner Indiana Jones.{" "}
          <strong>Indonesia 360°: Java, Bali and the Gili islands blends</strong>
          {" "}volcano trekking and surfing for a high-energy tropical fix unlike our historical
          routes, perfect for those seeking pure island vibes.
        </p>
      </div>

      {/* Highlights Differences toggle — same switch as the listing page */}
      <div className="cpt-diff-row">
        <button
          type="button"
          role="switch"
          aria-checked={showDiff}
          className="cpt-diff-toggle"
          onClick={() => setShowDiff((v) => !v)}
        >
          <span className="cpt-diff-label">Highlights Differences</span>
          <img
            className="cpt-diff-toggle-switch"
            src={`/figma/listing/toggle/toggle-${showDiff ? "on" : "off"}.svg`}
            alt=""
            aria-hidden
          />
        </button>
      </div>

      {/* Horizontally scrollable comparison area */}
      <div className="cpt-scroll-area">
        <div className="cpt-cards-row">
          {TRIPS.map((trip, index) => (
            <div key={trip.id} className="cpt-card-wrap">
              {index > 0 && <div className="cpt-divider" />}
              <div className="cpt-card">

                {/* Hero image */}
                <div className="cpt-card-img-wrap">
                  <img src={trip.image} alt={trip.title} className="cpt-card-img" loading="lazy" />
                  <button className="cpt-card-delete" type="button" aria-label="Remove trip">
                    <img src={`${P}bin.svg`} alt="" width={12} height={12} loading="lazy" />
                  </button>
                </div>

                {/* Title + price */}
                <div className="cpt-card-info">
                  <p className="cpt-card-title">{trip.title}</p>
                  <div className="cpt-card-price-row">
                    <span className="cpt-card-price-prefix">
                      <img src={`${P}icon-discount.svg`} alt="" width={14} height={14} loading="lazy" />
                      <span>Starting Price:</span>
                    </span>
                    <span className={`cpt-card-price${diffClass("price")}`}>{trip.price}</span>
                  </div>
                </div>

                {/* Number of Days */}
                <div className="cpt-section">
                  <SectionHead icon={`${P}icon-calendar.svg`} label="Number of Days" />
                  <p className={`cpt-val${diffClass("days")}`}>{trip.days}</p>
                </div>

                {/* Number of Places */}
                <div className="cpt-section cpt-section--places">
                  <SectionHead icon={`${P}icon-location.svg`} label="Number of Places" />
                  <p className={`cpt-val${diffClass("places")}`}>{trip.places}</p>
                </div>

                {/* Group Size */}
                <div className="cpt-section">
                  <SectionHead icon={`${P}icon-groups.svg`} label="Group Size" />
                  <p className={`cpt-val${diffClass("groupSize")}`}>{trip.groupSize}</p>
                </div>

                {/* Inclusions */}
                <div className="cpt-section">
                  <SectionHead icon={`${P}icon-inclusions.svg`} label="Inclusions" />
                  <div className="cpt-pills">
                    {trip.inclusions.map((inc) => (
                      <span key={inc.label} className="cpt-pill">
                        <img src={inc.icon} alt="" width={12} height={12} loading="lazy" />
                        <span>{inc.label}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Itinerary */}
                <div className="cpt-section">
                  <SectionHead icon={`${P}icon-itinerary.svg`} label="Itinerary" />
                  <div className="cpt-itin">
                    {trip.itinerary.map((d) => (
                      <div key={d.day} className="cpt-itin-row">
                        <span>Day {d.day}:</span>
                        <span>{d.place}</span>
                      </div>
                    ))}
                    <span className="cpt-show-more">Show More</span>
                  </div>
                </div>

                {/* Experiences */}
                <div className="cpt-section">
                  <SectionHead icon={`${P}icon-experiences.svg`} label="Experiences" />
                  <div className="cpt-exps">
                    {trip.experiences.map((exp) => (
                      <div key={exp.label} className="cpt-exp-row">
                        <img className="cpt-exp-img" src={exp.img} alt="" loading="lazy" />
                        <p className="cpt-exp-text">{exp.label}</p>
                      </div>
                    ))}
                    <span className="cpt-show-more">Show More</span>
                  </div>
                </div>

                <button type="button" className="cpt-book-btn">Book Trip</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
