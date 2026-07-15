import fs from "node:fs/promises";
import path from "node:path";

export const DATA_DIR = path.join(process.cwd(), "data");

export async function readJson<T>(filename: string): Promise<T> {
  const raw = await fs.readFile(path.join(DATA_DIR, filename), "utf8");
  return JSON.parse(raw) as T;
}

export interface CleanedCategory {
  id: number | null;
  slug: string;
  title: string;
  description: string;
  parentSlug: string | null;
  productCount: number;
  isVirtual: boolean;
  isOrphan?: boolean;
  isFallback?: boolean;
}

export interface CleanedImage {
  src: string;
  alt: string | null;
  width: number | null;
  height: number | null;
}

export interface CleanedVariant {
  id: number;
  title: string;
  sku: string | null;
  price: number | null;
  compareAtPrice: number | null;
  available: boolean;
  options: string[];
  grams: number | null;
}

export interface CleanedProduct {
  id: number;
  slug: string;
  title: string;
  description: string;
  price: number | null;
  compareAtPrice: number | null;
  sku: string | null;
  vendor: string | null;
  images: CleanedImage[];
  tags: string[];
  category: string;
  variants: CleanedVariant[];
  stock: number | null;
}

export interface NavItem {
  label: string;
  type: "category" | "page" | "group";
  slug: string | null;
  href: string | null;
  children?: NavItem[];
}

export interface FailedRecord {
  type: "category" | "product" | "variant" | "image";
  identifier: string;
  reason: string;
}

export function printFailures(failed: FailedRecord[]) {
  if (failed.length === 0) return;
  console.log(`  ${failed.length} failed record(s):`);
  for (const f of failed) console.log(`    - [${f.type}] ${f.identifier}: ${f.reason}`);
}
