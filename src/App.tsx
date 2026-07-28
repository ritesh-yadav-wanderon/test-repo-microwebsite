import { lazy, Suspense, useEffect, type ReactNode } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import SiteChrome from "./components/SiteChrome";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import PageSkeleton, { type SkeletonVariant } from "./components/Skeleton/PageSkeleton";
import { trackMainPage } from "./utils/lastMainPage";
const SearchResults = lazy(() => import("./pages/SearchResults"));
const Destination = lazy(() => import("./pages/Destination"));
const TripDetail = lazy(() => import("./pages/TripDetail"));
const TripGallery = lazy(() => import("./pages/TripGallery"));
const Profile = lazy(() => import("./pages/Profile"));
const MyProfile = lazy(() => import("./pages/MyProfile"));
const Support = lazy(() => import("./pages/Support"));
const Notifications = lazy(() => import("./pages/Notifications"));
const Payments = lazy(() => import("./pages/Payments"));
const Compare = lazy(() => import("./pages/Compare"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
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

/** Remembers the last main-site page so account pages can exit back to it. */
function RouteTracker() {
  const location = useLocation();
  useEffect(() => {
    trackMainPage(location.pathname, location.search);
  }, [location]);
  return null;
}

export default function App() {
  return (
    <div className="app-shell">
      <ScrollToTop />
      <RouteTracker />
      <SiteChrome />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={withSkeleton(<SearchResults />, "list")} />
        <Route path="/destination/:slug" element={withSkeleton(<Destination />, "destination")} />
        <Route path="/trip/:slug" element={withSkeleton(<TripDetail />, "product")} />
        <Route path="/trip/:slug/gallery" element={withSkeleton(<TripGallery />, "generic")} />
        <Route path="/profile" element={withSkeleton(<Profile />, "profile")} />
        <Route path="/my-profile" element={withSkeleton(<MyProfile />, "form")} />
        <Route path="/support" element={withSkeleton(<Support />, "form")} />
        <Route path="/notifications" element={withSkeleton(<Notifications />, "list")} />
        <Route path="/payments" element={withSkeleton(<Payments />, "list")} />
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
        <Route path="/wishlist" element={withSkeleton(<Wishlist />, "list")} />
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
