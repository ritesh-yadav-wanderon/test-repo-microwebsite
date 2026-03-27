import { figmaSrc } from "@/lib/figmaAssets";
import type { AboutPageProps } from "../types";

const f = figmaSrc;

const bio =
  "Govind is a visionary travelpreneur with an experience of leading more than 200 community trips. He’s fond of all kinds of voyages, yet his favourite are motorbiking expeditions, hence he accounts for 30000kms of extreme rides.He can hold a conversation around business,human values and almost everything one can think of. The man knows how to get down to work and party, equally well.";

/**
 * About page body only (hero + sections). Header and footer live in root layout via
 * `siteNavigation` / `siteFooter` in `src/data/siteLayout.ts`.
 */
export const aboutPageContent: AboutPageProps = {
  hero: {
    backgroundSrc: f("6e27ab3204ede1f9de413c4c0774df4b0269b433.png"),
    title: "About Us",
    backgroundAlt: "",
  },
  sectionIntro: {
    heading: "What do we stand for and how did we reach to it?",
    paragraphs: [
      "Remember the days when we used to fill our slam-books with career aspirations like scientist, teacher and doctor? Nobody at that time thought there could’ve been a career in Travelling, let alone being a travelpreneur! But as life happens, you understand that a career could be anything where you can be a problem-solver for the society.",
      "\u00a0",
      "And that’s how a few engineers from NIT Kurukshetra found that the travel industry in India needed a fresh burst of young energy! The need of the hour was to convert a dispersed agent based model to a more friendly ,transparent and an accessible community for Indian travellers, and hence WanderOn. Let’s have a closer look at the hustlers who’re on a mission to stir up people’s life with memorable experiences.",
    ],
  },
  destinations: {
    title: "International Trips",
    subtitle: "Click to book your dream vacation",
    exploreLabel: "Explore",
    bannerPosterSrc: f("303eb01bc37f9ca145ce22e485986609128f9692.png"),
    bannerPosterAlt: "",
    cards: [
      {
        id: "vietnam",
        title: "Vietnam",
        priceLabel: "Starting Price Rs. 49,000/-",
        imageSrc: f("303eb01bc37f9ca145ce22e485986609128f9692.png"),
      },
      {
        id: "bali",
        title: "Bali",
        priceLabel: "Starting Price Rs. 49,000/-",
        imageSrc: f("852ea8424ba94796bc1fb90dc993145be35781e2.png"),
      },
      {
        id: "dubai",
        title: "Dubai",
        priceLabel: "Starting Price Rs. 49,000/-",
        imageSrc: f("39c540dc43433d5d8bd67ea619b049a398ca5c28.png"),
      },
      {
        id: "maldives",
        title: "Maldives",
        priceLabel: "Starting Price Rs. 49,000/-",
        imageSrc: f("4671c90389ee89d8d2d92339a776fc912dd06171.png"),
      },
      {
        id: "singapore",
        title: "Singapore",
        priceLabel: "Starting Price Rs. 49,000/-",
        imageSrc: f("11456deabf8c3df8305266e3db3ecd4893278355.png"),
        wideCrop: true,
      },
      {
        id: "singapore-extra-1",
        title: "Singapore",
        priceLabel: "Starting Price Rs. 49,000/-",
        imageSrc: f("11456deabf8c3df8305266e3db3ecd4893278355.png"),
        wideCrop: true,
      },
      {
        id: "singapore-extra-2",
        title: "Singapore",
        priceLabel: "Starting Price Rs. 49,000/-",
        imageSrc: f("11456deabf8c3df8305266e3db3ecd4893278355.png"),
        wideCrop: true,
      },
    ],
    prevArrowIconSrc: f("65806b52dedc310bf3a5bdca3128f38df81770e1.svg"),
    nextArrowIconSrc: f("63aa3f8b931038d3483157ef9ef02bdd5ee96b7a.svg"),
  },
  team: {
    headingId: "team-heading",
    heading: "Meet Our Team. The ideal set of extraordinary people",
    linkedInIconSrc: f("48dc7db5deb1d83a287718fbc13caf48686a1375.svg"),
    instagramIconSrc: f("d2a746c642168032d16b79e0f0803484a697a1e0.svg"),
    members: [
      {
        id: "govind",
        name: "Govind Gaur",
        role: "CEO, Founder",
        bio,
        avatarSrc: f("bfb0e0abf390abe7b064c4b28afd2cc7ed16cec0.png"),
        linkedinHref: "#",
        instagramHref: "#",
      },
      {
        id: "madhusudan",
        name: "Madhusudan Jaju",
        role: "Head of Finance",
        bio,
        avatarSrc: f("17b7a941ce24fc89fefabbb73c43ee37815f75e0.png"),
        linkedinHref: "#",
        instagramHref: "#",
      },
      {
        id: "chirag",
        name: "Chirag Jain",
        role: "Head of Operations",
        bio,
        avatarSrc: f("51c641e5c316a8facde208b44ecaa0a2e0499d1c.png"),
        objectPosition: "center",
        linkedinHref: "#",
        instagramHref: "#",
      },
      {
        id: "ravi",
        name: "Ravi Khokher",
        role: "Head of Technology",
        bio,
        avatarSrc: f("178aea7b3a18a094e6d3da0ee55c27e5565c9ae2.png"),
        linkedinHref: "#",
        instagramHref: "#",
      },
      {
        id: "nancy",
        name: "Nancy Sahota",
        role: "Head of Content",
        bio,
        avatarSrc: f("55a63ab143217b6b97190367e97bdc99930d1deb.png"),
        linkedinHref: "#",
        instagramHref: "#",
      },
      {
        id: "gaurav",
        name: "Gaurav Singh",
        role: "Director of Community Experiences",
        bio,
        avatarSrc: f("51870abfb258805eedc6c793acd976bd9b6e1b1d.png"),
        linkedinHref: "#",
        instagramHref: "#",
      },
      {
        id: "varsha",
        name: "Varsha Shrivastava",
        role: "Director of Personalized Experiences",
        bio,
        avatarSrc: f("7bcd3c3a477128d2a30d44f34635a4b98e15aa50.png"),
        linkedinHref: "#",
        instagramHref: "#",
      },
      {
        id: "madhuri",
        name: "Madhuri Mulwani",
        role: "Vice President of Sales",
        bio,
        avatarSrc: f("03b112e2860cd20770049db9aeb3125eaeff4c6b.png"),
        linkedinHref: "#",
        instagramHref: "#",
      },
    ],
  },
  values: {
    titleId: "values-title",
    title: "Here’s to the VALUES we strive for",
    lead:
      "There are a whole lot of values and visions that one develops during their college days, which are otherwise rare to cultivate. It is these values that brought together a few engineers from NIT Kurukshetra, who took upon themselves the task to revolutionize the Indian Travel Industry. The result? A successful establishment of a travel community that the youth can identify with. Have a look at the values we swear by",
    chevronIconSrc: f("85ee3c73e37c4f1f980ed41b6aa570de832616e3.svg"),
    rows: [1, 2, 3, 4, 5].map((n) => ({
      id: `value-${n}`,
      indexLabel: "01",
      label: "Community Experience",
    })),
  },
  warriors: {
    headingId: "warriors-heading",
    heading:
      "Our WARRIORS who have helped us build this holistic community",
    cards: [
      {
        id: "captains",
        title: "Trip Captains",
        body:
          "Our trip captains are nothing short of heroes. Brave, dynamic, and great leaders, they’re certainly the showrunners of the community trips. They’ve been handpicked from India’s best travel institutes, and know all tricks of trade to lead and manage all kinds of trips, including biking and trekking expeditions.",
        imageSrc: f("b0e0d08ea2d5be4dc759342298718cb2502060bc.png"),
        minHeightPx: 373,
      },
      {
        id: "vendors",
        title: "Local Vendors",
        body:
          "Being the bridge between the local vendors and the customers, we’re very selective about the former. After a rigorous recci, we’ve found the most kind and hospitable vendors, who make our travelers feel at home, even when they might be miles away from it. Over the period of time, we’ve managed to make a family-like relationship with our vendors, thus giving back to the local community in every way possible!",
        imageSrc: f("ca6baddaa148432fb8082fb30e78e683900970fa.png"),
        minHeightPx: 442,
      },
      {
        id: "drivers",
        title: "Transport Drivers",
        body:
          "We understand the responsibility of taking utmost care of our travelers when they’re off to experience the toughest terrains of the country. Hence everything depends on the competency of our drivers. All the drivers at WanderOn are local professionals, who’ve been in practice since years, and we assure that they know all nooks and corners of the roads by heart!",
        imageSrc: f("f05cfc9ca4cd313477dc7c29ec65643f7b66e3f9.png"),
        minHeightPx: 425,
      },
    ],
  },
  brands: {
    headingId: "brands-heading",
    heading: "BRANDS who trust us",
    brands: [
      {
        id: "tvs",
        name: "TVS",
        logoSrc: f("9e3eb5110d6f84e6c283ac7bc385409044093691.png"),
        widthPx: 134,
      },
      {
        id: "concentrix",
        name: "Concentrix",
        logoSrc: f("d3c8ae12f43d4529bb774702bce11efd312ef2ac.svg"),
        widthPx: 262,
      },
      {
        id: "springworks",
        name: "Springworks",
        logoSrc: f("52c996e9ec7c76bb208b60455f65a258dd7ba7bd.png"),
        widthPx: 142,
      },
      {
        id: "paytm",
        name: "Paytm",
        logoSrc: f("5b886c4c2a85d2bb96ab39fee969a4c87196209f.svg"),
        widthPx: 165,
      },
    ],
  },
  locations: {
    titleId: "locations-title",
    title: "Where, We Call Home",
    lead:
      "A passionate group of professionals and experts, all driven by a commitment to crafting exceptional travel experience - where collaboration, creativity and culture thrive.",
    logoSrc: f("5db605581f3bea4a33a0e64b17437646cdc40e94.png"),
    dividerSrc: f("ec582a688ee351e19cba880166073cc0cfdca956.svg"),
    locations: [
      {
        id: "gurugram",
        city: "Gurugram",
        address:
          "3rd Floor, Building No-436, Phase IV, Udyog Vihar, Sector-18, Gurugram, Haryana-122015",
      },
      {
        id: "jaipur",
        city: "Jaipur",
        address:
          "1st Floor - B-3 Sundar Nagar, Opposite Patel Marg, New Sanganer Rd, Manyawas, Mansarovar, Jaipur, Rajasthan 302020",
      },
    ],
  },
};
