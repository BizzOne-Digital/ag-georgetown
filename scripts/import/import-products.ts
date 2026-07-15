import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db/connect";
import { listCategories } from "@/lib/repositories/category.repository";
import { upsertProductBase } from "@/lib/repositories/product.repository";
import { readJson, printFailures, type CleanedProduct, type FailedRecord } from "./lib";

// Requirement 2: products. Only base fields (slug/title/description/price/
// category, etc.) - deliberately leaves `images`/`variants` alone so this
// can run before or after those two steps in any order.
export async function importProducts(products: CleanedProduct[]) {
  // Connect once up front - a real connectivity problem should abort
  // immediately with one clear error, not retry (and fail) per record.
  await connectToDatabase();
  const categories = await listCategories();
  const slugToCategoryId = new Map(categories.map((c) => [c.slug, String(c._id)]));

  const failed: FailedRecord[] = [];
  let total = 0;

  for (const p of products) {
    const categoryId = slugToCategoryId.get(p.category);
    if (!categoryId) {
      failed.push({
        type: "product",
        identifier: p.slug,
        reason: `category slug "${p.category}" was not found - run the categories import first`,
      });
      continue;
    }

    try {
      await upsertProductBase({
        shopifyId: p.id,
        slug: p.slug,
        title: p.title,
        description: p.description ?? "",
        vendor: p.vendor,
        tags: p.tags ?? [],
        price: p.price,
        compareAtPrice: p.compareAtPrice,
        sku: p.sku,
        stock: p.stock,
        isActive: true,
        category: categoryId as unknown as mongoose.Types.ObjectId,
      });
      total += 1;
    } catch (err) {
      failed.push({ type: "product", identifier: p.slug, reason: (err as Error).message });
    }
  }

  return { total, failed };
}

async function main() {
  const { products } = await readJson<{ products: CleanedProduct[] }>("products.cleaned.json");
  console.log(`Importing ${products.length} products...`);
  const result = await importProducts(products);
  console.log(`Done: ${result.total} products imported, ${result.failed.length} failed.`);
  printFailures(result.failed);
  if (result.failed.length > 0) process.exitCode = 1;
}

const isMain = typeof require !== "undefined" && require.main === module;
if (isMain) {
  main()
    .catch((err) => {
      console.error("Fatal error importing products:", err);
      process.exitCode = 1;
    })
    .finally(async () => {
      await mongoose.disconnect();
    });
}
