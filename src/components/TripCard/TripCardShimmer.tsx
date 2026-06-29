import "./TripCardShimmer.css";

function Bone({ className }: { className: string }) {
  return <div className={`tc-sh-bone ${className}`} aria-hidden />;
}

export default function TripCardShimmer() {
  return (
    <article className="tc-shimmer" aria-hidden>

      {/* Image area */}
      <Bone className="tc-sh-image" />

      {/* Meta pill */}
      <div className="tc-sh-pill">
        <Bone className="tc-sh-pill-left" />
        <Bone className="tc-sh-pill-right" />
      </div>

      {/* Body */}
      <div className="tc-sh-body">
        <Bone className="tc-sh-title" />
        <Bone className="tc-sh-itin" />

        <div className="tc-sh-features">
          <Bone className="tc-sh-feat" />
          <Bone className="tc-sh-feat" />
          <Bone className="tc-sh-feat tc-sh-feat--short" />
        </div>

        <Bone className="tc-sh-batches" />

        <div className="tc-sh-foot">
          <div className="tc-sh-price">
            <Bone className="tc-sh-price-main" />
            <Bone className="tc-sh-price-sub" />
          </div>
          <Bone className="tc-sh-cta" />
        </div>

        <Bone className="tc-sh-note" />
      </div>
    </article>
  );
}
