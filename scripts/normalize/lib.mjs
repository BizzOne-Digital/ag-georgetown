import fs from "node:fs/promises";
import path from "node:path";

export const SCRAPED_DIR = path.join(process.cwd(), "data", "scraped");
export const OUTPUT_DIR = path.join(process.cwd(), "data");

export async function readJson(filePath) {
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw);
}

export async function writeJson(filePath, data) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
}

export function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Virtual (non-Shopify) nav nodes like "Popular" or "Type" aren't unique on
// their own - prefix with the parent path so e.g. "fragrance-popular" can't
// collide with a same-named group under a different branch.
export function buildVirtualSlug(label, parentSlugPath) {
  const base = slugify(label);
  return parentSlugPath.length ? `${parentSlugPath.join("-")}-${base}` : base;
}

export function collectionHandleFromHref(href) {
  if (!href) return null;
  const match = href.match(/\/collections\/([a-z0-9-]+)(?:$|[/?#])/i);
  return match ? match[1] : null;
}

export function pageSlugFromHref(href) {
  if (!href) return null;
  const match = href.match(/\/pages\/([a-z0-9-]+)/i);
  return match ? match[1] : null;
}

export function toNumber(value) {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}
