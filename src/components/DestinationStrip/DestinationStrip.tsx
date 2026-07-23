import { Fragment, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./DestinationStrip.css";

const CAT_SEP = "/figma/dest/cat-sep.png";

// Index 0 = All Trips (home icon); 1–6 = text tabs
const CATEGORIES = ["Adventure", "Luxury", "Culture", "Festival", "Wellness", "Weekend"];

function HomeIcon() {
  return (
    <svg width="23" height="20" viewBox="0 0 23 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M22.2333 18.4H20.7V11.2001L20.9242 11.4341C21.0684 11.5842 21.2637 11.6684 21.4673 11.6683C21.671 11.6681 21.8662 11.5835 22.01 11.4331C22.1539 11.2827 22.2346 11.0789 22.2344 10.8664C22.2343 10.6539 22.1532 10.4502 22.0091 10.3001L12.5839 0.468252C12.2963 0.168425 11.9065 0 11.5 0C11.0935 0 10.7037 0.168425 10.4161 0.468252L0.990917 10.3001C0.847186 10.4502 0.766489 10.6538 0.766579 10.866C0.766669 11.0782 0.847538 11.2816 0.991396 11.4316C1.13525 11.5816 1.33032 11.6658 1.53367 11.6657C1.73703 11.6656 1.93202 11.5812 2.07575 11.4311L2.3 11.2001V18.4H0.766667C0.563334 18.4 0.368329 18.4843 0.224551 18.6343C0.0807735 18.7844 0 18.9878 0 19.2C0 19.4122 0.0807735 19.6157 0.224551 19.7657C0.368329 19.9157 0.563334 20 0.766667 20H22.2333C22.4367 20 22.6317 19.9157 22.7754 19.7657C22.9192 19.6157 23 19.4122 23 19.2C23 18.9878 22.9192 18.7844 22.7754 18.6343C22.6317 18.4843 22.4367 18.4 22.2333 18.4ZM3.83333 9.60013L11.5 1.60024L19.1667 9.60013V18.4H14.5667V12.8001C14.5667 12.5879 14.4859 12.3844 14.3421 12.2344C14.1983 12.0844 14.0033 12.0001 13.8 12.0001H9.2C8.99667 12.0001 8.80166 12.0844 8.65788 12.2344C8.51411 12.3844 8.43333 12.5879 8.43333 12.8001V18.4H3.83333V9.60013ZM13.0333 18.4H9.96667V13.6001H13.0333V18.4Z" fill="currentColor"/>
    </svg>
  );
}

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
    <Link className="dest-item" to={`/destination/${dest.name}`} aria-label={dest.name}>
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
    </Link>
  );
}

interface Props {
  activeCategory: number;
  onCategoryChange: (idx: number) => void;
}

export default function DestinationStrip({ activeCategory, onCategoryChange }: Props) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => setStuck(!entry.isIntersecting),
      { rootMargin: "-72px 0px 0px 0px", threshold: 0 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="dest-section">
      <div ref={sentinelRef} className="dest-cats-sentinel" />
      {/* Category tabs */}
      <nav className={`dest-cats${stuck ? " dest-cats--stuck" : ""}`} aria-label="Trip categories">
        {/* All Trips — home icon */}
        <button
          className={`dest-cat-tab${activeCategory === 0 ? " dest-cat-tab--active" : ""}`}
          type="button"
          aria-label="All Trips"
          onClick={() => onCategoryChange(0)}
        >
          <HomeIcon />
        </button>

        {CATEGORIES.map((cat, i) => (
          <Fragment key={cat}>
            <img className="dest-cat-sep" src={CAT_SEP} width={6} height={16} alt="" aria-hidden />
            <button
              className={`dest-cat-tab${activeCategory === i + 1 ? " dest-cat-tab--active" : ""}`}
              type="button"
              onClick={() => onCategoryChange(i + 1)}
            >
              {cat}
            </button>
          </Fragment>
        ))}

        <img className="dest-cat-sep" src={CAT_SEP} width={6} height={16} alt="" aria-hidden />
        <button className="dest-cat-see-all" type="button">
          {"See all\ncategories"}
        </button>
      </nav>

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
