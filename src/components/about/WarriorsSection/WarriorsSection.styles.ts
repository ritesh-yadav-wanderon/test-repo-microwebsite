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
  max-width: 936px;
  font-family: ${({ theme }) => theme.font.body};
  font-weight: 700;
  font-size: 20px;
  line-height: 20px;
  text-align: center;
  color: ${({ theme }) => theme.color.onSurface};
`;

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  gap: 32px;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  max-width: 880px;
  overflow-x: auto;
  box-sizing: border-box;
`;

export const Card = styled.article<{ $minH: number }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.space[28]};
  width: 272px;
  min-height: ${({ $minH }) => $minH}px;
`;

export const IconWrap = styled.div`
  position: relative;
  width: 96px;
  height: 96px;
  flex-shrink: 0;
`;

export const Info = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.space[32]};
  width: 100%;
`;

export const TitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.radius.lg};
`;

export const Title = styled.h3`
  margin: 0;
  font-family: ${({ theme }) => theme.font.body};
  font-weight: 600;
  font-size: 16px;
  line-height: 28px;
  text-align: center;
  color: ${({ theme }) => theme.color.onSurface};
`;

export const AccentRule = styled.div`
  width: 154px;
  height: 2px;
  background: ${({ theme }) => theme.color.yellow600};
  border: 1px solid ${({ theme }) => theme.color.yellow600};
`;

export const Body = styled.p`
  margin: 0;
  width: 100%;
  font-family: ${({ theme }) => theme.font.body};
  font-weight: 400;
  font-size: 12px;
  line-height: 20px;
  color: ${({ theme }) => theme.color.onSurface};
`;
