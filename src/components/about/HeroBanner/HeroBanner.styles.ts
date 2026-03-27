"use client";

import styled from "styled-components";

export const Shell = styled.section`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 400px;
  padding: 0 clamp(16px, 5vw, 40px);
  overflow: hidden;
  box-sizing: border-box;
`;

export const Bg = styled.div`
  position: absolute;
  inset: 0;
  background: ${({ theme }) => theme.color.neutral100};
`;

export const HeroImage = styled.div`
  position: absolute;
  inset: 0;

  img {
    object-fit: cover;
  }
`;

export const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: ${({ theme }) => theme.color.overlay};
`;

export const Title = styled.h1`
  position: relative;
  margin: 0;
  font-family: ${({ theme }) => theme.font.body};
  font-weight: 700;
  font-size: 32px;
  line-height: 40px;
  letter-spacing: 0.08px;
  color: ${({ theme }) => theme.color.onPrimary};
  text-shadow: ${({ theme }) => theme.shadow.displayTitle};
  text-align: center;
  white-space: nowrap;
`;
