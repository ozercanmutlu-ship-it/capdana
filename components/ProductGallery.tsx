"use client";

import { useMemo, useState } from "react";
import { product } from "@/lib/products";
import { cx } from "@/lib/cn";
import { ImageWithFallback } from "@/components/ImageWithFallback";

type ProductGalleryProps = {
  selectedModelId: string | null;
};

const placeholderImage = "/images/placeholder.svg";

const getModelImage = (modelId: string | null) =>
  modelId ? `/images/models/${modelId}.jpg` : placeholderImage;

export const ProductGallery = ({ selectedModelId }: ProductGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const images = useMemo(
    () => [
      getModelImage(selectedModelId),
      placeholderImage,
      placeholderImage,
      placeholderImage,
    ],
    [selectedModelId]
  );

  const activeImage = images[activeIndex] ?? images[0];
  const modelLabel =
    product.models.find((item) => item.id === selectedModelId)?.label ?? "Model";

  return (
    <div className="space-y-4">
      <div className="hidden gap-4 md:grid md:grid-cols-[1fr_96px]">
        <div className="relative aspect-square overflow-hidden rounded-2xl border border-text/10 bg-bg">
          <ImageWithFallback
            src={activeImage}
            alt={`${product.name} ${modelLabel}`}
            fallbackSrc={placeholderImage}
            sizes="(min-width: 768px) 60vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="grid gap-3">
          {images.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={cx(
                "relative aspect-square overflow-hidden rounded-xl border border-text/10 bg-bg transition duration-200",
                index === activeIndex
                  ? "border-neon/60 shadow-[0_0_12px_rgba(57,255,20,0.2)]"
                  : "hover:border-neon/40"
              )}
            >
              <ImageWithFallback
                src={image}
                alt={`${product.name} küçük görsel ${index + 1}`}
                fallbackSrc={placeholderImage}
                sizes="96px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>
      <div className="md:hidden">
        <div
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3"
          onScroll={(event) => {
            const target = event.currentTarget;
            const index = Math.round(target.scrollLeft / target.clientWidth);
            setActiveIndex(index);
          }}
        >
          {images.map((image, index) => (
            <div
              key={`${image}-${index}`}
              className="relative min-w-full snap-center overflow-hidden rounded-2xl border border-text/10 bg-bg h-80"
            >
              <ImageWithFallback
                src={image}
                alt={`${product.name} görsel ${index + 1}`}
                fallbackSrc={placeholderImage}
                sizes="100vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-2">
          {images.map((_, index) => (
            <span
              key={index}
              className={cx(
                "h-1.5 w-6 rounded-full bg-text/10 transition duration-200",
                index === activeIndex && "bg-neon/60"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
