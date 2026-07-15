import path from "node:path";
import { pathToFileURL } from "node:url";
import { BASE_URL, DELAY_MS, OUTPUT_DIR, fetchJsonWithRetry, sleep, writeJson } from "./lib.mjs";

const PAGE_LIMIT = 250;

export async function scrapeProducts({ baseUrl = BASE_URL, delayMs = DELAY_MS, limit = PAGE_LIMIT } = {}) {
  const products = [];
  const failedPages = [];
  let page = 1;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const url = `${baseUrl}/products.json?limit=${limit}&page=${page}`;
    console.log(`[products] fetching page ${page}...`);
    const result = await fetchJsonWithRetry(url);

    if (!result.ok) {
      console.error(`[products] page ${page} failed after retries: ${result.error}`);
      failedPages.push({ page, url, error: result.error });
      break;
    }

    const pageProducts = result.data.products ?? [];
    if (pageProducts.length === 0) {
      console.log(`[products] page ${page} empty - reached end of catalog.`);
      break;
    }

    products.push(...pageProducts);
    console.log(`[products] page ${page}: +${pageProducts.length} (running total ${products.length})`);
    page += 1;
    await sleep(delayMs);
  }

  const output = {
    source: `${baseUrl}/products.json`,
    scrapedAt: new Date().toISOString(),
    totalProducts: products.length,
    failedPages,
    products,
  };

  await writeJson(path.join(OUTPUT_DIR, "products.json"), output);
  console.log(`[products] saved ${products.length} products to data/scraped/products.json`);

  return { total: products.length, failedPages };
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  scrapeProducts()
    .then((r) => console.log(`Done. ${r.total} products, ${r.failedPages.length} failed page(s).`))
    .catch((err) => {
      console.error("Fatal error scraping products:", err);
      process.exitCode = 1;
    });
}
