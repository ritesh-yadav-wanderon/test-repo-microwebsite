import ToggleSwitch from "@/components/ui/ToggleSwitch";
import "./FeaturesToggle.css";

interface Props {
  checked: boolean;
  onChange: (next: boolean) => void;
  className?: string;
  /** Defaults to "Show Features"; the destination strips say "Show Highlights". */
  label?: string;
}

/** "Show Features" switch from the listing pages, reused wherever listing trip
 *  cards appear so the feature rows can be hidden the same way everywhere. */
export default function FeaturesToggle({ checked, onChange, className, label = "Show Features" }: Props) {
  return (
    <ToggleSwitch
      checked={checked}
      onChange={onChange}
      label={label}
      className={`ftog${className ? ` ${className}` : ""}`}
      labelClassName="ftog-label"
      imgClassName="ftog-switch"
      tapSound
    />
  );
}
