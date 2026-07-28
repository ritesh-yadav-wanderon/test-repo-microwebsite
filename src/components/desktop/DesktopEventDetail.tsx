import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import DesktopNav from "./DesktopNav";
import EventItinerary, { ITINERARY } from "../EventItinerary/EventItinerary";
import "./DesktopEventDetail.css";

const A = "/figma/event/";
const EV = "/figma/events/";

const HERO_VIDEO =
  "https://wanderon-images.gumlet.io/events-and-festivals/events-and-festivals/tomorrowland-thailand/tomorrowland.mp4";

/* Blurred animated backdrop behind the hero (Figma 6626:9523), served from the CDN. */
const HERO_BACKDROP =
  "https://wanderon-images.gumlet.io/new-website-test/event-pdt-page-hero-bg.gif";

/* Content reused from the mobile event product page (src/pages/EventDetail.tsx). */
const EVENT = {
  title: "Tomorrowland Belgium | ORBYZ",
  dates: "Jul 18, 2026 - Jul 25, 2026",
  duration: "7N/8D",
  pickup: "Paris Charles de Gaulle Airport",
  drop: "Budapest Ferenc Liszt International Airport",
  price: "98,990",
  discount: "-10%",
  thingsToKnow: [
    { icon: `${A}tk-included.svg`, label: "Inlcuded", value: "Travel + Stay + Concert Ticket" },
    { icon: `${A}tk-venue.svg`, label: "Venue", value: "De Schorre Recreation Ground, Boom 2850, Belgium" },
    { icon: `${A}tk-crowd.svg`, label: "Crowd", value: "400,000 Fans Expected" },
    { icon: `${A}tk-genre.svg`, label: "Genre", value: "EDM, techno, hardstyle, drum & bass" },
  ],
};

const NIGHTS = [
  { n: 3, city: "Paris" },
  { n: 1, city: "Amsterdam" },
  { n: 1, city: "Frankfurt" },
  { n: 2, city: "Switzerland" },
];

const GALLERY = [
  `${A}gallery-1.jpg`,
  `${A}gallery-2.jpg`,
  `${A}gallery-3.jpg`,
  `${A}gallery-4.jpg`,
  `${A}gallery-5.jpg`,
  `${A}gallery-6.jpg`,
  `${A}gallery-7.jpg`,
  `${A}gallery-8.jpg`,
  `${A}gallery-9.jpg`,
];

const CHOOSE_PHOTOS = GALLERY.slice(0, 5);

function SectionHead() {
  return (
    <div className="depd__choose-head">
      <h2>Why travellers choose WanderOn</h2>
      <p>Straight from their phones. Shot mid-trip, not staged.</p>
    </div>
  );
}

/** Desktop event product page (Figma 6281:24823) — dark-themed detail layout
 *  reusing the mobile event page's content, video and gallery assets. */
export default function DesktopEventDetail() {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [compared, setCompared] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [activeDay, setActiveDay] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const priceNum = Number(EVENT.price.replace(/[^\d]/g, ""));
  const strikePrice = `₹${Math.round(priceNum / 0.9).toLocaleString("en-IN")}/-`;

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
        dateRange: `${EVENT.dates} | ${EVENT.duration}`,
        perPerson: EVENT.price,
        travelers: 1,
      },
    });
  };

  const scrollToDay = (i: number) => {
    setActiveDay(i);
    document.getElementById(`depd-day-${i}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Highlight the Day Plan rail item for the day currently in view.
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) {
          const idx = Number((visible.target as HTMLElement).dataset.dayIdx);
          if (!Number.isNaN(idx)) setActiveDay(idx);
        }
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.25, 0.5] }
    );
    ITINERARY.forEach((_, i) => {
      const el = document.getElementById(`depd-day-${i}`);
      if (el) {
        el.dataset.dayIdx = String(i);
        obs.observe(el);
      }
    });
    return () => obs.disconnect();
  }, []);

  return (
    <div className="depd">
      {/* Blurred gif backdrop behind the hero (Figma 6626:9523) */}
      <div className="depd__backdrop" aria-hidden>
        <img src={HERO_BACKDROP} alt="" />
      </div>

      {/* Global header — transparent by default, black blur on scroll */}
      <DesktopNav dark alwaysShowSearch />

      <div className="depd__inner">
        {/* ── Hero video with action chips (Figma 6340:9603) ── */}
        <section className="depd__hero">
          <video
            ref={videoRef}
            className="depd__hero-video"
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
          <div className="depd__hero-actions">
            <button
              className={`depd__chip depd__chip--icon${saved ? " depd__chip--active" : ""}`}
              type="button"
              aria-label="Add to wishlist"
              aria-pressed={saved}
              onClick={() => setSaved((s) => !s)}
            >
              <img src={`${A}heart.svg`} alt="" width={18} height={18} aria-hidden />
            </button>
            <button className="depd__chip" type="button" onClick={() => setCompared((c) => !c)}>
              <img src="/figma/nav2/events/compare.svg" alt="" width={14} height={14} aria-hidden />
              <span>{compared ? "Remove from Compare" : "Add to Compare"}</span>
            </button>
            <button className="depd__chip" type="button" onClick={handleShare}>
              <img src={`${A}share.svg`} alt="" width={14} height={14} aria-hidden />
              <span>Share</span>
            </button>
            <button
              className="depd__chip depd__chip--icon"
              type="button"
              aria-label={playing ? "Pause" : "Play"}
              aria-pressed={playing}
              onClick={togglePlay}
            >
              <img src={`${A}play-circle.svg`} alt="" width={27} height={27} aria-hidden />
            </button>
          </div>
        </section>

        {/* ── Two-column body: details + sticky booking card ── */}
        <div className="depd__body">
          <div className="depd__main">
            {/* Title + meta chips */}
            <div className="depd__titlebox">
              <h1 className="depd__title">{EVENT.title}</h1>
              <div className="depd__meta">
                <span className="depd__meta-chip">{EVENT.duration}</span>
                <span className="depd__meta-chip">Music</span>
                <span className="depd__meta-chip">Group Size: 40</span>
              </div>
            </div>

            {/* Nights breakdown strip (Figma 6393:9967) */}
            <div className="depd__nights">
              <span className="depd__nights-pill">{EVENT.duration}</span>
              <div className="depd__nights-list">
                {NIGHTS.map((item) => (
                  <div className="depd__nights-item" key={item.city}>
                    <span className="depd__nights-sep" aria-hidden />
                    <span className="depd__nights-num">{item.n}</span>
                    <span className="depd__nights-info">
                      <small>nights in</small>
                      <em>{item.city}</em>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pick Up / Drop (Figma 6393:10006) */}
            <div className="depd__pd">
              <div className="depd__pd-col">
                <span className="depd__pd-label">
                  <img src={`${A}location.svg`} alt="" width={12} height={14} aria-hidden /> Pick Up
                </span>
                <p className="depd__pd-place">{EVENT.pickup}</p>
              </div>
              <span className="depd__pd-line" aria-hidden />
              <div className="depd__pd-col depd__pd-col--right">
                <span className="depd__pd-label">
                  <img src={`${A}location.svg`} alt="" width={12} height={14} aria-hidden /> Drop
                </span>
                <p className="depd__pd-place">{EVENT.drop}</p>
              </div>
            </div>

            <hr className="depd__sep" />

            {/* Things to Know — 2×2 grid (Figma 6593:32669) */}
            <section className="depd__tk">
              <h2 className="depd__tk-title">Things to Know</h2>
              <div className="depd__tk-grid">
                {EVENT.thingsToKnow.map((item) => (
                  <div className="depd__tk-item" key={item.label}>
                    <img src={item.icon} width={36} height={36} alt="" aria-hidden />
                    <div className="depd__tk-text">
                      <span className="depd__tk-label">{item.label}</span>
                      <span className="depd__tk-value">{item.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <hr className="depd__sep" />

            {/* Itinerary — Day Plan rail + accordion day cards */}
            <section className="depd__itin">
              <aside className="depd__dayplan">
                <p className="depd__dayplan-title">Day Plan</p>
                <div className="depd__dayplan-list">
                  {ITINERARY.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      className={`depd__dayplan-item${activeDay === i ? " active" : ""}`}
                      onClick={() => scrollToDay(i)}
                    >
                      <span className="depd__dayplan-dot" aria-hidden />
                      {`Day-${i + 1}`}
                    </button>
                  ))}
                </div>
              </aside>

              <div className="depd__days">
                {/* Same component, design and copy as the mobile itinerary tab */}
                <EventItinerary dayIdPrefix="depd-day-" />
              </div>
            </section>
          </div>

          {/* ── Sticky booking card (Figma 6336:9573) ── */}
          <aside className="depd__book">
            <div className="depd__book-card">
              <p className="depd__book-title">{EVENT.title}</p>
              <div className="depd__book-dates">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M8 2v4M16 2v4M3.5 9h17M5 4.5h14A1.5 1.5 0 0 1 20.5 6v14a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 20V6A1.5 1.5 0 0 1 5 4.5Z" stroke="#adadad" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
                <span>{EVENT.dates}</span>
              </div>
              <hr className="depd__book-sep" />
              <div className="depd__book-price">
                <span className="depd__book-left">
                  <span className="depd__book-disc">{EVENT.discount}</span>
                  <span className="depd__book-strike">{strikePrice}</span>
                </span>
                <span className="depd__book-main">&#8377;{EVENT.price}/-</span>
                <span className="depd__book-sub">Starting price per person</span>
              </div>
              <button className="depd__book-cta" type="button" onClick={handleBook}>
                Book Now
              </button>
              <div className="depd__book-women">
                <img src="/figma/desktop-trip/bc-women.svg" alt="" aria-hidden />
                <span>60% Women travellers have joined!</span>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* ── Why travellers choose WanderOn — photo strip (Figma 6313:8694) ── */}
      <section className="depd__choose">
        <SectionHead />
        <div className="depd__choose-row">
          {CHOOSE_PHOTOS.map((src, i) => (
            <div className="depd__choose-card" key={i}>
              <img src={src} alt="" loading="lazy" />
            </div>
          ))}
        </div>
        <div className="depd__choose-dots" aria-hidden>
          <span className="d1" />
          <span className="d2" />
          <span className="d3" />
          <span className="d2" />
          <span className="d1" />
        </div>
      </section>

      {/* ── Full-bleed gallery (Figma 6393:10844) ── */}
      <section className="depd__gallery">
        <SectionHead />
        <div className="depd__gallery-grid">
          {GALLERY.map((src, i) => (
            <img src={src} alt="" key={i} loading="lazy" />
          ))}
        </div>
      </section>
    </div>
  );
}
