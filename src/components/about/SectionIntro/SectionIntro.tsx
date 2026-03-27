"use client";

import type { SectionIntroProps } from "../types";
import * as S from "./SectionIntro.styles";

export function SectionIntro({ heading, paragraphs }: SectionIntroProps) {
  return (
    <S.Section data-node-id="189:664">
      <S.Heading>{heading}</S.Heading>
      <S.Body>
        {paragraphs.map((text, i) => (
          <p key={i}>{text}</p>
        ))}
      </S.Body>
    </S.Section>
  );
}
