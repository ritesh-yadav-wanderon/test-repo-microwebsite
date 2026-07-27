import { useEffect, useState } from "react";
import { startTripPayment, TEST_CARD } from "../../api/payment";
import { PAYMENT_MODE } from "../../api/config";
import { formatINR, type BookingForm } from "../../pages/useBookingForm";
import "./DesktopReviewBooking.css";

const A = "/figma/booking/";
const P = "/figma/payment/";
const TRIP_THUMB = "/figma/trip-hero/hero-bg.png";

/** Deposit charged for the "book now, pay later" option (mirrors the mobile
 *  PaymentSheet's pay-to-book amount). */
const PAY_TO_BOOK = 30000;
const DUE_DATE = "8th August 2026";

type PayOption = "later" | "full";
type PayStatus = "idle" | "processing" | "error";

interface DesktopReviewBookingProps {
  /** Shared booking state/logic owned by the `Booking` page. */
  form: BookingForm;
  /** Return to the booking details form. */
  onBack: () => void;
}

/** Desktop review-booking page (Figma 6597:36834) — shown after Book Now on
 *  the desktop booking form. Holds the payment-part selection (full vs
 *  book-now-pay-later) and opens Razorpay directly. */
export default function DesktopReviewBooking({ form, onBack }: DesktopReviewBookingProps) {
  const {
    data,
    travelers,
    privateRoom,
    flexibleCancel,
    firstName,
    middleName,
    lastName,
    gender,
    phone,
    email,
    panNumber,
    passportNumber,
    passportValidUpto,
    appliedVoucher,
    pricing,
    bookingReferenceId,
    handlePaymentSuccess,
  } = form;

  const [selected, setSelected] = useState<PayOption>("full");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<PayStatus>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // The review page opens scrolled to the top.
  useEffect(() => {
    document.querySelector(".app-shell")?.scrollTo(0, 0);
  }, []);

  const payToBook = Math.min(PAY_TO_BOOK, pricing.toPay);
  const dueLater = Math.max(0, pricing.toPay - payToBook);
  const payNum = selected === "full" ? pricing.toPay : payToBook;

  const fullName = [firstName, middleName, lastName].filter(Boolean).join(" ").trim();
  const genderLabel = gender ? gender.charAt(0).toUpperCase() + gender.slice(1) : "";

  const personalRows: Array<[string, string]> = [
    ["Name", fullName],
    ["Gender", genderLabel],
    ["WhatsApp Number", phone ? `+91-${phone}` : ""],
    ["Email ID", email],
  ].filter(([, v]) => v) as Array<[string, string]>;

  const documentRows: Array<[string, string]> = [
    ["PAN Number", panNumber],
    ["Passport Number", passportNumber],
    ["Passport Valid upto", passportValidUpto],
  ].filter(([, v]) => v) as Array<[string, string]>;

  const copyTestCard = async () => {
    try {
      await navigator.clipboard.writeText(TEST_CARD.number.replace(/\s/g, ""));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard blocked — the number is still visible.
    }
  };

  const handleBook = () => {
    if (loading || status === "processing" || payNum <= 0) return;
    setStatus("idle");
    setErrorMsg(null);

    const amountPaid = formatINR(payNum);
    const dueBalance = selected === "full" ? "0" : formatINR(dueLater);

    startTripPayment({
      bookingReferenceId,
      amount: payNum,
      description: data.tripName,
      prefill: { name: fullName, email, contact: phone },
      setLoading,
      onProcessing: () => setStatus("processing"),
      onSuccess: (result) => {
        handlePaymentSuccess({
          ...(result as Record<string, unknown>),
          option: selected,
          amountPaid,
          dueBalance,
          paymentMethod: "UPI",
        });
      },
      onError: (err) => {
        setStatus("error");
        setErrorMsg(err.message);
      },
      onDismiss: () => setStatus("idle"),
    });
  };

  return (
    <div className="dbk drb">
      {/* ── Header ─────────────────────────────────────────── */}
      <header className="dbk-header">
        <button className="dbk-header-back" type="button" aria-label="Back" onClick={onBack}>
          <img src={`${A}icon-arrow-back.svg`} width={24} height={24} alt="" aria-hidden />
        </button>
        <span className="dbk-header-title">Review Booking Details</span>
      </header>

      <div className="dbk-body">
        {/* ── Left column: booking review ──────────────────── */}
        <div className="dbk-main">
          <section className="dbk-card">
            {/* Trip package summary — same block as the booking form */}
            <div className="dbk-package">
              <img className="dbk-package-thumb" src={TRIP_THUMB} alt="" loading="lazy" />
              <div className="dbk-package-info">
                <p className="dbk-package-name">{data.tripTitle}</p>

                <div className="dbk-package-duration">
                  <div className="dbk-dur-label">
                    <img src={`${A}icon-calendar.svg`} width={16} height={16} alt="" aria-hidden />
                    <span>Trip Duration:</span>
                  </div>
                  <div className="dbk-dur-values">
                    <span>{data.dateRange}</span>
                    <span>{data.durationLabel}</span>
                  </div>
                </div>

                <div className="dbk-package-pd">
                  <div className="dbk-pd-col">
                    <div className="dbk-pd-label">
                      <img src={`${A}icon-location.svg`} width={11} height={12} alt="" aria-hidden />
                      <span>Pick Up</span>
                    </div>
                    <p className="dbk-pd-place">{data.pickUp}</p>
                  </div>
                  <div className="dbk-pd-col dbk-pd-col--right">
                    <div className="dbk-pd-label">
                      <img src={`${A}icon-location.svg`} width={11} height={12} alt="" aria-hidden />
                      <span>Drop</span>
                    </div>
                    <p className="dbk-pd-place">{data.drop}</p>
                  </div>
                </div>

                <div className="dbk-cities">
                  {data.cities.map((c, i) => (
                    <span className="dbk-city" key={i}>
                      {i > 0 && <span className="dbk-city-dot" aria-hidden />}
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Personal details recap */}
            <div className="drb-details">
              <div className="drb-pill">
                <img src={`${A}icon-person2.svg`} width={16} height={16} alt="" aria-hidden />
                <span>Personal Details (Primary Traveller)</span>
              </div>

              <div className="drb-rows">
                {personalRows.length === 0 ? (
                  <p className="drb-empty">No personal details added.</p>
                ) : (
                  personalRows.map(([label, value]) => (
                    <div className="drb-row" key={label}>
                      <span className="drb-row-label">{label}</span>
                      <span className="drb-row-value">{value}</span>
                    </div>
                  ))
                )}
              </div>

              {documentRows.length > 0 && (
                <>
                  <div className="drb-pill drb-pill--plain">
                    <span>Documents</span>
                  </div>
                  <div className="drb-rows">
                    {documentRows.map(([label, value]) => (
                      <div className="drb-row" key={label}>
                        <span className="drb-row-label">{label}</span>
                        <span className="drb-row-value">{value}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Bill summary */}
            <div className="drb-bill">
              <div className="drb-bill-pill">
                <img src={`${A}icon-receipt.svg`} width={16} height={16} alt="" aria-hidden />
                <span>Bill Summary</span>
              </div>

              <div className="dbk-bill-rows">
                <div className="dbk-bill-row">
                  <span>Hotel - (Double Sharing)</span>
                  <span>&#8377;{formatINR(pricing.perPersonNum)}/- x {travelers}</span>
                </div>
                {privateRoom && (
                  <div className="dbk-bill-row">
                    <span>Private Room</span>
                    <span>+&#8377;0/-</span>
                  </div>
                )}
                {flexibleCancel && (
                  <div className="dbk-bill-row">
                    <span>Flexible Cancellation</span>
                    <span>+&#8377;{formatINR(pricing.flexTotal)}/-</span>
                  </div>
                )}
              </div>

              <div className="dbk-bill-divider" />

              <div className="dbk-bill-total">
                <span>Total Cost</span>
                <span>&#8377;{formatINR(pricing.gross)}/-</span>
              </div>

              <div className="dbk-bill-divider" />

              <div className="dbk-bill-rows">
                {pricing.voucherDiscount > 0 && appliedVoucher && (
                  <div className="dbk-bill-row dbk-bill-row--discount">
                    <span>Voucher - {appliedVoucher.code}</span>
                    <span>-&#8377;{formatINR(pricing.voucherDiscount)}/-</span>
                  </div>
                )}
                {pricing.wanderOnDiscount > 0 && (
                  <div className="dbk-bill-row dbk-bill-row--discount">
                    <span>WanderOn Discount - (Upto &#8377;500 Off)</span>
                    <span>-&#8377;{formatINR(pricing.wanderOnDiscount)}/-</span>
                  </div>
                )}
                <div className="dbk-bill-row">
                  <span>GST @ 5%</span>
                  <span>&#8377;{formatINR(pricing.gst)}/-</span>
                </div>
                <div className="dbk-bill-row">
                  <button className="dbk-bill-tcs" type="button">
                    <span>TCS @ 5%</span>
                    <img src={`${A}icon-info-sm.svg`} width={16} height={16} alt="" aria-hidden />
                  </button>
                  <span>&#8377;{formatINR(pricing.tcs)}/-</span>
                </div>
              </div>

              <div className="dbk-bill-total">
                <span>To Pay</span>
                <span className="dbk-bill-topay">&#8377;{formatINR(pricing.toPay)}/-</span>
              </div>
            </div>
          </section>
        </div>

        {/* ── Right rail: payment selection (sticky) ───────── */}
        <aside className="dbk-rail">
          <div className="drb-pay-card">
            {/* Payment options */}
            <div className="drb-options">
              {/* Book now & pay later */}
              <div className={`drb-later${selected === "later" ? " drb-opt--active" : ""}`}>
                <button className="drb-later-card" type="button" onClick={() => setSelected("later")}>
                  <div className="drb-opt-head">
                    <img
                      src={selected === "later" ? `${P}radio-checked.svg` : `${P}radio-empty.svg`}
                      width={16}
                      height={16}
                      alt=""
                      aria-hidden
                    />
                    <span className="drb-opt-title">Book now &amp; pay remaining amount later</span>
                  </div>
                  <div className="drb-timeline">
                    <div className="drb-timeline-rail" aria-hidden>
                      <span className="drb-rail-node">&#8377;</span>
                      <span className="drb-rail-line" />
                      <span className="drb-rail-node">&#8377;</span>
                    </div>
                    <div className="drb-timeline-rows">
                      <div className="drb-timeline-row">
                        <span>Pay to Book</span>
                        <span>&#8377; {formatINR(payToBook)}/-</span>
                      </div>
                      <div className="drb-timeline-row">
                        <span>Pay due amount before {DUE_DATE}</span>
                        <span>&#8377; {formatINR(dueLater)}/-</span>
                      </div>
                    </div>
                  </div>
                </button>
                <div className="drb-later-foot">
                  <span>No hidden charges</span>
                  <span className="drb-foot-dot" aria-hidden />
                  <span>No card required</span>
                </div>
              </div>

              {/* Pay full amount now */}
              <button
                className={`drb-full${selected === "full" ? " drb-opt--active" : ""}`}
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
                <span className="drb-full-text">
                  <span className="drb-opt-title">Pay full amount now</span>
                  <span className="drb-opt-sub">One time payment</span>
                </span>
                <span className="drb-full-amount">&#8377; {formatINR(pricing.toPay)}/-</span>
              </button>
            </div>

            {PAYMENT_MODE === "frontend-test" && (
              <button
                type="button"
                className="drb-testcard"
                onClick={copyTestCard}
                title="Copy test card number"
              >
                <span className="drb-testcard-tag">TEST</span>
                <span>{TEST_CARD.number}</span>
                <span className="drb-testcard-meta">
                  {TEST_CARD.expiry} · CVV {TEST_CARD.cvv}
                </span>
                <span className="drb-testcard-copy">{copied ? "Copied" : "Copy"}</span>
              </button>
            )}

            {/* Savings banner + CTA */}
            <div className="drb-cta">
              {pricing.saved > 0 && (
                <div className="drb-saved">
                  <img src={`${A}icon-person.svg`} width={24} height={24} alt="" aria-hidden />
                  <span className="drb-saved-amt">&#8377;{formatINR(pricing.saved)}/-</span>
                  <span className="drb-saved-text">saved on this trip.</span>
                </div>
              )}

              {status === "error" && errorMsg && (
                <p className="drb-status drb-status--error" role="alert">{errorMsg}</p>
              )}
              {status === "processing" && (
                <p className="drb-status" role="status">Confirming your payment…</p>
              )}

              <div className="drb-cta-bar">
                <div className="drb-cta-price-col">
                  <span className="drb-cta-price">&#8377;{formatINR(payNum)}/-</span>
                  <button className="dbk-rail-fee" type="button">
                    <span>+</span>
                    <img src={`${A}icon-info-sm.svg`} width={16} height={16} alt="" aria-hidden />
                    <span>Convenience fee</span>
                  </button>
                </div>
                <button
                  className="drb-book"
                  type="button"
                  disabled={loading || status === "processing"}
                  onClick={handleBook}
                >
                  {loading ? "Processing…" : "Book Now"}
                </button>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="dbk-footer">
        <p>&copy; WANDERON EXPERIENCES PVT LTD, All rights reserved.</p>
      </footer>
    </div>
  );
}
