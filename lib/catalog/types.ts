import type { IProduct } from "@/lib/models/Product";
import type { ProductType } from "./classify";

export type CatalogSort =
  | "featured"
  | "best-selling"
  | "title-asc"
  | "title-desc"
  | "price-asc"
  | "price-desc"
  | "date-asc"
  | "date-desc";

export const SORT_OPTIONS: { value: CatalogSort; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "best-selling", label: "Best selling" },
  { value: "title-asc", label: "Alphabetically, A-Z" },
  { value: "title-desc", label: "Alphabetically, Z-A" },
  { value: "price-asc", label: "Price, low to high" },
  { value: "price-desc", label: "Price, high to low" },
  { value: "date-asc", label: "Date, old to new" },
  { value: "date-desc", label: "Date, new to old" },
];

export interface CatalogFilters {
  categorySlug?: string;
  types?: ProductType[];
  availability?: Array<"in-stock" | "out-of-stock">;
  brands?: string[];
  minPrice?: number;
  maxPrice?: number;
  sort?: CatalogSort;
  limit?: number;
  // Restricts to discounted items before facets are built (see
  // getCatalogData) - used by the Offers page, always true there so its
  // sidebar counts reflect only the on-sale set, not the whole catalog.
  onSale?: boolean;
}

export type AnnotatedProduct = IProduct & {
  productType: ProductType;
  inStock: boolean;
  category: { slug: string; title: string } & Record<string, unknown>;
};

export interface FacetOption {
  value: string;
  label: string;
  count: number;
}

export interface CatalogFacets {
  types: FacetOption[];
  availability: FacetOption[];
  brands: FacetOption[];
  priceRange: { min: number; max: number };
}

export const DEFAULT_PAGE_SIZE = 24;
