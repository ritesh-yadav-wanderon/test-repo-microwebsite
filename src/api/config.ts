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

export const ENDPOINTS = {
  upcomingTrips: `${CMS_BASE}/upcomingTrips`,
  tripsAll: `${CMS_BASE}/trips-all`,
  tripBySlug: (slug: string) => `${CMS_BASE}/trip/${slug}`,
  destinationMinPrices: `${CMS_BASE}/destination-min-prices`,
  categories: `${CMS_BASE}/categories`,
  destinations: `${LF_BASE}/misc/destinations`,
} as const;
