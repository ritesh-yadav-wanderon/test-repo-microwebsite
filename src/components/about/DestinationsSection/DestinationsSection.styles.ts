"use client";

import styled, { css } from "styled-components";

/** Figma `international trips` (223:5159): 1106×557 */
export const Section = styled.section`
  position: relative;
  width: 100%;
  max-width: 1106px;
  min-height: 557px;
  margin: 0 auto;
  padding: 0 clamp(16px, 5vw, 64px);
  box-sizing: border-box;
`;

/** `trip-banner` (223:5066): 1106×318, centered, rounded 12, p 44 */
export const TripBanner = styled.div`
  position: absolute;
  left: 50%;
  top: 0;
  transform: translateX(-50%);
  width: 100%;
  max-width: 1106px;
  height: 318px;
  padding: 44px;
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
  box-sizing: border-box;
`;

export const BannerMedia = styled.div`
  position: absolute;
  inset: 0;
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
  pointer-events: none;
`;

export const BannerVideo = styled.video`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.radius.lg};
`;

export const BannerPoster = styled.div`
  position: absolute;
  inset: 0;
`;

export const BannerCta = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[24]};
  height: 160px;
  align-items: flex-start;
  justify-content: flex-start;
`;

export const BannerTitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 436px;
  color: ${({ theme }) => theme.color.neutral100};
  text-shadow: ${({ theme }) => theme.shadow.avatar};
`;

export const BannerTitle = styled.h2`
  margin: 0;
  font-family: ${({ theme }) => theme.font.body};
  font-weight: 700;
  font-size: 44px;
  line-height: 1.15;
  letter-spacing: 0.11px;
`;

export const BannerSubtitle = styled.p`
  margin: 0;
  font-family: ${({ theme }) => theme.font.body};
  font-weight: 400;
  font-size: 16px;
  line-height: 20px;
  white-space: nowrap;

  @media (max-width: 520px) {
    white-space: normal;
  }
`;

/** `button-secondary` (223:5343): 164×44, tertiary fill; horizontal padding from Figma token */
export const ExploreButton = styled.button`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 164px;
  height: 44px;
  padding: 0 ${({ theme }) => theme.space[16]};
  border: none;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.color.yellow600};
  cursor: pointer;
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.14);
`;

export const ExploreLabel = styled.span`
  position: relative;
  z-index: 1;
  font-family: ${({ theme }) => theme.font.body};
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  color: ${({ theme }) => theme.color.neutral900};
`;

/** `trip-cards` (223:5067): top 251, w 1056, h ~315.905 */
export const TripCardsStack = styled.div`
  position: absolute;
  left: 50%;
  top: 251px;
  transform: translateX(-50%);
  width: 100%;
  max-width: 1056px;
  min-height: 316px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.space[20]};
  padding: ${({ theme }) => theme.space[8]};
  box-sizing: border-box;
  overflow: visible;
`;

/** `carousel` (I223:5067;223:4676): overflow-x-auto overflow-y-clip, w 1040, flex-1 */
export const CarouselRow = styled.div`
  flex: 1 0 0;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: stretch;
  gap: ${({ theme }) => theme.space[8]};
  width: 100%;
  max-width: 1040px;
  min-width: 0;
  min-height: 262px;
  overflow-x: auto;
  overflow-y: clip;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  scroll-snap-type: x mandatory;
  overscroll-behavior-x: contain;
  box-sizing: border-box;
`;

const cardShell = css`
  position: relative;
  flex-shrink: 0;
  scroll-snap-align: start;
  width: 200px;
  min-height: 262px;
  padding: ${({ theme }) => theme.space[20]};
  border-radius: ${({ theme }) => theme.radius.lg};
  border: 2px solid ${({ theme }) => theme.color.neutral100};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  overflow: hidden;
  box-sizing: border-box;
  background: transparent;
`;

/** Trip card: button so click scrolls into view + optional handler (Figma trip-card) */
export const TripCard = styled.button`
  ${cardShell}
  cursor: pointer;
  font: inherit;
  text-align: center;
`;

export const CardBg = styled.div`
  position: absolute;
  inset: 0;
  border-radius: ${({ theme }) => theme.radius.lg};
  pointer-events: none;
  overflow: hidden;
`;

export const CardGradient = styled.div`
  position: absolute;
  inset: 0;
  border-radius: ${({ theme }) => theme.radius.lg};
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 58%,
    rgba(0, 0, 0, 0.8) 100%
  );
`;

export const CardImage = styled.img<{ $wide?: boolean }>`
  position: absolute;
  display: block;
  border-radius: ${({ theme }) => theme.radius.lg};
  object-fit: cover;
  object-position: center;
  ${(p) =>
    p.$wide
      ? css`
          width: 209.52%;
          height: 100%;
          left: -30.95%;
          top: 0;
          max-width: none;
        `
      : css`
          width: 100%;
          height: 100%;
          left: 0;
          top: 0;
        `}
`;

export const CardContent = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0;
  width: 142px;
  min-height: 42px;
  text-align: center;
  color: ${({ theme }) => theme.color.neutral100};
`;

export const CardTitle = styled.span`
  font-family: ${({ theme }) => theme.font.body};
  font-weight: 600;
  font-size: 16px;
  line-height: 28px;
  text-shadow: 1px 1px 25px rgba(0, 0, 0, 0.5);
`;

export const CardPrice = styled.span`
  font-family: ${({ theme }) => theme.font.body};
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
`;

/** `indicator` (223:4682) */
export const Indicator = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px 10px;
  flex-shrink: 0;
`;

export const IndicatorTrack = styled.div`
  width: 120px;
  height: 6px;
  border-radius: 32px;
  background: ${({ theme }) => theme.color.neutral200};
  border: 1px solid ${({ theme }) => theme.color.neutral200};
  box-sizing: border-box;
`;

export const IndicatorThumb = styled.div<{ $leftPx: number }>`
  position: absolute;
  top: 4px;
  left: ${({ $leftPx }) => $leftPx}px;
  width: 33px;
  height: 6px;
  border-radius: 32px;
  background: ${({ theme }) => theme.color.primary};
  pointer-events: none;
`;

const arrowBtn = css`
  position: absolute;
  top: 384px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
`;

export const PrevArrow = styled.button`
  ${arrowBtn}
  left: clamp(8px, 2vw, 20px);
`;

export const PrevArrowInner = styled.span`
  display: flex;
  transform: scaleY(-1) rotate(180deg);
`;

export const NextArrow = styled.button`
  ${arrowBtn}
  right: clamp(8px, 2vw, 20px);
`;

export const ArrowIcon = styled.span`
  position: relative;
  display: block;
  width: 32px;
  height: 32px;

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;
