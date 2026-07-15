import type { Types } from "mongoose";
import { connectToDatabase } from "@/lib/db/connect";
import { Category } from "@/lib/models/Category";
import { Product, type IProduct, type IProductImage, type IProductVariant } from "@/lib/models/Product";
import { classifyProductType, isInStock } from "@/lib/catalog/classify";
import { buildFacets } from "@/lib/catalog/facets";
import { isOnSale } from "@/lib/catalog/pricing";
import { sortProducts } from "@/lib/catalog/sort";
import { DEFAULT_PAGE_SIZE, type AnnotatedProduct, type CatalogFilters } from "@/lib/catalog/types";
import { getDescendantCategoryScope } from "./category.repository";

export interface ListProductsOptions {
  categorySlug?: string;
  page?: number;
  limit?: number;
}

export async function listProducts({ categorySlug, page = 1, limit = 24 }: ListProductsOptions = {}) {
  await connectToDatabase();

  const filter: Record<string, unknown> = { isActive: true };
  if (categorySlug) {
    const category = await Category.findOne({ slug: categorySlug }).lean<{ _id: Types.ObjectId } | null>();
    if (!category) return { products: [] as IProduct[], total: 0 };
    filter.category = category._id;
  }

  const [products, total] = await Promise.all([
    Product.find(filter)
      .sort({ title: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean<IProduct[]>(),
    Product.countDocuments(filter),
  ]);

  return { products, total };
}

export type ProductWithCategory = Omit<IProduct, "category"> & {
  category: { _id: Types.ObjectId; slug: string; title: string };
};

export async function getProductBySlug(slug: string) {
  await connectToDatabase();
  return Product.findOne({ slug })
    .populate("category", "slug title")
    .lean<ProductWithCategory | null>();
}

export async function getProductByShopifyId(shopifyId: number) {
  await connectToDatabase();
  return Product.findOne({ shopifyId }).lean<IProduct | null>();
}

// Base product fields only - deliberately doesn't touch `images`/`variants`
// so this can run before or after those two import steps without clobbering
// whichever one already ran.
export type ProductBaseInput = Omit<IProduct, "_id" | "images" | "variants" | "createdAt" | "updatedAt">;

export async function upsertProductBase(data: ProductBaseInput) {
  await connectToDatabase();
  const { shopifyId, ...rest } = data;

  // Same sparse-unique-index caveat as Category.shopifyId (see
  // category.repository.ts): $unset, not $set: null, keeps the field
  // genuinely absent so multiple manually-added products (no Shopify id)
  // can coexist. Doesn't affect today's import - every scraped product has
  // a real shopifyId - but protects any future non-Shopify product.
  const setFields = shopifyId === null || shopifyId === undefined ? rest : { ...rest, shopifyId };
  const update: Record<string, unknown> = {
    $set: setFields,
    $setOnInsert: { images: [], variants: [] },
  };
  if (shopifyId === null || shopifyId === undefined) {
    update.$unset = { shopifyId: "" };
  }

  return Product.findOneAndUpdate({ slug: data.slug }, update, {
    upsert: true,
    new: true,
    setDefaultsOnInsert: true,
  });
}

// Replaces the whole images array - safe because nothing in the schema
// references an image by id, so there's no history to lose by replacing it.
export async function setProductImages(slug: string, images: IProductImage[]) {
  await connectToDatabase();
  return Product.updateOne({ slug }, { $set: { images } });
}

// Replaces the whole variants array. Unlike images, variant identity can
// matter later (an OrderItem may reference a variant's _id), but since this
// is the initial catalog import - before any orders exist - a full replace
// is safe. Once orders exist, prefer per-variant upserts by shopifyId instead.
export async function setProductVariants(slug: string, variants: IProductVariant[]) {
  await connectToDatabase();
  return Product.updateOne({ slug }, { $set: { variants } });
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export interface CatalogResult {
  products: AnnotatedProduct[];
  total: number;
  facets: ReturnType<typeof buildFacets>;
}

// Powers the /products catalog page. `types`/`availability`/price/brand
// filters all apply in memory rather than as a Mongo query - `productType`
// is a derived heuristic with no index behind it, and the collection is
// small enough (~500 products) that fetching the category-scoped set once
// and filtering/sorting in JS is simpler than a $facet aggregation, with no
// real performance cost at this scale.
export async function getCatalogData(filters: CatalogFilters): Promise<CatalogResult> {
  await connectToDatabase();

  const all = await Product.find({ isActive: true })
    .populate("category", "slug title")
    .lean<ProductWithCategory[]>();

  let scoped = all;
  if (filters.categorySlug) {
    const scope = await getDescendantCategoryScope(filters.categorySlug);
    if (scope.ids.length === 0) {
      return { products: [], total: 0, facets: buildFacets([]) };
    }
    const idSet = new Set(scope.ids.map(String));
    // A tag is rarely the category title verbatim - mascara products are
    // tagged "Lash Sensational Mascara", not just "Mascara" - so this checks
    // whether the title appears as a whole word/phrase inside the tag, not
    // just exact equality. Word boundaries (\b) matter here for the same
    // reason as the gender classifier: a short title like "Face" shouldn't
    // match on `Face` occurring mid-word, so this only matches when it's
    // bounded by non-word characters or the string edges.
    const titlePatterns = Array.from(scope.titles, (title) => new RegExp(`\\b${escapeRegExp(title)}\\b`, "i"));
    // A product only carries ONE category (whichever tag the import
    // heuristic matched first) even though its tags often correspond to
    // several other categories it was never linked to - ~80% of real
    // categories have zero directly-assigned products as a result. Matching
    // by tag text too (against this category and all its descendants) is
    // what makes most subcategory pages show anything at all.
    scoped = all.filter(
      (p) =>
        idSet.has(String(p.category._id)) ||
        p.tags.some((tag) => titlePatterns.some((pattern) => pattern.test(tag)))
    );
  }

  // Applied before facets/annotation (not alongside the later brand/type/price
  // narrowing below) so a page like Offers - which always sets this - shows
  // sidebar counts for the on-sale set only, not the whole catalog.
  if (filters.onSale) {
    scoped = scoped.filter((p) => isOnSale(p));
  }

  const annotated: AnnotatedProduct[] = scoped.map((p) => ({
    ...p,
    productType: classifyProductType(p.tags),
    inStock: isInStock(p),
  })) as AnnotatedProduct[];

  // Facets reflect the category+onSale scope only, not the other active
  // filters - see the comment on buildFacets for why.
  const facets = buildFacets(annotated);

  let filtered = annotated;
  if (filters.types && filters.types.length > 0) {
    filtered = filtered.filter((p) => filters.types!.includes(p.productType));
  }
  if (filters.availability && filters.availability.length === 1) {
    const wantInStock = filters.availability[0] === "in-stock";
    filtered = filtered.filter((p) => p.inStock === wantInStock);
  }
  if (filters.brands && filters.brands.length > 0) {
    filtered = filtered.filter((p) => p.vendor && filters.brands!.includes(p.vendor));
  }
  if (filters.minPrice !== undefined) {
    filtered = filtered.filter((p) => p.price !== null && p.price >= filters.minPrice!);
  }
  if (filters.maxPrice !== undefined) {
    filtered = filtered.filter((p) => p.price !== null && p.price <= filters.maxPrice!);
  }

  const sorted = sortProducts(filtered, filters.sort);
  const limit = filters.limit ?? DEFAULT_PAGE_SIZE;

  return { products: sorted.slice(0, limit), total: sorted.length, facets };
}

export async function getRelatedProducts(categoryId: Types.ObjectId | string, excludeProductId: Types.ObjectId | string, limit = 4) {
  await connectToDatabase();
  return Product.find({ category: categoryId, _id: { $ne: excludeProductId }, isActive: true })
    .limit(limit)
    .lean<IProduct[]>();
}

// No "featured" flag or order history exists (no orders have ever been
// placed), so "best seller"/"bundle" are inferred from real Shopify tag
// data rather than fabricated - confirmed present at import time (e.g.
// "Bestsellers", "Bestseller Fragrance", "Gift Sets", "Perfume Gift sets").
const BESTSELLER_TAG_RE = /bestseller/i;
const GIFT_SET_TAG_RE = /gift.?set/i;

async function findActiveByTagPattern(pattern: RegExp, limit: number): Promise<IProduct[]> {
  await connectToDatabase();
  // Mongo matches a regex against a string array field if ANY element
  // matches - no $elemMatch needed for a single condition like this.
  return Product.find({ isActive: true, tags: pattern })
    .limit(limit)
    .lean<IProduct[]>();
}

export async function getBestSellingProducts(limit = 12) {
  return findActiveByTagPattern(BESTSELLER_TAG_RE, limit);
}

export async function getBundleProducts(limit = 12) {
  return findActiveByTagPattern(GIFT_SET_TAG_RE, limit);
}

export interface VendorCount {
  vendor: string;
  count: number;
}

export async function getTopVendors(limit = 16): Promise<VendorCount[]> {
  await connectToDatabase();
  const rows = await Product.aggregate<{ _id: string; count: number }>([
    { $match: { isActive: true, vendor: { $ne: null } } },
    { $group: { _id: "$vendor", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: limit },
  ]);
  return rows.map((r) => ({ vendor: r._id, count: r.count }));
}

// By Mongo _id, not slug/shopifyId - the checkout route only has the id the
// client's cart line carries.
export async function getProductByIdRaw(productId: string) {
  await connectToDatabase();
  return Product.findById(productId).lean<IProduct | null>();
}

// Only decrements when stock is a known number (matches the schema's own
// "null = unknown, never fabricated" contract) AND only down to zero, never
// negative - the $gte guard makes an attempt to oversell a known-limited
// stock a no-op rather than producing a nonsense negative number.
export async function decrementVariantStock(productId: string, variantId: string, quantity: number) {
  await connectToDatabase();
  return Product.updateOne(
    { _id: productId, "variants._id": variantId, "variants.stock": { $ne: null, $gte: quantity } },
    { $inc: { "variants.$.stock": -quantity } }
  );
}

export async function decrementProductStock(productId: string, quantity: number) {
  await connectToDatabase();
  return Product.updateOne(
    { _id: productId, stock: { $ne: null, $gte: quantity } },
    { $inc: { stock: -quantity } }
  );
}

// Admin inventory view - no pagination (v1, ~500 products is fine as one page).
export async function listAllProductsForAdmin() {
  await connectToDatabase();
  return Product.find({})
    .sort({ title: 1 })
    .select("slug title price stock variants isActive")
    .lean<IProduct[]>();
}

// Only sets fields actually provided - a blank form input must never
// silently coerce to 0 and re-trigger the $0 "contact for pricing" state.
export async function updateProductPricing(productId: string, fields: { price?: number; stock?: number | null }) {
  await connectToDatabase();
  const set: Record<string, unknown> = {};
  if (fields.price !== undefined) set.price = fields.price;
  if (fields.stock !== undefined) set.stock = fields.stock;
  if (Object.keys(set).length === 0) return { matchedCount: 0, modifiedCount: 0 };
  return Product.updateOne({ _id: productId }, { $set: set });
}
