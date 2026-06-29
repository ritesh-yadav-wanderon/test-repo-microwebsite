import "./FooterMessage.css";

export default function FooterMessage() {
  return (
    <section className="ftmsg">
      <div className="ftmsg-icon" aria-hidden>
        <svg viewBox="0 0 40 40" width="40" height="40" fill="none">
          <path
            d="M20 34s-13-8.5-13-16a7 7 0 0 1 13-3.5A7 7 0 0 1 33 18c0 7.5-13 16-13 16z"
            fill="#e8d9cc"
          />
        </svg>
      </div>
      <h2 className="ftmsg-title">
        Life&rsquo;s a Trip,<br />
        Let&rsquo;s Make Yours Epic!
      </h2>
      <div className="ftmsg-illo" aria-hidden>
        <img src="/figma/footer-message.png" alt="" loading="lazy" />
      </div>
    </section>
  );
}
