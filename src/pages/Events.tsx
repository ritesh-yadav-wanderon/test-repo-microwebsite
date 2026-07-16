import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import BurgerMenu from "../components/BurgerMenu/BurgerMenu";
import "./Events.css";

const A = "/figma/events/";

const CATEGORIES = ["Concerts", "Live Events", "Founders Circle"] as const;

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

function EventCard({ item }: { item: EventItem }) {
  return (
    <div className="ev-card">
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
        {/* Category chips (Figma 4518:23823) */}
        <div className="ev-cats">
          {CATEGORIES.map((cat, i) => (
            <button
              key={cat}
              type="button"
              className={`ev-cat${i === activeCat ? " ev-cat--active" : ""}`}
              onClick={() => setActiveCat(i)}
            >
              {i === activeCat && <span className="ev-cat-dot" aria-hidden />}
              {cat}
            </button>
          ))}
        </div>

        {/* Wanderon Originals (Figma 4518:23824) */}
        <section className="ev-section">
          <SectionTitle label="Wanderon Originals" />
          <div className="ev-hscroll">
            {ORIGINALS.map((a) => (
              <figure className="ev-artist" key={a.name}>
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
        <EventCard item={CONCERT} />

        {/* Founders Circle (Figma 4518:23872) */}
        <section className="ev-section">
          <SectionTitle label="Founders Circle" />
          <div className="ev-hscroll">
            <figure className="ev-artist">
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

            <figure className="ev-artist ev-artist--wide">
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
        <EventCard item={FOUNDERS_MEET} />
      </main>

      <BurgerMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <BottomNav variant="dark" />
    </div>
  );
}
