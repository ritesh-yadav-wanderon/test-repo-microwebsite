import "./CreateMoments.css";

import img02 from "../../assets/create-moments/img-02.jpg";
import img03 from "../../assets/create-moments/img-03.jpg";
import img04 from "../../assets/create-moments/img-04.jpg";
import img05 from "../../assets/create-moments/img-05.jpg";
import img06 from "../../assets/create-moments/img-06.jpg";
import img07 from "../../assets/create-moments/img-07.jpg";
import img08 from "../../assets/create-moments/img-08.jpg";
import img09 from "../../assets/create-moments/img-09.jpg";
import img10 from "../../assets/create-moments/img-10.jpg";

/* Figma node I3113:9965;20465:11102..11110 — 9 cells, widths/heights from design */
const PHOTOS: { src: string; w: number; h: number }[] = [
  { src: img02, w: 159, h: 205 }, // cell 1 — F1 / top-layer (img01 is bg placeholder)
  { src: img03, w: 159, h: 132 }, // cell 2
  { src: img04, w: 159, h: 205 }, // cell 3
  { src: img05, w: 213, h: 166 }, // cell 4 — wider
  { src: img06, w: 159, h: 205 }, // cell 5
  { src: img07, w: 159, h: 142 }, // cell 6
  { src: img08, w: 180, h: 179 }, // cell 7
  { src: img09, w: 159, h: 205 }, // cell 8
  { src: img10, w: 159, h: 134 }, // cell 9
];

export default function CreateMoments() {
  return (
    <section className="cm">
      <h2 className="cm-title">
        Create
        <br />
        moments you
        <br />
        wish existed
      </h2>

      <div className="cm-gallery-wrap">
        <div className="cm-gallery">
          {PHOTOS.map(({ src, w, h }, i) => (
            <div
              key={i}
              className="cm-photo"
              style={{ width: w, height: h }}
            >
              <img src={src} alt="" loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
