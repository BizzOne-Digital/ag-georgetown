import { Schema, model, models, Types } from "mongoose";

// Images and variants are always read together with their product and never
// queried independently across products, so they're embedded subdocuments
// rather than separate collections - the idiomatic MongoDB shape for a
// "belongs entirely to one parent" relationship, and it avoids a $lookup on
// every product page. Each subdocument still gets its own _id, so a
// variant can be referenced by id later (e.g. from an OrderItem).

export interface IProductImage {
  _id: Types.ObjectId;
  src: string;
  alt: string | null;
  width: number | null;
  height: number | null;
  position: number;
}

export interface IProductVariant {
  _id: Types.ObjectId;
  shopifyId: number;
  title: string;
  sku: string | null;
  price: number;
  compareAtPrice: number | null;
  options: string[];
  // null = unknown quantity (source never exposed real inventory counts),
  // 0 = confirmed unavailable. Never fabricated.
  stock: number | null;
  available: boolean;
  grams: number | null;
}

export interface IProduct {
  _id: Types.ObjectId;
  shopifyId: number | null;
  slug: string;
  title: string;
  description: string;
  vendor: string | null;
  tags: string[];
  // Denormalized "display" price/sku for listing pages - the authoritative
  // per-variant data lives in `variants`.
  price: number | null;
  compareAtPrice: number | null;
  sku: string | null;
  stock: number | null;
  isActive: boolean;
  category: Types.ObjectId;
  images: IProductImage[];
  variants: IProductVariant[];
  createdAt: Date;
  updatedAt: Date;
}

const ProductImageSchema = new Schema<IProductImage>(
  {
    src: { type: String, required: true },
    alt: { type: String, default: null },
    width: { type: Number, default: null },
    height: { type: Number, default: null },
    position: { type: Number, default: 0 },
  },
  { _id: true }
);

const ProductVariantSchema = new Schema<IProductVariant>(
  {
    shopifyId: { type: Number, required: true },
    title: { type: String, required: true },
    sku: { type: String, default: null },
    price: { type: Number, required: true },
    compareAtPrice: { type: Number, default: null },
    options: { type: [String], default: [] },
    stock: { type: Number, default: null },
    available: { type: Boolean, default: true },
    grams: { type: Number, default: null },
  },
  { _id: true }
);

const ProductSchema = new Schema<IProduct>(
  {
    shopifyId: { type: Number, default: null },
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    vendor: { type: String, default: null },
    tags: { type: [String], default: [] },
    price: { type: Number, default: null },
    compareAtPrice: { type: Number, default: null },
    sku: { type: String, default: null },
    stock: { type: Number, default: null },
    isActive: { type: Boolean, default: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    images: { type: [ProductImageSchema], default: [] },
    variants: { type: [ProductVariantSchema], default: [] },
  },
  { timestamps: true }
);

ProductSchema.index({ shopifyId: 1 }, { unique: true, sparse: true });
ProductSchema.index({ category: 1 });
// Unique across the whole collection, not just within one product's array -
// this is what lets variant upserts use shopifyId as a stable natural key.
ProductSchema.index({ "variants.shopifyId": 1 }, { unique: true, sparse: true });

export const Product = models.Product || model<IProduct>("Product", ProductSchema);
