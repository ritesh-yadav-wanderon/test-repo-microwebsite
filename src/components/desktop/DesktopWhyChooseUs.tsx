import { useState } from "react";
import "./DesktopWhyChooseUs.css";
import DesktopReviewsModal from "./DesktopReviewsModal";

const BASE = "/figma/desktop";

/* Same review collection as the mobile TribeStories section. */
const REVIEWS = [
  {
    name: "Shrutika Parab",
    date: "May, 2026",
    text: "Thank you Team Wanderon for the amazing Ladakh Experience. Thank you Team Wanderon for the amazing Ladakh Experience. Right from the point of making the...",
  },
  {
    name: "Priya Sharma",
    date: "Apr, 2026",
    text: "An absolutely incredible trip to Spiti Valley! The team was professional and the experience was beyond expectations. Highly recommend WanderOn to everyone...",
  },
  {
    name: "Rahul Mehta",
    date: "Mar, 2026",
    text: "WanderOn made our Europe trip seamless and memorable. From Paris to Budapest, every detail was taken care of. The community vibe was amazing...",
  },
];

const PHONES = ["review-phone-1.png", "review-phone-2.png", "review-phone-3.png"];

/* Stack slots in visual order: small top phone, middle phone, front phone.
 * Advancing the carousel rotates each image one slot forward, so the image
 * in the top slot drops to the bottom (front) and the second one takes the top. */
const SLOTS = ["top", "back", "front"] as const;

/** "Why Choose Us" stats + review carousel on the grey band (Figma 5640:21355). */
export default function DesktopWhyChooseUs() {
  const [index, setIndex] = useState(0);
  const [reviewsOpen, setReviewsOpen] = useState(false);
  const review = REVIEWS[index];

  const step = (dir: 1 | -1) =>
    setIndex((i) => (i + dir + REVIEWS.length) % REVIEWS.length);

  return (
    <section className="dwhy">
      <div className="dwhy__head">
        <h2 className="dwhy__title">Why Choose Us</h2>
        <p className="dwhy__sub">Rated by the people who came back</p>
      </div>

      <div className="dwhy__stats">
        <div className="dwhy__stat">
          <img className="dwhy__stat-google" src={`${BASE}/google-color.svg`} alt="Google" />
          <span className="dwhy__stat-label">140001 Reviews</span>
        </div>
        <div className="dwhy__stat dwhy__stat--award">
          <img className="dwhy__laurel" src={`${BASE}/laurel-gold.png`} alt="" />
          <span className="dwhy__stat-award">
            Best
            <br />
            Travel Brand
          </span>
          <img className="dwhy__laurel dwhy__laurel--flip" src={`${BASE}/laurel-gold.png`} alt="" />
        </div>
        <div className="dwhy__stat">
          <span className="dwhy__stat-score">5.0</span>
          <span className="dwhy__stars">
            {Array.from({ length: 5 }, (_, i) => (
              <img key={i} src={`${BASE}/star-gold.svg`} alt="" />
            ))}
          </span>
        </div>
      </div>

      <div className="dwhy__carousel">
        <article className="dwhy__review" key={review.name}>
          <header className="dwhy__review-head">
            <img className="dwhy__avatar" src={`${BASE}/review-avatar.png`} alt="" />
            <div>
              <p className="dwhy__review-name">{review.name}</p>
              <div className="dwhy__review-meta">
                <img src={`${BASE}/review-stars.svg`} alt="5 out of 5 stars" />
                <span>{review.date}</span>
              </div>
            </div>
          </header>
          <p className="dwhy__review-text">{review.text}</p>
          <button className="dwhy__read-more">Read More</button>
        </article>

        <div className="dwhy__phones" aria-hidden>
          {PHONES.map((img, i) => {
            const slot = SLOTS[(i - index + PHONES.length) % PHONES.length];
            return (
              <img
                key={img}
                className={`dwhy__phone dwhy__phone--${slot}`}
                src={`${BASE}/${img}`}
                alt=""
                loading="lazy"
              />
            );
          })}
        </div>

        <div className="dwhy__arrows">
          <button className="dwhy__arrow" aria-label="Previous review" onClick={() => step(-1)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M15 4 7 12l8 8" stroke="#3d3d3d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button className="dwhy__arrow" aria-label="Next review" onClick={() => step(1)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="m9 4 8 8-8 8" stroke="#3d3d3d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      <button className="dwhy__show-all" onClick={() => setReviewsOpen(true)}>
        Show all 42 reviews
      </button>

      <DesktopReviewsModal isOpen={reviewsOpen} onClose={() => setReviewsOpen(false)} />
    </section>
  );
}
