import "./DesktopQuery.css";

const BASE = "/figma/desktop";

/** "Have a query?" enquiry card (Figma Component 210, 3394:11865). */
export default function DesktopQuery() {
  return (
    <section className="dquery">
      <div className="dquery__card">
        <div className="dquery__copy">
          <h2 className="dquery__title">Have a query?</h2>
          <p className="dquery__sub">We are here for You!</p>
          <button
            className="dquery__cta"
            onClick={() => window.dispatchEvent(new CustomEvent("wanderon:open-enquire"))}
          >
            Enquire Now
          </button>
        </div>
        <img
          className="dquery__travellers"
          src={`${BASE}/query-travellers.png`}
          alt="WanderOn trip captains"
          loading="lazy"
        />
      </div>
    </section>
  );
}
