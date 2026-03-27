"use client";

import Image from "next/image";
import type { FooterLinkItem, SiteFooterProps } from "@/components/layout/types";
import * as S from "./SiteFooter.styles";

function FooterListItem({ link }: { link: FooterLinkItem }) {
  if (link.href) {
    return (
      <li>
        <S.FooterLink href={link.href}>{link.label}</S.FooterLink>
      </li>
    );
  }
  if (link.onClick) {
    return (
      <li>
        <S.FooterLinkButton type="button" onClick={link.onClick}>
          {link.label}
        </S.FooterLinkButton>
      </li>
    );
  }
  return <li>{link.label}</li>;
}

export function SiteFooter({
  columns,
  companyName,
  companyAddress,
  contacts,
  socials,
  skylineSrc,
  copyright,
}: SiteFooterProps) {
  return (
    <S.Shell data-name="section-footer" data-node-id="216:3895">
      <S.CurveRow>
        <S.CurveFlip>
          <S.CurveBar data-node-id="216:3894" aria-hidden />
        </S.CurveFlip>
      </S.CurveRow>

      <S.LinksSurface data-node-id="216:3798">
        <S.LinkGrid aria-label="Footer destinations" data-node-id="216:3799">
          {columns.map((col) => (
            <S.Col key={col.id}>
              <S.ColTitle>{col.title}</S.ColTitle>
              <S.ColList>
                {col.links.map((link) => (
                  <FooterListItem key={link.id} link={link} />
                ))}
              </S.ColList>
            </S.Col>
          ))}
        </S.LinkGrid>

        <S.FooterSec2 data-node-id="216:3845">
          <S.Divider aria-hidden data-node-id="216:3846" />
          <S.AddressBlock data-node-id="216:3847">
            <S.CompanyName>{companyName}</S.CompanyName>
            <S.CompanyAddr>{companyAddress}</S.CompanyAddr>
          </S.AddressBlock>

          <S.ContactRow data-node-id="216:3850">
            {contacts.map((c) => (
              <S.ContactItem key={c.id} $w={c.widthPx}>
                <S.IconSlot>
                  <Image
                    src={c.iconSrc}
                    alt=""
                    width={24}
                    height={24}
                    unoptimized
                  />
                </S.IconSlot>
                {c.href ? (
                  <S.ContactAnchor href={c.href}>{c.text}</S.ContactAnchor>
                ) : (
                  c.text
                )}
              </S.ContactItem>
            ))}
          </S.ContactRow>

          <S.SocialColumn data-node-id="216:3866">
            <S.SocialPill data-node-id="216:3867">
              <S.SocialLinks data-node-id="216:3868">
                {socials.map((s) => {
                  if (s.variant === "youtube") {
                    return (
                      <S.SocialBtnYt
                        key={s.id}
                        href={s.href}
                        aria-label={s.ariaLabel}
                      >
                        <S.YtIconWrap>
                          <Image
                            src={s.iconSrc}
                            alt=""
                            fill
                            unoptimized
                            style={{ objectFit: "contain" }}
                          />
                        </S.YtIconWrap>
                      </S.SocialBtnYt>
                    );
                  }
                  return (
                    <S.SocialBtn
                      key={s.id}
                      href={s.href}
                      aria-label={s.ariaLabel}
                      data-variant={s.variant === "facebook" ? "fb" : undefined}
                    >
                      <Image
                        src={s.iconSrc}
                        alt=""
                        width={s.iconWidth}
                        height={s.iconHeight}
                        unoptimized
                      />
                    </S.SocialBtn>
                  );
                })}
              </S.SocialLinks>
            </S.SocialPill>

            <S.FooterImgBlock data-node-id="216:3884">
              <S.SkylineFrame data-node-id="216:3885" aria-hidden>
                <Image
                  src={skylineSrc}
                  alt=""
                  fill
                  unoptimized
                  sizes="1104px"
                  style={{ objectFit: "cover", objectPosition: "center bottom" }}
                />
              </S.SkylineFrame>
              <S.Divider aria-hidden data-node-id="230:1676" />
            </S.FooterImgBlock>
          </S.SocialColumn>

          <S.CopyrightRow data-node-id="230:1680">
            <S.Copyright data-node-id="216:3893">{copyright}</S.Copyright>
          </S.CopyrightRow>
        </S.FooterSec2>
      </S.LinksSurface>
    </S.Shell>
  );
}
