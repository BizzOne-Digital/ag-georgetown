import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db/connect";
import { Category, Product, Customer, Order, NewsletterSubscriber, DiscountCode } from "@/lib/models";
import { importCategories } from "../import/import-categories";
import { importProducts } from "../import/import-products";
import { importVariants } from "../import/import-variants";
import { importImages } from "../import/import-images";
import { readJson, printFailures, type CleanedCategory, type CleanedProduct } from "../import/lib";

// DESTRUCTIVE - development only. Drops every collection this app owns and
// reseeds the catalog from data/*.cleaned.json. Never run this against a
// database that has real customers/orders in it.
async function main() {
  await connectToDatabase();

  console.log("Dropping collections: Category, Product, Customer, Order, NewsletterSubscriber, DiscountCode...");
  for (const model of [Category, Product, Customer, Order, NewsletterSubscriber, DiscountCode]) {
    await model.collection.drop().catch((err: { codeName?: string }) => {
      if (err.codeName !== "NamespaceNotFound") throw err; // fine - nothing to drop yet
    });
  }

  const { categories } = await readJson<{ categories: CleanedCategory[] }>("categories.cleaned.json");
  const { products } = await readJson<{ products: CleanedProduct[] }>("products.cleaned.json");

  console.log(`Reimporting ${categories.length} categories...`);
  const categoryResult = await importCategories(categories);

  console.log(`Reimporting ${products.length} products...`);
  const productResult = await importProducts(products);

  console.log("Reimporting variants...");
  const variantResult = await importVariants(products);

  console.log("Reimporting images...");
  const imageResult = await importImages(products);

  const allFailed = [...categoryResult.failed, ...productResult.failed, ...variantResult.failed, ...imageResult.failed];

  console.log("\n=== Reset + Reseed Summary ===");
  console.log(`Total categories imported: ${categoryResult.total}`);
  console.log(`Total products imported:   ${productResult.total}`);
  console.log(`Total variants imported:   ${variantResult.total}`);
  console.log(`Total images imported:     ${imageResult.total}`);
  console.log(`Failed records:            ${allFailed.length}`);
  printFailures(allFailed);

  if (allFailed.length > 0) process.exitCode = 1;
}

main()
  .catch((err) => {
    console.error("Fatal error during reset:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
