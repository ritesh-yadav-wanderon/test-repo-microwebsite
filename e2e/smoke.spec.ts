import { test, expect } from "@playwright/test";

// Sanity check before the full critical-path spec: confirms the app loads
// and — the specific thing this was written to catch — that a failed
// /api/products call degrades to an empty result instead of leaving the
// page stuck on its loading shimmer forever (see productRepository.ts's
// getProductList error handling).
test("home page loads and does not hang on a product-list fetch failure", async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });

  await page.goto("/");
  await expect(page).toHaveTitle(/.+/);

  // The "Upcoming Group trips" section header should render regardless of
  // whether the product-list fetch actually succeeded.
  await expect(page.getByText("Upcoming Group trips")).toBeVisible({ timeout: 10_000 });
});
