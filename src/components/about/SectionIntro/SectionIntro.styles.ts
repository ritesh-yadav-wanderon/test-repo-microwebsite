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
  color: ${({ theme }) => theme.color.onSurface};
`;

export const Heading = styled.h2`
  margin: 0;
  font-family: ${({ theme }) => theme.font.body};
  font-weight: 700;
  font-size: 20px;
  line-height: 20px;
  text-align: center;
`;

export const Body = styled.div`
  width: 100%;
  max-width: 906px;
  font-family: ${({ theme }) => theme.font.body};
  font-weight: 400;
  font-size: 16px;
  line-height: 18px;
  text-align: justify;
  white-space: pre-wrap;

  p {
    margin: 0;
  }
`;
