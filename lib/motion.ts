import type { Variants } from "framer-motion";

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export const staggerContainer = (stagger = 0.08): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger },
  },
});

export const heroEyebrowHeadline: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export const heroCtaRow: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut", delay: 0.2 },
  },
};

export const viewportOnce = { once: true, margin: "-80px" };
