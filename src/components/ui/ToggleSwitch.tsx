import { playTapSound } from "@/utils/sound";

const TOGGLE = "/figma/listing/toggle/";

/**
 * The Figma pill switch used for "Show Features" and "Show Map". One
 * implementation for every surface; the label can sit inside the button (the
 * listing toggles) or beside it (the itinerary map toggle).
 */
export interface ToggleSwitchProps {
  checked: boolean;
  onChange: (next: boolean) => void;
  label?: string;
  /** Render the label as a sibling of the button instead of inside it. */
  labelOutside?: boolean;
  /** Class for the button, or for the wrapper when `labelOutside`. */
  className?: string;
  /** Class for the button when `labelOutside`. */
  buttonClassName?: string;
  labelClassName?: string;
  imgClassName?: string;
  ariaLabel?: string;
  /** Play the UI tap sound on change, as the listing toggles do. */
  tapSound?: boolean;
}

export default function ToggleSwitch({
  checked,
  onChange,
  label,
  labelOutside = false,
  className,
  buttonClassName,
  labelClassName,
  imgClassName,
  ariaLabel,
  tapSound = false,
}: ToggleSwitchProps) {
  const handleClick = () => {
    if (tapSound) playTapSound();
    onChange(!checked);
  };

  const img = (
    <img
      className={imgClassName}
      src={`${TOGGLE}toggle-${checked ? "on" : "off"}.svg`}
      alt=""
      aria-hidden
    />
  );

  const button = (
    <button
      type="button"
      className={labelOutside ? buttonClassName : className}
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={handleClick}
    >
      {!labelOutside && label && <span className={labelClassName}>{label}</span>}
      {img}
    </button>
  );

  if (!labelOutside) return button;

  return (
    <div className={className}>
      {label && <span className={labelClassName}>{label}</span>}
      {button}
    </div>
  );
}
