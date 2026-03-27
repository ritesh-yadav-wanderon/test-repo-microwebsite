"use client";

import styled from "styled-components";

export const Shell = styled.footer`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
  max-width: 100%;
  padding: 0;
  box-sizing: border-box;
`;

export const CurveRow = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
  width: 100%;
  flex-shrink: 0;
`;

export const CurveFlip = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  transform: scaleY(-1);
`;

export const CurveBar = styled.div`
  width: 100%;
  height: 8px;
  background: ${({ theme }) => theme.color.primary};
  border-radius: 0 0 200px 200px;
  flex-shrink: 0;
`;

/** Figma `links` (216:3798): sys/on-secondary-container #112023, py 40, gap 24 */
export const LinksSurface = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.space[24]};
  width: 100%;
  padding: ${({ theme }) => `${theme.space[40]} 0`};
  box-sizing: border-box;
  background: ${({ theme }) => theme.color.footerBg};
  color: ${({ theme }) => theme.color.onPrimary};
`;

export const LinkGrid = styled.nav`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  gap: ${({ theme }) => theme.space[96]};
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
  max-width: 1106px;
  padding: 0 ${({ theme }) => theme.space[24]};
  box-sizing: border-box;
  overflow-x: auto;
`;

export const Col = styled.div`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  min-width: 0;
  gap: ${({ theme }) => theme.space[8]};
`;

export const ColTitle = styled.p`
  margin: 0;
  font-family: ${({ theme }) => theme.font.body};
  font-weight: 600;
  font-size: 14px;
  line-height: 24px;
  white-space: nowrap;
`;

export const ColList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[4]};
  font-family: ${({ theme }) => theme.font.body};
  font-weight: 400;
  font-size: 16px;
  line-height: 18px;
`;

export const FooterLink = styled.a`
  color: inherit;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

export const FooterLinkButton = styled.button`
  margin: 0;
  padding: 0;
  border: none;
  background: none;
  font: inherit;
  color: inherit;
  cursor: pointer;
  text-align: left;
`;

export const FooterSec2 = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  width: 100%;
  max-width: 1106px;
  padding: 0 ${({ theme }) => theme.space[24]};
  box-sizing: border-box;
`;

export const Divider = styled.div`
  width: 100%;
  max-width: 1106px;
  height: 1px;
  background: #ffffff;
  opacity: 0.4;
  flex-shrink: 0;
`;

export const AddressBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.space[12]};
  width: 100%;
  text-align: center;
  color: ${({ theme }) => theme.color.onPrimary};
`;

export const CompanyName = styled.p`
  margin: 0;
  font-family: ${({ theme }) => theme.font.body};
  font-weight: 500;
  font-size: 16px;
  line-height: 32px;
  white-space: nowrap;
`;

export const CompanyAddr = styled.p`
  margin: 0;
  font-family: ${({ theme }) => theme.font.body};
  font-weight: 400;
  font-size: 14px;
  line-height: 24px;
  white-space: normal;
`;

export const ContactRow = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  gap: ${({ theme }) => theme.space[32]};
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  overflow-x: auto;
  box-sizing: border-box;
`;

export const ContactItem = styled.div<{ $w: number }>`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
  width: ${({ $w }) => $w}px;
  min-width: 0;
  font-family: ${({ theme }) => theme.font.body};
  font-size: 14px;
  line-height: 24px;
  color: ${({ theme }) => theme.color.onPrimary};
`;

export const ContactAnchor = styled.a`
  color: inherit;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

export const IconSlot = styled.span`
  position: relative;
  display: block;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
`;

export const SocialColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

export const SocialPill = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0;
  padding: ${({ theme }) => `${theme.space[16]} ${theme.space[32]}`};
  border-radius: ${({ theme }) => theme.radius.pill};
  background: ${({ theme }) => theme.color.socialBg};
  flex-shrink: 0;
`;

export const SocialLinks = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  gap: ${({ theme }) => theme.space[24]};
`;

export const SocialBtn = styled.a`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 37.5px;
  overflow: hidden;
  flex-shrink: 0;
  background: ${({ theme }) => theme.color.onPrimary};

  &[data-variant="fb"] {
    background: transparent;
  }
`;

export const SocialBtnYt = styled(SocialBtn)`
  flex-direction: column;
`;

export const YtIconWrap = styled.span`
  position: relative;
  display: block;
  width: 19.996px;
  height: 14.004px;
  flex-shrink: 0;
`;

export const FooterImgBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 1104px;
  flex-shrink: 0;
`;

export const SkylineFrame = styled.div`
  position: relative;
  width: 100%;
  height: 70px;
  flex-shrink: 0;
`;

export const CopyrightRow = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

export const Copyright = styled.p`
  margin: 0;
  font-family: ${({ theme }) => theme.font.body};
  font-weight: 400;
  font-size: 14px;
  line-height: 24px;
  text-align: center;
  white-space: nowrap;
  color: ${({ theme }) => theme.color.onPrimary};
`;
