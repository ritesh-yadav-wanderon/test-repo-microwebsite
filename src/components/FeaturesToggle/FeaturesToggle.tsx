import ToggleSwitch from "@/components/ui/ToggleSwitch";
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
    <ToggleSwitch
      checked={checked}
      onChange={onChange}
      label="Show Features"
      className={`ftog${className ? ` ${className}` : ""}`}
      labelClassName="ftog-label"
      imgClassName="ftog-switch"
      tapSound
    />
  );
}
