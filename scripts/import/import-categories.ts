import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db/connect";
import { setCategoryParent, upsertCategoryBySlug } from "@/lib/repositories/category.repository";
import { readJson, printFailures, type CleanedCategory, type FailedRecord } from "./lib";

// Requirement 1: categories first. The source file is sorted alphabetically
// by slug, so a child (e.g. "afnan") can appear before its parent
// ("brands") - a single pass would try to set a parent that doesn't exist
// as a row yet. Pass 1 upserts every category with no parent link; pass 2
// wires up `parent` once every slug is guaranteed to already exist.
export async function importCategories(categories: CleanedCategory[]) {
  // Connect once up front - a real connectivity problem should abort
  // immediately with one clear error, not retry (and fail) per record.
  await connectToDatabase();

  const slugToId = new Map<string, string>();
  const failed: FailedRecord[] = [];

  for (const cat of categories) {
    try {
      const row = await upsertCategoryBySlug(cat.slug, {
        shopifyId: cat.id,
        title: cat.title,
        description: cat.description ?? "",
        isVirtual: Boolean(cat.isVirtual),
        isFallback: Boolean(cat.isFallback),
        productCount: cat.productCount ?? 0,
      });
      slugToId.set(cat.slug, String(row._id));
    } catch (err) {
      failed.push({ type: "category", identifier: cat.slug, reason: (err as Error).message });
    }
  }

  for (const cat of categories) {
    if (!cat.parentSlug) continue;
    if (!slugToId.has(cat.slug)) continue; // already recorded as failed above

    const parentId = slugToId.get(cat.parentSlug);
    if (!parentId) {
      failed.push({
        type: "category",
        identifier: cat.slug,
        reason: `parent slug "${cat.parentSlug}" was not found among imported categories`,
      });
      continue;
    }

    try {
      await setCategoryParent(cat.slug, parentId);
    } catch (err) {
      failed.push({ type: "category", identifier: cat.slug, reason: (err as Error).message });
    }
  }

  return { slugToId, failed, total: slugToId.size };
}

async function main() {
  const { categories } = await readJson<{ categories: CleanedCategory[] }>("categories.cleaned.json");
  console.log(`Importing ${categories.length} categories...`);
  const result = await importCategories(categories);
  console.log(`Done: ${result.total} categories imported, ${result.failed.length} failed.`);
  printFailures(result.failed);
  if (result.failed.length > 0) process.exitCode = 1;
}

// Works whether tsx transpiles this file to CJS or runs it as ESM - `typeof`
// never throws on an undeclared identifier, unlike referencing it directly.
const isMain = typeof require !== "undefined" && require.main === module;
if (isMain) {
  main()
    .catch((err) => {
      console.error("Fatal error importing categories:", err);
      process.exitCode = 1;
    })
    .finally(async () => {
      await mongoose.disconnect();
    });
}
