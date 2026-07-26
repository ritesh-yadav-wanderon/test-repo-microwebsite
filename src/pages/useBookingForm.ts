import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { AppliedVoucher } from "../components/Voucher/Voucher";

/** Add-on & tax rates used to build the bill dynamically. */
export const FLEX_CANCEL_PP = 5999; // Flexible cancellation, per traveller
export const WANDERON_DISCOUNT = 500; // Flat WanderOn discount when at least one traveller
export const GST_RATE = 0.05;
export const TCS_RATE = 0.05;

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
}

export const BOOKING_DEFAULTS: Required<BookingState> = {
  tripTitle:
    "11 Days European Pathways Community Trip - France, Netherlands, Germany, Czechia",
  tripName: "Europe Trip",
  dateRange: "23 July 2026 - 3 Aug 2026",
  durationLabel: "10N/11D",
  pickUp: "Paris Airport",
  drop: "Prague Airport",
  cities: ["3N Paris", "3N Amsterdam", "2N Berlin", "2N Prague"],
  perPerson: "1,79,990",
  perPersonStrike: "29,000",
  travelers: 2,
};

export type BookingForm = ReturnType<typeof useBookingForm>;

/**
 * All the state + derived pricing behind the booking page. Shared between the
 * mobile (`Booking`) and desktop (`DesktopBooking`) renderings so both stay in
 * lock-step on business logic.
 */
export function useBookingForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as BookingState) || {};
  const data = { ...BOOKING_DEFAULTS, ...state };

  const [accommodationOpen, setAccommodationOpen] = useState(true);
  const [travelers, setTravelers] = useState(1);
  const [mixedGender, setMixedGender] = useState(false);
  const [privateRoom, setPrivateRoom] = useState(true);
  const [flexibleCancel, setFlexibleCancel] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  // Stable per-session reference until a real booking id is available from the PMS.
  const [bookingReferenceId] = useState(() => `WO-${Date.now()}`);

  // Personal details
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [phone, setPhone] = useState("");
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
  const [appliedVoucher, setAppliedVoucher] = useState<AppliedVoucher | null>(null);

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
    accommodationOpen,
    setAccommodationOpen,
    travelers,
    setTravelers,
    mixedGender,
    setMixedGender,
    privateRoom,
    setPrivateRoom,
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
