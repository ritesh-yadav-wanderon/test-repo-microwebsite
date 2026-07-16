import { useState } from "react";
import "./Voucher.css";

const A = "/figma/voucher/";

export interface AppliedVoucher {
  code: string;
  amount: number;
}

interface VoucherProps {
  className?: string;
  /** Discount granted when a coupon is applied (used in the "Congrats!" message). */
  discountAmount?: number;
  /** Fired when a coupon is successfully applied. */
  onApply?: (voucher: AppliedVoucher) => void;
  /** Fired when an applied coupon is removed. */
  onRemove?: () => void;
}

export default function Voucher({
  className,
  discountAmount = 1500,
  onApply,
  onRemove,
}: VoucherProps) {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [applied, setApplied] = useState<AppliedVoucher | null>(null);

  const handleApply = () => {
    const trimmed = code.trim();
    if (!trimmed) return;
    const voucher = { code: trimmed.toUpperCase(), amount: discountAmount };
    setApplied(voucher);
    setCode("");
    setOpen(false);
    onApply?.(voucher);
  };

  const handleRemove = () => {
    setApplied(null);
    setOpen(false);
    onRemove?.();
  };

  const rootClass = `vch${className ? ` ${className}` : ""}`;

  // ── Applied (redeemed coupon) ──────────────────────────────
  if (applied) {
    return (
      <div className={`${rootClass} vch--filled`}>
        <div className="vch-applied">
          <div className="vch-applied-info">
            <div className="vch-applied-head">
              <img
                className="vch-verified"
                src={`${A}verified.svg`}
                width={24}
                height={24}
                alt=""
                aria-hidden
              />
              <span className="vch-applied-code">
                <span>Voucher</span>
                <span className="vch-applied-sep">|</span>
                <span>{applied.code}</span>
              </span>
            </div>
            <p className="vch-applied-msg">
              Congrats! You unlocked discount worth &#8377; {applied.amount}/-
            </p>
          </div>
          <button className="vch-remove" type="button" onClick={handleRemove}>
            Remove
          </button>
        </div>
      </div>
    );
  }

  // ── Expanded (add coupon) ──────────────────────────────────
  if (open) {
    return (
      <div className={`${rootClass} vch--filled`}>
        <button
          className="vch-head"
          type="button"
          onClick={() => setOpen(false)}
          aria-expanded
        >
          <span className="vch-title">Add Vouchers</span>
          <span className="vch-caret vch-caret--open" aria-hidden>
            <img src={`${A}arrow-drop.svg`} width={24} height={24} alt="" />
          </span>
        </button>

        <div className="vch-input-row">
          <input
            className="vch-input"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleApply();
              }
            }}
            placeholder="Enter Coupon Code"
            aria-label="Enter coupon code"
          />
          <button className="vch-apply" type="button" onClick={handleApply}>
            Apply
          </button>
        </div>
      </div>
    );
  }

  // ── Collapsed (default) ────────────────────────────────────
  return (
    <button
      className={`${rootClass} vch-collapsed`}
      type="button"
      onClick={() => setOpen(true)}
      aria-expanded={false}
    >
      <span className="vch-title">Add Vouchers</span>
      <span className="vch-caret" aria-hidden>
        <img src={`${A}arrow-drop.svg`} width={24} height={24} alt="" />
      </span>
    </button>
  );
}
