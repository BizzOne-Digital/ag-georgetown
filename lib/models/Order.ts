import { Schema, model, models, Types } from "mongoose";

export type OrderStatus = "PENDING_PAYMENT" | "PAID" | "FULFILLED" | "CANCELLED" | "REFUNDED";
const ORDER_STATUSES: OrderStatus[] = ["PENDING_PAYMENT", "PAID", "FULFILLED", "CANCELLED", "REFUNDED"];

// A line item snapshot - title/sku/price/image are copied at purchase time,
// not read live from Product, so editing or deleting a product later can
// never rewrite past order history. `product`/`variantId` are kept only for
// traceability (e.g. "show me this customer's other orders for this SKU").
export interface IOrderItem {
  _id: Types.ObjectId;
  product: Types.ObjectId | null;
  variantId: Types.ObjectId | null;
  title: string;
  variantTitle: string | null;
  sku: string | null;
  imageSrc: string | null;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

// A frozen copy of the shipping/billing address as of checkout - not a
// reference to Customer.addresses, for the same "never rewrite history" reason.
export interface IAddressSnapshot {
  firstName: string;
  lastName: string;
  company: string | null;
  line1: string;
  line2: string | null;
  city: string;
  region: string;
  postalCode: string;
  country: string;
  phone: string | null;
}

export interface IOrder {
  _id: Types.ObjectId;
  orderNumber: string;
  customer: Types.ObjectId;
  email: string;
  status: OrderStatus;
  subtotal: number;
  shippingTotal: number;
  taxTotal: number;
  discountTotal: number;
  total: number;
  currency: string;
  shippingAddress: IAddressSnapshot | null;
  billingAddress: IAddressSnapshot | null;
  discountCode: Types.ObjectId | null;
  // Set once Stripe Checkout is created / completes - used to reconcile webhooks.
  stripeCheckoutSessionId: string | null;
  stripePaymentIntentId: string | null;
  items: IOrderItem[];
  placedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AddressSnapshotSchema = new Schema<IAddressSnapshot>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    company: { type: String, default: null },
    line1: { type: String, required: true },
    line2: { type: String, default: null },
    city: { type: String, required: true },
    region: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, default: "CA" },
    phone: { type: String, default: null },
  },
  { _id: false }
);

const OrderItemSchema = new Schema<IOrderItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", default: null },
    variantId: { type: Schema.Types.ObjectId, default: null },
    title: { type: String, required: true },
    variantTitle: { type: String, default: null },
    sku: { type: String, default: null },
    imageSrc: { type: String, default: null },
    unitPrice: { type: Number, required: true },
    quantity: { type: Number, required: true },
    lineTotal: { type: Number, required: true },
  },
  { _id: true }
);

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true },
    customer: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
    email: { type: String, required: true },
    status: { type: String, enum: ORDER_STATUSES, default: "PENDING_PAYMENT" },
    subtotal: { type: Number, required: true },
    shippingTotal: { type: Number, default: 0 },
    taxTotal: { type: Number, default: 0 },
    discountTotal: { type: Number, default: 0 },
    total: { type: Number, required: true },
    currency: { type: String, default: "CAD" },
    shippingAddress: { type: AddressSnapshotSchema, default: null },
    billingAddress: { type: AddressSnapshotSchema, default: null },
    discountCode: { type: Schema.Types.ObjectId, ref: "DiscountCode", default: null },
    // No `default: null` on these two - the sparse unique indexes below
    // only exclude documents where the field is genuinely ABSENT, not ones
    // explicitly set to null (same gotcha as Category/Product.shopifyId and
    // Customer.authUserId). See createOrder in order.repository.ts, which
    // strips these keys entirely when null rather than inserting null.
    stripeCheckoutSessionId: { type: String },
    stripePaymentIntentId: { type: String },
    items: { type: [OrderItemSchema], default: [] },
    placedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

OrderSchema.index({ customer: 1 });
OrderSchema.index({ stripeCheckoutSessionId: 1 }, { unique: true, sparse: true });
OrderSchema.index({ stripePaymentIntentId: 1 }, { unique: true, sparse: true });

export const Order = models.Order || model<IOrder>("Order", OrderSchema);
