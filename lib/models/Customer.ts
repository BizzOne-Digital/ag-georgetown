import { Schema, model, models, Types } from "mongoose";

// A saved address book entry. Embedded on Customer (always accessed as
// "this customer's addresses") rather than a separate collection. Orders
// don't reference these by id - they keep their own frozen snapshot (see
// Order.ts) so editing or deleting a saved address can never rewrite history.
export interface IAddress {
  _id: Types.ObjectId;
  label: string | null;
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
  isDefault: boolean;
}

export interface ICustomer {
  _id: Types.ObjectId;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  // true until they set up an account (or link one) - lets guest checkout
  // and future customer accounts share the same Order/Address shape.
  isGuest: boolean;
  authUserId: string | null;
  addresses: IAddress[];
  createdAt: Date;
  updatedAt: Date;
}

const AddressSchema = new Schema<IAddress>(
  {
    label: { type: String, default: null },
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
    isDefault: { type: Boolean, default: false },
  },
  { _id: true }
);

const CustomerSchema = new Schema<ICustomer>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    firstName: { type: String, default: null },
    lastName: { type: String, default: null },
    phone: { type: String, default: null },
    isGuest: { type: Boolean, default: true },
    // No `default: null` - the sparse unique index below only excludes
    // documents where this field is genuinely ABSENT, not ones explicitly
    // set to null (same gotcha as Category/Product.shopifyId - see
    // lib/repositories/category.repository.ts). A schema default of null
    // would give every guest customer an explicit `authUserId: null`,
    // colliding on the sparse index the second one is ever created.
    authUserId: { type: String },
    addresses: { type: [AddressSchema], default: [] },
  },
  { timestamps: true }
);

CustomerSchema.index({ authUserId: 1 }, { unique: true, sparse: true });

export const Customer = models.Customer || model<ICustomer>("Customer", CustomerSchema);
