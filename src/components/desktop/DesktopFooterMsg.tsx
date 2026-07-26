import "./DesktopFooterMsg.css";

/** Grey heart + "Life's a Trip" sign-off (Figma 5154:26051). */
export default function DesktopFooterMsg() {
  return (
    <section className="dfmsg">
      <img className="dfmsg__heart" src="/figma/event/footer-heart.svg" alt="" />
      <p className="dfmsg__line dfmsg__line--medium">Life's a Trip,</p>
      <p className="dfmsg__line">Let's Make Yours Epic!</p>
    </section>
  );
}
