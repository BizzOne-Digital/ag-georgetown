import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getStripe } from "@/lib/stripe";
import { fulfillOrder } from "@/lib/orders/fulfill";
import { getOrderByNumber } from "@/lib/repositories/order.repository";
import { formatPrice } from "@/components/catalog/price-tag";
import { Button } from "@/components/button";

export const metadata: Metadata = {
  title: "Order Confirmed | AG Liquidation Georgetown",
  robots: { index: false }, // this is a per-order page, never worth indexing
};

interface CheckoutSuccessPageProps {
  searchParams: { session_id?: string };
}

export default async function CheckoutSuccessPage({ searchParams }: CheckoutSuccessPageProps) {
  const sessionId = searchParams.session_id;
  if (!sessionId) notFound();

  // Constructed here, not at module scope - see lib/stripe.ts for why.
  const stripe = getStripe();
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  const orderNumber = session.metadata?.orderNumber ?? session.client_reference_id;
  if (!orderNumber) notFound();

  // Fallback fulfillment path: the webhook (app/api/webhooks/stripe) is the
  // primary path, but this sandbox has no way to run it end-to-end, so the
  // confirmation page must work correctly on its own too. Never trust the
  // mere presence of ?session_id= as proof of payment - re-check with
  // Stripe directly.
  if (session.payment_status === "paid" && session.payment_intent) {
    await fulfillOrder(orderNumber, session.payment_intent as string);
  }

  const order = await getOrderByNumber(orderNumber);
  if (!order) notFound();

  return (
    <div className="mx-auto max-w-2xl px-6 pb-24 pt-40 md:pt-48 lg:px-10">
      {order.status === "PAID" || order.status === "FULFILLED" ? (
        <>
          <h1 className="font-display text-h2 font-medium text-ink">Thank You!</h1>
          <p className="mt-4 font-body text-body text-ink/70">
            Your order <span className="font-medium text-ink">{order.orderNumber}</span> is confirmed. We&apos;ll have
            it ready for pickup at our Georgetown store.
          </p>
        </>
      ) : (
        <>
          <h1 className="font-display text-h2 font-medium text-ink">Order Received</h1>
          <p className="mt-4 font-body text-body text-ink/70">
            We&apos;re still confirming payment for order{" "}
            <span className="font-medium text-ink">{order.orderNumber}</span>. This page will update shortly - refresh
            in a moment.
          </p>
        </>
      )}

      <div className="mt-10 divide-y divide-ink/10 border-y border-ink/10">
        {order.items.map((item) => (
          <div key={String(item._id)} className="flex items-center justify-between gap-4 py-4">
            <div>
              <p className="font-body text-sm font-medium text-ink">{item.title}</p>
              {item.variantTitle && <p className="font-body text-xs text-ink/60">{item.variantTitle}</p>}
              <p className="font-body text-xs text-ink/50">Qty {item.quantity}</p>
            </div>
            <p className="font-body text-sm text-ink">{formatPrice(item.lineTotal)}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-end gap-4 font-body text-lg text-ink">
        <span className="text-ink/60">Total</span>
        <span className="font-medium">{formatPrice(order.total)}</span>
      </div>

      <Button href="/products" className="mt-10 inline-block">
        Continue Shopping
      </Button>
    </div>
  );
}
