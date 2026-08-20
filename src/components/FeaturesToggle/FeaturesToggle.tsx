import { playTapSound } from "../../pages/searchResults.helpers";
import "./FeaturesToggle.css";

interface Props {
  checked: boolean;
  onChange: (next: boolean) => void;
  className?: string;
}

/** "Show Features" switch from the listing pages, reused wherever listing trip
 *  cards appear so the feature rows can be hidden the same way everywhere. */
export default function FeaturesToggle({ checked, onChange, className }: Props) {
  return (
    <button
      type="button"
      className={`ftog${className ? ` ${className}` : ""}`}
      role="switch"
      aria-checked={checked}
      onClick={() => {
        playTapSound();
        onChange(!checked);
      }}
    >
      <span className="ftog-label">Show Features</span>
      <img
        className="ftog-switch"
        src={`/figma/listing/toggle/toggle-${checked ? "on" : "off"}.svg`}
        alt=""
        aria-hidden
      />
    </button>
  );
}
