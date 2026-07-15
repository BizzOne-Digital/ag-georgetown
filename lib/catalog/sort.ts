import type { AnnotatedProduct, CatalogSort } from "./types";

export function sortProducts(products: AnnotatedProduct[], sort: CatalogSort | undefined): AnnotatedProduct[] {
  const arr = [...products];

  switch (sort) {
    case "title-asc":
      return arr.sort((a, b) => a.title.localeCompare(b.title));
    case "title-desc":
      return arr.sort((a, b) => b.title.localeCompare(a.title));
    case "price-asc":
      return arr.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
    case "price-desc":
      return arr.sort((a, b) => (b.price ?? -Infinity) - (a.price ?? -Infinity));
    case "date-asc":
      return arr.sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt));
    case "date-desc":
      return arr.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    case "best-selling":
      // No order history exists yet to rank by - fall back to the same
      // natural order as "featured" rather than fabricating a popularity signal.
      return arr;
    case "featured":
    default:
      return arr; // natural (insertion) order from MongoDB
  }
}
