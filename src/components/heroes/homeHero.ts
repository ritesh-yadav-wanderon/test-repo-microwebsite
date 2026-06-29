import type { HeroSectionConfig } from "../../types";

/** Homepage hero — Figma node 3014:9030 */
export const homeHero: HeroSectionConfig = {
  id: "home",
  ariaLabel: "Home hero",
  video: {
    src: "https://video.gumlet.io/67fd03cdb6d587c54aff26af/69f057534d5bf5db18cd1e95/main.m3u8",
    poster: "/figma/hero.png",
    alt: "WanderOn community travellers",
  },
  title: {
    line1: "Trip is the destination.",
    accent: "Community",
    suffix: " is the point!",
  },
  search: {
    placeholder: "Search destination, dates, budget...",
  },
  marquee: [
    { icon: "diversity", label: "Curated Community Trips" },
    { icon: "celebration", label: "Unforgettable Experiences" },
    { icon: "friends", label: "Wanderon Community Trips" },
    { icon: "vibes", label: "Lifelong Friendships" },
    { icon: "diversity", label: "Great Vibes" },
  ],
};
