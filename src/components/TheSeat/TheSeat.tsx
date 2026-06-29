import "./TheSeat.css";

export default function TheSeat() {
  return (
    <section className="seat">
      <div className="seat-head">
        <h2 className="seat-title">The Seat.</h2>
        <p className="seat-sub-strong">WanderOn Trip Captain!</p>
        <p className="seat-sub">
          Here&rsquo;s what the road looks like from where they sit.
        </p>
      </div>

      <div className="seat-block-1">
        <figure className="seat-card seat-card-left">
          <img
            src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=520&q=70&auto=format&fit=crop"
            alt="Trip captain Nitin Devrani with a group of travellers"
            loading="lazy"
          />
          <figcaption>
            <strong>Nitin Devrani</strong>
            <span>Trip Captain</span>
          </figcaption>
        </figure>

        <p className="seat-quote">
          NYC is one of the world&rsquo;s most diverse destinations. Explore the
          City&rsquo;s many cultural enclaves and see the five boroughs from
          every angle.
        </p>
      </div>

      <div className="seat-block-2">
        <img
          className="seat-ball"
          src="https://images.unsplash.com/photo-1508344928928-7165b67de128?w=260&q=70&auto=format&fit=crop"
          alt="A baseball resting on the ground"
          loading="lazy"
        />
        <figure className="seat-card seat-card-right">
          <img
            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=520&q=70&auto=format&fit=crop"
            alt="Trip captain Clint at the riverside"
            loading="lazy"
          />
          <figcaption>
            <strong>CLINT</strong>
            <span>Owner, Gaston&rsquo;s White River Resort, Arkansas</span>
          </figcaption>
        </figure>
      </div>

      <div className="seat-divider" />
    </section>
  );
}
