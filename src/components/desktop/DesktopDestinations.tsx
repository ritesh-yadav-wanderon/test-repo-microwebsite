import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMonuments } from "@/repositories";
import "./DesktopDestinations.css";

const BASE = "/figma/desktop";

/* Same destination lists as the mobile DestinationStrip component; the desktop
 * surface swaps in its own monument art where it exists. */
const INTERNATIONAL = getMonuments("international", "desktop");
const DOMESTIC = getMonuments("domestic", "desktop");

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
