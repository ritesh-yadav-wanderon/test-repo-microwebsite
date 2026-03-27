"use client";

import Image from "next/image";
import type { BrandsSectionProps } from "../types";
import * as S from "./BrandsSection.styles";

export function BrandsSection({
  headingId = "brands-heading",
  heading,
  brands,
}: BrandsSectionProps) {
  return (
    <S.Section aria-labelledby={headingId}>
      <S.Heading id={headingId}>{heading}</S.Heading>
      <S.Row>
        {brands.map((b) => (
          <S.Brand key={b.id} $w={b.widthPx}>
            <S.Mark>
              <Image
                src={b.logoSrc}
                alt=""
                fill
                unoptimized
                style={{ objectFit: "contain" }}
              />
            </S.Mark>
            <S.Caption>{b.name}</S.Caption>
          </S.Brand>
        ))}
      </S.Row>
    </S.Section>
  );
}
