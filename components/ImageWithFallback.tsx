"use client";

import { useState } from "react";
import Image from "next/image";

type ImageWithFallbackProps = {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
};

export const ImageWithFallback = ({
  src,
  alt,
  className,
  fallbackSrc = "/images/placeholder.svg",
  fill = true,
  sizes,
  priority = false,
}: ImageWithFallbackProps) => {
  const [currentSrc, setCurrentSrc] = useState(src);

  return (
    <Image
      src={currentSrc}
      alt={alt}
      className={className}
      fill={fill}
      sizes={sizes}
      priority={priority}
      onError={() => setCurrentSrc(fallbackSrc)}
    />
  );
};
