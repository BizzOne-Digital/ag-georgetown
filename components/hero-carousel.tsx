"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { FacetedFrame } from "./faceted-frame";
import { MonogramWatermark } from "./monogram";
import { AG_IMAGES } from "@/lib/images";

const slides = [
  { image: AG_IMAGES[0], label: "Designer Fragrance" },
  { image: AG_IMAGES[2], label: "Everyday Makeup" },
  { image: AG_IMAGES[3], label: "Gift Sets & Bundles" },
];

export function HeroCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 6000);
    return () => window.clearInterval(id);
  }, []);

  const active = slides[index];

  return (
    <div className="relative">
      <MonogramWatermark className="absolute -right-10 -top-10 h-72 w-72 rotate-[8deg] md:-right-16 md:-top-16 md:h-96 md:w-96" />
      <FacetedFrame className="relative z-10 bg-gradient-to-br from-gold-start/20 to-gold-end/30">
        <AnimatePresence mode="sync">
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute inset-0 flex items-center justify-center p-8"
          >
            <Image
              src={active.image.src}
              alt={active.image.alt}
              fill
              priority={index === 0}
              sizes="(max-width: 768px) 90vw, 45vw"
              className="object-contain"
            />
          </motion.div>
        </AnimatePresence>
        <span className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 font-body text-caption font-medium uppercase tracking-label text-ink/60">
          {active.label}
        </span>
      </FacetedFrame>
    </div>
  );
}
