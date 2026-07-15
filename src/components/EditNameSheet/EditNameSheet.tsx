import { useState, useEffect } from "react";
import "./EditNameSheet.css";

interface EditNameSheetProps {
  isOpen: boolean;
  onClose: () => void;
  initialName?: string;
}

export default function EditNameSheet({ isOpen, onClose, initialName = "" }: EditNameSheetProps) {
  const [hasOpened, setHasOpened] = useState(false);
  useEffect(() => { if (isOpen) setHasOpened(true); }, [isOpen]);
  if (!hasOpened) return null;
  const [name, setName] = useState(initialName);

  useEffect(() => {
    if (isOpen) setName(initialName);
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen, initialName]);

  return (
    <>
      <div className={`ens-overlay${isOpen ? " ens-overlay--visible" : ""}`} onClick={onClose} aria-hidden />
      <div className={`ens${isOpen ? " ens--open" : ""}`} role="dialog" aria-modal aria-label="Edit name">
        <button className="ens-close" type="button" onClick={onClose} aria-label="Close">
          <img src="/figma/profile/social-icon-close.svg" width={18} height={18} alt="" aria-hidden />
        </button>
        <div className="ens-card">
          <p className="ens-label">Name</p>
          <input
            className="ens-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            autoComplete="name"
          />
          <button className="ens-save" type="button" onClick={onClose}>
            Save
          </button>
        </div>
      </div>
    </>
  );
}
