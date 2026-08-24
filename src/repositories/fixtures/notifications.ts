// In-app notification feed. Read through contentRepository.

const N = "/figma/notifications/";

export type NotificationFilterKey = "all" | "alerts" | "offers" | "promotions";

export const NOTIFICATION_FILTERS: { key: NotificationFilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "alerts", label: "Alerts" },
  { key: "offers", label: "Offers" },
  { key: "promotions", label: "Promotions" },
];

export interface Notification {
  id: string;
  category: Exclude<NotificationFilterKey, "all">;
  title: string;
  body: string[];
  unread?: boolean;
  wave?: boolean;
  thumb?: string;
}

export const NOTIFICATIONS: Notification[] = [
  {
    id: "adventure",
    category: "alerts",
    wave: true,
    unread: true,
    title: "Get Ready for Your Adventure!",
    body: [
      "Your trip to Ladakh is just around the corner. Make sure to check your itinerary and finalize any last-minute preparations. Have a great journey!",
    ],
  },
  {
    id: "complete-booking",
    category: "alerts",
    title: "Complete Your Booking",
    body: [
      "Hi Ritesh, your spot awaiting in Ladakh Trip. Don\u2019t miss out on this opportunity! Complete your booking now and secure your spot.",
    ],
  },
  {
    id: "rediscover",
    category: "promotions",
    thumb: `${N}thumb-ladakh.png`,
    title: "Rediscover Your Favorite Destinations",
    body: [
      "You\u2019ve recently viewed Leh Ladakh Trip Package. Ready to explore more? Don\u2019t miss out on the exciting experiences waiting for you!",
    ],
  },
  {
    id: "exclusive-offers",
    category: "offers",
    title: "Exclusive Offers Just for Your!",
    body: [
      "we have some amazing new deals and offers that we think you\u2019ll love. Check them out and make your next adventure unforgettable.",
    ],
  },
  {
    id: "top-choice",
    category: "promotions",
    title: "Your Top Choice Awaits",
    body: [
      "Turn your dream into reality. Book now and embark on an unforgettable journey!",
      "Leh Ladakh Trip package...",
    ],
  },
];
