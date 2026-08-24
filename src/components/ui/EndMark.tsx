import "./EndMark.css";

/**
 * "Life's a Trip, Let's Make Yours Epic!" sign-off that closes a page. Three
 * variants ship in the design: the mobile logo lock-up, the desktop grey heart,
 * and the watermark on the desktop account pages.
 */
export type EndMarkVariant = "mobile" | "desktop" | "watermark";

export interface EndMarkProps {
  variant: EndMarkVariant;
}

export default function EndMark({ variant }: EndMarkProps) {
  if (variant === "mobile") {
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

  if (variant === "desktop") {
    return (
      <section className="dfmsg">
        <img className="dfmsg__heart" src="/figma/event/footer-heart.svg" alt="" />
        <p className="dfmsg__line dfmsg__line--medium">Life's a Trip,</p>
        <p className="dfmsg__line">Let's Make Yours Epic!</p>
      </section>
    );
  }

  return (
    <div className="pwm" aria-hidden>
      <img src="/figma/event/footer-heart.svg" width={40} height={40} alt="" />
      <p className="pwm-line pwm-line--medium">Life's a Trip,</p>
      <p className="pwm-line">Let's Make Yours Epic!</p>
    </div>
  );
}
