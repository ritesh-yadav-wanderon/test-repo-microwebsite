import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav/BottomNav";
import { getLastMainPage } from "../utils/lastMainPage";
import "./Notifications.css";

const N = "/figma/notifications/";
const P = "/figma/profile/";

type FilterKey = "all" | "alerts" | "offers" | "promotions";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "alerts", label: "Alerts" },
  { key: "offers", label: "Offers" },
  { key: "promotions", label: "Promotions" },
];

interface Notification {
  id: string;
  category: Exclude<FilterKey, "all">;
  title: string;
  body: string[];
  unread?: boolean;
  wave?: boolean;
  thumb?: string;
}

const NOTIFICATIONS: Notification[] = [
  {
    id: "adventure",
    category: "alerts",
    wave: true,
    unread: true,
    title: "Get Ready for Your Adventure!",
    body: [
      "Your trip to Ladakh is just around the corner. Make sure to check your itinerary and finalize any last-minute preparations. Have a great journey!",
    ],
  },
  {
    id: "complete-booking",
    category: "alerts",
    title: "Complete Your Booking",
    body: [
      "Hi Ritesh, your spot awaiting in Ladakh Trip. Don\u2019t miss out on this opportunity! Complete your booking now and secure your spot.",
    ],
  },
  {
    id: "rediscover",
    category: "promotions",
    thumb: `${N}thumb-ladakh.png`,
    title: "Rediscover Your Favorite Destinations",
    body: [
      "You\u2019ve recently viewed Leh Ladakh Trip Package. Ready to explore more? Don\u2019t miss out on the exciting experiences waiting for you!",
    ],
  },
  {
    id: "exclusive-offers",
    category: "offers",
    title: "Exclusive Offers Just for Your!",
    body: [
      "we have some amazing new deals and offers that we think you\u2019ll love. Check them out and make your next adventure unforgettable.",
    ],
  },
  {
    id: "top-choice",
    category: "promotions",
    title: "Your Top Choice Awaits",
    body: [
      "Turn your dream into reality. Book now and embark on an unforgettable journey!",
      "Leh Ladakh Trip package...",
    ],
  },
];

/* Waving-hand emoji icon — layered vectors exported from Figma (5077:36825).
   Each layer keeps the exact inset it has inside the 24px icon frame. */
const WAVE_INSETS = [
  "7.68% 1.35% 1.37% 7.85%",
  "6.35% 0 0 6.5%",
  "37.62% 24.39% 26.68% 67.3%",
  "0 28.96% 79.04% 50.98%",
  "7.91% 34.72% 80.16% 51.73%",
  "64.82% 75.62% 18.67% 0",
  "63.79% 77.65% 25% 8.19%",
];

function WaveIcon() {
  return (
    <span className="ntf-wave" aria-hidden>
      {WAVE_INSETS.map((inset, i) => (
        <span key={i} className="ntf-wave-layer" style={{ inset }}>
          <img src={`${N}wave-${i + 1}.svg`} alt="" />
        </span>
      ))}
    </span>
  );
}

/** Mobile Notifications screen — profile segment (Figma 3626:9518). */
export default function Notifications() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<FilterKey>("all");

  const visible =
    filter === "all" ? NOTIFICATIONS : NOTIFICATIONS.filter((n) => n.category === filter);

  return (
    <div className="ntf-page">
      <header className="ntf-nav">
        <div className="ntf-nav-left">
          <button
            className="ntf-back"
            type="button"
            aria-label="Back"
            onClick={() => navigate("/profile")}
          >
            <img src={`${P}icon-arrow-back.svg`} width={24} height={24} alt="" aria-hidden />
          </button>
          <span className="ntf-title">Notifications</span>
        </div>
        <button
          className="ntf-close"
          type="button"
          aria-label="Back to website"
          onClick={() => navigate(getLastMainPage())}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M6 6l12 12M18 6 6 18" stroke="#202020" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      </header>

      {/* Category filter chips */}
      <div className="ntf-filters" role="tablist" aria-label="Notification categories">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            role="tab"
            aria-selected={filter === f.key}
            className={`ntf-chip${filter === f.key ? " ntf-chip--active" : ""}`}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="ntf-list">
        {visible.length === 0 ? (
          <p className="ntf-empty">No notifications here yet.</p>
        ) : (
          visible.map((n) => (
            <article className="ntf-card" key={n.id}>
              {n.thumb ? (
                <div className="ntf-card-row">
                  <img className="ntf-thumb" src={n.thumb} alt="" loading="lazy" />
                  <div className="ntf-card-texts">
                    <h3 className="ntf-card-title">{n.title}</h3>
                    {n.body.map((line, i) => (
                      <p className="ntf-card-body" key={i}>
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  <div className="ntf-card-head">
                    {n.wave && <WaveIcon />}
                    <h3 className="ntf-card-title">{n.title}</h3>
                  </div>
                  {n.body.map((line, i) => (
                    <p className="ntf-card-body" key={i}>
                      {line}
                    </p>
                  ))}
                </>
              )}
              {n.unread && (
                <img className="ntf-dot" src={`${N}dot.svg`} width={6} height={6} alt="" aria-hidden />
              )}
            </article>
          ))
        )}
      </div>

      <BottomNav />
    </div>
  );
}
