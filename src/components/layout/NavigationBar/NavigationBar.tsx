"use client";

import Image from "next/image";
import type { NavigationBarProps } from "@/components/layout/types";
import * as S from "./NavigationBar.styles";

export function NavigationBar({
  logoSrc,
  logoAlt,
  searchPlaceholder,
  searchIconSrc,
  topLinks,
  onTopLinkClick,
  phoneHref,
  phoneLabel,
  callIconSrc,
  categories,
  chevronIconSrc,
  onCategoryClick,
}: NavigationBarProps) {
  return (
    <S.NavRoot>
      <S.TopRow>
        <S.TopInner>
          <S.LeftCluster>
            <S.LogoWrap>
              <Image
                src={logoSrc}
                alt={logoAlt}
                fill
                sizes="64px"
                style={{ objectFit: "cover" }}
                unoptimized
              />
            </S.LogoWrap>
            <S.SearchField role="search">
              <S.SearchPlaceholder>{searchPlaceholder}</S.SearchPlaceholder>
              <Image
                src={searchIconSrc}
                alt=""
                width={20}
                height={20}
                unoptimized
              />
            </S.SearchField>
          </S.LeftCluster>
          <S.RightCluster>
            <S.MolNavLinks aria-label="Primary">
              {topLinks.map((link) =>
                onTopLinkClick ? (
                  <S.NavLinkButton
                    key={link.id}
                    type="button"
                    onClick={() => onTopLinkClick(link.id)}
                  >
                    {link.label}
                  </S.NavLinkButton>
                ) : (
                  <S.NavLinkText key={link.id}>{link.label}</S.NavLinkText>
                ),
              )}
            </S.MolNavLinks>
            <S.CallButton href={phoneHref}>
              <Image
                src={callIconSrc}
                alt=""
                width={16}
                height={16}
                unoptimized
              />
              {phoneLabel}
            </S.CallButton>
          </S.RightCluster>
        </S.TopInner>
      </S.TopRow>
      <S.BottomRow>
        <S.CategoryRow aria-label="Trip categories">
          {categories.map((cat) =>
            onCategoryClick ? (
              <S.CategoryItemButton
                key={cat.id}
                type="button"
                onClick={() => onCategoryClick(cat.id)}
              >
                {cat.label}
                {cat.showChevron ? (
                  <Image
                    src={chevronIconSrc}
                    alt=""
                    width={16}
                    height={16}
                    unoptimized
                  />
                ) : null}
              </S.CategoryItemButton>
            ) : (
              <S.CategoryItemText key={cat.id}>
                {cat.label}
                {cat.showChevron ? (
                  <Image
                    src={chevronIconSrc}
                    alt=""
                    width={16}
                    height={16}
                    unoptimized
                  />
                ) : null}
              </S.CategoryItemText>
            ),
          )}
        </S.CategoryRow>
      </S.BottomRow>
    </S.NavRoot>
  );
}
