import { connectToDatabase } from "@/lib/db/connect";
import { Order, type IOrder } from "@/lib/models/Order";

export type CreateOrderInput = Omit<IOrder, "_id" | "createdAt" | "updatedAt">;

export async function createOrder(data: CreateOrderInput) {
  await connectToDatabase();
  const { stripeCheckoutSessionId, stripePaymentIntentId, ...rest } = data;

  // Same sparse-unique-index caveat fixed elsewhere in this project
  // (Category/Product.shopifyId, Customer.authUserId): a sparse index only
  // excludes a document where the field is genuinely ABSENT, not one
  // explicitly set to null. Every new order is created before its real
  // Stripe ids exist, so inserting `null` here would collide with the very
  // next order created the same way. Omitting the keys entirely (rather
  // than passing null) keeps them properly absent until
  // attachStripeSessionToOrder/markOrderPaid set the real value.
  const insertData: Record<string, unknown> = { ...rest };
  if (stripeCheckoutSessionId !== null && stripeCheckoutSessionId !== undefined) {
    insertData.stripeCheckoutSessionId = stripeCheckoutSessionId;
  }
  if (stripePaymentIntentId !== null && stripePaymentIntentId !== undefined) {
    insertData.stripePaymentIntentId = stripePaymentIntentId;
  }

  return Order.create(insertData);
}

export async function getOrderByNumber(orderNumber: string) {
  await connectToDatabase();
  return Order.findOne({ orderNumber }).lean<IOrder | null>();
}

export async function getOrderByStripeSessionId(stripeCheckoutSessionId: string) {
  await connectToDatabase();
  return Order.findOne({ stripeCheckoutSessionId }).lean<IOrder | null>();
}

export async function listOrdersForCustomer(customerId: string) {
  await connectToDatabase();
  return Order.find({ customer: customerId }).sort({ placedAt: -1 }).lean<IOrder[]>();
}

export async function updateOrderStatus(orderNumber: string, status: IOrder["status"], stripePaymentIntentId?: string) {
  await connectToDatabase();
  return Order.updateOne(
    { orderNumber },
    { $set: { status, ...(stripePaymentIntentId ? { stripePaymentIntentId } : {}) } }
  );
}

export async function attachStripeSessionToOrder(orderNumber: string, stripeCheckoutSessionId: string) {
  await connectToDatabase();
  return Order.updateOne({ orderNumber }, { $set: { stripeCheckoutSessionId } });
}

// Distinct from updateOrderStatus (generic, no guard) - this is specifically
// the payment-confirmation transition, and its idempotency contract matters:
// the filter only matches a PENDING_PAYMENT order, so calling this twice for
// the same order (webhook + success-page fallback racing) has the second
// call match zero documents (modifiedCount: 0) rather than re-applying side
// effects (stock decrement) twice. It also can't be used to accidentally
// resurrect a CANCELLED/REFUNDED order back to PAID.
export async function markOrderPaid(orderNumber: string, stripePaymentIntentId: string) {
  await connectToDatabase();
  return Order.updateOne(
    { orderNumber, status: "PENDING_PAYMENT" },
    { $set: { status: "PAID", stripePaymentIntentId } }
  );
}

export async function listAllOrders() {
  await connectToDatabase();
  return Order.find({}).sort({ placedAt: -1 }).lean<IOrder[]>();
}
