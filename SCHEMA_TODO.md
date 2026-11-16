# Product schema — pending changes

The product page currently shows **made-up placeholder values** for the fields below,
because the `new-trip-data` product documents don't have them yet. Every placeholder
comes from [`src/utils/placeholders.ts`](src/utils/placeholders.ts); each item says
which function to delete once the real field exists.

## Tasks

- [ ] **1. Hotel rating** — add `rating: number` (e.g. `4.8`) to each
  `dayWiseAccommodation[]` entry.
  - Shown as "★ 4.8 customer ratings" under every hotel in *Trip at a Glance → Stay*
    and in the itinerary day cards (mobile + desktop).
  - Today: `placeholderHotelRating(hotelName)`, a stable hash of the hotel name →
    a value between 4.2 and 4.9.
  - When done: map the field in `src/repositories/productDetailMapper.ts`
    (`mapItinerary` → `DayItinerary.stayRating`), pass it to `<HotelRating rating>`,
    and delete `placeholderHotelRating`.

- [ ] **2. Premium-package activities** — mark activities by package tier, e.g.
  `dayWiseActivities[].activities[].packageTier: "budget" | "standard" | "premium"`.
  - Shown greyed out as "(Available for Premium Package)" under *Trip at a Glance →
    Activity*, and as normal activities when Premium is selected (desktop Package Type).
  - Today: `placeholderPremiumActivities(cities, photos)` makes up two activities
    ("Private sunset experience in …", "Guided heritage walk through …") from the
    trip's own cities and photos.
  - When done: derive `TripGlance.premium` from the tier field in
    `tripGlance()` (`src/utils/tripItinerary.ts`) and delete the placeholder.

- [ ] **3. Package types** — the desktop page shows a Budget / Standard / Premium
  selector (Figma 10703:19980). Products only have `packageType: "Fixed Departure"`
  and an empty `accommodationPackageType`.
  - Needed: the list of package tiers a product offers, and per-tier pricing.
  - Today: the selector only toggles the premium activities above; price doesn't change.

- [ ] **4. Trip start / Trip end points** — the desktop page's "Trip start / Trip End"
  row (Figma 10703:19899) shows airports in the design. Products have no pickup/drop
  point, so the row shows the first and last itinerary city.
  - Needed: `pickUpPoint` / `dropPoint` (name, e.g. "Leh Kushok Bakula Rimpochee Airport").

- [ ] **5. Trip-at-a-Glance copy** — Transfers, Trip Captain and Community rows use
  real fields where they exist, but the design copy needs more:
  - Transfers: vehicle class ("Luxury Seat-in-Coach") and a perks line
    ("Airport pickup · fuel & permits sorted"); today `dayWiseTransfer[].mode` + route.
  - Trip Captain: captain tier ("Platinum Star Captain") and trips-led count
    ("40+ Ladakh trips led"); today `tripCaptainHost.name` + `years`.
  - Community: traveller count and age band ("20 travellers, mostly solo, 22–32");
    today the first `socialTag` texts.
