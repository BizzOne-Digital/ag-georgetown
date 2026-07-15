import mongoose from "mongoose";
import { importCategories } from "./import-categories";
import { importProducts } from "./import-products";
import { importVariants } from "./import-variants";
import { importImages } from "./import-images";
import { readJson, printFailures, type CleanedCategory, type CleanedProduct } from "./lib";

async function main() {
  console.log("=== Importing catalog into MongoDB (categories -> products -> variants -> images) ===\n");

  const { categories } = await readJson<{ categories: CleanedCategory[] }>("categories.cleaned.json");
  const { products } = await readJson<{ products: CleanedProduct[] }>("products.cleaned.json");

  console.log(`[1/4] Categories (${categories.length})...`);
  const categoryResult = await importCategories(categories);
  console.log(`      -> ${categoryResult.total} imported, ${categoryResult.failed.length} failed`);

  console.log(`[2/4] Products (${products.length})...`);
  const productResult = await importProducts(products);
  console.log(`      -> ${productResult.total} imported, ${productResult.failed.length} failed`);

  console.log(`[3/4] Variants...`);
  const variantResult = await importVariants(products);
  console.log(`      -> ${variantResult.total} imported, ${variantResult.failed.length} failed`);

  console.log(`[4/4] Images...`);
  const imageResult = await importImages(products);
  console.log(`      -> ${imageResult.total} imported, ${imageResult.failed.length} failed`);

  const allFailed = [
    ...categoryResult.failed,
    ...productResult.failed,
    ...variantResult.failed,
    ...imageResult.failed,
  ];

  console.log("\n=== Import Summary ===");
  console.log(`Total categories imported: ${categoryResult.total}`);
  console.log(`Total products imported:   ${productResult.total}`);
  console.log(`Total variants imported:   ${variantResult.total}`);
  console.log(`Total images imported:     ${imageResult.total}`);
  console.log(`Failed records:            ${allFailed.length}`);
  printFailures(allFailed);

  if (allFailed.length > 0) process.exitCode = 1;
}

const isMain = typeof require !== "undefined" && require.main === module;
if (isMain) {
  main()
    .catch((err) => {
      console.error("Fatal error during import:", err);
      process.exitCode = 1;
    })
    .finally(async () => {
      await mongoose.disconnect();
    });
}
