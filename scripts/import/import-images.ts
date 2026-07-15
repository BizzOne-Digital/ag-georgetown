import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db/connect";
import { setProductImages } from "@/lib/repositories/product.repository";
import { readJson, printFailures, type CleanedProduct, type FailedRecord } from "./lib";
import type { IProductImage } from "@/lib/models/Product";

// Requirement 4: images. Runs after import-products.ts. The source data has
// no stable image id, only a URL, so this replaces a product's whole image
// array each run rather than risking duplicate entries on a reseed.
export async function importImages(products: CleanedProduct[]) {
  // Connect once up front - a real connectivity problem should abort
  // immediately with one clear error, not retry (and fail) per record.
  await connectToDatabase();

  const failed: FailedRecord[] = [];
  let total = 0;

  for (const p of products) {
    const images: IProductImage[] = p.images.map((img, index) => ({
      _id: new mongoose.Types.ObjectId(),
      src: img.src, // preserve the original Shopify CDN URL exactly
      alt: img.alt,
      width: img.width,
      height: img.height,
      position: index,
    }));

    try {
      const result = await setProductImages(p.slug, images);
      if (result.matchedCount === 0) {
        failed.push({
          type: "image",
          identifier: p.slug,
          reason: "product not found - run the products import first",
        });
        continue;
      }
      total += images.length;
    } catch (err) {
      failed.push({ type: "image", identifier: p.slug, reason: (err as Error).message });
    }
  }

  return { total, failed };
}

async function main() {
  const { products } = await readJson<{ products: CleanedProduct[] }>("products.cleaned.json");
  console.log(`Importing images for ${products.length} products...`);
  const result = await importImages(products);
  console.log(`Done: ${result.total} images imported, ${result.failed.length} failed.`);
  printFailures(result.failed);
  if (result.failed.length > 0) process.exitCode = 1;
}

const isMain = typeof require !== "undefined" && require.main === module;
if (isMain) {
  main()
    .catch((err) => {
      console.error("Fatal error importing images:", err);
      process.exitCode = 1;
    })
    .finally(async () => {
      await mongoose.disconnect();
    });
}
