// Side-by-side trip comparison content. Read through contentRepository.

const P = "/figma/compare/";

export interface InclusionPill {
  icon: string;
  label: string;
}

export interface ItineraryDay {
  day: number;
  place: string;
}

export interface Experience {
  img: string;
  label: string;
}

export interface ComparableTrip {
  id: number;
  image: string;
  title: string;
  price: string;
  days: string;
  places: string;
  groupSize: string;
  inclusions: InclusionPill[];
  itinerary: ItineraryDay[];
  experiences: Experience[];
}

export const COMPARE_INCLUSIONS: InclusionPill[] = [
  { icon: `${P}icon-concierge.svg`, label: "9N Accommodation" },
  { icon: `${P}icon-meal.svg`, label: "12 Meals" },
  { icon: `${P}icon-taxi.svg`, label: "10 Shared Transfers" },
  { icon: `${P}icon-hiking.svg`, label: "12 Activities" },
  { icon: `${P}icon-guide.svg`, label: "Trip Captains, Local Guides" },
];

export const COMPARE_ITINERARY: ItineraryDay[] = [
  { day: 1, place: "London" },
  { day: 2, place: "Paris" },
  { day: 3, place: "Paris" },
  { day: 4, place: "Swiss Alps" },
  { day: 5, place: "Beaujolais Wine Region" },
  { day: 6, place: "Barcelona" },
  { day: 7, place: "French Riviera" },
  { day: 8, place: "Florence" },
];

export const COMPARE_EXPERIENCES: Experience[] = [
  { img: `${P}exp-1.png`, label: "Paris City Sightseeing Tour - Paris City Tour On A Shared Basis" },
  { img: `${P}exp-2.png`, label: "Eiffel Tower Guided Tour With Summit Access" },
  { img: `${P}exp-3.png`, label: "Palace of Versailles" },
  { img: `${P}exp-4.png`, label: "1 Hour Seine River Cruise" },
  { img: `${P}exp-4.png`, label: "Paris Night Tour On A Shared Basis" },
];

export const COMPARE_TRIPS: ComparableTrip[] = [
  {
    id: 1,
    image: `${P}trip-hero.jpg`,
    title: "8-Day Europe Group Trip 2026: Paris to Budapest",
    price: "Rs.98,990/- Per Person",
    days: "7 Nights / 8 Days",
    places: "Paris, Amsterdam, Prague, Vienna, Budapest",
    groupSize: "50 People",
    inclusions: COMPARE_INCLUSIONS,
    itinerary: COMPARE_ITINERARY,
    experiences: COMPARE_EXPERIENCES,
  },
  {
    id: 2,
    image: `${P}trip-hero.jpg`,
    title: "12-Day European Discovery 2026: Paris to Budapest",
    price: "Rs.1,20,000/- Per Person",
    days: "11 Nights / 12 Days",
    places: "England, France, Netherlands, Germany, Italy, Switzerland",
    groupSize: "50 People",
    inclusions: COMPARE_INCLUSIONS,
    itinerary: COMPARE_ITINERARY,
    experiences: COMPARE_EXPERIENCES,
  },
];
