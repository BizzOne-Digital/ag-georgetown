import path from "node:path";
import { pathToFileURL } from "node:url";
import { OUTPUT_DIR, SCRAPED_DIR, pageSlugFromHref, readJson, writeJson } from "./lib.mjs";

// The homepage nav only reveals that these pages exist and what they're
// called there - it doesn't give us the page body. Content is left null so
// a follow-up fetch of each sourceUrl can fill it in before import.
function collectPageLinks(items, found) {
  for (const item of items) {
    const slug = pageSlugFromHref(item.href);
    if (slug && !found.has(slug)) {
      found.set(slug, { slug, title: item.label, sourceUrl: item.href });
    }
    if (item.children?.length) collectPageLinks(item.children, found);
  }
  return found;
}

export async function normalizePages() {
  const navigationFile = await readJson(path.join(SCRAPED_DIR, "navigation.json"));
  const found = collectPageLinks(navigationFile.items, new Map());

  const pages = Array.from(found.values()).map((p) => ({
    slug: p.slug,
    title: p.title,
    sourceUrl: p.sourceUrl,
    content: null,
  }));

  const output = {
    generatedAt: new Date().toISOString(),
    source: "data/scraped/navigation.json",
    note:
      "Only page references discovered via the nav menu are listed here. Page body content was not scraped - fetch each sourceUrl separately before import.",
    totalPages: pages.length,
    pages,
  };

  await writeJson(path.join(OUTPUT_DIR, "pages.json"), output);
  console.log(`[pages] ${pages.length} page reference(s) discovered from nav`);

  return { total: pages.length };
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  normalizePages().catch((err) => {
    console.error("Fatal error normalizing pages:", err);
    process.exitCode = 1;
  });
}
