import { useCallback, useEffect, useRef, useState } from "react";
import "./DesktopPlot.css";

const BASE = "/figma/desktop";

interface PlotCard {
  img: string;
  title?: string;
  sub?: string;
}

const CARDS: PlotCard[] = [
  { img: "plot-giraffe.png" },
  { img: "plot-cabin.png" },
  { img: "plot-festival.png" },
  {
    img: "plot-f1.png",
    title: "Monaco F1 Weekend",
    sub: "Singapore Grand Prix Weekend & Curated Luxury Experiences",
  },
  { img: "plot-giraffe.png" },
  { img: "plot-cabin.png" },
  { img: "plot-festival.png" },
];

const CARD_W = 265;

/** "The Plot" POV carousel (Figma 5252:12895) — same zoom-in-center
 *  interaction as the mobile PlotBanner: cards scale up as they approach the
 *  viewport centre and the play/caption overlay fades in on the centred card. */
export default function DesktopPlot() {
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

    requestAnimationFrame(() => {
      const card = cardRefs.current[3];
      if (card) {
        container.scrollLeft = card.offsetLeft - (container.clientWidth - CARD_W) / 2;
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

  const centerCard = (i: number) => {
    const container = scrollRef.current;
    const card = cardRefs.current[i];
    if (!container || !card) return;
    container.scrollTo({
      left: card.offsetLeft - (container.clientWidth - CARD_W) / 2,
      behavior: "smooth",
    });
  };

  const fillPx = `${((centerIdx / (CARDS.length - 1)) * (120 - 33)).toFixed(1)}px`;

  return (
    <section className="dplot">
      <div className="dplot__head">
        <h2 className="dplot__title">The Plot</h2>
        <p className="dplot__sub">POVs from the trips that hit different!</p>
      </div>

      <div className="dplot__row" ref={scrollRef}>
        {CARDS.map((card, i) => (
          <div
            key={i}
            ref={(el) => { cardRefs.current[i] = el; }}
            className="dplot__card"
            onClick={() => centerCard(i)}
          >
            <img src={`${BASE}/${card.img}`} alt="" loading="lazy" />
            <div
              className={`dplot__overlay${centerIdx === i ? " dplot__overlay--on" : ""}`}
              aria-hidden
            >
              <img
                className="dplot__play"
                src={`${BASE}/plot-play.svg`}
                width={46}
                height={47}
                alt=""
                loading="lazy"
              />
              {card.title && (
                <div className="dplot__cap">
                  <strong>{card.title}</strong>
                  <span>{card.sub}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="dplot__progress" aria-hidden>
        <div className="dplot__track">
          <div className="dplot__fill" style={{ left: fillPx }} />
        </div>
      </div>
    </section>
  );
}
