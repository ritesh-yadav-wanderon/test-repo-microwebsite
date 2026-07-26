import "./DesktopQuery.css";

interface Props {
  title?: string;
  sub?: string;
}

/** "Have a query?" enquiry card (Figma Component 210, 3394:11865). */
export default function DesktopQuery({
  title = "Have a query?",
  sub = "We are here for You!",
}: Props = {}) {
  return (
    <section className="dquery">
      <div className="dquery__card">
        <div className="dquery__copy">
          <h2 className="dquery__title">{title}</h2>
          <p className="dquery__sub">{sub}</p>
          <button
            className="dquery__cta"
            onClick={() => window.dispatchEvent(new CustomEvent("wanderon:open-enquire"))}
          >
            Enquire Now
          </button>
        </div>
        <video
          className="dquery__travellers"
          src="/figma/enquire/contact-animation.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
      </div>
    </section>
  );
}
