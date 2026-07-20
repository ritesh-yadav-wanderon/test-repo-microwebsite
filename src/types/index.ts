export type ApiSource = "live" | "sample";

export interface TripDuration {
  nights: number;
  days: number;
}

export interface TripDestination {
  title: string;
  slug: string;
  isInternational?: boolean;
}

export interface Trip {
  slug: string;
  title: string;
  type?: string;
  image: string;
  startingPrice: string;
  pickDropPoint?: string;
  recommended?: boolean;
  optionsAvailable?: number;
  joinedCount?: string;
  firstBatch?: string;
  duration?: TripDuration;
  skeletonItinerary?: string[];
  features?: string[];
  batches?: string[];
  categories?: string[];
  destinations?: TripDestination[];
  womenOnly?: boolean;
}

export interface TripGroup {
  title: string;
  year: string;
  month: string;
  tripsArray: Trip[];
}

export type MonumentKind =
  | "pyramid"
  | "tower-tiered"
  | "torii"
  | "stupa"
  | "arch"
  | "skyscraper"
  | "pagoda";

export interface Destination {
  name: string;
  slug: string;
  kind: MonumentKind;
  categories?: string[];
}

export type MarqueeIconKind = "diversity" | "celebration" | "friends" | "vibes";

export type CategoryIconKind =
  | "grid"
  | "balloon"
  | "diamond"
  | "torii"
  | "lantern"
  | "coconut"
  | "car";

export interface HeroMarqueeItem {
  icon: MarqueeIconKind;
  label: string;
}

export interface HeroVideoConfig {
  src: string;
  poster?: string;
  alt: string;
}

export interface HeroTitleConfig {
  line1: string;
  accent: string;
  suffix: string;
}

export interface HeroSearchConfig {
  placeholder: string;
}

/** Per-page hero configuration. Each route supplies its own hero content and video. */
export interface HeroSectionConfig {
  id: string;
  video: HeroVideoConfig;
  title: HeroTitleConfig;
  search?: HeroSearchConfig;
  marquee?: HeroMarqueeItem[];
  ariaLabel?: string;
}
