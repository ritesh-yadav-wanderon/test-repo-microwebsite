import type { Metadata, Viewport } from "next";
import "../src/styles/global.css";
import NextNavProvider from "./NextNavProvider";
import AppProviders from "./AppProviders";
import SiteChromeClient from "./SiteChromeClient";

export const metadata: Metadata = {
  title: "WanderOn — Travel Community",
  icons: { icon: "/favicon.svg" },
};

// Same as the Vite index.html's viewport meta (no pinch-zoom past 1x).
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      {/* Roboto + Roboto Condensed only — every font-family rule in the
          shared CSS resolves to one of these two (var(--font) in
          global.css is "Roboto", sans-serif). Without this link, they'd
          silently fall back to a system font instead. */}
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;600;700;900&family=Roboto+Condensed:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      {/* The shared global.css makes body non-scrolling and .app-shell the
          sole scroll container with the app's max-width centering, so every
          page needs this same wrapper to render correctly at desktop
          widths. */}
      <body>
        <div className="app-shell">
          <AppProviders>
            <NextNavProvider>
              <SiteChromeClient />
              {children}
            </NextNavProvider>
          </AppProviders>
        </div>
      </body>
    </html>
  );
}
