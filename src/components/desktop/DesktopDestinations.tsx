import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./DesktopDestinations.css";

const BASE = "/figma/desktop";
const MOBILE = "/figma/dest";

type Destination = { name: string; img: string; flip?: boolean };

/* Same destination lists as the mobile DestinationStrip component.
 * Desktop monument art is used where it exists; the remaining cutouts
 * come from the shared mobile set. */
const INTERNATIONAL: Destination[] = [
  { name: "Egypt", img: `${BASE}/monument-egypt.png` },
  { name: "Bali", img: `${BASE}/monument-bali.png` },
  { name: "Japan", img: `${BASE}/monument-japan.png` },
  { name: "Thailand", img: `${BASE}/monument-thailand.png` },
  { name: "Europe", img: `${BASE}/monument-europe.png` },
  { name: "Dubai", img: `${MOBILE}/dubai.png` },
  { name: "Vietnam", img: `${BASE}/monument-vietnam.png` },
];

const DOMESTIC: Destination[] = [
  { name: "Kerala", img: `${BASE}/monument-kerala.png` },
  { name: "Rajasthan", img: `${BASE}/monument-rajasthan.png`, flip: true },
  { name: "Spiti", img: `${MOBILE}/spiti.png` },
  { name: "Meghalaya", img: `${MOBILE}/meghalaya.png` },
  { name: "Kashmir", img: `${MOBILE}/kashmir.png` },
  { name: "Ladakh", img: `${MOBILE}/ladakh.png`, flip: true },
];

/** "Destinations for the Wanderon community" monuments carousel (Figma 4715:22657). */
export default function DesktopDestinations() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"international" | "domestic">("international");
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  const destinations = tab === "international" ? INTERNATIONAL : DOMESTIC;

  const switchTab = (next: "international" | "domestic") => {
    setTab(next);
    trackRef.current?.scrollTo({ left: 0 });
    setProgress(0);
  };

  const onScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? el.scrollLeft / max : 0);
  };

  return (
    <section className="ddest">
      <h2 className="ddest__title">Destinations for the Wanderon community</h2>
      <div className="ddest__pills">
        <button
          className={`ddest__pill${tab === "international" ? " ddest__pill--active" : ""}`}
          onClick={() => switchTab("international")}
        >
          International
        </button>
        <button
          className={`ddest__pill${tab === "domestic" ? " ddest__pill--active" : ""}`}
          onClick={() => switchTab("domestic")}
        >
          Domestic
        </button>
      </div>
      <div className="ddest__track" ref={trackRef} onScroll={onScroll}>
        {destinations.map((d) => (
          <button
            key={d.name}
            className="ddest__item"
            onClick={() => navigate(`/destination/${d.name.toLowerCase()}`)}
          >
            <span className="ddest__figure">
              <img className="ddest__shadow" src={`${BASE}/monument-shadow.svg`} alt="" />
              <img
                className={`ddest__monument${d.flip ? " ddest__monument--flip" : ""}`}
                src={d.img}
                alt={d.name}
              />
            </span>
            <span className="ddest__name">{d.name}</span>
          </button>
        ))}
      </div>
      <div className="ddest__progress">
        <span className="ddest__progress-track" />
        <span
          className="ddest__progress-thumb"
          style={{ left: `${10 + progress * (120 - 33)}px` }}
        />
      </div>
    </section>
  );
}
