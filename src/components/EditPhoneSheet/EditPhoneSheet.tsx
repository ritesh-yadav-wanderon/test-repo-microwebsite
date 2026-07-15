import { useState, useEffect } from "react";
import "./EditPhoneSheet.css";

const P = "/figma/profile/";

interface EditPhoneSheetProps {
  isOpen: boolean;
  onClose: () => void;
  initialPhone?: string;
}

export default function EditPhoneSheet({ isOpen, onClose, initialPhone = "" }: EditPhoneSheetProps) {
  const [hasOpened, setHasOpened] = useState(false);
  useEffect(() => { if (isOpen) setHasOpened(true); }, [isOpen]);
  if (!hasOpened) return null;
  const [phone, setPhone] = useState(initialPhone);

  useEffect(() => {
    if (isOpen) setPhone(initialPhone);
  }, [isOpen, initialPhone]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleRequestOtp = () => {
    // TODO: call OTP API
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`eps-overlay${isOpen ? " eps-overlay--visible" : ""}`}
        onClick={onClose}
        aria-hidden
      />

      {/* Sheet */}
      <div
        className={`eps${isOpen ? " eps--open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Edit Mobile Number"
      >
        {/* Floating close button */}
        <button
          className="eps-close"
          type="button"
          onClick={onClose}
          aria-label="Close"
        >
          <img src={`${P}social-icon-close.svg`} alt="" width={18} height={18} aria-hidden />
        </button>

        {/* Inner card */}
        <div className="eps-card">
          <p className="eps-title">Edit Mobile Number</p>

          {/* Phone input row */}
          <div className="eps-phone-row">
            <div className="eps-country-code">+91</div>
            <input
              className="eps-phone-input"
              type="tel"
              inputMode="numeric"
              placeholder="7983065150"
              value={phone}
              onChange={e => setPhone(e.target.value.replace(/\D/g, ""))}
              maxLength={10}
              autoComplete="tel-national"
            />
          </div>

          {/* Disclaimer */}
          <p className="eps-disclaimer">
            *Verify OTP received on your registered mobile number to change email
          </p>

          {/* CTA */}
          <button
            className="eps-cta"
            type="button"
            onClick={handleRequestOtp}
          >
            Request OTP
          </button>
        </div>
      </div>
    </>
  );
}
