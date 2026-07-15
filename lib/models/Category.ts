import { Schema, model, models, Types } from "mongoose";

export interface ICategory {
  _id: Types.ObjectId;
  shopifyId: number | null;
  slug: string;
  title: string;
  description: string;
  // Not a real Shopify collection - a UI-only grouping node (e.g. "Brands", "Popular").
  isVirtual: boolean;
  // Marks the catch-all bucket for products that couldn't be auto-categorized.
  isFallback: boolean;
  productCount: number;
  parent: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    shopifyId: { type: Number, default: null },
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    isVirtual: { type: Boolean, default: false },
    isFallback: { type: Boolean, default: false },
    productCount: { type: Number, default: 0 },
    parent: { type: Schema.Types.ObjectId, ref: "Category", default: null },
  },
  { timestamps: true }
);

CategorySchema.index({ shopifyId: 1 }, { unique: true, sparse: true });
CategorySchema.index({ parent: 1 });

// models.Category reuses the compiled model across Next.js hot-reloads -
// redefining it on every reload throws "Cannot overwrite model once compiled".
export const Category = models.Category || model<ICategory>("Category", CategorySchema);
