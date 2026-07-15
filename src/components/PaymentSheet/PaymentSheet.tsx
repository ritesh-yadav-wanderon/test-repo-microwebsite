import { useState, useEffect } from "react";
import "./PaymentSheet.css";

const P = "/figma/payment/";
const A = "/figma/booking/";

interface PaymentSheetProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount?: string;
  payNowAmount?: string;
  dueAmount?: string;
  dueDate?: string;
  savedAmount?: string;
  onPay?: (option: PayOption) => void;
}

type PayOption = "later" | "full";

export default function PaymentSheet({
  isOpen,
  onClose,
  totalAmount = "1,09,720",
  payNowAmount = "30,000",
  dueAmount = "79,720",
  dueDate = "8th August 2026",
  savedAmount = "5000",
  onPay,
}: PaymentSheetProps) {
  const [hasOpened, setHasOpened] = useState(false);
  const [selected, setSelected] = useState<PayOption>("full");

  useEffect(() => {
    if (isOpen) setHasOpened(true);
  }, [isOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!hasOpened) return null;

  return (
    <div
      className={`psh-overlay${isOpen ? " psh-overlay--open" : ""}`}
      aria-hidden={!isOpen}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`psh-sheet${isOpen ? " psh-sheet--open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Payment options"
      >
        <div className="psh-body">
          {/* ── Option: Book now & pay later ── */}
          <div
            className={`psh-later${selected === "later" ? " psh-later--active" : ""}`}
          >
            <button
              className="psh-later-card"
              type="button"
              onClick={() => setSelected("later")}
            >
              <div className="psh-later-head">
                <img
                  src={selected === "later" ? `${P}radio-checked.svg` : `${P}radio-empty.svg`}
                  width={16}
                  height={16}
                  alt=""
                  aria-hidden
                />
                <span className="psh-later-title">
                  Book now &amp; pay remaining amount later
                </span>
              </div>

              <div className="psh-timeline">
                <div className="psh-timeline-rail" aria-hidden>
                  <span className="psh-rail-node">&#8377;</span>
                  <span className="psh-rail-line" />
                  <span className="psh-rail-node">&#8377;</span>
                </div>
                <div className="psh-timeline-rows">
                  <div className="psh-timeline-row">
                    <span>Pay to Book</span>
                    <span>&#8377; {payNowAmount}/-</span>
                  </div>
                  <div className="psh-timeline-row">
                    <span>Pay due amount before {dueDate}</span>
                    <span>&#8377; {dueAmount}/-</span>
                  </div>
                </div>
              </div>
            </button>

            <div className="psh-later-foot">
              <span>No hidden charges</span>
              <span className="psh-foot-dot" aria-hidden />
              <span>No card required</span>
            </div>
          </div>

          {/* ── Option: Pay full amount now ── */}
          <button
            className={`psh-full${selected === "full" ? " psh-full--active" : ""}`}
            type="button"
            onClick={() => setSelected("full")}
          >
            <img
              src={selected === "full" ? `${P}radio-checked.svg` : `${P}radio-empty.svg`}
              width={16}
              height={16}
              alt=""
              aria-hidden
            />
            <div className="psh-full-text">
              <span className="psh-full-title">Pay full amount now</span>
              <span className="psh-full-sub">One time payment</span>
            </div>
            <span className="psh-full-amount">&#8377; {totalAmount}/-</span>
          </button>
        </div>

        {/* ── CTA ── */}
        <div className="psh-cta">
          <div className="psh-cta-tags">
            <img src={`${A}icon-person.svg`} width={24} height={24} alt="" aria-hidden />
            <span className="psh-cta-saved-amt">&#8377;{savedAmount}/-</span>
            <span className="psh-cta-saved-text">saved on this trip.</span>
          </div>
          <div className="psh-cta-bar">
            <div className="psh-cta-price-col">
              <span className="psh-cta-price">&#8377; {totalAmount}/-</span>
              <button className="psh-cta-fee" type="button">
                <span>+</span>
                <img src={`${A}icon-info-sm.svg`} width={16} height={16} alt="" aria-hidden />
                <span>Convenience fee</span>
              </button>
            </div>
            <button
              className="psh-swipe"
              type="button"
              onClick={() => onPay?.(selected)}
            >
              <span className="psh-swipe-badge">&#8377;</span>
              <span className="psh-swipe-label">Swipe to Pay</span>
              <img src={`${A}icon-arrow-right.svg`} width={30} height={30} alt="" aria-hidden />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
