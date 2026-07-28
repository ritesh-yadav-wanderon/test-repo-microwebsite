import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { CoTravellerData } from "../CoTravellerSheet/CoTravellerSheet";
import CancelBookingSheet from "../CancelBookingSheet/CancelBookingSheet";
import ProfileWatermark from "./ProfileWatermark";
import { useBooking } from "../../context/BookingContext";
import { BILL_ITEMS } from "../../data/bookingBill";
import { startTripPayment } from "../../api/payment";
import "./DesktopMyBooking.css";

const A = "/figma/booking/";
const MB = "/figma/my-booking/";
const PROF = "/figma/my-profile/";
const PAY = "/figma/payments/";
const CT = "/figma/co-travellers/";
/* Trip thumbnail from the Figma design (6219:25591) */
const TRIP_THUMB = "/figma/my-booking/trip-thumb.png";

const CITIES = ["3N Paris", "3N Amsterdam", "2N Berlin", "2N Prague"];

/** Sample primary-traveller values — same prefills the mobile KYC form uses. */
const PRIMARY_ROWS: Array<[string, string | string[]]> = [
  ["Name", "Mr. Shivam Trivedi"],
  ["Gender", "Male"],
  ["WhatsApp Number", "+91-9401269681"],
  ["Alternate Number", "-"],
  ["Email ID", "shivam.trivedi@wanderon.in"],
  ["Address", ["Building No. - 436, Phase- 4, Sector- 18", "Gurugram, Haryana, 122017"]],
  ["Aadhaar Number", "6785 XXXX XXXX"],
  ["Passport Number", "P3XXXXXXX"],
  ["Passport Valid upto", "01-01-2036"],
];

const TRANSACTIONS: { ref: string; amount: string; date: string }[] = [
  { ref: "50100200913470", amount: "\u20B9 4,00,000", date: "1 APR 2025" },
  { ref: "50100200913470", amount: "\u20B9 4,00,000", date: "1 APR 2025" },
];

const EMPTY_CO: CoTravellerData = {
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

/** Personal fields validated by the inline desktop co-traveller form. */
const CO_REQUIRED: (keyof CoTravellerData)[] = [
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
];

type TabKey = "kyc" | "co" | "payments";

export interface DesktopMyBookingData {
  tripTitle: string;
  tripName: string;
  travellerName: string;
  travelers: number;
  durationLabel: string;
  pickUp: string;
  drop: string;
  pickUpDate: string;
  dropDate: string;
  amountPaid: string;
  dueBalance: string;
}

interface DesktopMyBookingProps {
  data: DesktopMyBookingData;
  refId: string;
  initialTab?: TabKey;
  /** True when the user navigated here from the My Bookings list. */
  fromList?: boolean;
}

/** Desktop booking detail — "My Bookings / <ref>" (Figma 6219:25591). */
export default function DesktopMyBooking({
  data,
  refId,
  initialTab,
  fromList,
}: DesktopMyBookingProps) {
  const navigate = useNavigate();
  const { statusOf, requestCancellation } = useBooking();
  const bookingStatus = statusOf(refId);

  const [tab, setTab] = useState<TabKey>(initialTab ?? "kyc");
  const [coTravellers, setCoTravellers] = useState<CoTravellerData[]>([]);
  const [coFormOpen, setCoFormOpen] = useState(true);
  const [coForm, setCoForm] = useState<CoTravellerData>(EMPTY_CO);
  const [coErrors, setCoErrors] = useState<Set<string>>(new Set());
  const [cancelOpen, setCancelOpen] = useState(false);
  const [payLoading, setPayLoading] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

  const coPending = Math.max(0, data.travelers - 1 - coTravellers.length);

  const setCo =
    (key: keyof CoTravellerData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setCoForm((f) => ({ ...f, [key]: e.target.value }));

  const coErrCls = (key: string) => (coErrors.has(key) ? " dmb-input--error" : "");

  const saveCoTraveller = () => {
    const missing = new Set(CO_REQUIRED.filter((k) => !coForm[k] || !coForm[k].trim()));
    setCoErrors(missing);
    if (missing.size > 0) {
      const first = CO_REQUIRED.find((k) => missing.has(k));
      if (first) document.getElementById(`dmb-co-${first}`)?.focus();
      return;
    }
    const remaining = coPending - 1;
    setCoTravellers((list) => [...list, coForm]);
    setCoForm(EMPTY_CO);
    // Keep the form open while travellers are still pending.
    setCoFormOpen(remaining > 0);
  };

  const cancelCoForm = () => {
    setCoForm(EMPTY_CO);
    setCoErrors(new Set());
    setCoFormOpen(false);
  };
  const dueNum = Number(String(data.dueBalance).replace(/[^\d]/g, ""));
  const hasDue = dueNum > 0;

  // Per design feedback, the desktop back button always lands on the profile page.
  const goBack = () => navigate("/profile");

  const goToCancellation = () =>
    navigate(`/bookings/${refId}/cancellation`, {
      state: {
        tripTitle: data.tripTitle,
        tripDuration: `${data.pickUpDate} - ${data.dropDate} | ${data.durationLabel}`,
        pickUp: data.pickUp,
        pickUpDate: data.pickUpDate,
        drop: data.drop,
        dropDate: data.dropDate,
        travelers: data.travelers,
        amountPaid: data.amountPaid,
        dueBalance: data.dueBalance,
        coTravellers,
      },
    });

  /** Pay the full due balance straight through Razorpay (no bottom sheet). */
  const payDueBalance = () => {
    if (!hasDue || payLoading) return;
    setPayError(null);
    startTripPayment({
      bookingReferenceId: refId,
      amount: dueNum,
      description: data.tripName,
      prefill: { name: data.travellerName, email: "shivam.trivedi@wanderon.in" },
      setLoading: setPayLoading,
      onSuccess: (result) => {
        const r = (result || {}) as { amountPaid?: string; dueBalance?: string };
        const now = new Date();
        const paidAt =
          now.toLocaleDateString("en-GB", { day: "numeric", month: "short" }) +
          ", " +
          now.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          });
        // Buttonless confirmation, then back to the Payments tab of this page.
        navigate(`/bookings/${refId}/success`, {
          replace: true,
          state: {
            ref: refId,
            travellerName: data.travellerName,
            amountPaid: r.amountPaid ?? data.dueBalance,
            dueBalance: r.dueBalance ?? "0",
            paymentMethod: "UPI",
            paidAt,
            tripTitle: data.tripTitle,
            startDate: data.pickUpDate,
            durationLabel: data.durationLabel,
            travelers: data.travelers,
            showCta: false,
            nextPath: `/bookings/${refId}`,
            nextState: {
              ...data,
              ref: refId,
              dueBalance: r.dueBalance ?? "0",
              initialTab: "payments",
              from: fromList ? "list" : undefined,
            },
          },
        });
      },
      onError: (err) => setPayError(err.message),
    });
  };

  return (
    <div className="dmb">
      {/* ── Header ─────────────────────────────────────────── */}
      <header className="dmb-header">
        <button className="dmb-header-back" type="button" aria-label="Back" onClick={goBack}>
          <img src={`${A}icon-arrow-back.svg`} width={24} height={24} alt="" aria-hidden />
        </button>
        <span className="dmb-header-title">My Bookings / {refId}</span>
      </header>

      <div className="dmb-body">
        {/* ── Left column ──────────────────────────────────── */}
        <div className="dmb-main">
          <nav className="dmb-tabs" aria-label="Booking sections">
            {(
              [
                { key: "kyc", label: "KYC Details" },
                { key: "co", label: "Co-Travellers" },
                { key: "payments", label: "Payments Details" },
              ] as { key: TabKey; label: string }[]
            ).map((t) => (
              <button
                key={t.key}
                type="button"
                className={`dmb-tab${tab === t.key ? " dmb-tab--active" : ""}`}
                onClick={() => setTab(t.key)}
              >
                {t.label}
              </button>
            ))}
          </nav>

          {/* Trip + primary traveller card is shared by the KYC and Payments tabs */}
          {(tab === "kyc" || tab === "payments") && (
            <section className="dmb-card">
              {/* Trip package summary */}
              <div className="dmb-package">
                <img className="dmb-package-thumb" src={TRIP_THUMB} alt="" loading="lazy" />
                <div className="dmb-package-info">
                  <p className="dmb-package-name">{data.tripTitle}</p>

                  <div className="dmb-package-duration">
                    <div className="dmb-dur-label">
                      <img src={`${A}icon-calendar.svg`} width={16} height={16} alt="" aria-hidden />
                      <span>Trip Duration:</span>
                    </div>
                    <div className="dmb-dur-values">
                      <span>
                        {data.pickUpDate} - {data.dropDate}
                      </span>
                      <span>{data.durationLabel}</span>
                    </div>
                  </div>

                  <div className="dmb-package-pd">
                    <div className="dmb-pd-col">
                      <div className="dmb-pd-label">
                        <img src={`${A}icon-location.svg`} width={11} height={12} alt="" aria-hidden />
                        <span>Pick Up</span>
                      </div>
                      <p className="dmb-pd-place">{data.pickUp}</p>
                    </div>
                    <div className="dmb-pd-col dmb-pd-col--right">
                      <div className="dmb-pd-label">
                        <img src={`${A}icon-location.svg`} width={11} height={12} alt="" aria-hidden />
                        <span>Drop</span>
                      </div>
                      <p className="dmb-pd-place">{data.drop}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="dmb-cities">
                {CITIES.map((c, i) => (
                  <span className="dmb-city" key={c}>
                    {i > 0 && <span className="dmb-city-dot" aria-hidden />}
                    {c}
                  </span>
                ))}
              </div>

              {/* Primary traveller (read-only) */}
              <div className="dmb-primary">
                <div className="dmb-primary-head">
                  <span className="dmb-primary-title">Primary Traveller</span>
                  <button className="dmb-primary-edit" type="button" aria-label="Edit KYC details">
                    <img src={`${PROF}icon-edit.svg`} width={24} height={24} alt="" aria-hidden />
                  </button>
                </div>

                <div className="dmb-rows">
                  {PRIMARY_ROWS.map(([label, value]) => (
                    <div className="dmb-row" key={label}>
                      <span className="dmb-row-label">{label}</span>
                      {Array.isArray(value) ? (
                        <span className="dmb-row-value dmb-row-value--multiline">
                          {value.map((line) => (
                            <span key={line}>{line}</span>
                          ))}
                        </span>
                      ) : (
                        <span className="dmb-row-value">{value}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {tab === "co" && (
            <>
              <section className="dmb-card dmb-card--co">
                <div className="dmb-co-head">
                  <span className="dmb-co-chip">Co-Travellers</span>
                  <span className="dmb-co-pending">{coPending} pending</span>
                </div>

                {coFormOpen && (
                  <div className="dmb-co-formtitle">
                    <img src={`${A}icon-person2.svg`} width={20} height={20} alt="" aria-hidden />
                    <span>Co-Traveller{coTravellers.length + 1}: Personal Details</span>
                  </div>
                )}

                {coTravellers.map((c, i) => (
                  <div className="dmb-co-item" key={i}>
                    <span>{[c.firstName, c.middleName, c.lastName].filter(Boolean).join(" ")}</span>
                    <img src={`${CT}icon-view.svg`} width={20} height={20} alt="" aria-hidden />
                  </div>
                ))}

                {coFormOpen && (
                  <>
                    <div className="dmb-co-form">
                      <div className="dmb-form-row2">
                        <div className="dmb-field">
                          <input id="dmb-co-firstName" className={`dmb-input${coErrCls("firstName")}`} placeholder=" " value={coForm.firstName} onChange={setCo("firstName")} />
                          <label htmlFor="dmb-co-firstName" className="dmb-flabel">First Name*</label>
                        </div>
                        <div className="dmb-field">
                          <input id="dmb-co-middleName" className="dmb-input" placeholder=" " value={coForm.middleName} onChange={setCo("middleName")} />
                          <label htmlFor="dmb-co-middleName" className="dmb-flabel">Middle Name</label>
                        </div>
                      </div>

                      <div className="dmb-field">
                        <input id="dmb-co-lastName" className="dmb-input" placeholder=" " value={coForm.lastName} onChange={setCo("lastName")} />
                        <label htmlFor="dmb-co-lastName" className="dmb-flabel">Last Name</label>
                      </div>

                      <div className="dmb-form-row2">
                        <div className="dmb-field">
                          <select id="dmb-co-gender" className={`dmb-input dmb-select${coErrCls("gender")}`} value={coForm.gender} onChange={setCo("gender")} required>
                            <option value="" disabled hidden></option>
                            <option value="female">Female</option>
                            <option value="male">Male</option>
                            <option value="other">Other</option>
                          </select>
                          <label htmlFor="dmb-co-gender" className="dmb-flabel">Gender*</label>
                          <span className="dmb-field-icon" aria-hidden>
                            <img src={`${A}icon-arrow-drop.svg`} width={24} height={24} alt="" />
                          </span>
                        </div>
                        <div className="dmb-field">
                          <input id="dmb-co-dob" className={`dmb-input${coErrCls("dob")}`} placeholder="DD-MM-YYYY" value={coForm.dob} onChange={setCo("dob")} />
                          <label htmlFor="dmb-co-dob" className="dmb-flabel dmb-flabel--fixed">Date Of Birth*</label>
                          <span className="dmb-field-icon" aria-hidden>
                            <img src={`${A}icon-calendar-field.svg`} width={16} height={16} alt="" />
                          </span>
                        </div>
                      </div>

                      <div className="dmb-phone">
                        <button className="dmb-phone-code" type="button">
                          <span>IN +91</span>
                          <img src={`${A}icon-chevron-down.svg`} width={8} height={6} alt="" aria-hidden />
                        </button>
                        <div className="dmb-field dmb-field--grow">
                          <input id="dmb-co-whatsapp" className={`dmb-input${coErrCls("whatsapp")}`} inputMode="tel" placeholder=" " value={coForm.whatsapp} onChange={setCo("whatsapp")} />
                          <label htmlFor="dmb-co-whatsapp" className="dmb-flabel">WhatsApp Number*</label>
                          <span className="dmb-field-icon" aria-hidden>
                            <img src={`${MB}icon-whatsapp-check.svg`} width={16} height={16} alt="" />
                          </span>
                        </div>
                      </div>

                      <div className="dmb-phone">
                        <button className="dmb-phone-code" type="button">
                          <span>IN +91</span>
                          <img src={`${A}icon-chevron-down.svg`} width={8} height={6} alt="" aria-hidden />
                        </button>
                        <div className="dmb-field dmb-field--grow">
                          <input id="dmb-co-altNumber" className="dmb-input" inputMode="tel" placeholder=" " value={coForm.altNumber} onChange={setCo("altNumber")} />
                          <label htmlFor="dmb-co-altNumber" className="dmb-flabel">Alternate Number (optional)</label>
                        </div>
                      </div>

                      <div className="dmb-field">
                        <input id="dmb-co-email" className={`dmb-input${coErrCls("email")}`} type="email" placeholder=" " value={coForm.email} onChange={setCo("email")} />
                        <label htmlFor="dmb-co-email" className="dmb-flabel">Email address*</label>
                      </div>

                      <div className="dmb-field-group">
                        <div className="dmb-field">
                          <input id="dmb-co-addr1" className={`dmb-input${coErrCls("addr1")}`} placeholder=" " value={coForm.addr1} onChange={setCo("addr1")} />
                          <label htmlFor="dmb-co-addr1" className="dmb-flabel">Address Line 1</label>
                        </div>
                        <div className="dmb-form-hint">
                          <img src={`${A}icon-info-grey.svg`} width={13} height={13} alt="" aria-hidden />
                          <span>Address is required for invoice generation.</span>
                        </div>
                      </div>

                      <div className="dmb-field">
                        <input id="dmb-co-addr2" className="dmb-input" placeholder=" " value={coForm.addr2} onChange={setCo("addr2")} />
                        <label htmlFor="dmb-co-addr2" className="dmb-flabel">Address Line 2</label>
                      </div>

                      <div className="dmb-form-row2">
                        <div className="dmb-field">
                          <input id="dmb-co-country" className={`dmb-input${coErrCls("country")}`} placeholder=" " value={coForm.country} onChange={setCo("country")} />
                          <label htmlFor="dmb-co-country" className="dmb-flabel">Country*</label>
                        </div>
                        <div className="dmb-field">
                          <input id="dmb-co-pincode" className={`dmb-input${coErrCls("pincode")}`} placeholder=" " value={coForm.pincode} onChange={setCo("pincode")} />
                          <label htmlFor="dmb-co-pincode" className="dmb-flabel">Pin Code*</label>
                        </div>
                      </div>

                      <div className="dmb-form-row2">
                        <div className="dmb-field">
                          <input id="dmb-co-city" className={`dmb-input${coErrCls("city")}`} placeholder=" " value={coForm.city} onChange={setCo("city")} />
                          <label htmlFor="dmb-co-city" className="dmb-flabel">City*</label>
                        </div>
                        <div className="dmb-field">
                          <input id="dmb-co-stateName" className={`dmb-input${coErrCls("stateName")}`} placeholder=" " value={coForm.stateName} onChange={setCo("stateName")} />
                          <label htmlFor="dmb-co-stateName" className="dmb-flabel">State*</label>
                        </div>
                      </div>
                    </div>

                    {coErrors.size > 0 && (
                      <p className="dmb-form-error" role="alert">
                        Please fill the highlighted required fields.
                      </p>
                    )}

                    <div className="dmb-co-cta">
                      <button className="dmb-co-cancel" type="button" onClick={cancelCoForm}>
                        Cancel
                      </button>
                      <button className="dmb-co-save" type="button" onClick={saveCoTraveller}>
                        Save Details
                      </button>
                    </div>
                  </>
                )}
              </section>

              <button
                className="dmb-co-add"
                type="button"
                onClick={() => setCoFormOpen(true)}
              >
                <img src={`${CT}icon-plus.svg`} width={20} height={20} alt="" aria-hidden />
                <span>Add Co-Traveller</span>
              </button>
            </>
          )}

          {tab === "payments" && (
            <section className="dmb-card dmb-card--payments">
              <div className="dmb-pay-section-head">
                <img src={`${PAY}icon-account-balance.svg`} width={16} height={16} alt="" aria-hidden />
                <span>Transactions</span>
              </div>
              <div className="dmb-txns">
                {TRANSACTIONS.map((t, i) => (
                  <button className="dmb-txn" type="button" key={i}>
                    <div className="dmb-txn-top">
                      <span className="dmb-txn-ref">Reference No. {t.ref}</span>
                      <span className="dmb-txn-amount">
                        {t.amount}
                        <img src={`${A}icon-arrow-drop.svg`} width={24} height={14} alt="" aria-hidden />
                      </span>
                    </div>
                    <span className="dmb-txn-date">{t.date}</span>
                  </button>
                ))}
              </div>

              <div className="dmb-pay-section-head dmb-pay-section-head--plain">
                <span>GST Details</span>
              </div>
              <div className="dmb-rows">
                <div className="dmb-row">
                  <span className="dmb-row-label">GST Number</span>
                  <span className="dmb-row-value">01236363569</span>
                </div>
                <div className="dmb-row">
                  <span className="dmb-row-label">Business Name</span>
                  <span className="dmb-row-value">WanderOn Experiences Pvt. ltd.</span>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* ── Right rail (sticky) ──────────────────────────── */}
        <aside className="dmb-rail">
          <div className="dmb-bill-card">
            <div className="dmb-bill-pill">
              <img src={`${A}icon-receipt.svg`} width={16} height={16} alt="" aria-hidden />
              <span>Bill Summary</span>
            </div>

            <div className="dmb-bill-rows">
              {BILL_ITEMS.map((it) => (
                <div className="dmb-bill-row" key={it.label}>
                  <span>{it.label}</span>
                  <span>{it.value}</span>
                </div>
              ))}
            </div>

            <div className="dmb-bill-divider" aria-hidden />

            <div className="dmb-bill-totals">
              <div className="dmb-bill-total-row">
                <span>Amount Paid:</span>
                <span>&#8377;{data.amountPaid}/-</span>
              </div>
              <div className="dmb-bill-total-row">
                <span>Balance Due:</span>
                <span>&#8377;{data.dueBalance}/-</span>
              </div>
            </div>

            {hasDue && (
              <>
                {payError && (
                  <p className="dmb-pay-error" role="alert">
                    {payError}
                  </p>
                )}
                <div className="dmb-bill-cta">
                  <div className="dmb-bill-price-col">
                    <span className="dmb-bill-price">&#8377;{data.dueBalance}/-</span>
                    <button className="dmb-bill-fee" type="button">
                      <span>+</span>
                      <img src={`${A}icon-info-sm.svg`} width={16} height={16} alt="" aria-hidden />
                      <span>Convenience fee</span>
                    </button>
                  </div>
                  <button
                    className="dmb-bill-pay"
                    type="button"
                    disabled={payLoading}
                    onClick={payDueBalance}
                  >
                    {payLoading ? "Processing…" : "Pay Due Balance"}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Rail extras per design: KYC shows the action buttons, Co-Travellers
              the share pill; Payments has the bill card only. */}
          {tab === "co" && (
            <>
              <div className="dmb-share-pill">
                <span className="dmb-share-label">Get Your Co-Travelers Onboard!</span>
                <button className="dmb-share-btn" type="button">
                  <img src={`${CT}icon-people-add.svg`} width={20} height={20} alt="" aria-hidden />
                  <span>Share</span>
                </button>
              </div>
              <div className="dmb-squad-note">
                <p>Get your squad ready!</p>
                <p>Invite your co-travelers to onboard.</p>
              </div>
            </>
          )}
          {tab === "kyc" && (
          <div className="dmb-actions">
            <div className="dmb-action-row">
              <button className="dmb-action-btn" type="button">Things to Carry</button>
              <button className="dmb-action-btn" type="button">FAQ</button>
            </div>
            {bookingStatus === "cancellation_requested" ? (
              <button
                className="dmb-action-btn dmb-action-btn--full dmb-action-btn--pending"
                type="button"
                onClick={goToCancellation}
              >
                View Cancellation Request
              </button>
            ) : (
              <button
                className="dmb-action-btn dmb-action-btn--full"
                type="button"
                onClick={() => setCancelOpen(true)}
              >
                <img src={`${A}icon-bag-inactive.svg`} width={16} height={16} alt="" aria-hidden />
                <span>Cancel Booking</span>
              </button>
            )}
          </div>
          )}
        </aside>
      </div>

      {/* Grey sign-off — page level, aligned with the content gutter */}
      <ProfileWatermark />

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="dmb-footer">
        <p>&copy; WANDERON EXPERIENCES PVT LTD, All rights reserved.</p>
      </footer>

      <CancelBookingSheet
        isOpen={cancelOpen}
        onClose={() => setCancelOpen(false)}
        onRequestCancellation={() => {
          requestCancellation(refId);
          goToCancellation();
        }}
        onContactSupport={() => {
          setCancelOpen(false);
          window.dispatchEvent(new Event("wanderon:open-enquire"));
        }}
      />
    </div>
  );
}
