// API endpoint configuration.
//
// In development (vite dev server) we route through the proxy defined in
// vite.config.ts to avoid CORS. In production builds the app talks to the
// backends directly. Override via .env (VITE_CMS_BASE / VITE_LF_BASE) if needed.
//
// NOTE: every endpoint below is READ-ONLY (HTTP GET). No write/mutation
// endpoints from the source codebase are used here.

const isDev = import.meta.env.DEV;

export const CMS_BASE =
  import.meta.env.VITE_CMS_BASE ||
  (isDev ? "/cms-api" : "https://cms-backend-staging-b2yue.ondigitalocean.app");

export const LF_BASE =
  import.meta.env.VITE_LF_BASE ||
  (isDev ? "/lf-api" : "https://dev-lf-api.wanderon.in");

export const IMAGE_BASE_URL = "https://wanderon-images.gumlet.io";

// Payment service (FMS/PMS). Razorpay order creation + signature verification
// live here (the key secret never reaches the browser). Endpoints sit under
// /api/v1/payment. Provide the real host via VITE_FMS_BASE, or override the two
// endpoints directly with VITE_PMS_PAYMENT_ORDER_URL /
// VITE_PMS_PAYMENT_VERIFY_URL. In dev we route through the /pms-api proxy
// (see vite.config.ts) to avoid CORS.
export const FMS_BASE =
  import.meta.env.VITE_FMS_BASE ||
  (isDev ? "/pms-api" : "");

const PMS_PAYMENT_BASE_URL = `${FMS_BASE}/api/v1/payment`;

export const RAZORPAY_SDK_URL = "https://checkout.razorpay.com/v1/checkout.js";

export const PMS_PAYMENT_ORDER_URL =
  import.meta.env.VITE_PMS_PAYMENT_ORDER_URL || `${PMS_PAYMENT_BASE_URL}/order`;

export const PMS_PAYMENT_VERIFY_URL =
  import.meta.env.VITE_PMS_PAYMENT_VERIFY_URL ||
  `${PMS_PAYMENT_BASE_URL}/verify-payment`;

// ── Frontend-only Razorpay test flow ────────────────────────────────────
// For local testing WITHOUT the FMS backend: open Razorpay Checkout with just
// a public test key + amount (no server order, no signature verification).
// Set VITE_RAZORPAY_KEY_ID to an rzp_test_* key from the Razorpay dashboard.
// NOTE: test-only — there's no server-side verification, so never ship this
// mode to production with real money.
export const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || "";

// "backend"        -> PMS creates the order and verifies the signature.
// "frontend-test"  -> browser-only checkout with RAZORPAY_KEY_ID (no backend).
// Defaults to frontend-test automatically when a test key is present and the
// mode isn't pinned, otherwise falls back to the backend flow.
export const PAYMENT_MODE: "backend" | "frontend-test" =
  (import.meta.env.VITE_PAYMENT_MODE as "backend" | "frontend-test") ||
  (RAZORPAY_KEY_ID ? "frontend-test" : "backend");

export const ENDPOINTS = {
  upcomingTrips: `${CMS_BASE}/upcomingTrips`,
  tripsAll: `${CMS_BASE}/trips-all`,
  tripBySlug: (slug: string) => `${CMS_BASE}/trip/${slug}`,
  destinationMinPrices: `${CMS_BASE}/destination-min-prices`,
  categories: `${CMS_BASE}/categories`,
  destinations: `${LF_BASE}/misc/destinations`,
} as const;
