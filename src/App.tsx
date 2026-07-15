import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import SiteChrome from "./components/SiteChrome";
import Home from "./pages/Home";
const SearchResults = lazy(() => import("./pages/SearchResults"));
const Destination = lazy(() => import("./pages/Destination"));
const TripDetail = lazy(() => import("./pages/TripDetail"));
const Profile = lazy(() => import("./pages/Profile"));
const MyProfile = lazy(() => import("./pages/MyProfile"));
const Compare = lazy(() => import("./pages/Compare"));
const Legal   = lazy(() => import("./pages/Legal"));
const Booking = lazy(() => import("./pages/Booking"));
const MyBookings = lazy(() => import("./pages/MyBookings"));
const MyBooking = lazy(() => import("./pages/MyBooking"));
const Cancellation = lazy(() => import("./pages/Cancellation"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));

export default function App() {
  return (
    <div className="app-shell">
      <SiteChrome />
      <Suspense fallback={null}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/destination/:slug" element={<Destination />} />
        <Route path="/trip/:slug" element={<TripDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/my-profile" element={<MyProfile />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/legal" element={<Legal />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/bookings" element={<MyBookings />} />
        <Route path="/bookings/:ref" element={<MyBooking />} />
        <Route path="/bookings/:ref/success" element={<PaymentSuccess />} />
        <Route path="/bookings/:ref/cancellation" element={<Cancellation />} />
        <Route path="*" element={<Home />} />
      </Routes>
      </Suspense>
    </div>
  );
}
