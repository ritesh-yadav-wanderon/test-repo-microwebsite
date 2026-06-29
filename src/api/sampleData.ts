import type { Destination, TripGroup } from "../types";

// Offline fallback data. Mirrors the real response shapes from the WanderOn
// CMS backend (upcomingTrips) and LF api (misc/destinations) so the UI renders
// even when the live API is unreachable from localhost (e.g. CORS / network).
// Field names match the source codebase: src/utilities/homepage3-data.js.

export const SAMPLE_UPCOMING_TRIPS: TripGroup[] = [
  {
    title: "May 2026",
    year: "2026",
    month: "4",
    tripsArray: [
      {
        slug: "europe-paris-to-budapest",
        title: "15-Day Europe Group Trip 2026: Paris to Budapest",
        type: "International",
        image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=900&q=70&auto=format&fit=crop",
        startingPrice: "₹62,999",
        pickDropPoint: "Paris to Budapest",
        recommended: true,
        optionsAvailable: 2,
        joinedCount: "20+",
        firstBatch: "09 May Batch",
        duration: { nights: 7, days: 8 },
        skeletonItinerary: ["3N Paris", "3N Amsterdam", "3N Prague", "2N Vienna", "3N Budapest"],
        features: ["Disneyland Tour with Eiffel Tower Visit", "Cologne City Tour", "Lake Titisee"],
        batches: ["2026-05-09", "2026-05-12", "2026-05-18", "2026-05-22", "2026-06-06", "2026-06-12"],
        categories: ["Culture", "Luxury"],
      },
      {
        slug: "europe-paris-to-vienna",
        title: "12 Days Europe Group Tour: Paris to Vienna",
        type: "International",
        image: "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?w=900&q=70&auto=format&fit=crop",
        startingPrice: "₹64,999",
        pickDropPoint: "Paris to Vienna",
        recommended: false,
        optionsAvailable: 1,
        joinedCount: "18+",
        firstBatch: "14 May Batch",
        duration: { nights: 9, days: 10 },
        skeletonItinerary: ["3N Paris", "2N Lucerne", "2N Venice", "2N Vienna"],
        features: ["Seine River Cruise", "Swiss Alps Day Trip", "Gondola Ride in Venice"],
        batches: ["2026-05-14", "2026-05-21", "2026-06-04"],
        categories: ["Culture", "Luxury"],
      },
    ],
  },
  {
    title: "June 2026",
    year: "2026",
    month: "5",
    tripsArray: [
      {
        slug: "bali-island-escape",
        title: "7-Day Bali Group Escape: Beaches & Volcanoes",
        type: "International",
        image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=900&q=70&auto=format&fit=crop",
        startingPrice: "₹38,999",
        pickDropPoint: "Denpasar to Denpasar",
        recommended: true,
        optionsAvailable: 3,
        joinedCount: "25+",
        firstBatch: "07 Jun Batch",
        duration: { nights: 6, days: 7 },
        skeletonItinerary: ["2N Kuta", "2N Ubud", "2N Nusa Penida"],
        features: ["Mount Batur Sunrise Trek", "Nusa Penida Island Tour", "Ubud Rice Terraces"],
        batches: ["2026-06-07", "2026-06-15", "2026-06-21"],
        categories: ["Wellness", "Adventure", "Weekend"],
      },
      {
        slug: "ladakh-bike-expedition",
        title: "9-Day Leh Ladakh Bike Expedition",
        type: "Domestic",
        image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=900&q=70&auto=format&fit=crop",
        startingPrice: "₹32,999",
        pickDropPoint: "Leh to Leh",
        recommended: false,
        optionsAvailable: 2,
        joinedCount: "30+",
        firstBatch: "12 Jun Batch",
        duration: { nights: 8, days: 9 },
        skeletonItinerary: ["2N Leh", "1N Nubra", "1N Pangong", "2N Leh"],
        features: ["Khardung La Pass Ride", "Pangong Lake Camping", "Nubra Valley Safari"],
        batches: ["2026-06-12", "2026-06-19", "2026-06-26"],
        categories: ["Adventure"],
      },
    ],
  },
];

export const SAMPLE_DOMESTIC_DESTINATIONS: Destination[] = [
  { name: "Ladakh", slug: "Ladakh", kind: "stupa", categories: ["Adventure"] },
  { name: "Manali", slug: "Manali", kind: "stupa", categories: ["Adventure", "Weekend"] },
  { name: "Rajasthan", slug: "Rajasthan", kind: "arch", categories: ["Culture", "Luxury"] },
  { name: "Kerala", slug: "Kerala", kind: "tower-tiered", categories: ["Wellness", "Culture"] },
  { name: "Rishikesh", slug: "Rishikesh", kind: "stupa", categories: ["Adventure", "Wellness"] },
  { name: "Goa", slug: "Goa", kind: "arch", categories: ["Weekend", "Wellness"] },
  { name: "Sikkim", slug: "Sikkim", kind: "pagoda", categories: ["Adventure", "Festival"] },
];

export const SAMPLE_INTERNATIONAL_DESTINATIONS: Destination[] = [
  { name: "Egypt", slug: "Egypt", kind: "pyramid", categories: ["Culture", "Adventure"] },
  { name: "Bali", slug: "Bali", kind: "tower-tiered", categories: ["Wellness", "Adventure", "Weekend"] },
  { name: "Japan", slug: "Japan", kind: "torii", categories: ["Culture", "Festival"] },
  { name: "Thailand", slug: "Thailand", kind: "stupa", categories: ["Wellness", "Festival", "Weekend"] },
  { name: "Europe", slug: "Europe", kind: "arch", categories: ["Culture", "Luxury"] },
  { name: "Dubai", slug: "Dubai", kind: "skyscraper", categories: ["Luxury", "Weekend"] },
  { name: "Vietnam", slug: "Vietnam", kind: "pagoda", categories: ["Culture", "Adventure"] },
];
