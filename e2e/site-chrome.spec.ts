import { test, expect } from "@playwright/test";

// SiteChrome (the global search/login/burger/filter sheets + compare FAB +
// floating actions + home header) — these tests exercise the OPEN state of
// each sheet, not just a static screenshot: a wired-up sheet and a silently
// broken one both render nothing when closed, so pixel-parity screenshots
// alone can't catch a regression here.

test.describe("site chrome", () => {
  test("clicking Account in BottomNav opens the login sheet, from a non-home page", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/notifications");
    await page.getByLabel("Account", { exact: true }).click();
    await expect(page.getByRole("dialog", { name: /log in or sign up/i })).toBeVisible();
  });

  test("the home header's menu button opens the navigation burger menu", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    // The scroll-nav header carries the same "Open menu" button, hidden
    // (tabindex -1) until the page scrolls — target the hero header's own
    // one explicitly rather than relying on visibility-based disambiguation.
    await page.locator(".site-header__menu").click();
    await expect(page.getByRole("dialog", { name: /navigation menu/i })).toBeVisible();
  });

  test("the home header's search button opens the search sheet", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    // Hero search bar (Home's own, not the header's — the header's own
    // search icon only appears once scrolled past the hero).
    await page.getByRole("button", { name: "Open trip search" }).click();
    await expect(page.getByRole("button", { name: "Close search" })).toBeVisible();
  });
});
