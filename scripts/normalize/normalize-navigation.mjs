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

// Mirrors the slug logic in normalize-categories.mjs so hrefs here line up
// exactly with the slugs in data/categories.json and data/pages.json.
export async function normalizeNavigation() {
  const navigationFile = await readJson(path.join(SCRAPED_DIR, "navigation.json"));
  const collectionsFile = await readJson(path.join(SCRAPED_DIR, "collections.json"));
  const realHandles = new Set(collectionsFile.collections.map((c) => c.handle));

  function transform(items, parentSlugPath) {
    return items.map((item) => {
      const collectionHandle = collectionHandleFromHref(item.href);
      const pageSlug = pageSlugFromHref(item.href);

      if (collectionHandle && realHandles.has(collectionHandle)) {
        return {
          label: item.label,
          type: "category",
          slug: collectionHandle,
          href: `/category/${collectionHandle}`,
          children: item.children?.length ? transform(item.children, [...parentSlugPath, collectionHandle]) : [],
        };
      }

      if (pageSlug) {
        return {
          label: item.label,
          type: "page",
          slug: pageSlug,
          href: `/pages/${pageSlug}`,
          children: [],
        };
      }

      const slug = buildVirtualSlug(item.label, parentSlugPath);
      return {
        label: item.label,
        type: "group",
        slug,
        href: null,
        children: item.children?.length ? transform(item.children, [...parentSlugPath, slug]) : [],
      };
    });
  }

  const items = transform(navigationFile.items, []);

  const output = {
    generatedAt: new Date().toISOString(),
    source: "data/scraped/navigation.json",
    totalItems: items.length,
    items,
  };

  await writeJson(path.join(OUTPUT_DIR, "navigation.json"), output);
  console.log(`[navigation] ${items.length} top-level nav item(s) normalized`);

  return { total: items.length };
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  normalizeNavigation().catch((err) => {
    console.error("Fatal error normalizing navigation:", err);
    process.exitCode = 1;
  });
}
