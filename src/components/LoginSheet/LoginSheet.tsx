import { useState, useEffect, useRef } from "react";
import PhoneInput from "../PhoneInput/PhoneInput";
import { useAuth } from "../../context/AuthContext";
import "./LoginSheet.css";

const LS = "/figma/login-sheet/";
const TIMER_START = 25;
const DUMMY_OTP = "1234";

interface LoginSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function LoginSheet({ isOpen, onClose, onSuccess }: LoginSheetProps) {
  const auth = useAuth();

  const [step, setStep] = useState<1 | 2>(1);
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [countryDigits, setCountryDigits] = useState<[number, number]>([10, 10]);
  const [phoneError, setPhoneError] = useState<string | undefined>();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [otpError, setOtpError] = useState<string | undefined>();
  const [seconds, setSeconds] = useState(TIMER_START);
  const [canResend, setCanResend] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Reset after close animation
  useEffect(() => {
    if (!isOpen) {
      const t = setTimeout(() => {
        setStep(1);
        setPhone("");
        setCountryCode("+91");
        setCountryDigits([10, 10]);
        setPhoneError(undefined);
        setOtp(["", "", "", ""]);
        setOtpError(undefined);
        setSeconds(TIMER_START);
        setCanResend(false);
      }, 350);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  // Countdown when entering step 2
  useEffect(() => {
    if (step !== 2) return;
    setSeconds(TIMER_START);
    setCanResend(false);
    timerRef.current = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) { clearInterval(timerRef.current!); setCanResend(true); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [step]);

  function startTimer() {
    if (timerRef.current) clearInterval(timerRef.current);
    setSeconds(TIMER_START);
    setCanResend(false);
    timerRef.current = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) { clearInterval(timerRef.current!); setCanResend(true); return 0; }
        return prev - 1;
      });
    }, 1000);
  }

  function handleCountryChange({ code, digits }: { code: string; digits: [number, number] }) {
    setCountryCode(code);
    setCountryDigits(digits);
    setPhoneError(undefined);
  }

  function handleRequestOtp() {
    const [min, max] = countryDigits;
    if (!phone.trim()) { setPhoneError("Enter your mobile number"); return; }
    if (phone.length < min || phone.length > max) {
      setPhoneError(min === max ? `Enter a valid ${min}-digit number` : `Enter ${min}–${max} digits`);
      return;
    }
    setPhoneError(undefined);
    setStep(2);
  }

  function handleOtpChange(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    setOtpError(undefined);
    if (digit && index < 3) otpRefs.current[index + 1]?.focus();
  }

  function handleOtpKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  }

  function handleAuthenticate() {
    const entered = otp.join("");
    if (entered.length < 4) { setOtpError("Enter the 4-digit OTP"); return; }
    if (entered !== DUMMY_OTP) { setOtpError("Invalid OTP. Please try again."); return; }
    auth.login(phone, countryCode);
    onSuccess?.();
    onClose();
  }

  function handleResend() {
    if (!canResend) return;
    setOtp(["", "", "", ""]);
    setOtpError(undefined);
    otpRefs.current[0]?.focus();
    startTimer();
  }

  const timerLabel = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

  return (
    <>
      <div
        className={`ls-backdrop${isOpen ? " ls-backdrop--open" : ""}`}
        aria-hidden
        onClick={onClose}
      />
      <div
        className={`ls-sheet${isOpen ? " ls-sheet--open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Log in or sign up"
        aria-hidden={!isOpen}
      >
        <div className="ls-stripe"><div className="ls-stripe-pattern" /></div>

        <div className="ls-header">
          <div className="ls-hbg" aria-hidden>
            <div className="ls-hbg-col">
              <div className="ls-blob ls-blob--sq-br" />
              <div className="ls-hbg-row">
                <div className="ls-blob ls-blob--sq-tl" />
                <div className="ls-blob ls-blob--sq-tr" />
              </div>
            </div>
            <div className="ls-hbg-col">
              <div className="ls-blob ls-blob--sq-bl" />
              <div className="ls-hbg-row">
                <div className="ls-blob ls-blob--sq-tr" />
                <div className="ls-blob ls-blob--sq-tl" />
              </div>
            </div>
          </div>
          <div className="ls-logo">
            <img src="/figma/nav2/logo.png" width={60} height={60} className="ls-logo-img" alt="WanderOn" />
          </div>
          <button className="ls-close" type="button" onClick={onClose} aria-label="Close">
            <img src={`${LS}icon-close.svg`} width={30} height={30} alt="" aria-hidden />
          </button>
        </div>

        <div className="ls-body">
          <div className="ls-text-block">
            <h2 className="ls-title">Log in or sign up</h2>
            <p className="ls-desc">Unlock exclusive deals and get personalised recommendations!</p>
          </div>

          {step === 1 && (
            <div className="ls-step1">
              <p className="ls-phone-label">Enter your mobile number.</p>
              <div className="ls-step1-inputs">
                <PhoneInput
                  label="Contact Number"
                  value={phone}
                  onChange={v => { setPhone(v); setPhoneError(undefined); }}
                  error={phoneError}
                  onCountryChange={handleCountryChange}
                />
                <button className="ls-action-btn" type="button" onClick={handleRequestOtp}>
                  Request OTP
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="ls-step2">
              <div className="ls-phone-row">
                <div className="ls-phone-code">{countryCode}</div>
                <div className="ls-phone-num">{phone}</div>
              </div>

              <div className="ls-otp-section">
                <p className="ls-otp-hint">Enter 4 digit OTP sent to your mobile number.</p>
                <div className="ls-otp-boxes">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={el => { otpRefs.current[i] = el; }}
                      className={`ls-otp-box${otpError ? " ls-otp-box--error" : ""}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={e => handleOtpChange(i, e.target.value)}
                      onKeyDown={e => handleOtpKeyDown(i, e)}
                      aria-label={`OTP digit ${i + 1}`}
                    />
                  ))}
                </div>
                {otpError && <p className="ls-otp-error">{otpError}</p>}
                <p className="ls-otp-dev-hint">
                  Use OTP <strong>{DUMMY_OTP}</strong> to verify
                </p>
              </div>

              <div className="ls-step2-actions">
                <button className="ls-action-btn" type="button" onClick={handleAuthenticate}>
                  Authenticate
                </button>
                <div className="ls-timer-row">
                  <span className="ls-timer">{timerLabel}</span>
                  <button
                    className={`ls-resend${canResend ? "" : " ls-resend--disabled"}`}
                    type="button"
                    onClick={handleResend}
                    disabled={!canResend}
                  >
                    Resend OTP
                  </button>
                </div>
              </div>
            </div>
          )}

          <p className="ls-legal">
            By signing up or logging in, you acknowledge and agree to{" "}
            <a href="/legal/terms" className="ls-legal-link">WanderOn Terms of Use</a>
            {" "}and{" "}
            <a href="/legal/privacy" className="ls-legal-link">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </>
  );
}
