"use client";

import { useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";

const TESTIMONIALS = [
  {
    quote:
      "I found my new signature scent here for half of what I'd pay at the mall. The staff actually took the time to help me pick.",
    name: "Priya S.",
  },
  {
    quote:
      "Didn't expect this level of selection in Georgetown. Authentic brands, real prices, no gimmicks.",
    name: "Marcus T.",
  },
  {
    quote:
      "My go-to for gifts now. The bundle deals make it so easy to put together something nice without overspending.",
    name: "Aaliyah R.",
  },
];

export function TestimonialCarousel() {
  const [index, setIndex] = useState(0);

  const next = useCallback(() => setIndex((i) => (i + 1) % TESTIMONIALS.length), []);
  const prev = useCallback(() => setIndex((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length), []);

  useEffect(() => {
    const id = window.setInterval(next, 7000);
    return () => window.clearInterval(id);
  }, [next]);

  const current = TESTIMONIALS[index];

  return (
    <div className="relative mx-auto max-w-3xl px-6 py-4 text-center">
      <span
        aria-hidden="true"
        className="gold-text pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 font-display text-[10rem] leading-none opacity-30"
      >
        “
      </span>

      <div className="relative min-h-[160px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <p className="font-display text-2xl font-medium italic text-ink md:text-3xl">
              &ldquo;{current.quote}&rdquo;
            </p>
            <p className="mt-6 font-body text-caption font-medium uppercase tracking-label text-rose-deep">
              {current.name} · Verified Google Review
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-8 flex items-center justify-center gap-6">
        <button
          type="button"
          aria-label="Previous testimonial"
          onClick={prev}
          className="flex h-11 w-11 items-center justify-center text-ink/60 hover:text-rose-deep"
        >
          ←
        </button>
        <div className="flex gap-2">
          {TESTIMONIALS.map((t, i) => (
            <button
              key={t.name}
              aria-label={`Show testimonial ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-2.5 w-2.5 rounded-full transition-colors ${i === index ? "bg-rose" : "bg-ink/20"}`}
            />
          ))}
        </div>
        <button
          type="button"
          aria-label="Next testimonial"
          onClick={next}
          className="flex h-11 w-11 items-center justify-center text-ink/60 hover:text-rose-deep"
        >
          →
        </button>
      </div>
    </div>
  );
}
