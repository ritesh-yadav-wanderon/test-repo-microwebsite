"use client";

import styled from "styled-components";

/** Figma `navigation-bar` (189:523): 128×128, column — top 64 + bottom 64 */
export const NavRoot = styled.header`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 128px;
`;

/** `top-nav` (178:1435): neutral/100, h 64, px 48 py 8, gap 130 between clusters */
export const TopRow = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
  min-height: 64px;
  padding: ${({ theme }) => `${theme.space[8]} clamp(16px, 3vw, 48px)`};
  background: ${({ theme }) => theme.color.neutral100};
  overflow: hidden;
`;

export const TopInner = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  gap: 130px;
  width: 100%;
  max-width: ${({ theme }) => theme.layout.maxWidth};
  min-width: 0;
`;

/** Logo + search: gap 64 (178:1451) */
export const LeftCluster = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[64]};
`;

/** Figma logo frame 60×60 (178:772) */
export const LogoWrap = styled.div`
  position: relative;
  width: 60px;
  height: 60px;
  flex-shrink: 0;
`;

/** `search/light` (211:3369) */
export const SearchField = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  height: 38px;
  width: 302px;
  max-width: min(302px, 100%);
  padding: 0 ${({ theme }) => theme.space[12]} 0 24px;
  border-radius: ${({ theme }) => theme.radius.pill};
  border: 1px solid ${({ theme }) => theme.color.cyan700};
  background: ${({ theme }) => theme.color.neutral100};
  box-sizing: border-box;
`;

export const SearchPlaceholder = styled.span`
  flex: 1;
  min-width: 0;
  font-family: ${({ theme }) => theme.font.body};
  font-weight: 300;
  font-size: 14px;
  line-height: 24px;
  color: ${({ theme }) => theme.color.onSurfaceVariant};
`;

/** `nav-links` (178:1466): w 563 in Figma — flex end + gap 16 */
export const RightCluster = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.space[16]};
  min-width: 0;
`;

/** `mol/nav-links` (178:1452): item gap 16px */
export const MolNavLinks = styled.nav`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[16]};
  padding: ${({ theme }) => theme.space[8]};
`;

/** Nav/primary — Medium 14/20, on-surface #2d2d2d */
export const NavLinkText = styled.span`
  font-family: ${({ theme }) => theme.font.body};
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  color: ${({ theme }) => theme.color.neutral900};
  white-space: nowrap;
`;

export const NavLinkButton = styled.button`
  font-family: ${({ theme }) => theme.font.body};
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  color: ${({ theme }) => theme.color.neutral900};
  white-space: nowrap;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
`;

/** `button-primary` (178:775): px 20 py 8, gap 8, pill */
export const CallButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[8]};
  padding: ${({ theme }) => `${theme.space[8]} ${theme.space[20]}`};
  border-radius: ${({ theme }) => theme.radius.pill};
  border: 1px solid ${({ theme }) => theme.color.cyan700};
  text-decoration: none;
  color: ${({ theme }) => theme.color.cyan700};
  font-family: ${({ theme }) => theme.font.body};
  font-weight: 700;
  font-size: 14px;
  line-height: 20px;
  flex-shrink: 0;
`;

/** `bottom-nav` (189:443): primary fill, h 64, px 48 py 16 */
export const BottomRow = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
  min-height: 64px;
  padding: ${({ theme }) => `${theme.space[16]} clamp(16px, 3vw, 48px)`};
  background: ${({ theme }) => theme.color.primary};
  overflow: hidden;
`;

/** `category` row: gap 16 between items, h 32, p 8 */
export const CategoryRow = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.space[16]};
  min-height: 32px;
  padding: ${({ theme }) => theme.space[8]};
  max-width: ${({ theme }) => theme.layout.maxWidth};
  width: 100%;
  min-width: 0;
  overflow-x: auto;
  box-sizing: border-box;
`;

/** Nav/secondary — Medium 14/20, grey-0 on primary bar */
export const CategoryItemText = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[4]};
  font-family: ${({ theme }) => theme.font.body};
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  color: ${({ theme }) => theme.color.grey0};
  white-space: nowrap;
`;

export const CategoryItemButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[4]};
  font-family: ${({ theme }) => theme.font.body};
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  color: ${({ theme }) => theme.color.grey0};
  white-space: nowrap;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
`;
