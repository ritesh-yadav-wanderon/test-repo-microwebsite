// API endpoint configuration.
//
// Dev/test endpoints only — this prototype must never point at a production
// API. Products, bookings and payments go through our own same-origin Route
// Handlers (app/api/*), backed by the CHAT_UX Mongo database.

/** WanderOn LF dev API (destination list). */
export const LF_BASE = "https://dev-lf-api.wanderon.in";

/** Image CDN host (static assets, not an API). */
export const IMAGE_BASE_URL = "https://wanderon-images.gumlet.io";

// ── Razorpay ────────────────────────────────────────────────────────────
// Checkout opens in the browser with the public key id; every successful
// payment is then recorded in Mongo via POST /api/payments, linked to its
// booking by the shared `orderId`.
export const RAZORPAY_SDK_URL = "https://checkout.razorpay.com/v1/checkout.js";

/** Public Razorpay key id (rzp_test_* for this prototype). */
export const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "";

/** True for an rzp_test_* key — drives the copyable test-card hint in the UI. */
export const RAZORPAY_TEST_MODE = RAZORPAY_KEY_ID.startsWith("rzp_test_");

export const ENDPOINTS = {
  destinations: `${LF_BASE}/misc/destinations`,
  productList: "/api/products",
  product: "/api/product",
  bookings: "/api/bookings",
  payments: "/api/payments",
} as const;
