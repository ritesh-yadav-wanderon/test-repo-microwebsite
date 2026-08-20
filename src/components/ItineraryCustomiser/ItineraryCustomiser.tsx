import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useIsDesktop } from "../../hooks/useIsDesktop";
import { useScrollLock } from "../../hooks/useScrollLock";
import "./ItineraryCustomiser.css";

const T = "/figma/train/";

/** Vertical train: rendered size and speed (ms per px). */
const TRAIN_H = 96;
const MS_PER_PX = 4;
/** Horizontal train: rendered width and the quicker pace of its shorter legs. */
const TRAIN_W = 96;
const MS_PER_PX_H = 2;

/** Desktop station chip footprint, used to work out how many fit per row. */
const STATION_W = 100;
const STATION_GAP = 14;

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
  const isDesktop = useIsDesktop();
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
    return clearTimers;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, stations.length]);

  useScrollLock(isOpen);

  const tapStation = (idx: number) => {
    // A finished trip (or a freshly opened sheet) restarts the selection.
    if (pickStart === null || pickEnd !== null) {
      clearTimers();
      setPickStart(idx);
      setPickEnd(null);
      return;
    }
    if (idx === pickStart) return;
    // The second tap closes the trip whichever way round it was made, so the
    // pair is always ordered along the route.
    animateNext.current = true;
    if (idx < pickStart) {
      setPickEnd(pickStart);
      setPickStart(idx);
      return;
    }
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

  // Between the two taps of a selection there is no trip to describe, so the
  // route card, coverage strip and price hold the last finished one instead of
  // snapping back to the full itinerary.
  const lastTrip = useRef<[number, number]>([
    initialSelection?.start ?? 0,
    initialSelection?.end ?? stations.length - 1,
  ]);
  useEffect(() => {
    if (hasTrip) lastTrip.current = [pickStart!, pickEnd!];
  }, [hasTrip, pickStart, pickEnd]);
  const [selStart, selEnd] = hasTrip ? [pickStart!, pickEnd!] : lastTrip.current;

  /** Stations a finished trip leaves out. A pending start greys nothing — the
   *  next tap may land on either side of it. */
  const isOutside = (i: number) => hasTrip && (i < pickStart! || i > pickEnd!);

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

  // Desktop stations keep a fixed width, so the row holds as many as fit and
  // the rest wrap onto further rows — each with its own stretch of rail.
  const rowsRef = useRef<HTMLDivElement | null>(null);
  const [perRow, setPerRow] = useState(6);
  const [rowW, setRowW] = useState(0);

  useLayoutEffect(() => {
    if (!isOpen || !isDesktop) return;
    const measure = () => {
      const width = rowsRef.current?.clientWidth ?? 0;
      if (!width) return;
      const fit = Math.floor((width + STATION_GAP) / (STATION_W + STATION_GAP));
      setPerRow(Math.max(1, fit));
      setRowW(width);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [isOpen, isDesktop]);

  // Where the desktop train sits: which row, how far along it, and how long it
  // takes to get there. A trip inside one row is a single glide; a trip that
  // spans rows glides off the end of the first row and back in on the next.
  const [dTrain, setDTrain] = useState<{ row: number; left: number; dur: number } | null>(null);

  useLayoutEffect(() => {
    if (!isOpen || !isDesktop) return;
    const stop = (i: number) => (i % perRow) * (STATION_W + STATION_GAP) + STATION_W / 2;
    const rowOf = (i: number) => Math.floor(i / perRow);
    const ms = (px: number) => Math.max(400, Math.abs(px) * MS_PER_PX_H);
    const offRight = (rowW || stations.length * (STATION_W + STATION_GAP)) + TRAIN_W;
    const offLeft = -TRAIN_W;

    if (pickStart === null) {
      setDTrain(null);
      return;
    }
    if (pickEnd === null) {
      setDTrain({ row: rowOf(pickStart), left: stop(pickStart), dur: 0 });
      return;
    }
    const startRow = rowOf(pickStart);
    const endRow = rowOf(pickEnd);
    if (!animateNext.current) {
      animateNext.current = false;
      setDTrain({ row: endRow, left: stop(pickEnd), dur: 0 });
      return;
    }
    animateNext.current = false;
    setDTrain({ row: startRow, left: stop(pickStart), dur: 0 });
    if (startRow === endRow) {
      timers.current.push(window.setTimeout(() => {
        setDTrain({ row: endRow, left: stop(pickEnd), dur: ms(stop(pickEnd) - stop(pickStart)) });
      }, 40));
      return;
    }
    const exit = ms(offRight - stop(pickStart));
    timers.current.push(window.setTimeout(() => {
      setDTrain({ row: startRow, left: offRight, dur: exit });
    }, 40));
    timers.current.push(window.setTimeout(() => {
      setDTrain({ row: endRow, left: offLeft, dur: 0 });
    }, exit + 60));
    timers.current.push(window.setTimeout(() => {
      setDTrain({ row: endRow, left: stop(pickEnd), dur: ms(stop(pickEnd) - offLeft) });
    }, exit + 120));
  }, [isOpen, isDesktop, pickStart, pickEnd, perRow, rowW, stations.length]);

  if (!isOpen) return null;

  if (isDesktop) {
    // Chunk the mother itinerary into rows of `perRow` station indices.
    const rows: number[][] = [];
    for (let i = 0; i < stations.length; i += perRow) {
      rows.push(stations.slice(i, i + perRow).map((_, k) => i + k));
    }
    /** Centre of the nth chip in a row, in px from the row's left edge. */
    const chipCentre = (n: number) => n * (STATION_W + STATION_GAP) + STATION_W / 2;
    const closeAndApply = () => {
      if (hasTrip) onSelectionChange?.(selStart, selEnd);
      onClose();
    };

    return (
      <div className="itc-overlay itc-overlay--desktop" onClick={closeAndApply}>
        <div
          className="itc-sheet itc-sheet--desktop"
          onClick={e => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label="Customise itinerary"
        >
          <div className="itcd-coverage">
            This route cover {selEnd - selStart + 1} of {stations.length} stops on our Europe Route
          </div>

          <div className="itcd-card">
            <header className="itcd-header">
              <img src={thumb} alt="" className="itcd-thumb" />
              <div className="itcd-header-text">
                <p className="itcd-sub">Europe · full route</p>
                <p className="itcd-title">Where do you want to hop on &amp; off?</p>
              </div>
              <button className="itcd-close" type="button" onClick={closeAndApply} aria-label="Close and apply selection">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M5 5l14 14M19 5L5 19" stroke="#121212" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            </header>

            <section className="itcd-popular" aria-labelledby="itcd-popular-title">
              <h2 id="itcd-popular-title" className="itcd-popular-title">Popular Choices</h2>
              <div className="itcd-popular-list">
                {popular.map(({ start, end }, pi) => (
                  <button className="itcd-popular-card" type="button" key={pi} onClick={() => applyPreset(start, end)}>
                    {stations.slice(start, end + 1).map((name, i) => (
                      <span key={`${name}-${i}`} className="itcd-popular-item">
                        {i > 0 && <img src={`${T}route-arrow.svg`} alt="" aria-hidden />}
                        <span>{name}</span>
                      </span>
                    ))}
                  </button>
                ))}
              </div>
            </section>

            <div className="itcd-selector">
              <div className="itcd-rows" ref={rowsRef}>
                {rows.map((row, ri) => {
                  const first = row[0];
                  const last = row[row.length - 1];
                  // Only a finished trip lays live rail, and each row shows
                  // just the stretch that falls inside it.
                  const covered = hasTrip && pickEnd! >= first && pickStart! <= last;
                  const runsIn = covered && pickStart! < first;
                  const runsOut = covered && pickEnd! > last;
                  return (
                    <div className="itcd-row" key={first}>
                      <div
                        className="itcd-stations"
                        style={{ gridTemplateColumns: `repeat(${perRow}, ${STATION_W}px)` }}
                      >
                        {row.map(i => {
                          const isStart = i === pickStart;
                          const isEnd = i === pickEnd;
                          const outside = isOutside(i);
                          const selected = hasTrip
                            ? i >= pickStart! && i <= pickEnd!
                            : isStart;
                          const n = nights?.[i] ?? 2;
                          return (
                            <button
                              key={i}
                              type="button"
                              className={`itcd-station${outside ? " itcd-station--outside" : ""}${
                                selected ? " itcd-station--selected" : ""
                              }${isStart || isEnd ? " itcd-station--endpoint" : ""}`}
                              onClick={() => tapStation(i)}
                            >
                              {(isStart || isEnd) && (
                                <span className="itcd-endpoint-tag">{isStart ? "Start" : "End"}</span>
                              )}
                              <span>{stations[i]}</span>
                              <span>{n}N</span>
                            </button>
                          );
                        })}
                      </div>

                      <div className="itcd-track" aria-hidden>
                        {covered && (
                          <span
                            className="itcd-track-active"
                            style={
                              runsIn
                                ? { left: 0, width: runsOut ? "100%" : chipCentre(pickEnd! - first) }
                                : {
                                    left: chipCentre(pickStart! - first),
                                    right: runsOut ? 0 : undefined,
                                    width: runsOut
                                      ? undefined
                                      : chipCentre(pickEnd! - first) - chipCentre(pickStart! - first),
                                  }
                            }
                          />
                        )}
                        {dTrain?.row === ri && (
                          <img
                            src="/figma/train/card-train-horizontal.png"
                            alt=""
                            className="itcd-train"
                            style={{ left: dTrain.left, transitionDuration: `${dTrain.dur}ms` }}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
              const outside = isOutside(i);
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
