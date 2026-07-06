"use client";

import { motion, useReducedMotion } from "framer-motion";
import { viewportOnce } from "@/lib/motion";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

const word = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export function StaggerText({ text, className = "" }: { text: string; className?: string }) {
  const reduceMotion = useReducedMotion();
  const words = text.split(" ");

  if (reduceMotion) {
    return <span className={className}>{text}</span>;
  }

  return (
    <motion.span
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={container}
    >
      {words.map((w, i) => (
        <span key={`${w}-${i}`}>
          <motion.span className="inline-block" variants={word}>
            {w}
          </motion.span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </motion.span>
  );
}
