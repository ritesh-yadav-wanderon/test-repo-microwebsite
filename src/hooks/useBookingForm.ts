import { useEffect, useMemo, useRef, useState } from "react";
import type { AppliedVoucher } from "@/components/Voucher/Voucher";
import { useAuth } from "@/context/AuthContext";
import { useAppNav } from "@/hooks/useAppNav";
import { useAppSearchParams } from "@/hooks/useAppSearchParams";
import { useBookingDraftData } from "@/hooks/useBookingDraftData";
import {
  BOOKING_DEFAULTS,
  FLEX_CANCEL_PP,
  GST_RATE,
  TCS_RATE,
  WANDERON_DISCOUNT,
  createBookingDraft,
  newOrderId,
  updateBookingDraft,
  type BookingDraft as PersistedBookingDraft,
  type TravellerDetails,
} from "@/repositories";
import { isValidEmail, isValidPhone, normalizeEmail, normalizePhone } from "@/utils/contact";

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
  /** Shared booking/payment reference. */
  orderId: string;
}

/** Repository defaults, checked here to cover every field the form reads. */
const DEFAULTS: Required<Omit<BookingState, "draft">> = BOOKING_DEFAULTS;

export type BookingForm = ReturnType<typeof useBookingForm>;

/** Maps a persisted server draft onto this hook's local BookingState shape. */
function draftToBookingState(draft: PersistedBookingDraft): BookingState {
  return {
    tripTitle: draft.tripTitle,
    tripName: draft.tripName,
    dateRange: draft.dateRange,
    durationLabel: draft.durationLabel,
    pickUp: draft.pickUp,
    drop: draft.drop,
    cities: draft.cities,
    perPerson: draft.perPerson,
    perPersonStrike: draft.perPersonStrike,
    travelers: draft.travelers,
    draft: {
      travelers: draft.travelers ?? 1,
      flexibleCancel: draft.flexibleCancel ?? false,
      appliedVoucher: draft.appliedVoucher ?? null,
      orderId: draft.orderId,
    },
  };
}

/**
 * All the state + derived pricing behind the booking page. Shared between the
 * mobile (`Booking`) and desktop (`DesktopBooking`) renderings so both stay in
 * lock-step on business logic.
 *
 * `navState` is React Router history state carrying the trip selection from
 * TripDetail, or the in-progress draft carried forward between /booking and
 * /booking/personal-details — the fast, same-tab-only path (undefined under
 * Next.js, which has no equivalent). `initialDraftData` is Next's SSR-fetched
 * fallback for the SAME persisted draft, keyed by the `?orderId=` query param —
 * undefined under Vite, whose own fallback fetches it client-side instead
 * (same "refresh loses booking data" fix already applied to
 * PaymentSuccess/MyBooking).
 */
export function useBookingForm(
  navState?: BookingState,
  initialDraftData?: PersistedBookingDraft | null
) {
  const nav = useAppNav();
  const searchParams = useAppSearchParams();
  const { isLoggedIn, authReady, user } = useAuth();
  const isPersonalDetails = nav.pathname === "/booking/personal-details";
  const refParam = searchParams.get("orderId") ?? "";

  // Refresh-safe fallback #1: an in-progress draft, keyed by `?orderId=` —
  // covers both a reload of either booking route and Next.js's hard
  // navigation between them (no location.state there). Skipped whenever
  // navState already has the answer (same-tab Vite nav, zero latency).
  const { draft: fetchedDraft } = useBookingDraftData(
    refParam,
    !!navState || !refParam,
    initialDraftData
  );

  // Refresh-safe fallback #2: the trip selection TripDetail hands off on
  // the very first arrival at /booking, before any draft exists yet.
  const spTripTitle = !navState && !refParam ? searchParams.get("tripTitle") : null;
  const spState: BookingState | null = spTripTitle
    ? {
        tripTitle: spTripTitle,
        tripName: spTripTitle,
        dateRange: searchParams.get("dateRange") ?? "",
        durationLabel: searchParams.get("duration") ?? "",
        perPerson: searchParams.get("perPerson") ?? undefined,
        travelers: searchParams.get("travelers")
          ? Number(searchParams.get("travelers"))
          : undefined,
      }
    : null;

  const draftState = !navState && fetchedDraft ? draftToBookingState(fetchedDraft) : null;
  const state: BookingState = navState || draftState || spState || {};
  const data = { ...DEFAULTS, ...state };
  const draft = state.draft;

  const [accommodationOpen, setAccommodationOpen] = useState(true);
  const [travelers, setTravelers] = useState(draft?.travelers ?? state.travelers ?? 1);
  const [flexibleCancel, setFlexibleCancel] = useState(draft?.flexibleCancel ?? false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const loginSucceededRef = useRef(false);
  // The order reference shared by this booking and every payment against
  // it. `?orderId=` (from the URL) wins over generating a fresh one so a
  // reload/hard-nav keeps addressing the same booking.
  const [orderId] = useState(() => draft?.orderId ?? (refParam || newOrderId()));

  // Personal details — seeded from the persisted booking on a reload of
  // /booking/personal-details, so the traveller doesn't retype them.
  const saved: TravellerDetails = (!navState && fetchedDraft?.traveller) || {};
  const [firstName, setFirstName] = useState(saved.firstName ?? "");
  const [middleName, setMiddleName] = useState(saved.middleName ?? "");
  const [lastName, setLastName] = useState(saved.lastName ?? "");
  const [gender, setGender] = useState(saved.gender ?? "");
  const [dob, setDob] = useState(saved.dob ?? "");
  const [phone, setPhone] = useState((!navState && fetchedDraft?.phone) || user?.phone || "");
  const [email, setEmail] = useState((!navState && fetchedDraft?.email) || "");

  // Documents
  const [panNumber, setPanNumber] = useState(saved.panNumber ?? "");
  const [panFile, setPanFile] = useState<File | null>(null);
  const [passportNumber, setPassportNumber] = useState(saved.passportNumber ?? "");
  const [passportValidUpto, setPassportValidUpto] = useState(saved.passportValidUpto ?? "");
  const [passportFile, setPassportFile] = useState<File | null>(null);

  // Who are you booking for
  const [femaleCount, setFemaleCount] = useState(saved.femaleCount ?? 0);
  const [maleCount, setMaleCount] = useState(saved.maleCount ?? 0);

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
      orderId,
    },
  };

  // Persist a draft as soon as this order reference exists — the server-
  // side half of the "refresh loses booking data" fix. Idempotent
  // (createBookingDraft never overwrites an existing draft), so this is
  // safe to fire on every mount of this hook for the same orderId (e.g.
  // StrictMode's double-invoke, or navigating Booking -> personal details
  // -> back). Never awaited: checkout must not block on this network call.
  const draftCreatedRef = useRef<string | null>(null);
  useEffect(() => {
    if (draftCreatedRef.current === orderId) return;
    draftCreatedRef.current = orderId;
    createBookingDraft(orderId, {
      tripTitle: data.tripTitle,
      tripName: data.tripName,
      dateRange: data.dateRange,
      durationLabel: data.durationLabel,
      pickUp: data.pickUp,
      drop: data.drop,
      cities: data.cities,
      perPerson: data.perPerson,
      perPersonStrike: data.perPersonStrike,
      travelers,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  /** Snapshot the current selection into the draft right before a route
   *  change — the source of truth /booking/personal-details' Next.js
   *  fallback (fetch-by-orderId) reads back when there's no navState. */
  const persistCheckoutSnapshot = () => {
    updateBookingDraft(orderId, {
      tripTitle: data.tripTitle,
      tripName: data.tripName,
      dateRange: data.dateRange,
      durationLabel: data.durationLabel,
      pickUp: data.pickUp,
      drop: data.drop,
      cities: data.cities,
      perPerson: data.perPerson,
      perPersonStrike: data.perPersonStrike,
      travelers,
      flexibleCancel,
      appliedVoucher,
    });
  };

  /** The traveller's personal details, as saved on the booking. Mobile
   *  number + email are stored top-level (they identify the user), and only
   *  once valid — the API rejects a malformed one. */
  const travellerSnapshot = () => {
    const p = normalizePhone(phone);
    const e = normalizeEmail(email);
    return {
      traveller: {
        firstName,
        middleName,
        lastName,
        gender,
        dob,
        panNumber,
        passportNumber,
        passportValidUpto,
        femaleCount: effectiveFemale,
        maleCount: effectiveMale,
      },
      ...(isValidPhone(p) ? { phone: p } : {}),
      ...(isValidEmail(e) ? { email: e } : {}),
    };
  };

  /** Save the traveller details onto the booking, then open the payment
   *  sheet (which itself refuses to charge without a valid mobile + email). */
  const openPayment = () => {
    updateBookingDraft(orderId, travellerSnapshot());
    setPaymentOpen(true);
  };

  const goToPersonalDetails = () => {
    if (isLoggedIn) {
      persistCheckoutSnapshot();
      nav.push(`/booking/personal-details?orderId=${encodeURIComponent(orderId)}`, {
        state: checkoutState,
      });
    } else {
      setLoginOpen(true);
    }
  };

  const goBack = () => {
    if (isPersonalDetails) {
      nav.push(`/booking?orderId=${encodeURIComponent(orderId)}`, { state: checkoutState });
    } else {
      nav.back();
    }
  };

  const handleLoginSuccess = () => {
    loginSucceededRef.current = true;
    setLoginOpen(false);
    persistCheckoutSnapshot();
    nav.push(`/booking/personal-details?orderId=${encodeURIComponent(orderId)}`, {
      state: checkoutState,
    });
  };

  const handleLoginClose = () => {
    setLoginOpen(false);
    if (loginSucceededRef.current) {
      loginSucceededRef.current = false;
      return;
    }
    if (isPersonalDetails && !isLoggedIn) {
      nav.replace(`/booking?orderId=${encodeURIComponent(orderId)}`, {
        state: checkoutState,
      });
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
    const paidAt =
      now.toLocaleDateString("en-GB", { day: "numeric", month: "short" }) +
      ", " +
      now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
    const travellerName = [firstName, lastName].filter(Boolean).join(" ") || "Traveller";
    const amountPaid = r.amountPaid ?? formatINR(pricing.toPay);
    const dueBalance = r.dueBalance ?? "0";
    const paymentMethod = r.paymentMethod ?? "UPI";

    // Persist the payment result — the other half of the "refresh loses
    // booking data" fix. Fire-and-forget: the payment itself already
    // succeeded via Razorpay, so a persistence hiccup here shouldn't block
    // the user from seeing their confirmation.
    updateBookingDraft(orderId, {
      ...travellerSnapshot(),
      status: "paid",
      travellerName,
      amountPaid,
      dueBalance,
      paymentMethod,
      paidAt,
      tripTitle: data.tripTitle,
      tripName: data.tripName,
      dateRange: data.dateRange,
      durationLabel: data.durationLabel,
      travelers,
      pickUp: data.pickUp,
      drop: data.drop,
      pickUpDate: pickUpDate || data.dateRange,
      dropDate: dropDate || "",
    });

    // Show the full-page payment confirmation first; it forwards this
    // same state to the KYC Details view after a short delay. Still passed
    // as router state too (same-tab nav gets it instantly, no round-trip
    // needed) — PaymentSuccess/MyBooking fall back to fetching by ref when
    // this state isn't there (a refresh or a direct link).
    nav.push(`/bookings/${orderId}/success`, {
      state: {
        ref: orderId,
        travellerName,
        amountPaid,
        dueBalance,
        paymentMethod,
        paidAt,
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
    navigate: nav,
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
    openPayment,
    orderId,
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
