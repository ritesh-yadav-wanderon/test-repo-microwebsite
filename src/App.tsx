import { lazy, Suspense, type ReactNode } from "react";
import { Routes, Route } from "react-router-dom";
import SiteChrome from "./components/SiteChrome";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import PageSkeleton, { type SkeletonVariant } from "./components/Skeleton/PageSkeleton";
const SearchResults = lazy(() => import("./pages/SearchResults"));
const Destination = lazy(() => import("./pages/Destination"));
const TripDetail = lazy(() => import("./pages/TripDetail"));
const Profile = lazy(() => import("./pages/Profile"));
const MyProfile = lazy(() => import("./pages/MyProfile"));
const Compare = lazy(() => import("./pages/Compare"));
const Legal   = lazy(() => import("./pages/Legal"));
const Events = lazy(() => import("./pages/Events"));
const EventDetail = lazy(() => import("./pages/EventDetail"));
const Booking = lazy(() => import("./pages/Booking"));
const MyBookings = lazy(() => import("./pages/MyBookings"));
const MyBooking = lazy(() => import("./pages/MyBooking"));
const Cancellation = lazy(() => import("./pages/Cancellation"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));

/** Wrap a lazy page so its chunk load shows a matching shimmer instead of a blank screen. */
function withSkeleton(element: ReactNode, variant: SkeletonVariant): ReactNode {
  return <Suspense fallback={<PageSkeleton variant={variant} />}>{element}</Suspense>;
}

export default function App() {
  return (
    <div className="app-shell">
      <ScrollToTop />
      <SiteChrome />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={withSkeleton(<SearchResults />, "list")} />
        <Route path="/destination/:slug" element={withSkeleton(<Destination />, "destination")} />
        <Route path="/trip/:slug" element={withSkeleton(<TripDetail />, "product")} />
        <Route path="/profile" element={withSkeleton(<Profile />, "profile")} />
        <Route path="/my-profile" element={withSkeleton(<MyProfile />, "form")} />
        <Route path="/events" element={withSkeleton(<Events />, "list")} />
        <Route
          path="/event/:slug"
          element={
            <Suspense fallback={<div style={{ minHeight: "100vh", background: "#121212" }} />}>
              <EventDetail />
            </Suspense>
          }
        />
        <Route path="/compare" element={withSkeleton(<Compare />, "list")} />
        <Route path="/legal" element={withSkeleton(<Legal />, "generic")} />
        <Route path="/booking" element={withSkeleton(<Booking />, "form")} />
        <Route path="/bookings" element={withSkeleton(<MyBookings />, "list")} />
        <Route path="/bookings/:ref" element={withSkeleton(<MyBooking />, "bookingDetail")} />
        <Route path="/bookings/:ref/success" element={withSkeleton(<PaymentSuccess />, "generic")} />
        <Route path="/bookings/:ref/cancellation" element={withSkeleton(<Cancellation />, "bookingDetail")} />
        <Route path="*" element={<Home />} />
      </Routes>
    </div>
  );
}
