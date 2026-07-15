import path from "node:path";
import { pathToFileURL } from "node:url";
import { OUTPUT_DIR, SCRAPED_DIR, readJson, toNumber, writeJson } from "./lib.mjs";

function pickRepresentativeVariant(variants) {
  if (!variants.length) return null;
  return variants.reduce((best, v) => {
    const price = toNumber(v.price) ?? Infinity;
    const bestPrice = toNumber(best.price) ?? Infinity;
    return price < bestPrice ? v : best;
  }, variants[0]);
}

function normalizeVariant(v) {
  const price = toNumber(v.price);
  const compareAtPrice = toNumber(v.compare_at_price);
  return {
    id: v.id,
    title: v.title,
    sku: v.sku || null,
    price,
    compareAtPrice: compareAtPrice !== null && price !== null && compareAtPrice > price ? compareAtPrice : null,
    available: Boolean(v.available),
    options: [v.option1, v.option2, v.option3].filter(Boolean),
    grams: v.grams ?? null,
  };
}

// Shopify's public storefront API exposes no product<->collection membership
// and no inventory quantities. Category is inferred best-effort from
// product_type first, then from tags matched against known category titles;
// anything that matches nothing falls back to "uncategorized".
function resolveCategory(product, categoryTitleToSlug) {
  const productType = (product.product_type || "").trim().toLowerCase();
  if (productType && categoryTitleToSlug.has(productType)) {
    return categoryTitleToSlug.get(productType);
  }
  for (const tag of product.tags || []) {
    const key = tag.trim().toLowerCase();
    if (categoryTitleToSlug.has(key)) return categoryTitleToSlug.get(key);
  }
  return "uncategorized";
}

// available=true still doesn't tell us *how many* are in stock, so we only
// commit to a hard number (0) when Shopify explicitly says unavailable.
function computeStock(variants) {
  if (!variants.length) return null;
  return variants.some((v) => v.available) ? null : 0;
}

export async function normalizeProducts() {
  const scraped = await readJson(path.join(SCRAPED_DIR, "products.json"));

  let categoriesFile = { categories: [] };
  try {
    categoriesFile = await readJson(path.join(OUTPUT_DIR, "categories.json"));
  } catch {
    console.warn("[products] data/categories.json not found - all products will be 'uncategorized'. Run normalize-categories first for better matching.");
  }

  const categoryTitleToSlug = new Map(categoriesFile.categories.map((c) => [c.title.trim().toLowerCase(), c.slug]));

  let uncategorizedCount = 0;
  const categoryUsage = new Map();

  const products = scraped.products.map((p) => {
    const rawVariants = p.variants || [];
    const variants = rawVariants.map(normalizeVariant);
    const representative = pickRepresentativeVariant(rawVariants);
    const price = representative ? toNumber(representative.price) : null;
    const rawCompareAt = representative ? toNumber(representative.compare_at_price) : null;
    const compareAtPrice = rawCompareAt !== null && price !== null && rawCompareAt > price ? rawCompareAt : null;

    const category = resolveCategory(p, categoryTitleToSlug);
    if (category === "uncategorized") uncategorizedCount += 1;
    categoryUsage.set(category, (categoryUsage.get(category) || 0) + 1);

    return {
      id: p.id,
      slug: p.handle,
      title: p.title,
      description: p.body_html || "",
      price,
      compareAtPrice,
      sku: representative?.sku || null,
      vendor: p.vendor || null,
      images: (p.images || []).map((img) => ({
        src: img.src,
        alt: img.alt || null,
        width: img.width ?? null,
        height: img.height ?? null,
      })),
      tags: p.tags || [],
      category,
      variants,
      stock: computeStock(rawVariants),
    };
  });

  const output = {
    generatedAt: new Date().toISOString(),
    source: "data/scraped/products.json",
    totalProducts: products.length,
    categorized: products.length - uncategorizedCount,
    uncategorized: uncategorizedCount,
    products,
  };

  await writeJson(path.join(OUTPUT_DIR, "products.json"), output);
  console.log(
    `[products] ${products.length} total - ${products.length - uncategorizedCount} categorized, ${uncategorizedCount} uncategorized`
  );

  return { total: products.length, uncategorized: uncategorizedCount, categoryUsage };
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  normalizeProducts().catch((err) => {
    console.error("Fatal error normalizing products:", err);
    process.exitCode = 1;
  });
}
