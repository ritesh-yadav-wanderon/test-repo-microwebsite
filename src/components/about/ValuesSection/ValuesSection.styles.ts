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
  max-width: 960px;
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
  text-align: justify;
`;

export const List = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 960px;
`;

export const Row = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-height: 40px;
  padding: ${({ theme }) => `${theme.space[4]} ${theme.space[16]}`};
  border: none;
  background: ${({ theme }) => theme.color.neutral100};
  cursor: pointer;
  text-align: left;
  box-sizing: border-box;
`;

export const Left = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[12]};
  min-height: 32px;
`;

export const Index = styled.span`
  width: 29px;
  font-family: ${({ theme }) => theme.font.body};
  font-weight: 600;
  font-size: 16px;
  line-height: 28px;
  text-align: center;
  color: ${({ theme }) => theme.color.onSurfaceVariant};
`;

export const Label = styled.span`
  font-family: ${({ theme }) => theme.font.body};
  font-weight: 600;
  font-size: 16px;
  line-height: 28px;
  color: ${({ theme }) => theme.color.onSurface};
  white-space: nowrap;
`;

export const ChevronWrap = styled.span`
  position: relative;
  display: block;
  width: 19.17px;
  height: 19.19px;
  flex-shrink: 0;
`;
