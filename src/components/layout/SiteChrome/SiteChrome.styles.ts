"use client";

import styled from "styled-components";

export const Page = styled.div`
  min-height: 100vh;
  width: 100%;
  max-width: 100vw;
  background: ${({ theme }) => theme.color.pageCanvas};
  font-family: ${({ theme }) => theme.font.body};
  box-sizing: border-box;
`;

export const Main = styled.div`
  width: 100%;
  max-width: 100%;
`;

export const FooterSlot = styled.div`
  margin-top: 64px;
  width: 100%;
  max-width: 100%;
`;
