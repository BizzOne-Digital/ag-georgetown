import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { OUTPUT_DIR, readJson, writeJson } from "../normalize/lib.mjs";

const REPORTS_DIR = path.join(OUTPUT_DIR, "reports");
const UNCATEGORIZED_SLUG = "uncategorized";

// Renames every duplicate slug (after the first, lowest-id occurrence) to
// `<slug>-2`, `<slug>-3`, ... - checked against every slug in play so a
// generated name can never collide with an existing or another new one.
function dedupeProductSlugs(products) {
  const usedSlugs = new Set(products.map((p) => p.slug));
  const bySlug = new Map();
  for (const p of products) {
    if (!bySlug.has(p.slug)) bySlug.set(p.slug, []);
    bySlug.get(p.slug).push(p);
  }

  const renames = [];
  for (const [slug, group] of bySlug) {
    if (group.length < 2) continue;
    const sorted = [...group].sort((a, b) => a.id - b.id);
    for (let i = 1; i < sorted.length; i += 1) {
      const product = sorted[i];
      let suffix = 2;
      let candidate = `${slug}-${suffix}`;
      while (usedSlugs.has(candidate)) {
        suffix += 1;
        candidate = `${slug}-${suffix}`;
      }
      usedSlugs.add(candidate);
      renames.push({ id: product.id, title: product.title, oldSlug: product.slug, newSlug: candidate });
      product.slug = candidate;
    }
  }
  return renames;
}

// Anything with no category, or a category slug that doesn't actually exist
// in categories.json, gets routed to the synthetic "Uncategorized" bucket.
// This never touches id/images/price/stock - only the `category` field.
function reassignMissingCategories(products, categorySlugSet) {
  const reassignments = [];
  for (const p of products) {
    const hasValidCategory = p.category && p.category !== UNCATEGORIZED_SLUG && categorySlugSet.has(p.category);
    if (hasValidCategory) continue;

    const wasDangling = p.category && p.category !== UNCATEGORIZED_SLUG && !categorySlugSet.has(p.category);
    const alreadyUncategorized = !p.category || p.category === UNCATEGORIZED_SLUG;

    reassignments.push({
      id: p.id,
      title: p.title,
      oldCategory: p.category ?? null,
      newCategory: UNCATEGORIZED_SLUG,
      reason: wasDangling
        ? "category referenced a slug with no matching entry in categories.json"
        : alreadyUncategorized
          ? "no product_type/tag matched a known category - confirmed fallback"
          : "unknown",
    });
    p.category = UNCATEGORIZED_SLUG;
  }
  return reassignments;
}

function ensureUncategorizedCategory(categories, productCount) {
  const existing = categories.find((c) => c.slug === UNCATEGORIZED_SLUG);
  if (existing) {
    const oldCount = existing.productCount;
    existing.productCount = productCount;
    existing.isFallback = true;
    return { created: false, updated: oldCount !== productCount, productCount, wasRealShopifyCollection: !existing.isVirtual };
  }

  categories.push({
    id: null,
    slug: UNCATEGORIZED_SLUG,
    title: "Uncategorized",
    description: "Fallback category for products that could not be automatically matched to a known Shopify collection.",
    parentSlug: null,
    productCount,
    isVirtual: true,
    isOrphan: false,
    isFallback: true,
  });
  return { created: true, updated: false, productCount };
}

async function main() {
  const productsFile = await readJson(path.join(OUTPUT_DIR, "products.json"));
  const categoriesFile = await readJson(path.join(OUTPUT_DIR, "categories.json"));
  const navigationFile = await readJson(path.join(OUTPUT_DIR, "navigation.json"));

  let validationReport = null;
  try {
    validationReport = await readJson(path.join(REPORTS_DIR, "validation-report.json"));
  } catch {
    console.warn("[cleanup] data/reports/validation-report.json not found - run `npm run validate` first for a report-driven run. Proceeding by re-checking the data directly.");
  }

  // Work on deep clones - originals are never touched.
  const products = JSON.parse(JSON.stringify(productsFile.products));
  const categories = JSON.parse(JSON.stringify(categoriesFile.categories));
  const navigation = JSON.parse(JSON.stringify(navigationFile.items));

  // --- Fix 1: unique slugs ---
  const slugRenames = dedupeProductSlugs(products);

  // --- Fix 2: uncategorized / dangling category references ---
  const categorySlugSetBeforeFix = new Set(categories.map((c) => c.slug));
  const categoryReassignments = reassignMissingCategories(products, categorySlugSetBeforeFix);
  const uncategorizedCount = products.filter((p) => p.category === UNCATEGORIZED_SLUG).length;
  const uncategorizedCategoryResult = ensureUncategorizedCategory(categories, uncategorizedCount);

  // --- Not auto-fixed: things that would require fabricating content or a
  // judgment call this script isn't allowed to make on its own ---
  const skipped = [];
  const duplicateProductsCheck = validationReport?.checks.find((c) => c.id === "duplicate-products");
  if (duplicateProductsCheck && duplicateProductsCheck.count > 0) {
    skipped.push({
      check: "duplicate-products",
      count: duplicateProductsCheck.count,
      reason: "Choosing which duplicate record to keep is a merchandising decision, not a safe automatic fix.",
    });
  }
  for (const checkId of ["products-without-images", "products-without-description"]) {
    const check = validationReport?.checks.find((c) => c.id === checkId);
    if (check && check.count > 0) {
      skipped.push({
        check: checkId,
        count: check.count,
        reason: "Fixing this would mean fabricating an image or description that doesn't exist in the source data.",
      });
    }
  }
  const manualMappingCheck = validationReport?.checks.find((c) => c.id === "categories-needing-manual-mapping");
  if (manualMappingCheck && manualMappingCheck.count > 0) {
    skipped.push({
      check: "categories-needing-manual-mapping",
      count: manualMappingCheck.count,
      reason: "Taxonomy placement (merge, keep, or drop) requires human judgment, not an automatic fix.",
    });
  }

  // Navigation needs no structural changes here - real collection handles
  // and page slugs are untouched by the fixes above - but is re-emitted as
  // its own "cleaned" artifact for a consistent, independently-importable set.
  const navigationChanges = [];

  const now = new Date().toISOString();

  await writeJson(path.join(OUTPUT_DIR, "products.cleaned.json"), {
    generatedAt: now,
    source: "data/products.json + data/reports/validation-report.json",
    totalProducts: products.length,
    slugsRenamed: slugRenames.length,
    categoriesReassigned: categoryReassignments.length,
    products,
  });

  await writeJson(path.join(OUTPUT_DIR, "categories.cleaned.json"), {
    generatedAt: now,
    source: "data/categories.json",
    totalCategories: categories.length,
    fallbackCategoryCreated: uncategorizedCategoryResult.created,
    categories,
  });

  await writeJson(path.join(OUTPUT_DIR, "navigation.cleaned.json"), {
    generatedAt: now,
    source: "data/navigation.json",
    totalItems: navigation.length,
    changesApplied: navigationChanges.length,
    items: navigation,
  });

  const report = {
    generatedAt: now,
    basedOnValidationReport: validationReport ? "data/reports/validation-report.json" : null,
    rulesApplied: [
      "Generate unique slugs if duplicates exist.",
      "Assign uncategorized/dangling-category products to an 'Uncategorized' category.",
      "Preserve original Shopify product IDs.",
      "Preserve original image URLs.",
      "Do not fabricate prices.",
      "Do not fabricate stock quantities.",
    ],
    summary: {
      slugsRenamed: slugRenames.length,
      productsReassignedToCategory: categoryReassignments.length,
      uncategorizedCategoryCreated: uncategorizedCategoryResult.created,
      uncategorizedCategoryWasRealShopifyCollection: uncategorizedCategoryResult.wasRealShopifyCollection ?? false,
      uncategorizedCategoryProductCount: uncategorizedCategoryResult.productCount,
      navigationChanges: navigationChanges.length,
      issuesNotAutoFixed: skipped.reduce((sum, s) => sum + s.count, 0),
    },
    changes: {
      slugRenames,
      categoryReassignments,
      categoryAdditions: uncategorizedCategoryResult.created
        ? [{ slug: UNCATEGORIZED_SLUG, title: "Uncategorized", productCount: uncategorizedCategoryResult.productCount }]
        : [],
      navigationChanges,
    },
    notAutoFixed: skipped,
    guarantees: {
      productIdsPreserved: true,
      imageUrlsPreserved: true,
      pricesFabricated: false,
      stockFabricated: false,
    },
  };

  await writeJson(path.join(REPORTS_DIR, "cleanup-report.json"), report);
  await fs.writeFile(path.join(REPORTS_DIR, "cleanup-report.md"), buildMarkdown(report), "utf8");

  console.log("=== Cleanup Summary ===");
  console.log(`Slugs renamed:                 ${report.summary.slugsRenamed}`);
  console.log(`Products reassigned to category: ${report.summary.productsReassignedToCategory}`);
  console.log(`"Uncategorized" category created: ${report.summary.uncategorizedCategoryCreated} (now ${report.summary.uncategorizedCategoryProductCount} product(s))`);
  console.log(`Issues left for manual review:  ${report.summary.issuesNotAutoFixed}`);
  console.log("\nProduct IDs, image URLs, prices, and stock were not modified or fabricated.");
  console.log("\nOutput: data/products.cleaned.json, data/categories.cleaned.json, data/navigation.cleaned.json");
  console.log("Report: data/reports/cleanup-report.json, data/reports/cleanup-report.md");

  return report;
}

function buildMarkdown(report) {
  const lines = [];
  lines.push("# Cleanup Report", "");
  lines.push(`Generated: ${report.generatedAt}`, "");
  lines.push("## Rules applied", "");
  for (const rule of report.rulesApplied) lines.push(`- ${rule}`);
  lines.push("", "## Summary", "");
  lines.push(`- Slugs renamed: ${report.summary.slugsRenamed}`);
  lines.push(`- Products reassigned to a category: ${report.summary.productsReassignedToCategory}`);
  const uncategorizedNote = report.summary.uncategorizedCategoryCreated
    ? "created"
    : report.summary.uncategorizedCategoryWasRealShopifyCollection
      ? "already existed as a real (previously unlinked) Shopify collection - reused instead of duplicating"
      : "already existed";
  lines.push(`- "Uncategorized" category: ${uncategorizedNote} (${report.summary.uncategorizedCategoryProductCount} product(s))`);
  lines.push(`- Issues left for manual review: ${report.summary.issuesNotAutoFixed}`, "");

  lines.push("## Slug renames", "");
  if (report.changes.slugRenames.length === 0) {
    lines.push("None - no duplicate slugs were found.");
  } else {
    for (const r of report.changes.slugRenames) {
      lines.push(`- id ${r.id} "${r.title}": \`${r.oldSlug}\` -> \`${r.newSlug}\``);
    }
  }

  lines.push("", "## Category reassignments", "");
  if (report.changes.categoryReassignments.length === 0) {
    lines.push("None - every product already referenced a valid category.");
  } else {
    for (const r of report.changes.categoryReassignments) {
      lines.push(`- id ${r.id} "${r.title}": \`${r.oldCategory ?? "(none)"}\` -> \`${r.newCategory}\` (${r.reason})`);
    }
  }

  lines.push("", "## Category additions", "");
  if (report.changes.categoryAdditions.length === 0) {
    lines.push("None.");
  } else {
    for (const c of report.changes.categoryAdditions) {
      lines.push(`- \`${c.slug}\` ("${c.title}") - ${c.productCount} product(s)`);
    }
  }

  lines.push("", "## Not auto-fixed (needs manual review)", "");
  if (report.notAutoFixed.length === 0) {
    lines.push("None.");
  } else {
    for (const s of report.notAutoFixed) {
      lines.push(`- **${s.check}** (${s.count}): ${s.reason}`);
    }
  }

  lines.push("", "## Guarantees", "");
  lines.push(`- Product IDs preserved: ${report.guarantees.productIdsPreserved}`);
  lines.push(`- Image URLs preserved: ${report.guarantees.imageUrlsPreserved}`);
  lines.push(`- Prices fabricated: ${report.guarantees.pricesFabricated}`);
  lines.push(`- Stock quantities fabricated: ${report.guarantees.stockFabricated}`);

  return `${lines.join("\n")}\n`;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((err) => {
    console.error("Fatal error during cleanup:", err);
    process.exitCode = 1;
  });
}
