import "./OriginalsSection.css";

export default function OriginalsSection() {
  return (
    <section className="orig">
      <div className="orig-head">
        <h2 className="orig-title">WanderOn Originals.</h2>
        <p className="orig-sub">The distance? short. the story? long.</p>
      </div>

      <div className="orig-panel">
        <div className="orig-story">
          <h3 className="orig-story-title">Inspiring Stories</h3>
          <p className="orig-story-body">
            In Bhutan, luxury feels less like indulgence and more like ease.
            This Bhutan self-drive expedition offers curated comfort across long
            Himalayan routes.
          </p>
          <div className="orig-progress">
            <span className="orig-bar orig-bar--active" />
            <span className="orig-bar" />
            <span className="orig-bar" />
          </div>
        </div>

        <img
          className="orig-birds"
          src="/figma/originals-birds.png"
          alt=""
          aria-hidden
          loading="lazy"
        />

        <img
          className="orig-hiker"
          src="/figma/originals-hiker.jpg"
          alt="Trekker standing on a Himalayan peak"
          loading="lazy"
        />

        <img
          className="orig-mountain"
          src="/figma/originals-mountain.png"
          alt=""
          aria-hidden
          loading="lazy"
        />
      </div>
    </section>
  );
}
