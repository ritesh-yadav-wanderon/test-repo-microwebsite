import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { AppliedVoucher } from "@/components/Voucher/Voucher";
import { useAuth } from "@/context/AuthContext";
import {
  BOOKING_DEFAULTS,
  FLEX_CANCEL_PP,
  GST_RATE,
  TCS_RATE,
  WANDERON_DISCOUNT,
} from "@/repositories";

export const formatINR = (n: number) => Math.round(n).toLocaleString("en-IN");

export interface BookingState {
  tripTitle?: string;
  tripName?: string;
  dateRange?: string;
  durationLabel?: string;
  pickUp?: string;
  drop?: string;
  cities?: string[];
  perPerson?: string;
  perPersonStrike?: string;
  travelers?: number;
  draft?: BookingDraft;
}

export interface BookingDraft {
  travelers: number;
  flexibleCancel: boolean;
  appliedVoucher: AppliedVoucher | null;
  bookingReferenceId: string;
}

/** Repository defaults, checked here to cover every field the form reads. */
const DEFAULTS: Required<Omit<BookingState, "draft">> = BOOKING_DEFAULTS;

export type BookingForm = ReturnType<typeof useBookingForm>;

/**
 * All the state + derived pricing behind the booking page. Shared between the
 * mobile (`Booking`) and desktop (`DesktopBooking`) renderings so both stay in
 * lock-step on business logic.
 */
export function useBookingForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, authReady, user } = useAuth();
  const state = (location.state as BookingState) || {};
  const data = { ...DEFAULTS, ...state };
  const draft = state.draft;
  const isPersonalDetails = location.pathname === "/booking/personal-details";

  const [accommodationOpen, setAccommodationOpen] = useState(true);
  const [travelers, setTravelers] = useState(draft?.travelers ?? state.travelers ?? 1);
  const [flexibleCancel, setFlexibleCancel] = useState(draft?.flexibleCancel ?? false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const loginSucceededRef = useRef(false);
  // Stable per-session reference until a real booking id is available from the PMS.
  const [bookingReferenceId] = useState(() => draft?.bookingReferenceId ?? `WO-${Date.now()}`);

  // Personal details
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [email, setEmail] = useState("");

  // Documents
  const [panNumber, setPanNumber] = useState("");
  const [panFile, setPanFile] = useState<File | null>(null);
  const [passportNumber, setPassportNumber] = useState("");
  const [passportValidUpto, setPassportValidUpto] = useState("");
  const [passportFile, setPassportFile] = useState<File | null>(null);

  // Who are you booking for
  const [femaleCount, setFemaleCount] = useState(0);
  const [maleCount, setMaleCount] = useState(0);

  // Derive minimums and effective counts directly from gender — no useEffect lag
  const femaleMin = gender === "female" || gender === "other" ? 1 : 0;
  const maleMin = gender === "male" ? 1 : 0;
  const effectiveFemale = Math.max(femaleCount, femaleMin);
  const effectiveMale = Math.max(maleCount, maleMin);

  // Applied coupon/voucher (drives the bill discount)
  const [appliedVoucher, setAppliedVoucher] = useState<AppliedVoucher | null>(
    draft?.appliedVoucher ?? null
  );

  const checkoutState: BookingState = {
    ...data,
    travelers,
    draft: {
      travelers,
      flexibleCancel,
      appliedVoucher,
      bookingReferenceId,
    },
  };

  const goToPersonalDetails = () => {
    if (isLoggedIn) {
      navigate("/booking/personal-details", { state: checkoutState });
    } else {
      setLoginOpen(true);
    }
  };

  const goBack = () => {
    if (isPersonalDetails) {
      navigate("/booking", { state: checkoutState });
    } else {
      navigate(-1);
    }
  };

  const handleLoginSuccess = () => {
    loginSucceededRef.current = true;
    setLoginOpen(false);
    navigate("/booking/personal-details", { state: checkoutState });
  };

  const handleLoginClose = () => {
    setLoginOpen(false);
    if (loginSucceededRef.current) {
      loginSucceededRef.current = false;
      return;
    }
    if (isPersonalDetails && !isLoggedIn) {
      navigate("/booking", { replace: true, state: checkoutState });
    }
  };

  // A direct link to personal details is protected at the page boundary.
  useEffect(() => {
    if (!isPersonalDetails || !authReady) return;
    setLoginOpen(!isLoggedIn);
  }, [authReady, isLoggedIn, isPersonalDetails]);

  // Login completes immediately before this route mounts; copy the verified
  // account number into the contact field once AuthContext catches up.
  useEffect(() => {
    if (!phone && user?.phone) setPhone(user.phone);
  }, [phone, user?.phone]);

  // ── Dynamic bill: recomputed from pax + selected services + voucher ──
  const pricing = useMemo(() => {
    const perPersonNum = Number(String(data.perPerson).replace(/[^\d]/g, "")) || 0;
    const perPersonStrikeNum =
      Number(String(data.perPersonStrike).replace(/[^\d]/g, "")) || 0;
    const roomSubtotal = perPersonNum * travelers;
    const flexTotal = flexibleCancel ? FLEX_CANCEL_PP * travelers : 0;
    const gross = roomSubtotal + flexTotal;

    const voucherDiscount = travelers > 0 ? appliedVoucher?.amount ?? 0 : 0;
    const wanderOnDiscount = travelers > 0 ? WANDERON_DISCOUNT : 0;
    const discountTotal = voucherDiscount + wanderOnDiscount;

    // Strike-through savings per traveller (only when the struck price is the
    // higher original). Guards against placeholder data where strike < price.
    const strikeSavings =
      perPersonStrikeNum > perPersonNum
        ? (perPersonStrikeNum - perPersonNum) * travelers
        : 0;

    const net = Math.max(0, gross - discountTotal);
    const gst = Math.round(net * GST_RATE);
    const tcs = Math.round(net * TCS_RATE);
    const toPay = net + gst + tcs;

    return {
      perPersonNum,
      roomSubtotal,
      flexTotal,
      gross,
      voucherDiscount,
      wanderOnDiscount,
      discountTotal,
      strikeSavings,
      gst,
      tcs,
      toPay,
      saved: discountTotal + strikeSavings,
    };
  }, [data.perPerson, data.perPersonStrike, travelers, flexibleCancel, appliedVoucher]);

  /** Shared success handler for the PaymentSheet on both layouts. */
  const handlePaymentSuccess = (result: unknown) => {
    setPaymentOpen(false);
    const r = (result || {}) as {
      amountPaid?: string;
      dueBalance?: string;
      paymentMethod?: string;
    };
    const now = new Date();
    const [pickUpDate, dropDate] = data.dateRange.split(" - ").map((s) => s.trim());
    // Show the full-page payment confirmation first; it forwards this
    // same state to the KYC Details view after a short delay.
    navigate(`/bookings/${bookingReferenceId}/success`, {
      state: {
        ref: bookingReferenceId,
        travellerName: firstName || "Traveller",
        amountPaid: r.amountPaid ?? formatINR(pricing.toPay),
        dueBalance: r.dueBalance ?? "0",
        paymentMethod: r.paymentMethod ?? "UPI",
        paidAt:
          now.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
          }) +
          ", " +
          now.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          }),
        tripTitle: data.tripTitle,
        tripName: data.tripName,
        startDate: data.dateRange,
        durationLabel: data.durationLabel,
        travelers,
        pickUp: data.pickUp,
        drop: data.drop,
        pickUpDate: pickUpDate || data.dateRange,
        dropDate: dropDate || "",
      },
    });
  };

  return {
    navigate,
    data,
    isPersonalDetails,
    loginOpen,
    goToPersonalDetails,
    goBack,
    handleLoginSuccess,
    handleLoginClose,
    accommodationOpen,
    setAccommodationOpen,
    travelers,
    setTravelers,
    flexibleCancel,
    setFlexibleCancel,
    notesOpen,
    setNotesOpen,
    agreed,
    setAgreed,
    paymentOpen,
    setPaymentOpen,
    bookingReferenceId,
    firstName,
    setFirstName,
    middleName,
    setMiddleName,
    lastName,
    setLastName,
    gender,
    setGender,
    dob,
    setDob,
    phone,
    setPhone,
    email,
    setEmail,
    panNumber,
    setPanNumber,
    panFile,
    setPanFile,
    passportNumber,
    setPassportNumber,
    passportValidUpto,
    setPassportValidUpto,
    passportFile,
    setPassportFile,
    femaleMin,
    maleMin,
    effectiveFemale,
    effectiveMale,
    setFemaleCount,
    setMaleCount,
    appliedVoucher,
    setAppliedVoucher,
    pricing,
    handlePaymentSuccess,
  };
}
