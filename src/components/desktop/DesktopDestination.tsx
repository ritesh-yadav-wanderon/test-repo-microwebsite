import { useMemo, useState } from "react";
import type { Trip, TripGroup } from "../../types";
import DesktopNav from "./DesktopNav";
import DesktopTrips from "./DesktopTrips";
import DesktopWhyChooseUs from "./DesktopWhyChooseUs";
import DesktopQuery from "./DesktopQuery";
import DesktopFooterMsg from "./DesktopFooterMsg";
import DesktopPovCarousel, { type PovCard } from "./DesktopPovCarousel";
import "./DesktopDestination.css";

const BASE = "/figma/desktop-dest";

interface Props {
  /** Destination display name, e.g. "Europe". */
  destination: string;
  /** Starting price string, e.g. "₹98,990/-". */
  startingPrice: string;
  /** Travel "vibes"/tags shown in the info bar. */
  vibes: string[];
  /** Destination-filtered trips (already resolved by the page). */
  trips: Trip[];
  loading: boolean;
}

/** Phone-shot travel stories (Figma 5746:7097), rendered with the zoom-in-center
 *  POV carousel (same mechanic as "The Plot"). The centred card reveals a play
 *  button; the featured card also shows a caption. */
const STORIES: PovCard[] = [
  { img: "story-1.jpg" },
  { img: "story-4.jpg" },
  {
    img: "story-1.jpg",
    title: "Monaco F1 Weekend",
    sub: "Singapore Grand Prix Weekend & Curated Luxury Experiences",
  },
  { img: "story-3.jpg" },
  { img: "story-2.jpg" },
];

const FAQS: { q: string; a: string }[] = [
  {
    q: "How do I book a group trip?",
    a: "Pick a batch that suits you, tap Book Now and complete a secure payment. Our travel expert then reaches out to confirm your slot and share the pre-departure details.",
  },
  {
    q: "What is included in the trip cost?",
    a: "Stays, intercity transfers, listed sightseeing, a dedicated trip captain and most meals are included. Flights and personal expenses are shared upfront on every itinerary.",
  },
  {
    q: "Can I customise my itinerary?",
    a: "Yes. For destinations without a scheduled batch — or if you want a private departure — we build a custom itinerary around your dates, group size and budget.",
  },
  {
    q: "What is the cancellation policy?",
    a: "Cancellations are eligible for a partial-to-full refund based on how far you are from departure. The exact slab is listed on each trip's cancellation page.",
  },
];

/** Desktop (≥1024px) Destination landing page — Figma frame 5746:6533.
 *  Rendered by Destination instead of the mobile tree. */
export default function DesktopDestination({
  destination,
  startingPrice,
  vibes,
  trips,
  loading,
}: Props) {
  const [openFaq, setOpenFaq] = useState(0);

  // DesktopTrips flattens TripGroup[] → Trip[]; wrap the pre-filtered list.
  const groups = useMemo<TripGroup[]>(
    () => [{ title: "", year: "", month: "", tripsArray: trips }],
    [trips]
  );
  const seeAllHref = `/search?destination=${encodeURIComponent(destination)}`;
  const enquire = () =>
    window.dispatchEvent(new CustomEvent("wanderon:open-enquire"));

  return (
    <div className="ddpage">
      <DesktopNav />

      {/* ── Hero (Figma 5746:6534) ── */}
      <section className="ddp-hero">
        <img
          className="ddp-hero-img"
          src={`${BASE}/hero.jpg`}
          alt={`Group trips to ${destination}`}
        />
      </section>

      {/* ── Sticky info bar (Figma 5965:23863) ── */}
      <section className="ddp-infobar">
        <div className="ddp-infobar-inner">
          <div className="ddp-info-cols">
            <div className="ddp-info-col">
              <span className="ddp-info-label">Group trips:</span>
              <span className="ddp-info-value">{destination}</span>
            </div>
            <div className="ddp-info-col">
              <span className="ddp-info-label">Starting Price:</span>
              <span className="ddp-info-value">{startingPrice} Per Person</span>
            </div>
            <div className="ddp-info-col">
              <span className="ddp-info-label">Vibes:</span>
              <span className="ddp-info-vibes">
                {vibes.slice(0, 3).map((v) => (
                  <span key={v}>{v}</span>
                ))}
              </span>
            </div>
          </div>
          <button className="ddp-info-enquire" type="button" onClick={enquire}>
            Enquire Now
          </button>
        </div>
      </section>

      {/* ── Trip carousels ── */}
      <DesktopTrips
        trips={groups}
        loading={loading}
        title="Best Summer Deals"
        seeAllHref={seeAllHref}
      />
      <DesktopTrips
        trips={groups}
        loading={loading}
        title="Upcoming Group trips"
        seeAllHref={seeAllHref}
      />

      {/* ── Why Choose Us (shared with homepage) ── */}
      <DesktopWhyChooseUs />

      {/* ── Cultural and Local Voices (Figma 5746:7067) ── */}
      <section className="ddp-culture">
        <div className="ddp-sec-head">
          <h2 className="ddp-sec-title">Cultural and Local Voices</h2>
          <p className="ddp-sec-sub">
            Choose from hundreds of destinations – provided by trusted pros
          </p>
        </div>
        <img className="ddp-cult-collage" src={`${BASE}/cult-collage.png`} alt="" />
        <p className="ddp-cult-quote">
          Eastern Thailand is half mountain, half ocean. Although there aren&rsquo;t
          many provinces here, it still has a lot of amazing sights and stunning
          locations to visit.
        </p>
        <img className="ddp-cult-road" src={`${BASE}/cult-roadstack.png`} alt="" />
      </section>

      {/* ── Stories of our travellers (Figma 5746:7091) ── */}
      <section className="ddp-stories">
        <div className="ddp-sec-head">
          <h2 className="ddp-sec-title">Stories of our travellers</h2>
          <p className="ddp-sec-sub">
            Straight from their phones. Shot mid-trip, not staged.
          </p>
        </div>
        <DesktopPovCarousel
          cards={STORIES}
          base={BASE}
          playIcon={`${BASE}/play-circle.svg`}
          initialCenter={2}
        />
      </section>

      {/* ── FAQs (Figma 5746:7111) ── */}
      <section className="ddp-faq">
        <div className="ddp-sec-head">
          <h2 className="ddp-sec-title">Frequently Asked Questions</h2>
          <p className="ddp-sec-sub">Your Questions, Answered!</p>
        </div>
        <div className="ddp-faq-list">
          {FAQS.map((f, i) => {
            const open = openFaq === i;
            return (
              <div key={f.q} className={`ddp-faq-row${open ? " ddp-faq-row--open" : ""}`}>
                <button
                  type="button"
                  className="ddp-faq-head"
                  aria-expanded={open}
                  onClick={() => setOpenFaq(open ? -1 : i)}
                >
                  <span className="ddp-faq-num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="ddp-faq-q">{f.q}</span>
                  <span className="ddp-faq-toggle" aria-hidden>
                    {open ? "\u2212" : "+"}
                  </span>
                </button>
                {open && <p className="ddp-faq-a">{f.a}</p>}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Enquire CTA (Figma 5746:7149) ── */}
      <DesktopQuery
        title="Your next group is forming."
        sub="Tell us where. We'll find your people."
      />

      <DesktopFooterMsg />
    </div>
  );
}
