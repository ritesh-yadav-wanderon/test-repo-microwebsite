"use client";

import Image from "next/image";
import type { HeroBannerProps } from "../types";
import * as S from "./HeroBanner.styles";

export function HeroBanner({
  backgroundSrc,
  title,
  backgroundAlt = "",
}: HeroBannerProps) {
  return (
    <S.Shell aria-label="About hero">
      <S.Bg aria-hidden />
      <S.HeroImage aria-hidden>
        <Image
          src={backgroundSrc}
          alt={backgroundAlt}
          fill
          priority
          sizes="100vw"
          unoptimized
        />
      </S.HeroImage>
      <S.Overlay aria-hidden />
      <S.Title>{title}</S.Title>
    </S.Shell>
  );
}
