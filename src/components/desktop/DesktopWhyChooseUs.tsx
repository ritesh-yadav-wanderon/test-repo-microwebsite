import "./DesktopWhyChooseUs.css";

const BASE = "/figma/desktop";

const RATINGS = [
  { score: "4.9", icon: "google-color.svg", alt: "Google", iconClass: "dwhy__brand--google" },
  { score: "5.0", icon: "tripadvisor.svg", alt: "Tripadvisor", iconClass: "dwhy__brand--ta" },
  { score: "4.9", icon: "facebook.svg", alt: "Facebook", iconClass: "dwhy__brand--fb" },
];

const REVIEW = {
  name: "Shrutika Parab",
  date: "May, 2026",
  text:
    "Thank you Team Wanderon for the amazing Ladakh Experience. Thank you Team Wanderon for the amazing Ladakh Experience. Right from the point of making the...",
};

/** "Why Choose Us" ratings + reviews (Figma 3394:11812 / 5258:12982). */
export default function DesktopWhyChooseUs() {
  return (
    <section className="dwhy">
      <div className="dwhy__head">
        <h2 className="dwhy__title">Why Choose Us</h2>
        <p className="dwhy__sub">Rated by the people who came back</p>
      </div>

      <div className="dwhy__ratings">
        {RATINGS.map((r) => (
          <div className="dwhy__rating" key={r.alt}>
            <div className="dwhy__laurels">
              <img className="dwhy__laurel" src={`${BASE}/laurel-gold.png`} alt="" />
              <span className="dwhy__score">{r.score}</span>
              <img className="dwhy__laurel dwhy__laurel--flip" src={`${BASE}/laurel-gold.png`} alt="" />
            </div>
            <div className="dwhy__brand">
              <img className={r.iconClass} src={`${BASE}/${r.icon}`} alt={r.alt} />
              <span>140001 Reviews</span>
            </div>
          </div>
        ))}
      </div>

      <div className="dwhy__reviews">
        {[0, 1].map((i) => (
          <div className="dwhy__review-wrap" key={i}>
            {i === 1 && <span className="dwhy__divider" />}
            <article className="dwhy__review">
              <header className="dwhy__review-head">
                <img className="dwhy__avatar" src={`${BASE}/review-avatar.png`} alt="" />
                <div>
                  <p className="dwhy__review-name">{REVIEW.name}</p>
                  <div className="dwhy__review-meta">
                    <img src={`${BASE}/review-stars.svg`} alt="5 out of 5 stars" />
                    <span>{REVIEW.date}</span>
                  </div>
                </div>
              </header>
              <p className="dwhy__review-text">{REVIEW.text}</p>
              <button className="dwhy__read-more">Read More</button>
            </article>
          </div>
        ))}
      </div>

      <button className="dwhy__show-all">Show all 42 reviews</button>
    </section>
  );
}
