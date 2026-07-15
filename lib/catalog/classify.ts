// The source data has no real "gender"/product-type field - Shopify tags are
// free-text (e.g. "Men's Fragrance", "for her", "unisex oud"). This is a
// best-effort heuristic over that free text, not authoritative data. Word
// boundaries (\b) matter: naive substring matching would find "men" inside
// "women" - \b requires an actual word break, so it doesn't.
const UNISEX_RE = /\bunisex\b/i;
const FEMALE_RE = /\b(women|woman|female|her)\b/i;
const MALE_RE = /\b(men|man|male|him)\b/i;

export type ProductType = "Female" | "Male" | "Unisex";
export const PRODUCT_TYPES: ProductType[] = ["Female", "Male", "Unisex"];

export function classifyProductType(tags: string[]): ProductType {
  const joined = tags.join(" ");
  if (UNISEX_RE.test(joined)) return "Unisex";

  const isFemale = FEMALE_RE.test(joined);
  const isMale = MALE_RE.test(joined);

  if (isFemale && !isMale) return "Female";
  if (isMale && !isFemale) return "Male";
  // Both matched (e.g. "for men and women") or neither matched (most
  // skincare/cosmetics have no gender-coded tag at all) - Unisex is the
  // sensible default bucket for either case.
  return "Unisex";
}

export interface StockLike {
  stock: number | null;
  variants: Array<{ available: boolean }>;
}

// null = unknown quantity (never fabricated - see the import scripts), so
// we only call something "out of stock" when the data explicitly says so.
export function isInStock(product: StockLike): boolean {
  if (product.variants.length > 0) {
    return product.variants.some((v) => v.available);
  }
  return product.stock !== 0;
}
