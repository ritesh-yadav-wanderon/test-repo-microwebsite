import DesktopPovCarousel, { type PovCard } from "./DesktopPovCarousel";
import "./DesktopPlot.css";

const BASE = "/figma/desktop";

const CARDS: PovCard[] = [
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

/** "The Plot" POV carousel (Figma 5252:12895) — zoom-in-center interaction. */
export default function DesktopPlot() {
  return (
    <section className="dplot">
      <div className="dplot__head">
        <h2 className="dplot__title">The Plot</h2>
        <p className="dplot__sub">POVs from the trips that hit different!</p>
      </div>

      <DesktopPovCarousel
        cards={CARDS}
        base={BASE}
        playIcon={`${BASE}/plot-play.svg`}
        initialCenter={3}
      />
    </section>
  );
}
