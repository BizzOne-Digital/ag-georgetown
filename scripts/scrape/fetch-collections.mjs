import path from "node:path";
import { pathToFileURL } from "node:url";
import { BASE_URL, DELAY_MS, OUTPUT_DIR, fetchJsonWithRetry, sleep, writeJson } from "./lib.mjs";

const PAGE_LIMIT = 250;

export async function scrapeCollections({ baseUrl = BASE_URL, delayMs = DELAY_MS, limit = PAGE_LIMIT } = {}) {
  const collections = [];
  const failedPages = [];
  let page = 1;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const url = `${baseUrl}/collections.json?limit=${limit}&page=${page}`;
    console.log(`[collections] fetching page ${page}...`);
    const result = await fetchJsonWithRetry(url);

    if (!result.ok) {
      console.error(`[collections] page ${page} failed after retries: ${result.error}`);
      failedPages.push({ page, url, error: result.error });
      break;
    }

    const pageCollections = result.data.collections ?? [];
    if (pageCollections.length === 0) {
      console.log(`[collections] page ${page} empty - reached end of list.`);
      break;
    }

    collections.push(...pageCollections);
    console.log(`[collections] page ${page}: +${pageCollections.length} (running total ${collections.length})`);
    page += 1;
    await sleep(delayMs);
  }

  const output = {
    source: `${baseUrl}/collections.json`,
    scrapedAt: new Date().toISOString(),
    totalCollections: collections.length,
    failedPages,
    collections,
  };

  await writeJson(path.join(OUTPUT_DIR, "collections.json"), output);
  console.log(`[collections] saved ${collections.length} collections to data/scraped/collections.json`);

  return { total: collections.length, failedPages };
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  scrapeCollections()
    .then((r) => console.log(`Done. ${r.total} collections, ${r.failedPages.length} failed page(s).`))
    .catch((err) => {
      console.error("Fatal error scraping collections:", err);
      process.exitCode = 1;
    });
}
