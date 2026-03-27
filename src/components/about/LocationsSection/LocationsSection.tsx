"use client";

import Image from "next/image";
import type { LocationsSectionProps } from "../types";
import * as S from "./LocationsSection.styles";

export function LocationsSection({
  titleId = "locations-title",
  title,
  lead,
  locations,
  logoSrc,
  dividerSrc,
}: LocationsSectionProps) {
  const [first, second] = locations;

  return (
    <S.Section aria-labelledby={titleId}>
      <S.Intro>
        <S.Title id={titleId}>{title}</S.Title>
        <S.Lead>{lead}</S.Lead>
      </S.Intro>
      <S.Row>
        <S.Card>
          <S.LogoWrap>
            <Image
              src={logoSrc}
              alt=""
              fill
              unoptimized
              style={{ objectFit: "cover" }}
            />
          </S.LogoWrap>
          <S.CityBlock>
            <S.CityName>{first.city}</S.CityName>
            <S.AccentRule aria-hidden />
          </S.CityBlock>
          <S.Address>{first.address}</S.Address>
        </S.Card>
        <S.VDivider aria-hidden>
          <Image
            src={dividerSrc}
            alt=""
            fill
            unoptimized
            style={{ objectFit: "contain" }}
          />
        </S.VDivider>
        <S.Card>
          <S.LogoWrap>
            <Image
              src={logoSrc}
              alt=""
              fill
              unoptimized
              style={{ objectFit: "cover" }}
            />
          </S.LogoWrap>
          <S.CityBlock>
            <S.CityName>{second.city}</S.CityName>
            <S.AccentRule aria-hidden />
          </S.CityBlock>
          <S.Address>{second.address}</S.Address>
        </S.Card>
      </S.Row>
    </S.Section>
  );
}
