import { useState } from "react";
import WhyTravellerCard from "./WhyTravellerCard";
import "./DesktopWhyTravellers.css";

/* Same content + expanded copy as the mobile WhyWanderon section. */
const CARDS = [
  {
    id: "safety",
    title: "Un-compromised Safety",
    sub: "Travel with absolute peace of mind.",
    img: "why-safety.png",
    expandedTitle: "Un-compromised Safety & Support",
    expandedBody:
      "Travel with absolute peace of mind. With vetted local transport, thoroughly audited stays, and 24/7 dedicated operational backup, your safety is a silent promise we keep every single day.",
  },
  {
    id: "community",
    title: "Curated Communities",
    sub: "Like-Minded Company",
    img: "why-communities.png",
    darkText: true,
    expandedTitle: "Curated Communities",
    expandedBody:
      "Like-minded company. We bring together travellers who share your vibe and curiosity, so every trip feels less like a tour group and more like a circle of friends you just hadn't met yet.",
  },
  {
    id: "logistics",
    title: "Flawless Logistics by Experts",
    sub: "Effortless Immersion",
    img: "why-logistics.png",
    expandedTitle: "Flawless Logistics by Experts",
    expandedBody:
      "Effortless immersion. From seamless transfers to perfectly-timed itineraries, our on-ground experts handle every detail so you can stay fully present in the moment.",
  },
  {
    id: "inhouse",
    title: "100% In-House Operations",
    sub: "Direct Execution",
    img: "why-inhouse.png",
    darkText: true,
    expandedTitle: "100% In-House Operations",
    expandedBody:
      "Direct execution. No third-party handoffs — every stay, ride, and experience is planned and run by our own team, giving you consistency and accountability from start to finish.",
  },
];

/** "Why travellers choose WanderOn" value-prop cards (Figma 4940:23548).
 *  Cards toggle between photo and expanded-text modes like the mobile version. */
export default function DesktopWhyTravellers() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section className="dwtrav">
      <div className="dwtrav__head">
        <h2 className="dwtrav__title">Why travellers choose WanderOn</h2>
        <p className="dwtrav__sub">Straight from their phones. Shot mid-trip, not staged.</p>
      </div>
      <div className="dwtrav__row">
        {CARDS.map(({ id, ...card }) => (
          <WhyTravellerCard
            key={id}
            {...card}
            open={openId === id}
            onToggle={() => setOpenId(openId === id ? null : id)}
          />
        ))}
      </div>
    </section>
  );
}
