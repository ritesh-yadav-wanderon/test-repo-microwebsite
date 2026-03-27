"use client";

import Image from "next/image";
import type { WarriorsSectionProps } from "../types";
import * as S from "./WarriorsSection.styles";

export function WarriorsSection({
  headingId = "warriors-heading",
  heading,
  cards,
}: WarriorsSectionProps) {
  return (
    <S.Section aria-labelledby={headingId}>
      <S.Heading id={headingId}>{heading}</S.Heading>
      <S.Row>
        {cards.map((c) => (
          <S.Card key={c.id} $minH={c.minHeightPx}>
            <S.IconWrap>
              <Image
                src={c.imageSrc}
                alt=""
                fill
                sizes="96px"
                unoptimized
                style={{ objectFit: "contain" }}
              />
            </S.IconWrap>
            <S.Info>
              <S.TitleBlock>
                <S.Title>{c.title}</S.Title>
                <S.AccentRule aria-hidden />
              </S.TitleBlock>
              <S.Body>{c.body}</S.Body>
            </S.Info>
          </S.Card>
        ))}
      </S.Row>
    </S.Section>
  );
}
