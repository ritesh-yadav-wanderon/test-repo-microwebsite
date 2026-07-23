import { useCallback, useEffect, useRef, useState } from "react";
import "./DesktopPlot.css";

export interface PovCard {
  img: string;
  title?: string;
  sub?: string;
}

interface Props {
  cards: PovCard[];
  /** Image directory, e.g. "/figma/desktop". */
  base: string;
  /** Full path to the play-circle icon. */
  playIcon: string;
  /** Card index centred on mount. */
  initialCenter?: number;
}

const CARD_W = 265;

/** Zoom-in-centre POV carousel (the `.dplot__row` mechanic): cards scale up as
 *  they approach the viewport centre and the play/caption overlay fades in on
 *  the centred card. Shared by "The Plot" and the destination "Stories" row. */
export default function DesktopPovCarousel({
  cards,
  base,
  playIcon,
  initialCenter = 3,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rafRef = useRef<number>(0);
  const [centerIdx, setCenterIdx] = useState(initialCenter);

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
      const card = cardRefs.current[initialCenter];
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
  }, [updateScales, initialCenter]);

  const centerCard = (i: number) => {
    const container = scrollRef.current;
    const card = cardRefs.current[i];
    if (!container || !card) return;
    container.scrollTo({
      left: card.offsetLeft - (container.clientWidth - CARD_W) / 2,
      behavior: "smooth",
    });
  };

  const fillPx = `${((centerIdx / (cards.length - 1)) * (120 - 33)).toFixed(1)}px`;

  return (
    <>
      <div className="dplot__row" ref={scrollRef}>
        {cards.map((card, i) => (
          <div
            key={i}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            className="dplot__card"
            onClick={() => centerCard(i)}
          >
            <img src={`${base}/${card.img}`} alt="" loading="lazy" />
            <div
              className={`dplot__overlay${centerIdx === i ? " dplot__overlay--on" : ""}`}
              aria-hidden
            >
              <img
                className="dplot__play"
                src={playIcon}
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
    </>
  );
}
