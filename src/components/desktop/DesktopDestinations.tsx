import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./DesktopDestinations.css";

const BASE = "/figma/desktop";

const DESTINATIONS = [
  { name: "Egypt", img: "monument-egypt.png", slug: "egypt" },
  { name: "Bali", img: "monument-bali.png", slug: "bali" },
  { name: "Japan", img: "monument-japan.png", slug: "japan" },
  { name: "Thailand", img: "monument-thailand.png", slug: "thailand" },
  { name: "Rajasthan", img: "monument-rajasthan.png", slug: "rajasthan", flip: true },
  { name: "Europe", img: "monument-europe.png", slug: "europe" },
  { name: "Kerala", img: "monument-kerala.png", slug: "kerala" },
  { name: "Vietnam", img: "monument-vietnam.png", slug: "vietnam" },
  { name: "Egypt", img: "monument-egypt.png", slug: "egypt" },
  { name: "Bali", img: "monument-bali.png", slug: "bali" },
];

/** "Destinations for the Wanderon community" monuments carousel (Figma 4715:22657). */
export default function DesktopDestinations() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"international" | "domestic">("international");
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

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
          onClick={() => setTab("international")}
        >
          International
        </button>
        <button
          className={`ddest__pill${tab === "domestic" ? " ddest__pill--active" : ""}`}
          onClick={() => setTab("domestic")}
        >
          Domestic
        </button>
      </div>
      <div className="ddest__track" ref={trackRef} onScroll={onScroll}>
        {DESTINATIONS.map((d, i) => (
          <button
            key={`${d.slug}-${i}`}
            className="ddest__item"
            onClick={() => navigate(`/destination/${d.slug}`)}
          >
            <span className="ddest__figure">
              <img className="ddest__shadow" src={`${BASE}/monument-shadow.svg`} alt="" />
              <img
                className={`ddest__monument${d.flip ? " ddest__monument--flip" : ""}`}
                src={`${BASE}/${d.img}`}
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
