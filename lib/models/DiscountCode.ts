import { Schema, model, models, Types } from "mongoose";

export type DiscountType = "PERCENTAGE" | "FIXED_AMOUNT";
const DISCOUNT_TYPES: DiscountType[] = ["PERCENTAGE", "FIXED_AMOUNT"];

export interface IDiscountCode {
  _id: Types.ObjectId;
  code: string;
  type: DiscountType;
  value: number;
  isActive: boolean;
  startsAt: Date | null;
  endsAt: Date | null;
  usageLimit: number | null;
  usageCount: number;
  minimumSubtotal: number | null;
  // Optional link if the code is mirrored as a Stripe Coupon/Promotion Code for Stripe Checkout.
  stripeCouponId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const DiscountCodeSchema = new Schema<IDiscountCode>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    type: { type: String, enum: DISCOUNT_TYPES, required: true },
    value: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
    startsAt: { type: Date, default: null },
    endsAt: { type: Date, default: null },
    usageLimit: { type: Number, default: null },
    usageCount: { type: Number, default: 0 },
    minimumSubtotal: { type: Number, default: null },
    stripeCouponId: { type: String, default: null },
  },
  { timestamps: true }
);

export const DiscountCode = models.DiscountCode || model<IDiscountCode>("DiscountCode", DiscountCodeSchema);
