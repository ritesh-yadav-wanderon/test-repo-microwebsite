import "./OriginalsSection.css";

const GRADIENT =
  "linear-gradient(-55.37deg, rgb(252, 223, 218) 19.305%, rgb(207, 225, 243) 78.195%)";

const CARDS = [
  {
    id: "inspiring",
    title: "Inspiring Stories",
    body: "In Bhutan, luxury feels less like indulgence and more like ease. This Bhutan self-drive expedition offers curated comfort across long Himalayan routes.",
    variant: "hiker" as const,
  },
  {
    id: "rome",
    title: "Rome",
    body: "Step into the eternal city — where every cobblestone tells a story and every corner hides a marvel waiting to be discovered.",
    variant: "rome" as const,
  },
  {
    id: "mosque",
    title: "Inspiring Stories",
    body: "From ancient minarets to vast desert skies, every journey here is a chapter written in wonder.",
    variant: "mosque" as const,
  },
];

function OrigCard({ title, body, variant }: (typeof CARDS)[0]) {
  const isHiker = variant === "hiker";
  const style = isHiker
    ? { background: "#f6e7d5" }
    : { backgroundImage: GRADIENT };

  return (
    <button className="orig-card" style={style} type="button">
      <div className="orig-content">
        <div className="orig-story">
          <p className="orig-title">{title}</p>
          <p className="orig-body">{body}</p>
        </div>
        <div className="orig-btn">
          <span>Explore</span>
        </div>
      </div>

      {isHiker && (
        <>
          <img
            src="/figma/originals/hiker.png"
            alt=""
            aria-hidden
            className="orig-hiker"
          />
          <div className="orig-mountain-wrap">
            <div className="orig-mountain-inner">
              <img
                src="/figma/originals/mountain-bottom.png"
                alt=""
                aria-hidden
                className="orig-mountain"
              />
            </div>
          </div>
          </>
      )}

      {variant === "rome" && (
        <>
          <img
            src="/figma/originals/roma.png"
            alt=""
            aria-hidden
            className="orig-arch orig-arch--rome"
          />
          </>
      )}

      {variant === "mosque" && (
        <>
          <img
            src="/figma/originals/mosque.png"
            alt=""
            aria-hidden
            className="orig-arch orig-arch--mosque"
          />
          </>
      )}
    </button>
  );
}

export default function OriginalsSection() {
  return (
    <section className="orig">
      <div className="orig-scroll">
        {CARDS.map((card) => (
          <OrigCard key={card.id} {...card} />
        ))}
      </div>
    </section>
  );
}
