"use client";

import { ImageWithFallback } from "@/components/ImageWithFallback";
import { cx } from "@/lib/cn";

type CartItemThumbnailProps = {
  type: "ready" | "custom";
  alt: string;
  readySrc?: string;
  frontSrc?: string;
  bandanaSrc?: string;
  sizeClassName: string;
  className?: string;
  sizes?: string;
};

export const CartItemThumbnail = ({
  type,
  alt,
  readySrc,
  frontSrc,
  bandanaSrc,
  sizeClassName,
  className,
  sizes,
}: CartItemThumbnailProps) => {
  return (
    <div
      className={cx(
        "relative overflow-hidden rounded-xl border border-text/10 bg-bg/40 shadow-[0_0_18px_rgba(255,77,77,0.10)]",
        sizeClassName,
        className
      )}
    >
      {type === "ready" ? (
        <ImageWithFallback
          src={readySrc ?? "/images/placeholder.svg"}
          alt={alt}
          className="object-cover"
          sizes={sizes}
        />
      ) : (
        <div className="absolute inset-0">
          <ImageWithFallback
            src={bandanaSrc ?? "/images/placeholder.svg"}
            alt={alt}
            className="object-cover"
            sizes={sizes}
          />
          <div className="absolute inset-0">
            <ImageWithFallback
              src={frontSrc ?? "/images/placeholder.svg"}
              alt={alt}
              className="object-cover"
              sizes={sizes}
            />
          </div>
        </div>
      )}
    </div>
  );
};

