import { useEffect, useState } from "react";
import "./CoTravellerSheet.css";

const A = "/figma/booking/";
const M = "/figma/my-booking/";

export interface CoTravellerData {
  firstName: string;
  middleName: string;
  lastName: string;
  gender: string;
  dob: string;
  whatsapp: string;
  altNumber: string;
  email: string;
  addr1: string;
  addr2: string;
  country: string;
  pincode: string;
  city: string;
  stateName: string;
  aadhaar: string;
  passportNo: string;
  passportValid: string;
}

interface CoTravellerSheetProps {
  isOpen: boolean;
  /** 1-based position, used in the header ("Co-Traveller1: …"). */
  index: number;
  onClose: () => void;
  onSave: (data: CoTravellerData) => void;
}

const EMPTY: CoTravellerData = {
  firstName: "",
  middleName: "",
  lastName: "",
  gender: "",
  dob: "",
  whatsapp: "",
  altNumber: "",
  email: "",
  addr1: "",
  addr2: "",
  country: "",
  pincode: "",
  city: "",
  stateName: "",
  aadhaar: "",
  passportNo: "",
  passportValid: "",
};

const REQUIRED: (keyof CoTravellerData)[] = [
  "firstName",
  "gender",
  "dob",
  "whatsapp",
  "email",
  "addr1",
  "country",
  "pincode",
  "city",
  "stateName",
  "aadhaar",
  "passportNo",
];

export default function CoTravellerSheet({
  isOpen,
  index,
  onClose,
  onSave,
}: CoTravellerSheetProps) {
  const [hasOpened, setHasOpened] = useState(false);
  const [form, setForm] = useState<CoTravellerData>(EMPTY);
  const [errors, setErrors] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (isOpen) setHasOpened(true);
  }, [isOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Reset the form each time the sheet is freshly opened.
  useEffect(() => {
    if (isOpen) {
      setForm(EMPTY);
      setErrors(new Set());
    }
  }, [isOpen]);

  if (!hasOpened) return null;

  const set = (key: keyof CoTravellerData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const errCls = (key: string) => (errors.has(key) ? " cts-input--error" : "");

  const handleSave = () => {
    const missing = new Set(
      REQUIRED.filter((k) => !form[k] || !form[k].trim())
    );
    setErrors(missing);
    if (missing.size > 0) {
      const first = REQUIRED.find((k) => missing.has(k));
      if (first) document.getElementById(`cts-${first}`)?.focus();
      return;
    }
    onSave(form);
  };

  return (
    <>
      <div
        className={`cts-overlay${isOpen ? " cts-overlay--visible" : ""}`}
        onClick={onClose}
        aria-hidden
      />

      <div
        className={`cts${isOpen ? " cts--open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Add Co-Traveller"
      >
        <div className="cts-body">
          {/* Header */}
          <div className="cts-head">
            <img src={`${A}icon-person2.svg`} width={20} height={20} alt="" aria-hidden />
            <span>Co-Traveller{index}: Personal Details</span>
          </div>

          {/* Personal details */}
          <div className="cts-fields">
            <div className="cts-field">
              <input id="cts-firstName" className={`cts-input${errCls("firstName")}`} placeholder=" " value={form.firstName} onChange={set("firstName")} />
              <label htmlFor="cts-firstName" className="cts-label">First Name*</label>
            </div>
            <div className="cts-field">
              <input id="cts-middleName" className="cts-input" placeholder=" " value={form.middleName} onChange={set("middleName")} />
              <label htmlFor="cts-middleName" className="cts-label">Middle Name</label>
            </div>
            <div className="cts-field">
              <input id="cts-lastName" className="cts-input" placeholder=" " value={form.lastName} onChange={set("lastName")} />
              <label htmlFor="cts-lastName" className="cts-label">Last Name</label>
            </div>

            <div className="cts-field">
              <select id="cts-gender" className={`cts-input cts-select${errCls("gender")}`} value={form.gender} onChange={set("gender")}>
                <option value="" disabled hidden></option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </select>
              <label htmlFor="cts-gender" className="cts-label">Gender*</label>
              <span className="cts-field-icon" aria-hidden>
                <img src={`${A}icon-arrow-drop.svg`} width={24} height={24} alt="" />
              </span>
            </div>

            <div className="cts-field">
              <input id="cts-dob" className={`cts-input${errCls("dob")}`} placeholder="DD-MM-YYYY" value={form.dob} onChange={set("dob")} />
              <label htmlFor="cts-dob" className="cts-label">Date Of Birth*</label>
              <span className="cts-field-icon" aria-hidden>
                <img src={`${A}icon-calendar-field.svg`} width={16} height={16} alt="" />
              </span>
            </div>

            {/* WhatsApp */}
            <div className="cts-phone">
              <button className="cts-phone-code" type="button">
                <span>IN +91</span>
                <img src={`${A}icon-chevron-down.svg`} width={8} height={6} alt="" aria-hidden />
              </button>
              <div className="cts-field cts-field--grow">
                <input id="cts-whatsapp" className={`cts-input${errCls("whatsapp")}`} inputMode="tel" placeholder=" " value={form.whatsapp} onChange={set("whatsapp")} />
                <label htmlFor="cts-whatsapp" className="cts-label">WhatsApp Number*</label>
                <span className="cts-field-icon" aria-hidden>
                  <img src={`${M}icon-whatsapp-check.svg`} width={16} height={16} alt="" />
                </span>
              </div>
            </div>

            {/* Alternate */}
            <div className="cts-phone">
              <button className="cts-phone-code" type="button">
                <span>IN +91</span>
                <img src={`${A}icon-chevron-down.svg`} width={8} height={6} alt="" aria-hidden />
              </button>
              <div className="cts-field cts-field--grow">
                <input id="cts-altNumber" className="cts-input" inputMode="tel" placeholder=" " value={form.altNumber} onChange={set("altNumber")} />
                <label htmlFor="cts-altNumber" className="cts-label">Alternate Number (optional)</label>
              </div>
            </div>

            <div className="cts-field">
              <input id="cts-email" className={`cts-input${errCls("email")}`} type="email" placeholder=" " value={form.email} onChange={set("email")} />
              <label htmlFor="cts-email" className="cts-label">Email address*</label>
            </div>

            <div className="cts-field-group">
              <div className="cts-field">
                <input id="cts-addr1" className={`cts-input${errCls("addr1")}`} placeholder=" " value={form.addr1} onChange={set("addr1")} />
                <label htmlFor="cts-addr1" className="cts-label">Address Line 1</label>
              </div>
              <div className="cts-hint">
                <img src={`${A}icon-info-grey.svg`} width={13} height={13} alt="" aria-hidden />
                <span>Address is required for invoice generation.</span>
              </div>
            </div>

            <div className="cts-field">
              <input id="cts-addr2" className="cts-input" placeholder=" " value={form.addr2} onChange={set("addr2")} />
              <label htmlFor="cts-addr2" className="cts-label">Address Line 2</label>
            </div>

            <div className="cts-row2">
              <div className="cts-field">
                <input id="cts-country" className={`cts-input${errCls("country")}`} placeholder=" " value={form.country} onChange={set("country")} />
                <label htmlFor="cts-country" className="cts-label">Country*</label>
              </div>
              <div className="cts-field">
                <input id="cts-pincode" className={`cts-input${errCls("pincode")}`} placeholder=" " value={form.pincode} onChange={set("pincode")} />
                <label htmlFor="cts-pincode" className="cts-label">Pin Code*</label>
              </div>
            </div>

            <div className="cts-row2">
              <div className="cts-field">
                <input id="cts-city" className={`cts-input${errCls("city")}`} placeholder=" " value={form.city} onChange={set("city")} />
                <label htmlFor="cts-city" className="cts-label">City*</label>
              </div>
              <div className="cts-field">
                <input id="cts-stateName" className={`cts-input${errCls("stateName")}`} placeholder=" " value={form.stateName} onChange={set("stateName")} />
                <label htmlFor="cts-stateName" className="cts-label">State*</label>
              </div>
            </div>
          </div>

          <div className="cts-strip" aria-hidden />

          {/* Aadhaar */}
          <div className="cts-doc">
            <p className="cts-doc-title">Aadhaar Card</p>
            <div className="cts-field">
              <input id="cts-aadhaar" className={`cts-input cts-input--placeholder${errCls("aadhaar")}`} placeholder="Aadhaar Number*" value={form.aadhaar} onChange={set("aadhaar")} />
            </div>
            <div className="cts-row2">
              <button className="cts-upload" type="button">
                <span>Upload Aadhaar Front*</span>
                <img src={`${M}icon-upload.svg`} width={20} height={20} alt="" aria-hidden />
              </button>
              <button className="cts-upload" type="button">
                <span>Upload Aadhaar Back*</span>
                <img src={`${M}icon-upload.svg`} width={20} height={20} alt="" aria-hidden />
              </button>
            </div>
          </div>

          {/* Passport */}
          <div className="cts-doc">
            <p className="cts-doc-title">Passport</p>
            <div className="cts-tag">
              <img src={`${A}icon-info-yellow.svg`} width={16} height={16} alt="" aria-hidden />
              <p>Minimum passport validity upto 3rd January 2027.</p>
            </div>
            <div className="cts-row2">
              <div className="cts-field">
                <input id="cts-passportNo" className={`cts-input cts-input--placeholder${errCls("passportNo")}`} placeholder="Passport Number*" value={form.passportNo} onChange={set("passportNo")} />
              </div>
              <div className="cts-field">
                <input id="cts-passportValid" className="cts-input cts-input--placeholder" placeholder="Passport Valid Upto*" value={form.passportValid} onChange={set("passportValid")} />
                <span className="cts-field-icon" aria-hidden>
                  <img src={`${A}icon-calendar-field.svg`} width={16} height={16} alt="" />
                </span>
              </div>
            </div>
            <button className="cts-upload cts-upload--full" type="button">
              <span>Upload Passport Front*</span>
              <img src={`${M}icon-upload.svg`} width={20} height={20} alt="" aria-hidden />
            </button>
          </div>
        </div>

        {/* CTA */}
        <div className="cts-cta">
          <button className="cts-cta-cancel" type="button" onClick={onClose}>Cancel</button>
          <button className="cts-cta-save" type="button" onClick={handleSave}>Save Details</button>
        </div>
      </div>
    </>
  );
}
