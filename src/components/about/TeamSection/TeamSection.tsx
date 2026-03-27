"use client";

import Image from "next/image";
import type { TeamSectionProps } from "../types";
import * as S from "./TeamSection.styles";

export function TeamSection({
  headingId = "team-heading",
  heading,
  members,
  linkedInIconSrc,
  instagramIconSrc,
}: TeamSectionProps) {
  return (
    <S.Section aria-labelledby={headingId}>
      <S.Heading id={headingId}>{heading}</S.Heading>
      <S.Grid>
        {members.map((m) => (
          <S.Card key={m.id}>
            <S.Avatar>
              <Image
                src={m.avatarSrc}
                alt=""
                fill
                sizes="192px"
                unoptimized
                style={{
                  objectFit: m.objectFit ?? "cover",
                  objectPosition: m.objectPosition ?? "center top",
                }}
              />
            </S.Avatar>
            <S.NameBlock>
              <div>
                <S.NameText>{m.name}</S.NameText>
                <S.RoleText>{m.role}</S.RoleText>
              </div>
              <S.SocialRow aria-label="Social links">
                <S.SocialAnchor href={m.linkedinHref} aria-label="LinkedIn">
                  <Image
                    src={linkedInIconSrc}
                    alt=""
                    width={24}
                    height={24}
                    unoptimized
                  />
                </S.SocialAnchor>
                <S.SocialAnchor href={m.instagramHref} aria-label="Instagram">
                  <Image
                    src={instagramIconSrc}
                    alt=""
                    width={24}
                    height={25}
                    unoptimized
                  />
                </S.SocialAnchor>
              </S.SocialRow>
              <S.AccentRule aria-hidden />
            </S.NameBlock>
            <S.Bio>{m.bio}</S.Bio>
          </S.Card>
        ))}
      </S.Grid>
    </S.Section>
  );
}
