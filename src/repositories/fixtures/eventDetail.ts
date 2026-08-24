// Event product page content (hero video, things to know, gallery).
// Read through contentRepository.

const A = "/figma/event/";

export const EVENT_HERO_VIDEO =
  "https://wanderon-images.gumlet.io/events-and-festivals/events-and-festivals/tomorrowland-thailand/tomorrowland.mp4";

export const EVENT_DETAIL = {
  title: "Tomorrowland Belgium | ORBYZ",
  dates: "Jul 18, 2026 - Jul 25, 2026 | 7N/8D",
  pickup: "Paris Charles de Gaulle Airport",
  drop: "Budapest Ferenc Liszt International Airport",
  price: "98,990",
  discount: "-10%",
  about:
    "Get ready for the ultimate Euro experience that fuses iconic cities, party vibes, and the legendary Tomorrowland Festival!",
  thingsToKnow: [
    { icon: `${A}tk-included.svg`, label: "Inlcuded", value: "Travel + Stay + Concert Ticket" },
    { icon: `${A}tk-venue.svg`, label: "Venue", value: "De Schorre Recreation Ground, Boom 2850, Belgium" },
    { icon: `${A}tk-crowd.svg`, label: "Crowd", value: "400,000 Fans Expected" },
    { icon: `${A}tk-genre.svg`, label: "Genre", value: "EDM, techno, hardstyle, drum & bass" },
  ],
};

export const EVENT_GALLERY = [
  { src: `${A}gallery-1.jpg`, h: 205 },
  { src: `${A}gallery-2.jpg`, h: 132 },
  { src: `${A}gallery-3.jpg`, h: 205 },
  { src: `${A}gallery-4.jpg`, h: 166 },
  { src: `${A}gallery-5.jpg`, h: 205 },
  { src: `${A}gallery-6.jpg`, h: 142 },
  { src: `${A}gallery-7.jpg`, h: 179 },
  { src: `${A}gallery-8.jpg`, h: 205 },
  { src: `${A}gallery-9.jpg`, h: 134 },
];

export const EVENT_SPOTLIGHT = [`${A}gallery-1.jpg`, `${A}gallery-5.jpg`, `${A}gallery-7.jpg`];
