// Razorpay payment flow (frontend half).
//
// The heavy lifting (order creation + signature verification) is done by the
// PMS backend so the Razorpay key secret never reaches the browser. This module
// only: loads the Checkout script, asks the PMS to create an order, opens the
// Razorpay widget, then asks the PMS to verify the signature.
//
// Test mode is a server-side switch: the PMS returns the public `keyId` in the
// order response, so pointing the PMS at rzp_test_* keys makes this run against
// Razorpay's test suite with no frontend change.

import {
  RAZORPAY_SDK_URL,
  RAZORPAY_KEY_ID,
  PAYMENT_MODE,
  PMS_PAYMENT_ORDER_URL,
  PMS_PAYMENT_VERIFY_URL,
} from "./config";

// ── Razorpay Checkout global (injected by the SDK script) ───────────────
// In the frontend-test flow there's no server order, so order_id/signature
// come back empty — hence optional.
interface RazorpayResponse {
  razorpay_order_id?: string;
  razorpay_payment_id: string;
  razorpay_signature?: string;
}

export interface RazorpayPrefill {
  name?: string;
  email?: string;
  contact?: string;
  /** Pre-selects a payment method tab in Checkout (e.g. "card", "upi"). */
  method?: string;
}

/** Domestic test card surfaced in the UI for the frontend-test flow. */
export const TEST_CARD = {
  number: "5267 3181 8797 5449",
  expiry: "12/28",
  cvv: "123",
  name: "Test User",
};

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  description?: string;
  order_id?: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: RazorpayPrefill;
  theme?: { color?: string };
  modal?: { ondismiss?: () => void };
}

interface RazorpayInstance {
  open: () => void;
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

// ── Public API ──────────────────────────────────────────────────────────
export interface StartTripPaymentArgs {
  bookingReferenceId: string;
  /** Amount in rupees (the PMS converts to paise and returns `amount` in paise). */
  amount: number | string;
  description?: string;
  prefill?: RazorpayPrefill;
  onProcessing?: () => void;
  onSuccess?: (data: VerifyData) => void;
  onError?: (error: Error) => void;
  onDismiss?: () => void;
  setLoading?: (value: boolean) => void;
}

interface OrderData {
  orderId: string;
  keyId: string;
  amount: number;
  currency: string;
}

interface VerifyData {
  verified?: boolean;
  [key: string]: unknown;
}

const CONFIRMING_MESSAGE =
  "We're confirming your payment. Please don't pay again — we'll update your booking shortly.";

// Idempotent Checkout-script loader: reuses an in-flight/injected tag.
let scriptPromise: Promise<boolean> | null = null;
function loadScript(src: string): Promise<boolean> {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return Promise.resolve(false);
  }
  if (window.Razorpay) return Promise.resolve(true);
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise<boolean>((resolve) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${src}"]`
    );
    if (existing) {
      existing.addEventListener("load", () => resolve(true));
      existing.addEventListener("error", () => {
        scriptPromise = null;
        resolve(false);
      });
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      scriptPromise = null;
      resolve(false);
    };
    document.body.appendChild(script);
  });
  return scriptPromise;
}

async function postJSON<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = (await res.json().catch(() => null)) as unknown;
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} for ${url}`);
  }
  return json as T;
}

export async function startTripPayment({
  bookingReferenceId,
  amount,
  description,
  prefill = {},
  onProcessing,
  onSuccess,
  onError,
  onDismiss,
  setLoading,
}: StartTripPaymentArgs): Promise<void> {
  const setBusy = (value: boolean) => {
    if (typeof setLoading === "function") setLoading(value);
  };
  const fail = (error: Error) => {
    setBusy(false);
    if (typeof onError === "function") onError(error);
  };

  if (!bookingReferenceId) {
    fail(new Error("Missing booking reference."));
    return;
  }
  if (!amount || Number(amount) <= 0) {
    fail(new Error("There's nothing left to pay on this booking."));
    return;
  }

  const loaded = await loadScript(RAZORPAY_SDK_URL);
  if (!loaded) {
    fail(new Error("Razorpay SDK failed to load. Are you online?"));
    return;
  }

  // Frontend-only test flow: skip the PMS order/verify round-trips and open
  // Checkout directly with the public test key. For local testing only.
  if (PAYMENT_MODE === "frontend-test") {
    startTestCheckout({
      amount,
      description,
      prefill,
      onProcessing,
      onSuccess,
      onDismiss,
      setBusy,
      fail,
    });
    return;
  }

  setBusy(true);
  try {
    const orderJson = await postJSON<{ data: OrderData }>(PMS_PAYMENT_ORDER_URL, {
      bookingReferenceId,
      amount: Number(amount),
      idempotencyKey: `${bookingReferenceId}_${Date.now()}`,
    });

    const { orderId, keyId, amount: paisaAmount, currency } = orderJson.data;
    setBusy(false);

    if (!window.Razorpay) {
      fail(new Error("Razorpay SDK failed to load. Are you online?"));
      return;
    }

    const options: RazorpayOptions = {
      key: keyId,
      amount: paisaAmount,
      currency,
      description: description || "WanderOn Booking",
      order_id: orderId,
      handler: async (response) => {
        // The Razorpay window has closed on a successful payment — surface the
        // loading/shimmer state immediately, before the verify round-trip.
        if (typeof onProcessing === "function") onProcessing();
        setBusy(true);
        try {
          const verifyJson = await postJSON<{ data?: VerifyData }>(
            PMS_PAYMENT_VERIFY_URL,
            {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            }
          );
          setBusy(false);
          if (verifyJson.data?.verified) {
            if (typeof onSuccess === "function") onSuccess(verifyJson.data);
          } else {
            fail(new Error(CONFIRMING_MESSAGE));
          }
        } catch (err) {
          // The customer has already been charged by Razorpay; only our verify
          // round-trip failed, and the webhook can still reconcile it. Never
          // surface the raw upstream error — that reads like the payment failed.
          console.error("Payment verify failed after checkout:", err);
          fail(new Error(CONFIRMING_MESSAGE));
        }
      },
      prefill,
      theme: { color: "#01AFD1" },
      modal: {
        ondismiss: () => {
          setBusy(false);
          if (typeof onDismiss === "function") onDismiss();
        },
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  } catch (err) {
    fail(err instanceof Error ? err : new Error(String(err)));
  }
}

// ── Frontend-only test checkout (no backend) ─────────────────────────────
interface TestCheckoutArgs {
  amount: number | string;
  description?: string;
  prefill: RazorpayPrefill;
  onProcessing?: () => void;
  onSuccess?: (data: VerifyData) => void;
  onDismiss?: () => void;
  setBusy: (value: boolean) => void;
  fail: (error: Error) => void;
}

function startTestCheckout({
  amount,
  description,
  prefill,
  onProcessing,
  onSuccess,
  onDismiss,
  setBusy,
  fail,
}: TestCheckoutArgs): void {
  if (!RAZORPAY_KEY_ID) {
    fail(
      new Error(
        "Missing VITE_RAZORPAY_KEY_ID. Add your rzp_test_* key to .env to run the test checkout."
      )
    );
    return;
  }
  if (!window.Razorpay) {
    fail(new Error("Razorpay SDK failed to load. Are you online?"));
    return;
  }

  // Razorpay expects the smallest currency unit (paise). `amount` is in rupees.
  const paise = Math.round(Number(amount) * 100);

  const options: RazorpayOptions = {
    key: RAZORPAY_KEY_ID,
    amount: paise,
    currency: "INR",
    description: description || "WanderOn Booking (test)",
    // Land on the Card tab so the copyable test card is one paste away.
    prefill: { ...prefill, method: prefill.method || "card" },
    handler: (response) => {
      // No server order to verify against in test mode — a payment id back from
      // Checkout is our success signal.
      if (typeof onProcessing === "function") onProcessing();
      setBusy(false);
      if (typeof onSuccess === "function") {
        onSuccess({
          verified: true,
          test: true,
          razorpayPaymentId: response.razorpay_payment_id,
        });
      }
    },
    theme: { color: "#01AFD1" },
    modal: {
      ondismiss: () => {
        setBusy(false);
        if (typeof onDismiss === "function") onDismiss();
      },
    },
  };

  const paymentObject = new window.Razorpay(options);
  paymentObject.open();
}
