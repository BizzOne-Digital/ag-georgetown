import fs from "node:fs/promises";
import path from "node:path";

export const BASE_URL = (process.env.SCRAPE_BASE_URL || "https://agcosmetics.ca").replace(/\/$/, "");
export const DELAY_MS = Number(process.env.SCRAPE_DELAY_MS || 400);
export const OUTPUT_DIR = path.join(process.cwd(), "data", "scraped");
export const USER_AGENT =
  "Mozilla/5.0 (compatible; AGLiquidationMigrationBot/1.0; data migration research)";

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function absoluteUrl(baseUrl, href) {
  try {
    return new URL(href, baseUrl).toString();
  } catch {
    return href;
  }
}

async function fetchWithRetry(url, { retries = 3, retryDelayMs = 1000, parse }) {
  let lastError;
  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status} ${res.statusText}`);
      }
      const data = await parse(res);
      return { ok: true, data };
    } catch (err) {
      lastError = err;
      console.warn(`  attempt ${attempt}/${retries} failed for ${url}: ${err.message}`);
      if (attempt < retries) await sleep(retryDelayMs * attempt);
    }
  }
  return { ok: false, error: lastError?.message ?? "unknown error" };
}

export function fetchJsonWithRetry(url, opts = {}) {
  return fetchWithRetry(url, { ...opts, parse: (res) => res.json() });
}

export function fetchTextWithRetry(url, opts = {}) {
  return fetchWithRetry(url, { ...opts, parse: (res) => res.text() });
}

export async function writeJson(filePath, data) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
}
