"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { CatalogFacets } from "@/lib/catalog/types";

interface SidebarFiltersProps {
  facets: CatalogFacets;
  current: {
    types: string[];
    availability: string[];
    brands: string[];
    minPrice: number | undefined;
    maxPrice: number | undefined;
  };
}

function FilterGroup({
  title,
  onRemoveAll,
  hasSelection,
  children,
}: {
  title: string;
  onRemoveAll: () => void;
  hasSelection: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-ink/10 py-6 first:pt-0">
      <div className="flex items-center justify-between">
        <h3 className="font-body text-caption font-medium uppercase tracking-label text-ink">{title}</h3>
        {hasSelection && (
          <button
            type="button"
            onClick={onRemoveAll}
            className="font-body text-xs text-rose-deep underline-offset-2 hover:underline"
          >
            Remove All
          </button>
        )}
      </div>
      <div className="mt-4 space-y-2.5">{children}</div>
    </div>
  );
}

function CheckboxRow({
  label,
  count,
  checked,
  onChange,
}: {
  label: string;
  count: number;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-2 font-body text-sm text-ink/80">
      <span className="flex items-center gap-2.5">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="h-4 w-4 accent-rose-deep"
        />
        {label}
      </span>
      <span className="text-ink/40">({count})</span>
    </label>
  );
}

export function SidebarFilters({ facets, current }: SidebarFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [types, setTypes] = useState<Set<string>>(new Set(current.types));
  const [availability, setAvailability] = useState<Set<string>>(new Set(current.availability));
  const [brands, setBrands] = useState<Set<string>>(new Set(current.brands));
  const [minPrice, setMinPrice] = useState(current.minPrice?.toString() ?? "");
  const [maxPrice, setMaxPrice] = useState(current.maxPrice?.toString() ?? "");

  // Re-sync local (pending) selections whenever the URL's filters change
  // from outside this component - e.g. picking a different category from
  // the mega-menu, or the browser back button.
  useEffect(() => {
    setTypes(new Set(current.types));
    setAvailability(new Set(current.availability));
    setBrands(new Set(current.brands));
    setMinPrice(current.minPrice?.toString() ?? "");
    setMaxPrice(current.maxPrice?.toString() ?? "");
  }, [current.types, current.availability, current.brands, current.minPrice, current.maxPrice]);

  function toggle(set: Set<string>, setter: (s: Set<string>) => void, value: string) {
    const next = new Set(set);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    setter(next);
  }

  function applyFilters() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("limit"); // a new filter set starts back at page one

    const setOrDelete = (key: string, value: string) => (value ? params.set(key, value) : params.delete(key));
    setOrDelete("type", Array.from(types).join(","));
    setOrDelete("availability", Array.from(availability).join(","));
    setOrDelete("brand", Array.from(brands).join(","));
    setOrDelete("minPrice", minPrice.trim());
    setOrDelete("maxPrice", maxPrice.trim());

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <aside className="w-full shrink-0 lg:w-64">
      <FilterGroup title="Product Type" onRemoveAll={() => setTypes(new Set())} hasSelection={types.size > 0}>
        {facets.types.map((opt) => (
          <CheckboxRow
            key={opt.value}
            label={opt.label}
            count={opt.count}
            checked={types.has(opt.value)}
            onChange={() => toggle(types, setTypes, opt.value)}
          />
        ))}
      </FilterGroup>

      <FilterGroup
        title="Availability"
        onRemoveAll={() => setAvailability(new Set())}
        hasSelection={availability.size > 0}
      >
        {facets.availability.map((opt) => (
          <CheckboxRow
            key={opt.value}
            label={opt.label}
            count={opt.count}
            checked={availability.has(opt.value)}
            onChange={() => toggle(availability, setAvailability, opt.value)}
          />
        ))}
      </FilterGroup>

      <div className="border-b border-ink/10 py-6">
        <h3 className="font-body text-caption font-medium uppercase tracking-label text-ink">Price</h3>
        <div className="mt-4 flex items-center gap-3">
          <input
            type="number"
            min={0}
            placeholder={`$${facets.priceRange.min}`}
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full border-[1.5px] border-ink/15 bg-cream px-3 py-2 font-body text-sm text-ink focus:border-rose-deep focus:outline-none"
            aria-label="Minimum price"
          />
          <span className="text-ink/40">to</span>
          <input
            type="number"
            min={0}
            placeholder={`$${facets.priceRange.max}`}
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full border-[1.5px] border-ink/15 bg-cream px-3 py-2 font-body text-sm text-ink focus:border-rose-deep focus:outline-none"
            aria-label="Maximum price"
          />
        </div>
      </div>

      <FilterGroup title="Brand" onRemoveAll={() => setBrands(new Set())} hasSelection={brands.size > 0}>
        <div className="max-h-64 space-y-2.5 overflow-y-auto pr-1">
          {facets.brands.map((opt) => (
            <CheckboxRow
              key={opt.value}
              label={opt.label}
              count={opt.count}
              checked={brands.has(opt.value)}
              onChange={() => toggle(brands, setBrands, opt.value)}
            />
          ))}
        </div>
      </FilterGroup>

      <button
        type="button"
        onClick={applyFilters}
        className="mt-6 w-full bg-rose px-6 py-3 font-body text-sm font-medium tracking-[0.02em] text-cream transition-colors duration-300 hover:bg-rose-deep"
      >
        Apply Filters
      </button>
    </aside>
  );
}
