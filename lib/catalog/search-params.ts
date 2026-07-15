import { DEFAULT_PAGE_SIZE, type CatalogFilters, type CatalogSort } from "./types";

export type SearchParamValue = string | string[] | undefined;

export function toSingle(value: SearchParamValue): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export function parseList(value: SearchParamValue): string[] {
  const single = toSingle(value);
  return single ? single.split(",").filter(Boolean) : [];
}

export function parseNumber(value: SearchParamValue): number | undefined {
  const single = toSingle(value);
  if (!single) return undefined;
  const n = Number(single);
  return Number.isFinite(n) ? n : undefined;
}

// Shared by /products and /offers - both read the same filter/sort/
// pagination query params. `overrides` lets a caller force a filter (e.g.
// Offers always sets onSale: true) regardless of what's in the URL.
export function parseCatalogFilters(
  searchParams: Record<string, SearchParamValue>,
  overrides: Partial<CatalogFilters> = {}
): CatalogFilters {
  return {
    categorySlug: toSingle(searchParams.category),
    types: parseList(searchParams.type) as CatalogFilters["types"],
    availability: parseList(searchParams.availability) as CatalogFilters["availability"],
    brands: parseList(searchParams.brand),
    minPrice: parseNumber(searchParams.minPrice),
    maxPrice: parseNumber(searchParams.maxPrice),
    sort: (toSingle(searchParams.sort) as CatalogSort) || "featured",
    limit: parseNumber(searchParams.limit) ?? DEFAULT_PAGE_SIZE,
    ...overrides,
  };
}
