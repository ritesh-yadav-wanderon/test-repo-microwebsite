import { useState, useEffect, useRef } from "react";
import { startTripPayment, TEST_CARD, type RazorpayPrefill } from "../../api/payment";
import { PAYMENT_MODE } from "../../api/config";
import { useScrollLock } from "../../hooks/useScrollLock";
import "./PaymentSheet.css";

const P = "/figma/payment/";
const A = "/figma/booking/";

interface PaymentSheetProps {
  isOpen: boolean;
  onClose: () => void;
  /** "booking" = pay-to-book / full; "due" = clear a remaining balance. */
  mode?: PayMode;
  totalAmount?: string;
  payNowAmount?: string;
  dueAmount?: string;
  dueDate?: string;
  savedAmount?: string;
  bookingReferenceId?: string;
  description?: string;
  prefill?: RazorpayPrefill;
  onPaymentSuccess?: (data: unknown) => void;
  onPay?: (option: PayOption) => void;
}

type PayMode = "booking" | "due";
type PayOption = "later" | "full" | "custom";
type PayStatus = "idle" | "processing" | "success" | "error";

/** "1,09,720" -> 109720 (rupees). */
function parseAmount(display: string): number {
  return Number(String(display).replace(/[^\d]/g, ""));
}

/** 795116 -> "7,95,116" (Indian grouping). */
function formatINR(n: number): string {
  return n.toLocaleString("en-IN");
}

/** Desktop viewport or any mouse-driven window — dragging a thumb with a cursor
 *  is clumsy, so those pointers get a click-to-pay control instead. */
const DESKTOP_QUERY = "(min-width: 1024px), (hover: hover) and (pointer: fine)";

function useIsDesktopPointer(): boolean {
  const [isDesktop, setIsDesktop] = useState(() => window.matchMedia(DESKTOP_QUERY).matches);

  useEffect(() => {
    const mql = window.matchMedia(DESKTOP_QUERY);
    const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return isDesktop;
}

export default function PaymentSheet({
  isOpen,
  onClose,
  mode = "booking",
  totalAmount = "1,09,720",
  payNowAmount = "30,000",
  dueAmount = "79,720",
  dueDate = "8th August 2026",
  savedAmount = "5000",
  bookingReferenceId,
  description,
  prefill,
  onPaymentSuccess,
  onPay,
}: PaymentSheetProps) {
  const isDesktop = useIsDesktopPointer();
  const [hasOpened, setHasOpened] = useState(false);
  const [selected, setSelected] = useState<PayOption>("full");
  const [customAmount, setCustomAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<PayStatus>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const dueNum = parseAmount(dueAmount);
  const customNum = parseAmount(customAmount);
  const invalidCustom =
    mode === "due" && selected === "custom" && (customNum <= 0 || customNum > dueNum);

  // Rupee amount to charge for the current selection.
  const payNum =
    mode === "due"
      ? selected === "custom"
        ? customNum
        : dueNum
      : parseAmount(selected === "full" ? totalAmount : payNowAmount);
  const payDisplay = mode === "due" ? formatINR(payNum) : totalAmount;

  const copyTestCard = async () => {
    const raw = TEST_CARD.number.replace(/\s/g, "");
    try {
      await navigator.clipboard.writeText(raw);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard blocked (e.g. non-secure context) — the number is still shown.
    }
  };

  useEffect(() => {
    if (isOpen) {
      setHasOpened(true);
      // Fresh state each time the sheet is opened.
      setStatus("idle");
      setErrorMsg(null);
      setLoading(false);
      setSelected("full");
      setCustomAmount("");
    }
  }, [isOpen]);

  const handleSwipe = () => {
    if (loading || status === "success" || invalidCustom || payNum <= 0) return;
    setStatus("idle");
    setErrorMsg(null);
    onPay?.(selected);

    // What was paid vs what remains, per mode/selection.
    const amountPaid =
      mode === "due"
        ? formatINR(payNum)
        : selected === "full"
        ? totalAmount
        : payNowAmount;
    const dueBalance =
      mode === "due"
        ? formatINR(Math.max(0, dueNum - payNum))
        : selected === "full"
        ? "0"
        : dueAmount;

    startTripPayment({
      bookingReferenceId: bookingReferenceId || `WO-${Date.now()}`,
      // Amount in rupees; the PMS converts to paise. Flip to paise here if the
      // order endpoint expects paise instead.
      amount: payNum,
      description,
      prefill,
      setLoading,
      onProcessing: () => setStatus("processing"),
      onSuccess: (data) => {
        setStatus("success");
        onPaymentSuccess?.({
          ...(data as Record<string, unknown>),
          option: selected,
          amountPaid,
          dueBalance,
          paymentMethod: "UPI",
        });
      },
      onError: (err) => {
        setStatus("error");
        setErrorMsg(err.message);
        resetSwipe();
      },
      // On dismiss we keep the sheet open so the user can retry — but snap the
      // swipe thumb back to the start since nothing was paid.
      onDismiss: () => {
        resetSwipe();
      },
    });
  };

  useScrollLock(isOpen);

  // ── Swipe-to-pay drag interaction ──────────────────────────────────────────
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [maxX, setMaxX] = useState(0);
  /** The swipe has reached the end — the track now reads as a primary CTA. */
  const [committed, setCommitted] = useState(false);
  const startXRef = useRef(0);
  const maxXRef = useRef(0);
  const confirmedRef = useRef(false);
  const glideTimerRef = useRef<number | null>(null);

  const resetSwipe = () => {
    if (glideTimerRef.current !== null) {
      clearTimeout(glideTimerRef.current);
      glideTimerRef.current = null;
    }
    setDragging(false);
    setDragX(0);
    setCommitted(false);
    confirmedRef.current = false;
  };

  const THUMB_SIZE = 40;
  const TRACK_PAD = 2;
  /** Matches the thumb's glide transition in the CSS. */
  const GLIDE_MS = 320;
  const canSwipe = !(loading || status === "success" || invalidCustom || payNum <= 0);
  const progress = maxX > 0 ? Math.min(1, dragX / maxX) : 0;

  const measureMax = () => {
    const track = trackRef.current;
    if (!track) return 0;
    return Math.max(0, track.clientWidth - THUMB_SIZE - TRACK_PAD * 2);
  };

  // Reset the thumb whenever the sheet opens or closes (a close also cancels a
  // pending glide) and whenever a payment errors out.
  useEffect(() => {
    resetSwipe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);
  useEffect(() => {
    if (status === "error") resetSwipe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  // Keep the track measurement fresh so the fill/label progress stay accurate.
  useEffect(() => {
    if (!isOpen) return;
    const measure = () => {
      const m = measureMax();
      maxXRef.current = m;
      setMaxX(m);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [isOpen]);

  const onThumbPointerDown = (e: React.PointerEvent) => {
    if (!canSwipe) return;
    setDragging(true);
    confirmedRef.current = false;
    maxXRef.current = measureMax();
    setMaxX(maxXRef.current);
    startXRef.current = e.clientX - dragX;
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const onThumbPointerMove = (e: React.PointerEvent) => {
    if (!dragging || confirmedRef.current) return;
    const max = maxXRef.current;
    const x = Math.min(max, Math.max(0, e.clientX - startXRef.current));
    setDragX(x);
    // Trigger once the thumb crosses ~90% of the track.
    if (x >= max * 0.9 && max > 0) {
      confirmedRef.current = true;
      setDragging(false);
      setDragX(max);
      setCommitted(true);
      handleSwipe();
    }
  };

  const onThumbPointerUp = () => {
    if (!dragging) return;
    setDragging(false);
    if (!confirmedRef.current) setDragX(0); // snap back if not far enough
  };

  /** Pointer drag is awkward with a mouse, so on desktop (and for keyboard
   *  users) a single activation glides the thumb across and then pays. */
  const glideAndPay = () => {
    if (!canSwipe || confirmedRef.current) return;
    const max = measureMax();
    maxXRef.current = max;
    setMaxX(max);
    confirmedRef.current = true;
    setDragging(false);
    setDragX(max);
    setCommitted(true);
    glideTimerRef.current = window.setTimeout(() => {
      glideTimerRef.current = null;
      handleSwipe();
    }, GLIDE_MS);
  };

  useEffect(() => {
    return () => {
      if (glideTimerRef.current !== null) clearTimeout(glideTimerRef.current);
    };
  }, []);

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
          {PAYMENT_MODE === "frontend-test" && (
            <button
              type="button"
              className="psh-testcard"
              onClick={copyTestCard}
              title="Copy test card number"
            >
              <span className="psh-testcard-tag">TEST</span>
              <span className="psh-testcard-num">{TEST_CARD.number}</span>
              <span className="psh-testcard-meta">
                {TEST_CARD.expiry} · CVV {TEST_CARD.cvv}
              </span>
              <span className="psh-testcard-copy">{copied ? "Copied" : "Copy"}</span>
            </button>
          )}

          {mode === "due" ? (
            <>
              {/* ── Option: Pay full due amount ── */}
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
                  <span className="psh-full-title">Pay full due amount</span>
                  <span className="psh-full-sub">Clear your remaining balance</span>
                </div>
                <span className="psh-full-amount">&#8377; {dueAmount}/-</span>
              </button>

              {/* ── Option: Pay a custom amount ── */}
              <div
                className={`psh-full psh-custom${selected === "custom" ? " psh-full--active" : ""}`}
              >
                <button
                  className="psh-custom-head"
                  type="button"
                  onClick={() => setSelected("custom")}
                >
                  <img
                    src={selected === "custom" ? `${P}radio-checked.svg` : `${P}radio-empty.svg`}
                    width={16}
                    height={16}
                    alt=""
                    aria-hidden
                  />
                  <div className="psh-full-text">
                    <span className="psh-full-title">Pay a custom amount</span>
                    <span className="psh-full-sub">Enter how much you'd like to pay now</span>
                  </div>
                </button>

                {selected === "custom" && (
                  <div className="psh-custom-field">
                    <div className="psh-custom-input">
                      <span className="psh-custom-rupee">&#8377;</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        autoFocus
                        placeholder="Enter amount"
                        value={customAmount}
                        onChange={(e) =>
                          setCustomAmount(e.target.value.replace(/[^\d]/g, ""))
                        }
                      />
                    </div>
                    {invalidCustom && (
                      <p className="psh-custom-error">
                        Enter an amount between &#8377;1 and &#8377;{dueAmount}.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </>
          ) : (
          <>
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
          </>
          )}
        </div>

        {/* ── CTA ── */}
        <div className="psh-cta">
          {status === "error" && errorMsg && (
            <p className="psh-status psh-status--error" role="alert">
              {errorMsg}
            </p>
          )}
          {status === "success" ? (
            <p className="psh-status psh-status--success" role="status">
              Payment successful — your booking is confirmed.
            </p>
          ) : mode === "due" ? null : (
            <div className="psh-cta-tags">
              <img src={`${A}icon-person.svg`} width={24} height={24} alt="" aria-hidden />
              <span className="psh-cta-saved-amt">&#8377;{savedAmount}/-</span>
              <span className="psh-cta-saved-text">saved on this trip.</span>
            </div>
          )}
          <div className="psh-cta-bar">
            <div className="psh-cta-price-col">
              <span className="psh-cta-price">&#8377; {payDisplay}/-</span>
              <button className="psh-cta-fee" type="button">
                <span>+</span>
                <img src={`${A}icon-info-sm.svg`} width={16} height={16} alt="" aria-hidden />
                <span>Convenience fee</span>
              </button>
            </div>
            <div
              ref={trackRef}
              className={`psh-swipe${loading ? " psh-swipe--loading" : ""}${
                dragging ? " psh-swipe--dragging" : ""
              }${status === "success" ? " psh-swipe--done" : ""}${
                canSwipe ? " psh-swipe--ready" : " psh-swipe--disabled"
              }${isDesktop ? " psh-swipe--click" : ""}${
                committed ? " psh-swipe--committed" : ""
              }`}
              onClick={isDesktop ? glideAndPay : undefined}
              role={isDesktop ? undefined : "slider"}
              aria-label={isDesktop ? undefined : "Swipe to pay"}
              aria-valuemin={isDesktop ? undefined : 0}
              aria-valuemax={isDesktop ? undefined : 100}
              aria-valuenow={isDesktop ? undefined : Math.round(progress * 100)}
            >
              <span
                className="psh-swipe-fill"
                style={{ width: `${dragX + THUMB_SIZE}px` }}
                aria-hidden
              />
              <span
                className="psh-swipe-label"
                style={{ opacity: committed ? 1 : Math.max(0, 1 - progress * 1.6) }}
              >
                {status === "success"
                  ? "Paid"
                  : committed
                  ? "Continuing to Pay"
                  : isDesktop
                  ? "Continue to Pay"
                  : "Swipe to Pay"}
              </span>
              <button
                type="button"
                className="psh-swipe-thumb"
                style={{
                  transform: `translateX(${dragX}px)`,
                  transition: dragging
                    ? "none"
                    : "transform 0.32s cubic-bezier(0.22, 1, 0.36, 1)",
                }}
                onPointerDown={isDesktop ? undefined : onThumbPointerDown}
                onPointerMove={isDesktop ? undefined : onThumbPointerMove}
                onPointerUp={isDesktop ? undefined : onThumbPointerUp}
                onPointerCancel={isDesktop ? undefined : onThumbPointerUp}
                onKeyDown={(e) => {
                  if (e.key !== "Enter" && e.key !== " ") return;
                  e.preventDefault();
                  glideAndPay();
                }}
                disabled={!canSwipe}
                aria-label={isDesktop ? "Continue to pay" : "Slide to pay"}
              >
                {loading ? (
                  <span className="psh-swipe-spinner" aria-hidden />
                ) : status === "success" ? (
                  <span className="psh-swipe-check" aria-hidden>&#10003;</span>
                ) : (
                  <img
                    className="psh-swipe-arrow"
                    src={`${A}icon-arrow-right.svg`}
                    width={22}
                    height={22}
                    alt=""
                    aria-hidden
                  />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
