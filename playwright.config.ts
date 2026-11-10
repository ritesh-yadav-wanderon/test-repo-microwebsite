import { defineConfig, devices } from "@playwright/test";

// E2E config. The critical booking/payment path runs against the real
// Razorpay Checkout UI with a public rzp_test_* key (no real money), per
// src/repositories/core/config.ts's RAZORPAY_TEST_MODE.
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
  webServer: {
    // Reuses the app's own dev server + .env (co-located with next.config.ts
    // at the repo root, so Next.js auto-loads it — NEXT_PUBLIC_RAZORPAY_KEY_ID
    // is already configured there for exactly this purpose) rather than duplicating a key here.
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
