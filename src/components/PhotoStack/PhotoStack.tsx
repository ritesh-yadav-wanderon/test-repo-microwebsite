import { useState } from "react";
import "./PhotoStack.css";

const CARDS = [
  { src: "/figma/stack/photo-2.png", x: "0%"    },
  { src: "/figma/stack/photo-3.png", x: "0%"    },
  { src: "/figma/stack/photo-3.png", x: "-105%" },
  { src: "/figma/stack/photo-2.png", x: "-105%" },
];

const SLOTS = [
  { left: "3.48%", right: "3.44%", top: 0,     rotation: 6.58 },
  { left: "4.12%", right: "3.93%", top: 11.56, rotation: 4.72 },
  { left: "5.08%", right: "4.89%", top: 26.04, rotation: 2.24 },
  { left: "6.14%", right: "6.04%", top: 36.27, rotation: 0    },
] as const;

export default function PhotoStack() {
  const [imgs, setImgs] = useState([0, 1, 2, 3]);
  const [sweeping, setSweeping] = useState(false);
  const [snapBack, setSnapBack] = useState(false);

  function handleClick() {
    if (sweeping) return;
    setSweeping(true);
  }

  function handleSweepEnd() {
    setSnapBack(true);
    setImgs(prev => [prev[3], prev[0], prev[1], prev[2]]);
    setSweeping(false);
    requestAnimationFrame(() => requestAnimationFrame(() => setSnapBack(false)));
  }

  return (
    <button className="ps-wrap" onClick={handleClick} type="button" aria-label="View next photo">
      {imgs.map((cardIdx, slotIdx) => {
        const card = CARDS[cardIdx];
        const slot = SLOTS[slotIdx];
        const isTop = slotIdx === 3;
        const isBack = slotIdx === 0;
        const isSweeping = isTop && sweeping;

        let transition = "transform 0.35s ease, top 0.35s ease";
        if (isSweeping) transition = "none";
        if (isBack && snapBack) transition = "none";

        return (
          <div
            key={cardIdx}
            className={`ps-card${isSweeping ? " ps-card--sweep" : ""}`}
            style={{
              left: slot.left,
              right: slot.right,
              top: `${slot.top}px`,
              transform: isSweeping ? undefined : `rotate(${slot.rotation}deg)`,
              zIndex: slotIdx + 1,
              transition,
            }}
            onAnimationEnd={isSweeping ? handleSweepEnd : undefined}
          >
            <div className="ps-img-wrap">
              <img
                className="ps-img"
                src={card.src}
                alt=""
                style={{ left: card.x }}
                draggable={false}
              />
            </div>
          </div>
        );
      })}
      <span className="ps-hint" aria-hidden="true">tap to flip</span>
    </button>
  );
}
