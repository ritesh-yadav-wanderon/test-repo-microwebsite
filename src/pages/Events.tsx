import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import BurgerMenu from "../components/BurgerMenu/BurgerMenu";
import "./Events.css";

const A = "/figma/events/";

const CATEGORIES = [
  { label: "Music", icon: `${A}cat-music.svg` },
  { label: "Sports", icon: `${A}cat-sports.svg` },
  { label: "Festivals", icon: `${A}cat-festivals.svg` },
] as const;

const HERO = {
  video:
    "https://wanderon-images.gumlet.io/events-and-festivals/events-and-festivals/tomorrowland-thailand/tomorrowland.mp4",
  poster: `${A}hero-bg.jpg`,
  logo: `${A}hero-logo.svg`,
  title: "Tomorrowland Belgium | ORBYZ",
  location: "Belgium",
};

const ORIGINALS = [
  { name: "Billie Eilish", img: `${A}billie.jpg` },
  { name: "Diljit Dosanjh", img: `${A}diljit.jpg` },
  { name: "Ed Sheeran", img: `${A}edsheeran.jpg` },
  { name: "B Praak", img: `${A}bpraak.jpg` },
];

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

function SectionTitle({ label }: { label: string }) {
  return (
    <div className="ev-sec-title">
      <span className="ev-sec-line ev-sec-line--l" aria-hidden />
      <span className="ev-sec-label">{label}</span>
      <span className="ev-sec-line ev-sec-line--r" aria-hidden />
    </div>
  );
}

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function EventCard({ item, onOpen }: { item: EventItem; onOpen: (slug: string) => void }) {
  return (
    <div
      className="ev-card"
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
      <div className="ev-card-media">
        <img src={item.image} alt={item.title} className="ev-card-img" loading="lazy" />
        <span className="ev-card-shade" aria-hidden />
      </div>
      <div className="ev-card-info">
        <div className="ev-card-loc">
          <img src={`${A}pin.svg`} alt="" className="ev-card-pin" aria-hidden />
          <span>{item.location}</span>
        </div>
        <p className="ev-card-title">{item.title}</p>
        <div className="ev-card-meta">
          <span className="ev-card-date">{item.date}</span>
          <span className="ev-card-price">{item.price}</span>
        </div>
      </div>
    </div>
  );
}

export default function Events() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCat, setActiveCat] = useState(0);
  const [playing, setPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  const openEvent = (slug: string) => navigate(`/event/${slug}`);

  return (
    <div className="ev-page">
      {/* Top navigation (Figma 5036:7100) */}
      <header className="ev-top">
        <button className="ev-logo" type="button" onClick={() => navigate("/")} aria-label="Home">
          <img src="/figma/nav2/events/logo.png" alt="WanderOn" width={50} height={50} />
        </button>
        <button className="ev-menu" type="button" onClick={() => setMenuOpen(true)} aria-label="Open menu">
          <img src="/figma/events/menu.svg" alt="" className="ev-menu-icon" aria-hidden />
        </button>
      </header>

      <main className="ev-main">
        {/* Category bar (Figma 5572:14074) */}
        <div className="ev-catbar">
          {CATEGORIES.map((cat, i) => (
            <div className="ev-catbar-item" key={cat.label}>
              {i > 0 && <span className="ev-catbar-dot" aria-hidden />}
              <button
                type="button"
                className={`ev-cat${i === activeCat ? " ev-cat--active" : ""}`}
                onClick={() => setActiveCat(i)}
              >
                <img src={cat.icon} alt="" className="ev-cat-icon" aria-hidden />
                <span>{cat.label}</span>
              </button>
            </div>
          ))}
        </div>

        {/* Featured hero (Figma 5572:14068) */}
        <section className="ev-hero">
          <div className="ev-hero-block">
            <div
              className="ev-hero-media"
              role="button"
              tabIndex={0}
              onClick={() => openEvent("tomorrowland-belgium-orbyz")}
              onKeyDown={(e) => {
                if (e.key === "Enter") openEvent("tomorrowland-belgium-orbyz");
              }}
            >
              <video
                ref={videoRef}
                className="ev-hero-img"
                src={HERO.video}
                poster={HERO.poster}
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
              />
              <img src={HERO.logo} alt="" className="ev-hero-logo" aria-hidden />
              <button
                type="button"
                className="ev-hero-play"
                aria-label={playing ? "Pause" : "Play"}
                aria-pressed={playing}
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlay();
                }}
              >
                <img
                  src={`${A}${playing ? "pause.svg" : "play.svg"}`}
                  alt=""
                  className="ev-hero-play-icon"
                  aria-hidden
                />
              </button>
            </div>
            <div className="ev-hero-info">
              <p className="ev-hero-title">{HERO.title}</p>
              <div className="ev-hero-loc">
                <img src={`${A}icon-location.svg`} alt="" className="ev-hero-pin" aria-hidden />
                <span>{HERO.location}</span>
              </div>
            </div>
          </div>

          {/* Carousel indicator (Figma 5572:14145) */}
          <div className="ev-dots" aria-hidden>
            <span className="ev-dot ev-dot--1" />
            <span className="ev-dot ev-dot--2" />
            <span className="ev-dot ev-dot--3" />
            <span className="ev-dot ev-dot--2" />
            <span className="ev-dot ev-dot--1" />
          </div>
        </section>

        {/* Wanderon Originals (Figma 5572:14049) */}
        <section className="ev-section">
          <SectionTitle label="Wanderon Originals" />
          <div className="ev-hscroll">
            {ORIGINALS.map((a) => (
              <figure
                className="ev-artist"
                key={a.name}
                role="button"
                tabIndex={0}
                onClick={() => openEvent(slugify(a.name))}
                onKeyDown={(e) => {
                  if (e.key === "Enter") openEvent(slugify(a.name));
                }}
              >
                <div className="ev-artist-media">
                  <img src={a.img} alt={a.name} className="ev-artist-img" loading="lazy" />
                </div>
                <figcaption className="ev-artist-name">{a.name}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* Carousel indicator (Figma 4518:23843) */}
        <div className="ev-dots" aria-hidden>
          <span className="ev-dot ev-dot--1" />
          <span className="ev-dot ev-dot--2" />
          <span className="ev-dot ev-dot--3" />
          <span className="ev-dot ev-dot--2" />
          <span className="ev-dot ev-dot--1" />
        </div>

        {/* Featured concert (Figma 4518:23849) */}
        <EventCard item={CONCERT} onOpen={openEvent} />

        {/* Founders Circle (Figma 4518:23872) */}
        <section className="ev-section">
          <SectionTitle label="Founders Circle" />
          <div className="ev-hscroll">
            <figure
              className="ev-artist"
              role="button"
              tabIndex={0}
              onClick={() => openEvent("tomorrowland")}
              onKeyDown={(e) => {
                if (e.key === "Enter") openEvent("tomorrowland");
              }}
            >
              <div className="ev-artist-media ev-fc-media--gradient">
                <img
                  src={`${A}tomorrowland.jpg`}
                  alt=""
                  className="ev-artist-img ev-fc-bg"
                  aria-hidden
                  loading="lazy"
                />
                <img
                  src={`${A}tomorrowland-logo.png`}
                  alt="Tomorrowland"
                  className="ev-fc-logo"
                  loading="lazy"
                />
              </div>
              <figcaption className="ev-artist-name">Tomorrowland</figcaption>
            </figure>

            <figure
              className="ev-artist ev-artist--wide"
              role="button"
              tabIndex={0}
              onClick={() => openEvent("primewise-founders-club")}
              onKeyDown={(e) => {
                if (e.key === "Enter") openEvent("primewise-founders-club");
              }}
            >
              <div className="ev-artist-media ev-fc-media--dark">
                <img
                  src={`${A}primewise.png`}
                  alt="Primewise Founders Club"
                  className="ev-fc-contain"
                  loading="lazy"
                />
              </div>
              <figcaption className="ev-artist-name ev-artist-name--multi">
                Primewise Founders Club
              </figcaption>
            </figure>
          </div>
        </section>

        {/* Featured founders meet (Figma 4518:23886) */}
        <EventCard item={FOUNDERS_MEET} onOpen={openEvent} />
      </main>

      <BurgerMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <BottomNav variant="dark" />
    </div>
  );
}
