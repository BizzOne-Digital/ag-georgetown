"use client";

import { useCallback, useState } from "react";

interface FoilSweepProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Signature "foil sweep" motion: a diagonal light band that crosses the
 * element once on hover/focus (desktop) or once on tap (touch devices).
 * Never loops, never fires on page load.
 */
export function FoilSweep({ children, className = "" }: FoilSweepProps) {
  const [tapped, setTapped] = useState(false);

  const handleTouch = useCallback(() => {
    setTapped(true);
    window.setTimeout(() => setTapped(false), 550);
  }, []);

  return (
    <span
      className={`group relative inline-block overflow-hidden ${className}`}
      onTouchStart={handleTouch}
    >
      {children}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 -translate-x-[150%] rotate-[-20deg] bg-gradient-to-r from-transparent via-white/30 to-transparent blur-sm transition-transform duration-500 ease-out-soft group-hover:translate-x-[150%] group-focus-visible:translate-x-[150%] motion-reduce:hidden ${
          tapped ? "translate-x-[150%]" : ""
        }`}
      />
    </span>
  );
}
