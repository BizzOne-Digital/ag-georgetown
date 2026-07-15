// Dedupes what were 3 near-identical inline checks (product-card.tsx,
// price-tag.tsx, and the catalog's on-sale filter).
export function isOnSale(p: { price: number | null; compareAtPrice?: number | null }): boolean {
  return p.price !== null && p.compareAtPrice !== null && p.compareAtPrice !== undefined && p.compareAtPrice > p.price;
}
