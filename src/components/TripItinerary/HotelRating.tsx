import { placeholderHotelRating } from "@/utils/placeholders";

/** "★ 4.8 customer ratings" (Figma 8779:9114). The number is a placeholder
 *  until hotels carry a real rating — SCHEMA_TODO.md #1. */
export default function HotelRating({ hotel, rating }: { hotel: string; rating?: number }) {
  const value = rating ?? placeholderHotelRating(hotel);
  return (
    <span className="tdp2-hotel-rating">
      <img loading="lazy" src="/figma/trip-glance/icon-star.svg" width={12} height={12} alt="" aria-hidden />
      {`${value.toFixed(1)} customer ratings`}
    </span>
  );
}
