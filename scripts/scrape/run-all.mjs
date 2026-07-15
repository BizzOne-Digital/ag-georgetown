import { scrapeProducts } from "./fetch-products.mjs";
import { scrapeCollections } from "./fetch-collections.mjs";
import { scrapeNavigation } from "./fetch-navigation.mjs";

async function main() {
  console.log("=== AG Cosmetics data extraction (read-only, no DB writes) ===\n");

  const productsResult = await scrapeProducts();
  console.log("");
  const collectionsResult = await scrapeCollections();
  console.log("");
  const navigationResult = await scrapeNavigation();

  const failures = [
    ...productsResult.failedPages.map((f) => ({ type: "products", ...f })),
    ...collectionsResult.failedPages.map((f) => ({ type: "collections", ...f })),
    ...(navigationResult.error ? [{ type: "navigation", error: navigationResult.error }] : []),
  ];

  console.log("\n=== Summary ===");
  console.log(`Products extracted:      ${productsResult.total}`);
  console.log(`Collections extracted:   ${collectionsResult.total}`);
  console.log(`Navigation items:        ${navigationResult.total}`);
  if (failures.length === 0) {
    console.log("Failed/missing requests: none");
  } else {
    console.log(`Failed/missing requests: ${failures.length}`);
    for (const f of failures) {
      console.log(`  - [${f.type}] ${f.url ?? "(homepage)"} -> ${f.error}`);
    }
  }
}

main().catch((err) => {
  console.error("Fatal error during scraping:", err);
  process.exitCode = 1;
});
