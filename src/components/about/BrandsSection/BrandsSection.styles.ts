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

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  gap: 77px;
  justify-content: center;
  align-items: flex-end;
  width: 100%;
  max-width: 934px;
  overflow-x: auto;
  box-sizing: border-box;
`;

export const Brand = styled.figure<{ $w: number }>`
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 13px;
  width: ${({ $w }) => $w}px;
  max-width: 100%;
`;

export const Mark = styled.div`
  position: relative;
  width: 100%;
  height: 62px;
`;

export const Caption = styled.figcaption`
  font-family: ${({ theme }) => theme.font.body};
  font-weight: 600;
  font-size: 16px;
  line-height: 28px;
  text-align: center;
  color: ${({ theme }) => theme.color.brandLabel};
`;
