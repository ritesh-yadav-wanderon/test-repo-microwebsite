// Trip product page content (Figma). Read through contentRepository so pages
// never import fixtures directly.

const FIG = "/trip-detail/";
/* hero-thumb-2/3, hero-main and itin-map were byte-identical copies of the
 * trip-hero / itin-section assets, so the shared files are reused instead. */
const HERO_LARGE = "/figma/trip-hero/hero-bg.png";
const HERO_T1 = `${FIG}hero-thumb-1.png`;
const HERO_T2 = "/figma/trip-hero/hero-bg.png";
const HERO_T3 = `${FIG}hero-thumb-1.png`;
const HERO_MAIN = "/figma/trip-hero/hero-bg.png"; // fallback / extra thumb
const ITIN_MAP = "/figma/itin-section/route-map.png";
const CAPTAIN_PHOTO = `${FIG}captain-photo.jpeg`;

export interface DayActivity {
  title: string;
  photos?: string[];
  isLeisure?: boolean;
  leisureDesc?: string;
  leisureDescBold?: string;
  leisurePhotos?: string[];
}
export interface DayItinerary {
  days: string;
  city: string;
  photo: string;
  summary?: string[];
  chips?: string[];
  items: string[];
  description?: string;
  stayName?: string;
  stayNights?: number;
  stayCheckIn?: string;
  stayCheckOut?: string;
  stayPhotos?: string[];
  stayNote?: string;
  stayMeals?: string[];
  activities?: DayActivity[];
  photos?: string[];
}
export interface ProductData {
  title: string;
  heroImages: string[];
  displayPrice: string;
  batchLabel: string;
  breadcrumbs: string[];
  batchCount: string;
  totalBatches: string;
  groupSize: string;
  bestMonths: string;
  inclusions: string[];
  exclusions: string[];
  effort: string;
  tripTypeLabel: string;
  itinerary: DayItinerary[];
  gallery: string[];
  pickUp: string;
  drop: string;
  duration: string;
  cityStrip: string[];
  /** Full mother-itinerary stations, in travel order, for the customiser. */
  motherItinerary: string[];
  /** Nights spent at each mother-itinerary station. */
  motherNights: number[];
  womenBadge: string;
  fitTags: { label: string; rating: number }[];
  mapImage: string;
  captain: { name: string; photo: string; reviews: number; years: number; rating: number };
}

// ── Static page data (Figma) ─────────────────────────────────────────────────
export const STATIC_DATA: ProductData = {
  title: "15 Days Europe Group Trip 2026: Paris, Amsterdam & Switzerland",
  heroImages: [HERO_LARGE, HERO_T1, HERO_T2, HERO_T3, HERO_MAIN],
  displayPrice: "62,999/-",
  batchLabel: "09 May Batch",
  breadcrumbs: ["Wellness", "Europe"],
  batchCount: "Upcoming Batches",
  totalBatches: "12 Batches",
  groupSize: "25",
  bestMonths: "May – September",
  pickUp: "Paris Charles de Gaulle Airport",
  drop: "Budapest Ferenc Liszt International Airport",
  duration: "7N · 8D",
  cityStrip: ["3N Paris", "1N Amsterdam", "3N Switzerland"],
  motherItinerary: [
    "Paris", "Brussels", "Amsterdam", "Cologne", "Heidelberg",
    "Rhine Falls", "Zurich", "Lucerne", "Vienna", "Budapest",
  ],
  motherNights: [3, 1, 2, 1, 1, 1, 2, 2, 2, 3],
  womenBadge: "60% Women travellers have joined!",
  fitTags: [
    { label: "Party & Night Life",   rating: 3 },
    { label: "Nature and Adventure", rating: 4 },
    { label: "City and Culture",     rating: 5 },
  ],
  mapImage: ITIN_MAP,
  inclusions: [
    "9 Nights accommodation in 3-star hotels",
    "Daily breakfast at hotel",
    "All intercity coach transfers",
    "Eiffel Tower (2nd floor) entry ticket",
    "Palace of Versailles entry ticket",
    "Seine River Cruise",
    "Amsterdam city canal cruise",
    "Jungfrau Top of Europe excursion",
    "Lucerne city tour with Chapel Bridge visit",
    "WanderOn Trip Captain throughout the journey",
    "Travel insurance",
  ],
  exclusions: [
    "Water sports or any activity not mentioned in the itinerary.",
    "Any food or beverage not included in the package (alcoholic drinks, mineral water, meals on the highway).",
    "Any cost arising due to natural calamities like landslides, roadblocks etc. (to be borne by the customer).",
    "Anything not mentioned in the inclusions.",
    "Cost arising due to change or delay in flight timings.",
    "International flights and airport taxes (unless specified).",
    "Visa fees and travel documentation charges.",
    "GST (5%) applicable extra.",
    "TCS (5%) applicable extra.",
    "Any expenses of personal nature.",
    "Any additional activities during the tours.",
    "Travel insurance not listed under inclusions.",
  ],
  effort: "Moderate",
  tripTypeLabel: "Europe Group Tour",
  gallery: [HERO_LARGE, HERO_T1, HERO_T2, HERO_T3, HERO_MAIN],
  captain: { name: "WanderOn Captain", photo: CAPTAIN_PHOTO, reviews: 48, years: 5, rating: 4.9 },
  itinerary: [
    {
      days: "Day 1",
      city: "Paris",
      photo: HERO_T1,
      summary: ["Arrival in Paris"],
      chips: ["1N Hotel", "Breakfast"],
      items: ["Day at Leisure"],
      description: "Welcome to Paris! Upon your arrival at the airport, get driven to the hotel. After you check in, relax for some time. Later, you can explore the city on your own. You may visit Le Manoir De Paris, a haunted house where you can engage yourself in various Parisian legends & terrifying stories. Alternatively, you can visit Place des Vosges, one of Paris' oldest and most beautiful squares, which often hosts cultural events, among others. Later, return to the hotel on your own for an overnight stay.",
      stayName: "Millennium Hotel Paris Charles De-Gaulle",
      stayNights: 3,
      stayCheckIn: "2:00 PM",
      stayCheckOut: "11:00 AM",
      stayPhotos: [
        "/figma/itin-section/d1-hotel-1.jpg",
        "/figma/itin-section/d1-hotel-2.jpg",
        "/figma/itin-section/d1-hotel-3.jpg",
        "/figma/itin-section/d1-hotel-4.jpg",
      ],
      stayNote: "Stays will be allocated based on availability or similar category.",
      stayMeals: ["Breakfast", "Dinner"],
      activities: [
        {
          title: "Enjoy your time at Leisure",
          isLeisure: true,
          leisureDesc: "If you're up for it, you can join an optional welcome dinner around the Canal de l'Ourcq / La Villette area, a more local, less touristy side of Paris, or go for a relaxed evening walk along the Seine to kick things off properly.",
          leisureDescBold: "relaxed evening walk along the Seine",
          leisurePhotos: ["/figma/itin-section/d1-leisure.jpg"],
        },
      ],
    },
    {
      days: "Day 2",
      city: "Paris",
      photo: HERO_T2,
      summary: ["Paris Sightseeing Tour"],
      chips: ["1N Hotel", "Breakfast", "5 Activities"],
      items: [
        "Visit to Eiffel Tower & Palace of Versailles",
        "Siene River Cruise",
        "Paris Night Tour",
      ],
      description: "Experience the magic of Paris on this unforgettable tour. Begin by exploring iconic landmarks like Place Vendôme, Opéra Garnier, Champs-Élysées, Arc de Triomphe, & Les Invalides. Next, ascend to the Eiffel Tower\'s 3rd level for stunning city views, then visit the opulent Palace of Versailles, a 17th-century French art & architecture. Later, enjoy a cruise on the Seine River past Notre Dame, the Louvre, and Musée d\'Orsay, and end with a Paris Night Tour, where illuminated monuments truly sparkle.",
      stayName: "Same Accommodation as of Day-1",
      stayMeals: ["Breakfast"],
      activities: [
        {
          title: "1- Paris City Sightseeing Tour - Paris City Tour On A Shared Basis",
          photos: ["/figma/itin-section/d2-a1-1.jpg", "/figma/itin-section/d2-a1-2.jpg", "/figma/itin-section/d2-a1-3.jpg"],
        },
        {
          title: "2- Eiffel Tower Guided Tour With Summit Access",
          photos: ["/figma/itin-section/d2-a2-1.jpg", "/figma/itin-section/d2-a2-2.jpg", "/figma/itin-section/d2-a2-3.jpg"],
        },
        {
          title: "3- Palace of Versailles",
          photos: ["/figma/itin-section/d2-a3-1.jpg", "/figma/itin-section/d2-a3-2.jpg", "/figma/itin-section/d2-a3-3.jpg"],
        },
        {
          title: "4- 1 Hour Seine River Cruise",
          photos: ["/figma/itin-section/d2-a4-1.jpg", "/figma/itin-section/d2-a4-2.jpg", "/figma/itin-section/d2-a4-3.jpg"],
        },
        {
          title: "5- Paris Night Tour On A Shared Basis",
          photos: ["/figma/itin-section/d2-a5-1.jpg", "/figma/itin-section/d2-a5-2.jpg", "/figma/itin-section/d2-a5-3.jpg"],
        },
      ],
    },
    {
      days: "Day 3",
      city: "Paris",
      photo: HERO_T3,
      summary: ["Day Trip to Disneyland Paris"],
      chips: ["1N Hotel", "Breakfast", "1 Activities"],
      items: ["Disneyland Paris"],
      description: "Embark on a magical day trip to Disneyland Paris, where fairy tales come to life. Board your transfer, and once you reach, enjoy thrilling rides, dazzling parades, and live shows across Disneyland Park and Walt Disney Studios Park. Also, meet beloved Disney characters, explore themed lands like Adventureland and Fantasyland, and experience iconic attractions like Pirates of the Caribbean and Space Mountain—making it the perfect escape for all ages. After an amazing time, get driven to the hotel.",
      stayName: "Same Accommodation as of Day-1",
      stayMeals: ["Breakfast"],
      activities: [
        {
          title: "1- Disneyland Paris Visit",
          photos: [
            "/figma/itin-section/d3-a1-1.jpg",
            "/figma/itin-section/d3-a1-2.jpg",
            "/figma/itin-section/d3-a1-3.jpg",
          ],
        },
      ],
    },
    {
      days: "Day 4",
      city: "Amsterdam",
      photo: HERO_MAIN,
      summary: ["Arrive in Amsterdam"],
      chips: ["1N Hotel", "Dinner", "2 Activities"],
      items: [
        "Brussels Sightseeing Tour",
        "Visit to Mini Europe",
      ],
      description: "Post check-out, get driven to Amsterdam with a stop in Brussels. Once there, enjoy a sightseeing tour to discover Grand Place, Europe's most ornate square, renowned for its stunning architecture, and see the stunning Manneken Pis statue. Then, explore Mini-Europe, a one-of-a-kind park featuring over 350 detailed miniature replicas of Europe's top landmarks. After the tour, continue your scenic journey to Amsterdam, and upon arrival, check in to your hotel for an overnight stay.",
      stayName: "Van Der Valk, Amsterdam",
      stayCheckIn: "2:00 PM",
      stayCheckOut: "11:00 AM",
      stayPhotos: [
        "/figma/itin-section/d4-hotel-1.jpg",
        "/figma/itin-section/d4-hotel-2.jpg",
        "/figma/itin-section/d4-hotel-3.jpg",
        "/figma/itin-section/d4-hotel-4.jpg",
      ],
      stayNote: "Stays will be allocated based on availability or similar category.",
      stayMeals: ["Breakfast", "Dinner"],
      activities: [
        {
          title: "1- Brussels City Tour On A Shared Basis",
          photos: [
            "/figma/itin-section/d4-a1-1.jpg",
            "/figma/itin-section/d4-a1-2.jpg",
            "/figma/itin-section/d4-a1-3.jpg",
          ],
        },
        {
          title: "2- Mini Europe Brussels Tour",
          photos: [
            "/figma/itin-section/d4-a2-1.jpg",
            "/figma/itin-section/d4-a2-2.jpg",
            "/figma/itin-section/d4-a2-3.jpg",
          ],
        },
      ],
    },
    {
      days: "Day 5",
      city: "Frankfurt",
      photo: HERO_T1,
      summary: ["Arrive in Frankfurt"],
      chips: ["1N Hotel", "Breakfast", "2 Activities"],
      items: [
        "Keukenhof Gardens",
        "Amsterdam Canal Cruise",
      ],
      description: "After check-out, get driven to visit the famous Keukenhof Gardens, a world-famous floral paradise with vibrant tulips, daffodils, and stunning themed pavilions. Once there, stroll through expansive landscapes and capture picture-perfect blooms. Later, get driven to Amsterdam for a scenic canal cruise, gliding past historic houses and charming bridges—a quintessential Dutch experience. Later, continue your scenic journey to Frankfurt, & upon arrival, check in at your hotel for an overnight stay.",
      stayName: "The Rilano Hotel Munchen",
      stayCheckIn: "2:00 PM",
      stayCheckOut: "11:00 AM",
      stayPhotos: ["/figma/itin-section/d5-hotel-1.jpg", "/figma/itin-section/d5-hotel-2.jpg", "/figma/itin-section/d5-hotel-3.jpg", "/figma/itin-section/d5-hotel-4.jpg"],
      stayNote: "Stays will be allocated based on availability or similar category.",
      stayMeals: ["Breakfast", "Dinner"],
      activities: [
        { title: "1- Keukenhof Tour, Amsterdam On A Shared Basis", photos: ["/figma/itin-section/d5-a1-1.jpg", "/figma/itin-section/d5-a1-2.jpg", "/figma/itin-section/d5-a1-3.jpg"] },
        { title: "2- Amsterdam Canal Cruise On A Shared Basis", photos: ["/figma/itin-section/d5-a2-1.jpg", "/figma/itin-section/d5-a2-2.jpg", "/figma/itin-section/d5-a2-3.jpg"] },
      ],
    },
    {
      days: "Day 6",
      city: "Switzerland",
      photo: HERO_T2,
      summary: ["Arrive in Switzerland"],
      chips: ["1N Hotel", "Breakfast", "2 Activities"],
      items: [
        "Rhine Falls Boat Tour",
      ],
      description: "After check-out, get driven to Central Switzerland with a stop in Heidelberg. Once in Heidelberg, explore its charming Old Town on a walking tour, visiting Market Square and the medieval Church of the Holy Spirit. Continue through the lush Black Forest to Schaffhausen for a thrilling boat tour of Rhine Falls, Europe's largest waterfall, and feel its powerful cascade up close. Later, continue your scenic journey to Switzerland and upon arrival, check in at your hotel for an overnight stay.",
      stayName: "La Maison Suisse Dattingen",
      stayCheckIn: "2:00 PM",
      stayCheckOut: "11:00 AM",
      stayPhotos: ["/figma/itin-section/d6-hotel-1.jpg", "/figma/itin-section/d6-hotel-2.jpg", "/figma/itin-section/d6-hotel-3.jpg", "/figma/itin-section/d6-hotel-4.jpg"],
      stayNote: "Stays will be allocated based on availability or similar category.",
      stayMeals: ["Breakfast", "Dinner"],
      activities: [
        { title: "1- Walking Tour In Heidelberg", photos: ["/figma/itin-section/d6-a1-1.jpg", "/figma/itin-section/d6-a1-2.jpg", "/figma/itin-section/d6-a1-3.jpg"] },
        { title: "2- Rhine Falls Boat Tour, Switzerland On A Shared Basis", photos: ["/figma/itin-section/d6-a2-1.jpg", "/figma/itin-section/d6-a2-2.jpg", "/figma/itin-section/d6-a2-3.jpg"] },
      ],
    },
    {
      days: "Day 7",
      city: "Switzerland",
      photo: HERO_T3,
      summary: ["Excursion to Jungfraujoch"],
      chips: ["1N Hotel", "Breakfast", "1 Activities"],
      items: [
        "Day Trip to Jungfraujoch",
      ],
      description: "Get transferred to Grindelwald Terminal and board the Eiger Express, a state-of-the-art cableway offering stunning mountain views. Continue on a cogwheel train to Jungfraujoch, the highest railway station in Europe. At the top, explore the Ice Palace with its intricate ice sculptures and visit the Sphinx Observatory for breathtaking views of the Aletsch Glacier. After this unforgettable experience, get driven to your hotel in Switzerland for a comfortable overnight stay.",
      stayName: "Same Accommodation as of Day-1",
      stayMeals: ["Breakfast"],
      activities: [
        { title: "1- Day Trip To Jungfraujoch On A Shared Basis", photos: ["/figma/itin-section/d7-a1-1.jpg", "/figma/itin-section/d7-a1-2.jpg", "/figma/itin-section/d7-a1-3.jpg"] },
      ],
    },
    {
      days: "Day 8",
      city: "Departure",
      photo: HERO_MAIN,
      summary: ["Departure Day"],
      chips: ["Breakfast"],
      items: [],
      description: "In the morning, check out from your hotel and get transferred to Zurich airport for your flight back home. This marks the end of your trip.",
      stayName: "Check Out from your hotel",
    },
  ],
};

// ── Shared FAQ copy (reused by the desktop product page) ──────────────────────
export const TDP_FAQS = [
  {
    q: "How early should I book Europe trip packages from India?",
    a: "Three to six months ahead is the right window. It gets you better flight prices, more hotel options, and enough time to sort the Schengen visa without any last-minute panic, especially if you're travelling in summer.",
  },
  {
    q: "Are flights included in Europe trip packages from India?",
    a: "Most WanderOn Europe packages do not include international flights, which keeps the base price transparent and lets you book from your preferred city. Our travel experts can help you find the best flight options to match your batch dates if needed.",
  },
  {
    q: "Do Europe tour packages include Schengen visa assistance?",
    a: "Yes, we provide complete Schengen visa assistance — from preparing your documentation checklist to advising on the right consulate to apply through. Visa approval is subject to the consulate's decision, but we make sure your application is as strong as possible.",
  },
  {
    q: "What visa and travel documents are required for Europe tours from India?",
    a: "You will need a valid Schengen visa, a passport with at least six months of validity beyond your return date, travel insurance with a minimum €30,000 medical coverage, confirmed hotel bookings, flight itineraries, and proof of sufficient funds. Our team will share a complete checklist once your booking is confirmed.",
  },
];
