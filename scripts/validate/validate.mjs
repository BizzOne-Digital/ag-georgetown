import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { OUTPUT_DIR, readJson, writeJson } from "../normalize/lib.mjs";

const REPORTS_DIR = path.join(OUTPUT_DIR, "reports");

function stripHtml(html) {
  return (html || "")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;|&amp;|&#39;|&quot;/g, " ")
    .trim();
}

function isValidUrl(value) {
  if (!value || typeof value !== "string") return false;
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

function findDuplicates(list, keyFn) {
  const seen = new Map();
  for (const item of list) {
    const key = keyFn(item);
    if (!seen.has(key)) seen.set(key, []);
    seen.get(key).push(item);
  }
  return Array.from(seen.entries()).filter(([, group]) => group.length > 1);
}

async function main() {
  const productsFile = await readJson(path.join(OUTPUT_DIR, "products.json"));
  const categoriesFile = await readJson(path.join(OUTPUT_DIR, "categories.json"));
  const navigationFile = await readJson(path.join(OUTPUT_DIR, "navigation.json"));
  const pagesFile = await readJson(path.join(OUTPUT_DIR, "pages.json"));

  const products = productsFile.products;
  const categories = categoriesFile.categories;
  const pages = pagesFile.pages;

  const categorySlugSet = new Set(categories.map((c) => c.slug));
  const pageSlugSet = new Set(pages.map((p) => p.slug));

  const checks = [];

  // 1. Duplicate products (same Shopify id appearing more than once)
  {
    const dupes = findDuplicates(products, (p) => p.id);
    checks.push({
      id: "duplicate-products",
      description: "Products sharing the same `id`.",
      severity: "error",
      count: dupes.length,
      items: dupes.map(([id, group]) => ({ id, count: group.length, slugs: group.map((p) => p.slug) })),
    });
  }

  // 2. Duplicate slugs (would collide on a /products/[slug] route)
  {
    const dupes = findDuplicates(products, (p) => p.slug);
    checks.push({
      id: "duplicate-slugs",
      description: "Products sharing the same `slug`.",
      severity: "error",
      count: dupes.length,
      items: dupes.map(([slug, group]) => ({ slug, count: group.length, ids: group.map((p) => p.id) })),
    });
  }

  // 3. Products without images
  {
    const items = products.filter((p) => !p.images || p.images.length === 0);
    checks.push({
      id: "products-without-images",
      description: "Products with an empty `images` array.",
      severity: "warning",
      count: items.length,
      items: items.map((p) => ({ id: p.id, slug: p.slug, title: p.title })),
    });
  }

  // 4. Products without prices
  {
    const items = products.filter((p) => p.price === null || p.price === undefined);
    checks.push({
      id: "products-without-price",
      description: "Products where no variant returned a usable numeric price.",
      severity: "error",
      count: items.length,
      items: items.map((p) => ({ id: p.id, slug: p.slug, title: p.title })),
    });
  }

  // 5. Products without descriptions
  {
    const items = products.filter((p) => stripHtml(p.description).length === 0);
    checks.push({
      id: "products-without-description",
      description: "Products with an empty `description` once HTML tags are stripped.",
      severity: "warning",
      count: items.length,
      items: items.map((p) => ({ id: p.id, slug: p.slug, title: p.title })),
    });
  }

  // 6. Products without categories (fell back to "uncategorized")
  {
    const items = products.filter((p) => !p.category || p.category === "uncategorized");
    checks.push({
      id: "products-without-category",
      description: "Products that fell back to `uncategorized` - no product_type/tag matched a known category title.",
      severity: "warning",
      count: items.length,
      items: items.map((p) => ({ id: p.id, slug: p.slug, title: p.title, tags: p.tags })),
    });
  }

  // 6b. Referential integrity: category slugs that don't exist at all (would fail a DB foreign key)
  {
    const items = products.filter(
      (p) => p.category && p.category !== "uncategorized" && !categorySlugSet.has(p.category)
    );
    checks.push({
      id: "product-category-not-found",
      description: "Products whose `category` slug has no matching entry in categories.json.",
      severity: "error",
      count: items.length,
      items: items.map((p) => ({ id: p.id, slug: p.slug, category: p.category })),
    });
  }

  // 7. Categories without slugs
  {
    const items = categories.filter((c) => !c.slug || c.slug.trim() === "");
    checks.push({
      id: "categories-without-slug",
      description: "Categories missing a usable `slug`.",
      severity: "error",
      count: items.length,
      items: items.map((c) => ({ id: c.id, title: c.title })),
    });
  }

  // 8. Broken internal navigation links
  {
    const broken = [];
    function walk(items, trail) {
      for (const item of items) {
        const trailPath = [...trail, item.label];
        if (item.type === "category" && !categorySlugSet.has(item.slug)) {
          broken.push({
            path: trailPath.join(" > "),
            type: item.type,
            slug: item.slug,
            href: item.href,
            reason: "category slug not found in categories.json",
          });
        } else if (item.type === "page" && !pageSlugSet.has(item.slug)) {
          broken.push({
            path: trailPath.join(" > "),
            type: item.type,
            slug: item.slug,
            href: item.href,
            reason: "page slug not found in pages.json",
          });
        } else if (item.href && /^https?:\/\//i.test(item.href)) {
          broken.push({
            path: trailPath.join(" > "),
            type: item.type,
            slug: item.slug,
            href: item.href,
            reason: "href was not rewritten to an internal path",
          });
        }
        if (item.children?.length) walk(item.children, trailPath);
      }
    }
    walk(navigationFile.items, []);
    checks.push({
      id: "broken-navigation-links",
      description: "Nav entries whose slug doesn't resolve to a known category/page, or whose href is still an external URL.",
      severity: "error",
      count: broken.length,
      items: broken,
    });
  }

  // 9. Invalid image URLs
  {
    const invalid = [];
    for (const p of products) {
      for (const img of p.images || []) {
        if (!isValidUrl(img.src)) {
          invalid.push({ id: p.id, slug: p.slug, src: img.src ?? null });
        }
      }
    }
    checks.push({
      id: "invalid-image-urls",
      description: "Product images whose `src` is missing or not a well-formed http(s) URL.",
      severity: "error",
      count: invalid.length,
      items: invalid,
    });
  }

  // 10. Categories that may need manual mapping before import
  {
    const items = [];
    for (const c of categories) {
      const reasons = [];
      if (c.isOrphan) reasons.push("not linked from the site navigation");
      if (c.isVirtual) reasons.push("UI-only grouping node, not a real Shopify collection");
      if (categoriesFile.crossLinkedCategories.includes(c.slug)) {
        reasons.push("reachable from multiple nav branches - current parent may be arbitrary");
      }
      if (c.productCount === 0) reasons.push("has zero products");
      if (reasons.length) items.push({ slug: c.slug, title: c.title, reasons });
    }
    checks.push({
      id: "categories-needing-manual-mapping",
      description: "Categories flagged for human review: unlinked from nav, UI-only groupings, cross-linked, or empty.",
      severity: "info",
      count: items.length,
      items,
    });
  }

  const bySeverity = { error: 0, warning: 0, info: 0 };
  for (const check of checks) bySeverity[check.severity] += check.count;
  const blockingChecks = checks.filter((c) => c.severity === "error" && c.count > 0);

  const report = {
    generatedAt: new Date().toISOString(),
    source: {
      products: "data/products.json",
      categories: "data/categories.json",
      navigation: "data/navigation.json",
      pages: "data/pages.json",
    },
    summary: {
      totalProducts: products.length,
      totalCategories: categories.length,
      totalPages: pages.length,
      bySeverity,
      readyForImport: blockingChecks.length === 0,
    },
    checks,
  };

  await writeJson(path.join(REPORTS_DIR, "validation-report.json"), report);
  await fs.writeFile(path.join(REPORTS_DIR, "validation-summary.md"), buildMarkdown(report), "utf8");

  console.log("=== Validation Summary ===");
  console.log(`Products: ${report.summary.totalProducts}  Categories: ${report.summary.totalCategories}  Pages: ${report.summary.totalPages}`);
  console.log(`Errors: ${bySeverity.error}  Warnings: ${bySeverity.warning}  Info: ${bySeverity.info}`);
  for (const check of checks) {
    console.log(`  [${check.severity}] ${check.id}: ${check.count}`);
  }
  console.log(report.summary.readyForImport ? "\nNo blocking errors found." : "\nBLOCKING ERRORS found - do not import yet.");
  console.log("\nNo data was modified. Reports written to data/reports/validation-report.json and data/reports/validation-summary.md");

  return report;
}

function formatItem(item) {
  const parts = [];
  if (item.slug) parts.push(`slug: ${item.slug}`);
  if (item.title) parts.push(`title: "${item.title}"`);
  if (item.id !== undefined) parts.push(`id: ${item.id}`);
  if (item.href) parts.push(`href: ${item.href}`);
  if (item.path) parts.push(`path: ${item.path}`);
  if (item.category) parts.push(`category: ${item.category}`);
  if (item.src !== undefined) parts.push(`src: ${item.src}`);
  if (item.reason) parts.push(`reason: ${item.reason}`);
  if (item.reasons) parts.push(`reasons: ${item.reasons.join("; ")}`);
  if (item.ids) parts.push(`ids: ${item.ids.join(", ")}`);
  if (item.slugs) parts.push(`slugs: ${item.slugs.join(", ")}`);
  if (item.tags) parts.push(`tags: ${item.tags.join(", ")}`);
  return parts.length ? parts.join(", ") : JSON.stringify(item);
}

function buildMarkdown(report) {
  const lines = [];
  lines.push("# Validation Report", "");
  lines.push(`Generated: ${report.generatedAt}`, "");
  lines.push("## Summary", "");
  lines.push(`- Products: ${report.summary.totalProducts}`);
  lines.push(`- Categories: ${report.summary.totalCategories}`);
  lines.push(`- Pages: ${report.summary.totalPages}`);
  lines.push(`- Errors: ${report.summary.bySeverity.error}`);
  lines.push(`- Warnings: ${report.summary.bySeverity.warning}`);
  lines.push(`- Info: ${report.summary.bySeverity.info}`, "");
  lines.push(
    report.summary.readyForImport
      ? "**Verdict: no blocking errors found. Structurally safe to import once warnings/info are reviewed.**"
      : "**Verdict: BLOCKING ERRORS found. Do not import until these are resolved.**"
  );
  lines.push("", "## Checks");

  for (const check of report.checks) {
    lines.push("", `### ${check.id} (${check.severity}) - ${check.count} found`, "");
    lines.push(check.description);
    if (check.count > 0) {
      lines.push("");
      const sample = check.items.slice(0, 10);
      for (const item of sample) lines.push(`- ${formatItem(item)}`);
      if (check.items.length > sample.length) {
        lines.push(`- ...and ${check.items.length - sample.length} more (see validation-report.json)`);
      }
    }
  }

  return `${lines.join("\n")}\n`;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((err) => {
    console.error("Fatal error during validation:", err);
    process.exitCode = 1;
  });
}
