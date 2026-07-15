"use client";

import { useState } from "react";
import Image from "next/image";
import type { IProductImage } from "@/lib/models/Product";

interface ImageGalleryProps {
  images: IProductImage[];
  title: string;
}

export function ImageGallery({ images, title }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex];

  return (
    <div>
      <div className="relative flex aspect-square items-center justify-center bg-cream">
        {active ? (
          <Image
            key={active._id?.toString() ?? activeIndex}
            src={active.src}
            alt={active.alt ?? title}
            fill
            sizes="(max-width: 1024px) 90vw, 45vw"
            priority
            className="object-contain p-8"
          />
        ) : (
          <span className="font-body text-sm text-ink/40">No image available</span>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
          {images.map((img, index) => (
            <button
              key={img._id?.toString() ?? index}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Show image ${index + 1} of ${images.length}`}
              aria-current={index === activeIndex}
              className={`relative h-20 w-20 shrink-0 bg-cream transition-opacity ${
                index === activeIndex ? "opacity-100 ring-2 ring-rose-deep" : "opacity-70 hover:opacity-100"
              }`}
            >
              <Image src={img.src} alt={img.alt ?? `${title} thumbnail ${index + 1}`} fill sizes="80px" className="object-contain p-2" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
