import { NextResponse } from "next/server";
import { Types } from "mongoose";
import { getStripe } from "@/lib/stripe";
import { getProductByIdRaw } from "@/lib/repositories/product.repository";
import { findOrCreateGuestCustomer } from "@/lib/repositories/customer.repository";
import { createOrder, attachStripeSessionToOrder } from "@/lib/repositories/order.repository";
import { generateOrderNumber } from "@/lib/orders/order-number";
import { SITE_URL } from "@/lib/site";
import type { IOrderItem } from "@/lib/models/Order";

interface CheckoutLineInput {
  productId: string;
  variantId: string | null;
  quantity: number;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { email, lines } = body as { email?: string; lines?: CheckoutLineInput[] };

  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
  }
  if (!Array.isArray(lines) || lines.length === 0) {
    return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
  }

  // Re-fetch every line from MongoDB - never trust client-submitted
  // price/availability, same rule as everywhere else in this project that
  // touches price.
  const orderItems: IOrderItem[] = [];

  for (const line of lines) {
    const product = await getProductByIdRaw(line.productId);
    if (!product || !product.isActive) {
      return NextResponse.json({ error: "One of the items in your cart is no longer available." }, { status: 400 });
    }

    let unitPrice: number | null;
    let available: boolean;
    let stock: number | null;
    let variant: (typeof product.variants)[number] | undefined;

    if (line.variantId) {
      variant = product.variants.find((v) => String(v._id) === line.variantId);
      if (!variant) {
        return NextResponse.json({ error: `${product.title}: selected option is no longer available.` }, { status: 400 });
      }
      unitPrice = variant.price;
      available = variant.available;
      stock = variant.stock;
    } else {
      unitPrice = product.price;
      available = product.stock !== 0;
      stock = product.stock;
    }

    if (!available) {
      return NextResponse.json({ error: `${product.title} is out of stock.` }, { status: 400 });
    }
    // Safety fix: never let a $0/missing price through to Stripe - a
    // handful of products carry a genuine $0 price in the source data and
    // need a human to quote a real one.
    if (unitPrice === null || unitPrice === 0) {
      return NextResponse.json(
        { error: `${product.title} requires contact for pricing - please call or visit the store.` },
        { status: 400 }
      );
    }

    const quantity = Math.max(1, Math.floor(Number(line.quantity) || 1));
    if (stock !== null && quantity > stock) {
      return NextResponse.json({ error: `Only ${stock} of ${product.title} left in stock.` }, { status: 400 });
    }

    orderItems.push({
      _id: new Types.ObjectId(),
      product: product._id,
      variantId: variant ? variant._id : null,
      title: product.title,
      variantTitle: variant?.title ?? null,
      sku: variant?.sku ?? product.sku ?? null,
      imageSrc: product.images[0]?.src ?? null,
      unitPrice,
      quantity,
      lineTotal: unitPrice * quantity,
    });
  }

  const subtotal = orderItems.reduce((sum, item) => sum + item.lineTotal, 0);
  const customer = await findOrCreateGuestCustomer(email);

  // Order is created first (PENDING_PAYMENT), then the Stripe session
  // references its orderNumber - so the webhook/success-page fallback only
  // ever need a single lookup, never reconstructing cart contents from
  // Stripe metadata. An abandoned session still leaves an inspectable
  // PENDING_PAYMENT order instead of nothing.
  let order = null;
  let lastError: unknown;
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      order = await createOrder({
        orderNumber: generateOrderNumber(),
        customer: customer._id,
        email: customer.email,
        status: "PENDING_PAYMENT",
        subtotal,
        shippingTotal: 0,
        taxTotal: 0,
        discountTotal: 0,
        total: subtotal,
        currency: "CAD",
        shippingAddress: null,
        billingAddress: null,
        discountCode: null,
        stripeCheckoutSessionId: null,
        stripePaymentIntentId: null,
        items: orderItems,
        placedAt: new Date(),
      });
      break;
    } catch (err) {
      lastError = err;
      // Only retry the orderNumber collision case - anything else should surface.
      if ((err as { code?: number })?.code !== 11000) throw err;
    }
  }

  if (!order) {
    console.error("Could not create order after retries:", lastError);
    return NextResponse.json({ error: "Could not start checkout. Please try again." }, { status: 500 });
  }

  // Constructed here, not at module scope - see lib/stripe.ts for why
  // (Vercel's build step imports every route module regardless of whether
  // STRIPE_SECRET_KEY is configured in that environment yet).
  const stripe = getStripe();

  // Pickup-only for now - no shipping_address_collection.
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: orderItems.map((item) => ({
      price_data: {
        currency: "cad",
        unit_amount: Math.round(item.unitPrice * 100),
        product_data: {
          name: item.variantTitle ? `${item.title} - ${item.variantTitle}` : item.title,
          images: item.imageSrc ? [item.imageSrc] : undefined,
        },
      },
      quantity: item.quantity,
    })),
    client_reference_id: order.orderNumber,
    metadata: { orderNumber: order.orderNumber },
    customer_email: email,
    success_url: `${SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${SITE_URL}/cart`,
  });

  await attachStripeSessionToOrder(order.orderNumber, session.id);

  if (!session.url) {
    return NextResponse.json({ error: "Could not start checkout. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ url: session.url });
}
