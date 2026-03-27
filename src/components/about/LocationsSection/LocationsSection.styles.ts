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

export const Intro = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[28]};
  width: 100%;
  max-width: 1152px;
  text-align: center;
  color: ${({ theme }) => theme.color.onSurface};
`;

export const Title = styled.h2`
  margin: 0;
  font-family: ${({ theme }) => theme.font.body};
  font-weight: 700;
  font-size: 20px;
  line-height: 20px;
`;

export const Lead = styled.p`
  margin: 0;
  font-family: ${({ theme }) => theme.font.body};
  font-weight: 400;
  font-size: 20px;
  line-height: 20px;
`;

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  gap: 55px;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 1152px;
  box-sizing: border-box;
  overflow-x: auto;
`;

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.space[16]};
  width: min(350px, 100%);
  min-height: 208px;
  padding: ${({ theme }) => `${theme.space[12]} ${theme.space[16]} ${theme.space[20]}`};
  border-radius: 16px;
`;

export const LogoWrap = styled.div`
  position: relative;
  width: 60px;
  height: 60px;
  flex-shrink: 0;
`;

export const CityBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.space[8]};
  padding: ${({ theme }) => `${theme.space[4]} 14px 0`};
  border-radius: 24px;
`;

export const CityName = styled.h3`
  margin: 0;
  font-family: ${({ theme }) => theme.font.body};
  font-weight: 600;
  font-size: 16px;
  line-height: 28px;
  text-align: center;
  color: ${({ theme }) => theme.color.primaryTextUi};
`;

export const AccentRule = styled.div`
  width: 154px;
  height: 2px;
  background: ${({ theme }) => theme.color.yellow600};
  border: 1px solid ${({ theme }) => theme.color.yellow600};
`;

export const Address = styled.p`
  margin: 0;
  width: 100%;
  font-family: ${({ theme }) => theme.font.body};
  font-weight: 400;
  font-size: 12px;
  line-height: 20px;
  text-align: center;
  color: ${({ theme }) => theme.color.tertiaryText};
`;

export const VDivider = styled.div`
  position: relative;
  width: 2px;
  height: 58px;
  flex-shrink: 0;
`;
