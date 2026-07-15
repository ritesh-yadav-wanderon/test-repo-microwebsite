import { useRef, useEffect, useState, useCallback } from "react";
import "./PlotBanner.css";

interface PlotCard {
  img: string;
  title?: string;
  sub?: string;
}

const CARDS: PlotCard[] = [
  { img: "/figma/plot/plot-1.jpg" },
  { img: "/figma/plot/plot-3.jpg" },
  { img: "/figma/plot/plot-5.jpg" },
  {
    img: "/figma/plot/plot-2.jpg",
    title: "Monaco F1 Weekend",
    sub: "Singapore Grand Prix Weekend & Curated Luxury Experiences",
  },
  { img: "/figma/plot/plot-4.jpg" },
  { img: "/figma/plot/plot-5.jpg" },
  { img: "/figma/plot/plot-1.jpg" },
];

const CARD_W = 265;

export default function PlotBanner() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rafRef = useRef<number>(0);
  const [centerIdx, setCenterIdx] = useState(3);

  const updateScales = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;
    const containerCenter = container.scrollLeft + container.clientWidth / 2;
    let closest = 0;
    let closestDist = Infinity;

    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      const cardCenter = card.offsetLeft + CARD_W / 2;
      const dist = Math.abs(containerCenter - cardCenter);
      // Smooth scale: 1.0 at center, 0.864 (340/394) at distance >= 285px
      const progress = Math.max(0, 1 - dist / 285);
      const scale = 0.864 + 0.136 * progress;
      card.style.transform = `scale(${scale.toFixed(4)})`;
      if (dist < closestDist) {
        closestDist = dist;
        closest = i;
      }
    });

    setCenterIdx(closest);
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    // Scroll to initial center card (index 3)
    requestAnimationFrame(() => {
      const card = cardRefs.current[3];
      if (card) {
        container.scrollLeft =
          card.offsetLeft - (container.clientWidth - CARD_W) / 2;
      }
      updateScales();
    });

    const onScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(updateScales);
    };

    container.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      container.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [updateScales]);

  const fillPx = `${((centerIdx / (CARDS.length - 1)) * (120 - 33)).toFixed(1)}px`;

  return (
    <section className="plot">
      <div className="plot-header">
        <p className="plot-title">The Plot.</p>
        <p className="plot-sub">POVs from the trips that hit different!</p>
      </div>

      <div className="plot-row" ref={scrollRef}>
        {CARDS.map((card, i) => (
          <div
            key={i}
            ref={(el) => { cardRefs.current[i] = el; }}
            className="plot-card"
          >
            <img src={card.img} alt="" loading="lazy" />

            {/* Overlay — gradient + play + caption, fades in when centred */}
            <div
              className={`plot-overlay${centerIdx === i ? " plot-overlay--on" : ""}`}
              aria-hidden
            >
              <img
                className="plot-play"
                src="/figma/plot/play-circle.svg"
                width={46} height={47}
                alt=""
              loading="lazy" />
              {card.title && (
                <div className="plot-cap">
                  <strong>{card.title}</strong>
                  <span>{card.sub}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Scroll progress */}
      <div className="plot-progress" aria-hidden>
        <div className="plot-track">
          <div className="plot-fill" style={{ left: fillPx }} />
        </div>
      </div>
    </section>
  );
}
