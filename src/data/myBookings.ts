/** Shared "My Bookings" list data used by the mobile page and desktop layout. */

export type BookingsTabKey = "upcoming" | "completed" | "cancelled";

export interface BookingSummary {
  ref: string;
  tripTitle: string;
  travelers: number;
  dateRange: string;
  durationLabel: string;
  pickUp: string;
  drop: string;
  paymentStatus: string;
  amountPaid: string;
  dueBalance: string;
  /** Base bucket before any cancellation status is applied. */
  category: "upcoming" | "completed";
}

export const SAMPLE_BOOKINGS: BookingSummary[] = [
  {
    ref: "WON457896",
    tripTitle:
      "11 Days Wanderon Backpacking Trip to Europe - France, Netherlands, Germany, Czechia",
    travelers: 4,
    dateRange: "23 July 2026 - 3 Aug 2026",
    durationLabel: "10N/11D",
    pickUp: "Paris Airport",
    drop: "Prague Airport",
    paymentStatus: "Partially Paid",
    amountPaid: "8,00,000",
    dueBalance: "7,95,116",
    category: "upcoming",
  },
  {
    ref: "WON451288",
    tripTitle: "7 Days Wanderon Bali Escape - Ubud, Seminyak & Nusa Penida",
    travelers: 2,
    dateRange: "12 Sep 2026 - 18 Sep 2026",
    durationLabel: "6N/7D",
    pickUp: "Denpasar Airport",
    drop: "Denpasar Airport",
    paymentStatus: "Partially Paid",
    amountPaid: "1,20,000",
    dueBalance: "1,45,000",
    category: "upcoming",
  },
];

export const BOOKINGS_TABS: { key: BookingsTabKey; label: string }[] = [
  { key: "upcoming", label: "Upcoming" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];
