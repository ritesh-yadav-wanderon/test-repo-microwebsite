import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DesktopNav from "./DesktopNav";
import "./DesktopEvents.css";

const A = "/figma/events/";

/* Featured hero slides — lead slide from Figma 5499:13604, the rest reuse
   images from the mobile events page. */
const FEATURED = [
  {
    slug: "empire-music-show-live",
    title: "Empire Music Show Live",
    host: "Zhor",
    avatar: `${A}devt-host-zhor.png`,
    category: "Music",
    day: "Saturday, 18 July",
    time: "5:30 pm - 8:30 pm",
    venue: "Alex Skydeck",
    city: "New Delhi",
    image: `${A}devt-hero-empire.png`,
  },
  {
    slug: "tomorrowland-belgium-orbyz",
    title: "Tomorrowland Belgium | ORBYZ",
    host: "WanderOn",
    avatar: `${A}tomorrowland-logo.png`,
    category: "Music",
    day: "Saturday, 18 July",
    time: "5:30 pm - 8:30 pm",
    venue: "Boom",
    city: "Belgium",
    image: `${A}hero-bg.jpg`,
  },
  {
    slug: "la-clairi-re-the-chainsmokers",
    title: "La Clairière : The Chainsmokers",
    host: "WanderOn",
    avatar: `${A}event-chainsmokers.jpg`,
    category: "Music",
    day: "Saturday, 06 June",
    time: "10:00 pm onwards",
    venue: "Yashobhoomi",
    city: "Delhi",
    image: `${A}event-chainsmokers.jpg`,
  },
  {
    slug: "wanderon-founders-meet",
    title: "Wanderon: Founders Meet",
    host: "WanderOn",
    avatar: `${A}event-founders.jpg`,
    category: "Business",
    day: "Saturday, 06 June",
    time: "10:00 pm onwards",
    venue: "Trident",
    city: "Gurugram",
    image: `${A}event-founders.jpg`,
  },
];

/* Browse-by-category strip (Figma 5418:13450). */
const CATEGORIES = [
  { label: "Music",         icon: `${A}devt-cat-music.svg`,  size: 60 },
  { label: "Food & Drinks", icon: `${A}devt-cat-food.svg`,   size: 50 },
  { label: "Tech",          icon: `${A}devt-cat-tech.svg`,   size: 50 },
  { label: "Sports",        icon: `${A}devt-cat-sports.svg`, size: 50 },
  { label: "Art",           icon: `${A}devt-cat-art.svg`,    size: 46 },
];

/* Wanderon Originals — artist line-up reused from the mobile page. */
const ARTISTS = [
  { name: "Billie Eilish",  img: `${A}billie.jpg` },
  { name: "Diljit Dosanjh", img: `${A}diljit.jpg` },
  { name: "Ed Sheeran",     img: `${A}edsheeran.jpg` },
  { name: "B Praak",        img: `${A}bpraak.jpg` },
];
const ORIGINALS = [0, 1, 2, 3, 0, 1].map((i) => ARTISTS[i]);

interface EventItem {
  image: string;
  location: string;
  title: string;
  date: string;
  price: string;
}

const CONCERT: EventItem = {
  image: `${A}event-chainsmokers.jpg`,
  location: "Yashobhoomi | Delhi",
  title: "La Clairière : The Chainsmokers",
  date: "Sat, 06 Jun - Sun, 07 Jun, 10:00 PM",
  price: "₹10,999/-",
};

const FOUNDERS_MEET: EventItem = {
  image: `${A}event-founders.jpg`,
  location: "trident | Gurugram",
  title: "Wanderon: Founders Meet",
  date: "Sat, 06 Jun, 10:00 PM",
  price: "₹10,999/-",
};

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

/* Dots + prev/next arrow strip under carousels (Figma 5339:13112). */
function CarouselControls({
  onPrev,
  onNext,
  count = 3,
  active = 0,
}: {
  onPrev: () => void;
  onNext: () => void;
  count?: number;
  active?: number;
}) {
  return (
    <div className="devt__controls">
      <span className="devt__dots" aria-hidden>
        {Array.from({ length: count }, (_, i) => (
          <span key={i} className={`devt__dot${i === active ? " devt__dot--active" : ""}`} />
        ))}
      </span>
      <span className="devt__arrows">
        <button type="button" className="devt__arrow" aria-label="Previous" onClick={onPrev}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
            <path d="m8.5 3.5-4 3.5 4 3.5" stroke="#202020" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button type="button" className="devt__arrow" aria-label="Next" onClick={onNext}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
            <path d="m5.5 3.5 4 3.5-4 3.5" stroke="#202020" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </span>
    </div>
  );
}

/* Wide event card (Figma 6161:23209) — same content as the mobile ev-card. */
function DesktopEventCard({ item, onOpen }: { item: EventItem; onOpen: (slug: string) => void }) {
  return (
    <div
      className="devt__card"
      role="button"
      tabIndex={0}
      onClick={() => onOpen(slugify(item.title))}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(slugify(item.title));
        }
      }}
    >
      <div className="devt__card-media">
        <img src={item.image} alt={item.title} loading="lazy" />
      </div>
      <div className="devt__card-info">
        <div className="devt__card-loc">
          <img src={`${A}pin.svg`} alt="" width={12} height={12} aria-hidden />
          <span>{item.location}</span>
        </div>
        <p className="devt__card-title">{item.title}</p>
        <div className="devt__card-meta">
          <span className="devt__card-date">{item.date}</span>
          <span className="devt__card-price">{item.price}</span>
        </div>
      </div>
    </div>
  );
}

/** Desktop events listing page (Figma 5326:22442) — dark layout with a
 *  featured-event hero carousel; photos reused from the mobile events page. */
export default function DesktopEvents() {
  const navigate = useNavigate();
  const [slide, setSlide] = useState(0);
  const [flipTop, setFlipTop] = useState(false);
  const [flipBottom, setFlipBottom] = useState(false);

  const feat = FEATURED[slide];
  const openEvent = (slug: string) => navigate(`/event/${slug}`);

  const topCards = flipTop ? [FOUNDERS_MEET, CONCERT] : [CONCERT, FOUNDERS_MEET];
  const bottomCards = flipBottom ? [CONCERT, FOUNDERS_MEET] : [FOUNDERS_MEET, CONCERT];

  return (
    <div className="devt">
      {/* Global header — transparent by default, black blur on scroll */}
      <DesktopNav dark alwaysShowSearch />

      {/* Blurred backdrop of the featured image */}
      <div className="devt__backdrop" aria-hidden>
        <img src={feat.image} alt="" />
      </div>

      <div className="devt__inner">
        {/* ── Featured hero (Figma 5499:13604) ── */}
        <section className="devt__hero">
          <div className="devt__hero-info">
            <div className="devt__hero-head">
              <h1 className="devt__hero-title">{feat.title}</h1>
              <div className="devt__hero-host">
                <img src={feat.avatar} alt="" className="devt__hero-avatar" />
                <span>Hosted by {feat.host}</span>
              </div>
            </div>
            <div className="devt__hero-facts">
              <span className="devt__hero-tag">{feat.category}</span>
              <div className="devt__hero-fact">
                <img src={`${A}devt-calendar-clock.svg`} alt="" width={18} height={18} aria-hidden />
                <span>
                  <em>{feat.day}</em>
                  <small>{feat.time}</small>
                </span>
              </div>
              <div className="devt__hero-fact">
                <img src={`${A}devt-location.svg`} alt="" width={15} height={18} aria-hidden />
                <span>
                  <em>{feat.venue}</em>
                  <small>{feat.city}</small>
                </span>
              </div>
            </div>
          </div>
          <button className="devt__hero-media" type="button" onClick={() => openEvent(feat.slug)}>
            <img src={feat.image} alt={feat.title} />
          </button>
        </section>

        <CarouselControls
          count={FEATURED.length}
          active={slide}
          onPrev={() => setSlide((s) => (s + FEATURED.length - 1) % FEATURED.length)}
          onNext={() => setSlide((s) => (s + 1) % FEATURED.length)}
        />

        <hr className="devt__sep" />

        {/* ── Browse by category (Figma 5427:13668) ── */}
        <section className="devt__section">
          <h2 className="devt__sec-title">Browse by Category</h2>
          <div className="devt__cats">
            {CATEGORIES.map((cat) => (
              <button key={cat.label} className="devt__cat" type="button" onClick={() => openEvent(slugify(cat.label))}>
                <img src={cat.icon} alt="" width={cat.size} height={cat.size} aria-hidden />
                <span className="devt__cat-text">
                  <em>{cat.label}</em>
                  <small>3k events</small>
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* ── Wanderon Originals (Figma 5326:22473) ── */}
        <section className="devt__section">
          <h2 className="devt__sec-title">Wanderon Originals</h2>
          <div className="devt__originals">
            {ORIGINALS.map((a, i) => (
              <button key={i} className="devt__orig" type="button" onClick={() => openEvent(slugify(a.name))}>
                <img src={a.img} alt={a.name} className="devt__orig-img" loading="lazy" />
                <span className="devt__orig-text">
                  <small>Sat, 18 Jul, 10:00 am</small>
                  <em>{a.name} Live</em>
                  <small>Yashobhoomi Delhi NCR</small>
                </span>
              </button>
            ))}
          </div>
        </section>

        <hr className="devt__sep" />

        {/* ── Featured concerts row ── */}
        <section className="devt__section">
          <div className="devt__cards">
            {topCards.map((item) => (
              <DesktopEventCard key={item.title} item={item} onOpen={openEvent} />
            ))}
          </div>
          <CarouselControls onPrev={() => setFlipTop((v) => !v)} onNext={() => setFlipTop((v) => !v)} />
        </section>

        <hr className="devt__sep" />

        {/* ── Founders Circle (Figma 6275:23699) ── */}
        <section className="devt__section">
          <h2 className="devt__sec-title">Founders Circle</h2>
          <div className="devt__fc">
            <button className="devt__fc-tile" type="button" onClick={() => openEvent("tomorrowland")}>
              <span className="devt__fc-media devt__fc-media--gradient">
                <img src={`${A}tomorrowland.jpg`} alt="" className="devt__fc-bg" aria-hidden loading="lazy" />
                <img src={`${A}tomorrowland-logo.png`} alt="Tomorrowland" className="devt__fc-logo" loading="lazy" />
              </span>
              <span className="devt__fc-name">Tomorrowland</span>
            </button>
            <button className="devt__fc-tile" type="button" onClick={() => openEvent("primewise-founders-club")}>
              <span className="devt__fc-media devt__fc-media--dark">
                <img src={`${A}primewise.png`} alt="Primewise Founders Club" className="devt__fc-contain" loading="lazy" />
              </span>
              <span className="devt__fc-name">Primewise Foudners Club</span>
            </button>
          </div>
        </section>

        {/* ── Founders meet cards row ── */}
        <section className="devt__section">
          <div className="devt__cards">
            {bottomCards.map((item) => (
              <DesktopEventCard key={item.title} item={item} onOpen={openEvent} />
            ))}
          </div>
          <CarouselControls onPrev={() => setFlipBottom((v) => !v)} onNext={() => setFlipBottom((v) => !v)} />
        </section>
      </div>
    </div>
  );
}
