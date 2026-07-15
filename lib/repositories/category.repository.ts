import type { Types } from "mongoose";
import { connectToDatabase } from "@/lib/db/connect";
import { Category, type ICategory } from "@/lib/models/Category";

export interface CategoryTreeNode extends ICategory {
  children: CategoryTreeNode[];
}

export async function listCategories() {
  await connectToDatabase();
  return Category.find().sort({ slug: 1 }).lean<ICategory[]>();
}

export async function getCategoryBySlug(slug: string) {
  await connectToDatabase();
  return Category.findOne({ slug }).lean<ICategory | null>();
}

// Builds the parent/child tree client code actually wants to render (e.g.
// for the nav menu or a category sidebar) out of the flat collection.
export async function getCategoryTree(): Promise<CategoryTreeNode[]> {
  const all = await listCategories();
  const byId = new Map<string, CategoryTreeNode>(all.map((c) => [String(c._id), { ...c, children: [] }]));
  const roots: CategoryTreeNode[] = [];

  for (const node of byId.values()) {
    if (node.parent) {
      const parent = byId.get(String(node.parent));
      if (parent) {
        parent.children.push(node);
        continue;
      }
    }
    roots.push(node);
  }

  return roots;
}

// The 6 real top-level groups the site nav is actually organized around.
// This can't be derived purely from "has children" - "Offers" legitimately
// has zero children today because its only child, "Clearance", is also
// reachable from Fragrance's "Popular" group and normalize-categories.mjs
// resolves that kind of cross-link to whichever parent it saw first (see
// data/categories.cleaned.json's crossLinkedCategories) - which happened to
// be Fragrance, not Offers. Naming the slugs explicitly is more robust than
// a heuristic that this exact case already breaks.
const MEGA_MENU_SLUGS = ["brands", "fragrance", "skincare", "cosmetics", "hair-care", "offers"];

export async function getMegaMenu(): Promise<CategoryTreeNode[]> {
  const tree = await getCategoryTree();
  const bySlug = new Map(tree.map((node) => [node.slug, node]));
  return MEGA_MENU_SLUGS.map((slug) => bySlug.get(slug)).filter((node): node is CategoryTreeNode => Boolean(node));
}

export interface CategoryScope {
  ids: Types.ObjectId[];
  // Lowercased/trimmed titles of the category and every descendant - see
  // getDescendantCategoryScope for why the catalog needs these too.
  titles: Set<string>;
}

// Selecting a category (e.g. "Fragrance", or a specific leaf like "Lip
// Balm") should surface products filed under any of its subcategories too -
// this walks the tree to collect every descendant id.
//
// It also collects titles because most products only carry ONE category
// assignment (whichever single tag the import heuristic matched first),
// even though their tags often correspond to several other categories they
// were never linked to - about 80% of the ~210 real categories end up with
// zero directly-assigned products as a result. The catalog query uses these
// titles to ALSO match a product by tag text against the category (and its
// descendants), not just by the one category it happens to be filed under -
// see getCatalogData in product.repository.ts.
export async function getDescendantCategoryScope(slug: string): Promise<CategoryScope> {
  await connectToDatabase();
  const all = await Category.find()
    .select("_id slug parent title")
    .lean<{ _id: Types.ObjectId; slug: string; parent: Types.ObjectId | null; title: string }[]>();

  const root = all.find((c) => c.slug === slug);
  if (!root) return { ids: [], titles: new Set() };

  const childrenByParent = new Map<string, typeof all>();
  for (const c of all) {
    if (!c.parent) continue;
    const key = String(c.parent);
    if (!childrenByParent.has(key)) childrenByParent.set(key, []);
    childrenByParent.get(key)!.push(c);
  }

  const ids: Types.ObjectId[] = [root._id];
  const titles = new Set<string>([root.title.trim().toLowerCase()]);
  const stack: Types.ObjectId[] = [root._id];

  while (stack.length > 0) {
    const current = stack.pop()!;
    const kids = childrenByParent.get(String(current)) ?? [];
    for (const kid of kids) {
      ids.push(kid._id);
      titles.add(kid.title.trim().toLowerCase());
      stack.push(kid._id);
    }
  }

  return { ids, titles };
}

// Keyed by slug, not shopifyId - virtual/fallback categories (e.g.
// "Uncategorized", "Brands") have no Shopify collection behind them, so
// shopifyId is null for several rows and can't be a safe upsert key.
export async function upsertCategoryBySlug(
  slug: string,
  data: Omit<ICategory, "_id" | "slug" | "parent" | "createdAt" | "updatedAt">
) {
  await connectToDatabase();
  const { shopifyId, ...rest } = data;

  // The sparse unique index on shopifyId only ignores documents where the
  // field is *absent* - a field explicitly set to `null` still counts as a
  // value, so every virtual category would collide on the same "null" slot.
  // $unset (rather than $set: null) keeps the field genuinely absent.
  const update: Record<string, unknown> =
    shopifyId === null || shopifyId === undefined
      ? { $set: { slug, ...rest }, $unset: { shopifyId: "" } }
      : { $set: { slug, ...rest, shopifyId } };

  return Category.findOneAndUpdate({ slug }, update, {
    upsert: true,
    new: true,
    setDefaultsOnInsert: true,
  });
}

// Second pass of the category import: wire up parent links once every
// slug in the file is guaranteed to already exist as a row (the source
// file is sorted alphabetically, so a child can appear before its parent).
export async function setCategoryParent(slug: string, parentId: string | null) {
  await connectToDatabase();
  return Category.updateOne({ slug }, { $set: { parent: parentId } });
}
