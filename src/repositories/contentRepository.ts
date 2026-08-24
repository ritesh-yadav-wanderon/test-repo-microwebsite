// Editorial and product content that has no API behind it yet: the trip
// product page, comparison table, events, notifications, reviews and the
// country dialling list. Pages read content from here so swapping a fixture for
// a CMS call later is a change inside this folder.

import { STATIC_DATA, TDP_FAQS } from "./fixtures/tripProduct";
import { COMPARE_TRIPS } from "./fixtures/compare";
import {
  EVENT_ARTISTS,
  EVENT_CATEGORIES,
  EVENT_CONCERT,
  EVENT_FOUNDERS_MEET,
  EVENTS_HERO,
} from "./fixtures/events";
import {
  EVENT_DETAIL,
  EVENT_GALLERY,
  EVENT_HERO_VIDEO,
  EVENT_SPOTLIGHT,
} from "./fixtures/eventDetail";
import { NOTIFICATIONS, NOTIFICATION_FILTERS } from "./fixtures/notifications";
import { REVIEWS, REVIEW_TABS } from "./fixtures/reviews";
import { COUNTRIES } from "./fixtures/countries";
import type { ProductData } from "./fixtures/tripProduct";

export type {
  DayActivity,
  DayItinerary,
  ProductData,
} from "./fixtures/tripProduct";
export type {
  ComparableTrip,
  Experience,
  InclusionPill,
  ItineraryDay,
} from "./fixtures/compare";
export type { EventItem } from "./fixtures/events";
export type { Notification, NotificationFilterKey } from "./fixtures/notifications";
export type { Review } from "./fixtures/reviews";
export type { Country } from "./fixtures/countries";

export {
  STATIC_DATA,
  TDP_FAQS,
  COMPARE_TRIPS,
  EVENTS_HERO,
  EVENT_CATEGORIES,
  EVENT_ARTISTS,
  EVENT_CONCERT,
  EVENT_FOUNDERS_MEET,
  EVENT_DETAIL,
  EVENT_GALLERY,
  EVENT_HERO_VIDEO,
  EVENT_SPOTLIGHT,
  NOTIFICATIONS,
  NOTIFICATION_FILTERS,
  REVIEWS,
  REVIEW_TABS,
  COUNTRIES,
};

/** Product content for a trip page. Slug-agnostic while the CMS is not wired. */
export function getTripProduct(): ProductData {
  return STATIC_DATA;
}

/** FAQs shown on the product page (mobile and desktop share the copy). */
export function getTripFaqs() {
  return TDP_FAQS;
}

export function getComparableTrips() {
  return COMPARE_TRIPS;
}

export function getNotifications() {
  return NOTIFICATIONS;
}

/** Traveller reviews, newest first. `limit` trims the list for compact strips. */
export function getReviews(limit?: number) {
  return typeof limit === "number" ? REVIEWS.slice(0, limit) : REVIEWS;
}

export function getCountries() {
  return COUNTRIES;
}
