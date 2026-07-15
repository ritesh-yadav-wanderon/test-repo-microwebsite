import "./DestinationStrip.css";

interface Destination {
  name: string;
  img: string;
  ellipse: "color" | "gray";
  flip?: boolean;
}

const DOMESTIC: Destination[] = [
  { name: "Kerala",     img: "/figma/dest/kerala.png",    ellipse: "color" },
  { name: "Rajasthan",  img: "/figma/dest/rajasthan.png", ellipse: "gray", flip: true },
  { name: "Spiti",      img: "/figma/dest/spiti.png",     ellipse: "gray" },
  { name: "Meghalaya",  img: "/figma/dest/meghalaya.png", ellipse: "gray" },
  { name: "Kashmir",    img: "/figma/dest/kashmir.png",   ellipse: "gray" },
  { name: "Ladakh",     img: "/figma/dest/ladakh.png",    ellipse: "gray", flip: true },
];

const INTERNATIONAL: Destination[] = [
  { name: "Egypt",    img: "/figma/dest/egypt.png",    ellipse: "color" },
  { name: "Bali",     img: "/figma/dest/bali.png",     ellipse: "color" },
  { name: "Japan",    img: "/figma/dest/japan.png",    ellipse: "color" },
  { name: "Thailand", img: "/figma/dest/thailand.png", ellipse: "color" },
  { name: "Europe",   img: "/figma/dest/meghalaya.png",ellipse: "color" },
  { name: "Dubai",    img: "/figma/dest/dubai.png",    ellipse: "color" },
  { name: "Vietnam",  img: "/figma/dest/vietnam.png",  ellipse: "color" },
];

function DestItem({ dest }: { dest: Destination }) {
  return (
    <a className="dest-item" href={`/destination/${dest.name}`} aria-label={dest.name}>
      <div className="dest-item-img-wrap">
        <img
          className={`dest-item-ellipse dest-item-ellipse--${dest.ellipse}`}
          src={`/figma/dest/ellipse-${dest.ellipse}.svg`}
          alt=""
          aria-hidden
        loading="lazy" />
        <img
          className={`dest-item-icon${dest.flip ? " dest-item-icon--flip" : ""}`}
          src={dest.img}
          alt={dest.name}
          loading="lazy"
        />
      </div>
      <span className="dest-item-label">{dest.name}</span>
    </a>
  );
}

export default function DestinationStrip() {
  return (
    <div className="dest-section">
      {/* Domestic */}
      <div className="dest-block">
        <button className="dest-block-header" type="button">
          <span className="dest-block-title">Domestic Destinations</span>
          <div className="dest-block-arrow">
            <img src="/figma/dest/arrow-right.svg" width={20} height={20} alt="" aria-hidden loading="lazy" />
          </div>
        </button>
        <div className="dest-grid">
          {DOMESTIC.map((d) => <DestItem key={d.name} dest={d} />)}
        </div>
      </div>

      {/* International */}
      <div className="dest-block">
        <button className="dest-block-header" type="button">
          <span className="dest-block-title">International Destinations</span>
          <div className="dest-block-arrow">
            <img src="/figma/dest/arrow-right.svg" width={20} height={20} alt="" aria-hidden loading="lazy" />
          </div>
        </button>
        <div className="dest-grid">
          {INTERNATIONAL.map((d) => <DestItem key={d.name} dest={d} />)}
        </div>
      </div>
    </div>
  );
}
