import { useState } from "react";
import "./QueryBanner.css";
import ContactFormSheet from "../ContactFormSheet/ContactFormSheet";

export default function QueryBanner() {
  const [formOpen, setFormOpen] = useState(false);

  return (
    <>
      <section className="qb">
        <div className="qb-card">
          <div className="qb-illustration">
            <video
              className="qb-video"
              src="/figma/enquire/contact-animation.mp4"
              autoPlay
              loop
              muted
              playsInline
            />
          </div>
          <div className="qb-body">
            <div className="qb-text">
              <p className="qb-title">Have a query?</p>
              <p className="qb-sub">We are here for You!</p>
            </div>
            <button
              className="qb-btn"
              type="button"
              onClick={() => setFormOpen(true)}
            >
              Enquire Now
            </button>
          </div>
        </div>
      </section>

      <ContactFormSheet isOpen={formOpen} onClose={() => setFormOpen(false)} />
    </>
  );
}
