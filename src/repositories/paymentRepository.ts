// Razorpay payment flow (frontend half) + payment persistence.
//
// Checkout opens in the browser with the public key id. Each successful
// payment is then recorded in Mongo through our own API (POST /api/payments),
// next to the booking it pays for and linked to it by the shared `orderId`.
// Every payment must carry the payer's mobile number + email — the user
// identifier — so checkout is refused up front without them.

import { RAZORPAY_SDK_URL, RAZORPAY_KEY_ID, RAZORPAY_TEST_MODE, ENDPOINTS } from "./core/config";
import { postJSON } from "./core/http";
import { toUserContact } from "@/utils/contact";
import { PAYMENT_LEDGER, type LedgerEntry } from "./fixtures/paymentLedger";

export { PAYMENT_LEDGER };
export type { LedgerEntry, Transaction } from "./fixtures/paymentLedger";

/** Payment history for the account ledger screen. */
export function getPaymentLedger(): LedgerEntry[] {
  return PAYMENT_LEDGER;
}

// ── Razorpay Checkout global (injected by the SDK script) ───────────────
// Checkout is opened without a server-created Razorpay order, so
// order_id/signature come back empty — hence optional.
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

/** Domestic test card surfaced in the UI while running on an rzp_test_* key. */
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
  notes?: Record<string, string>;
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
  /** Shared booking/payment reference — the booking this payment is for. */
  orderId: string;
  /** Amount in rupees. */
  amount: number | string;
  description?: string;
  /** Must include a valid `contact` (mobile) and `email`. */
  prefill?: RazorpayPrefill;
  onProcessing?: () => void;
  onSuccess?: (data: PaymentResult) => void;
  onError?: (error: Error) => void;
  onDismiss?: () => void;
  setLoading?: (value: boolean) => void;
}

export interface PaymentResult {
  verified: boolean;
  test: boolean;
  orderId: string;
  razorpayPaymentId: string;
}

const CONFIRMING_MESSAGE =
  "We're confirming your payment. Please don't pay again — we'll update your booking shortly.";

/** Store a captured payment against its order (one retry — Razorpay has
 *  already taken the money, so a transient blip shouldn't lose the record). */
async function recordPayment(body: Record<string, unknown>): Promise<void> {
  try {
    await postJSON(ENDPOINTS.payments, body);
  } catch (err) {
    console.warn("[paymentRepository] recordPayment failed, retrying:", err instanceof Error ? err.message : String(err));
    await postJSON(ENDPOINTS.payments, body);
  }
}

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

export async function startTripPayment({
  orderId,
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

  try {
    if (!orderId) {
      fail(new Error("Missing order ID."));
      return;
    }
    if (!amount || Number(amount) <= 0) {
      fail(new Error("There's nothing left to pay on this booking."));
      return;
    }
    const contact = toUserContact(prefill.contact, prefill.email);
    if (!contact) {
      fail(new Error("Please add a valid 10-digit mobile number and email address before paying."));
      return;
    }
    if (!RAZORPAY_KEY_ID) {
      fail(new Error("Missing NEXT_PUBLIC_RAZORPAY_KEY_ID. Add your rzp_test_* key to .env."));
      return;
    }

    const loaded = await loadScript(RAZORPAY_SDK_URL);
    if (!loaded || !window.Razorpay) {
      fail(new Error("Razorpay SDK failed to load. Are you online?"));
      return;
    }

    // Razorpay expects the smallest currency unit (paise). `amount` is in rupees.
    const rupees = Number(amount);
    const options: RazorpayOptions = {
      key: RAZORPAY_KEY_ID,
      amount: Math.round(rupees * 100),
      currency: "INR",
      description: description || "WanderOn Booking",
      notes: { orderId },
      // On a test key, land on the Card tab so the copyable test card is one
      // paste away.
      prefill: {
        ...prefill,
        contact: contact.phone,
        email: contact.email,
        method: prefill.method || (RAZORPAY_TEST_MODE ? "card" : undefined),
      },
      handler: async (response) => {
        // The Razorpay window has closed on a successful payment — surface
        // the loading/shimmer state immediately, before the record round-trip.
        if (typeof onProcessing === "function") onProcessing();
        setBusy(true);
        try {
          await recordPayment({
            orderId,
            paymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            amount: rupees,
            currency: "INR",
            test: RAZORPAY_TEST_MODE,
            phone: contact.phone,
            email: contact.email,
            name: prefill.name,
          });
          setBusy(false);
          if (typeof onSuccess === "function") {
            onSuccess({
              verified: true,
              test: RAZORPAY_TEST_MODE,
              orderId,
              razorpayPaymentId: response.razorpay_payment_id,
            });
          }
        } catch (err) {
          // The customer has already been charged by Razorpay; only our own
          // record failed. Never surface the raw error — that reads like the
          // payment failed.
          console.error("Payment record failed after checkout:", err);
          fail(new Error(CONFIRMING_MESSAGE));
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

    new window.Razorpay(options).open();
  } catch (err) {
    fail(err instanceof Error ? err : new Error(String(err)));
  }
}
