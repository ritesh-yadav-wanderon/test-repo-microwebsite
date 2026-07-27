import "./EventItinerary.css";

const A = "/figma/event/";

export interface ItineraryDay {
  day: number;
  title: string;
  image?: string;
  highlights: string[];
  meals: string;
}

export const ITINERARY: ItineraryDay[] = [
  { day: 1, title: "Arrival in Paris", image: `${A}gallery-4.jpg`, highlights: ["Day at Leisure", "Millennium Hotel Paris Charles De-Gaulle", "Enjoy your time at Leisure"], meals: "Breakfast" },
  { day: 2, title: "Paris Sightseeing Tour", image: `${A}gallery-7.jpg`, highlights: ["Eiffel Tower & city landmarks", "Seine river walk"], meals: "Breakfast" },
  { day: 3, title: "Day Trip to Disneyland Paris", image: `${A}gallery-9.jpg`, highlights: ["Disneyland Paris"], meals: "Breakfast" },
  { day: 4, title: "Arrive in Amsterdam", image: `${A}gallery-2.jpg`, highlights: ["Brussels Sightseeing Tour", "Visit to Mini Europe"], meals: "Breakfast" },
  { day: 5, title: "Arrive in Frankfurt", image: `${A}gallery-5.jpg`, highlights: ["Keukenhof Gardens", "Amsterdam Canal Cruise"], meals: "Breakfast" },
  { day: 6, title: "Arrive in Switzerland", image: `${A}gallery-8.jpg`, highlights: ["Rhine Falls Boat Tour"], meals: "Breakfast" },
  { day: 7, title: "Excursion to Jungfraujoch", image: `${A}gallery-6.jpg`, highlights: ["Day Trip to Jungfraujoch"], meals: "Breakfast" },
  { day: 8, title: "Departure Day", highlights: ["Check Out from your hotel"], meals: "Breakfast" },
];

interface EventItineraryProps {
  /** When set, each day element gets id={`${dayIdPrefix}${index}`} so a parent
   *  can anchor-scroll to and observe individual days (desktop Day Plan rail). */
  dayIdPrefix?: string;
}

/** Event itinerary day list — shared by the mobile event product page tab and
 *  the desktop event product page itinerary section. */
export default function EventItinerary({ dayIdPrefix }: EventItineraryProps) {
  return (
    <div className="epd-itin">
      {ITINERARY.map((d, i) => (
        <div className="epd-day" key={d.day} id={dayIdPrefix ? `${dayIdPrefix}${i}` : undefined}>
          <div className="epd-day-head">
            <span className="epd-day-badge">Day {d.day}</span>
            <h3 className="epd-day-title">{d.title}</h3>
          </div>
          {d.image && (
            <div className="epd-day-media">
              <img src={d.image} alt={d.title} loading="lazy" />
            </div>
          )}
          <ul className="epd-day-list">
            {d.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
          <div className="epd-day-meal">
            <span className="epd-day-meal-dot" aria-hidden />
            Meals: {d.meals}
          </div>
          {i < ITINERARY.length - 1 && <div className="epd-day-divider" aria-hidden />}
        </div>
      ))}
      <p className="epd-itin-end">End Of the Journey</p>
    </div>
  );
}
