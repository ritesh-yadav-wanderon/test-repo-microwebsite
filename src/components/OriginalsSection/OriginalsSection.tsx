import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./OriginalsSection.css";

/* Figma "Inspiring Stories" component — 3113:9840 / 9862 / 9648.
   A single card that auto-cycles through 3 states: images move in and the
   text changes. (Previously mis-built as a horizontal carousel.) */

const GRADIENT =
  "linear-gradient(-55.37deg, rgb(252, 223, 218) 19.305%, rgb(207, 225, 243) 78.195%)";

type SlideVariant = "ladakh" | "rome" | "almaty";

type Slide = {
  id: string;
  title: string;
  body: string;
  bg: string;
  variant: SlideVariant;
  destination: string;
};

const SLIDES: Slide[] = [
  {
    id: "Ladakh",
    title: "Ladakh",
    body: "Trade the ordinary for the extraordinary. High in the Himalayas, discover a rugged high-altitude desert of cliffside monasteries and vivid blue lakes. This isn't just a trip—it's an expedition for the soul.",
    bg: "#f6e7d5",
    variant: "ladakh",
    destination: "Ladakh",
  },
  {
    id: "rome",
    title: "Rome",
    body: "Where ancient ruins meet bustling modern life. Wander cobblestone alleys, stand in awe of the Colosseum, and indulge in world-class espresso and pasta. The Eternal City awaits.",
    bg: GRADIENT,
    variant: "rome",
    destination: "Rome",
  },
  {
    id: "almaty",
    title: "Almaty",
    body: "A surprising blend of cosmopolitan flair and untamed wilderness. Vibrant café culture and leafy avenues sit right at the majestic foothills of snow-capped peaks and turquoise alpine lakes.",
    bg: GRADIENT,
    variant: "almaty",
    destination: "Almaty",
  },
];

const INTERVAL = 4500;

function SlideMedia({ variant }: { variant: SlideVariant }) {
  if (variant === "ladakh") {
    return (
      <>
        <div className="orig-mountain-wrap">
          <div className="orig-mountain-inner">
            <img
              src="/figma/originals/mountain-bottom.png"
              alt=""
              aria-hidden
              className="orig-mountain"
            />
          </div>
        </div>
        <img
          src="/figma/originals/hiker.png"
          alt=""
          aria-hidden
          className="orig-hiker"
        />
        <img
          src="/figma/originals/birds.png"
          alt=""
          aria-hidden
          className="orig-birds"
        />
      </>
    );
  }

  if (variant === "rome") {
    return (
      <img
        src="/figma/originals/roma.png"
        alt=""
        aria-hidden
        className="orig-arch orig-arch--rome"
      />
    );
  }

  // almaty
  return (
    <img
      src="/figma/originals/mosque.png"
      alt=""
      aria-hidden
      className="orig-arch orig-arch--mosque"
    />
  );
}

export default function OriginalsSection() {
  const [active, setActive] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % SLIDES.length);
    }, INTERVAL);
    return () => window.clearInterval(id);
  }, []);

  const openDestination = (destination: string) => {
    navigate(`/destination/${destination}`);
  };

  return (
    <section className="orig">
      <div className="orig-card">
        {SLIDES.map((slide, i) => (
          <div
            key={slide.id}
            className={`orig-slide${i === active ? " orig-slide--active" : ""}`}
            style={{ background: slide.bg }}
            aria-hidden={i !== active}
            role="link"
            tabIndex={i === active ? 0 : -1}
            aria-label={`Explore ${slide.title}`}
            onClick={() => openDestination(slide.destination)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openDestination(slide.destination);
              }
            }}
          >
            <div className="orig-media">
              <SlideMedia variant={slide.variant} />
            </div>

            <div className="orig-content">
              <div className="orig-story">
                <p className="orig-title">{slide.title}</p>
                <p className="orig-body">{slide.body}</p>
              </div>
              <button
                className="orig-btn"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  openDestination(slide.destination);
                }}
              >
                <span>Explore</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="orig-progress" aria-hidden>
        {SLIDES.map((slide, i) => (
          <span
            key={slide.id}
            className={`orig-prog${i === active ? " orig-prog--active" : ""}`}
          >
            <span
              className="orig-prog-fill"
              style={{ animationDuration: `${INTERVAL}ms` }}
            />
          </span>
        ))}
      </div>
    </section>
  );
}
