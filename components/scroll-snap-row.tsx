"use client";

import { useRef } from "react";

export function ScrollSnapRow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    const container = containerRef.current;
    if (!container) return;
    const cards = Array.from(container.querySelectorAll<HTMLElement>("[data-scroll-card]"));
    const currentIndex = cards.indexOf(document.activeElement as HTMLElement);

    if (e.key === "ArrowRight" && currentIndex < cards.length - 1) {
      e.preventDefault();
      const next = cards[currentIndex + 1];
      next?.focus();
      next?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    } else if (e.key === "ArrowLeft" && currentIndex > 0) {
      e.preventDefault();
      const prev = cards[currentIndex - 1];
      prev?.focus();
      prev?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }

  return (
    <div
      ref={containerRef}
      onKeyDown={handleKeyDown}
      className={`flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 [-webkit-overflow-scrolling:touch] ${className}`}
    >
      {children}
    </div>
  );
}

export function ScrollSnapItem({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      data-scroll-card
      tabIndex={0}
      className={`snap-start shrink-0 rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-start ${className}`}
    >
      {children}
    </div>
  );
}
