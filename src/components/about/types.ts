export type HeroBannerProps = {
  backgroundSrc: string;
  title: string;
  backgroundAlt?: string;
};

import type { DestinationsSectionProps } from "./DestinationsSection/types";

export type SectionIntroProps = {
  heading: string;
  paragraphs: string[];
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatarSrc: string;
  objectFit?: "cover" | "contain" | "fill";
  objectPosition?: string;
  linkedinHref: string;
  instagramHref: string;
};

export type TeamSectionProps = {
  headingId?: string;
  heading: string;
  members: TeamMember[];
  linkedInIconSrc: string;
  instagramIconSrc: string;
};

export type ValueRow = {
  id: string;
  indexLabel: string;
  label: string;
};

export type ValuesSectionProps = {
  titleId?: string;
  title: string;
  lead: string;
  rows: ValueRow[];
  chevronIconSrc: string;
  onRowClick?: (id: string) => void;
};

export type WarriorCard = {
  id: string;
  title: string;
  body: string;
  imageSrc: string;
  minHeightPx: number;
};

export type WarriorsSectionProps = {
  headingId?: string;
  heading: string;
  cards: WarriorCard[];
};

export type BrandItem = {
  id: string;
  name: string;
  logoSrc: string;
  widthPx: number;
};

export type BrandsSectionProps = {
  headingId?: string;
  heading: string;
  brands: BrandItem[];
};

export type LocationCard = {
  id: string;
  city: string;
  address: string;
};

export type LocationsSectionProps = {
  titleId?: string;
  title: string;
  lead: string;
  locations: [LocationCard, LocationCard];
  logoSrc: string;
  dividerSrc: string;
};

export type AboutPageProps = {
  hero: HeroBannerProps;
  sectionIntro: SectionIntroProps;
  destinations: DestinationsSectionProps;
  team: TeamSectionProps;
  values: ValuesSectionProps;
  warriors: WarriorsSectionProps;
  brands: BrandsSectionProps;
  locations: LocationsSectionProps;
};

export type AboutLayoutProps = AboutPageProps;
