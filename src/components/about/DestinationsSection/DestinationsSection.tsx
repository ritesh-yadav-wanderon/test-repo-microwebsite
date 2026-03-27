"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import type { DestinationsSectionProps } from "./types";
import * as S from "./DestinationsSection.styles";

const INDICATOR_PAD = 10;
const INDICATOR_TRACK = 120;
const INDICATOR_THUMB = 33;
/** Figma card 200px + gap 8px (I223:5067;223:4676) */
const CARD_STRIDE_PX = 208;

function thumbLeftFromScroll(el: HTMLDivElement): number {
  const { scrollLeft, scrollWidth, clientWidth } = el;
  const maxScroll = scrollWidth - clientWidth;
  if (maxScroll <= 0) return INDICATOR_PAD;
  const ratio = scrollLeft / maxScroll;
  const usable = INDICATOR_TRACK - INDICATOR_THUMB;
  return INDICATOR_PAD + ratio * usable;
}

export function DestinationsSection({
  title,
  subtitle,
  exploreLabel,
  bannerPosterSrc,
  bannerPosterAlt = "",
  bannerVideoSrc,
  cards,
  prevArrowIconSrc,
  nextArrowIconSrc,
  onExploreClick,
  onPrevClick,
  onNextClick,
  onCardClick,
}: DestinationsSectionProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [thumbLeftPx, setThumbLeftPx] = useState(INDICATOR_PAD);

  const syncIndicator = useCallback(() => {
    const el = carouselRef.current;
    if (!el) return;
    setThumbLeftPx(thumbLeftFromScroll(el));
  }, []);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    syncIndicator();
    const ro = new ResizeObserver(() => syncIndicator());
    ro.observe(el);
    return () => ro.disconnect();
  }, [syncIndicator, cards.length]);

  const scrollCarouselByStep = useCallback(
    (direction: -1 | 1) => {
      const el = carouselRef.current;
      if (!el) return;
      el.scrollBy({
        left: direction * CARD_STRIDE_PX,
        behavior: "smooth",
      });
    },
    [],
  );

  const handlePrev = useCallback(() => {
    scrollCarouselByStep(-1);
    onPrevClick?.();
  }, [onPrevClick, scrollCarouselByStep]);

  const handleNext = useCallback(() => {
    scrollCarouselByStep(1);
    onNextClick?.();
  }, [onNextClick, scrollCarouselByStep]);

  const handleCardActivate = useCallback(
    (id: string, el: HTMLButtonElement) => {
      el.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
      onCardClick?.(id);
    },
    [onCardClick],
  );

  return (
    <S.Section aria-labelledby="destinations-heading" data-node-id="223:5159">
      <S.TripBanner data-node-id="223:5066">
        <S.BannerMedia>
          {bannerVideoSrc ? (
            <S.BannerVideo
              autoPlay
              loop
              muted
              playsInline
              controlsList="nodownload"
              poster={bannerPosterSrc}
            >
              <source src={bannerVideoSrc} />
            </S.BannerVideo>
          ) : (
            <S.BannerPoster>
              <Image
                src={bannerPosterSrc}
                alt={bannerPosterAlt}
                fill
                sizes="1106px"
                unoptimized
                style={{ objectFit: "cover" }}
                priority={false}
              />
            </S.BannerPoster>
          )}
        </S.BannerMedia>

        <S.BannerCta data-node-id="I223:5066;223:5377">
          <S.BannerTitleBlock data-node-id="I223:5066;223:5395">
            <S.BannerTitle id="destinations-heading" data-node-id="I223:5066;223:4730">
              {title}
            </S.BannerTitle>
            <S.BannerSubtitle data-node-id="I223:5066;223:4731">
              {subtitle}
            </S.BannerSubtitle>
          </S.BannerTitleBlock>
          <S.ExploreButton
            type="button"
            data-node-id="I223:5066;223:5343"
            onClick={onExploreClick}
          >
            <S.ExploreLabel data-node-id="I223:5066;223:5343;223:4495">
              {exploreLabel}
            </S.ExploreLabel>
          </S.ExploreButton>
        </S.BannerCta>
      </S.TripBanner>

      <S.TripCardsStack data-node-id="223:5067">
        <S.CarouselRow
          ref={carouselRef}
          data-node-id="I223:5067;223:4676"
          onScroll={syncIndicator}
        >
          {cards.map((card) => (
            <S.TripCard
              key={card.id}
              type="button"
              data-name="trip-card"
              aria-label={`${card.title}, ${card.priceLabel}`}
              onClick={(e) => handleCardActivate(card.id, e.currentTarget)}
            >
              <S.CardBg aria-hidden>
                <S.CardImage
                  src={card.imageSrc}
                  alt=""
                  $wide={card.wideCrop}
                  loading="lazy"
                />
                <S.CardGradient />
              </S.CardBg>
              <S.CardContent>
                <S.CardTitle>{card.title}</S.CardTitle>
                <S.CardPrice>{card.priceLabel}</S.CardPrice>
              </S.CardContent>
            </S.TripCard>
          ))}
        </S.CarouselRow>

        <S.Indicator data-node-id="I223:5067;223:4682">
          <S.IndicatorTrack data-node-id="I223:5067;223:4682;161:2302" />
          <S.IndicatorThumb
            $leftPx={thumbLeftPx}
            data-node-id="I223:5067;223:4682;161:2303"
          />
        </S.Indicator>
      </S.TripCardsStack>

      <S.PrevArrow
        type="button"
        aria-label="Scroll destinations left"
        data-name="arrow-icon 2"
        data-node-id="223:5068"
        onClick={handlePrev}
      >
        <S.PrevArrowInner>
          <S.ArrowIcon>
            <Image
              src={prevArrowIconSrc}
              alt=""
              width={32}
              height={32}
              unoptimized
            />
          </S.ArrowIcon>
        </S.PrevArrowInner>
      </S.PrevArrow>

      <S.NextArrow
        type="button"
        aria-label="Scroll destinations right"
        data-name="arrow-icon 1"
        data-node-id="223:3603"
        onClick={handleNext}
      >
        <S.ArrowIcon>
          <Image
            src={nextArrowIconSrc}
            alt=""
            width={32}
            height={32}
            unoptimized
          />
        </S.ArrowIcon>
      </S.NextArrow>
    </S.Section>
  );
}
