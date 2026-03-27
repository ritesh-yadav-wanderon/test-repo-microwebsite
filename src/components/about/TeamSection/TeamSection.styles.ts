"use client";

import styled from "styled-components";

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  width: 100%;
  padding: 0 clamp(16px, 5vw, 64px);
  box-sizing: border-box;
`;

export const Heading = styled.h2`
  margin: 0;
  font-family: ${({ theme }) => theme.font.body};
  font-weight: 700;
  font-size: 20px;
  line-height: 20px;
  text-align: center;
  color: ${({ theme }) => theme.color.onSurface};
`;

export const Grid = styled.div`
  display: grid;
  width: min(1057px, 100%);
  gap: 32px;
  box-sizing: border-box;
  grid-template-columns: repeat(3, minmax(0, 1fr));

  @media (min-width: 1100px) {
    grid-template-columns: 342px 320px 331px;
  }

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

export const Card = styled.article`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.space[32]};
  padding: ${({ theme }) => `${theme.space[8]} ${theme.space[24]}`};
  min-width: 0;
`;

export const Avatar = styled.div`
  position: relative;
  width: 192px;
  height: 192px;
  border-radius: ${({ theme }) => theme.radius.pill};
  box-shadow: ${({ theme }) => theme.shadow.avatar};
  overflow: hidden;
  flex-shrink: 0;
`;

export const NameBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.radius.lg};
`;

export const NameText = styled.h3`
  margin: 0;
  font-family: ${({ theme }) => theme.font.body};
  font-weight: 700;
  font-size: 32px;
  line-height: 32px;
  text-align: center;
  color: ${({ theme }) => theme.color.onSurface};
`;

export const RoleText = styled.p`
  margin: 0;
  font-family: ${({ theme }) => theme.font.body};
  font-weight: 400;
  font-size: 20px;
  line-height: 20px;
  text-align: center;
  color: ${({ theme }) => theme.color.neutral700};
`;

export const SocialRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space[8]};
  align-items: center;
  color: ${({ theme }) => theme.color.onSurface};
`;

export const SocialAnchor = styled.a`
  display: inline-flex;
  line-height: 0;
`;

export const AccentRule = styled.div`
  width: 154px;
  height: 2px;
  background: ${({ theme }) => theme.color.yellow600};
  border: 1px solid ${({ theme }) => theme.color.yellow600};
`;

export const Bio = styled.p`
  margin: 0;
  width: min(272px, 100%);
  font-family: ${({ theme }) => theme.font.body};
  font-weight: 400;
  font-size: 16px;
  line-height: 20px;
  color: ${({ theme }) => theme.color.onSurface};
`;
