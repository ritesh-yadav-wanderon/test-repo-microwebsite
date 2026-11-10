"use client";

import { AuthProvider } from "../src/context/AuthContext";
import { BookingProvider } from "../src/context/BookingContext";
import { CompareProvider } from "../src/context/CompareContext";
import { WishlistProvider } from "../src/context/WishlistContext";

/** Next.js's mount point for the app's 4 contexts (auth, booking-status,
 *  compare, wishlist) — missing here once meant every one of
 *  them silently fell back to createContext()'s DEFAULT value (none of these
 *  throw on a missing Provider, unlike AppNavContext/AppSearchParamsContext),
 *  so e.g. useAuth() always reported "logged out, not ready" no matter what.
 *  Caught by Booking's personal-details page never opening its login gate —
 *  see e2e/visual-baseline.spec.ts's "booking-personal-details" parity check. */
export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <BookingProvider>
        <CompareProvider>
          <WishlistProvider>{children}</WishlistProvider>
        </CompareProvider>
      </BookingProvider>
    </AuthProvider>
  );
}
