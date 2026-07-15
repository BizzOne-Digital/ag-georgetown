import Stripe from "stripe";

declare global {
  // eslint-disable-next-line no-var
  var _stripeClient: Stripe | undefined;
}

function createClient(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not set. Add it to .env.local before creating a Checkout Session.");
  }
  // `Stripe.DEFAULT_API_VERSION` exists at runtime (confirmed against the
  // installed stripe@22.3.1) but isn't in its TS types, so it can't be
  // referenced directly without an `any` cast. Pinning the exact value
  // instead - if `stripe` is ever upgraded, bump this to match the new
  // version's default deliberately, rather than silently drifting.
  return new Stripe(key, { apiVersion: "2026-06-24.dahlia", typescript: true });
}

// Cached across Next.js hot-reloads/serverless invocations, mirroring
// lib/db/connect.ts's caching pattern in spirit.
export const stripe = global._stripeClient ?? (global._stripeClient = createClient());
