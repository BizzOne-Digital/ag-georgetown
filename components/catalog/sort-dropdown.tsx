"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SORT_OPTIONS, type CatalogSort } from "@/lib/catalog/types";

interface SortDropdownProps {
  current: CatalogSort;
}

export function SortDropdown({ current }: SortDropdownProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    params.delete("limit"); // changing sort order resets how many results are shown
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <label className="flex items-center gap-2 font-body text-sm text-ink/70">
      Sort by
      <select
        value={current}
        onChange={(e) => handleChange(e.target.value)}
        className="border-[1.5px] border-ink/15 bg-cream px-3 py-2 font-body text-sm text-ink focus:border-rose-deep focus:outline-none"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}
