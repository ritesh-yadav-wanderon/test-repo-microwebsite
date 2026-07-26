import WhyTravellerCard, { type WhyTravellerCardProps } from "./WhyTravellerCard";
import "./DesktopWhyTravellers.css";

const CARDS: WhyTravellerCardProps[] = [
  {
    title: "Un-compromised Safety",
    sub: "Travel with absolute peace of mind.",
    img: "why-safety.png",
  },
  {
    title: "Curated Communities",
    sub: "Like-Minded Company",
    img: "why-communities.png",
    darkText: true,
  },
  {
    title: "Flawless Logistics by Experts",
    sub: "Effortless Immersion",
    img: "why-logistics.png",
  },
  {
    title: "100% In-House Operations",
    sub: "Direct Execution",
    img: "why-inhouse.png",
    darkText: true,
  },
];

/** "Why travellers choose WanderOn" value-prop cards (Figma 4940:23548). */
export default function DesktopWhyTravellers() {
  return (
    <section className="dwtrav">
      <div className="dwtrav__head">
        <h2 className="dwtrav__title">Why travellers choose WanderOn</h2>
        <p className="dwtrav__sub">Straight from their phones. Shot mid-trip, not staged.</p>
      </div>
      <div className="dwtrav__row">
        {CARDS.map((card) => (
          <WhyTravellerCard key={card.title} {...card} />
        ))}
      </div>
    </section>
  );
}
