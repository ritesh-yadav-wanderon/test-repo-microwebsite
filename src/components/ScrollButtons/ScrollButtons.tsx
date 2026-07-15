import "./ScrollButtons.css";

interface ScrollButtonsProps {
  onPrev: () => void;
  onNext: () => void;
  prevActive?: boolean;
  className?: string;
}

export default function ScrollButtons({ onPrev, onNext, prevActive = true, className = "" }: ScrollButtonsProps) {
  return (
    <div className={`scb-wrap${className ? " " + className : ""}`}>
      <button className="scb-btn" type="button" onClick={onPrev} aria-label="Previous" disabled={!prevActive}>
        <img
          src={prevActive ? "/figma/scroll-btn/chevron-right.svg" : "/figma/scroll-btn/chevron-left.svg"}
          alt="" aria-hidden className="scb-icon"
        />
      </button>
      <button className="scb-btn" type="button" onClick={onNext} aria-label="Next">
        <img src="/figma/scroll-btn/chevron-right.svg" alt="" aria-hidden className="scb-icon" />
      </button>
    </div>
  );
}
