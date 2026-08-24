// Events + festivals content (listing hero, artists, event cards).
// Read through contentRepository.

const A = "/figma/events/";

export const EVENT_CATEGORIES = [
  { label: "Music", icon: `${A}cat-music.svg` },
  { label: "Sports", icon: `${A}cat-sports.svg` },
  { label: "Festivals", icon: `${A}cat-festivals.svg` },
] as const;

export const EVENTS_HERO = {
  video:
    "https://wanderon-images.gumlet.io/events-and-festivals/events-and-festivals/tomorrowland-thailand/tomorrowland.mp4",
  poster: `${A}hero-bg.jpg`,
  logo: `${A}hero-logo.svg`,
  title: "Tomorrowland Belgium | ORBYZ",
  location: "Belgium",
};

export const EVENT_ARTISTS = [
  { name: "Billie Eilish", img: `${A}billie.jpg` },
  { name: "Diljit Dosanjh", img: `${A}diljit.jpg` },
  { name: "Ed Sheeran", img: `${A}edsheeran.jpg` },
  { name: "B Praak", img: `${A}bpraak.jpg` },
];

export interface EventItem {
  image: string;
  location: string;
  title: string;
  date: string;
  price: string;
}

export const EVENT_CONCERT: EventItem = {
  image: `${A}event-chainsmokers.jpg`,
  location: "Yashobhoomi | Delhi",
  title: "La Clairière : The Chainsmokers",
  date: "Sat, 06 Jun - Sun, 07 Jun, 10:00 PM",
  price: "₹10,999/-",
};

export const EVENT_FOUNDERS_MEET: EventItem = {
  image: `${A}event-founders.jpg`,
  location: "trident | Gurugram",
  title: "Wanderon: Founders Meet",
  date: "Sat, 06 Jun, 10:00 PM",
  price: "₹10,999/-",
};
