import "./PageSkeleton.css";

export type SkeletonVariant =
  | "list"
  | "detail"
  | "destination"
  | "product"
  | "form"
  | "profile"
  | "bookingDetail"
  | "generic";

interface PageSkeletonProps {
  variant?: SkeletonVariant;
}

function HeaderBar({ centerTitle = false }: { centerTitle?: boolean }) {
  return (
    <div className="psk-header">
      <span className="sk psk-h-back" />
      <span className={`sk psk-h-title${centerTitle ? " psk-h-title--center" : ""}`} />
      <span className="sk psk-h-action" />
    </div>
  );
}

function TripCard() {
  return (
    <div className="psk-card">
      <span className="sk psk-card-img" />
      <span className="sk sk-line psk-w90" />
      <span className="sk sk-line psk-w60" />
      <span className="sk sk-line psk-w75" />
      <span className="sk sk-line psk-w50 psk-mt" />
    </div>
  );
}

function Row() {
  return (
    <div className="psk-row">
      <span className="sk sk-circle psk-row-icon" />
      <span className="sk sk-line psk-w40" />
      <span className="sk psk-row-chevron" />
    </div>
  );
}

function Field() {
  return <span className="sk psk-field" />;
}

export default function PageSkeleton({ variant = "generic" }: PageSkeletonProps) {
  if (variant === "list") {
    return (
      <div className="psk" aria-busy="true" aria-label="Loading">
        <HeaderBar />
        <div className="psk-body">
          <span className="sk psk-banner" />
          <div className="psk-grid">
            {Array.from({ length: 6 }, (_, i) => (
              <TripCard key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (variant === "detail") {
    return (
      <div className="psk" aria-busy="true" aria-label="Loading">
        <span className="sk psk-hero" />
        <div className="psk-body">
          <span className="sk sk-line psk-w80 psk-lg" />
          <span className="sk sk-line psk-w50" />
          <div className="psk-chips">
            <span className="sk psk-chip" />
            <span className="sk psk-chip" />
            <span className="sk psk-chip" />
          </div>
          <span className="sk psk-block-160" />
          <span className="sk sk-line psk-w90" />
          <span className="sk sk-line psk-w70" />
          <span className="sk sk-line psk-w80" />
          <span className="sk psk-block-120" />
        </div>
      </div>
    );
  }

  if (variant === "destination") {
    return (
      <div className="psk" aria-busy="true" aria-label="Loading">
        {/* Full-bleed hero with title + city bar (mirrors .dp-hero) */}
        <div className="psk-dhero">
          <span className="sk psk-dhero-img" />
          <div className="psk-dhero-foot">
            <span className="sk psk-dhero-title" />
            <span className="sk psk-dhero-rule" />
            <div className="psk-dhero-cities">
              {Array.from({ length: 5 }, (_, i) => (
                <span key={i} className="sk psk-dhero-city" />
              ))}
            </div>
          </div>
        </div>

        {/* Info card + women strip (mirrors .dp-info) */}
        <div className="psk-body">
          <span className="sk sk-line psk-w40" />
          <span className="sk psk-info-card" />
          <span className="sk psk-women" />
        </div>

        {/* Horizontal trip strip (mirrors .dp-trip-strip / .up-cards) */}
        <div className="psk-strip">
          <span className="sk sk-line psk-w50 psk-lg" />
          <div className="psk-strip-row">
            {Array.from({ length: 3 }, (_, i) => (
              <div className="psk-hcard" key={i}>
                <span className="sk psk-hcard-img" />
                <span className="sk sk-line psk-w90" />
                <span className="sk sk-line psk-w60" />
                <span className="sk sk-line psk-w40 psk-mt" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (variant === "product") {
    return (
      <div className="psk" aria-busy="true" aria-label="Loading">
        {/* Hero with thumb strip + action pills (mirrors .tdp2-hero) */}
        <div className="psk-phero">
          <span className="sk psk-phero-img" />
          <div className="psk-phero-thumbs">
            {Array.from({ length: 4 }, (_, i) => (
              <span key={i} className="sk psk-phero-thumb" />
            ))}
          </div>
          <div className="psk-phero-bar">
            <span className="sk psk-phero-wish" />
            <span className="sk psk-phero-pill" />
            <span className="sk psk-phero-pill" />
          </div>
        </div>

        {/* Trip info card (mirrors .tdp2-ti-card) */}
        <div className="psk-body">
          <span className="sk sk-line psk-w40" />
          <span className="sk sk-line psk-w90 psk-lg" />
          <span className="sk sk-line psk-w60 psk-lg" />
          <div className="psk-chips">
            <span className="sk psk-chip" />
            <span className="sk psk-chip" />
            <span className="sk psk-chip" />
          </div>
          <span className="sk psk-pd" />
          <div className="psk-city-row">
            {Array.from({ length: 4 }, (_, i) => (
              <span key={i} className="sk psk-city-pill" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (variant === "form") {
    return (
      <div className="psk" aria-busy="true" aria-label="Loading">
        <HeaderBar />
        <div className="psk-body">
          <span className="sk sk-line psk-w40 psk-lg" />
          <Field />
          <Field />
          <div className="psk-two">
            <Field />
            <Field />
          </div>
          <Field />
          <div className="psk-two">
            <Field />
            <Field />
          </div>
          <Field />
          <span className="sk psk-cta" />
        </div>
      </div>
    );
  }

  if (variant === "profile") {
    return (
      <div className="psk" aria-busy="true" aria-label="Loading">
        <HeaderBar />
        <div className="psk-body psk-center">
          <span className="sk sk-circle psk-avatar" />
          <span className="sk sk-line psk-w40" />
          <div className="psk-two psk-mt">
            <span className="sk psk-stat" />
            <span className="sk psk-stat" />
          </div>
          <div className="psk-rows">
            {Array.from({ length: 5 }, (_, i) => (
              <Row key={i} />
            ))}
          </div>
          <span className="sk psk-cta" />
        </div>
      </div>
    );
  }

  if (variant === "bookingDetail") {
    return (
      <div className="psk" aria-busy="true" aria-label="Loading">
        <HeaderBar />
        <div className="psk-tabs">
          <span className="sk psk-tab" />
          <span className="sk psk-tab" />
          <span className="sk psk-tab" />
        </div>
        <div className="psk-body">
          <span className="sk psk-tag" />
          <span className="sk psk-block-160" />
          <span className="sk sk-line psk-w90" />
          <span className="sk sk-line psk-w70" />
          <span className="sk sk-line psk-w80" />
          <span className="sk psk-block-120" />
        </div>
      </div>
    );
  }

  // generic
  return (
    <div className="psk" aria-busy="true" aria-label="Loading">
      <HeaderBar />
      <div className="psk-body">
        <span className="sk sk-line psk-w80 psk-lg" />
        <span className="sk sk-line psk-w90" />
        <span className="sk sk-line psk-w70" />
        <span className="sk psk-block-160" />
        <span className="sk sk-line psk-w80" />
        <span className="sk sk-line psk-w60" />
      </div>
    </div>
  );
}
