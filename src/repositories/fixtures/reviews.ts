// Traveller reviews. One canonical list feeds the mobile TribeStories strip,
// the reviews sheet, the desktop "Why choose us" carousel and the desktop
// reviews modal; each surface renders the fields it needs.

export interface Review {
  name: string;
  date: string;
  rating: string;
  text: string;
}

export const REVIEWS: Review[] = [
  {
    name: "Shrutika Parab",
    date: "May, 2026",
    rating: "5.0",
    text: "Thank you Team Wanderon for the amazing Ladakh Experience. Thank you Team Wanderon for the amazing Ladakh Experience. Right from the point of making the...",
  },
  {
    name: "Priya Sharma",
    date: "Apr, 2026",
    rating: "5.0",
    text: "An absolutely incredible trip to Spiti Valley! The team was professional and the experience was beyond expectations. Highly recommend WanderOn to everyone...",
  },
  {
    name: "Rahul Mehta",
    date: "Mar, 2026",
    rating: "4.0",
    text: "WanderOn made our Europe trip seamless and memorable. From Paris to Budapest, every detail was taken care of. The community vibe was amazing...",
  },
  {
    name: "Anjali Verma",
    date: "Feb, 2026",
    rating: "5.0",
    text: "Every detail of the Bhutan trip was thought through — the stays, the local guides, the pace. Easily the smoothest group trip I have been on...",
  },
];

/** Review filter tabs above the reviews list. */
export const REVIEW_TABS = [
  "All",
  "Solo Travellers (8)",
  "Women Travellers (12)",
  "Adventure",
  "Wellness",
  "Festival",
  "Luxury",
  "Romantic",
  "Cultural",
];
