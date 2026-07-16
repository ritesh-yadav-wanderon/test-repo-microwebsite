import { useRef, useState } from "react";
import "./PhotoStack.css";

const S = "/figma/stack/";

/* Four distinct photos. Each source image is a wide file holding two photos
   side-by-side (Figma 4518:26092 split trick), selected via the `half` offset. */
const CARDS = [
  { src: `${S}deck-1.jpg`, half: "left" },
  { src: `${S}deck-2.jpg`, half: "left" },
  { src: `${S}deck-2.jpg`, half: "right" },
  { src: `${S}deck-1.jpg`, half: "right" },
] as const;

/* Stack slots, back (index 0) → front (last). Rotations/offsets from Figma. */
const SLOTS = [
  { left: "3.48%", right: "3.44%", top: 0, rot: 6.58 },
  { left: "4.12%", right: "3.93%", top: 11.56, rot: 4.72 },
  { left: "5.08%", right: "4.89%", top: 26.04, rot: 2.24 },
  { left: "6.14%", right: "6.04%", top: 36.27, rot: 0 },
] as const;

const OUT_MS = 320; // top card peels off the deck
const SETTLE_MS = 520; // it swings behind and tucks at the back

export default function PhotoStack() {
  // order[0] = back-most, order[last] = front-most (the tappable top card).
  const [order, setOrder] = useState<number[]>([3, 2, 1, 0]);
  const [lifting, setLifting] = useState(false);
  const busy = useRef(false);

  function cycle() {
    if (busy.current) return;
    busy.current = true;
    // 1) Peel the top card off the deck (stays on top, no fade).
    setLifting(true);
    // 2) Send it to the back; it swings down-and-behind into the back slot
    //    while the rest of the deck slides forward one place.
    window.setTimeout(() => {
      setOrder((prev) => {
        const next = prev.slice();
        const front = next.pop() as number;
        next.unshift(front);
        return next;
      });
      setLifting(false);
      // Keep the guard until the settle transition finishes.
      window.setTimeout(() => {
        busy.current = false;
      }, SETTLE_MS);
    }, OUT_MS);
  }

  return (
    <div className="ps-wrap">
      <button className="ps-deck" type="button" onClick={cycle} aria-label="Show next photo">
        {order.map((cardIdx, depth) => {
          const card = CARDS[cardIdx];
          const slot = SLOTS[depth];
          const isFront = depth === order.length - 1;
          const lift = isFront && lifting;
          // While lifted the card floats above everything; once it is reordered
          // to the back its z-index drops so it visibly slides under the deck.
          const zIndex = lift ? SLOTS.length + 2 : depth + 1;

          return (
            <div
              key={cardIdx}
              className="ps-card"
              style={{
                left: slot.left,
                right: slot.right,
                top: `${slot.top}px`,
                zIndex,
                transform: lift
                  ? "translate(15%, -70px) rotate(9deg) scale(1.06)"
                  : `rotate(${slot.rot}deg)`,
                boxShadow: lift
                  ? "0 20px 34px rgba(0, 0, 0, 0.32)"
                  : undefined,
                transition: lift
                  ? `transform ${OUT_MS}ms cubic-bezier(0.22, 0.61, 0.36, 1), box-shadow ${OUT_MS}ms ease`
                  : `transform ${SETTLE_MS}ms cubic-bezier(0.5, 0.02, 0.35, 1), top ${SETTLE_MS}ms cubic-bezier(0.5, 0.02, 0.35, 1), left ${SETTLE_MS}ms cubic-bezier(0.5, 0.02, 0.35, 1), right ${SETTLE_MS}ms cubic-bezier(0.5, 0.02, 0.35, 1), box-shadow ${SETTLE_MS}ms ease`,
              }}
            >
              <div className="ps-frame">
                <img
                  className="ps-img"
                  src={card.src}
                  alt=""
                  draggable={false}
                  loading="lazy"
                  style={{ left: card.half === "right" ? "-100%" : "0" }}
                />
              </div>
            </div>
          );
        })}
      </button>
      <span className="ps-hint" aria-hidden>
        Tap to shuffle
      </span>
    </div>
  );
}
