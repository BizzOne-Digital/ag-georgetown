import { PRODUCT_TYPES } from "./classify";
import type { AnnotatedProduct, CatalogFacets } from "./types";

// Facet counts are computed from the category-scoped set only (ignoring
// whichever other filters are currently active) - the common, simpler
// convention most storefronts use so counts don't jump around as someone
// checks boxes, at the cost of not showing a fully cross-filtered count.
export function buildFacets(products: AnnotatedProduct[]): CatalogFacets {
  const typeCounts = new Map<string, number>();
  const availCounts = { "in-stock": 0, "out-of-stock": 0 };
  const brandCounts = new Map<string, number>();
  let min = Infinity;
  let max = 0;

  for (const p of products) {
    typeCounts.set(p.productType, (typeCounts.get(p.productType) ?? 0) + 1);
    availCounts[p.inStock ? "in-stock" : "out-of-stock"] += 1;
    if (p.vendor) brandCounts.set(p.vendor, (brandCounts.get(p.vendor) ?? 0) + 1);
    if (p.price !== null && p.price !== undefined) {
      min = Math.min(min, p.price);
      max = Math.max(max, p.price);
    }
  }

  return {
    types: PRODUCT_TYPES.map((value) => ({ value, label: value, count: typeCounts.get(value) ?? 0 })),
    availability: [
      { value: "in-stock", label: "In stock", count: availCounts["in-stock"] },
      { value: "out-of-stock", label: "Out of stock", count: availCounts["out-of-stock"] },
    ],
    brands: Array.from(brandCounts.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([value, count]) => ({ value, label: value, count })),
    priceRange: { min: min === Infinity ? 0 : Math.floor(min), max: Math.ceil(max) || 0 },
  };
}
