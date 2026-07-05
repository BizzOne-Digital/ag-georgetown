"use client";

import { useEffect, useState } from "react";

const TABS = [
  { id: "fragrances", label: "Fragrances" },
  { id: "makeup", label: "Makeup" },
  { id: "skincare", label: "Skincare" },
  { id: "accessories", label: "Accessories & Self-Care" },
];

export function CategoryTabs() {
  const [active, setActive] = useState(TABS[0].id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );

    TABS.forEach((tab) => {
      const el = document.getElementById(tab.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="sticky top-20 z-30 border-b border-ink/10 bg-cream/95 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl gap-8 overflow-x-auto px-6 lg:px-10">
        {TABS.map((tab) => (
          <a
            key={tab.id}
            href={`#${tab.id}`}
            className={`shrink-0 py-4 font-body text-sm font-medium tracking-[0.02em] transition-colors ${
              active === tab.id ? "text-ink" : "text-ink/50"
            } relative`}
          >
            {tab.label}
            {active === tab.id && (
              <span className="absolute inset-x-0 -bottom-px h-[2px] bg-gold" />
            )}
          </a>
        ))}
      </nav>
    </div>
  );
}
