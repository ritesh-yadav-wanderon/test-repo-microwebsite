import { useNavigate } from "react-router-dom";
import "./Compare.css";

const P = "/figma/compare/";

const TRIPS = [
  {
    id: 1,
    image: `${P}trip-hero.png`,
    title: "15-Day Europe Group Trip 2026: Paris to Budapest",
    priceLabel: "Starting Price:",
    price: "Rs.98,990/- Per Person",
    route: "3N Paris → 3N Amsterdam → 3N Prague → 2N Vienna",
    inclusions: [
      "Paris - Eiffel Tower Visit, Seine River Cruise, Disneyland/Louvre Museum",
      "Amsterdam - Canal Cruise, Heineken Experience, Dutch Villages of Zaanse Schans",
      "Prague - Old Town Square, Charles Bridge, Prague Castle",
      "Vienna - St. Stephen's Cathedral, Hofburg Palace",
      "Budapest - Boat Party, Szechenyi Thermal Baths, Central Market Hall, Buda Castle",
    ],
    services: [
      {
        icon: `${P}icon-hotel.svg`,
        label: "Stay + Breakfast",
        desc: "Paris, Amsterdam, Prague, Vienna, Budapest",
      },
      {
        icon: `${P}icon-taxi.svg`,
        label: "Transport",
        desc: "All Transportation by A/C Vehicles on a shared basis",
      },
    ],
    exclusions: [
      {
        icon: `${P}icon-flight.svg`,
        label: "Flights",
        desc: "Round-trip Airfare and Taxes",
      },
      {
        icon: `${P}icon-passport.svg`,
        label: "Visa",
        desc: "Visa Services and Charges",
      },
    ],
  },
  {
    id: 2,
    image: `${P}trip-hero.png`,
    title: "15-Day Europe Group Trip 2026: Paris to Budapest",
    priceLabel: "Starting Price:",
    price: "Rs.98,990/- Per Person",
    route: "3N Paris → 3N Amsterdam → 3N Prague → 2N Vienna",
    inclusions: [
      "Paris - Eiffel Tower Visit, Seine River Cruise, Disneyland/Louvre Museum",
      "Amsterdam - Canal Cruise, Heineken Experience, Dutch Villages of Zaanse Schans",
      "Prague - Old Town Square, Charles Bridge, Prague Castle",
      "Vienna - St. Stephen's Cathedral, Hofburg Palace",
      "Budapest - Boat Party, Szechenyi Thermal Baths, Central Market Hall, Buda Castle",
    ],
    services: [
      {
        icon: `${P}icon-hotel.svg`,
        label: "Stay + Breakfast",
        desc: "Paris, Amsterdam, Prague, Vienna, Budapest",
      },
      {
        icon: `${P}icon-taxi.svg`,
        label: "Transport",
        desc: "All Transportation by A/C Vehicles on a shared basis",
      },
    ],
    exclusions: [
      {
        icon: `${P}icon-flight.svg`,
        label: "Flights",
        desc: "Round-trip Airfare and Taxes",
      },
      {
        icon: `${P}icon-passport.svg`,
        label: "Visa",
        desc: "Visa Services and Charges",
      },
    ],
  },
];

export default function Compare() {
  const navigate = useNavigate();

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
          <img src={`${P}wand-shine.svg`} alt="" width={16} height={16} loading="lazy" />
          <span>Trip Comparison</span>
        </div>
        <p className="cpt-ai-text">
          Both trips cover the same 15-day Paris → Budapest itinerary at ₹98,990/person with identical inclusions — stay, breakfast, and shared A/C transport across 5 cities. Neither includes flights or visa. Check departure dates and batch availability to make your pick.
        </p>
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

                {/* Title + price + route */}
                <div className="cpt-card-info">
                  <p className="cpt-card-title">{trip.title}</p>
                  <div className="cpt-card-price-row">
                    <span className="cpt-card-price-prefix">
                      <img src={`${P}icon-discount.svg`} alt="" width={14} height={14} loading="lazy" />
                      <span className="cpt-card-price-label">{trip.priceLabel}</span>
                    </span>
                    <span className="cpt-card-price">{trip.price}</span>
                  </div>
                  <p className="cpt-card-route">{trip.route}</p>
                </div>

                {/* Inclusions — activities */}
                <div className="cpt-section">
                  <div className="cpt-section-hd">
                    <img src={`${P}icon-hiking.svg`} alt="" width={14} height={14} loading="lazy" />
                    <span>Inclusions</span>
                  </div>
                  <ul className="cpt-bullet-list">
                    {trip.inclusions.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                {/* Inclusions — services */}
                <div className="cpt-section">
                  <div className="cpt-section-hd">
                    <img src={`${P}icon-checklist.svg`} alt="" width={14} height={14} loading="lazy" />
                    <span>Inclusions</span>
                  </div>
                  <div className="cpt-service-rows">
                    {trip.services.map((s) => (
                      <div key={s.label} className="cpt-service-row">
                        <span className="cpt-service-pill cpt-service-pill--green">
                          <img src={s.icon} alt="" width={12} height={12} loading="lazy" />
                          <span>{s.label}</span>
                        </span>
                        <p className="cpt-service-desc">{s.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Exclusions */}
                <div className="cpt-section">
                  <div className="cpt-section-hd">
                    <img src={`${P}icon-block.svg`} alt="" width={14} height={14} loading="lazy" />
                    <span>Exclusions</span>
                  </div>
                  <div className="cpt-service-rows">
                    {trip.exclusions.map((e) => (
                      <div key={e.label} className="cpt-service-row">
                        <span className="cpt-service-pill cpt-service-pill--grey">
                          <img src={e.icon} alt="" width={12} height={12} loading="lazy" />
                          <span>{e.label}</span>
                        </span>
                        <p className="cpt-service-desc">{e.desc}</p>
                      </div>
                    ))}
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
