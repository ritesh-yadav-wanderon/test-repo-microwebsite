import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { setAppScrollLocked } from "../../utils/scroll";
import "./ItineraryCustomiser.css";

const T = "/figma/train/";

/** Vertical train: rendered size and speed (ms per px). */
const TRAIN_H = 96;
const MS_PER_PX = 4;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  thumb: string;
  /** Mother itinerary — every station of the full route, in travel order. */
  stations: string[];
  /** Nights spent at each station (parallel to `stations`). */
  nights?: number[];
  /** Starting price per person for the full mother itinerary. */
  basePrice: number;
  /** Trip shown as selected when the sheet opens (defaults to the full route). */
  initialSelection?: { start: number; end: number } | null;
  /** Fired when the user applies the selected trip via the CTA bar. */
  onSelectionChange?: (start: number, end: number) => void;
}

function formatINR(n: number): string {
  return `₹${n.toLocaleString("en-IN")}/-`;
}

/** Price of a selected trip: the base price pro-rated over the legs it covers.
 *  The product page prices the applied selection with this same rule. */
export function selectionPrice(basePrice: number, segments: number, fullSegments: number): number {
  if (segments >= fullSegments || fullSegments <= 0) return basePrice;
  return Math.round((basePrice * segments) / fullSegments / 10) * 10;
}

/** Compact price for the small per-city labels, e.g. ₹6.5K. */
function formatINRShort(n: number): string {
  return n >= 1000 ? `₹${(n / 1000).toFixed(1).replace(/\.0$/, "")}K` : `₹${n}`;
}

export default function ItineraryCustomiser({ isOpen, onClose, thumb, stations, nights, basePrice, initialSelection, onSelectionChange }: Props) {
  // First tap picks the trip start, the second the trip end, and a further
  // tap begins a fresh selection.
  const [pickStart, setPickStart] = useState<number | null>(null);
  const [pickEnd, setPickEnd] = useState<number | null>(null);

  const timers = useRef<number[]>([]);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const [train, setTrain] = useState<{ y: number; dur: number } | null>(null);
  const [railSeg, setRailSeg] = useState<{ top: number; height: number } | null>(null);

  // The train ride only plays for a selection the user just completed;
  // selections shown on open render statically.
  const animateNext = useRef(false);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  useEffect(() => {
    if (isOpen) {
      // Open with the current trip selected — the previously applied
      // selection if there is one, otherwise the full mother itinerary.
      clearTimers();
      animateNext.current = false;
      setPickStart(initialSelection?.start ?? 0);
      setPickEnd(initialSelection?.end ?? (stations.length > 0 ? stations.length - 1 : null));
    }
    setAppScrollLocked(isOpen);
    return () => {
      clearTimers();
      setAppScrollLocked(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, stations.length]);

  const tapStation = (idx: number) => {
    if (pickStart === null || pickEnd !== null) {
      clearTimers();
      setPickStart(idx);
      setPickEnd(null);
      return;
    }
    if (idx === pickStart) return;
    if (idx < pickStart) {
      setPickStart(idx);
      return;
    }
    animateNext.current = true;
    setPickEnd(idx);
  };

  const applyPreset = (s: number, e: number) => {
    clearTimers();
    animateNext.current = true;
    setPickStart(s);
    setPickEnd(e);
    timers.current.push(window.setTimeout(() => {
      const target = listRef.current?.querySelectorAll("[data-v2-row]")[s];
      target?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 80));
  };

  useLayoutEffect(() => {
    if (!listRef.current) return;
    const rows = Array.from(listRef.current.querySelectorAll<HTMLElement>("[data-v2-row]"));
    if (!rows.length) return;
    const centre = (i: number) => rows[i].offsetTop + rows[i].offsetHeight / 2;
    if (pickStart === null) {
      setTrain(null);
      setRailSeg(null);
      return;
    }
    if (pickEnd === null) {
      setRailSeg(null);
      setTrain({ y: centre(pickStart) - TRAIN_H / 2, dur: 0 });
      return;
    }
    setRailSeg({ top: centre(pickStart), height: centre(pickEnd) - centre(pickStart) });
    const from = centre(pickStart) - TRAIN_H / 2;
    const to = centre(pickEnd) - TRAIN_H / 2;
    if (!animateNext.current) {
      setTrain({ y: to, dur: 0 });
      return;
    }
    animateNext.current = false;
    setTrain({ y: from, dur: 0 });
    timers.current.push(window.setTimeout(() => {
      setTrain({ y: to, dur: Math.max(500, (to - from) * MS_PER_PX) });
    }, 40));
  }, [pickStart, pickEnd]);

  const hasTrip = pickStart !== null && pickEnd !== null;
  const [selStart, selEnd] = hasTrip ? [pickStart!, pickEnd!] : [0, stations.length - 1];

  const fullSegments = stations.length - 1;
  const price = selectionPrice(basePrice, selEnd - selStart, fullSegments);

  const nightsArr = nights ?? stations.map(() => 2);
  const totalNights = nightsArr.reduce((a, b) => a + b, 0);
  const cityPrice = (i: number) =>
    Math.round((basePrice * (nightsArr[i] ?? 2)) / totalNights / 100) * 100;

  const popular = useMemo(() => [
    { start: 0, end: Math.min(2, stations.length - 1) },
    { start: Math.max(0, stations.length - 4), end: stations.length - 1 },
  ], [stations.length]);

  if (!isOpen) return null;

  return (
    <div className="itc-overlay" onClick={onClose}>
      <div className="itc-sheet" onClick={e => e.stopPropagation()} role="dialog" aria-label="Customise itinerary">

        <header className="itc-header">
          <img src={thumb} alt="" className="itc-header-thumb" />
          <div className="itc-header-text">
            <p className="itc-header-sub">Europe · full route</p>
            <p className="itc-header-title">Where do you want to hop on &amp; off?</p>
          </div>
          <button className="itc-close" onClick={onClose} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M1 1l16 16M17 1L1 17" stroke="#121212" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </header>

        <div className="itc-scroll" ref={scrollRef}>
          <div className="itc-top">
            <div className="itc-route">
              {stations.map((name, i) => (
                <span key={i} className="itc-route-item">
                  {i > 0 && <span className={`itc-route-dot${i > selStart && i <= selEnd ? "" : " off"}`} />}
                  <span className={`itc-route-city${i >= selStart && i <= selEnd ? "" : " off"}`}>{name}</span>
                </span>
              ))}
            </div>

            <div className="itc-price-row">
              <span className="itc-price-label">Starting price per person</span>
              <span className="itc-price-value">{formatINR(price)}</span>
            </div>

            <div className="itc-band" />

            <p className="itc-pop-title">Popular Choices</p>
            <div className="itc-pop-list">
              {popular.map(({ start, end }, pi) => (
                <button className="itc-pop-card" key={pi} onClick={() => applyPreset(start, end)}>
                  {stations.slice(start, end + 1).map((name, i) => (
                    <span key={i} className="itc-route-item">
                      {i > 0 && <img src={`${T}route-arrow.svg`} alt="" aria-hidden className="itc-route-arrow" />}
                      <span className="itc-pop-city">{name}</span>
                    </span>
                  ))}
                </button>
              ))}
            </div>

            <div className="itc-banner-wrap">
              <div className="itc-band" />
              <div className="itc-banner">
                <img src={`${T}info-gold.svg`} alt="" className="itc-banner-icon" />
                <p className="itc-banner-text">
                  Tap a city to start, tap another to end. Nights per city are fixed.
                </p>
              </div>
            </div>
          </div>

          <div className="itc3-list" ref={listRef}>
            {stations.map((name, i) => {
              const isStart = i === pickStart;
              const isEnd = i === pickEnd;
              const outside = hasTrip && (i < pickStart! || i > pickEnd!);
              const n = nights?.[i] ?? 2;
              const cls = isStart || isEnd
                ? "itc3-row itc3-row--endpoint"
                : outside
                  ? "itc3-row itc3-row--outside"
                  : "itc3-row";
              return (
                <button key={i} data-v2-row className={cls} onClick={() => tapStation(i)}>
                  <span className="itc3-row-text">
                    <span className="itc3-row-city">{name}</span>
                    <span className="itc3-row-nights">
                      {n} Night{n > 1 ? "s" : ""} · <span className="itc3-row-price">{formatINRShort(cityPrice(i))}</span>
                    </span>
                  </span>
                  {(isStart || isEnd) && (
                    <span className="itc3-pill">{isStart ? "Start" : "End"}</span>
                  )}
                </button>
              );
            })}
            <div className="itc3-rail" aria-hidden />
            {railSeg && (
              <div
                className="itc3-rail itc3-rail--active"
                style={{ top: railSeg.top, height: railSeg.height }}
                aria-hidden
              />
            )}
            {train && (
              <img
                src={`${T}v3-train.png`}
                alt=""
                className="itc3-train"
                style={{
                  top: train.y,
                  transition: train.dur > 0 ? `top ${train.dur}ms linear` : "none",
                }}
              />
            )}
          </div>
        </div>

        <div className="itc-cta">
          <div className="itc-cta-price">
            <span className="itc-cta-value">{formatINR(price)}</span>
            <span className="itc-cta-label">Starting price per person</span>
          </div>
          <button
            className="wo-cta itc-cta-btn"
            onClick={() => {
              onSelectionChange?.(selStart, selEnd);
              onClose();
            }}
          >
            Apply Selection
          </button>
        </div>
      </div>
    </div>
  );
}
