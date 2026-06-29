import { Routes, Route } from "react-router-dom";
import SiteChrome from "./components/SiteChrome";
import Home from "./pages/Home";
import SearchResults from "./pages/SearchResults";
import Destination from "./pages/Destination";
import TripDetail from "./pages/TripDetail";

export default function App() {
  return (
    <div className="app-shell">
      <SiteChrome />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/destination/:slug" element={<Destination />} />
        <Route path="/trip/:slug" element={<TripDetail />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </div>
  );
}
