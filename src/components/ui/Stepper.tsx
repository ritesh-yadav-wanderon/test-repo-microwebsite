const A = "/figma/booking/";

/**
 * The −/+ traveller counter from the booking screens. Mobile and desktop only
 * differ in icon size and class prefix.
 */
export interface StepperProps {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  /** Class prefix, e.g. "bkg" or "dbk" — yields `bkg-stepper`, `bkg-step-btn`. */
  classPrefix: string;
  /** Icon box size; the two screens ship different sizes. */
  iconSize?: number | { minus: number; plus: number };
  /** Grey out a button once the value hits that bound (desktop styles this). */
  disableAtBounds?: boolean;
  decreaseLabel: string;
  increaseLabel: string;
}

export default function Stepper({
  value,
  onChange,
  min = 1,
  max = Number.MAX_SAFE_INTEGER,
  classPrefix,
  iconSize = 20,
  disableAtBounds = false,
  decreaseLabel,
  increaseLabel,
}: StepperProps) {
  const minus = typeof iconSize === "number" ? iconSize : iconSize.minus;
  const plus = typeof iconSize === "number" ? iconSize : iconSize.plus;

  return (
    <div className={`${classPrefix}-stepper`}>
      <button
        className={`${classPrefix}-step-btn`}
        type="button"
        aria-label={decreaseLabel}
        disabled={disableAtBounds && value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
      >
        <img src={`${A}icon-minus.svg`} width={minus} height={minus} alt="" aria-hidden />
      </button>
      <span className={`${classPrefix}-step-count`}>{value}</span>
      <button
        className={`${classPrefix}-step-btn`}
        type="button"
        aria-label={increaseLabel}
        disabled={disableAtBounds && value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
      >
        <img src={`${A}icon-plus.svg`} width={plus} height={plus} alt="" aria-hidden />
      </button>
    </div>
  );
}
