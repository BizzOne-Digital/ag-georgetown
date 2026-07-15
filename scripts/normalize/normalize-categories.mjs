import path from "node:path";
import { pathToFileURL } from "node:url";
import {
  OUTPUT_DIR,
  SCRAPED_DIR,
  buildVirtualSlug,
  collectionHandleFromHref,
  pageSlugFromHref,
  readJson,
  writeJson,
} from "./lib.mjs";

// Shopify's public API has no parent/child concept for collections - the
// hierarchy here is inferred entirely from where a collection link sits in
// the homepage nav tree (scraped in the previous step). Pure UI grouping
// labels with no href (e.g. "Popular", "Type", "Brands") become "virtual"
// categories so the tree stays navigable; they carry no products of their
// own, only a rolled-up count from their real descendants.
export async function normalizeCategories() {
  const collectionsFile = await readJson(path.join(SCRAPED_DIR, "collections.json"));
  const navigationFile = await readJson(path.join(SCRAPED_DIR, "navigation.json"));

  const collectionsByHandle = new Map(collectionsFile.collections.map((c) => [c.handle, c]));
  const categories = new Map();
  const crossLinked = new Set();

  function upsertReal(handle, parentSlug) {
    if (categories.has(handle)) {
      crossLinked.add(handle);
      return handle;
    }
    const source = collectionsByHandle.get(handle);
    categories.set(handle, {
      id: source.id,
      slug: handle,
      title: source.title,
      description: source.description || "",
      parentSlug: parentSlug ?? null,
      productCount: source.products_count ?? 0,
      isVirtual: false,
      isOrphan: false,
    });
    return handle;
  }

  function upsertVirtual(label, parentSlug, parentSlugPath) {
    const slug = buildVirtualSlug(label, parentSlugPath);
    if (!categories.has(slug)) {
      categories.set(slug, {
        id: null,
        slug,
        title: label,
        description: "",
        parentSlug: parentSlug ?? null,
        productCount: 0,
        productCountNote:
          "Sum of child category counts, not a deduplicated total - products in multiple overlapping child categories are counted once per child.",
        isVirtual: true,
        isOrphan: false,
      });
    }
    return slug;
  }

  function walk(items, parentSlug, parentSlugPath) {
    for (const item of items) {
      if (pageSlugFromHref(item.href)) continue; // pages are normalized separately, not categories

      const handle = collectionHandleFromHref(item.href);
      if (handle && collectionsByHandle.has(handle)) {
        const slug = upsertReal(handle, parentSlug);
        if (item.children?.length) walk(item.children, slug, [...parentSlugPath, slug]);
        continue;
      }

      if (item.children?.length || item.href === null) {
        const slug = upsertVirtual(item.label, parentSlug, parentSlugPath);
        if (item.children?.length) walk(item.children, slug, [...parentSlugPath, slug]);
      }
    }
  }

  walk(navigationFile.items, null, []);

  // Collections that exist on Shopify but aren't reachable from the nav menu
  // still need to exist so products can reference them - keep them as
  // unlinked, top-level categories and flag them.
  let orphanCount = 0;
  for (const c of collectionsFile.collections) {
    if (!categories.has(c.handle)) {
      categories.set(c.handle, {
        id: c.id,
        slug: c.handle,
        title: c.title,
        description: c.description || "",
        parentSlug: null,
        productCount: c.products_count ?? 0,
        isVirtual: false,
        isOrphan: true,
      });
      orphanCount += 1;
    }
  }

  const childrenBySlug = new Map();
  for (const cat of categories.values()) {
    if (cat.parentSlug) {
      if (!childrenBySlug.has(cat.parentSlug)) childrenBySlug.set(cat.parentSlug, []);
      childrenBySlug.get(cat.parentSlug).push(cat.slug);
    }
  }

  function rollupCount(slug) {
    const cat = categories.get(slug);
    if (!cat.isVirtual) return cat.productCount;
    const kids = childrenBySlug.get(slug) || [];
    cat.productCount = kids.reduce((sum, k) => sum + rollupCount(k), 0);
    return cat.productCount;
  }
  for (const cat of categories.values()) {
    if (cat.isVirtual) rollupCount(cat.slug);
  }

  const list = Array.from(categories.values()).sort((a, b) => a.slug.localeCompare(b.slug));

  const output = {
    generatedAt: new Date().toISOString(),
    source: "data/scraped/collections.json + data/scraped/navigation.json",
    totalCategories: list.length,
    realCategories: list.filter((c) => !c.isVirtual).length,
    virtualCategories: list.filter((c) => c.isVirtual).length,
    orphanCategories: orphanCount,
    crossLinkedCategories: Array.from(crossLinked),
    categories: list,
  };

  await writeJson(path.join(OUTPUT_DIR, "categories.json"), output);
  console.log(
    `[categories] ${list.length} total - ${output.realCategories} real, ${output.virtualCategories} group-only, ${orphanCount} unlinked from nav, ${crossLinked.size} cross-linked`
  );

  return {
    total: list.length,
    real: output.realCategories,
    virtual: output.virtualCategories,
    orphan: orphanCount,
    crossLinked: crossLinked.size,
  };
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  normalizeCategories().catch((err) => {
    console.error("Fatal error normalizing categories:", err);
    process.exitCode = 1;
  });
}
