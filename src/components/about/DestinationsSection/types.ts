export type DestinationTripCard = {
  id: string;
  title: string;
  priceLabel: string;
  imageSrc: string;
  /** Singapore-style wide crop (Figma `trip-card` with inset image) */
  wideCrop?: boolean;
};

export type DestinationsSectionProps = {
  title: string;
  subtitle: string;
  exploreLabel: string;
  /** Poster / fallback when no video */
  bannerPosterSrc: string;
  bannerPosterAlt?: string;
  /** Optional background video (e.g. hosted URL); poster still used as preload */
  bannerVideoSrc?: string;
  cards: DestinationTripCard[];
  prevArrowIconSrc: string;
  nextArrowIconSrc: string;
  onExploreClick?: () => void;
  /** Fired after the carousel scrolls one step (prev control) */
  onPrevClick?: () => void;
  /** Fired after the carousel scrolls one step (next control) */
  onNextClick?: () => void;
  /** Fired after the card is scrolled into view in the carousel */
  onCardClick?: (id: string) => void;
};
