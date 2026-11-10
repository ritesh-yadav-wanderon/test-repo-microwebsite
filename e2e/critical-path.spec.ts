import { test, expect, type Page } from "@playwright/test";

// The critical booking/payment path, run on an rzp_test_* Razorpay key (see
// .env / playwright.config.ts) so no real money is involved.
//
// One test below deliberately characterizes a KNOWN, PRE-EXISTING bug rather
// than correct behavior — see the plan
// (/Users/riteshyadav/.claude-work/plans/mutable-imagining-truffle.md,
// Phase 0) for why: "refresh loses booking data" (Phase 5 fixes it).
//
// The plan also flagged a suspected "TripDetail double-fetch" (both
// TripDetail and DesktopTripDetail called useProductData() unconditionally).
// Running this test against the real app first disproved the network-level
// half of that: productRepository's cachedRequest() dedupes concurrent
// identical requests by cache key (`product:<id>`), so the second mount
// joined the first's in-flight promise instead of firing a second network
// request — only one fetch ever went out even before any fix.
//
// Phase 4 fixed the underlying architecture anyway (Next.js's server-fetch
// pattern needs exactly one fetch site to seed from `initialData`, not two
// independently-caching ones): DesktopTripDetail no longer calls
// useProductData() itself — TripDetailView calls it once and passes `data`
// down as a prop to both renderers. This test now guards that shape too,
// not just the network count.
//
// TripDetail is reached directly by URL without a `?id=` query param
// (rather than via a product-card click), which exercises its static-
// fixture fallback path — the only path with deterministic, repeatable
// content for a test, since a specific product's live Mongo `_id` can't be
// pinned reliably here.

async function gotoTripDetail(page: Page, id?: string) {
  await page.goto(id ? `/trip/sample-trip?id=${id}` : "/trip/sample-trip");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
}

test.describe("critical path — browse to payment confirmation", () => {
  test("TripDetail issues exactly one product-detail network request on desktop, despite two components calling useProductData()", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    const productFetches: string[] = [];
    page.on("request", (req) => {
      if (req.url().includes("/api/product?")) productFetches.push(req.url());
    });

    // id doesn't need to resolve to a real product — useProductData() fires
    // the fetch as soon as `id` is present, regardless of what comes back.
    await gotoTripDetail(page, "fake-id-for-fetch-count-check");
    await page.waitForTimeout(500); // let both TripDetail's and DesktopTripDetail's effects fire

    expect(productFetches.length).toBe(1);
  });

  test("walks Trip Detail → Booking → Personal Details → Razorpay Checkout opens correctly", async ({ page, request }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoTripDetail(page);

    await page.getByRole("button", { name: /view batches/i }).click();
    const batchesDialog = page.getByRole("dialog", { name: "Batches" });
    await expect(batchesDialog).toBeVisible();

    // First available (non-"Sold Out") batch in the sheet — clicking "Book
    // Trip" navigates straight to /booking (no intermediate sticky-CTA step).
    await batchesDialog.getByRole("button", { name: "Book Trip" }).first().click();
    // Trip-selection fields ride along as query params too (Next.js has no
    // location.state equivalent) — see TripDetailView's handleContinueBook.
    await expect(page).toHaveURL(/\/booking\?tripTitle=/);
    await expect(page.getByText(/who are you booking for/i)).toBeVisible();

    await page.getByRole("button", { name: /book now/i }).click();

    // Not logged in yet, so this opens the login sheet instead of navigating.
    // Login here is fully client-mocked for dev/test (LoginSheet.tsx's
    // DUMMY_OTP = "1234", surfaced directly in the UI as a dev hint) — no
    // real SMS/OTP backend involved.
    await expect(page.getByRole("heading", { name: /log in or sign up/i })).toBeVisible();
    await page.getByRole("textbox", { name: "Mobile Number" }).fill("9999999999");
    await page.getByRole("button", { name: /request otp/i }).click();
    for (const [i, digit] of ["1", "2", "3", "4"].entries()) {
      await page.getByLabel(`OTP digit ${i + 1}`).fill(digit);
    }
    await page.getByRole("button", { name: /authenticate/i }).click();

    // Phase 5's follow-up carries `?orderId=` here too — the Next.js-compatible
    // fallback for the "refresh loses booking data" fix, now that Booking
    // is a real route under both apps (see useBookingForm.ts).
    await expect(page).toHaveURL(/\/booking\/personal-details\?orderId=/);
    // Reaching this page creates a real booking-draft record (useBookingForm's
    // mount effect) — clean it up so repeat runs don't pile up drafts in the
    // real dev database.
    const ref = new URL(page.url()).searchParams.get("orderId");

    try {
      // Fill the required (asterisked) personal-details fields.
      await page.getByLabel(/first name/i).fill("Test");
      await page.getByLabel(/last name/i).fill("Traveller");
      await page.getByRole("combobox", { name: /gender/i }).selectOption({ index: 1 });
      await page.getByLabel(/date of birth/i).fill("1995-06-15");
      await page.getByLabel(/whatsapp number/i).fill("9999999999");
      await page.getByLabel(/email/i).fill("test@example.com");
      await page.getByRole("checkbox").check();

      await page.getByRole("button", { name: /proceed to pay|pay now/i }).click();

      // WanderOn's own PaymentSheet (payment-plan choice) comes before Razorpay.
      await expect(page.getByRole("dialog", { name: /payment options/i })).toBeVisible();
      await page.getByRole("button", { name: /pay full amount now/i }).click();
      await page.getByRole("button", { name: /continue to pay/i }).click();

      // Razorpay's real hosted Checkout opens in an iframe (the "Test Mode"
      // badge confirms frontend-test mode — real widget, no real charge). It's
      // Razorpay's own multi-step UI (contact details → method → card → any
      // bank-side verification), not something this app controls, so this
      // test stops at confirming OUR side of the integration: Checkout opens,
      // correctly wired, with the right contact step showing. Driving
      // Razorpay's own screens to completion is out of scope here — that's
      // Razorpay's UI to validate, not this app's, and doing so would make
      // this test brittle against a third party we don't control. See the
      // "refresh loses booking data" test below for the coverage that would
      // otherwise require completing a real payment.
      await expect(page.getByText("Test Mode")).toBeVisible({ timeout: 15_000 });
      const razorpayFrame = page.frameLocator("iframe").last();
      await expect(razorpayFrame.getByRole("heading", { name: /contact details/i })).toBeVisible();
    } finally {
      if (ref) await request.delete(`/api/bookings?orderId=${ref}`);
    }
  });

  test("refresh on a booking confirmation URL for an unknown ref still falls back to the fixture (expected, not a bug)", async ({ page }) => {
    // Phase 5 fixed the underlying bug: MyBooking.tsx now fetches the real
    // booking by ref from the server instead of only ever reading React
    // Router `location.state`. This test's ref (WON999999) was never a real
    // persisted booking, so the fetch correctly finds nothing and falls
    // back to the DEFAULTS fixture — that fallback is the intended design
    // for a genuinely-unknown ref, not the bug the old version of this test
    // characterized. See the next test for the actual fix, verified against
    // a ref that *is* real.
    await page.goto("/bookings/WON999999");
    await expect(page.getByText("Shivam Trivedi")).toBeVisible();
  });

  test("refresh on a booking confirmation URL for a REAL ref now shows real persisted data (Phase 5 fix)", async ({ page, request }) => {
    const ref = `WO-E2E-${Date.now()}`;
    const create = await request.post("/api/bookings", {
      data: { orderId: ref, tripTitle: "E2E Refresh-Fix Trip", travelers: 2 },
    });
    expect(create.status()).toBe(204);
    const pay = await request.patch(`/api/bookings?orderId=${ref}`, {
      // A paid booking must carry the user identifier (mobile + email).
      data: {
        status: "paid",
        travellerName: "E2E Refresh Tester",
        amountPaid: "12345",
        phone: "9999999999",
        email: "e2e@example.com",
      },
    });
    expect(pay.status()).toBe(204);

    try {
      // Mobile viewport deliberately: DesktopMyBooking.tsx's "Primary
      // Traveller" card uses its own separate hardcoded PRIMARY_ROWS
      // fixture for name/gender/etc. (pre-existing, unrelated to this fix —
      // Phase 5's scope is the persistence layer, not wiring every
      // already-hardcoded desktop display field to it); the mobile KYC
      // form's pre-filled traveller-name input does exercise the
      // fetch-by-ref fix.
      await page.setViewportSize({ width: 390, height: 844 });
      // No router state, no query param — a bare, fresh navigation, exactly
      // like a hard refresh or a pasted link. The mobile KYC form's
      // traveller-name input is pre-filled straight from `data`, and is
      // always visible regardless of tab/saved state — the trip-title
      // display, by contrast, only renders after "Save Details" (a client
      // interaction this test doesn't perform), so it's not usable here.
      await page.goto(`/bookings/${ref}`);
      await expect(page.locator("#mb-firstName")).toHaveValue("E2E Refresh Tester");
      // And NOT the old hardcoded fixture identity ("Ruhani" on mobile).
      await expect(page.locator("#mb-firstName")).not.toHaveValue("Ruhani");
    } finally {
      // Clean up: this test writes to the real database.
      await request.delete(`/api/bookings?orderId=${ref}`);
    }
  });
});
