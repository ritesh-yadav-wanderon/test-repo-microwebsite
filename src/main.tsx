import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { BookingProvider } from "./context/BookingContext";
import { CompareProvider } from "./context/CompareContext";
import { WishlistProvider } from "./context/WishlistContext";
import App from "./App";
import "./styles/global.css";

const root = document.getElementById("root");
if (!root) throw new Error("Root element not found");

createRoot(root).render(
  <StrictMode>
    {/* v7_startTransition keeps the current page on screen while a lazy route
        chunk loads, instead of flashing the skeleton fallback. */}
    <BrowserRouter future={{ v7_startTransition: true }}>
      <AuthProvider>
        <BookingProvider>
          <CompareProvider>
            <WishlistProvider>
              <App />
            </WishlistProvider>
          </CompareProvider>
        </BookingProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
