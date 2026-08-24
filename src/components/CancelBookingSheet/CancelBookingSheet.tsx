import { useEffect, useState } from "react";
import Checkbox from "@/components/ui/Checkbox";
import Sheet from "@/components/ui/Sheet";
import "./CancelBookingSheet.css";

const C = "/figma/cancel/";

interface CancelBookingSheetProps {
  isOpen: boolean;
  onClose: () => void;
  /** Called when the user confirms cancellation (only after agreeing to the policy). */
  onRequestCancellation?: () => void;
  /** Called when the user taps "Contact Support". */
  onContactSupport?: () => void;
}

export default function CancelBookingSheet({
  isOpen,
  onClose,
  onRequestCancellation,
  onContactSupport,
}: CancelBookingSheetProps) {
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    if (isOpen) setAgreed(false);
  }, [isOpen]);

  return (
    <Sheet
      isOpen={isOpen}
      onClose={onClose}
      overlayClassName="cbs-overlay"
      overlayOpenModifier="--visible"
      overlayAsSibling
      panelClassName="cbs"
      ariaLabel="Cancel Booking"
    >
      <button className="cbs-close" type="button" onClick={onClose} aria-label="Close">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path d="M1 1L15 15M15 1L1 15" stroke="#202020" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      <div className="cbs-head">
        <div className="cbs-emoji">
          <img src={`${C}emoji-sad.png`} alt="" aria-hidden />
        </div>
        <p className="cbs-title">We are sorry to see you cancel an adventure with us!</p>
      </div>

      <div className="cbs-actions">
        <label className="cbs-terms">
          <Checkbox checked={agreed} onChange={setAgreed} className="cbs-checkbox" />
          <span>
            I have read and agree with the terms and conditions of the{" "}
            <a
              href="#"
              className="cbs-link"
              onClick={(e) => e.preventDefault()}
            >
              Cancellation Policy.
            </a>
          </span>
        </label>

        <div className="cbs-buttons">
          <button
            className="cbs-btn cbs-btn--outline"
            type="button"
            disabled={!agreed}
            onClick={() => {
              onRequestCancellation?.();
              onClose();
            }}
          >
            Request Cancellation
          </button>
          <button
            className="cbs-btn cbs-btn--primary"
            type="button"
            onClick={() => {
              onContactSupport?.();
            }}
          >
            Contact Support
          </button>
        </div>
      </div>
    </Sheet>
  );
}
