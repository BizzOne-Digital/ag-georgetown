import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { fulfillOrder } from "@/lib/orders/fulfill";
import type Stripe from "stripe";

// Primary fulfillment path (app/checkout/success/page.tsx is the fallback,
// since this sandbox has no way to run `stripe listen` end-to-end).
export async function POST(request: Request) {
  // Raw bytes, not request.json() - Stripe's signature check needs the
  // exact original body; re-serializing parsed JSON would break it.
  const rawBody = await request.text();
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderNumber = session.metadata?.orderNumber ?? session.client_reference_id;
    // checkout.session.completed can in principle fire before payment fully
    // clears for delayed payment methods - not expected for this card-only
    // setup, but the check costs nothing and matches the success page's own.
    if (orderNumber && session.payment_status === "paid" && session.payment_intent) {
      await fulfillOrder(orderNumber, session.payment_intent as string);
    }
  }

  return NextResponse.json({ received: true });
}
