import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import BurgerMenu from "../components/BurgerMenu/BurgerMenu";
import "./EventDetail.css";

const A = "/figma/event/";
const EV = "/figma/events/";

const HERO_VIDEO =
  "https://wanderon-images.gumlet.io/events-and-festivals/events-and-festivals/tomorrowland-thailand/tomorrowland.mp4";

const EVENT = {
  title: "Tomorrowland Belgium | ORBYZ",
  dates: "Jul 18, 2026 - Jul 25, 2026 | 7N/8D",
  pickup: "Paris Charles de Gaulle Airport",
  drop: "Budapest Ferenc Liszt International Airport",
  price: "98,990",
  discount: "-10%",
  about:
    "Get ready for the ultimate Euro experience that fuses iconic cities, party vibes, and the legendary Tomorrowland Festival!",
  thingsToKnow: [
    { icon: `${A}tk-included.svg`, label: "Inlcuded", value: "Travel + Stay + Concert Ticket" },
    { icon: `${A}tk-venue.svg`, label: "Venue", value: "De Schorre Recreation Ground, Boom 2850, Belgium" },
    { icon: `${A}tk-crowd.svg`, label: "Crowd", value: "400,000 Fans Expected" },
    { icon: `${A}tk-genre.svg`, label: "Genre", value: "EDM, techno, hardstyle, drum & bass" },
  ],
};

interface ItineraryDay {
  day: number;
  title: string;
  image?: string;
  highlights: string[];
  meals: string;
}

const ITINERARY: ItineraryDay[] = [
  { day: 1, title: "Arrival in Paris", image: `${A}gallery-4.jpg`, highlights: ["Day at Leisure", "Millennium Hotel Paris Charles De-Gaulle", "Enjoy your time at Leisure"], meals: "Breakfast" },
  { day: 2, title: "Paris Sightseeing Tour", image: `${A}gallery-7.jpg`, highlights: ["Eiffel Tower & city landmarks", "Seine river walk"], meals: "Breakfast" },
  { day: 3, title: "Day Trip to Disneyland Paris", image: `${A}gallery-9.jpg`, highlights: ["Disneyland Paris"], meals: "Breakfast" },
  { day: 4, title: "Arrive in Amsterdam", image: `${A}gallery-2.jpg`, highlights: ["Brussels Sightseeing Tour", "Visit to Mini Europe"], meals: "Breakfast" },
  { day: 5, title: "Arrive in Frankfurt", image: `${A}gallery-5.jpg`, highlights: ["Keukenhof Gardens", "Amsterdam Canal Cruise"], meals: "Breakfast" },
  { day: 6, title: "Arrive in Switzerland", image: `${A}gallery-8.jpg`, highlights: ["Rhine Falls Boat Tour"], meals: "Breakfast" },
  { day: 7, title: "Excursion to Jungfraujoch", image: `${A}gallery-6.jpg`, highlights: ["Day Trip to Jungfraujoch"], meals: "Breakfast" },
  { day: 8, title: "Departure Day", highlights: ["Check Out from your hotel"], meals: "Breakfast" },
];

const GALLERY = [
  { src: `${A}gallery-1.jpg`, h: 205 },
  { src: `${A}gallery-2.jpg`, h: 132 },
  { src: `${A}gallery-3.jpg`, h: 205 },
  { src: `${A}gallery-4.jpg`, h: 166 },
  { src: `${A}gallery-5.jpg`, h: 205 },
  { src: `${A}gallery-6.jpg`, h: 142 },
  { src: `${A}gallery-7.jpg`, h: 179 },
  { src: `${A}gallery-8.jpg`, h: 205 },
  { src: `${A}gallery-9.jpg`, h: 134 },
];

const SPOTLIGHT = [`${A}gallery-1.jpg`, `${A}gallery-5.jpg`, `${A}gallery-7.jpg`];

type Tab = "about" | "itinerary" | "gallery";

export default function EventDetail() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("about");
  const [saved, setSaved] = useState(false);
  const [compared, setCompared] = useState(false);
  const [playing, setPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play();
    else v.pause();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: EVENT.title, url: window.location.href }).catch(() => {});
    }
  };

  const handleBook = () => {
    navigate("/booking", {
      state: {
        tripTitle: EVENT.title,
        tripName: EVENT.title,
        dateRange: EVENT.dates,
        perPerson: EVENT.price,
        travelers: 1,
      },
    });
  };

  return (
    <div className="epd-page">
      {/* Hero video with overlays */}
      <div className="epd-hero">
        <video
          ref={videoRef}
          className="epd-hero-video"
          src={HERO_VIDEO}
          poster={`${EV}hero-bg.jpg`}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        />

        {/* Top nav */}
        <header className="epd-topnav">
          <button className="epd-round-btn" type="button" aria-label="Back" onClick={() => navigate("/events")}>
            <img src={`${A}arrow-back.svg`} width={20} height={20} alt="" aria-hidden />
          </button>
          <button className="epd-menu" type="button" aria-label="Open menu" onClick={() => setMenuOpen(true)}>
            <img src={`${EV}menu.svg`} alt="" className="epd-menu-icon" aria-hidden />
          </button>
        </header>

        {/* Hero action chips */}
        <div className="epd-hero-actions">
          <button
            className={`epd-chip epd-chip--icon${saved ? " epd-chip--active" : ""}`}
            type="button"
            aria-label="Add to wishlist"
            aria-pressed={saved}
            onClick={() => setSaved((s) => !s)}
          >
            <img src={`${A}heart.svg`} alt="" className="epd-chip-heart" aria-hidden />
          </button>
          <button className="epd-chip" type="button" onClick={() => setCompared((c) => !c)}>
            <img src="/figma/nav2/events/compare.svg" alt="" className="epd-chip-ico" aria-hidden />
            <span>{compared ? "Remove from Compare" : "Add to Compare"}</span>
          </button>
          <button className="epd-chip" type="button" onClick={handleShare}>
            <img src={`${A}share.svg`} alt="" className="epd-chip-ico" aria-hidden />
            <span>Share</span>
          </button>
          <button
            className="epd-chip epd-chip--icon"
            type="button"
            aria-label={playing ? "Pause" : "Play"}
            aria-pressed={playing}
            onClick={togglePlay}
          >
            <img src={`${A}play-circle.svg`} alt="" className="epd-chip-play" aria-hidden />
          </button>
        </div>
      </div>

      {/* Content sheet */}
      <div className="epd-sheet">
        <span className="epd-handle" aria-hidden />

        <div className="epd-head">
          <h1 className="epd-title">{EVENT.title}</h1>
          <p className="epd-dates">{EVENT.dates}</p>
        </div>

        <div className="epd-route">
          <div className="epd-route-labels">
            <span className="epd-route-tag">
              <img src={`${A}location.svg`} alt="" aria-hidden /> Pick Up
            </span>
            <span className="epd-route-dash" aria-hidden />
            <span className="epd-route-tag">
              <img src={`${A}location.svg`} alt="" aria-hidden /> Drop
            </span>
          </div>
          <div className="epd-route-places">
            <span className="epd-route-place">{EVENT.pickup}</span>
            <span className="epd-route-place epd-route-place--end">{EVENT.drop}</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="epd-tabs-wrap">
          <div className="epd-tabs" role="tablist">
            {(["about", "itinerary", "gallery"] as Tab[]).map((t) => (
              <button
                key={t}
                type="button"
                role="tab"
                aria-selected={tab === t}
                className={`epd-tab${tab === t ? " epd-tab--active" : ""}`}
                onClick={() => setTab(t)}
              >
                {t === "about" ? "About the Event" : t === "itinerary" ? "Itinerary Details" : "Gallery"}
              </button>
            ))}
          </div>
        </div>

        {/* Tab body */}
        <div className="epd-body">
          {tab === "about" && <AboutBody />}
          {tab === "itinerary" && <ItineraryBody />}
          {tab === "gallery" && <GalleryBody />}
        </div>

        {/* Footer */}
        <div className="epd-footer">
          <img src={`${A}footer-heart.svg`} width={40} height={40} alt="" aria-hidden />
          <p className="epd-footer-text">
            Life's a Trip,
            <br />
            Let's Make Yours Epic!
          </p>
        </div>
      </div>

      {/* Sticky bottom bar */}
      <div className="epd-bottombar">
        <div className="epd-price-col">
          <div className="epd-price-row">
            <span className="epd-price">&#8377;{EVENT.price}/-</span>
            <span className="epd-discount">{EVENT.discount}</span>
          </div>
          <span className="epd-price-sub">Starting price per person</span>
        </div>
        <button className="epd-book" type="button" onClick={handleBook}>
          Book Now
        </button>
      </div>

      <BurgerMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  );
}

function AboutBody() {
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <div className="epd-about">
        <p className="epd-about-text">{EVENT.about}</p>
        <button className="epd-readmore" type="button" onClick={() => setExpanded((e) => !e)}>
          {expanded ? "Read less" : "Read more >"}
        </button>
      </div>

      <div className="epd-tk">
        <h2 className="epd-section-title">Things to Know</h2>
        {EVENT.thingsToKnow.map((item) => (
          <div className="epd-tk-item" key={item.label}>
            <img src={item.icon} width={36} height={36} alt="" className="epd-tk-ico" aria-hidden />
            <div className="epd-tk-text">
              <span className="epd-tk-label">{item.label}</span>
              <span className="epd-tk-value">{item.value}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="epd-divider" aria-hidden />

      <div className="epd-more">
        <h2 className="epd-section-title">More</h2>
        <button className="epd-more-box" type="button">
          <img src={`${A}doc.svg`} width={24} height={24} alt="" aria-hidden />
          <span>Terms &amp; Conditions</span>
          <img src={`${A}chevron.svg`} className="epd-more-chev" alt="" aria-hidden />
        </button>
      </div>
    </>
  );
}

function ItineraryBody() {
  return (
    <div className="epd-itin">
      {ITINERARY.map((d, i) => (
        <div className="epd-day" key={d.day}>
          <div className="epd-day-head">
            <span className="epd-day-badge">Day {d.day}</span>
            <h3 className="epd-day-title">{d.title}</h3>
          </div>
          {d.image && (
            <div className="epd-day-media">
              <img src={d.image} alt={d.title} loading="lazy" />
            </div>
          )}
          <ul className="epd-day-list">
            {d.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
          <div className="epd-day-meal">
            <span className="epd-day-meal-dot" aria-hidden />
            Meals: {d.meals}
          </div>
          {i < ITINERARY.length - 1 && <div className="epd-day-divider" aria-hidden />}
        </div>
      ))}
      <p className="epd-itin-end">End Of the Journey</p>
    </div>
  );
}

function GalleryBody() {
  const [spot, setSpot] = useState(0);
  return (
    <div className="epd-gallery-body">
      <h2 className="epd-section-title epd-gallery-title">Gallery</h2>
      <div className="epd-gallery-scroll">
        {GALLERY.map((g, i) => (
          <div className="epd-gallery-item" key={i} style={{ height: g.h }}>
            <img src={g.src} alt="" loading="lazy" />
          </div>
        ))}
      </div>

      <div className="epd-strip" aria-hidden />

      <div className="epd-spotlight">
        <h2 className="epd-section-title">Event Spotlight</h2>
        <div className="epd-spot-scroll" onScroll={(e) => {
          const el = e.currentTarget;
          setSpot(Math.round(el.scrollLeft / 216));
        }}>
          {SPOTLIGHT.map((src, i) => (
            <button className="epd-spot-card" key={i} type="button">
              <img src={src} alt="" loading="lazy" />
              <span className="epd-spot-play">
                <img src={`${A}play-sm.svg`} width={20} height={20} alt="" aria-hidden />
              </span>
            </button>
          ))}
        </div>
        <div className="epd-dots" aria-hidden>
          {SPOTLIGHT.map((_, i) => (
            <span key={i} className={`epd-dot${i === spot ? " epd-dot--active" : ""}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
