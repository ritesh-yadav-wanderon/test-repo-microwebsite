import "./FooterMessage.css";

export default function FooterMessage() {
  return (
    <section className="ftmsg">
      <img
        src="/figma/footer-msg/logo-black.png"
        alt="WanderOn"
        className="ftmsg-logo"
        width={40}
        height={40}
      />
      <div className="ftmsg-title">
        <p className="ftmsg-line1">Life&rsquo;s a Trip,</p>
        <p className="ftmsg-line2">Let&rsquo;s Make Yours Epic!</p>
      </div>
    </section>
  );
}
