"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { DEFAULT_PAGE_SIZE } from "@/lib/catalog/types";

interface ShowMoreButtonProps {
  currentCount: number;
  total: number;
}

export function ShowMoreButton({ currentCount, total }: ShowMoreButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (currentCount >= total) return null;

  function handleClick() {
    const params = new URLSearchParams(searchParams.toString());
    params.set("limit", String(currentCount + DEFAULT_PAGE_SIZE));
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="mt-12 flex flex-col items-center gap-2">
      <p className="font-body text-sm text-ink/50">
        Showing {currentCount} of {total} products
      </p>
      <button
        type="button"
        onClick={handleClick}
        className="border-[1.5px] gold-border px-8 py-3 font-body text-sm font-medium tracking-[0.02em] text-ink transition-colors duration-300 hover:bg-cream"
      >
        Show More
      </button>
    </div>
  );
}
