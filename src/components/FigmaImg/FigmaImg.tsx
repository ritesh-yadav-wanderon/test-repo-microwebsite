import type { CSSProperties, ReactNode } from "react";
import { useState } from "react";

export interface FigmaImgProps {
  name: string;
  alt?: string;
  className?: string;
  style?: CSSProperties;
  fallback?: ReactNode;
}

export default function FigmaImg({
  name,
  alt = "",
  className,
  style,
  fallback = null,
}: FigmaImgProps) {
  const [failed, setFailed] = useState(false);
  if (failed) return fallback;
  return (
    <img
      src={`/figma/${name}.png`}
      alt={alt}
      className={className}
      style={style}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}
