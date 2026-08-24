import type { ReactNode } from "react";
import Checkbox from "./Checkbox";

/**
 * A label row on the booking screens: optional leading icon, a label (with an
 * optional price pushed to the right) and a trailing checkbox. The whole row is
 * a `<label>`, so tapping anywhere toggles the box.
 */
export interface OptionRowProps {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: ReactNode;
  price?: ReactNode;
  icon?: ReactNode;
  /** Class prefix for the row's elements, e.g. "bkg-option" or "dbk-option". */
  classPrefix: string;
  /** Class for the leading icon wrapper, which differs between the two screens. */
  iconClassName?: string;
  checkboxClassName: string;
}

export default function OptionRow({
  checked,
  onChange,
  label,
  price,
  icon,
  classPrefix,
  iconClassName,
  checkboxClassName,
}: OptionRowProps) {
  return (
    <label className={classPrefix}>
      {icon && <span className={iconClassName ?? `${classPrefix}-icon`}>{icon}</span>}
      <span className={`${classPrefix}-label${price ? ` ${classPrefix}-label--between` : ""}`}>
        <span>{label}</span>
        {price && <span className={`${classPrefix}-price ${classPrefix}-price--dark`}>{price}</span>}
      </span>
      <Checkbox checked={checked} onChange={onChange} className={checkboxClassName} />
    </label>
  );
}
