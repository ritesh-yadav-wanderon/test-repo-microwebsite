// Cookie names shared by server code (app/_lib) and client providers. Kept
// out of the "use client" context modules: a Server Component importing a
// constant from a "use client" file gets a client reference, not the string.

/** Last real viewport ("d" desktop / "m" mobile) — see ViewportContext. */
export const VIEWPORT_COOKIE = "wo_vp";

/** "private" while the visitor is in private-trip mode — see TripModeContext. */
export const TRIP_MODE_COOKIE = "wo_trip_mode";
