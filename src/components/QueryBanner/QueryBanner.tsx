import "./QueryBanner.css";

export default function QueryBanner() {
  return (
    <section className="query">
      <div
        className="query-bg"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=900&q=70&auto=format&fit=crop)",
        }}
        aria-hidden
      />
      <div className="query-scrim" aria-hidden />

      <div className="query-icon">
        <img
          src="https://images.unsplash.com/photo-1617581629397-a72507c3de9e?w=300&q=70&auto=format&fit=crop"
          alt=""
          loading="lazy"
        />
      </div>

      <div className="query-content">
        <span className="query-badge">We are here for You!</span>
        <h3 className="query-title">Have a query?</h3>
        <button className="query-cta" type="button">
          Enquire Now
        </button>
      </div>
    </section>
  );
}
