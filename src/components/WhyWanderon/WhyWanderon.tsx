import { useState } from "react";
import "./WhyWanderon.css";

type WhyCard = {
  id: string;
  image: string;
  /** Default (collapsed) state */
  title: string;
  subtitle: string;
  /** Expanded state */
  expandedTitle: string;
  expandedBody: string;
  /** Dark text in default state (for light images) */
  dark?: boolean;
};

const CARDS: WhyCard[] = [
  {
    id: "safety",
    image: "/figma/why/card-1.jpg",
    title: "Un-compromised Safety",
    subtitle: "Travel with absolute peace of mind.",
    expandedTitle: "Un-compromised Safety & Support",
    expandedBody:
      "Travel with absolute peace of mind. With vetted local transport, thoroughly audited stays, and 24/7 dedicated operational backup, your safety is a silent promise we keep every single day.",
  },
  {
    id: "community",
    image: "/figma/why/card-2.jpg",
    title: "Curated Communities",
    subtitle: "Like-Minded Company",
    dark: true,
    expandedTitle: "Curated Communities",
    expandedBody:
      "Like-minded company. We bring together travellers who share your vibe and curiosity, so every trip feels less like a tour group and more like a circle of friends you just hadn't met yet.",
  },
  {
    id: "logistics",
    image: "/figma/why/card-3.jpg",
    title: "Flawless Logistics by Experts",
    subtitle: "Effortless Immersion",
    expandedTitle: "Flawless Logistics by Experts",
    expandedBody:
      "Effortless immersion. From seamless transfers to perfectly-timed itineraries, our on-ground experts handle every detail so you can stay fully present in the moment.",
  },
  {
    id: "inhouse",
    image: "/figma/why/card-4.jpg",
    title: "100% In-House Operations",
    subtitle: "Direct Execution",
    dark: true,
    expandedTitle: "100% In-House Operations",
    expandedBody:
      "Direct execution. No third-party handoffs — every stay, ride, and experience is planned and run by our own team, giving you consistency and accountability from start to finish.",
  },
];

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M8 2.5v11M2.5 8h11" stroke="#3d3d3d" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export default function WhyWanderon() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section className="ww">
      <div className="ww-head">
        <h2 className="ww-title">Why travellers choose WanderOn</h2>
      </div>

      <div className="ww-row">
        {CARDS.map((card) => {
          const open = openId === card.id;
          return (
            <div key={card.id} className={`ww-card ${open ? "ww-card--open" : ""}`}>
              {!open && <img className="ww-card-img" src={card.image} alt="" loading="lazy" />}

              <div
                className={`ww-card-text ${open ? "ww-card-text--open" : ""} ${
                  card.dark && !open ? "ww-card-text--dark" : ""
                }`}
              >
                <p className="ww-card-title">{open ? card.expandedTitle : card.title}</p>
                <p className="ww-card-body">{open ? card.expandedBody : card.subtitle}</p>
              </div>

              <button
                type="button"
                className="ww-card-btn"
                aria-label={open ? "Collapse card" : "Expand card"}
                aria-expanded={open}
                onClick={() => setOpenId(open ? null : card.id)}
              >
                <span className={`ww-card-btn-icon ${open ? "ww-card-btn-icon--close" : ""}`}>
                  <PlusIcon />
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
