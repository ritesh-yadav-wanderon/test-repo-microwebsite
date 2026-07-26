import "./DesktopFooterMsg.css";

const BASE = "/figma/desktop";

/** Grey heart + "Life's a Trip" sign-off and footer base (Figma 5154:26051). */
export default function DesktopFooterMsg() {
  return (
    <>
      <section className="dfmsg">
        <img className="dfmsg__heart" src={`${BASE}/footer-heart.svg`} alt="" />
        <p className="dfmsg__line dfmsg__line--medium">Life's a Trip,</p>
        <p className="dfmsg__line">Let's Make Yours Epic!</p>
      </section>
      <footer className="dfooter-band" />
    </>
  );
}
