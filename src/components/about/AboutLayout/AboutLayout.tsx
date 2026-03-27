"use client";

import type { AboutLayoutProps } from "../types";
import { BrandsSection } from "../BrandsSection/BrandsSection";
import { HeroBanner } from "../HeroBanner/HeroBanner";
import { LocationsSection } from "../LocationsSection/LocationsSection";
import { DestinationsSection } from "../DestinationsSection/DestinationsSection";
import { SectionIntro } from "../SectionIntro/SectionIntro";
import { TeamSection } from "../TeamSection/TeamSection";
import { ValuesSection } from "../ValuesSection/ValuesSection";
import { WarriorsSection } from "../WarriorsSection/WarriorsSection";
import * as S from "./AboutLayout.styles";

export function AboutLayout(props: AboutLayoutProps) {
  const {
    hero,
    sectionIntro,
    destinations,
    team,
    values,
    warriors,
    brands,
    locations,
  } = props;

  return (
    <S.Canvas>
      <S.HeroFrame data-node-id="208:1632">
        <HeroBanner {...hero} />
      </S.HeroFrame>
      <S.MainSurface>
        <SectionIntro {...sectionIntro} />
        <DestinationsSection {...destinations} />
        <TeamSection {...team} />
        <ValuesSection {...values} />
        <WarriorsSection {...warriors} />
        <BrandsSection {...brands} />
        <LocationsSection {...locations} />
      </S.MainSurface>
    </S.Canvas>
  );
}
