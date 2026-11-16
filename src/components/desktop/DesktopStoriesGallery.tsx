import { useRef, useState } from "react";
import PagerButtons from "@/components/ui/PagerButtons";
import "./DesktopStoriesGallery.css";

const S = "/figma/desktop-pdp/";

/** Photo row of the product page's "Stories of our travellers" (Figma
 *  10947:39010): mixed-size, square-cornered photos, centred on one line. */
const PHOTOS: { src: string; w: number; h: number }[] = [
  { src: `${S}story-1.jpg`, w: 301, h: 387 },
  { src: `${S}story-2.jpg`, w: 301, h: 250 },
  { src: `${S}story-3.jpg`, w: 301, h: 387 },
  { src: `${S}story-4.jpg`, w: 403, h: 314 },
  { src: `${S}story-5.jpg`, w: 301, h: 387 },
  { src: `${S}story-6.jpg`, w: 301, h: 269 },
  { src: `${S}story-7.jpg`, w: 340, h: 339 },
  { src: `${S}story-8.jpg`, w: 301, h: 387 },
  { src: `${S}story-9.jpg`, w: 301, h: 254 },
];

export default function DesktopStoriesGallery() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const scrollBy = (dir: 1 | -1) =>
    trackRef.current?.scrollBy({ left: dir * 632, behavior: "smooth" });

  return (
    <section className="dstories" aria-labelledby="dstories-title">
      <div className="dstories__head">
        <h2 id="dstories-title" className="dstories__title">Stories of our travellers</h2>
        <p className="dstories__sub">Straight from their phones. Shot mid-trip, not staged.</p>
      </div>
      <div
        className="dstories__track"
        ref={trackRef}
        onScroll={(e) => setAtStart(e.currentTarget.scrollLeft < 4)}
      >
        {PHOTOS.map((p) => (
          <img
            key={p.src}
            src={p.src}
            alt=""
            width={p.w}
            height={p.h}
            className="dstories__photo"
            style={{ width: p.w, height: p.h }}
            loading="lazy"
          />
        ))}
      </div>
      <PagerButtons
        variant="pill"
        className="dstories__pager"
        prevActive={!atStart}
        onPrev={() => scrollBy(-1)}
        onNext={() => scrollBy(1)}
      />
    </section>
  );
}
