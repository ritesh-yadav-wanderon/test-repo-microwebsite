"use client";

import Image from "next/image";
import type { ValuesSectionProps } from "../types";
import * as S from "./ValuesSection.styles";

export function ValuesSection({
  titleId = "values-title",
  title,
  lead,
  rows,
  chevronIconSrc,
  onRowClick,
}: ValuesSectionProps) {
  return (
    <S.Section aria-labelledby={titleId} data-node-id="189:1259">
      <S.Intro data-node-id="189:1387">
        <S.Title id={titleId}>{title}</S.Title>
        <S.Lead>{lead}</S.Lead>
      </S.Intro>
      <S.List data-node-id="189:1386">
        {rows.map((row) => (
          <S.Row
            key={row.id}
            type="button"
            onClick={() => onRowClick?.(row.id)}
          >
            <S.Left>
              <S.Index>{row.indexLabel}</S.Index>
              <S.Label>{row.label}</S.Label>
            </S.Left>
            <S.ChevronWrap aria-hidden>
              <Image src={chevronIconSrc} alt="" fill unoptimized />
            </S.ChevronWrap>
          </S.Row>
        ))}
      </S.List>
    </S.Section>
  );
}
