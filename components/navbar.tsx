"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Monogram } from "./monogram";
import { NAV_LINKS } from "@/lib/site";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || open ? "bg-cream shadow-sm" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <Monogram className="h-10 w-10" variant="gold" />
          <span className="font-display text-lg font-medium text-ink">AG Liquidation</span>
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="group relative font-body text-sm font-medium text-ink"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-gold transition-all duration-300 group-hover:w-full" />
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="/contact"
          className="hidden min-h-[44px] items-center justify-center bg-rose px-6 py-3 text-sm font-medium text-cream transition-colors duration-300 hover:bg-rose-deep md:inline-flex"
        >
          Get Directions
        </Link>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 md:hidden"
        >
          <span
            className={`h-[1.5px] w-6 bg-ink transition-transform duration-300 ${open ? "translate-y-[6.5px] rotate-45" : ""}`}
          />
          <span className={`h-[1.5px] w-6 bg-ink transition-opacity duration-300 ${open ? "opacity-0" : ""}`} />
          <span
            className={`h-[1.5px] w-6 bg-ink transition-transform duration-300 ${open ? "-translate-y-[6.5px] -rotate-45" : ""}`}
          />
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 top-20 z-40 flex flex-col bg-cream md:hidden"
          >
            <ul className="flex flex-col gap-2 px-8 pt-10">
              {NAV_LINKS.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.06, ease: "easeOut" }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block py-3 font-display text-4xl font-medium text-ink"
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
            <div className="mt-auto px-8 pb-12">
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="flex min-h-[44px] w-full items-center justify-center bg-rose px-6 py-4 text-sm font-medium text-cream"
              >
                Get Directions
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
