import { getOrderByNumber, markOrderPaid } from "@/lib/repositories/order.repository";
import { decrementProductStock, decrementVariantStock } from "@/lib/repositories/product.repository";

export interface FulfillResult {
  alreadyFulfilled: boolean;
}

// Shared by both the Stripe webhook (primary path) and the checkout-success
// page (fallback, since this sandbox has no way to run a real Stripe
// webhook end-to-end - see app/checkout/success/page.tsx). Safe to call
// from both, and safe to call more than once for the same order: the whole
// thing hinges on markOrderPaid's own idempotency (its filter requires
// status:"PENDING_PAYMENT"), which is MongoDB's normal single-document
// atomicity - whichever caller gets there first wins, the other's
// modifiedCount is 0 and the stock-decrement loop below never even runs a
// second time. No separate "already fulfilled" flag is needed.
export async function fulfillOrder(orderNumber: string, stripePaymentIntentId: string): Promise<FulfillResult> {
  const result = await markOrderPaid(orderNumber, stripePaymentIntentId);
  if (result.modifiedCount !== 1) {
    return { alreadyFulfilled: true };
  }

  const order = await getOrderByNumber(orderNumber);
  if (!order) {
    return { alreadyFulfilled: true };
  }

  for (const item of order.items) {
    if (!item.product) continue;
    if (item.variantId) {
      await decrementVariantStock(String(item.product), String(item.variantId), item.quantity);
    } else {
      await decrementProductStock(String(item.product), item.quantity);
    }
  }

  return { alreadyFulfilled: false };
}
