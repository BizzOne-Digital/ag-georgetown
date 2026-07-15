import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db/connect";
import { setProductVariants } from "@/lib/repositories/product.repository";
import { readJson, printFailures, type CleanedProduct, type FailedRecord } from "./lib";
import type { IProductVariant } from "@/lib/models/Product";

// Requirement 3: variants. Runs after import-products.ts has created the
// base product rows (setProductVariants is a no-op if the product doesn't
// exist yet - reported as a failure, not silently dropped).
export async function importVariants(products: CleanedProduct[]) {
  // Connect once up front - a real connectivity problem should abort
  // immediately with one clear error, not retry (and fail) per record.
  await connectToDatabase();

  const failed: FailedRecord[] = [];
  let total = 0;

  for (const p of products) {
    const variants: IProductVariant[] = [];

    for (const v of p.variants) {
      if (v.price === null || v.price === undefined) {
        // Never fabricate a price - skip this one variant, not the product.
        failed.push({
          type: "variant",
          identifier: `${p.slug} (shopify variant ${v.id})`,
          reason: "variant has no usable price in the source data - skipped rather than fabricating one",
        });
        continue;
      }

      variants.push({
        _id: new mongoose.Types.ObjectId(),
        shopifyId: v.id,
        title: v.title,
        sku: v.sku,
        price: v.price,
        compareAtPrice: v.compareAtPrice,
        options: v.options ?? [],
        // Same convention as Product.stock: null = unknown, 0 = confirmed unavailable, never fabricated.
        stock: v.available ? null : 0,
        available: Boolean(v.available),
        grams: v.grams,
      });
    }

    try {
      const result = await setProductVariants(p.slug, variants);
      if (result.matchedCount === 0) {
        failed.push({
          type: "variant",
          identifier: p.slug,
          reason: "product not found - run the products import first",
        });
        continue;
      }
      total += variants.length;
    } catch (err) {
      failed.push({ type: "variant", identifier: p.slug, reason: (err as Error).message });
    }
  }

  return { total, failed };
}

async function main() {
  const { products } = await readJson<{ products: CleanedProduct[] }>("products.cleaned.json");
  console.log(`Importing variants for ${products.length} products...`);
  const result = await importVariants(products);
  console.log(`Done: ${result.total} variants imported, ${result.failed.length} failed.`);
  printFailures(result.failed);
  if (result.failed.length > 0) process.exitCode = 1;
}

const isMain = typeof require !== "undefined" && require.main === module;
if (isMain) {
  main()
    .catch((err) => {
      console.error("Fatal error importing variants:", err);
      process.exitCode = 1;
    })
    .finally(async () => {
      await mongoose.disconnect();
    });
}
