import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The dev-mode floating "N" indicator is dev-only chrome (never shown in a
  // production build) but shows up in `next dev` screenshots and would
  // falsely read as a pixel regression against the stored baselines.
  devIndicators: false,
};

export default nextConfig;
