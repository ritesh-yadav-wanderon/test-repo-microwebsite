import type { ChangeEvent } from "react";

/** Controlled checkbox input. Every tick box in the app styles this element. */
export interface CheckboxProps {
  checked: boolean;
  onChange: (next: boolean) => void;
  className?: string;
  ariaLabel?: string;
  disabled?: boolean;
}

export default function Checkbox({ checked, onChange, className, ariaLabel, disabled }: CheckboxProps) {
  return (
    <input
      type="checkbox"
      className={className}
      checked={checked}
      disabled={disabled}
      aria-label={ariaLabel}
      onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.checked)}
    />
  );
}
