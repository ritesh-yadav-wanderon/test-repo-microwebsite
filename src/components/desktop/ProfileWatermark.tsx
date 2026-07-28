import "./ProfileWatermark.css";

/** Grey heart + "Life's a Trip" sign-off pinned to the end of the page.
 *  Shared by the desktop profile and bookings pages (Figma 3996:12266). */
export default function ProfileWatermark() {
  return (
    <div className="pwm" aria-hidden>
      <img src="/figma/event/footer-heart.svg" width={40} height={40} alt="" />
      <p className="pwm-line pwm-line--medium">Life's a Trip,</p>
      <p className="pwm-line">Let's Make Yours Epic!</p>
    </div>
  );
}
