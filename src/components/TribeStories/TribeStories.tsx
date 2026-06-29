import "./TribeStories.css";

interface Story {
  title: string;
  place: string;
  img: string;
  active: boolean;
}

const STORIES: Story[] = [
  {
    title: "Misty Meadows",
    place: "Himalayan Monsoon Escape",
    img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=70&auto=format&fit=crop",
    active: false,
  },
  {
    title: "Monaco F1 Weekend",
    place: "Singapore Grand Prix Weekend & Curated Luxury Experiences",
    img: "https://images.unsplash.com/photo-1504707748692-419802cf939d?w=600&q=70&auto=format&fit=crop",
    active: true,
  },
  {
    title: "Golden Hour",
    place: "African Savannah Safari",
    img: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=600&q=70&auto=format&fit=crop",
    active: false,
  },
];

export default function TribeStories() {
  return (
    <section className="tribe">
<div className="tribe-row">
        {STORIES.map((s) => (
          <article
            className={`tribe-card${s.active ? " tribe-card--active" : ""}`}
            key={s.title}
          >
            <img src={s.img} alt={s.title} loading="lazy" />
            <div className="tribe-shade" />
            {s.active && (
              <span className="tribe-play" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <path d="M7 5l10 6-10 6V5z" fill="#fff" />
                </svg>
              </span>
            )}
            <div className="tribe-cap">
              <strong>{s.title}</strong>
              <span>{s.place}</span>
            </div>
          </article>
        ))}
      </div>

      <div className="tribe-progress">
        <span className="tribe-track">
          <span className="tribe-fill" />
        </span>
      </div>
    </section>
  );
}
