"use client";

import { motion, useReducedMotion } from "framer-motion";
import { viewportOnce } from "@/lib/motion";
import { MILESTONES } from "@/lib/milestones";

export function MilestonesTimeline() {
  const reduceMotion = useReducedMotion();

  return (
    <ol className="relative flex flex-col gap-10 md:flex-row md:justify-between md:gap-20">
      <div className="absolute bottom-2 left-[5px] top-2 w-px bg-gold opacity-30 md:hidden" aria-hidden="true" />
      <div className="absolute left-0 right-0 top-1.5 hidden h-px bg-gold opacity-30 md:block" aria-hidden="true" />

      {MILESTONES.map((m, i) => {
        const content = (
          <>
            <span
              className="relative z-10 mt-1 h-3 w-3 shrink-0 rounded-full bg-gold md:mt-0 md:h-4 md:w-4"
              aria-hidden="true"
            />
            <div>
              <h3 className="font-display text-lg font-medium text-ink">{m.title}</h3>
              <p className="mt-1 max-w-[220px] font-body text-sm text-ink/70">{m.description}</p>
            </div>
          </>
        );

        if (reduceMotion) {
          return (
            <li key={m.title} className="relative flex gap-4 md:flex-1 md:flex-col md:items-center md:text-center">
              {content}
            </li>
          );
        }

        return (
          <motion.li
            key={m.title}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={viewportOnce}
            transition={{ duration: 0.4, ease: "easeOut", delay: i * 0.15 }}
            className="relative flex gap-4 md:flex-1 md:flex-col md:items-center md:text-center"
          >
            {content}
          </motion.li>
        );
      })}
    </ol>
  );
}
