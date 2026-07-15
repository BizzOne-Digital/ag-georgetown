import { normalizeCategories } from "./normalize-categories.mjs";
import { normalizePages } from "./normalize-pages.mjs";
import { normalizeProducts } from "./normalize-products.mjs";
import { normalizeNavigation } from "./normalize-navigation.mjs";

async function main() {
  console.log("=== Normalizing scraped AG Cosmetics data (read-only, no DB writes) ===\n");

  // Categories first: products and navigation both need its slug map.
  const categoriesResult = await normalizeCategories();
  const pagesResult = await normalizePages();
  const productsResult = await normalizeProducts();
  const navigationResult = await normalizeNavigation();

  const coveragePct = ((1 - productsResult.uncategorized / productsResult.total) * 100).toFixed(1);
  const topCategories = Array.from(productsResult.categoryUsage.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  console.log("\n=== Summary Report ===");
  console.log(`Products:   ${productsResult.total}`);
  console.log(
    `Categories: ${categoriesResult.total}  (real: ${categoriesResult.real}, group-only: ${categoriesResult.virtual}, unlinked-from-nav: ${categoriesResult.orphan}, cross-linked: ${categoriesResult.crossLinked})`
  );
  console.log(`Pages:      ${pagesResult.total}`);
  console.log(`Navigation: ${navigationResult.total} top-level item(s)`);

  console.log(`\nProduct -> category match coverage: ${productsResult.total - productsResult.uncategorized}/${productsResult.total} (${coveragePct}%)`);
  console.log(`Uncategorized products: ${productsResult.uncategorized}`);
  console.log("Top categories by product count in this run:");
  for (const [slug, count] of topCategories) {
    console.log(`  - ${slug}: ${count}`);
  }

  console.log("\nKnown limitations (inherent to Shopify's public storefront API, not this script):");
  console.log("  - No product<->collection membership is exposed, so `category` is inferred from product_type/tags and may miss real assignments.");
  console.log("  - No numeric inventory is exposed. `stock` is 0 only when Shopify marks a variant unavailable, otherwise null (unknown - needs a manual count before go-live).");
  console.log("  - `pages.json` entries have `content: null` - only the page title/URL were discoverable from the nav; body copy needs a separate fetch.");

  console.log("\nNo database writes performed. Output: data/products.json, data/categories.json, data/navigation.json, data/pages.json.");
}

main().catch((err) => {
  console.error("Fatal error during normalization:", err);
  process.exitCode = 1;
});
